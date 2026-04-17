"use client"

import React, {useState} from "react";
import { EyeOff, Eye } from 'lucide-react';

interface inputInterface extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  iconLeft?: any;
  showForgotPassword?: boolean;
}

const CustomInput = ({
  label,
  type = 'text',
  placeholder,
  iconLeft: IconLeft,
  showForgotPassword = false,
  ...props
}: inputInterface) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="mb-4 w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-600">
        {label} {props.required && <span className="text-gray-400">*</span>}
      </label>
      
      <div className="relative flex items-center">
        {IconLeft && (
          <div className="pointer-events-none absolute left-4 text-gray-500">
            <IconLeft size={18} strokeWidth={1.5} />
          </div>
        )}
        
        <input
          {...props}
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