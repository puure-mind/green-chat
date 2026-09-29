import { apiClient } from "@/shared/api/client";
import type { AuthCredentials } from "@/shared/types/auth";

type GreenApiSettingsResponse = {
  wid?: string;
  stateInstance?: string;
};

export async function checkAuthCredentials(credentials: AuthCredentials) {
  const idInstance = credentials.idInstance.trim();
  const apiTokenInstance = credentials.apiTokenInstance.trim();

  const response = await apiClient.get<GreenApiSettingsResponse>(
    `/waInstance${idInstance}/getSettings/${apiTokenInstance}`,
  );

  return response.data;
}
