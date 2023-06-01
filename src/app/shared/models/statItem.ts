import { Item } from "./item";
import { Stat } from "./stat";

export interface StatItem {
  id: number,
  stat: Stat,
  item: Item
}
