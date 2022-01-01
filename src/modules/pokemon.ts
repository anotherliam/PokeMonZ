import Move, { SavedMove } from "./move";
import { SpeciesById, SpeciesData } from "./data/runtime/species";
import { nanoid } from "nanoid";
import {
  Statistics,
  StatNames,
  createBasicStats,
  createZeroStats,
  StatName,
} from "./statistic";
import randFromArray from "../utils/randFromArray";
import Nature from "./data/hardcoded/nature";
import addToWindow from "../globalModules";

//
// This module deals with a Pokemon itself
//

export default class Pokemon {
  uid: string;
  nickname: string | null;
  species: SpeciesData;
  currentForm: string | null; // Null if in default form
  trainerId: string;
  lv: number;
  stats: Statistics;
  chp: number;
  evs: Statistics;
  ivs: Statistics;
  nature: Nature;
  moves: Move[];
  stepsToHatch: number;
  isShiny: boolean;

  private calculateHp(base: number, level: number, iv: number, ev: number) {
    return base === 1 // If base is 1, then hp is always 1 (for shedninja)
      ? 1
      : Math.floor(((base * 2 + iv + ev / 4) * level) / 100) + level + 10;
  }

  private calculateStat(
    base: number,
    level: number,
    iv: number,
    ev: number,
    natureMult: number
  ) {
    return Math.floor(
      ((Math.floor(((base * 2 + iv + ev / 4) * level) / 100) + 5) *
        natureMult) /
        100
    );
  }

  private getNatureMultForStat(stat: StatName) {
    const result = this.nature.statChanges.find(
      ([statChangeName]) => statChangeName === stat
    );
    if (result) {
      return result[1];
    }
    return 1.0;
  }

  constructor(savedPokemon: SavedPokemon);
  constructor(speciesId: string, lv?: number, ownerId?: string);
  constructor(
    speciesId: string | SavedPokemon,
    lv = 5,
    ownerId: string = $pmz.player.trainerId
  ) {
    if (isSavedPokemon(speciesId)) {
      const saved = speciesId;
      // Find species
      const species = SpeciesById.get(saved.speciesId);
      if (!species) {
        throw Error(
          `Invalid Species when restoring Pokemon ${saved.uid}, ${saved.speciesId}`
        );
      }
      const nature = Nature.dataById.get(saved.natureId);
      if (!nature) {
        throw Error(
          `Invalid Nature when restoring Pokemon ${saved.uid}, ${saved.natureId}`
        );
      }
      // Restore pokemon
      this.uid = saved.uid;
      this.nickname = saved.nickname;
      this.species = species;
      this.trainerId = saved.trainerId;
      this.currentForm = saved.currentFormId;
      this.evs = saved.evs;
      this.ivs = saved.ivs;
      this.lv = saved.lv;
      this.stats = saved.stats;
      this.chp = saved.chp;
      this.isShiny = saved.isShiny;
      this.nature = nature;
      this.moves = saved.moves.map((savedMove) => new Move(savedMove));
      this.stepsToHatch = saved.stepsToHatch;
    } else {
      // Create new
      const stats = createBasicStats();
      // Find species
      const species = SpeciesById.get(speciesId);
      if (!species) {
        throw Error(`Invalid Species: ${speciesId}`);
      }

      // Random nature
      const nature = randFromArray(Nature.data);
      if (!nature) throw Error("No natures are defined.");

      this.uid = nanoid(16);
      this.lv = lv;
      this.species = species;
      this.trainerId = ownerId;
      this.currentForm = null;
      this.nickname = null;
      this.stats = stats;
      this.chp = stats.mhp;
      this.evs = createZeroStats();
      this.ivs = createZeroStats();
      this.moves = [];
      this.stepsToHatch = 0;
      this.isShiny = false;
      this.nature = nature;

      this.calculateStats();
    }
  }

  /**
   * @param poke
   * @returns The display name (Nickname or species name) of the pokemon
   * @throws If the species of the pokemon is invalid or does not exist
   */
  get displayName() {
    return this.nickname !== null ? this.nickname : this.species.name;
  }

  /**
   * Calculates and updates the pokemons stats
   * Also recalcs current hp to keep the same difference
   * @param pokemon
   */
  calculateStats() {
    const hpDiff = this.stats.mhp - this.chp;
    const { baseStats } = this.species;
    StatNames.forEach((stat) => {
      const base = baseStats[stat];
      const iv = this.ivs[stat];
      const ev = this.evs[stat];
      if (stat === "mhp") {
        this.stats.mhp = this.calculateHp(base, this.lv, iv, ev);
      } else {
        const nature = this.getNatureMultForStat(stat);
        this.stats[stat] = this.calculateStat(base, this.lv, iv, ev, nature);
      }
    });
    // Recalculate current hp
    this.chp = this.stats.mhp - hpDiff;
  }

  /**
   * Creates a serialised version of this pokemon
   */
  save(): SavedPokemon {
    return {
      kind: "pokemon",
      uid: this.uid,
      nickname: this.nickname,
      speciesId: this.species.id,
      currentFormId: this.currentForm, // Null if in default form
      trainerId: this.trainerId,
      lv: this.lv,
      stats: this.stats,
      chp: this.chp,
      evs: this.evs,
      ivs: this.ivs,
      natureId: this.nature.id,
      moves: this.moves.map((move) => move.save()),
      stepsToHatch: this.stepsToHatch,
      isShiny: this.isShiny,
    };
  }

  /**
   * Creates a clone of this pokemon
   */
  clone() {
    return new Pokemon(this.save());
  }
}

// Add to window
addToWindow("Pokemon", Pokemon);

const isSavedPokemon = (value: string | SavedPokemon): value is SavedPokemon =>
  typeof value === "object" && value.kind === "pokemon";

type SavedPokemon = {
  kind: "pokemon";
  uid: string;
  nickname: string | null;
  speciesId: string;
  currentFormId: string | null;
  trainerId: string;
  lv: number;
  stats: Statistics;
  chp: number;
  evs: Statistics;
  ivs: Statistics;
  natureId: string;
  moves: SavedMove[];
  stepsToHatch: number;
  isShiny: boolean;
};
