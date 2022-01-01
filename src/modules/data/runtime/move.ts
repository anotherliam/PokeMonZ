import { z } from "zod";
import addToWindow from "../../../globalModules";

/**
 * This is the info about a move after being loaded from json
 */

type MoveAilment = {
  type: string;
  chance: number;
};

const SpecialTargets = ["none"] as const;
const AllyTargets = [
  "user",
  "near_ally",
  "user_or_near_ally",
  "user_and_allies",
] as const;
const MixedTargets = ["near_other", "all_near_others", "other", "all"] as const;
const FieldTargets = ["user_side", "foe_side", "both_sides"] as const;
const EnemyTargets = [
  "near_foe",
  "all_near_foes",
  "random_near_foe",
  "foe",
] as const;
const MoveTargets = [
  ...SpecialTargets,
  ...AllyTargets,
  ...MixedTargets,
  ...FieldTargets,
  ...EnemyTargets,
] as const;

const MoveFlags = ["contact"] as const;
type MoveFlag = typeof MoveFlags[number];

type MoveTarget = typeof MoveTargets[number];

export default class Move {
  id: string;
  name: string;
  power: number;
  accuracy: number;
  category: "phys" | "spec" | "stat";
  type: string;
  pp: number;
  ailment: MoveAilment | null; // Is set if the move has a chance to cause a status effect
  effectCodes: string[]; // Additional effect codes that change how the move works
  flags: string[]; // Commong flags that affect how a move works
  priority: number; // -6 to 6
  target: MoveTarget;

  constructor(moveData: ValidatedMoveData) {
    this.id = moveData.id;
    this.name = moveData.name;
    this.power = moveData.power;
    this.accuracy = moveData.accuracy;
    this.category = moveData.category;
    this.type = moveData.type;
    this.pp = moveData.pp;
    this.ailment = moveData.ailment || null;
    this.flags = moveData.flags;
    this.effectCodes = moveData.effectCodes;
    this.priority = moveData.priority;
    this.target = moveData.target;
  }

  // Static stuff

  static data: Move[] = [];
  static dataById = new Map<string, Move>();

  static register(Move: Move) {
    if (this.dataById.has(Move.id)) {
      throw Error(`Duplicate Move ${Move.id}`);
    }
    this.data.push(Move);
    this.dataById.set(Move.id, Move);
  }

  static processData(val: unknown) {
    if (Array.isArray(val)) {
      val.forEach((item) => {
        const parsed = moveDataValidator.parse(item);
        this.register(new Move(parsed));
      });
    } else {
      throw Error("Moves data must be an array");
    }
  }
}

const moveDataValidator = z.object({
  id: z.string(),
  name: z.string(),
  power: z.number().min(0).max(Number.MAX_SAFE_INTEGER).int(),
  accuracy: z.number().min(0).max(Number.MAX_SAFE_INTEGER).int(),
  category: z.enum(["phys", "spec", "stat"]),
  type: z.string(),
  pp: z.number().min(0).max(999).int(),
  ailment: z.optional(
    z.object({
      type: z.string(),
      chance: z.number().min(0).max(1.0),
    })
  ),
  effectCodes: z.array(z.string()),
  flags: z.array(z.enum(MoveFlags)),
  priority: z.number().min(-6).max(6).int(),
  target: z.enum(MoveTargets),
});

type ValidatedMoveData = z.infer<typeof moveDataValidator>;

addToWindow("Move", Move);