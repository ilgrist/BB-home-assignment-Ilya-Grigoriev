import { useReportForm } from "../hooks/useReportForm";
import {
  SubmitAlert,
  FormField,
  IssueTypeSelect,
  AttachmentField,
} from "../components/ReportForm";

export function ReportPage() {
  const {
    formData,
    updateFormData,
    descriptionError,
    nameError,
    emailError,
    fileError,
    isFormValid,
    handleSubmit,
    submitStatus,
    fileInputRef,
    handleClearFile,
  } = useReportForm();

  return (
    <div className="page">
      <h1>Report a Bug</h1>

      <SubmitAlert type={submitStatus.type} message={submitStatus.message} />

      <form onSubmit={handleSubmit} className="form">
        <IssueTypeSelect
          value={formData.issueType}
          onChange={(value) => updateFormData("issueType", value)}
        />

        <FormField
          id="description"
          label="Description *"
          error={descriptionError}
        >
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData("description", e.target.value)}
            placeholder="Describe the issue..."
            rows={5}
            required
          />
        </FormField>

        <FormField id="contactName" label="Your Name *" error={nameError}>
          <input
            type="text"
            id="contactName"
            value={formData.contactName}
            onChange={(e) => updateFormData("contactName", e.target.value)}
            placeholder="Enter your name"
            required
          />
        </FormField>

        <FormField id="contactEmail" label="Your Email *" error={emailError}>
          <input
            type="email"
            id="contactEmail"
            value={formData.contactEmail}
            onChange={(e) => updateFormData("contactEmail", e.target.value)}
            placeholder="Enter your email"
            required
          />
        </FormField>

        <AttachmentField
          fileInputRef={fileInputRef}
          attachment={formData.attachment}
          error={fileError}
          onChange={(file) => updateFormData("attachment", file)}
          onClear={handleClearFile}
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isFormValid || submitStatus.type === "loading"}
        >
          {submitStatus.type === "loading" ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
