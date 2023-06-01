import { Component } from '@angular/core';
import { Character } from 'src/app/shared/models/character';
import { CharacterService } from 'src/app/shared/services/character.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { MediaService } from 'src/app/shared/services/media.service';

@Component({
  selector: 'app-list-character',
  templateUrl: './list-character.component.html',
  styleUrls: ['./list-character.component.scss']
})
export class ListCharacterComponent {

   characters: Character[]=[];
  displayedColumns: string[] = ['image', 'id', 'name', 'history', 'actions'];
  activated: boolean=false;
  modified: boolean = false;
  selectedCharacter ?: Character;
  file?: File;

  form = new FormGroup({
    name: new FormControl(''),
    history:  new FormControl(''),
    image: new FormControl('')
  });

  formEdit = new FormGroup({
    name: new FormControl(''),
    history:  new FormControl(''),
    image: new FormControl('')
  });

  constructor(private characterService: CharacterService, private dialog: MatDialog, private mediaService: MediaService) { }

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
    this.characterService.findAll().subscribe(
      res=>{
        this. characters=res;
        console.log(res);
      },
      err=>console.log(err)
    );

  }

  onSelect(character: Character): void {
    this.selectedCharacter = character;
    console.log(character);
  }

  loadForm(){
    this.activated = true;
  }

  loadFormEdit(){
    this.modified = true;
    this.formEdit.get('name')?.setValue(this.selectedCharacter?.name as never);
    this.formEdit.get('history')?.setValue(this.selectedCharacter?.history as never);
    this.formEdit.get('image')?.setValue(this.selectedCharacter?.image as never);
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
    if (!this.form.get('name') && !this.form.get('history')) { return; }
    this.characterService.create({ name: this.form.get('name')?.value, history: this.form.get('history')?.value, image: this.file.name}as unknown as Character)
      .subscribe(character => {
        if(this.file?.name != ''){
          this.upload(this.file as File);
        }
        this. characters.push(character);
        this.findAll();
        this.form.setValue({
          name: '',
          history: '',
          image: ''
        })
      });
  }

  private removeElementFromArrayByIndex(index: number) {
    const elementIndex = this. characters.findIndex((element: any) => element.id === index);
      if (elementIndex > -1) {
        this. characters.splice(elementIndex, 1);
      }
  }

  edit(): void {

    this.file =this.formEdit.value.image as unknown as File;

    this.characterService.edit(this.selectedCharacter?.id as number, { name: this.formEdit.get('name')?.value, history: this.formEdit.get('history')?.value, image: this.file.name }as unknown as Character)
      .subscribe((character: Character) => {
        if(this.file?.name != ''){
          this.upload(this.file as File);
        }
        this.removeElementFromArrayByIndex(character.id);
        this. characters.push(character);
        this.findAll();
      });
      this.formEdit.setValue({
        name: '',
        history: '',
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
        this.delete(this.selectedCharacter as Character);
        this.selectedCharacter= undefined;
      }
    });
  }

  delete(character: Character): void{
    this. characters = this. characters.filter((f: Character) => f !== character);
    if(character.id){
    this.characterService.delete(character.id).subscribe();
  }
  }
}
