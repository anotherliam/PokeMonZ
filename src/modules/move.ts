import addToWindow from "../globalModules";

/**
 * A move learned by a pokemon
 */
export default class Move {
  moveId: string; // Todo: this should be move data
  cpp: number;
  ppUpCount: number;

  constructor(moveId: string | SavedMove) {
    if (isSavedMove(moveId)) {
      const saved = moveId;
      this.moveId = saved.moveId;
      this.cpp = saved.cpp;
      this.ppUpCount = saved.ppUpCount;
    } else {
      this.moveId = moveId;
      this.cpp = 10;
      this.ppUpCount = 0;
    }
  }

  /**
   * Creates a serialised version of this move
   */
  save(): SavedMove {
    return {
      kind: "move",
      moveId: this.moveId,
      cpp: this.cpp,
      ppUpCount: this.ppUpCount,
    };
  }
}

addToWindow("Move", Move);

const isSavedMove = (value: string | SavedMove): value is SavedMove =>
  typeof value === "object" && value.kind === "move";

export type SavedMove = {
  kind: "move";
  moveId: string;
  cpp: number;
  ppUpCount: number;
};
