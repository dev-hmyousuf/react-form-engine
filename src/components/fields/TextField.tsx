import React from 'react';
import { BaseField } from './BaseField';
import { generateFieldId } from '../../utils/helpers';

interface TextFieldProps {
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  value: string | number;
  onChange: (value: string | number) => void;
  onBlur: () => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  error?: string;
  helperText?: string;
  tooltip?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  design?: any;
  tailwind: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  label,
  placeholder,
  disabled,
  readOnly,
  required,
  autoFocus,
  error,
  helperText,
  tooltip,
  leftIcon,
  rightIcon,
  design,
  tailwind,
}) => {
  const fieldId = generateFieldId(name);
  
  const inputClass = tailwind
    ? `w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed hover:border-gray-300 ${
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''
      } ${leftIcon ? 'pl-12' : ''} ${rightIcon ? 'pr-12' : ''} ${design?.inputClassName || ''}`
    : design?.inputClassName || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = type === 'number' ? (e.target.value === '' ? '' : parseFloat(e.target.value) || 0) : e.target.value;
    onChange(val);
  };

  return (
    <BaseField
      label={label}
      error={error}
      helperText={helperText}
      tooltip={tooltip}
      design={design}
      tailwind={tailwind}
      fieldId={fieldId}
      required={required}
    >
      <div className={tailwind ? 'relative' : ''}>
        {leftIcon && (
          <div className={tailwind ? 'absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400' : ''}>
            {leftIcon}
          </div>
        )}
        
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          className={inputClass}
          style={design?.customStyle}
        />
        
        {rightIcon && (
          <div className={tailwind ? 'absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400' : ''}>
            {rightIcon}
          </div>
        )}
      </div>
    </BaseField>
  );
};