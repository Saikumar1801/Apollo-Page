// frontend/components/Filters.tsx
import React from 'react';

export interface FilterState {
  sortBy: string;
  gender: string;
  availability: string;
  consultationType: string;
  language: string;
  minExperience: string; // Store as string for select, convert to number for API
  maxExperience: string;
  minFee: string;
  maxFee: string;
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filterName: keyof FilterState, value: string) => void;
  uniqueLanguages: string[];
}

const sortOptions = [
  { value: 'rating_desc', label: 'Relevance (Rating)' },
  { value: 'experience_desc', label: 'Experience: High to Low' },
  { value: 'experience_asc', label: 'Experience: Low to High' },
  { value: 'fee_asc', label: 'Price: Low to High' },
  { value: 'fee_desc', label: 'Price: High to Low' },
];

const experienceRanges = [
  { value: '', label: 'Any Experience' },
  { value: '0-5', label: '0-5 Years' },
  { value: '6-10', label: '6-10 Years' },
  { value: '11-15', label: '11-15 Years' },
  { value: '15+', label: '15+ Years' },
]; // minExperience, maxExperience handled from these

const feeRanges = [
    { value: '', label: 'Any Fee' },
    { value: '0-300', label: '₹0 - ₹300' },
    { value: '301-500', label: '₹301 - ₹500' },
    { value: '501-800', label: '₹501 - ₹800' },
    { value: '800+', label: '₹800+' },
];


const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, uniqueLanguages }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "experienceRange") {
        const [min, max] = value.split('-');
        onFilterChange('minExperience', min || '');
        onFilterChange('maxExperience', max ? (max === '+' ? '100' : max) : ''); // Assuming 100 as a high upper bound for '+'
    } else if (name === "feeRange") {
        const [min, max] = value.split('-');
        onFilterChange('minFee', min || '');
        onFilterChange('maxFee', max ? (max === '+' ? '10000' : max) : ''); // Assuming 10000 for '+'
    }
     else {
        onFilterChange(name as keyof FilterState, value);
    }
  };

  const getExperienceRangeValue = () => {
    if (!filters.minExperience && !filters.maxExperience) return '';
    if (filters.minExperience === '15' && filters.maxExperience === '100') return '15+';
    return `${filters.minExperience}-${filters.maxExperience}`;
  }

  const getFeeRangeValue = () => {
    if (!filters.minFee && !filters.maxFee) return '';
    if (filters.minFee === '800' && filters.maxFee === '10000') return '800+';
    return `${filters.minFee}-${filters.maxFee}`;
  }


  return (
    <aside className="w-full md:w-1/4 lg:w-1/5 p-4 bg-gray-50 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>

      {/* Sort By */}
      <div className="mb-4">
        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
        <select
          id="sortBy"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleSelectChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-apollo_primary focus:border-apollo_primary"
        >
          {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {/* Gender */}
      <div className="mb-4">
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select
          id="gender"
          name="gender"
          value={filters.gender}
          onChange={handleSelectChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-apollo_primary focus:border-apollo_primary"
        >
          <option value="Any">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
        <select
          id="availability"
          name="availability"
          value={filters.availability}
          onChange={handleSelectChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-apollo_primary focus:border-apollo_primary"
        >
          <option value="">Any</option>
          <option value="Today">Today</option>
          <option value="Tomorrow">Tomorrow</option>
          <option value="Next 7 days">Next 7 days</option>
        </select>
      </div>

      {/* Consultation Type */}
      <div className="mb-4">
        <label htmlFor="consultationType" className="block text-sm font-medium text-gray-700 mb-1">Consultation Type</label>
        <select
          id="consultationType"
          name="consultationType"
          value={filters.consultationType}
          onChange={handleSelectChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-apollo_primary focus:border-apollo_primary"
        >
          <option value="">Any</option>
          <option value="Video">Video Consultation</option>
          <option value="In-person">In-Person Visit</option>
        </select>
      </div>

      {/* Languages */}
      <div className="mb-4">
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
        <select
          id="language"
          name="language"
          value={filters.language}
          onChange={handleSelectChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-apollo_primary focus:border-apollo_primary"
        >
          <option value="">Any Language</option>
          {uniqueLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
        </select>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <label htmlFor="experienceRange" className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
        <select
          id="experienceRange"
          name="experienceRange"
          value={getExperienceRangeValue()}
          onChange={handleSelectChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-apollo_primary focus:border-apollo_primary"
        >
          {experienceRanges.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

       {/* Price */}
       <div className="mb-4">
        <label htmlFor="feeRange" className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
        <select
          id="feeRange"
          name="feeRange"
          value={getFeeRangeValue()}
          onChange={handleSelectChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-apollo_primary focus:border-apollo_primary"
        >
          {feeRanges.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      {/* Add more filters like price range if needed */}
    </aside>
  );
};

export default Filters;