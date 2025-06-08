import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { BaseField } from './BaseField';
import { generateFieldId } from '../../utils/helpers';
import { validatePasswordStrength } from '../../utils/validators';

interface PasswordFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  showToggle?: boolean;
  strengthPolicy?: 'weak' | 'medium' | 'strong' | 'custom';
  strengthValidator?: (password: string) => 'weak' | 'medium' | 'strong';
  error?: string;
  helperText?: string;
  tooltip?: string;
  design?: any;
  tailwind: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  value,
  onChange,
  onBlur,
  label,
  placeholder,
  disabled,
  readOnly,
  required,
  autoFocus,
  showToggle = true,
  strengthPolicy,
  strengthValidator,
  error,
  helperText,
  tooltip,
  design,
  tailwind,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const fieldId = generateFieldId(name);
  
  const inputClass = tailwind
    ? `w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed hover:border-gray-300 ${
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''
      } ${design?.inputClassName || ''}`
    : design?.inputClassName || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordStrength = () => {
    if (!strengthPolicy || !value) return null;
    
    if (strengthValidator) {
      return strengthValidator(value);
    }
    
    return validatePasswordStrength(value);
  };

  const passwordStrength = getPasswordStrength();

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStrengthWidth = (strength: string) => {
    switch (strength) {
      case 'weak': return 'w-1/3';
      case 'medium': return 'w-2/3';
      case 'strong': return 'w-full';
      default: return 'w-0';
    }
  };

  const getStrengthBg = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
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
        <input
          id={fieldId}
          type={showPassword ? 'text' : 'password'}
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
        
        {showToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={tailwind ? 'absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors' : ''}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      
      {strengthPolicy && passwordStrength && (
        <div className={tailwind ? 'mt-3' : ''}>
          <div className={tailwind ? 'flex justify-between items-center mb-2' : ''}>
            <span className={tailwind ? 'text-xs font-medium text-gray-600' : ''}>Password strength:</span>
            <span className={tailwind ? `text-xs font-semibold ${getStrengthColor(passwordStrength)}` : ''}>
              {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
            </span>
          </div>
          {tailwind && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getStrengthWidth(passwordStrength)} ${getStrengthBg(passwordStrength)}`}
              />
            </div>
          )}
        </div>
      )}
    </BaseField>
  );
};