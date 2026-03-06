import { useState, FormEvent } from 'react';
import { apiClient } from '../api/client';
import { CreateReportPayload, IssueType, ReportFormData } from '../types/Report';
import { validateEmail, validateText } from '../helpers/formHelper';

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

  const descriptionError = validateText(formData.description, 3);
  const nameError = validateText(formData.contactName, 3);
  const emailError = validateEmail(formData.contactEmail);

  const isFormValid = 
      formData.issueType &&
      !descriptionError &&
      !nameError &&
      !emailError;
  

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            onChange={(e) => updateFormData('issueType', e.target.value)}
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
          <input
            type="file"
            id="attachment"
            disabled
            title="TODO: Implement file upload"
          />
          <small className="form-hint">
            TODO: Implement attachment upload (PNG, JPG, PDF, max 5MB)
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
