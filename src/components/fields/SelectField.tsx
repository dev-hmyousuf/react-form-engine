import React from 'react';
import { BaseField } from './BaseField';
import { generateFieldId } from '../../utils/helpers';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  label: string;
  value: any;
}

interface SelectFieldProps {
  name: string;
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  options: Array<SelectOption | string>;
  multiple?: boolean;
  label?: string;
  placeholder?: string;
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

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  value,
  onChange,
  onBlur,
  options,
  multiple,
  label,
  placeholder,
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
  
  const selectClass = tailwind
    ? `w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed hover:border-gray-300 appearance-none ${
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''
      } ${design?.inputClassName || ''}`
    : design?.inputClassName || '';

  const normalizedOptions: SelectOption[] = options.map(option => 
    typeof option === 'string' ? { label: option, value: option } : option
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
      onChange(selectedOptions);
    } else {
      onChange(e.target.value);
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
      <div className="relative">
        <select
          id={fieldId}
          value={multiple ? undefined : value || ''}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          multiple={multiple}
          className={selectClass}
          style={design?.customStyle}
        >
          {placeholder && !multiple && (
            <option value="\" disabled>
              {placeholder}
            </option>
          )}
          {normalizedOptions.map((option, index) => (
            <option 
              key={index} 
              value={option.value}
              selected={multiple ? Array.isArray(value) && value.includes(option.value) : undefined}
            >
              {option.label}
            </option>
          ))}
        </select>
        {!multiple && (
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        )}
      </div>
    </BaseField>
  );
};