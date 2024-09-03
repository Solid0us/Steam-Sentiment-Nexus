import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { GetReviewsByGameIdData } from "@/services/gameServices";
import { useEffect, useState } from "react";

const chartConfig = {
  avgSteamPos: {
    label: "Recommended",
    color: "hsl(var(--chart-1))",
  },
  avgSteamNeg: {
    label: "Not Recommended",
    color: "hsl(var(--chart-2))",
  },
  percent: {
    label: "Percentage Positve",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface SteamRecPastMonthOvertimeChartProps {
  gameReviews: GetReviewsByGameIdData | undefined;
}

const SteamRecPastMonthOvertimeChart = ({
  gameReviews,
}: SteamRecPastMonthOvertimeChartProps) => {
  return (
    <div className="flex flex-col w-full items-center">
      <Label className="text-primary-foreground p-2">
        Steam Recommendation Over Time
      </Label>
      <ChartContainer className="w-full" config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={gameReviews?.reviews ?? []}
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

          <>
            <Line
              dataKey="avgSteamPos"
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
              dataKey="avgSteamNeg"
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

          <ChartLegend
            className="text-white"
            content={<ChartLegendContent />}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default SteamRecPastMonthOvertimeChart;
