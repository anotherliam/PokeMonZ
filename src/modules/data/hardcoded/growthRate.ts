import addToWindow from "../../../globalModules";

export default class GrowthRate {
  id: string;
  name: string;
  expToNext: (lv: number) => number;

  static data: GrowthRate[] = [];
  static dataById = new Map<string, GrowthRate>();

  static register(growthRate: GrowthRate) {
    if (this.dataById.has(growthRate.id)) {
      throw Error(`Duplicate GrowthRate ${growthRate.id}`);
    }
    this.data.push(growthRate);
    this.dataById.set(growthRate.id, growthRate);
  }

  constructor(id: string, name: string, expToNext: (lv: number) => number) {
    this.id = id;
    this.name = name;
    this.expToNext = expToNext;
  }
}

GrowthRate.register(
  new GrowthRate("medium_fast", "Medium Fast", (lv: number) => lv ** 3)
);

GrowthRate.register(
  new GrowthRate("erratic", "Erratic", (lv: number) =>
    lv <= 50
      ? (lv ** 3 * (100 - lv)) / 50
      : lv <= 68
      ? (lv ** 3 * (150 - lv)) / 100
      : lv <= 98
      ? lv ** 3 * Math.floor((1911 - 10 * lv) / 3)
      : (lv ** 3 * (160 - lv)) / 100
  )
);

GrowthRate.register(
  new GrowthRate(
    "fluctuating",
    "Fluctuating",
    (lv: number) =>
      (lv <= 15
        ? (Math.floor((lv + 1) / 3) + 24) / 50
        : lv <= 36
        ? (lv + 14) / 50
        : (Math.floor(lv / 2) + 32) / 50) *
      lv ** 3
  )
);

GrowthRate.register(
  new GrowthRate(
    "medium_slow",
    "Medium Slow",
    (lv: number) => (6 / 5) * lv ** 3 - (15 * lv ** 2 + 100 * lv - 140)
  )
);

GrowthRate.register(
  new GrowthRate("slow", "Slow", (lv: number) => (5 * lv ** 3) / 4)
);

GrowthRate.register(
  new GrowthRate("fast", "Fast", (lv: number) => (4 * lv ** 3) / 5)
);


addToWindow("GrowthRate", GrowthRate);
