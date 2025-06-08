import React from 'react';
import { BaseField } from './BaseField';
import { generateFieldId } from '../../utils/helpers';

interface RadioOption {
  label: string;
  value: any;
}

interface RadioFieldProps {
  name: string;
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  options: Array<RadioOption | string>;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  error?: string;
  helperText?: string;
  tooltip?: string;
  design?: any;
  tailwind: boolean;
}

export const RadioField: React.FC<RadioFieldProps> = ({
  name,
  value,
  onChange,
  onBlur,
  options,
  label,
  disabled,
  readOnly,
  required,
  autoFocus,
  error,
  helperText,
  tooltip,
  design,
  tailwind,
}) => {
  const fieldId = generateFieldId(name);
  
  const normalizedOptions: RadioOption[] = options.map(option => 
    typeof option === 'string' ? { label: option, value: option } : option
  );

  const handleChange = (optionValue: any) => {
    onChange(optionValue);
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
      <div className={tailwind ? 'space-y-3' : ''}>
        {normalizedOptions.map((option, index) => {
          const optionId = `${fieldId}-${index}`;
          const isSelected = value === option.value;
          
          return (
            <div key={index} className={tailwind ? 'flex items-center gap-3' : ''}>
              <div className="relative">
                <input
                  id={optionId}
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => handleChange(option.value)}
                  onBlur={onBlur}
                  disabled={disabled}
                  autoFocus={autoFocus && index === 0}
                  className="sr-only"
                />
                <div 
                  className={`w-5 h-5 border-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    isSelected 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !disabled && !readOnly && handleChange(option.value)}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
              <label 
                htmlFor={optionId} 
                className={tailwind ? 'text-sm font-medium text-gray-700 cursor-pointer select-none' : ''}
                onClick={() => !disabled && !readOnly && handleChange(option.value)}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </BaseField>
  );
};