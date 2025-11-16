
import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-focus focus:ring-primary',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export default Button;