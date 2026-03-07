import { useState, useRef, FormEvent } from "react";
import { createReport } from "../api/reports";
import {
  validateText,
  validateEmail,
  validateFile,
} from "../helpers/formHelper";
import { ReportFormData } from "../types/Report";
import { useDebounce } from "./useDebounce";

interface SubmitStatus {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
}

const INITIAL_FORM_DATA: ReportFormData = {
  issueType: "Bug",
  description: "",
  contactName: "",
  contactEmail: "",
  attachment: undefined,
};

export function useReportForm() {
  const [formData, setFormData] = useState<ReportFormData>(INITIAL_FORM_DATA);

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: "idle",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const debouncedDescription = useDebounce(formData.description, 400);
  const debouncedContactName = useDebounce(formData.contactName, 400);
  const debouncedContactEmail = useDebounce(formData.contactEmail, 400);

  const descriptionError = validateText(debouncedDescription, 3);
  const nameError = validateText(debouncedContactName, 3);
  const emailError = validateEmail(debouncedContactEmail);
  const fileError = formData.attachment
    ? validateFile(formData.attachment)
    : null;

  const isFormValid =
    formData.issueType &&
    !descriptionError &&
    !nameError &&
    !emailError &&
    !fileError;

  const updateFormData = <K extends keyof ReportFormData>(
    field: K,
    value: ReportFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFile = () => {
    updateFormData("attachment", undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setSubmitStatus({ type: "loading" });

    try {
      const response = await createReport(formData);
      setSubmitStatus({
        type: "success",
        message: `Report submitted successfully! (ID: ${response.id})`,
      });

      setFormData(INITIAL_FORM_DATA);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit report. Please try again.",
      });
    }
  };

  return {
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
  };
}
