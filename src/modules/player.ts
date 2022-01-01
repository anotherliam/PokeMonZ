import _ from "lodash-es";
import config from "../config";
import { generateId } from "./uid";

export default class Player {
  name: string;
  lookVariant: number;
  gender: string;
  hasPokedex: boolean;
  hasRunningShoes: boolean;
  trainerId: number;

  get visibleTrainerId() {
    return this.trainerId.toString().padStart(12, "0").slice(-6);
  }

  private _money: number;
  get money() {
    return this._money;
  }
  set money(value) {
    this._money = _.clamp(value, 0, config.MaxMoney);
  }

  constructor(saved: SavedPlayer | undefined) {
    if (saved) {
      // restore

      // Set the internal money to 0 then set it again to validate it
      this._money = 0;
      this.money = saved.money;
      this.name = saved.name;
      this.lookVariant = saved.lookVariant;
      this.gender = saved.gender;
      this.hasPokedex = saved.hasPokedex;
      this.hasRunningShoes = saved.hasRunningShoes;
      this.trainerId = saved.trainerId;
    } else {
      // Create new

      this._money = 0;
      this.name = "Red";
      this.lookVariant = 0;
      this.gender = "male";
      this.hasPokedex = false;
      this.hasRunningShoes = false;
      this.trainerId = generateId();
    }
  }
}

type SavedPlayer = {
  money: number;
  name: string;
  lookVariant: number;
  gender: string;
  hasPokedex: boolean;
  hasRunningShoes: boolean;
  trainerId: number;
};
