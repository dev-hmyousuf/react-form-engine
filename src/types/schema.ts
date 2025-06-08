import { ReactNode, CSSProperties } from 'react';

export type ValidationMode = 'onChange' | 'onBlur' | 'onSubmit';

export interface FormDesign {
  className?: string;
  wrapperClass?: string;
  inputClassName?: string;
  labelClass?: string;
  errorClass?: string;
  customStyle?: CSSProperties;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string | RegExp;
  acceptedDomains?: string[];
  matchField?: string;
  customValidator?: (value: any, allValues: Record<string, any>) => boolean | string | Promise<boolean | string>;
  debounce?: number;
}

export interface ConditionalLogic {
  visibleIf?: (formData: Record<string, any>) => boolean;
  disabledIf?: (formData: Record<string, any>) => boolean;
  readonlyIf?: (formData: Record<string, any>) => boolean;
  requiredIf?: (formData: Record<string, any>) => boolean;
}

export type FieldType = 
  | 'text' | 'textarea' | 'email' | 'password' | 'number' | 'tel' | 'url'
  | 'select' | 'checkbox' | 'radio' | 'switch'
  | 'file' | 'image'
  | 'date' | 'datetime-local' | 'time'
  | 'otp' | 'button' | 'richText' | 'custom';

export interface BaseFieldConfig extends ConditionalLogic {
  type: FieldType;
  label?: string;
  placeholder?: string;
  defaultValue?: any;
  validation?: FieldValidation;
  design?: FormDesign;
  autoFocus?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  tooltip?: string;
  helperText?: string;
  repeatable?: boolean;
  fieldDeps?: string[];
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  options: Array<{ label: string; value: any } | string>;
  multiple?: boolean;
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: 'radio';
  options: Array<{ label: string; value: any } | string>;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
  options?: Array<{ label: string; value: any } | string>;
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: 'file' | 'image';
  accept?: string;
  maxSize?: number;
  preview?: boolean;
}

export interface OTPFieldConfig extends BaseFieldConfig {
  type: 'otp';
  length?: number;
  onResend?: () => void;
}

export interface ButtonFieldConfig extends BaseFieldConfig {
  type: 'button';
  buttonType?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
}

export interface PasswordFieldConfig extends BaseFieldConfig {
  type: 'password';
  showToggle?: boolean;
  strengthPolicy?: 'weak' | 'medium' | 'strong' | 'custom';
  strengthValidator?: (password: string) => 'weak' | 'medium' | 'strong';
}

export interface CustomFieldConfig extends BaseFieldConfig {
  type: 'custom';
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

export type FieldConfig = 
  | BaseFieldConfig
  | SelectFieldConfig
  | RadioFieldConfig
  | CheckboxFieldConfig
  | FileFieldConfig
  | OTPFieldConfig
  | ButtonFieldConfig
  | PasswordFieldConfig
  | CustomFieldConfig;

export interface FormSchema {
  tailwind: boolean;
  mode: ValidationMode;
  debug?: boolean;
  design?: FormDesign;
  fields: Record<string, FieldConfig>;
  onSubmit: (data: Record<string, any>) => void;
  onError?: (errors: Record<string, string>) => void;
  onChange?: (fieldName: string, value: any) => void;
  onRender?: (fieldName: string) => void;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormEngineReturn {
  state: FormState;
  setValue: (field: string, value: any) => void;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  validateField: (field: string) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
  getFieldProps: (field: string) => any;
}