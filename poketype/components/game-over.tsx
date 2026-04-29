"use client";

import { Button } from "@/components/ui/button";
import { Pokemon, Ability } from "@/lib/pokemon-data";
import { TypeBadge } from "./type-badge";
import Image from "next/image";

interface GameOverProps {
  won: boolean;
  answer: Pokemon;
  answerSprite: string;
  attempts: number;
  ability?: Ability | null;
  isMega?: boolean;
  megaDisplayName?: string | null;
  onPlayAgain: () => void;
}

export function GameOver({
  won,
  answer,
  answerSprite,
  attempts,
  ability,
  isMega,
  megaDisplayName,
  onPlayAgain,
}: GameOverProps) {
  const displayName = megaDisplayName || answer.name;

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl bg-card p-8 border border-border">
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          {won ? "Congratulations!" : "Game Over!"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {won
            ? `You got it in ${attempts} attempt${attempts > 1 ? "s" : ""}!`
            : "Better luck next time..."}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-muted-foreground">The Pokémon was:</p>
        <div className="flex flex-col items-center gap-2">
          {answerSprite && (
            <Image
              src={answerSprite}
              alt={displayName}
              width={96}
              height={96}
              className="pixelated"
              unoptimized
            />
          )}
          <span className="text-2xl font-bold capitalize text-foreground">
            {displayName}
          </span>
          {isMega && (
            <span className="text-xs font-semibold uppercase tracking-wider text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded-full">
              ✨ Mega Evolution
            </span>
          )}
          <div className="flex gap-2">
            {answer.types.map((type) => (
              <TypeBadge key={type} type={type} size="md" />
            ))}
          </div>
          {ability && (
            <p className="text-sm text-purple-400 mt-1">
              Ability: <span className="font-semibold">{ability.displayName}</span>
            </p>
          )}
        </div>
      </div>

      <Button onClick={onPlayAgain} size="lg" className="mt-2">
        Play Again
      </Button>
    </div>
  );
}
