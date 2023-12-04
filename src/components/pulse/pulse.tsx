import { cn } from "@/lib/utils";
import "./pulse.css";

interface CirclePulseProps {
  className?: string;
}

const CirclePulse = ({ className }: CirclePulseProps) => {
  return <div className={cn("circle pulse", className)} />;
};

export default CirclePulse;
