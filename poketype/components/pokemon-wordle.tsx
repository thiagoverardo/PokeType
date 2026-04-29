"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Pokemon, 
  PokemonType, 
  TypeMatchups, 
  GuessResult, 
  TYPE_LIST, 
  TypeMatchStatus,
  SPECIAL_ABILITIES,
  POKEMON_WITH_SPECIAL_ABILITIES,
  MEGA_EVOLUTIONS,
  Ability
} from "@/lib/pokemon-data";
import { HintsDisplay } from "./hints-display";
import { GuessInput } from "./guess-input";
import { GuessGrid } from "./guess-grid";
import { GameOver } from "./game-over";
import { Spinner } from "@/components/ui/spinner";

const MAX_ATTEMPTS = 6;

// Total regular Pokémon through Gen 9 (Scarlet/Violet) = 1025
const TOTAL_POKEMON = 1025;

export function PokemonWordle() {
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState<Pokemon | null>(null);
  const [answerSprite, setAnswerSprite] = useState<string>("");
  const [isMegaAnswer, setIsMegaAnswer] = useState(false);
  const [megaDisplayName, setMegaDisplayName] = useState<string | null>(null);
  const [matchups, setMatchups] = useState<TypeMatchups | null>(null);
  const [activeAbility, setActiveAbility] = useState<Ability | null>(null);
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateMatchups = useCallback(async (types: PokemonType[]): Promise<TypeMatchups> => {
    const multipliers: Record<string, number> = {};
    TYPE_LIST.forEach((t) => (multipliers[t] = 1));

    for (const type of types) {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data = await res.json();

      data.damage_relations.double_damage_from.forEach((t: { name: string }) => {
        multipliers[t.name] *= 2;
      });
      data.damage_relations.half_damage_from.forEach((t: { name: string }) => {
        multipliers[t.name] *= 0.5;
      });
      data.damage_relations.no_damage_from.forEach((t: { name: string }) => {
        multipliers[t.name] *= 0;
      });
    }

    const result: TypeMatchups = {
      weak2: [], weak1: [], res05: [], res025: [], immune: []
    };

    Object.keys(multipliers).forEach((type) => {
      const val = multipliers[type];
      if (val === 0) result.immune.push(type as PokemonType);
      else if (val >= 2) result.weak2.push(type as PokemonType);
      else if (val === 1) result.weak1.push(type as PokemonType);
      else if (val === 0.5) result.res05.push(type as PokemonType);
      else if (val <= 0.25) result.res025.push(type as PokemonType);
    });

    return result;
  }, []);

  const initGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    setGuesses([]);
    setGameOver(false);
    setWon(false);
    setActiveAbility(null);
    setIsMegaAnswer(false);
    setMegaDisplayName(null);

    try {
      // Load full Pokémon list if not yet loaded
      let currentList = pokemonList;
      if (currentList.length === 0) {
        const listRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`);
        const listData = await listRes.json();
        const regularNames: string[] = listData.results.map((p: { name: string }) => p.name);
        // Also add mega names for search
        const megaNames = MEGA_EVOLUTIONS.map(m => m.name);
        const allNames = [...new Set([...regularNames, ...megaNames])];
        setPokemonList(allNames);
        currentList = allNames;
      }

      // 15% chance of mega evolution, 15% chance of special ability Pokémon
      const roll = Math.random();
      let pokemon: Pokemon;
      let ability: Ability | null = null;
      let spriteUrl: string;
      let isMega = false;
      let displayName: string | null = null;

      if (roll < 0.15) {
        // Pick a random Mega Evolution
        const mega = MEGA_EVOLUTIONS[Math.floor(Math.random() * MEGA_EVOLUTIONS.length)];
        pokemon = {
          name: mega.name,
          types: mega.types as PokemonType[],
        };
        isMega = true;
        displayName = mega.display;

        // Fetch sprite from PokeAPI (mega forms have their own IDs)
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${mega.name}`);
          const data = await res.json();
          spriteUrl = data.sprites.front_default ||
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
        } catch {
          spriteUrl = "";
        }
      } else if (roll < 0.30 && POKEMON_WITH_SPECIAL_ABILITIES.length > 0) {
        // Pick a special-ability Pokémon
        const special = POKEMON_WITH_SPECIAL_ABILITIES[
          Math.floor(Math.random() * POKEMON_WITH_SPECIAL_ABILITIES.length)
        ];
        ability = SPECIAL_ABILITIES[special.ability] || null;

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${special.id}`);
        const data = await res.json();
        pokemon = {
          name: data.name,
          types: data.types.map((t: { type: { name: string } }) => t.type.name as PokemonType),
        };
        spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
      } else {
        // Pick a random regular Pokémon (Gen 1–9)
        const id = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();
        pokemon = {
          name: data.name,
          types: data.types.map((t: { type: { name: string } }) => t.type.name as PokemonType),
        };
        spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
      }

      setAnswer(pokemon);
      setAnswerSprite(spriteUrl);
      setIsMegaAnswer(isMega);
      setMegaDisplayName(displayName);
      setActiveAbility(ability);

      let calculatedMatchups = await calculateMatchups(pokemon.types);
      if (ability) {
        calculatedMatchups = ability.effect(calculatedMatchups);
      }
      setMatchups(calculatedMatchups);
    } catch {
      setError("Error loading game. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pokemonList.length, calculateMatchups]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const getTypeStatus = (guessTypes: PokemonType[], answerTypes: PokemonType[]): TypeMatchStatus[] => {
    return guessTypes.map((type, index) => {
      if (answerTypes[index] === type) return "correct";
      if (answerTypes.includes(type)) return "wrong-position";
      return "wrong";
    });
  };

  const handleGuess = async (name: string) => {
    if (!answer || gameOver) return;

    if (!pokemonList.includes(name)) {
      setError("Pokémon inválido. Escolha um da lista.");
      return;
    }

    setError(null);

    try {
      let guessTypes: PokemonType[];
      let sprite: string;
      let isMegaGuess = false;

      const megaMatch = MEGA_EVOLUTIONS.find(m => m.name === name);
      if (megaMatch) {
        guessTypes = megaMatch.types as PokemonType[];
        isMegaGuess = true;
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          const data = await res.json();
          sprite = data.sprites.front_default ||
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
        } catch {
          sprite = "";
        }
      } else {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await res.json();
        guessTypes = data.types.map(
          (t: { type: { name: string } }) => t.type.name as PokemonType
        );
        sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
      }

      const status = getTypeStatus(guessTypes, answer.types);

      const newGuess: GuessResult = {
        name,
        types: guessTypes,
        status,
        sprite,
        isMega: isMegaGuess,
      };

      const newGuesses = [...guesses, newGuess];
      setGuesses(newGuesses);

      if (name === answer.name) {
        setWon(true);
        setGameOver(true);
      } else if (newGuesses.length >= MAX_ATTEMPTS) {
        setGameOver(true);
      }
    } catch {
      setError("Erro ao verificar o Pokémon. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Spinner className="h-12 w-12 text-primary" />
        <p className="text-muted-foreground">Carregando jogo...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-black tracking-tight">
          <span className="text-[#3b82f6] drop-shadow-[2px_2px_0px_#1e3a8a]">Poké</span>
          <span className="text-[#facc15] drop-shadow-[2px_2px_0px_#a16207]">Type</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Guess any Pokémon (or Mega Evolution!) with the matching types!
        </p>
      </header>

      <div className="w-full max-w-lg space-y-6">
        {!gameOver && (
          <p className="text-center text-sm text-muted-foreground">
            Attempts: {guesses.length} / {MAX_ATTEMPTS}
          </p>
        )}

        {isMegaAnswer && !gameOver && (
          <div className="rounded-lg bg-yellow-500/20 border border-yellow-500/40 p-3 text-center">
            <p className="text-sm font-medium text-yellow-300">
              ✨ This is a <span className="font-bold">Mega Evolution</span>!
            </p>
            <p className="text-xs text-yellow-400 mt-1">
              Search for mega forms like "charizard-mega-x" or "gengar-mega"
            </p>
          </div>
        )}

        {activeAbility && !gameOver && (
          <div className="rounded-lg bg-purple-500/20 border border-purple-500/40 p-3 text-center">
            <p className="text-sm font-medium text-purple-300">
              Special Ability Active: <span className="font-bold">{activeAbility.displayName}</span>
            </p>
            <p className="text-xs text-purple-400 mt-1">
              Type matchups have been altered by the ability!
            </p>
          </div>
        )}

        {matchups && !gameOver && <HintsDisplay matchups={matchups} />}

        {error && (
          <p className="rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        {gameOver && answer ? (
          <GameOver
            won={won}
            answer={answer}
            answerSprite={answerSprite}
            attempts={guesses.length}
            ability={activeAbility}
            isMega={isMegaAnswer}
            megaDisplayName={megaDisplayName}
            onPlayAgain={initGame}
          />
        ) : (
          <GuessInput
            pokemonList={pokemonList}
            onGuess={handleGuess}
            disabled={gameOver}
          />
        )}

        <GuessGrid guesses={guesses} />
      </div>
    </div>
  );
}
