import { FieldValidation, FieldConfig } from '../types/schema';
import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePattern,
  validateAcceptedDomains,
  validateMatchField,
} from '../utils/validators';
import { debounce } from '../utils/helpers';

export class ValidationEngine {
  private debouncedValidators = new Map<string, ReturnType<typeof debounce>>();

  async validateField(
    value: any,
    fieldConfig: FieldConfig,
    allValues: Record<string, any>,
    fieldName: string
  ): Promise<string | null> {
    const { validation } = fieldConfig;
    if (!validation) return null;

    // Required validation
    if (validation.required && !validateRequired(value)) {
      return `${fieldConfig.label || fieldName} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!validateRequired(value) && !validation.required) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      if (validation.minLength && !validateMinLength(value, validation.minLength)) {
        return `${fieldConfig.label || fieldName} must be at least ${validation.minLength} characters`;
      }

      if (validation.maxLength && !validateMaxLength(value, validation.maxLength)) {
        return `${fieldConfig.label || fieldName} must be no more than ${validation.maxLength} characters`;
      }

      if (validation.pattern && !validatePattern(value, validation.pattern)) {
        return `${fieldConfig.label || fieldName} format is invalid`;
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (validation.min !== undefined && value < validation.min) {
        return `${fieldConfig.label || fieldName} must be at least ${validation.min}`;
      }

      if (validation.max !== undefined && value > validation.max) {
        return `${fieldConfig.label || fieldName} must be no more than ${validation.max}`;
      }
    }

    // Email domain validation
    if (fieldConfig.type === 'email' && validation.acceptedDomains) {
      if (!validateAcceptedDomains(value, validation.acceptedDomains)) {
        return `${fieldConfig.label || fieldName} domain not accepted`;
      }
    }

    // Match field validation
    if (validation.matchField) {
      const matchValue = allValues[validation.matchField];
      if (!validateMatchField(value, matchValue)) {
        return `${fieldConfig.label || fieldName} does not match`;
      }
    }

    // Custom validation
    if (validation.customValidator) {
      const customResult = await this.runCustomValidator(
        validation.customValidator,
        value,
        allValues,
        fieldName,
        validation.debounce
      );

      if (customResult !== true) {
        return typeof customResult === 'string' ? customResult : `${fieldConfig.label || fieldName} is invalid`;
      }
    }

    return null;
  }

  private async runCustomValidator(
    validator: NonNullable<FieldValidation['customValidator']>,
    value: any,
    allValues: Record<string, any>,
    fieldName: string,
    debounceMs?: number
  ): Promise<boolean | string> {
    if (debounceMs) {
      return new Promise((resolve) => {
        const key = `${fieldName}-custom`;
        
        if (!this.debouncedValidators.has(key)) {
          this.debouncedValidators.set(
            key,
            debounce(async () => {
              const result = await validator(value, allValues);
              resolve(result);
            }, debounceMs)
          );
        }

        const debouncedValidator = this.debouncedValidators.get(key)!;
        debouncedValidator();
      });
    }

    return await validator(value, allValues);
  }

  clearDebouncedValidator(fieldName: string): void {
    const key = `${fieldName}-custom`;
    this.debouncedValidators.delete(key);
  }
}