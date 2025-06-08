import { FormSchema, FormState, FieldConfig } from '../types/schema';
import { ValidationEngine } from './validation';
import { FieldLogicEngine } from './fieldLogic';
import { getNestedValue, setNestedValue } from '../utils/helpers';

export class FormEngine {
  private schema: FormSchema;
  private state: FormState;
  private validationEngine: ValidationEngine;
  private fieldLogicEngine: FieldLogicEngine;
  private subscribers: Set<() => void> = new Set();

  constructor(schema: FormSchema) {
    this.schema = schema;
    this.validationEngine = new ValidationEngine();
    this.fieldLogicEngine = new FieldLogicEngine();
    
    this.state = this.initializeState();
    this.initializeFieldLogic();
  }

  private initializeState(): FormState {
    const values: Record<string, any> = {};
    
    // Initialize default values
    Object.entries(this.schema.fields).forEach(([fieldName, fieldConfig]) => {
      if (fieldConfig.defaultValue !== undefined) {
        setNestedValue(values, fieldName, fieldConfig.defaultValue);
      }
    });

    return {
      values,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
    };
  }

  private initializeFieldLogic(): void {
    Object.entries(this.schema.fields).forEach(([fieldName, fieldConfig]) => {
      this.fieldLogicEngine.updateFieldLogic(fieldName, fieldConfig, this.state);
    });
  }

  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notify(): void {
    this.subscribers.forEach(callback => callback());
  }

  private debug(message: string, data?: any): void {
    if (this.schema.debug) {
      console.log(`[FormEngine] ${message}`, data);
    }
  }

  getState(): FormState {
    return { ...this.state };
  }

  async setValue(fieldName: string, value: any): Promise<void> {
    this.debug(`Setting value for ${fieldName}`, value);
    
    setNestedValue(this.state.values, fieldName, value);
    
    // Update field logic for all fields that might be affected
    Object.entries(this.schema.fields).forEach(([name, config]) => {
      this.fieldLogicEngine.updateFieldLogic(name, config, this.state, fieldName);
    });

    // Validate field if mode is onChange
    if (this.schema.mode === 'onChange') {
      await this.validateField(fieldName);
    }

    // Call onChange callback
    this.schema.onChange?.(fieldName, value);
    
    this.updateFormValidState();
    this.notify();
  }

  setError(fieldName: string, error: string): void {
    this.state.errors[fieldName] = error;
    this.updateFormValidState();
    this.notify();
  }

  clearError(fieldName: string): void {
    delete this.state.errors[fieldName];
    this.updateFormValidState();
    this.notify();
  }

  async validateField(fieldName: string): Promise<boolean> {
    const fieldConfig = this.schema.fields[fieldName];
    if (!fieldConfig) return true;

    // Skip validation if field is not visible
    if (!this.fieldLogicEngine.isFieldVisible(fieldName)) {
      this.clearError(fieldName);
      return true;
    }

    const value = getNestedValue(this.state.values, fieldName);
    
    // Update required state based on conditional logic
    const dynamicRequired = this.fieldLogicEngine.isFieldRequired(fieldName);
    const finalFieldConfig: FieldConfig = {
      ...fieldConfig,
      validation: {
        ...fieldConfig.validation,
        required: fieldConfig.validation?.required || dynamicRequired,
      },
    };

    const error = await this.validationEngine.validateField(
      value,
      finalFieldConfig,
      this.state.values,
      fieldName
    );

    if (error) {
      this.setError(fieldName, error);
      return false;
    } else {
      this.clearError(fieldName);
      return true;
    }
  }

  async validateForm(): Promise<boolean> {
    const validationPromises = Object.keys(this.schema.fields).map(fieldName => 
      this.validateField(fieldName)
    );

    const results = await Promise.all(validationPromises);
    const isValid = results.every(result => result);

    this.updateFormValidState();
    return isValid;
  }

  private updateFormValidState(): void {
    this.state.isValid = Object.keys(this.state.errors).length === 0;
  }

  async handleSubmit(e?: React.FormEvent): Promise<void> {
    e?.preventDefault();
    
    this.debug('Form submission started');
    this.state.isSubmitting = true;
    this.notify();

    try {
      // Validate all fields before submit
      const isValid = await this.validateForm();
      
      if (!isValid) {
        this.debug('Form validation failed', this.state.errors);
        this.schema.onError?.(this.state.errors);
        return;
      }

      // Filter out values for invisible fields
      const visibleValues: Record<string, any> = {};
      Object.entries(this.state.values).forEach(([key, value]) => {
        if (this.fieldLogicEngine.isFieldVisible(key)) {
          visibleValues[key] = value;
        }
      });

      this.debug('Form submitted successfully', visibleValues);
      await this.schema.onSubmit(visibleValues);
      
    } catch (error) {
      this.debug('Form submission error', error);
      console.error('Form submission error:', error);
    } finally {
      this.state.isSubmitting = false;
      this.notify();
    }
  }

  handleBlur(fieldName: string): void {
    this.state.touched[fieldName] = true;
    
    if (this.schema.mode === 'onBlur') {
      this.validateField(fieldName);
    }
    
    this.notify();
  }

  getFieldProps(fieldName: string) {
    const fieldConfig = this.schema.fields[fieldName];
    const value = getNestedValue(this.state.values, fieldName);
    const error = this.state.errors[fieldName];
    const touched = this.state.touched[fieldName];
    const fieldState = this.fieldLogicEngine.getFieldState(fieldName);

    return {
      name: fieldName,
      value: value ?? '',
      error: touched ? error : undefined,
      disabled: fieldState.disabled,
      readOnly: fieldState.readonly,
      required: fieldConfig.validation?.required || fieldState.required,
      onChange: (newValue: any) => this.setValue(fieldName, newValue),
      onBlur: () => this.handleBlur(fieldName),
      ...fieldConfig,
    };
  }

  reset(): void {
    this.debug('Form reset');
    this.state = this.initializeState();
    this.fieldLogicEngine.reset();
    this.initializeFieldLogic();
    this.notify();
  }

  destroy(): void {
    this.subscribers.clear();
    this.fieldLogicEngine.reset();
  }
}