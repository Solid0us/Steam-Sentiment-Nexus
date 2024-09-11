import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import GamesList from "../features/gamesList/components/GamesList";
import { getAllNewsByGameId, getGames } from "../services/gameServices";
import { SteamGames } from "../lib/db_interface";
import SentimentAnalysisCharts from "../features/sentimentChart/SentimentAnalysisCharts";
import { createContext, useState } from "react";
import GameNews from "@/features/gameNews/GameNews";
import Navbar from "@/components/navbar/Navbar";
import useLocalStorage from "@/hooks/useLocalStorage";
import SpinupNotice from "@/features/SpinupNotice";

export const GameListContext = createContext<{
  gamesList: SteamGames[] | undefined;
  refetchGamesList: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<SteamGames[], Error>>;
} | null>(null);

const HomePage = () => {
  const [selectedGame, setSelectedGame] = useState<SteamGames>();
  const { data: gamesList, refetch: refetchGamesList } = useQuery({
    queryKey: ["games"],
    queryFn: () => getGames<SteamGames[]>(),
  });
  const [spinUpNotice, setSpinUpNotice] = useLocalStorage("spinupNotice", true);
  const { data: gameNews } = useQuery({
    queryKey: ["gameNews", { id: selectedGame?.id }],
    queryFn: () => getAllNewsByGameId(selectedGame?.id ?? "UNKNOWN"),
  });

  return (
    <GameListContext.Provider value={{ gamesList, refetchGamesList }}>
      <SpinupNotice
        spinUpNotice={spinUpNotice}
        setSpinUpNotice={setSpinUpNotice}
      />
      <Navbar setSelectedGame={setSelectedGame} selectedGame={selectedGame} />
      <div className="p-3 flex flex-col items-center gap-5">
        <section className="border rounded-lg p-2 bg-secondary-foreground">
          <GamesList
            gamesList={gamesList ?? []}
            refetchGamesList={refetchGamesList}
          />
        </section>
        <section className="bg-secondary-foreground">
          <SentimentAnalysisCharts
            selectedGame={selectedGame}
            setSelectedGame={setSelectedGame}
            gamesList={gamesList ?? []}
          />
        </section>
        <section className="flex flex-col gap-3 p-5 bg-secondary-foreground rounded-lg w-full max-w-7xl">
          <GameNews
            gameNews={gameNews?.articles ?? []}
            selectedGame={selectedGame}
          />
        </section>
      </div>
    </GameListContext.Provider>
  );
};

export default HomePage;
