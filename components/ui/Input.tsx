
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  prefix?: string;
}

const Input: React.FC<InputProps> = ({ label, prefix, className, ...props }) => {
  const baseInputClasses = "block w-full border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900 bg-white py-2";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          {...props}
          className={`${baseInputClasses} ${prefix ? 'pl-8 pr-3' : 'px-3'} ${className || ''}`}
        />
      </div>
    </div>
  );
};

export default Input;