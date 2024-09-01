import { CardDescription } from "@/components/ui/card";

interface ChartCardDescriptionProps {
  description: string;
}
const ChartCardDescription = ({ description }: ChartCardDescriptionProps) => {
  return (
    <CardDescription className="text-primary-foreground">
      {description}
    </CardDescription>
  );
};

export default ChartCardDescription;
