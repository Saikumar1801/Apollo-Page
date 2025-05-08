// frontend/components/DoctorCard.tsx
import Image from 'next/image';

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience_years: number;
  languages_spoken: string[];
  gender: string;
  consultation_fee: number;
  availability_days: string[];
  consultation_types: string[];
  image_url: string;
  next_available_slot: string;
  rating: number;
  profile_slug: string;
}

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <div className="flex-shrink-0 text-center">
        <Image
          src={doctor.image_url || 'https://via.placeholder.com/80'}
          alt={doctor.name}
          width={80}
          height={80}
          className="rounded-full mx-auto"
        />
        <div className="mt-2 text-xs text-yellow-500">⭐ {doctor.rating}</div>
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-apollo_primary">{doctor.name}</h3>
        <p className="text-sm text-gray-600">{doctor.specialization}</p>
        <p className="text-sm text-gray-500">{doctor.experience_years} Years Experience</p>
        <p className="text-sm text-gray-500">
          Speaks: {doctor.languages_spoken.join(', ') || 'N/A'}
        </p>
        <p className="text-xs text-green-600 mt-1">
          Next available: <span className="font-semibold">{doctor.next_available_slot}</span>
        </p>
      </div>
      <div className="flex-shrink-0 md:text-right space-y-2">
        <p className="text-sm text-gray-700">Consultation Type: {doctor.consultation_types.join(', ') || 'N/A'}</p>
        <p className="text-lg font-bold text-gray-800">₹{doctor.consultation_fee}</p>
        <div className="flex flex-col space-y-2 mt-2 md:mt-0">
          <button className="w-full bg-apollo_secondary text-white px-4 py-2 rounded-md text-sm hover:opacity-90">
            Book Appointment
          </button>
          <button className="w-full border border-apollo_primary text-apollo_primary px-4 py-2 rounded-md text-sm hover:bg-apollo_primary hover:text-white">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;