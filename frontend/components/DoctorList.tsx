// frontend/components/DoctorList.tsx
import DoctorCard, { Doctor } from './DoctorCard';

interface DoctorListProps {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors, loading, error }) => {
  if (loading) {
    return <div className="text-center py-10">Loading doctors...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (doctors.length === 0) {
    return <div className="text-center py-10 text-gray-600">No doctors found matching your criteria.</div>;
  }

  return (
    <div className="space-y-4">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;