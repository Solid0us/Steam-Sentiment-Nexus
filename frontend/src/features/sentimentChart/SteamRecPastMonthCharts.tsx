import ChartCard from "./components/ChartCard";
import ChartCardTitle from "./components/ChartCardTitle";
import ChartCardDescription from "./components/ChartCardDescription";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SteamRecPastMonthOvertimeChart from "./SteamRecPastMonthOvertimeChart";
import { GetReviewsByGameIdData } from "@/services/gameServices";
import SteamRecPastMonthPieChart from "./SteamRecPastMonthPieChart";

interface SteamRecPastMonthChartsProps {
  gameReviews: GetReviewsByGameIdData | undefined;
}

const SteamRecPastMonthCharts = ({
  gameReviews,
}: SteamRecPastMonthChartsProps) => {
  return (
    <ChartCard>
      <CardHeader>
        <ChartCardTitle title="Steam Recommendations Sampled by Past Month" />
        <ChartCardDescription description="Steam recommendation scores collected in the past 30 days of the time of scraping." />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full items-center gap-5">
          <SteamRecPastMonthOvertimeChart gameReviews={gameReviews} />
          <SteamRecPastMonthPieChart gameReviews={gameReviews} />
        </div>
      </CardContent>
    </ChartCard>
  );
};

export default SteamRecPastMonthCharts;
