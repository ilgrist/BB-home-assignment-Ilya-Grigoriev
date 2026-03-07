import { RefObject } from 'react';

interface AttachmentFieldProps {
  fileInputRef: RefObject<HTMLInputElement>;
  attachment?: File;
  error?: string | null;
  onChange: (file: File | undefined) => void;
  onClear: () => void;
}

export function AttachmentField({ fileInputRef, attachment, error, onChange, onClear }: AttachmentFieldProps) {
  return (
    <div className="form-group">
      <label htmlFor="attachment">Attachment (optional)</label>
      <div className="file-input-wrapper">
        <input
          type="file"
          id="attachment"
          ref={fileInputRef}
          onChange={(e) => onChange(e.target.files?.[0])}
          accept=".png,.jpg,.jpeg,.pdf"
        />
      </div>
      {error && <span className="validation-error">{error}</span>}
      {attachment && (
        <div className="file-selected">
          <span className="file-name">{attachment.name}</span>
          <span className="file-size">({(attachment.size / 1024).toFixed(1)} KB)</span>
          <button
            type="button"
            className="btn-clear-file"
            onClick={onClear}
            title="Remove file"
          >
            ✕
          </button>
        </div>
      )}
      <small className="form-hint">Allowed: PNG, JPG, PDF (max 5MB)</small>
    </div>
  );
}
