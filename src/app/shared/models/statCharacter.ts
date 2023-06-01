import { Character } from "./character";
import { Stat } from "./stat";

export interface StatCharacter {
  id: number,
  stat: Stat,
  character: Character
}
