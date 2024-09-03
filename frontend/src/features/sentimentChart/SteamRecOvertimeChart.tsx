import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { GetReviewsByGameIdData } from "@/services/gameServices";
import { Label } from "@/components/ui/label";
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
    label: "Percentage Positive",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type PercentPositiveData = {
  percent: number;
  createdDate: Date;
  endDate: Date;
}[];

interface SteamRecOvertimeChartProps {
  gameReviews: GetReviewsByGameIdData | undefined;
  percentView: boolean;
  setPercentView: React.Dispatch<React.SetStateAction<boolean>>;
}

const SteamRecOvertimeChart = ({
  gameReviews,
  percentView,
  setPercentView,
}: SteamRecOvertimeChartProps) => {
  const [percentPositiveData, setPercentPositiveData] =
    useState<PercentPositiveData>([]);

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
    <div className="flex flex-col w-full items-center">
      <Label className="text-primary-foreground p-2">
        {percentView
          ? "Steam Recommendation in Percent Over Time"
          : "Steam Total Recommendations Over Time"}
      </Label>
      <ChartContainer className="w-full" config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={percentView ? percentPositiveData : gameReviews?.reviews ?? []}
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
    </div>
  );
};

export default SteamRecOvertimeChart;
