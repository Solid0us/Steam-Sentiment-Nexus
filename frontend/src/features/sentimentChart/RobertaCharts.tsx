import { SteamGames } from "@/lib/db_interface";
import { GetReviewsByGameIdData } from "@/services/gameServices";
import ChartCard from "./components/ChartCard";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import ChartCardTitle from "./components/ChartCardTitle";
import ChartCardDescription from "./components/ChartCardDescription";
import RobertaOverTimeChart from "./RobertaOvertimeChart";
import RobertaLastMonthChart from "./RobertaLastMonthChart";
interface RobertaChartProps {
  gameReviews: GetReviewsByGameIdData | undefined;
}

const RobertaCharts = ({ gameReviews }: RobertaChartProps) => {
  return (
    <ChartCard>
      <CardHeader>
        <ChartCardTitle title="RoBERTa Sentiment Scores" />
        <ChartCardDescription description="Sentiment scores using the RoBERTa model. Each data point averages scores of the reviews in the past 30 days from the time of scraping." />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5 items-center">
          <RobertaOverTimeChart gameReviews={gameReviews} />
          <RobertaLastMonthChart gameReviews={gameReviews} />
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </ChartCard>
  );
};

export default RobertaCharts;
