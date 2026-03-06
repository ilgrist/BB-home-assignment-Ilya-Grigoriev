import { Report, CreateReportPayload } from "../types/Report";
import { UserCheckStatusResponse } from "../types/User";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async requestFormData<T>(
    endpoint: string,
    formData: FormData,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getReports(): Promise<Report[]> {
    return this.request<Report[]>("/api/reports");
  }

  async createReport(payload: CreateReportPayload): Promise<Report> {
    if (payload.attachment) {
      const formData = new FormData();
      formData.append('issueType', payload.issueType);
      formData.append('description', payload.description);
      formData.append('contactName', payload.contactName);
      formData.append('contactEmail', payload.contactEmail);
      formData.append('attachment', payload.attachment);
      return this.requestFormData<Report>("/api/reports", formData);
    }

    return this.request<Report>("/api/reports", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<Report> {
    return this.request<Report>(`/api/reports/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async checkUserStatus(
    email: string,
  ): Promise<UserCheckStatusResponse> {
    return this.request<UserCheckStatusResponse>(
      `/api/check-status`,
      {
        method: "POST",
        body: JSON.stringify({ email })
      }
    );
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
