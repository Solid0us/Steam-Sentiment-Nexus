import { SteamGames } from "@/lib/db_interface";
import { GetReviewsByGameIdData } from "@/services/gameServices";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import ChartCard from "./components/ChartCard";
import ChartCardTitle from "./components/ChartCardTitle";
import ChartCardDescription from "./components/ChartCardDescription";
import { CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
const chartConfig = {
  steamPositives: {
    label: "Recommended",
    color: "hsl(var(--chart-1))",
  },
  steamNegatives: {
    label: "Not Recommended",
    color: "hsl(var(--chart-2))",
  },
  percent: {
    label: "Percentage Positve",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface SteamRecommendationChartProps {
  selectedGame: SteamGames | undefined;
  gameReviews: GetReviewsByGameIdData | undefined;
}

type PercentPositiveData = {
  percent: number;
  createdDate: Date;
  endDate: Date;
}[];

const SteamRecommendationChart = ({
  gameReviews,
  selectedGame,
}: SteamRecommendationChartProps) => {
  const [percentPositiveData, setPercentPositiveData] =
    useState<PercentPositiveData>([]);
  const [percentView, setPercentView] = useState(true);
  const getPercentageRecommended = () => {
    let percentPositiveDataToAppend: PercentPositiveData = [];
    gameReviews?.reviews.forEach((review) => {
      percentPositiveDataToAppend.push({
        endDate: review.endDate,
        percent:
          (review.steamPositives /
            (review.steamNegatives + review.steamPositives)) *
          100,
        createdDate: review.createdDate,
      });
    });
    setPercentPositiveData(percentPositiveDataToAppend);
  };

  useEffect(() => {
    getPercentageRecommended();
  }, [gameReviews]);
  return (
    <ChartCard>
      <CardHeader>
        <ChartCardTitle title="Steam Recommendation" />
        <ChartCardDescription description="Steam recommendation scores over time." />
        <div className="flex flex-row justify-end">
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
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={
              percentView ? percentPositiveData : gameReviews?.reviews ?? []
            }
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="endDate"
              tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
              style={{
                fill: "#FFFFFF",
              }}
            />
            <YAxis
              tickMargin={8}
              axisLine={true}
              style={{
                fill: "#FFFFFF",
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {percentView ? (
              <Line
                dataKey="percent"
                type="natural"
                stroke="#8db3fc"
                strokeWidth={2}
                dot={{
                  fill: "#3ef772",
                }}
                activeDot={{
                  r: 6,
                }}
                name="Positive"
              />
            ) : (
              <>
                <Line
                  dataKey="steamPositives"
                  type="natural"
                  stroke="#3ef772"
                  strokeWidth={2}
                  dot={{
                    fill: "#3ef772",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                  name="Positive"
                />

                <Line
                  dataKey="steamNegatives"
                  type="natural"
                  stroke="#f74d4d"
                  strokeWidth={2}
                  dot={{
                    fill: "#f74d4d",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                  name="Negative"
                />
              </>
            )}

            <ChartLegend
              className="text-white"
              content={<ChartLegendContent />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </ChartCard>
  );
};

export default SteamRecommendationChart;
