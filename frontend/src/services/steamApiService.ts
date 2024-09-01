import apiService from "./axiosInstance";

export interface GetAllSteamGamesData {
  applist: {
    apps: { appid: number; name: string }[];
  };
}

export const getAllSteamGames = async () => {
  const response = await apiService.get<{ data: GetAllSteamGamesData }>(
    "/v1/steam-apps"
  );
  return response.data.data;
};
