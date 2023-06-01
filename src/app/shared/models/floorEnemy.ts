import { Enemy } from "./enemy";
import { Floor } from "./floor";

export interface FloorEnemy{
  id: number,
  enemy: Enemy,
  floor: Floor
}
