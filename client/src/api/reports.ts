import { Report, CreateReportPayload } from "../types/Report";
import { request, requestFormData } from "./http";

export async function getReports(): Promise<Report[]> {
  return request<Report[]>("/api/reports");
}

export async function createReport(payload: CreateReportPayload): Promise<Report> {
  if (payload.attachment) {
    const formData = new FormData();
    formData.append("issueType", payload.issueType);
    formData.append("description", payload.description);
    formData.append("contactName", payload.contactName);
    formData.append("contactEmail", payload.contactEmail);
    formData.append("attachment", payload.attachment);
    return requestFormData<Report>("/api/reports", formData);
  }

  return request<Report>("/api/reports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateReport(id: string, updates: Partial<Report>): Promise<Report> {
  return request<Report>(`/api/reports/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}
