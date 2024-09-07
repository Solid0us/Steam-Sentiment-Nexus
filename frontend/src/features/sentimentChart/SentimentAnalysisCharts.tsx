import { useEffect, useState } from "react";
import { SteamGames } from "../../lib/db_interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { getReviewsByGameId } from "../../services/gameServices";
import { useQuery } from "@tanstack/react-query";
import RobertaCharts from "./RobertaCharts";
import SteamTotalRecommendationCharts from "./SteamTotalRecommendationCharts";
import SteamRecPastMonthCharts from "./SteamRecPastMonthCharts";

interface SentimentAnalysisChartProps {
  gamesList: SteamGames[];
  selectedGame: SteamGames | undefined;
  setSelectedGame: React.Dispatch<React.SetStateAction<SteamGames | undefined>>;
}

const SentimentAnalysisCharts = ({
  gamesList,
  selectedGame,
  setSelectedGame,
}: SentimentAnalysisChartProps) => {
  const handleSelectGame = (value: string) => {
    const game = gamesList.find((game) => game.id === value);
    setSelectedGame(game);
  };
  const { data: gameReviews } = useQuery({
    queryKey: ["games", selectedGame?.id],
    queryFn: () => getReviewsByGameId(selectedGame?.id ?? "UNKNOWN"),
    enabled: !!selectedGame?.id,
  });

  useEffect(() => {
    if (gamesList) {
      setSelectedGame(gamesList[0]);
    }
  }, [gamesList]);
  return (
    <div className="w-full p-3 flex flex-col gap-3 text-secondary-foreground border rounded-lg bg-secondary-foreground">
      <div className="flex flex-col gap-3 items-center">
        <h1 className="text-primary text-2xl font-bold">Sentiment Analysis</h1>
        <Label className="text-primary-foreground">
          Select a Game to Analyze
        </Label>
        <Select value={selectedGame?.id} onValueChange={handleSelectGame}>
          <SelectTrigger className="bg-primary-foreground max-w-52">
            <SelectValue
              className="text-primary-foreground"
              placeholder="Select a game"
            />
            <SelectContent>
              {gamesList.map((game) => (
                <SelectItem
                  className="text-secondary-foreground"
                  key={game.id}
                  value={game.id}
                >
                  {game.name}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectTrigger>
        </Select>
        <div className="flex flex-col items-center justify-center w-full gap-3">
          <div className="flex flex-col lg:flex-row gap-3">
            <RobertaCharts gameReviews={gameReviews} />
            <SteamRecPastMonthCharts gameReviews={gameReviews} />
          </div>
          <SteamTotalRecommendationCharts gameReviews={gameReviews} />
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysisCharts;
