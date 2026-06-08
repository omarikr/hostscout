"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LensProps {
  children: React.ReactNode;
  isStatic?: boolean;
}

export function Lens({ children, isStatic = false }: LensProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", !isStatic && "cursor-pointer")}
      onMouseMove={!isStatic ? handleMouseMove : undefined}
      onMouseEnter={() => !isStatic && setIsHovering(true)}
      onMouseLeave={() => !isStatic && setIsHovering(false)}
    >
      {children}
      {!isStatic && isHovering && (
        <div
          className="absolute pointer-events-none rounded-full bg-white/20 blur-xl"
          style={{
            width: "200px",
            height: "200px",
            left: mousePosition.x - 100,
            top: mousePosition.y - 100,
          }}
        />
      )}
    </div>
  );
}
