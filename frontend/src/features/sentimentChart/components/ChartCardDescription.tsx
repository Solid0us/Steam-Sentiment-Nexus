import { CardDescription } from "@/components/ui/card";

interface ChartCardDescriptionProps {
  description: string;
}
const ChartCardDescription = ({ description }: ChartCardDescriptionProps) => {
  return (
    <CardDescription className="text-primary-foreground text-center">
      {description}
    </CardDescription>
  );
};

export default ChartCardDescription;
