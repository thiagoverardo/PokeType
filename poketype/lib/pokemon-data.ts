export type PokemonType =
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "ice"
  | "dragon"
  | "dark"
  | "fairy"
  | "normal"
  | "fighting"
  | "flying"
  | "poison"
  | "ground"
  | "rock"
  | "bug"
  | "ghost"
  | "steel";

export const TYPE_LIST: PokemonType[] = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic",
  "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

export const typeNames: Record<PokemonType, string> = {
  fire: "fire", water: "water", grass: "grass", electric: "electric",
  psychic: "psychic", ice: "ice", dragon: "dragon", dark: "dark",
  fairy: "fairy", normal: "normal", fighting: "fighting", flying: "flying",
  poison: "poison", ground: "ground", rock: "rock", bug: "bug",
  ghost: "ghost", steel: "steel",
};

export const typeColors: Record<PokemonType, string> = {
  fire: "#f97316", water: "#3b82f6", grass: "#22c55e", electric: "#eab308",
  ice: "#67e8f9", fighting: "#b91c1c", poison: "#a855f7", ground: "#ca8a04",
  flying: "#60a5fa", psychic: "#ec4899", bug: "#84cc16", rock: "#a3a3a3",
  ghost: "#6366f1", dragon: "#7c3aed", dark: "#374151", steel: "#94a3b8",
  fairy: "#f9a8d4", normal: "#d1d5db"
};

export interface Pokemon {
  name: string;
  types: PokemonType[];
}

export interface TypeMatchups {
  weak2: PokemonType[];
  weak1: PokemonType[];
  res05: PokemonType[];
  res025: PokemonType[];
  immune: PokemonType[];
}

export type TypeMatchStatus = "correct" | "wrong-position" | "wrong";

export interface GuessResult {
  name: string;
  types: PokemonType[];
  status: TypeMatchStatus[];
  sprite?: string;
  isMega?: boolean;
}

export interface Ability {
  name: string;
  displayName: string;
  effect: (matchups: TypeMatchups) => TypeMatchups;
}

export const SPECIAL_ABILITIES: Record<string, Ability> = {
  "thick-fat": {
    name: "thick-fat", displayName: "Thick Fat",
    effect: (matchups) => ({
      ...matchups,
      weak2: matchups.weak2.filter(t => t !== "fire" && t !== "ice"),
      res05: [...matchups.res05, ...matchups.weak2.filter(t => t === "fire" || t === "ice")]
    })
  },
  "levitate": {
    name: "levitate", displayName: "Levitate",
    effect: (matchups) => ({
      ...matchups,
      weak2: matchups.weak2.filter(t => t !== "ground"),
      weak1: matchups.weak1.filter(t => t !== "ground"),
      immune: matchups.immune.includes("ground") ? matchups.immune : [...matchups.immune, "ground"]
    })
  },
  "flash-fire": {
    name: "flash-fire", displayName: "Flash Fire",
    effect: (matchups) => ({
      ...matchups,
      weak2: matchups.weak2.filter(t => t !== "fire"),
      weak1: matchups.weak1.filter(t => t !== "fire"),
      immune: matchups.immune.includes("fire") ? matchups.immune : [...matchups.immune, "fire"]
    })
  },
  "water-absorb": {
    name: "water-absorb", displayName: "Water Absorb",
    effect: (matchups) => ({
      ...matchups,
      weak2: matchups.weak2.filter(t => t !== "water"),
      weak1: matchups.weak1.filter(t => t !== "water"),
      immune: matchups.immune.includes("water") ? matchups.immune : [...matchups.immune, "water"]
    })
  },
  "volt-absorb": {
    name: "volt-absorb", displayName: "Volt Absorb",
    effect: (matchups) => ({
      ...matchups,
      weak2: matchups.weak2.filter(t => t !== "electric"),
      weak1: matchups.weak1.filter(t => t !== "electric"),
      immune: matchups.immune.includes("electric") ? matchups.immune : [...matchups.immune, "electric"]
    })
  },
  "lightning-rod": {
    name: "lightning-rod", displayName: "Lightning Rod",
    effect: (matchups) => ({
      ...matchups,
      weak2: matchups.weak2.filter(t => t !== "electric"),
      weak1: matchups.weak1.filter(t => t !== "electric"),
      immune: matchups.immune.includes("electric") ? matchups.immune : [...matchups.immune, "electric"]
    })
  },
  "motor-drive": {
    name: "motor-drive", displayName: "Motor Drive",
    effect: (matchups) => ({
      ...matchups,
      weak2: matchups.weak2.filter(t => t !== "electric"),
      weak1: matchups.weak1.filter(t => t !== "electric"),
      immune: matchups.immune.includes("electric") ? matchups.immune : [...matchups.immune, "electric"]
    })
  },
  "dry-skin": {
    name: "dry-skin", displayName: "Dry Skin",
    effect: (matchups) => ({
      ...matchups,
      weak2: matchups.weak2.includes("fire") ? matchups.weak2 : [...matchups.weak2, "fire"],
      immune: matchups.immune.includes("water") ? matchups.immune : [...matchups.immune, "water"]
    })
  },
  "storm-drain": {
    name: "storm-drain", displayName: "Storm Drain",
    effect: (matchups) => ({
      ...matchups,
      weak2: matchups.weak2.filter(t => t !== "water"),
      weak1: matchups.weak1.filter(t => t !== "water"),
      immune: matchups.immune.includes("water") ? matchups.immune : [...matchups.immune, "water"]
    })
  },
  "sap-sipper": {
    name: "sap-sipper", displayName: "Sap Sipper",
    effect: (matchups) => ({
      ...matchups,
      weak2: matchups.weak2.filter(t => t !== "grass"),
      weak1: matchups.weak1.filter(t => t !== "grass"),
      immune: matchups.immune.includes("grass") ? matchups.immune : [...matchups.immune, "grass"]
    })
  },
  "heatproof": {
    name: "heatproof", displayName: "Heatproof",
    effect: (matchups) => ({
      ...matchups,
      weak2: matchups.weak2.filter(t => t !== "fire"),
      res05: matchups.weak2.includes("fire") ? [...matchups.res05, "fire"] : matchups.res05
    })
  },
  "wonder-guard": {
    name: "wonder-guard", displayName: "Wonder Guard",
    effect: (matchups) => ({
      ...matchups,
      weak1: [], res05: [], res025: [],
      immune: [...TYPE_LIST.filter(t => !matchups.weak2.includes(t))]
    })
  }
};

