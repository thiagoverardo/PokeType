"use client";

import { PokemonType } from "@/lib/pokemon-data";

interface TypeIconProps {
  type: PokemonType;
  className?: string;
}

export function TypeIcon({ type, className = "w-4 h-4" }: TypeIconProps) {
  const icons: Record<PokemonType, React.ReactNode> = {
    normal: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <circle cx="12" cy="12" r="8" />
      </svg>
    ),
    fire: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10zm0 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
      </svg>
    ),
    water: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2c-4 6-6 8-6 12a6 6 0 0 0 12 0c0-4-2-6-6-12z" />
      </svg>
    ),
    electric: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
      </svg>
    ),
    grass: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 4 7l6-9 6 9c2.5-1.5 4-4 4-7 0-5.5-4.5-10-10-10z" />
      </svg>
    ),
    ice: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l2 6 6-2-4 4 4 4-6-2-2 6-2-6-6 2 4-4-4-4 6 2z" />
      </svg>
    ),
    fighting: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M5 4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v6a3 3 0 0 0 6 0v-6h1a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" transform="translate(2, 2)" />
      </svg>
    ),
    poison: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <circle cx="12" cy="8" r="4" />
        <circle cx="12" cy="16" r="3" />
      </svg>
    ),
    ground: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M2 18l10-14 10 14H2z" />
      </svg>
    ),
    flying: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3 12c0-2 1-4 3-5l6 3 6-3c2 1 3 3 3 5s-1 4-3 5l-6-3-6 3c-2-1-3-3-3-5z" />
      </svg>
    ),
    psychic: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2c-1 4-3 6-3 10s3 6 3 10c0-4 3-6 3-10s-2-6-3-10z" />
      </svg>
    ),
    bug: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <ellipse cx="12" cy="8" rx="4" ry="3" />
        <ellipse cx="12" cy="15" rx="5" ry="4" />
        <circle cx="10" cy="7" r="1.5" fill="white" />
        <circle cx="14" cy="7" r="1.5" fill="white" />
      </svg>
    ),
    rock: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4 18l3-10 5 4 5-4 3 10H4z" />
      </svg>
    ),
    ghost: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C8 2 5 5 5 9v11c0 0 2-2 3.5-2s2 2 3.5 2 2-2 3.5-2 3.5 2 3.5 2V9c0-4-3-7-7-7z" />
      </svg>
    ),
    dragon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L8 8l-4-2 2 6-4 4h6l2 6 2-6h6l-4-4 2-6-4 2z" />
      </svg>
    ),
    dark: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 3a9 9 0 1 0 9 9c0-1-.2-2-.5-3a7 7 0 0 1-5.5 2.5 7 7 0 0 1-7-7c0-1.5.5-3 1.5-4-.8-.3-1.6-.5-2.5-.5z" />
      </svg>
    ),
    steel: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
      </svg>
    ),
    fairy: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />
        <circle cx="12" cy="16" r="4" />
      </svg>
    ),
  };

  return icons[type] || null;
}
