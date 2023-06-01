import { Enemy } from "./enemy";
import { Item } from "./item";

export interface FloorItem{
  id: number,
  enemy: Enemy,
  item: Item
}