export interface PokemonWithAbility {
  id: number;
  name: string;
  ability: string;
  isMega?: boolean;
}

export const POKEMON_WITH_SPECIAL_ABILITIES: PokemonWithAbility[] = [
  { id: 3, name: "venusaur", ability: "thick-fat" },
  { id: 143, name: "snorlax", ability: "thick-fat" },
  { id: 124, name: "jynx", ability: "dry-skin" },
  { id: 92, name: "gastly", ability: "levitate" },
  { id: 93, name: "haunter", ability: "levitate" },
  { id: 109, name: "koffing", ability: "levitate" },
  { id: 110, name: "weezing", ability: "levitate" },
  { id: 81, name: "magnemite", ability: "motor-drive" },
  { id: 82, name: "magneton", ability: "motor-drive" },
  { id: 135, name: "jolteon", ability: "volt-absorb" },
  { id: 134, name: "vaporeon", ability: "water-absorb" },
  { id: 131, name: "lapras", ability: "water-absorb" },
  { id: 59, name: "arcanine", ability: "flash-fire" },
  { id: 136, name: "flareon", ability: "flash-fire" },
  { id: 77, name: "ponyta", ability: "flash-fire" },
  { id: 78, name: "rapidash", ability: "flash-fire" },
  { id: 292, name: "shedinja", ability: "wonder-guard" },
];

// Mega Evolutions with their PokeAPI names and IDs
// IDs 10033–10115 are mega/primal forms in PokeAPI
export interface MegaEvolution {
  name: string;   // PokeAPI slug, e.g. "charizard-mega-x"
  display: string; // Human-readable, e.g. "Mega Charizard X"
  types: [PokemonType] | [PokemonType, PokemonType];
}

