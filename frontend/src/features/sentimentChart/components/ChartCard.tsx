import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface ChartCardProps {
  children: ReactNode;
}
const ChartCard = ({ children }: ChartCardProps) => {
  return <Card className="w-full bg-slate-800">{children}</Card>;
};

export default ChartCard;
