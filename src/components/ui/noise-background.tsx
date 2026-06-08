"use client";

import { cn } from "@/lib/utils";

interface NoiseBackgroundProps {
  children: React.ReactNode;
  containerClassName?: string;
  gradientColors?: string[];
}

export function NoiseBackground({ 
  children, 
  containerClassName,
  gradientColors = ["rgb(255, 100, 150)", "rgb(100, 150, 255)", "rgb(255, 200, 100)"]
}: NoiseBackgroundProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <div 
        className="absolute inset-0 rounded-full opacity-50"
        style={{
          background: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
          filter: "blur(8px)",
          animation: "gradient-rotate 3s linear infinite",
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
      <style jsx>{`
        @keyframes gradient-rotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
