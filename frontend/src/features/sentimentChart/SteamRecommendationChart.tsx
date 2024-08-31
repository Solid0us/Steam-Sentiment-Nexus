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
const chartConfig = {
  steamPositives: {
    label: "Recommended",
    color: "hsl(var(--chart-1))",
  },
  steamNegatives: {
    label: "Not Recommended",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface SteamRecommendationChartProps {
  selectedGame: SteamGames | undefined;
  gameReviews: GetReviewsByGameIdData | undefined;
}

const SteamRecommendationChart = ({
  gameReviews,
  selectedGame,
}: SteamRecommendationChartProps) => {
  return (
    <ChartCard
      title="Steam Recommendation"
      description="Steam recommendation scores over time."
    >
      <ChartContainer config={chartConfig}>
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
          <ChartLegend
            className="text-white"
            content={<ChartLegendContent />}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
};

export default SteamRecommendationChart;
