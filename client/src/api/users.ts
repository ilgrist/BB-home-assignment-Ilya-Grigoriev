import { UserCheckStatusResponse } from "../types/User";
import { request } from "./http";

export async function checkUserStatus(email: string): Promise<UserCheckStatusResponse> {
  return request<UserCheckStatusResponse>("/api/users/check-status", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
