// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Allow requests from Next.js app (typically on localhost:3000)
app.use(express.json()); // To parse JSON request bodies

// --- API Endpoints ---

// 1. Add Doctor
app.post('/api/doctors/add', async (req, res) => {
  const {
    name,
    specialization = 'General Physician / Internal Medicine',
    experience_years,
    languages_spoken = [],
    gender,
    consultation_fee,
    availability_days = [],
    consultation_types = [],
    image_url = 'https://via.placeholder.com/80',
    next_available_slot = 'Tomorrow, 10:00 AM',
    rating = 4.5,
  } = req.body;

  if (!name || !experience_years || !gender || !consultation_fee) {
    return res.status(400).json({ message: 'Missing required fields: name, experience_years, gender, consultation_fee' });
  }

  // Basic profile slug generation (can be more sophisticated)
  const profile_slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);

  try {
    const queryText = `
      INSERT INTO doctors (name, specialization, experience_years, languages_spoken, gender, consultation_fee, availability_days, consultation_types, image_url, next_available_slot, rating, profile_slug)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    const values = [name, specialization, experience_years, languages_spoken, gender, consultation_fee, availability_days, consultation_types, image_url, next_available_slot, rating, profile_slug];
    const result = await db.query(queryText, values);
    res.status(201).json({ message: 'Doctor added successfully', doctor: result.rows[0] });
  } catch (error) {
    console.error('Error adding doctor:', error);
    if (error.code === '23505' && error.constraint === 'doctors_profile_slug_key') {
        return res.status(409).json({ message: 'Doctor with similar name (slug) already exists. Try a more unique name.' });
    }
    res.status(500).json({ message: 'Failed to add doctor', error: error.message });
  }
});

// 2. List Doctors with Filter & Pagination
app.get('/api/doctors', async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy, // e.g., 'experience_desc', 'fee_asc', 'rating_desc'
    gender, // 'Male', 'Female', 'Any'
    availability, // 'Today', 'Tomorrow', 'Next 7 days' (simplified - backend needs to handle this logic if more complex)
    consultationType, // 'Video', 'In-person'
    language, // 'English', 'Hindi', etc.
    minExperience,
    maxExperience,
    minFee,
    maxFee,
    specialization = 'General Physician / Internal Medicine' // Default filter
  } = req.query;

  const offset = (page - 1) * limit;
  let queryParams = [];
  let whereClauses = ["specialization = $1"];
  queryParams.push(specialization);

  let paramIndex = 2; // Start from $2

  if (gender && gender !== 'Any') {
    whereClauses.push(`gender = $${paramIndex++}`);
    queryParams.push(gender);
  }
  if (availability) { // Simplified: check if availability_days array contains the value
    whereClauses.push(`$${paramIndex++} = ANY(availability_days)`);
    queryParams.push(availability);
  }
  if (consultationType) {
    whereClauses.push(`$${paramIndex++} = ANY(consultation_types)`);
    queryParams.push(consultationType);
  }
  if (language) {
    whereClauses.push(`$${paramIndex++} = ANY(languages_spoken)`);
    queryParams.push(language);
  }
  if (minExperience) {
    whereClauses.push(`experience_years >= $${paramIndex++}`);
    queryParams.push(parseInt(minExperience));
  }
  if (maxExperience) {
    whereClauses.push(`experience_years <= $${paramIndex++}`);
    queryParams.push(parseInt(maxExperience));
  }
  if (minFee) {
    whereClauses.push(`consultation_fee >= $${paramIndex++}`);
    queryParams.push(parseInt(minFee));
  }
  if (maxFee) {
    whereClauses.push(`consultation_fee <= $${paramIndex++}`);
    queryParams.push(parseInt(maxFee));
  }

  let orderByClause = 'ORDER BY rating DESC, experience_years DESC'; // Default sort
  if (sortBy) {
    if (sortBy === 'experience_desc') orderByClause = 'ORDER BY experience_years DESC, rating DESC';
    else if (sortBy === 'experience_asc') orderByClause = 'ORDER BY experience_years ASC, rating DESC';
    else if (sortBy === 'fee_asc') orderByClause = 'ORDER BY consultation_fee ASC, rating DESC';
    else if (sortBy === 'fee_desc') orderByClause = 'ORDER BY consultation_fee DESC, rating DESC';
    else if (sortBy === 'rating_desc') orderByClause = 'ORDER BY rating DESC, experience_years DESC';
    // 'relevance' is tricky without more context/data, defaulting to rating & experience
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  try {
    // Query for doctors
    const doctorsQueryText = `
      SELECT * FROM doctors
      ${whereString}
      ${orderByClause}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++};
    `;
    const doctorsResult = await db.query(doctorsQueryText, [...queryParams, parseInt(limit), parseInt(offset)]);

    // Query for total count (for pagination)
    const countQueryText = `SELECT COUNT(*) FROM doctors ${whereString};`;
    const countResult = await db.query(countQueryText, queryParams.slice(0, whereClauses.length)); // Only use filter params for count
    const totalDoctors = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalDoctors / limit);

    res.json({
      doctors: doctorsResult.rows,
      currentPage: parseInt(page),
      totalPages,
      totalDoctors,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
  }
});


// --- Health Check ---
app.get('/', (req, res) => {
  res.send('Apollo Clone Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});