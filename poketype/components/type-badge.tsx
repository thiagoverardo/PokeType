"use client";

import { PokemonType, typeColors } from "@/lib/pokemon-data";
import { TypeIcon } from "./type-icon";

interface TypeBadgeProps {
  type: PokemonType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function TypeBadge({ type, size = "md", showLabel = true }: TypeBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2"
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg font-bold capitalize text-white shadow-md ${sizeClasses[size]}`}
      style={{ backgroundColor: typeColors[type] }}
    >
      <TypeIcon type={type} className={iconSizes[size]} />
      {showLabel && <span>{type}</span>}
    </span>
  );
}
