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
    avgSteamNeg: number;
    avgSteamPos: number;
  }[];
  pastMonthData: {
    avgSteamPositive: number;
    avgSteamNegative: number;
    avgRobertaPos: number;
    avgRobertaNeu: number;
    avgRobertaNeg: number;
    avgSteamMonthPositive: number;
    avgSteamMonthNegative: number;
  };
}

export interface CreateGamesData {
  games: {
    id: string;
    name: string;
    isActive: boolean;
  }[];
}

export interface UpdateGamesData {
  games: {
    id: string;
    isActive: boolean;
  }[];
}

export interface GetAllNewsByGameIdData {
  articles: {
    author: string;
    date: Date;
    gameId: string;
    id: number;
    link: string;
    summary: string;
    thumbnailLink?: string;
    title: string;
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

export const createGames = async (data: CreateGamesData) => {
  const response = await apiService.post("/v1/games", data);
};

export const updateGames = async (data: UpdateGamesData) => {
  const response = await apiService.patch("v1/games", data);
};

export const getAllNewsByGameId = async (id: string) => {
  const response = await apiService.get<{ data: GetAllNewsByGameIdData }>(
    `/v1/games/${id}/news`
  );
  return response.data.data;
};
