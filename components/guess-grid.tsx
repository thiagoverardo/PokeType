"use client";

import { GuessResult, TypeMatchStatus } from "@/lib/pokemon-data";
import { MEGA_EVOLUTIONS } from "@/lib/pokemon-data";
import { TypeBadge } from "./type-badge";
import Image from "next/image";

interface GuessGridProps {
  guesses: GuessResult[];
}

function getStatusRing(status: TypeMatchStatus): string {
  switch (status) {
    case "correct":
      return "ring-2 ring-green-500 ring-offset-2 ring-offset-background";
    case "wrong-position":
      return "ring-2 ring-yellow-500 ring-offset-2 ring-offset-background";
    case "wrong":
      return "ring-2 ring-red-500 ring-offset-2 ring-offset-background";
  }
}

function getDisplayName(name: string): string {
  const mega = MEGA_EVOLUTIONS.find(m => m.name === name);
  if (mega) return mega.display;
  return name
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function GuessGrid({ guesses }: GuessGridProps) {
  if (guesses.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-center text-sm font-semibold text-muted-foreground">
        Your Guesses
      </h3>
      <div className="flex flex-col gap-2">
        {guesses.map((guess, index) => (
          <div
            key={index}
            className="flex items-center justify-center gap-3 rounded-lg bg-card p-3 border border-border"
          >
            {guess.sprite ? (
              <Image
                src={guess.sprite}
                alt={guess.name}
                width={40}
                height={40}
                className="pixelated"
                unoptimized
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center text-lg">
                {guess.isMega ? "✨" : "?"}
              </div>
            )}
            <div className="flex flex-col items-end min-w-28">
              <span className="font-semibold capitalize text-foreground text-right">
                {getDisplayName(guess.name)}
              </span>
              {guess.isMega && (
                <span className="text-xs text-yellow-400">Mega</span>
              )}
            </div>
            <div className="flex gap-2">
              {guess.types.map((type, typeIndex) => (
                <div
                  key={typeIndex}
                  className={`rounded-lg p-0.5 ${getStatusRing(guess.status[typeIndex])}`}
                >
                  <TypeBadge type={type} size="sm" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span>Correct type &amp; position</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Correct type, wrong position</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span>Wrong type</span>
        </div>
      </div>
    </div>
  );
}
