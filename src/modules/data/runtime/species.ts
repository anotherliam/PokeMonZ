type Statistics = {
    mhp: number;
    atk: number;
    def: number;
    spatk: number;
    spdef: number;
    spd: number;
}

type SpeciesLevelMove = Readonly<{
    level: number;
    moveId: string;
}>

type SpeciesWildItem = Readonly<{
    itemId: string;
    chance: number;
}>

export type SpeciesData = Readonly<{
    id: string;
    name: string;
    typeIds: string[];
    baseStats: Statistics;
    evYields: Statistics;
    genderRate: number;
    growthRate: string;
    baseEXP: number;
    catchRate: number;
    baseHappiness: number;
    abilityIds: string[];
    hiddenAbilityIds: string[];
    moves: {
        levelLearnset: SpeciesLevelMove[];
        tutorMoveIds: string[];
        eggMoveIds: string[];
    };
    egg: {
        groups: string[];
        stepsToHatch: number;
    };
    height: number;
    weight: number;
    shape: string;
    color: string;
    genus: string;
    flavor: string;
    generation: number;
    wildItems: SpeciesWildItem[];
}>

export const Species: SpeciesData[] = [{
    id: "bulbasaur",
    name: "Bulbasaur",
    typeIds: ["grass", "poison"],
    baseStats: {
        mhp: 45,
        atk: 49,
        def: 49,
        spd: 45,
        spatk: 65,
        spdef: 65
    },
    evYields: {
        mhp: 0,
        atk: 0,
        def: 0,
        spd: 0,
        spatk: 1,
        spdef: 0
    },
    genderRate: 1,
    growthRate: "medium_fast",
    baseEXP: 64,
    catchRate: 45,
    baseHappiness: 70,
    abilityIds: ["overgrow"],
    hiddenAbilityIds: ["chlorophyll"],
    moves: {
        levelLearnset: [
            { moveId: "tackle", level: 1 }
        ],
        tutorMoveIds: [],
        eggMoveIds: [],
    },
    egg: {
        groups: ["monster", "grass"],
        stepsToHatch: 5120,
    },
    height: 0.7,
    weight: 6.9,
    shape: "Quadruped",
    color: "Green",
    genus: "Seed",
    flavor: "There is a plant seed on its back right from the day this Pokémon is born. The seed slowly grows larger.",
    generation: 1,
    wildItems: [],

}];
export const SpeciesById = new Map<string, SpeciesData>();
Species.forEach((species) => {
    if (SpeciesById.has(species.id)) {
        throw Error(`Species ${species.id} is defined twice`);
    } else {
        SpeciesById.set(species.id, species);
    }
})