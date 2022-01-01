import addToWindow from "../globalModules";
import Move from "./data/runtime/move";

/**
 * A move learned by a pokemon
 */
export default class PokemonMove {
  move: Move;
  cpp: number;
  ppUpCount: number;

  constructor(moveId: string | SavedPokemonMove) {
    if (isSavedPokemonMove(moveId)) {
      const saved = moveId;
      const move = Move.dataById.get(saved.moveId);
      if (!move) {
        throw Error(
          `Invalid move id when restoring Pokemon Move${saved.moveId}`
        );
      }
      this.move = move;
      this.cpp = saved.cpp;
      this.ppUpCount = saved.ppUpCount;
    } else {
      const move = Move.dataById.get(moveId);
      if (!move) {
        throw Error(`Invalid move id when creating Pokemon Move ${moveId}`);
      }
      this.move = move;
      this.cpp = 10;
      this.ppUpCount = 0;
    }
  }

  /**
   * Creates a serialised version of this move
   */
  save(): SavedPokemonMove {
    return {
      kind: "move",
      moveId: this.move.id,
      cpp: this.cpp,
      ppUpCount: this.ppUpCount,
    };
  }
}

addToWindow("PokemonMove", PokemonMove);

const isSavedPokemonMove = (
  value: string | SavedPokemonMove
): value is SavedPokemonMove =>
  typeof value === "object" && value.kind === "move";

export type SavedPokemonMove = {
  kind: "move";
  moveId: string;
  cpp: number;
  ppUpCount: number;
};
