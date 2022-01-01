import Pokemon from "./modules/pokemon";
import ui from "./ui";

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

(() => {
  window.$pmz = {
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