export const MEGA_EVOLUTIONS: MegaEvolution[] = [
  { name: "venusaur-mega",       display: "Mega Venusaur",      types: ["grass", "poison"] },
  { name: "charizard-mega-x",    display: "Mega Charizard X",   types: ["fire", "dragon"] },
  { name: "charizard-mega-y",    display: "Mega Charizard Y",   types: ["fire", "flying"] },
  { name: "blastoise-mega",      display: "Mega Blastoise",     types: ["water"] },
  { name: "beedrill-mega",       display: "Mega Beedrill",      types: ["bug", "poison"] },
  { name: "pidgeot-mega",        display: "Mega Pidgeot",       types: ["normal", "flying"] },
  { name: "slowbro-mega",        display: "Mega Slowbro",       types: ["water", "psychic"] },
  { name: "gengar-mega",         display: "Mega Gengar",        types: ["ghost", "poison"] },
  { name: "kangaskhan-mega",     display: "Mega Kangaskhan",    types: ["normal"] },
  { name: "pinsir-mega",         display: "Mega Pinsir",        types: ["bug", "flying"] },
  { name: "gyarados-mega",       display: "Mega Gyarados",      types: ["water", "dark"] },
  { name: "aerodactyl-mega",     display: "Mega Aerodactyl",    types: ["rock", "flying"] },
  { name: "mewtwo-mega-x",       display: "Mega Mewtwo X",      types: ["psychic", "fighting"] },
  { name: "mewtwo-mega-y",       display: "Mega Mewtwo Y",      types: ["psychic"] },
  { name: "ampharos-mega",       display: "Mega Ampharos",      types: ["electric", "dragon"] },
  { name: "steelix-mega",        display: "Mega Steelix",       types: ["steel", "ground"] },
  { name: "scizor-mega",         display: "Mega Scizor",        types: ["bug", "steel"] },
  { name: "heracross-mega",      display: "Mega Heracross",     types: ["bug", "fighting"] },
  { name: "houndoom-mega",       display: "Mega Houndoom",      types: ["dark", "fire"] },
  { name: "tyranitar-mega",      display: "Mega Tyranitar",     types: ["rock", "dark"] },
  { name: "blaziken-mega",       display: "Mega Blaziken",      types: ["fire", "fighting"] },
  { name: "gardevoir-mega",      display: "Mega Gardevoir",     types: ["psychic", "fairy"] },
  { name: "mawile-mega",         display: "Mega Mawile",        types: ["steel", "fairy"] },
  { name: "aggron-mega",         display: "Mega Aggron",        types: ["steel"] },
  { name: "medicham-mega",       display: "Mega Medicham",      types: ["fighting", "psychic"] },
  { name: "manectric-mega",      display: "Mega Manectric",     types: ["electric"] },
  { name: "banette-mega",        display: "Mega Banette",       types: ["ghost"] },
  { name: "absol-mega",          display: "Mega Absol",         types: ["dark"] },
  { name: "garchomp-mega",       display: "Mega Garchomp",      types: ["dragon", "ground"] },
  { name: "lucario-mega",        display: "Mega Lucario",       types: ["fighting", "steel"] },
  { name: "abomasnow-mega",      display: "Mega Abomasnow",     types: ["grass", "ice"] },
  { name: "alakazam-mega",       display: "Mega Alakazam",      types: ["psychic"] },
  { name: "gallade-mega",        display: "Mega Gallade",       types: ["psychic", "fighting"] },
  { name: "audino-mega",         display: "Mega Audino",        types: ["normal", "fairy"] },
  { name: "sharpedo-mega",       display: "Mega Sharpedo",      types: ["water", "dark"] },
  { name: "camerupt-mega",       display: "Mega Camerupt",      types: ["fire", "ground"] },
  { name: "altaria-mega",        display: "Mega Altaria",       types: ["dragon", "fairy"] },
  { name: "glalie-mega",         display: "Mega Glalie",        types: ["ice"] },
  { name: "salamence-mega",      display: "Mega Salamence",     types: ["dragon", "flying"] },
  { name: "metagross-mega",      display: "Mega Metagross",     types: ["steel", "psychic"] },
  { name: "latias-mega",         display: "Mega Latias",        types: ["dragon", "psychic"] },
  { name: "latios-mega",         display: "Mega Latios",        types: ["dragon", "psychic"] },
  { name: "rayquaza-mega",       display: "Mega Rayquaza",      types: ["dragon", "flying"] },
  { name: "lopunny-mega",        display: "Mega Lopunny",       types: ["normal", "fighting"] },
  { name: "diancie-mega",        display: "Mega Diancie",       types: ["rock", "fairy"] },
  { name: "sableye-mega",        display: "Mega Sableye",       types: ["dark", "ghost"] },
  { name: "swampert-mega",       display: "Mega Swampert",      types: ["water", "ground"] },
  { name: "sceptile-mega",       display: "Mega Sceptile",      types: ["grass", "dragon"] },
  { name: "pidgeot-mega",        display: "Mega Pidgeot",       types: ["normal", "flying"] },
  { name: "beedrill-mega",       display: "Mega Beedrill",      types: ["bug", "poison"] },
  // Primal Reversions
  { name: "kyogre-primal",       display: "Primal Kyogre",      types: ["water"] },
  { name: "groudon-primal",      display: "Primal Groudon",     types: ["ground", "fire"] },
];
