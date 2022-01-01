import Pokemon from "./modules/pokemon";
import ui from "./ui";
import moveJson from "./json/moves.json";
import pokemonJson from "./json/pokemon.json";
import formJson from "./json/forms.json";
import Move from "./modules/data/runtime/move";
import { Species } from "./modules/data/runtime/species";

declare global {
  // Eslint complains about var here, but its required for how ts deals with globals
  var $pmz: { // eslint-disable-line
    player: {
      trainerId: string;
    };
    party: {
      members: Pokemon[];
    };
  };
}

// Parse everything

console.log(formJson, moveJson, pokemonJson);

Move.processData(moveJson);
Species.processData(pokemonJson, formJson);

(() => {
  window.$pmz = {
    ...window.$pmz,
    player: {
      trainerId: "0-",
    },
    party: {
      members: [],
    },
  };
  $pmz.party.members.push(new Pokemon("bulbasaur", 5));
  ui();
})();
