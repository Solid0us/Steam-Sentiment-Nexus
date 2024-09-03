import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { GetReviewsByGameIdData } from "@/services/gameServices";
import { useEffect, useState } from "react";
import { LabelList, Pie, PieChart } from "recharts";

const chartConfig = {
  number: {
    label: "Score",
  },
  avgSteamMonthPositive: {
    label: "Recommended",
    color: "hsl(var(--chart-6))",
  },
  avgSteamMonthNegative: {
    label: "Not Recommended",
    color: "hsl(var(--chart-8))",
  },
} satisfies ChartConfig;

interface SteamRecPastMonthPieChartProps {
  gameReviews: GetReviewsByGameIdData | undefined;
}

type SteamRecPastMonthPieChartData = {
  recommendation: string;
  number: number;
  fill: string;
}[];

const SteamRecPastMonthPieChart = ({
  gameReviews,
}: SteamRecPastMonthPieChartProps) => {
  const [steamRecPieChartData, setSteamRecPieChartData] =
    useState<SteamRecPastMonthPieChartData>([]);
  useEffect(() => {
    if (gameReviews) {
      let steamRecData: SteamRecPastMonthPieChartData = [];
      for (const [key, value] of Object.entries(gameReviews?.pastMonthData)) {
        if (
          key === "avgSteamMonthPositive" ||
          key === "avgSteamMonthNegative"
        ) {
          steamRecData.push({
            number: Number(value.toFixed(3)),
            recommendation: key,
            fill: `var(--color-${key})`,
          });
        }
      }

      setSteamRecPieChartData(steamRecData);
    }
  }, [gameReviews?.pastMonthData]);
  return (
    <div className="flex flex-col w-full items-center">
      <Label className="text-primary-foreground p-2">
        Average Steam Recommendation Scores Over the Past 30 Days
      </Label>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px] w-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={steamRecPieChartData}
            dataKey="number"
            nameKey="recommendation"
            label
          >
            <LabelList
              dataKey="recommendation"
              className="fill-background"
              stroke="none"
              fontSize={12}
              formatter={(value: keyof typeof chartConfig) =>
                chartConfig[value]?.label
              }
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default SteamRecPastMonthPieChart;
