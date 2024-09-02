import { SteamGames } from "@/lib/db_interface";
import { GetReviewsByGameIdData } from "@/services/gameServices";
import ChartCard from "./components/ChartCard";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import ChartCardTitle from "./components/ChartCardTitle";
import ChartCardDescription from "./components/ChartCardDescription";
import RobertaOverTimeChart from "./RobertaOvertimeChart";
import RobertaLastMonthChart from "./RobertaLastMonthChart";
interface RobertaChartProps {
  selectedGame: SteamGames | undefined;
  gameReviews: GetReviewsByGameIdData | undefined;
}

const RobertaCharts = ({ gameReviews, selectedGame }: RobertaChartProps) => {
  return (
    <ChartCard>
      <CardHeader>
        <ChartCardTitle title="RoBERTa Sentiment Scores" />
        <ChartCardDescription description="Sentiment scores using the RoBERTa model over time." />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-5 items-center">
          <RobertaOverTimeChart gameReviews={gameReviews} />
          <RobertaLastMonthChart gameReviews={gameReviews} />
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </ChartCard>
  );
};

export default RobertaCharts;
