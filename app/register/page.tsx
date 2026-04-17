"use client"

import React, { useState } from 'react';
import CustomInput from '@/component/LoginComps/CustomInput';
import CustomSelect from '@/component/LoginComps/CustomSelect';
import BrandLogo from '@/component/BrandLogo';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  CreditCard,
  Briefcase,
  ChevronLeft,
  Camera
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    gender: '',
    panCard: '',
    tradingExp: '',
    profilePic: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        profilePic: e.target.files![0]
      }));
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final Registration Submit
      console.log('Final Form Data:', formData);
      alert('Registration Completed! (Check Console)');
      // In real scenario, make API call here and then redirect
      router.push('/login');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Progress logic
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-8 font-sans sm:justify-center bg-[linear-gradient(to_bottom_right,#FFFFFF_0%,#E4FCF0_42%,#D2FAE6_93%)] sm:p-4">
      {/* Mobile Logo placement */}
      <div className="w-full mb-12 mt-4 relative flex justify-center items-center">
        {currentStep > 0 && (
           <button 
             onClick={handlePrevStep}
             className="absolute left-0 top-0 sm:hidden p-2 text-gray-600 hover:text-gray-900 bg-white rounded-full shadow-sm"
           >
             <ChevronLeft size={24} />
           </button>
        )}
        <div className="sm:hidden">
          <BrandLogo className="h-fit w-fit" />
        </div>
        <BrandLogo className="hidden sm:block absolute h-fit w-fit left-10 top-10" />
      </div>

      {/* Main Card Container */}
      <div className="flex w-full max-w-md flex-col sm:rounded-[2rem] sm:bg-[#FDFEFD] sm:p-10 sm:shadow-2xl sm:border-2 relative">
        
        {/* Desktop Back Button */}
        {currentStep > 0 && (
          <button 
            onClick={handlePrevStep}
            className="hidden sm:flex absolute left-8 top-8 items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft size={18} className="mr-1" />
            Back
          </button>
        )}

        {/* Progress Bar */}
        <div className="w-full mt-2 sm:mt-8 mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0D624B] transition-all duration-500 ease-in-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="text-right text-xs font-semibold text-[#0D624B]">
            {progressPercentage}%
          </div>
        </div>

        {/* Header Section */}
        <div className="mb-8 text-center mt-2">
          <h1 className="mb-2 text-[28px] sm:text-3xl font-semibold text-gray-800">
            {currentStep === 0 && 'Get Started'}
            {currentStep === 1 && 'Personal Info'}
            {currentStep === 2 && 'Verification'}
            {currentStep === 3 && 'Your Profile'}
          </h1>
          <p className="mx-auto text-sm text-[#7a9d8f] sm:max-w-[280px] sm:text-gray-500">
            {currentStep === 0 && 'Securely Access All your Work and Your Dashboard'}
            {currentStep === 1 && 'Tell us a bit more about yourself'}
            {currentStep === 2 && "Let's secure your account and tailor your experience"}
            {currentStep === 3 && 'Add a photo so we can recognize you'}
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleNextStep} className="space-y-1">
          {/* Phase 1: Account Basics */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <CustomInput
                label="Full Name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your Full Name"
                iconLeft={User}
                required
              />
              <CustomInput
                label="Business Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Business Email"
                iconLeft={Mail}
                required
              />
              <CustomInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                iconLeft={Lock}
                required
              />
            </div>
          )}

          {/* Phase 2: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <CustomInput
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                iconLeft={Phone}
                required
              />
              <CustomInput
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                iconLeft={Calendar}
                required
              />
              <CustomSelect
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                iconLeft={User}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" }
                ]}
                required
              />
            </div>
          )}

          {/* Phase 3: Verification & Level */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <CustomInput
                label="PAN Card Number"
                name="panCard"
                type="text"
                value={formData.panCard}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                iconLeft={CreditCard}
                style={{ textTransform: 'uppercase' }}
                required
              />
              <CustomSelect
                label="Trading Knowledge Level"
                name="tradingExp"
                value={formData.tradingExp}
                onChange={handleChange}
                iconLeft={Briefcase}
                options={[
                  { label: "Beginner", value: "beginner" },
                  { label: "Intermediate", value: "intermediate" },
                  { label: "Expert", value: "expert" }
                ]}
                required
              />
            </div>
          )}

          {/* Phase 4: Profile Picture */}
          {currentStep === 3 && (
            <div className="space-y-4 flex flex-col items-center justify-center py-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="relative group w-32 h-32 rounded-full border-4 border-dashed border-[#0D624B]/30 flex items-center justify-center bg-gray-50 overflow-hidden text-center hover:bg-gray-100 transition-colors">
                 {formData.profilePic ? (
                   <img 
                     src={URL.createObjectURL(formData.profilePic)} 
                     alt="Profile Preview" 
                     className="w-full h-full object-cover"
                   />
                 ) : (
                    <div className="flex flex-col items-center px-4 text-gray-500">
                      <Camera size={32} className="mb-2 text-[#0D624B]/60" />
                      <span className="text-xs font-medium">Tap to Upload</span>
                    </div>
                 )}
                 <input 
                   type="file" 
                   accept="image/*"
                   capture="user"
                   onChange={handleFileChange}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   required
                 />
               </div>
               <p className="text-xs text-gray-400 font-medium text-center max-w-[200px]">
                 You can take a photo or select an image from your device.
               </p>
            </div>
          )}

          <div className="pt-6">
            <button
              type="submit"
              className="w-full rounded-2xl bg-[#0D624B] py-4 text-center text-[15px] font-semibold text-white shadow-md transition-colors hover:bg-[#094d3a] focus:outline-none focus:ring-4 focus:ring-[#0D624B]/30 sm:py-3.5"
            >
              {currentStep < totalSteps - 1 ? 'Continue' : 'Complete Registration'}
            </button>
          </div>
        </form>

        {/* Footer */}
        {currentStep === 0 && (
          <div className="mt-8 text-center text-sm font-medium text-gray-500">
            Already Registered?{' '}
            <Link href="/login" className="font-semibold text-[#0D624B] underline hover:text-[#094d3a]">
              Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
