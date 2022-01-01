// Species are divided into 1 or more forms, including a default form
// Some things are defined on the species and others on the form
// In the JSON, all of the default form info is in the same object as the species
// However alternate forms are stored elsewhere

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

// An individual pokemon species, used as a basis and combined with a form to create a FullSpeciesData
export type Species = Readonly<{
    id: string;
    name: string;
    egg: {
        groups: string[];
        stepsToHatch: number;
    };
    growthRate: string;
    isBaby: boolean;
    isLegendary: boolean;
    isMythical: boolean;
    shape: string;
    color: string;
    genderRate: number;
    baseEXP: number;
    catchRate: number;
    baseHappiness: number;
    moves: {
        levelLearnset: SpeciesLevelMove[];
        tutorMoveIds: string[];
        eggMoveIds: string[];
    };
    height: number;
    weight: number;
    genus: string;
    flavor: string;
    generation: number;
}>

export type Form = Readonly<{
    abilityIds: string[];
    hiddenAbilityIds: string[];
    types: string[];
    baseStats: Statistics;
    evYields: Statistics;
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