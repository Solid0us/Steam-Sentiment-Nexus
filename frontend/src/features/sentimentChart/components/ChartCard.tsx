import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface ChartCardProps {
  children: ReactNode;
}
const ChartCard = ({ children }: ChartCardProps) => {
  return <Card className="max-w-5xl w-full bg-slate-800">{children}</Card>;
};

export default ChartCard;
