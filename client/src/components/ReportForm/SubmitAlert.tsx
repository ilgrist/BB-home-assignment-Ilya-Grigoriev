interface SubmitAlertProps {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export function SubmitAlert({ type, message }: SubmitAlertProps) {
  if (type !== 'success' && type !== 'error') return null;
  return (
    <div className={`alert alert-${type}`}>
      {message}
    </div>
  );
}
