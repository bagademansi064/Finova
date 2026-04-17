"use client"

import React from "react";
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInterface extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  iconLeft?: any;
}

const CustomSelect = ({
  label,
  options,
  iconLeft: IconLeft,
  ...props
}: SelectInterface) => {
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
        
        <select
          {...props}
          className={`w-full appearance-none rounded-2xl border border-gray-200 bg-white py-3.5 text-sm text-gray-800 outline-none transition-all focus:border-[#0D624B] focus:ring-1 focus:ring-[#0D624B] shadow-sm sm:shadow-none ${
            IconLeft ? 'pl-11' : 'pl-4'
          } pr-11`}
        >
          <option value="" disabled hidden>
            Select {label}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="pointer-events-none absolute right-4 text-gray-500">
          <ChevronDown size={18} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;
