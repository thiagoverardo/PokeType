"use client";

import { TypeMatchups, PokemonType } from "@/lib/pokemon-data";
import { TypeBadge } from "./type-badge";

interface HintsDisplayProps {
  matchups: TypeMatchups;
}

interface HintRowProps {
  label: string;
  types: PokemonType[];
}

function HintRow({ label, types }: HintRowProps) {
  if (types.length === 0) return null;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      <div className="flex flex-wrap justify-center gap-2">
        {types.map((type) => (
          <TypeBadge key={type} type={type} size="sm" />
        ))}
      </div>
    </div>
  );
}

export function HintsDisplay({ matchups }: HintsDisplayProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card p-6 border border-border">
      <h2 className="text-center text-lg font-bold text-foreground">Type Hints</h2>
      <div className="grid gap-4">
        <HintRow label="Weak x2" types={matchups.weak2} />
        <HintRow label="Neutral x1" types={matchups.weak1} />
        <HintRow label="Resistant x0.5" types={matchups.res05} />
        <HintRow label="Very Resistant x0.25" types={matchups.res025} />
        {matchups.immune.length > 0 && (
          <HintRow label="Immune x0" types={matchups.immune} />
        )}
      </div>
    </div>
  );
}
