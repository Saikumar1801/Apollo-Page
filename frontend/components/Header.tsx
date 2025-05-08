// frontend/components/Header.tsx
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-3 px-4 md:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/apollo-logo.svg" alt="Apollo Logo" width={120} height={35} />
        </Link>
        <div className="hidden md:flex items-center space-x-4 border border-gray-300 rounded-md px-3 py-2">
          {/* Simplified Search - Non-functional */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input type="text" placeholder="Search medicines, doctors, labs..." className="outline-none text-sm" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-700 cursor-pointer">
            {/* Location - Non-functional */}
            <span className="font-semibold">Hyderabad</span> <span className="text-xs">▼</span>
          </div>
          <button className="text-sm text-apollo_primary font-semibold hover:underline">
            Login / Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;