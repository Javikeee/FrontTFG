import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCharacterComponent } from '../../components/list-character/list-character.component';
import { ListEnemyComponent } from '../../components/list-enemy/list-enemy.component';
import { ListFloorComponent } from '../../components/list-floor/list-floor.component';
import { ListItemComponent } from '../../components/list-item/list-item.component';


const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full'},
  { path: 'character', component: ListCharacterComponent },
  { path: 'enemy', component: ListEnemyComponent},
  { path: 'floor', component: ListFloorComponent},
  { path: 'item', component: ListItemComponent},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
