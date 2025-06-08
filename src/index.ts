// Main exports for the form engine
export { useFormEngine } from './hooks/useFormEngine';
export { FormEngine } from './components/FormEngine';
export { FieldRenderer } from './components/FieldRenderer';

// Field components
export { TextField } from './components/fields/TextField';
export { TextareaField } from './components/fields/TextareaField';
export { SelectField } from './components/fields/SelectField';
export { CheckboxField } from './components/fields/CheckboxField';
export { RadioField } from './components/fields/RadioField';
export { PasswordField } from './components/fields/PasswordField';
export { OTPField } from './components/fields/OTPField';
export { ButtonField } from './components/fields/ButtonField';

// Utilities
export * from './utils/validators';
export * from './utils/helpers';

// Types
export * from './types/schema';

// HOC for schema injection
export const withSchema = <P extends object>(
  Component: React.ComponentType<P>,
  schema: any
) => {
  return (props: P) => {
    const formEngine = useFormEngine(schema);
    return <Component {...props} formEngine={formEngine} />;
  };
};