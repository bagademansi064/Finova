"use client"
import React, { useState } from 'react';
import CustomInput from '@/component/LoginComps/CustomInput'
import OAuthButton from '@/component/LoginComps/OAuthButton';
import { Mail, Lock, User } from 'lucide-react';
import BrandLogo from '@/component/BrandLogo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, setAuthToken } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [finovaId, setFinovaId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMSG, setErrorMSG] = useState('');
  const [loading, setLoading] = useState(false);

  const authProviders = [
    {
      name: 'Google',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      )
    },
    {
      name: 'Apple',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="black">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.05 2.78.72 3.4 1.8-3.14 1.87-2.52 5.98.34 7.11-1.01 2.5-2.02 3.65-2.39 4.1zm-3.52-16.7c.69-1.04 1.12-2.31.86-3.58-1.12.1-2.48.8-3.24 1.74-.68.86-1.18 2.15-.9 3.4 1.25.15 2.52-.45 3.28-1.56z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
    {
      name: 'Microsoft',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24">
          <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" fill="#00a4ef" />
          <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#f25022" />
          <path d="M24 11.4H12.6V0H24v11.4z" fill="#7fba00" />
          <path d="M11.4 24H0V12.6h11.4V24z" fill="#00a4ef" />
          <path d="M24 24H12.6V12.6H24V24z" fill="#ffb900" />
        </svg>
      )
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMSG('');

    try {
      const response = await apiFetch('/users/login/', {
        method: 'POST',
        body: JSON.stringify({
          finova_id: finovaId,
          password: password,
        })
      });

      const data = await response.json();

      if (response.ok) {
         setAuthToken(data.access, data.refresh);
         router.push('/home');
      } else {
         setErrorMSG(data.detail || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMSG('Network error unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center  px-6 py-8 font-sans sm:justify-center bg-[linear-gradient(to_bottom_right,#FFFFFF_0%,#E4FCF0_42%,#D2FAE6_93%)] sm:p-4">

      {/* Mobile Logo placement */}
      <div className="w-full mb-12 mt-4">
        <BrandLogo className='absolute h-fit w-fit left-10 top-10' />
      </div>

      {/* Main Card Container */}
      <div className="flex w-full max-w-md flex-col sm:rounded-[2rem] sm:bg-[#FDFEFD] sm:p-10 sm:shadow-2xl sm:border-2">

        {/* Header Section */}
        <div className="mb-8 text-center sm:mt-0 mt-4">
          <h1 className="mb-2 text-[28px] sm:text-3xl font-semibold text-gray-800">
            Welcome Back
          </h1>
          <p className="mx-auto text-sm text-[#7a9d8f] sm:max-w-[250px] sm:text-gray-500">
            <span className="sm:hidden">Access All your Work</span>
            <span className="hidden sm:inline">Securely Access All your Work and Your Dashboard</span>
          </p>
        </div>

        {errorMSG && (
           <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center">
             {errorMSG}
           </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          <CustomInput
            label="Finova ID / Username"
            type="text"
            placeholder='FHT928 or johndoe'
            value={finovaId}
            onChange={(e) => setFinovaId(e.target.value)}
            iconLeft={User}
            required
          />

          <CustomInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            iconLeft={Lock}
            showForgotPassword={true}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-2xl bg-[#0D624B] py-4 text-center text-[15px] font-semibold text-white shadow-md transition-colors hover:bg-[#094d3a] focus:outline-none focus:ring-4 focus:ring-[#0D624B]/30 sm:mt-6 sm:py-3.5 disabled:opacity-70"
          >
            <span className="sm:hidden">{loading ? 'Logging in...' : 'Log In'}</span>
            <span className="hidden sm:inline">{loading ? 'Logging in...' : 'Sign in to Finova'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center justify-center space-x-3">
          <div className="h-px w-full bg-gray-300 sm:bg-gray-200"></div>
          <span className="bg-transparent px-2 text-xs font-semibold text-gray-500 sm:text-sm sm:font-medium sm:text-gray-400">
            OR
          </span>
          <div className="h-px w-full bg-gray-300 sm:bg-gray-200"></div>
        </div>

        {/* OAuth Section */}
        <div className="mb-10 flex w-full justify-between md:gap-3 gap-1 sm:mb-8">
          {authProviders.map((provider) => (
            <OAuthButton
              key={provider.name}
              providerName={provider.name}
              icon={provider.icon}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto text-center text-sm font-medium text-gray-500 sm:mt-0">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-[#0D624B] underline hover:text-[#094d3a]">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}


// export default function Login() {
//   // Array of OAuth providers to map over
//   const authProviders = [
//     {
//       name: 'Google',
//       icon: (
//         <svg className="h-6 w-6" viewBox="0 0 24 24">
//           <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
//           <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
//           <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
//           <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
//         </svg>
//       )
//     },
//     {
//       name: 'Apple',
//       icon: (
//         <svg className="h-6 w-6" viewBox="0 0 24 24" fill="black">
//           <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.05 2.78.72 3.4 1.8-3.14 1.87-2.52 5.98.34 7.11-1.01 2.5-2.02 3.65-2.39 4.1zm-3.52-16.7c.69-1.04 1.12-2.31.86-3.58-1.12.1-2.48.8-3.24 1.74-.68.86-1.18 2.15-.9 3.4 1.25.15 2.52-.45 3.28-1.56z" />
//         </svg>
//       )
//     },
//     {
//       name: 'LinkedIn',
//       icon: (
//         <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#0A66C2">
//           <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//         </svg>
//       )
//     },
//     {
//       name: 'Microsoft',
//       icon: (
//         <svg className="h-6 w-6" viewBox="0 0 24 24">
//           <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" fill="#00a4ef" />
//           <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#f25022" />
//           <path d="M24 11.4H12.6V0H24v11.4z" fill="#7fba00" />
//           <path d="M11.4 24H0V12.6h11.4V24z" fill="#00a4ef" />
//           <path d="M24 24H12.6V12.6H24V24z" fill="#ffb900" />
//         </svg>
//       )
//     }
//   ];

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(to_bottom_right,#FFFFFF_42%,#D2FAE6_70%)] p-4 font-sans">
//       <BrandLogo className='absolute h-fit w-fit left-10 top-10' />

//       <div className="w-full max-w-md rounded-[2rem] bg-[#FDFEFD] border-2 p-10 shadow-2xl">

//         {/* Header Section */}
//         <div className="mb-8 text-center">
//           <h1 className="mb-2 text-3xl font-semibold text-gray-800">Welcome Back</h1>
//           <p className="mx-auto max-w-[250px] text-sm text-gray-500">
//             Securely Access All your Work and Your Dashboard
//           </p>
//         </div>

//         {/* Form Section */}
//         <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
//           <CustomInput
//             label="Business Email"
//             type="email"
//             placeholder="Your Business Email"
//             iconLeft={Mail}
//           />

//           <CustomInput
//             label="Password"
//             type="password"
//             placeholder="••••••••"
//             iconLeft={Lock}
//             showForgotPassword={true}
//           />

//           <button
//             type="submit"
//             className="mt-6 w-full rounded-2xl bg-[#1A6B56] py-3.5 text-center font-medium text-white transition-colors hover:bg-[#135242] focus:outline-none focus:ring-4 focus:ring-[#1A6B56]/30"
//           >
//             Sign in to Finova
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="my-8 flex items-center justify-center space-x-3">
//           <div className="h-px w-full bg-gray-300"></div>
//           <span className="text-sm font-medium text-gray-400">OR</span>
//           <div className="h-px w-full bg-gray-300"></div>
//         </div>

//         {/* OAuth Section */}
//         <div className="mb-8 flex justify-between gap-3 px-2">
//           {authProviders.map((provider) => (
//             <OAuthButton
//               key={provider.name}
//               providerName={provider.name}
//               icon={provider.icon}
//             />
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="text-center text-sm font-medium text-gray-500">
//           Don't have an account?{' '}
//           <a href="#" className="text-[#1A6B56] underline hover:text-[#135242]">
//             Create one
//           </a>
//         </div>

//       </div>
//     </div>
//   );
// }


