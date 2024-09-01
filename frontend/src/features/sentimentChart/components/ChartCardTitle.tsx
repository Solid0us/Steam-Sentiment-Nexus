import { CardTitle } from "@/components/ui/card";
interface ChartCardTitleProps {
  title: string;
}
const ChartCardTitle = ({ title }: ChartCardTitleProps) => {
  return <CardTitle className="text-primary text-center">{title}</CardTitle>;
};

export default ChartCardTitle;
