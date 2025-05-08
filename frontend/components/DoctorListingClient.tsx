// frontend/components/DoctorListingClient.tsx
'use client'; // This directive makes it a Client Component

import { useState, useEffect, useCallback } from 'react';
import Filters, { FilterState } from './Filters'; // Assuming Filters.tsx is in ./components
import DoctorList from './DoctorList';           // Assuming DoctorList.tsx is in ./components
import { Doctor } from './DoctorCard';            // Assuming DoctorCard.tsx is in ./components
import Pagination from './Pagination';          // Assuming Pagination.tsx is in ./components

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface DoctorApiResponse {
  doctors: Doctor[];
  currentPage: number;
  totalPages: number;
  totalDoctors: number;
}

interface DoctorListingClientProps {
  initialData: DoctorApiResponse;
  uniqueLanguages: string[];
}

const DoctorListingClient: React.FC<DoctorListingClientProps> = ({ initialData, uniqueLanguages }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialData.doctors);
  const [currentPage, setCurrentPage] = useState<number>(initialData.currentPage);
  const [totalPages, setTotalPages] = useState<number>(initialData.totalPages);
  const [totalDoctors, setTotalDoctors] = useState<number>(initialData.totalDoctors);
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
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const data: DoctorApiResponse = await res.json();
      setDoctors(data.doctors);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalDoctors(data.totalDoctors);
    } catch (e: any) {
      console.error("Failed to fetch doctors:", e);
      setError(e.message || 'Failed to load doctors.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch doctors when filters change, but reset to page 1,
    // unless it's the initial load (where initialData is already set).
    // This prevents an extra fetch on initial render if initialData is sufficient.
    if (
      JSON.stringify(filters) !== JSON.stringify({ // Default initial filters
        sortBy: 'rating_desc',
        gender: 'Any',
        availability: '',
        consultationType: '',
        language: '',
        minExperience: '',
        maxExperience: '',
        minFee: '',
        maxFee: ''
      }) || currentPage !== initialData.currentPage // Or if page changed via pagination
    ) {
        fetchDoctors(1, filters); // If filters change, go to page 1
    }
  }, [filters, fetchDoctors, initialData.currentPage]); // Removed currentPage from here to avoid loop with handlePageChange

  const handleFilterChange = (filterName: keyof FilterState, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
    // The useEffect above will trigger fetchDoctors with page 1
  };

  const handlePageChange = (page: number) => {
    fetchDoctors(page, filters);
    window.scrollTo(0, 0);
  };

  return (
    <>
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
    </>
  );
};

export default DoctorListingClient;