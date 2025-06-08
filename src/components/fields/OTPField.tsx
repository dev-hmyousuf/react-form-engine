import React, { useState, useRef, useEffect } from 'react';
import { BaseField } from './BaseField';
import { generateFieldId } from '../../utils/helpers';

interface OTPFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  length?: number;
  onResend?: () => void;
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

export const OTPField: React.FC<OTPFieldProps> = ({
  name,
  value,
  onChange,
  onBlur,
  length = 6,
  onResend,
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
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const fieldId = generateFieldId(name);

  // Initialize OTP from value
  useEffect(() => {
    if (value) {
      const digits = value.split('').slice(0, length);
      const newOtp = [...Array(length).fill('')];
      digits.forEach((digit, index) => {
        newOtp[index] = digit;
      });
      setOtp(newOtp);
    }
  }, [value, length]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d?$/.test(digit)) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    
    const otpValue = newOtp.join('');
    onChange(otpValue);

    // Move to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, length);
    
    const newOtp = [...Array(length).fill('')];
    digits.forEach((digit, index) => {
      newOtp[index] = digit;
    });
    
    setOtp(newOtp);
    onChange(newOtp.join(''));
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
    inputRefs.current[focusIndex]?.focus();
  };

  const inputClass = tailwind
    ? `w-12 h-12 text-center text-lg font-semibold border-2 border-gray-200 rounded-xl bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-gray-300 ${
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''
      } ${design?.inputClassName || ''}`
    : design?.inputClassName || '';

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
      <div className={tailwind ? 'flex gap-3 justify-center' : ''}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onBlur={onBlur}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus && index === 0}
            className={inputClass}
            style={design?.customStyle}
          />
        ))}
      </div>
      
      {onResend && (
        <div className={tailwind ? 'mt-4 text-center' : ''}>
          <button
            type="button"
            onClick={onResend}
            disabled={disabled}
            className={tailwind ? 'text-blue-600 hover:text-blue-700 text-sm font-semibold disabled:text-gray-400 transition-colors' : ''}
          >
            Resend OTP
          </button>
        </div>
      )}
    </BaseField>
  );
};