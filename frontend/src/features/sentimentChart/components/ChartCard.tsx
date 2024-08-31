import React, { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}
const ChartCard = ({ children, title, description }: ChartCardProps) => {
  return (
    <Card className="max-w-5xl w-full bg-slate-800">
      <CardHeader>
        <CardTitle className="text-primary text-center">{title}</CardTitle>
        <CardDescription className="text-primary-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ChartCard;
