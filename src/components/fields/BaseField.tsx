import React from 'react';
import { FormDesign } from '../../types/schema';
import { HelpCircle } from 'lucide-react';

interface BaseFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  tooltip?: string;
  children: React.ReactNode;
  design?: FormDesign;
  tailwind: boolean;
  fieldId: string;
  required?: boolean;
}

export const BaseField: React.FC<BaseFieldProps> = ({
  label,
  error,
  helperText,
  tooltip,
  children,
  design,
  tailwind,
  fieldId,
  required,
}) => {
  const wrapperClass = tailwind 
    ? `mb-6 ${design?.wrapperClass || ''}`
    : design?.wrapperClass || '';
    
  const labelClass = tailwind
    ? `block text-sm font-semibold text-gray-900 mb-2 ${design?.labelClass || ''}`
    : design?.labelClass || '';
    
  const errorClass = tailwind
    ? `text-red-600 text-sm mt-2 font-medium ${design?.errorClass || ''}`
    : design?.errorClass || '';

  return (
    <div className={wrapperClass} style={design?.customStyle}>
      {label && (
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor={fieldId} className={labelClass}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {tooltip && (
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600 transition-colors" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {children}
      
      {error && (
        <div className={errorClass}>
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div className={tailwind ? 'text-gray-500 text-sm mt-2' : 'text-gray-500 text-sm'}>
          {helperText}
        </div>
      )}
    </div>
  );
};