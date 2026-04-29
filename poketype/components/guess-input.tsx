"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MEGA_EVOLUTIONS } from "@/lib/pokemon-data";
import Image from "next/image";

interface PokemonSuggestion {
  name: string;
  displayName: string;
  sprite: string;
  isMega: boolean;
}

interface GuessInputProps {
  pokemonList: string[];
  onGuess: (name: string) => void;
  disabled: boolean;
}

// Cache for mega sprites so we don't re-fetch every keystroke
const megaSpriteCache: Record<string, string> = {};

function formatDisplayName(name: string): string {
  const mega = MEGA_EVOLUTIONS.find(m => m.name === name);
  if (mega) return mega.display;
  return name
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function GuessInput({ pokemonList, onGuess, disabled }: GuessInputProps) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<PokemonSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const q = value.toLowerCase();
    const filtered = pokemonList
      .filter((name) => {
        const mega = MEGA_EVOLUTIONS.find(m => m.name === name);
        const display = mega ? mega.display.toLowerCase() : name;
        return name.includes(q) || display.includes(q);
      })
      .slice(0, 8);

    if (filtered.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const built: PokemonSuggestion[] = filtered.map((name, idx) => {
      const isMega = MEGA_EVOLUTIONS.some(m => m.name === name);
      // Sprite URL: for regular mons index+1 is the ID (since pokemonList is 1-indexed from API)
      // For mega forms we use a placeholder until cached
      const regularIdx = pokemonList.indexOf(name);
      // Regular Pokémon list from PokeAPI are sorted by ID, so index+1 ~ ID
      const sprite = isMega
        ? (megaSpriteCache[name] || "")
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${regularIdx + 1}.png`;

      return { name, displayName: formatDisplayName(name), sprite, isMega };
    });

    setSuggestions(built);
    setShowSuggestions(true);
    setSelectedIndex(-1);

    // Fetch sprites for mega forms asynchronously
    built.forEach(s => {
      if (s.isMega && !megaSpriteCache[s.name]) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${s.name}`)
          .then(r => r.json())
          .then(data => {
            const url = data.sprites?.front_default || "";
            megaSpriteCache[s.name] = url;
            setSuggestions(prev =>
              prev.map(p => p.name === s.name ? { ...p, sprite: url } : p)
            );
          })
          .catch(() => {});
      }
    });
  }, [value, pokemonList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onGuess(value.trim().toLowerCase());
      setValue("");
      setShowSuggestions(false);
    }
  };

  const handleSelect = (name: string) => {
    setValue(name);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex].name);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex gap-3">
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Type a Pokémon name..."
          disabled={disabled}
          className="h-12 bg-input text-foreground placeholder:text-muted-foreground"
        />
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-80 overflow-auto rounded-lg border border-border bg-popover shadow-lg">
            {suggestions.map((pokemon, index) => (
              <button
                key={pokemon.name}
                type="button"
                onClick={() => handleSelect(pokemon.name)}
                className={`w-full px-3 py-2 text-left text-foreground hover:bg-muted flex items-center gap-3 ${
                  index === selectedIndex ? "bg-muted" : ""
                }`}
              >
                {pokemon.sprite ? (
                  <Image
                    src={pokemon.sprite}
                    alt={pokemon.displayName}
                    width={40}
                    height={40}
                    className="pixelated"
                    unoptimized
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center text-lg">
                    {pokemon.isMega ? "✨" : "?"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="capitalize font-medium">{pokemon.displayName}</span>
                  {pokemon.isMega && (
                    <span className="text-xs text-yellow-400">Mega Evolution</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <Button type="submit" disabled={disabled || !value.trim()} className="h-12 px-6">
        Guess
      </Button>
    </form>
  );
}
