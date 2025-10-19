import type { Locale } from "../config";
import { enDictionary } from "./en";
import { ruDictionary } from "./ru";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = {
  ru: ruDictionary,
  en: enDictionary,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale];
}

export type { Dictionary };
