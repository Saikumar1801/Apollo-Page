import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main specialties page we are working on
    router.replace('../pages/specialties/general-physician-internal-medicine');
  }, [router]);

  // Display a loading message while redirecting
  return (
    <>
      <Head>
        <title>Apollo Clone - Loading...</title>
        <meta name="description" content="Redirecting to the doctor listing page." />
      </Head>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f2f5',
        color: '#333'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Apollo 24|7 Clone</h1>
        <p style={{ fontSize: '18px' }}>Redirecting you to the General Physician page...</p>
        {/* Optional: Add a simple spinner or loading animation here */}
      </div>
    </>
  );
}