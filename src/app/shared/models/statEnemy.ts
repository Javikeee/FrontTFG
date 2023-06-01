import { Enemy } from "./enemy";
import { Stat } from "./stat";

export interface StatEnemy {
  id: number,
  stat: Stat,
  enemy: Enemy
}
