import { useState } from "react";
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
import RobertaChart from "./RobertaChart";
import SteamRecommendationChart from "./SteamRecommendationChart";

interface SentimentAnalysisChartProps {
  gamesList: SteamGames[];
}

const SentimentAnalysisCharts = ({
  gamesList,
}: SentimentAnalysisChartProps) => {
  const [selectedGame, setSelectedGame] = useState<SteamGames>();

  const handleSelectGame = (value: string) => {
    const game = gamesList.find((game) => game.id === value);
    setSelectedGame(game);
  };
  const { data: gameReviews } = useQuery({
    queryKey: ["games", selectedGame?.id],
    queryFn: () => getReviewsByGameId(selectedGame?.id ?? "UNKNOWN"),
    enabled: !!selectedGame?.id,
  });
  return (
    <div className="w-full p-3 flex flex-col gap-3 text-secondary-foreground">
      <div className="flex flex-col gap-3 items-center">
        <Label className="text-primary-foreground">
          Select a Game to Analyze
        </Label>
        <Select onValueChange={handleSelectGame}>
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
        <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-3">
          <RobertaChart gameReviews={gameReviews} selectedGame={selectedGame} />
          <SteamRecommendationChart
            gameReviews={gameReviews}
            selectedGame={selectedGame}
          />
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysisCharts;
