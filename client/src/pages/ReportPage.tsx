import { useState, useRef, FormEvent } from 'react';
import { apiClient } from '../api/client';
import { CreateReportPayload, IssueType, ReportFormData } from '../types/Report';
import { validateEmail, validateText, validateFile } from '../helpers/formHelper';
import { useDebounce } from '../hooks/useDebounce';

const ISSUE_TYPES: IssueType[] = ['Bug', 'Feature Request', 'Improvement', 'Documentation', 'Other'];

interface SubmitStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export function ReportPage() {
  const [formData, setFormData] = useState<ReportFormData>({
    issueType: 'Bug',
    description: '',
    contactName: '',
    contactEmail: '',
    attachment: undefined,
  });
  
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: 'idle' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const debouncedDescription = useDebounce(formData.description, 400);
  const debouncedContactName = useDebounce(formData.contactName, 400);
  const debouncedContactEmail = useDebounce(formData.contactEmail, 400);

  const descriptionError = validateText(debouncedDescription, 3);
  const nameError = validateText(debouncedContactName, 3);
  const emailError = validateEmail(debouncedContactEmail);
  const fileError = formData.attachment ? validateFile(formData.attachment) : null;

  const isFormValid =
      formData.issueType &&
      !descriptionError &&
      !nameError &&
      !emailError &&
      !fileError;

  const updateFormData = <K extends keyof ReportFormData>(field: K, value: ReportFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFile = () => {
    updateFormData('attachment', undefined);
    const fileInput = document.getElementById('attachment') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;

    setSubmitStatus({ type: 'loading' });

    try {
      const payload: CreateReportPayload = {
        issueType: formData.issueType,
        description: formData.description,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        attachment: formData.attachment,
      };

      const response = await apiClient.createReport(payload);
      setSubmitStatus({
        type: 'success',
        message: `Report submitted successfully! (ID: ${response.id})`
      });
      
      // Reset form
      setFormData({
        issueType: 'Bug',
        description: '',
        contactName: '',
        contactEmail: '',
        attachment: undefined,
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit report. Please try again.'
      });
    }
  };

  return (
    <div className="page">
      <h1>Report a Bug</h1>

      {submitStatus.type === 'success' && (
        <div className="alert alert-success">
          {submitStatus.message}
        </div>
      )}

      {submitStatus.type === 'error' && (
        <div className="alert alert-error">
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="issueType">Issue Type *</label>
          <select
            id="issueType"
            value={formData.issueType}
            onChange={(e) => updateFormData('issueType', e.target.value as IssueType)}
            required
          >
            {ISSUE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Describe the issue..."
            rows={5}
            required
          />
          {descriptionError && (
            <span className="validation-error">
              {descriptionError}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="contactName">Your Name *</label>
          <input
            type="text"
            id="contactName"
            value={formData.contactName}
            onChange={(e) => updateFormData('contactName', e.target.value)}
            placeholder="Enter your name"
            required
          />
          {nameError && (
            <span className="validation-error">
              {nameError}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="contactEmail">Your Email *</label>
          <input
            type="email"
            id="contactEmail"
            value={formData.contactEmail}
            onChange={(e) => updateFormData('contactEmail', e.target.value)}
            placeholder="Enter your email"
            required
          />
          {emailError && (
            <span className="validation-error">
              {emailError}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="attachment">Attachment (optional)</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="attachment"
              ref={fileInputRef}
              onChange={(e) => updateFormData('attachment', e.target.files?.[0])}
              accept=".png,.jpg,.jpeg,.pdf"
            />
          </div>
          {fileError && (
            <span className="validation-error">
              {fileError}
            </span>
          )}
          {formData.attachment && (
            <div className="file-selected">
              <span className="file-name">{formData.attachment.name}</span>
              <span className="file-size">({(formData.attachment.size / 1024).toFixed(1)} KB)</span>
              <button
                type="button"
                className="btn-clear-file"
                onClick={handleClearFile}
                title="Remove file"
              >
                ✕
              </button>
            </div>
          )}
          <small className="form-hint">
            Allowed: PNG, JPG, PDF (max 5MB)
          </small>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!isFormValid || submitStatus.type === 'loading'}
        >
          {submitStatus.type === 'loading' ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
