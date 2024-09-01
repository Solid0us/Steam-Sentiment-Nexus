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
import { CardContent, CardHeader } from "@/components/ui/card";
import ChartCardTitle from "./components/ChartCardTitle";
import ChartCardDescription from "./components/ChartCardDescription";
interface RobertaChartProps {
  selectedGame: SteamGames | undefined;
  gameReviews: GetReviewsByGameIdData | undefined;
}

const chartConfig = {
  robertaPosAvg: {
    label: "Positive",
    color: "hsl(var(--chart-1))",
  },
  robertaNeuAvg: {
    label: "Neutral",
    color: "hsl(var(--chart-2))",
  },
  robertaNegAvg: {
    label: "Negative",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const RobertaChart = ({ gameReviews, selectedGame }: RobertaChartProps) => {
  return (
    <ChartCard>
      <CardHeader>
        <ChartCardTitle title="RoBERTa Sentiment Scores" />
        <ChartCardDescription description="Sentiment scores using the RoBERTa model over time." />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={gameReviews?.reviews ?? []}>
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
              style={{
                fill: "#FFFFFF",
              }}
              axisLine={true}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="robertaPosAvg"
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
              dataKey="robertaNeuAvg"
              type="natural"
              stroke="#00ebf7"
              strokeWidth={2}
              dot={{
                fill: "#00ebf7",
              }}
              activeDot={{
                r: 6,
              }}
              name="Neutral"
            />

            <Line
              dataKey="robertaNegAvg"
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
              className="text-primary-foreground"
              content={<ChartLegendContent />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </ChartCard>
  );
};

export default RobertaChart;
