export type Statistics = {
    mhp: number;
    atk: number;
    def: number;
    spatk: number;
    spdef: number;
    spd: number;
}
export const StatNames = ["mhp", "atk", "def", "spatk", "spdef", "spd"] as const;
export type StatName = (typeof StatNames)[number];

export const createBasicStats = (): Statistics => ({
    mhp: 1,
    atk: 1,
    def: 1,
    spatk: 1,
    spdef: 1,
    spd: 1,
})
export const createZeroStats = (): Statistics => ({
    mhp: 0,
    atk: 0,
    def: 0,
    spatk: 0,
    spdef: 0,
    spd: 0,
})
