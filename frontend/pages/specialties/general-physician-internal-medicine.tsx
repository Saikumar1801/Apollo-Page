// frontend/pages/specialties/general-physician-internal-medicine.tsx
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Filters, { FilterState } from '@/components/Filters';
import DoctorList from '@/components/DoctorList';
import { Doctor } from '@/components/DoctorCard';
import Pagination from '@/components/Pagination';
import Seo from '@/components/Seo';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface DoctorsPageProps {
  initialDoctors: Doctor[];
  initialTotalPages: number;
  initialCurrentPage: number;
  initialTotalDoctors: number;
  uniqueLanguages: string[]; // For filter dropdown
}

interface DoctorApiResponse {
  doctors: Doctor[];
  currentPage: number;
  totalPages: number;
  totalDoctors: number;
}

const GeneralPhysicianPage: NextPage<DoctorsPageProps> = ({
  initialDoctors,
  initialTotalPages,
  initialCurrentPage,
  initialTotalDoctors,
  uniqueLanguages
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);
  const [totalDoctors, setTotalDoctors] = useState<number>(initialTotalDoctors);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'rating_desc',
    gender: 'Any',
    availability: '',
    consultationType: '',
    language: '',
    minExperience: '',
    maxExperience: '',
    minFee: '',
    maxFee: ''
  });

  const fetchDoctors = useCallback(async (page: number, currentFilters: FilterState) => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: '5', // Number of items per page
      specialization: 'General Physician / Internal Medicine'
    });

    if (currentFilters.sortBy) queryParams.append('sortBy', currentFilters.sortBy);
    if (currentFilters.gender && currentFilters.gender !== 'Any') queryParams.append('gender', currentFilters.gender);
    if (currentFilters.availability) queryParams.append('availability', currentFilters.availability);
    if (currentFilters.consultationType) queryParams.append('consultationType', currentFilters.consultationType);
    if (currentFilters.language) queryParams.append('language', currentFilters.language);
    if (currentFilters.minExperience) queryParams.append('minExperience', currentFilters.minExperience);
    if (currentFilters.maxExperience) queryParams.append('maxExperience', currentFilters.maxExperience);
    if (currentFilters.minFee) queryParams.append('minFee', currentFilters.minFee);
    if (currentFilters.maxFee) queryParams.append('maxFee', currentFilters.maxFee);

    try {
      const res = await fetch(`${API_BASE_URL}/doctors?${queryParams.toString()}`);

      // Log the response for better debugging
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error response:", errorData); // Log the detailed error
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const data: DoctorApiResponse = await res.json();
      setDoctors(data.doctors);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalDoctors(data.totalDoctors);
    } catch (e: any) {
      console.error("Failed to fetch doctors:", e); // Log the full error
      setError(e.message || 'Failed to load doctors.');
      setDoctors([]); // Clear doctors on error
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, relies on passed params

  useEffect(() => {
    // Fetch doctors when filters change, but reset to page 1
    fetchDoctors(1, filters);
  }, [filters, fetchDoctors]);

  const handleFilterChange = (filterName: keyof FilterState, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
    // The useEffect above will trigger fetchDoctors with page 1
  };

  const handlePageChange = (page: number) => {
    fetchDoctors(page, filters);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "General Physician / Internal Medicine Doctors",
    "description": "Find and book appointments with top General Physician / Internal Medicine doctors. View profiles, reviews, and fees.",
    "url": "https://www.apollo247.com/specialties/general-physician-internal-medicine",
    "mainEntity": {
      "@type": "ItemList",
      "name": "General Physician / Internal Medicine Doctors List",
      "itemListElement": doctors.map((doc, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Physician",
          "name": doc.name,
          "image": doc.image_url,
          "url": `/doctors/${doc.profile_slug}`,
          "medicalSpecialty": doc.specialization,
          "description": `Dr. ${doc.name}, a ${doc.specialization} with ${doc.experience_years} years of experience.`,
          "knowsLanguage": doc.languages_spoken,
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.apollo247.com/" },
        { "@type": "ListItem", "position": 2, "name": "Specialties", "item": "https://www.apollo247.com/specialties" },
        { "@type": "ListItem", "position": 3, "name": "General Physician / Internal Medicine" }
      ]
    }
  };

  return (
    <>
      <Seo
        title="General Physician / Internal Medicine Doctors - Book Appointment"
        description="Find the best General Physician / Internal Medicine doctors. Check consultation fees, patient reviews, and book appointments online or in-clinic."
        canonicalUrl="https://www.apollo247.com/specialties/general-physician-internal-medicine"
        structuredData={structuredData}
      />
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="text-sm text-gray-600 mb-4">
          Home &gt; Specialties &gt; <span className="font-semibold">General Physician / Internal Medicine</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          General Physician / Internal Medicine Doctors
        </h1>
        <p className="text-sm text-gray-600 mb-6">{totalDoctors} doctors available</p>

        <div className="flex flex-col md:flex-row gap-6">
          <Filters filters={filters} onFilterChange={handleFilterChange} uniqueLanguages={uniqueLanguages} />
          <div className="w-full md:w-3/4 lg:w-4/5">
            <DoctorList doctors={doctors} loading={loading} error={error} />
            {!loading && !error && doctors.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>
      <footer className="bg-gray-100 text-center p-4 mt-8 text-sm text-gray-600">
        © {new Date().getFullYear()} Apollo 24|7 Clone. For demonstration purposes only.
      </footer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<DoctorsPageProps> = async (context) => {
  const initialPage = 1;
  const initialLimit = 5;
  const queryParams = new URLSearchParams({
    page: initialPage.toString(),
    limit: initialLimit.toString(),
    specialization: 'General Physician / Internal Medicine',
    sortBy: 'rating_desc'
  });

  try {
    const res = await fetch(`${API_BASE_URL}/doctors?${queryParams.toString()}`);
    if (!res.ok) {
      console.error("SSR Fetch Error Status:", res.status);
      const errorText = await res.text();
      console.error("SSR Fetch Error Body:", errorText);
      throw new Error(`Failed to fetch initial doctors data: ${res.status}`);
    }
    const data: DoctorApiResponse = await res.json();

    const allLanguages = data.doctors.reduce((acc, doc) => {
      doc.languages_spoken.forEach(lang => acc.add(lang));
      return acc;
    }, new Set<string>());

    return {
      props: {
        initialDoctors: data.doctors,
        initialTotalPages: data.totalPages,
        initialCurrentPage: data.currentPage,
        initialTotalDoctors: data.totalDoctors,
        uniqueLanguages: Array.from(allLanguages).sort()
      },
    };
  } catch (error: any) {
    console.error('getServerSideProps error:', error.message);
    return {
      props: {
        initialDoctors: [],
        initialTotalPages: 0,
        initialCurrentPage: 1,
        initialTotalDoctors: 0,
        uniqueLanguages: ['English', 'Hindi']
      },
    };
  }
};

export default GeneralPhysicianPage;