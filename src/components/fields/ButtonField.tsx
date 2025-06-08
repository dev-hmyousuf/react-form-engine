import React from 'react';

interface ButtonFieldProps {
  name: string;
  label?: string;
  buttonType?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
  disabled?: boolean;
  design?: any;
  tailwind: boolean;
}

export const ButtonField: React.FC<ButtonFieldProps> = ({
  name,
  label,
  buttonType = 'button',
  onClick,
  disabled,
  design,
  tailwind,
}) => {
  const buttonClass = tailwind
    ? `w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${design?.inputClassName || ''}`
    : design?.inputClassName || '';

  return (
    <div className="mt-8">
      <button
        type={buttonType}
        onClick={onClick}
        disabled={disabled}
        className={buttonClass}
        style={design?.customStyle}
      >
        {label || 'Button'}
      </button>
    </div>
  );
};