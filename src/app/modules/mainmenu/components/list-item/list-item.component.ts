import { Component } from '@angular/core';
import { Item } from 'src/app/shared/models/item';
import { ItemService } from 'src/app/shared/services/item.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { MediaService } from 'src/app/shared/services/media.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {

  items: Item[]=[];
  displayedColumns: string[] = ['image', 'id', 'name', 'description', 'actions'];
  activated: boolean=false;
  modified: boolean = false;
  selectedItem ?: Item;
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

  constructor(private itemService: ItemService, private dialog: MatDialog, private mediaService: MediaService) { }

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
    this.itemService.findAll().subscribe(
      res=>{
        this.items=res;
        console.log(res);
      },
      err=>console.log(err)
    );

  }

  onSelect(item: Item): void {
    this.selectedItem = item;
    console.log(item);
  }

  loadForm(){
    this.activated = true;
  }

  loadFormEdit(){
    this.modified = true;
    this.formEdit.get('name')?.setValue(this.selectedItem?.name as never);
    this.formEdit.get('description')?.setValue(this.selectedItem?.description as never);
    this.formEdit.get('image')?.setValue(this.selectedItem?.image as never);
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
    this.itemService.create({ name: this.form.get('name')?.value, description: this.form.get('description')?.value, image: this.file.name}as unknown as Item)
      .subscribe(item => {
        if(this.file?.name != ''){
          this.upload(this.file as File);
        }
        this.items.push(item);
        this.findAll();
        this.form.setValue({
          name: '',
          description: '',
          image: ''
        })
      });
  }

  private removeElementFromArrayByIndex(index: number) {
    const elementIndex = this.items.findIndex((element: any) => element.id === index);
      if (elementIndex > -1) {
        this.items.splice(elementIndex, 1);
      }
  }

  edit(): void {

    this.file =this.formEdit.value.image as unknown as File;

    this.itemService.edit(this.selectedItem?.id as number, { name: this.formEdit.get('name')?.value, description: this.formEdit.get('description')?.value, image: this.file.name }as unknown as Item)
      .subscribe((item: Item) => {
        if(this.file?.name != ''){
          this.upload(this.file as File);
        }
        this.removeElementFromArrayByIndex(item.id);
        this.items.push(item);
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
        this.delete(this.selectedItem as Item);
        this.selectedItem= undefined;
      }
    });
  }

  delete(item: Item): void{
    this.items = this.items.filter((f: Item) => f !== item);
    if(item.id){
    this.itemService.delete(item.id).subscribe();
  }
  }
}
