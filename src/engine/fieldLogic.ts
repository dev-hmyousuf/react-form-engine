import { FieldConfig, FormState } from '../types/schema';
import { evaluateConditionalLogic, shouldFieldUpdate } from '../utils/helpers';

export class FieldLogicEngine {
  private fieldStates = new Map<string, {
    visible: boolean;
    disabled: boolean;
    readonly: boolean;
    required: boolean;
  }>();

  updateFieldLogic(
    fieldName: string,
    fieldConfig: FieldConfig,
    formState: FormState,
    changedField?: string
  ): boolean {
    // Check if this field should update based on dependencies
    if (changedField && !shouldFieldUpdate(fieldName, changedField, fieldConfig)) {
      return false;
    }

    const previousState = this.fieldStates.get(fieldName);
    
    const newState = {
      visible: evaluateConditionalLogic(fieldConfig, formState, 'visibleIf'),
      disabled: evaluateConditionalLogic(fieldConfig, formState, 'disabledIf'),
      readonly: evaluateConditionalLogic(fieldConfig, formState, 'readonlyIf'),
      required: evaluateConditionalLogic(fieldConfig, formState, 'requiredIf'),
    };

    this.fieldStates.set(fieldName, newState);

    // Return true if state changed
    return !previousState || 
           previousState.visible !== newState.visible ||
           previousState.disabled !== newState.disabled ||
           previousState.readonly !== newState.readonly ||
           previousState.required !== newState.required;
  }

  getFieldState(fieldName: string) {
    return this.fieldStates.get(fieldName) || {
      visible: true,
      disabled: false,
      readonly: false,
      required: false,
    };
  }

  isFieldVisible(fieldName: string): boolean {
    return this.getFieldState(fieldName).visible;
  }

  isFieldDisabled(fieldName: string): boolean {
    return this.getFieldState(fieldName).disabled;
  }

  isFieldReadonly(fieldName: string): boolean {
    return this.getFieldState(fieldName).readonly;
  }

  isFieldRequired(fieldName: string): boolean {
    const fieldState = this.getFieldState(fieldName);
    return fieldState.required;
  }

  reset(): void {
    this.fieldStates.clear();
  }
}