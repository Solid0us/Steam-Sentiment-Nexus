import React, { useState } from "react";
import { SteamGames } from "../../lib/db_interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";

interface SentimentAnalysisChartProps {
  gamesList: SteamGames[];
}

const SentimentAnalysisChart = ({ gamesList }: SentimentAnalysisChartProps) => {
  const [selectedGame, setSelectedGame] = useState<SteamGames>();

  const handleSelectGame = (value: string) => {
    const game = gamesList.find((game) => game.id === value);
    setSelectedGame(game);
  };
  return (
    <div className="w-full p-3 flex flex-col gap-3 text-secondary-foreground">
      <div className="flex flex-col gap-3 items-center">
        <Label className="text-primary-foreground">
          Select a Game to Analyze
        </Label>
        <Select onValueChange={handleSelectGame}>
          <SelectTrigger className="bg-primary-foreground max-w-52">
            <SelectValue className="text-primary" placeholder="Select a game">
              {selectedGame?.name}
            </SelectValue>
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
      </div>
    </div>
  );
};

export default SentimentAnalysisChart;
