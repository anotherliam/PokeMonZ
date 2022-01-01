import {
  Window_MenuStatus as Window_MenuStatus_old,
  Rectangle,
  $gameSystem,
} from "rmmz";
import Pokemon from "../modules/pokemon";
import PokeImageManager from "../pokeImageManager";
import { Colors } from "../Theme";

declare class Window_MenuStatus extends Window_MenuStatus_old {
  public pokemon(index: number): Pokemon | undefined;
}

const PokemonSpriteWidth = 96;

/**
 * Returns item centered inside of container
 * If item is bigger than container, scales it down to fit, keeping aspect ratio
 * @param item
 * @param container
 */
const fitAndScaleRect = (item: Rectangle, container: Rectangle) => {
  const actualItemRect = item.clone();
  // If its bigger, scale it down
  if (item.width >= container.width || item.height >= container.height) {
    const scale = Math.max(
      container.width / item.width,
      container.height / item.height
    );
    actualItemRect.width = actualItemRect.width * scale;
    actualItemRect.height = actualItemRect.height * scale;
  }
  // Fit it
  actualItemRect.x = container.x + (container.width - actualItemRect.width) / 2;
  actualItemRect.y =
    container.y + (container.height - actualItemRect.height) / 2;
  return actualItemRect;
};

export default function () {
  //-----------------------------------------------------------------------------
  // Overrides the WindowMenuStatus object to show pokemon instead

  Window_MenuStatus.prototype.maxItems = function () {
    return $pmz.party.members.length;
  };

  Window_MenuStatus.prototype.numVisibleRows = function () {
    return 6;
  };

  Window_MenuStatus.prototype.maxCols = function () {
    return 1;
  };

  Window_MenuStatus.prototype.pokemon = function (
    index: number
  ): Pokemon | undefined {
    return $pmz.party.members[index];
  };

  Window_MenuStatus.prototype.drawItem = function (index) {
    // Rect should be 86x536?
    this.drawPendingItemBackground(index);
    this.drawItemImage(index);
    this.drawItemStatus(index);
  };

  console.log("lol");

  Window_MenuStatus.prototype.textSizeEx;

  Window_MenuStatus.prototype.drawItemImage = function (index) {
    const pokemon = this.pokemon(index);
    if (!pokemon) return;
    const bitmap = PokeImageManager.getPokemonBattler(
      pokemon.species.id,
      "front"
    );
    const rect = this.itemRect(index);
    const width = PokemonSpriteWidth;
    const height = rect.height - 2;
    const x = rect.x + 1;
    const y = rect.y + 1;
    const pw = bitmap.width;
    const ph = bitmap.height;
    // Source info
    const srcRect = new Rectangle(0, 0, pw, ph);
    // Destination info
    const dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    const dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    const dest = new Rectangle(dx, dy, width, height);
    // Fit the source into the dest
    const finalDest = fitAndScaleRect(srcRect, dest);
    const dw = width;
    const dh = height;
    this.contents.blt(
      bitmap,
      srcRect.x,
      srcRect.y,
      srcRect.width,
      srcRect.height,
      finalDest.x,
      finalDest.y,
      finalDest.width,
      finalDest.height
    );
  };

  Window_MenuStatus.prototype.drawItemStatus = function (index) {
    this.contents.fontSize = $gameSystem.mainFontSize() - 4;
    // Draws all the info about the pokemon
    const pokemon = this.pokemon(index);
    if (!pokemon) return;

    const rect = this.itemRect(index);
    const lineHeight = this.lineHeight();

    const x = rect.x + PokemonSpriteWidth + 4;

    // Draw name and level
    const textWidth = rect.width - x - 2;
    const nameX = x;
    const nameY = rect.y + 2;
    this.changeTextColor(Colors.main);
    this.drawText(pokemon.displayName, nameX, nameY, textWidth, "left");
    this.drawText(`Lv. ${pokemon.lv}`, nameX, nameY, textWidth, "right");

    // Draw HP Gauge
    const gaugeX = x;
    const gaugeY = nameY + lineHeight;
    const gaugewidth = rect.width - (gaugeX - rect.x) - 12;
    const gaugeHeight = 10;
    const rate = pokemon.chp / pokemon.stats.mhp;
    const fillW = Math.floor((gaugewidth - 2) * rate);
    const fillH = gaugeHeight - 2;
    const color0 = Colors.main;
    const color1 = rate <= 0.5 ? Colors.hp.critical : Colors.hp.low;
    const color2 = rate <= 0.5 ? Colors.hp.low : Colors.hp.normal;
    this.contents.fillRect(gaugeX, gaugeY, gaugewidth, gaugeHeight, color0);
    this.contents.gradientFillRect(
      gaugeX + 1,
      gaugeY + 1,
      fillW,
      fillH,
      color1,
      color2,
      false
    );

    // Draw HP
    const hpX = x;
    const hpY = gaugeY + 12;
    const hpTextMaxW = 128;
    this.drawText(
      `${pokemon.chp}/${pokemon.stats.mhp}`,
      hpX,
      hpY,
      hpTextMaxW,
      "left"
    );

    // const gaugeKey = `poke-${pokemon.speciesId}-${pokemon.uid}-hp-gauge`;
    // const sprite = this.createInnerSprite(gaugeKey, Sprite_Gauge);
    // sprite.setup(actor, type);
    // sprite.move(x, y);
    // sprite.show();
    // this.drawActorIcons(actor, x, y + lineHeight * 2);
    // this.drawActorClass(actor, x2, y);
    // this.placeBasicGauges(actor, x2, y + lineHeight);
  };

  // Window_MenuStatus.prototype.processOk = function() {
  //     Window_StatusBase.prototype.processOk.call(this);
  //     const actor = this.actor(this.index());
  //     $gameParty.setMenuActor(actor);
  // };

  // Window_MenuStatus.prototype.isCurrentItemEnabled = function() {
  //     if (this._formationMode) {
  //         const actor = this.actor(this.index());
  //         return actor && actor.isFormationChangeOk();
  //     } else {
  //         return true;
  //     }
  // };

  // Window_MenuStatus.prototype.selectLast = function() {
  //     this.smoothSelect($gameParty.menuActor().index() || 0);
  // };

  // Window_MenuStatus.prototype.formationMode = function() {
  //     return this._formationMode;
  // };

  // Window_MenuStatus.prototype.setFormationMode = function(formationMode) {
  //     this._formationMode = formationMode;
  // };

  // Window_MenuStatus.prototype.pendingIndex = function() {
  //     return this._pendingIndex;
  // };

  // Window_MenuStatus.prototype.setPendingIndex = function(index) {
  //     const lastPendingIndex = this._pendingIndex;
  //     this._pendingIndex = index;
  //     this.redrawItem(this._pendingIndex);
  //     this.redrawItem(lastPendingIndex);
  // };
}
