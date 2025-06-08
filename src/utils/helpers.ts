import { FieldConfig, FormState } from '../types/schema';

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const getNestedValue = (obj: Record<string, any>, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

export const setNestedValue = (obj: Record<string, any>, path: string, value: any): void => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
};

export const evaluateConditionalLogic = (
  fieldConfig: FieldConfig,
  formState: FormState,
  property: 'visibleIf' | 'disabledIf' | 'readonlyIf' | 'requiredIf'
): boolean => {
  const condition = fieldConfig[property];
  if (!condition) return property === 'visibleIf' ? true : false;
  
  try {
    return condition(formState.values);
  } catch (error) {
    console.warn(`Error evaluating ${property} condition:`, error);
    return property === 'visibleIf' ? true : false;
  }
};

export const getFieldDependencies = (fieldConfig: FieldConfig): string[] => {
  const deps: string[] = [];
  
  if (fieldConfig.fieldDeps) {
    deps.push(...fieldConfig.fieldDeps);
  }
  
  if (fieldConfig.validation?.matchField) {
    deps.push(fieldConfig.validation.matchField);
  }
  
  return [...new Set(deps)];
};

export const shouldFieldUpdate = (
  fieldName: string,
  changedField: string,
  fieldConfig: FieldConfig
): boolean => {
  const dependencies = getFieldDependencies(fieldConfig);
  return dependencies.includes(changedField) || fieldName === changedField;
};

export const generateFieldId = (fieldName: string): string => {
  return `field-${fieldName.replace(/\./g, '-')}`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};