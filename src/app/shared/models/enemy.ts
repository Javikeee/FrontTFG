import { FloorEnemy } from "./floorEnemy"
import { StatEnemy } from "./statEnemy"

export interface Enemy{
  id: number,
  name: string,
  description: string,
  image: string,
  statEnemyDTOList: StatEnemy[],
  floorEnemyDTOList: FloorEnemy[]
}
