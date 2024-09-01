import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import GamesList from "../features/gamesList/components/GamesList";
import { getGames } from "../services/gameServices";
import { SteamGames } from "../lib/db_interface";
import SentimentAnalysisCharts from "../features/sentimentChart/SentimentAnalysisCharts";
import AddGamesToListDialogButton from "@/features/addGamesToList/AddGamesToListDialogButton";
import { createContext } from "react";

export const GameListContext = createContext<{
  gamesList: SteamGames[] | undefined;
  refetchGamesList: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<SteamGames[], Error>>;
} | null>(null);

const HomePage = () => {
  const { data: gamesList, refetch: refetchGamesList } = useQuery({
    queryKey: ["games"],
    queryFn: () => getGames<SteamGames[]>(),
  });

  return (
    <GameListContext.Provider value={{ gamesList, refetchGamesList }}>
      <div className="p-3">
        <h1 className="font-bold text-primary-foreground text-4xl text-center p-3">
          Steam Sentiment Analysis
        </h1>
        <section className="border rounded-lg p-2">
          <GamesList gamesList={gamesList ?? []} />
        </section>
        <AddGamesToListDialogButton gamesList={gamesList ?? []} />
        <section>
          <SentimentAnalysisCharts gamesList={gamesList ?? []} />
        </section>
      </div>
    </GameListContext.Provider>
  );
};

export default HomePage;
