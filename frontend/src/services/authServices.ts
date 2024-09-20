import apiService from "./axiosInstance";

interface LoginData {
  username: string;
  password: string;
}
export const login = async (data: LoginData) => {
  const response = await apiService.post<{ token: string | null }>(
    "/v1/auth/sign-in",
    data
  );
  return response;
};
