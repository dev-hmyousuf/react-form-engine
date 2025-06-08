import React from 'react';
import { FormSchema } from '../types/schema';
import { useFormEngine } from '../hooks/useFormEngine';
import { FieldRenderer } from './FieldRenderer';

interface FormEngineProps {
  schema: FormSchema;
  className?: string;
}

export const FormEngine: React.FC<FormEngineProps> = ({ schema, className }) => {
  const { state, handleSubmit, getFieldProps } = useFormEngine(schema);

  const formClass = schema.tailwind
    ? `${schema.design?.className || ''} ${className || ''}`
    : `${schema.design?.className || ''} ${className || ''}`;

  const visibleFields = Object.entries(schema.fields).filter(([fieldName]) => {
    const fieldProps = getFieldProps(fieldName);
    // This would be enhanced with actual visibility logic from the engine
    return true; // Simplified for now
  });

  return (
    <form 
      onSubmit={handleSubmit}
      className={formClass}
      style={schema.design?.customStyle}
    >
      {schema.debug && (
        <div className={schema.tailwind ? 'mb-4 p-3 bg-gray-100 rounded text-xs' : ''}>
          <details>
            <summary className={schema.tailwind ? 'cursor-pointer font-medium' : ''}>
              Debug Info
            </summary>
            <pre className={schema.tailwind ? 'mt-2 text-xs' : ''}>
              {JSON.stringify(state, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <div className={schema.tailwind ? 'space-y-4' : ''}>
        {visibleFields.map(([fieldName, fieldConfig]) => {
          const fieldProps = getFieldProps(fieldName);
          
          // Call onRender callback
          schema.onRender?.(fieldName);
          
          return (
            <FieldRenderer
              key={fieldName}
              fieldName={fieldName}
              fieldConfig={fieldConfig}
              fieldProps={fieldProps}
              tailwind={schema.tailwind}
            />
          );
        })}
      </div>
    </form>
  );
};