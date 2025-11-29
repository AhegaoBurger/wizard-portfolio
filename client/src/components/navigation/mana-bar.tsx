
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ManaBarProps {
  mobile?: boolean;
}

export default function ManaBar({ mobile = false }: ManaBarProps) {
  const [scrollPercentage, setScrollPercentage] = useState(100);
  const [isLow, setIsLow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const percentage =
        100 - Math.min(100, (currentScroll / scrollHeight) * 100);

      setScrollPercentage(percentage);
      setIsLow(percentage < 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Flicker effect when mana is low
  useEffect(() => {
    if (!isLow) return;

    const interval = setInterval(() => {
      setIsLow((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, [isLow]);

  if (mobile) {
    return (
      <div className={cn("flex-1 max-w-32")}>
        <div className="w-full h-4 border border-white bg-black flex">
          <div
            className={`h-full ${isLow ? "bg-pattern-diagonal" : "bg-white"}`}
            style={{ width: `${scrollPercentage}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-40">
      <div className="text-white text-xs text-center mb-1">WIZARD MANA</div>
      <div className="w-full h-4 border border-white bg-black flex">
        <div
          className={`h-full ${isLow ? "bg-pattern-diagonal" : "bg-white"}`}
          style={{ width: `${scrollPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
