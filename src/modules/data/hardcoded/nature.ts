import addToWindow from "../../../globalModules";
import { StatName } from "../../statistic";

type NatureStatChange = [StatName, number];

export default class Nature {
  id: string;
  name: string;
  statChanges: NatureStatChange[];

  static data: Nature[] = [];
  static dataById = new Map<string, Nature>();

  static register(nature: Nature) {
    if (this.dataById.has(nature.id)) {
      throw Error(`Duplicate Nature ${nature.id}`);
    }
    this.data.push(nature);
    this.dataById.set(nature.id, nature);
  }

  constructor(id: string, name: string, statChanges: NatureStatChange[]) {
    this.id = id;
    this.name = name;
    this.statChanges = statChanges;
  }
}

Nature.register({
  id: "hardy",
  name: "Hardy",
  statChanges: [],
});

Nature.register({
  id: "lonely",
  name: "Lonely",
  statChanges: [
    ["atk", 1.1],
    ["def", 0.9],
  ],
});

Nature.register({
  id: "brave",
  name: "Brave",
  statChanges: [
    ["atk", 1.1],
    ["spd", 0.9],
  ],
});

Nature.register({
  id: "adamant",
  name: "Adamant",
  statChanges: [
    ["atk", 1.1],
    ["spatk", 0.9],
  ],
});

Nature.register({
  id: "naughty",
  name: "Naughty",
  statChanges: [
    ["atk", 1.1],
    ["spdef", 0.9],
  ],
});

Nature.register({
  id: "bold",
  name: "Bold",
  statChanges: [
    ["def", 1.1],
    ["atk", 0.9],
  ],
});

Nature.register({
  id: "docile",
  name: "Docile",
  statChanges: [],
});

Nature.register({
  id: "relaxed",
  name: "Relaxed",
  statChanges: [
    ["def", 1.1],
    ["spd", 0.9],
  ],
});

Nature.register({
  id: "impish",
  name: "Impish",
  statChanges: [
    ["def", 1.1],
    ["spatk", 0.9],
  ],
});

Nature.register({
  id: "lax",
  name: "Lax",
  statChanges: [
    ["def", 1.1],
    ["spdef", 0.9],
  ],
});

Nature.register({
  id: "timid",
  name: "Timid",
  statChanges: [
    ["spd", 1.1],
    ["atk", 0.9],
  ],
});

Nature.register({
  id: "hasty",
  name: "Hasty",
  statChanges: [
    ["spd", 1.1],
    ["def", 0.9],
  ],
});

Nature.register({
  id: "serious",
  name: "Serious",
  statChanges: [],
});

Nature.register({
  id: "jolly",
  name: "Jolly",
  statChanges: [
    ["spd", 1.1],
    ["spatk", 0.9],
  ],
});

Nature.register({
  id: "naive",
  name: "Naive",
  statChanges: [
    ["spd", 1.1],
    ["spdef", 0.9],
  ],
});

Nature.register({
  id: "modest",
  name: "Modest",
  statChanges: [
    ["spatk", 1.1],
    ["atk", 0.9],
  ],
});

Nature.register({
  id: "mild",
  name: "Mild",
  statChanges: [
    ["spatk", 1.1],
    ["def", 0.9],
  ],
});

Nature.register({
  id: "quiet",
  name: "Quiet",
  statChanges: [
    ["spatk", 1.1],
    ["spd", 0.9],
  ],
});

Nature.register({
  id: "bashful",
  name: "Bashful",
  statChanges: [],
});

Nature.register({
  id: "rash",
  name: "Rash",
  statChanges: [
    ["spatk", 1.1],
    ["spdef", 0.9],
  ],
});

Nature.register({
  id: "calm",
  name: "Calm",
  statChanges: [
    ["spdef", 1.1],
    ["atk", 0.9],
  ],
});

Nature.register({
  id: "gentle",
  name: "Gentle",
  statChanges: [
    ["spdef", 1.1],
    ["def", 0.9],
  ],
});

Nature.register({
  id: "sassy",
  name: "Sassy",
  statChanges: [
    ["spdef", 1.1],
    ["spd", 0.9],
  ],
});

Nature.register({
  id: "careful",
  name: "Careful",
  statChanges: [
    ["spdef", 1.1],
    ["spatk", 0.9],
  ],
});

Nature.register({
  id: "quirky",
  name: "Quirky",
  statChanges: [],
});

addToWindow("Nature", Nature);
