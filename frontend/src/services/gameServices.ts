import apiService from "./axiosInstance";

export interface GetReviewsByGameIdData {
  game: {
    id: string;
    name: string;
    isActive: boolean;
  };
  reviews: {
    avgHoursPlayedNeg: number;
    avgHoursPlayedNeu: number;
    avgHoursPlayedPos: number;
    createdDate: Date;
    endDate: Date;
    id: number;
    number_scraped: number;
    robertaNegAvg: number;
    robertaNeuAvg: number;
    robertaPosAvg: number;
    steamNegatives: number;
    steamPositives: number;
    steam_review_description: string;
    success: boolean;
  }[];
}

export const getGames = async <T>() => {
  const response = await apiService.get<{ data: T }>("/v1/games");
  return response.data.data;
};

export const getReviewsByGameId = async (id: string) => {
  const response = await apiService.get<{ data: GetReviewsByGameIdData }>(
    `/v1/games/${id}/reviews`
  );
  return response.data.data;
};
