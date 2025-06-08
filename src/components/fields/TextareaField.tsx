import React from 'react';
import { BaseField } from './BaseField';
import { generateFieldId } from '../../utils/helpers';

interface TextareaFieldProps {
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
  rows?: number;
  error?: string;
  helperText?: string;
  tooltip?: string;
  design?: any;
  tailwind: boolean;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
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
  rows = 4,
  error,
  helperText,
  tooltip,
  design,
  tailwind,
}) => {
  const fieldId = generateFieldId(name);
  
  const textareaClass = tailwind
    ? `w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed hover:border-gray-300 resize-vertical ${
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''
      } ${design?.inputClassName || ''}`
    : design?.inputClassName || '';

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
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
      <textarea
        id={fieldId}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoFocus={autoFocus}
        rows={rows}
        className={textareaClass}
        style={design?.customStyle}
      />
    </BaseField>
  );
};