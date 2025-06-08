import React from 'react';
import { BaseField } from './BaseField';
import { generateFieldId } from '../../utils/helpers';
import { Check } from 'lucide-react';

interface CheckboxOption {
  label: string;
  value: any;
}

interface CheckboxFieldProps {
  name: string;
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  options?: Array<CheckboxOption | string>;
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

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
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

  // Single checkbox
  if (!options) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    };

    return (
      <BaseField
        error={error}
        helperText={helperText}
        tooltip={tooltip}
        design={design}
        tailwind={tailwind}
        fieldId={fieldId}
        required={required}
      >
        <div className={tailwind ? 'flex items-center gap-3' : ''}>
          <div className="relative">
            <input
              id={fieldId}
              type="checkbox"
              checked={!!value}
              onChange={handleChange}
              onBlur={onBlur}
              disabled={disabled}
              required={required}
              autoFocus={autoFocus}
              className="sr-only"
            />
            <div 
              className={`w-5 h-5 border-2 rounded-md transition-all duration-200 cursor-pointer ${
                value 
                  ? 'bg-blue-600 border-blue-600' 
                  : 'bg-white border-gray-300 hover:border-gray-400'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !disabled && !readOnly && onChange(!value)}
            >
              {value && (
                <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
              )}
            </div>
          </div>
          {label && (
            <label 
              htmlFor={fieldId} 
              className={tailwind ? 'text-sm font-medium text-gray-700 cursor-pointer select-none' : ''}
              onClick={() => !disabled && !readOnly && onChange(!value)}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
      </BaseField>
    );
  }

  // Multiple checkboxes
  const normalizedOptions: CheckboxOption[] = options.map(option => 
    typeof option === 'string' ? { label: option, value: option } : option
  );

  const currentValues = Array.isArray(value) ? value : [];

  const handleOptionChange = (optionValue: any, checked: boolean) => {
    if (checked) {
      onChange([...currentValues, optionValue]);
    } else {
      onChange(currentValues.filter((v: any) => v !== optionValue));
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
      <div className={tailwind ? 'space-y-3' : ''}>
        {normalizedOptions.map((option, index) => {
          const optionId = `${fieldId}-${index}`;
          const isChecked = currentValues.includes(option.value);
          
          return (
            <div key={index} className={tailwind ? 'flex items-center gap-3' : ''}>
              <div className="relative">
                <input
                  id={optionId}
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleOptionChange(option.value, e.target.checked)}
                  onBlur={onBlur}
                  disabled={disabled}
                  className="sr-only"
                />
                <div 
                  className={`w-5 h-5 border-2 rounded-md transition-all duration-200 cursor-pointer ${
                    isChecked 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !disabled && handleOptionChange(option.value, !isChecked)}
                >
                  {isChecked && (
                    <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
              <label 
                htmlFor={optionId} 
                className={tailwind ? 'text-sm font-medium text-gray-700 cursor-pointer select-none' : ''}
                onClick={() => !disabled && handleOptionChange(option.value, !isChecked)}
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