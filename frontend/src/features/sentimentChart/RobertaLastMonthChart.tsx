import { LabelList, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GetReviewsByGameIdData } from "@/services/gameServices";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
export const description = "A simple pie chart";

const chartConfig = {
  score: {
    label: "Score",
  },
  avgRobertaPos: {
    label: "Positive",
    color: "hsl(var(--chart-6))",
  },
  avgRobertaNeu: {
    label: "Neutral",
    color: "hsl(var(--chart-7))",
  },

  avgRobertaNeg: {
    label: "Negative",
    color: "hsl(var(--chart-8))",
  },
} satisfies ChartConfig;

interface RobertaLastMonthChartProps {
  gameReviews: GetReviewsByGameIdData | undefined;
}

type RobertaLastMonthPieChartData = {
  sentiment: string;
  score: number;
  fill: string;
}[];

const RobertaLastMonthChart = ({ gameReviews }: RobertaLastMonthChartProps) => {
  const [sentimentPieChartData, setSentimentPieChartData] =
    useState<RobertaLastMonthPieChartData>([]);
  const [steamRecPieChartData, setSteamRecPieChartData] =
    useState<RobertaLastMonthPieChartData>([]);
  useEffect(() => {
    if (gameReviews) {
      let sentimentData: RobertaLastMonthPieChartData = [];
      let steamRecData: RobertaLastMonthPieChartData = [];
      for (const [key, value] of Object.entries(gameReviews?.pastMonthData)) {
        if (
          key === "avgRobertaPos" ||
          key === "avgRobertaNeu" ||
          key === "avgRobertaNeg"
        ) {
          sentimentData.push({
            score: Number(value.toFixed(3)),
            sentiment: key,
            fill: `var(--color-${key})`,
          });
        }
      }

      setSentimentPieChartData(sentimentData);
      setSteamRecPieChartData(steamRecData);
    }
  }, [gameReviews?.pastMonthData]);
  return (
    <div className="w-5/6 flex flex-wrap lg:flex-col">
      <div className="flex flex-col w-full items-center">
        <Label className="text-primary-foreground p-2">
          Average Sentiment Scores Over the Past 30 Days
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
              data={sentimentPieChartData}
              dataKey="score"
              nameKey="sentiment"
              label
            >
              <LabelList
                dataKey="sentiment"
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
    </div>
  );
};

export default RobertaLastMonthChart;
