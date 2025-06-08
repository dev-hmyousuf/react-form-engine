import { useState, useEffect, useRef } from 'react';
import { FormSchema, FormEngineReturn } from '../types/schema';
import { FormEngine } from '../engine/formEngine';

export function useFormEngine(schema: FormSchema): FormEngineReturn {
  const engineRef = useRef<FormEngine | null>(null);
  const [, forceUpdate] = useState({});

  // Initialize engine
  if (!engineRef.current) {
    engineRef.current = new FormEngine(schema);
  }

  useEffect(() => {
    const engine = engineRef.current!;
    
    const unsubscribe = engine.subscribe(() => {
      forceUpdate({});
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Update schema when it changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.destroy();
      engineRef.current = new FormEngine(schema);
      forceUpdate({});
    }
  }, [schema]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, []);

  const engine = engineRef.current!;

  return {
    state: engine.getState(),
    setValue: (field: string, value: any) => engine.setValue(field, value),
    setError: (field: string, error: string) => engine.setError(field, error),
    clearError: (field: string) => engine.clearError(field),
    validateField: (field: string) => engine.validateField(field),
    validateForm: () => engine.validateForm(),
    handleSubmit: (e?: React.FormEvent) => engine.handleSubmit(e),
    reset: () => engine.reset(),
    getFieldProps: (field: string) => engine.getFieldProps(field),
  };
}