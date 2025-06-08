import React from 'react';
import { FieldConfig } from '../types/schema';
import { TextField } from './fields/TextField';
import { TextareaField } from './fields/TextareaField';
import { SelectField } from './fields/SelectField';
import { CheckboxField } from './fields/CheckboxField';
import { RadioField } from './fields/RadioField';
import { PasswordField } from './fields/PasswordField';
import { OTPField } from './fields/OTPField';
import { ButtonField } from './fields/ButtonField';

interface FieldRendererProps {
  fieldName: string;
  fieldConfig: FieldConfig;
  fieldProps: any;
  tailwind: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  fieldName,
  fieldConfig,
  fieldProps,
  tailwind,
}) => {
  // Extract the field-specific props from fieldConfig and merge with fieldProps
  const {
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
    ...configRest
  } = fieldConfig;

  const commonProps = {
    name: fieldName,
    label,
    placeholder,
    disabled,
    readOnly,
    required,
    autoFocus,
    error: fieldProps.error,
    helperText,
    tooltip,
    leftIcon,
    rightIcon,
    design,
    tailwind,
    value: fieldProps.value,
    onChange: fieldProps.onChange,
    onBlur: fieldProps.onBlur,
  };

  switch (fieldConfig.type) {
    case 'text':
    case 'email':
    case 'tel':
    case 'url':
    case 'number':
      return <TextField {...commonProps} type={fieldConfig.type} />;

    case 'textarea':
      return <TextareaField {...commonProps} />;

    case 'password':
      return (
        <PasswordField 
          {...commonProps} 
          showToggle={(fieldConfig as any).showToggle}
          strengthPolicy={(fieldConfig as any).strengthPolicy}
          strengthValidator={(fieldConfig as any).strengthValidator}
        />
      );

    case 'select':
      return (
        <SelectField 
          {...commonProps} 
          options={(fieldConfig as any).options}
          multiple={(fieldConfig as any).multiple}
        />
      );

    case 'checkbox':
      return (
        <CheckboxField 
          {...commonProps} 
          options={(fieldConfig as any).options}
        />
      );

    case 'radio':
      return (
        <RadioField 
          {...commonProps} 
          options={(fieldConfig as any).options}
        />
      );

    case 'otp':
      return (
        <OTPField 
          {...commonProps} 
          length={(fieldConfig as any).length}
          onResend={(fieldConfig as any).onResend}
        />
      );

    case 'button':
      return (
        <ButtonField 
          {...commonProps} 
          buttonType={(fieldConfig as any).buttonType}
          onClick={(fieldConfig as any).onClick}
        />
      );

    case 'custom':
      const CustomComponent = (fieldConfig as any).component;
      return <CustomComponent {...commonProps} {...(fieldConfig as any).props} />;

    case 'file':
    case 'image':
    case 'date':
    case 'datetime-local':
    case 'time':
    case 'switch':
    case 'richText':
      // These would be implemented as additional field components
      return (
        <div className={tailwind ? 'p-4 border-2 border-dashed border-gray-300 rounded-md text-center' : ''}>
          <p className={tailwind ? 'text-gray-500' : ''}>
            {fieldConfig.type} field type not yet implemented
          </p>
        </div>
      );

    default:
      return (
        <div className={tailwind ? 'p-4 border-2 border-dashed border-red-300 rounded-md text-center' : ''}>
          <p className={tailwind ? 'text-red-500' : ''}>
            Unknown field type: {(fieldConfig as any).type}
          </p>
        </div>
      );
  }
};