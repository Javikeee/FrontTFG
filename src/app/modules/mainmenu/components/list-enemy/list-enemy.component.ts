import { Component } from '@angular/core';
import { Enemy } from 'src/app/shared/models/enemy';
import { EnemyService } from 'src/app/shared/services/enemy.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { MediaService } from 'src/app/shared/services/media.service';

@Component({
  selector: 'app-list-enemy',
  templateUrl: './list-enemy.component.html',
  styleUrls: ['./list-enemy.component.scss']
})
export class ListEnemyComponent {

  enemies: Enemy[]=[];
  displayedColumns: string[] = ['image', 'id', 'name', 'description', 'actions'];
  activated: boolean=false;
  modified: boolean = false;
  selectedEnemy ?: Enemy;
  file?: File;

  form = new FormGroup({
    name: new FormControl(''),
    description:  new FormControl(''),
    image: new FormControl('')
  });

  formEdit = new FormGroup({
    name: new FormControl(''),
    description:  new FormControl(''),
    image: new FormControl('')
  });

  constructor(private enemyService: EnemyService, private dialog: MatDialog, private mediaService: MediaService) { }

  ngOnInit(): void {
    this.findAll();
  }

  upload(event: File){
    console.log('event')

      const formData = new FormData;
      formData.append('file', event);

      this.mediaService.uploadFile(formData).subscribe(response => {
        console.log('response', response);
      })
  }

  onChangeImage(event: any){
    const file = event.target.files[0];
    this.formEdit.value.image = file;
  }

  findAll()
  {
    this.enemyService.findAll().subscribe(
      res=>{
        this.enemies=res;
        console.log(res);
      },
      err=>console.log(err)
    );

  }

  onSelect(enemy: Enemy): void {
    this.selectedEnemy = enemy;
    console.log(enemy);
  }

  loadForm(){
    this.activated = true;
  }

  loadFormEdit(){
    this.modified = true;
    this.formEdit.get('name')?.setValue(this.selectedEnemy?.name as never);
    this.formEdit.get('description')?.setValue(this.selectedEnemy?.description as never);
    this.formEdit.get('image')?.setValue(this.selectedEnemy?.image as never);
    this.formEdit.updateValueAndValidity();
  }

  hideEdit(){
    this.modified=false;
  }

  isValid(input:string){
    return !this.form.get(input)?.valid;
  }

  isValidEdit(input:string){
    return !this.form.get(input)?.touched || !this.form.get(input)?.valid;
  }

  create(): void {
    this.activated=false;
    this.form.patchValue({name: this.form.get('name')?.value?.trim()});
    this.file =this.form.value.image as unknown as File;
    if (!this.form.get('name') && !this.form.get('description')) { return; }
    this.enemyService.create({ name: this.form.get('name')?.value, description: this.form.get('description')?.value, image: this.file.name}as unknown as Enemy)
      .subscribe(enemy => {
        if(this.file?.name != ''){
          this.upload(this.file as File);
        }
        this.enemies.push(enemy);
        this.findAll();
        this.form.setValue({
          name: '',
          description: '',
          image: ''
        })
      });
  }

  private removeElementFromArrayByIndex(index: number) {
    const elementIndex = this.enemies.findIndex((element: any) => element.id === index);
      if (elementIndex > -1) {
        this.enemies.splice(elementIndex, 1);
      }
  }

  edit(): void {

    this.file =this.formEdit.value.image as unknown as File;

    this.enemyService.edit(this.selectedEnemy?.id as number, { name: this.formEdit.get('name')?.value, description: this.formEdit.get('description')?.value, image: this.file.name }as unknown as Enemy)
      .subscribe((enemy: Enemy) => {
        if(this.file?.name != ''){
          this.upload(this.file as File);
        }
        this.removeElementFromArrayByIndex(enemy.id);
        this.enemies.push(enemy);
        this.findAll();
      });
      this.formEdit.setValue({
        name: '',
        description: '',
        image: ''
      })
      this.modified=false;
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialog,{
      data:{
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const a = document.createElement('a');
        a.click();
        a.remove();
        this.delete(this.selectedEnemy as Enemy);
        this.selectedEnemy= undefined;
      }
    });
  }

  delete(enemy: Enemy): void{
    this.enemies = this.enemies.filter((f: Enemy) => f !== enemy);
    if(enemy.id){
    this.enemyService.delete(enemy.id).subscribe();
  }
  }
}
