import { useQuery } from "@tanstack/react-query";
import GamesList from "../features/gamesList/components/GamesList";
import { getGames } from "../services/gameServices";
import { SteamGames } from "../lib/db_interface";
import SentimentAnalysisChart from "../features/sentimentChart/SentimentAnalysisChart";

const HomePage = () => {
  const { data: gamesList } = useQuery({
    queryKey: ["games"],
    queryFn: () => getGames<SteamGames[]>(),
  });
  return (
    <div className="p-3">
      <h1 className="font-bold text-primary text-4xl text-center">
        Steam Sentiment Analysis
      </h1>
      <section className="border rounded-lg p-2">
        <GamesList gamesList={gamesList ?? []} />
      </section>
      <section>
        <SentimentAnalysisChart gamesList={gamesList ?? []} />
      </section>
    </div>
  );
};

export default HomePage;
