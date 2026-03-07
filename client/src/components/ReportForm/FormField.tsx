import { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string | null;
  children: ReactNode;
}

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="validation-error">{error}</span>}
    </div>
  );
}
