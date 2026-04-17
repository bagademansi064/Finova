"use client"

import React, {useState} from "react";
import { EyeOff, Eye } from 'lucide-react';

interface inputInterface{
  label: string,
  type?: string,
  placeholder?: string,
  iconLeft?: any,
  showForgotPassword?: boolean
}


// const CustomInput = ({
//   label,
//   type = 'text',
//   placeholder,
//   iconLeft: IconLeft,
//   showForgotPassword = false,
// } : inputInterface) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const isPassword = type === 'password';
//   const inputType = isPassword && showPassword ? 'text' : type;

//   return (
//     <div className="mb-4 w-full">
//       <label className="mb-1.5 block text-sm font-medium text-gray-600">
//         {label} <span className="text-gray-400">*</span>
//       </label>
      
//       <div className="relative flex items-center">
//         {/* Left Icon */}
//         {IconLeft && (
//           <div className="pointer-events-none absolute left-3 text-gray-500">
//             <IconLeft size={18} strokeWidth={1.5} />
//           </div>
//         )}
        
//         {/* Input Field */}
//         <input
//           type={inputType}
//           placeholder={placeholder}
//           className={`w-full rounded-xl border border-gray-200 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-[#1A6B56] focus:ring-1 focus:ring-[#1A6B56] ${
//             IconLeft ? 'pl-10' : 'pl-4'
//           } ${isPassword ? 'pr-10' : 'pr-4'}`}
//         />
        
//         {/* Right Icon (Password Toggle) */}
//         {isPassword && (
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 text-gray-500 hover:text-gray-700"
//           >
//             {showPassword ? (
//               <Eye size={18} strokeWidth={1.5} />
//             ) : (
//               <EyeOff size={18} strokeWidth={1.5} />
//             )}
//           </button>
//         )}
//       </div>

//       {/* Forgot Password Link */}
//       {showForgotPassword && (
//         <div className="mt-2 text-left">
//           <a
//             href="#"
//             className="text-xs font-semibold text-[#1A6B56] hover:underline"
//           >
//             Forgot Password?
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

const CustomInput = ({
  label,
  type = 'text',
  placeholder,
  iconLeft: IconLeft,
  showForgotPassword = false,
}: inputInterface) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="mb-4 w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-600">
        {label} <span className="text-gray-400">*</span>
      </label>
      
      <div className="relative flex items-center">
        {IconLeft && (
          <div className="pointer-events-none absolute left-4 text-gray-500">
            <IconLeft size={18} strokeWidth={1.5} />
          </div>
        )}
        
        <input
          type={inputType}
          placeholder={placeholder}
          className={`w-full rounded-2xl border border-gray-200 bg-white py-3.5 text-sm text-gray-800 outline-none transition-all focus:border-[#0D624B] focus:ring-1 focus:ring-[#0D624B] shadow-sm sm:shadow-none ${
            IconLeft ? 'pl-11' : 'pl-4'
          } ${isPassword ? 'pr-11' : 'pr-4'}`}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <Eye size={18} strokeWidth={1.5} />
            ) : (
              <EyeOff size={18} strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>

      {showForgotPassword && (
        <div className="mt-2 text-left">
          <a
            href="#"
            className="text-xs font-semibold text-[#0D624B] hover:underline"
          >
            Forgot Password?
          </a>
        </div>
      )}
    </div>
  );
};

export default CustomInput;