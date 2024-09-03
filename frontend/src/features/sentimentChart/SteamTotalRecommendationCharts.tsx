import { SteamGames } from "@/lib/db_interface";
import { GetReviewsByGameIdData } from "@/services/gameServices";
import ChartCard from "./components/ChartCard";
import ChartCardTitle from "./components/ChartCardTitle";
import ChartCardDescription from "./components/ChartCardDescription";
import { CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SteamRecOvertimeChart from "./SteamRecOvertimeChart";
import SteamRecLastMonthPieChart from "./SteamRecLastMonthPieChart";

interface SteamRecommendationChartProps {
  gameReviews: GetReviewsByGameIdData | undefined;
}

const SteamTotalRecommendationCharts = ({
  gameReviews,
}: SteamRecommendationChartProps) => {
  const [percentView, setPercentView] = useState(false);
  return (
    <ChartCard>
      <CardHeader>
        <ChartCardTitle title="Steam Total Recommendation" />
        <ChartCardDescription description="Steam recommendation scores over time." />
        <div className="flex flex-row justify-start">
          <Button
            className={`${
              percentView
                ? "bg-secondary-foreground hover:bg-slate-700"
                : "bg-slate-600 hover:bg-slate-700 border border-primary"
            }`}
            onClick={() => setPercentView(false)}
          >
            Number
          </Button>
          <Button
            className={`${
              percentView
                ? "bg-slate-600 hover:bg-slate-700 border border-primary"
                : "bg-secondary-foreground hover:bg-slate-700"
            }`}
            onClick={() => setPercentView(true)}
          >
            Percentage
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row w-full items-center">
          <SteamRecOvertimeChart
            gameReviews={gameReviews}
            percentView={percentView}
            setPercentView={setPercentView}
          />
          <SteamRecLastMonthPieChart gameReviews={gameReviews} />
        </div>
      </CardContent>
    </ChartCard>
  );
};

export default SteamTotalRecommendationCharts;
