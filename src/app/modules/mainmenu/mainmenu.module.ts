import { NgModule } from "@angular/core";
import { ListItemComponent } from "./components/list-item/list-item.component";
import { ListFloorComponent } from "./components/list-floor/list-floor.component";
import { ListEnemyComponent } from "./components/list-enemy/list-enemy.component";
import { ListCharacterComponent } from "./components/list-character/list-character.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "./modules/app-routing/app.routing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from '@angular/material/table';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationDialog } from "./components/confirmation-dialog/confirmation-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import {MatIconModule} from '@angular/material/icon';

export class SharedModule { }

@NgModule({
  declarations: [
    ListItemComponent,
    ListFloorComponent,
    ListEnemyComponent,
    ListCharacterComponent,
    ToolbarComponent,
    ConfirmationDialog
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatDividerModule,
    MatRadioModule,
    MatInputModule,
    MatMenuModule,
    BrowserAnimationsModule,
    DialogModule,
    ButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  exports: [
    ToolbarComponent,
    AppRoutingModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
  ]
})
export class MainmenuModule { }
