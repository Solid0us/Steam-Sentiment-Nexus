import apiService from "./axiosInstance";

export const getGames = async <T>() => {
  const response = await apiService.get<{ data: T }>("/v1/games");
  return response.data.data;
};
