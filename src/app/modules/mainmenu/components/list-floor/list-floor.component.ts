import { Component } from '@angular/core';
import { Floor } from 'src/app/shared/models/floor';
import { FloorService } from 'src/app/shared/services/floor.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { MediaService } from 'src/app/shared/services/media.service';

@Component({
  selector: 'app-list-floor',
  templateUrl: './list-floor.component.html',
  styleUrls: ['./list-floor.component.scss']
})
export class ListFloorComponent {

  floors: Floor[]=[];
  displayedColumns: string[] = ['image', 'id', 'name', 'description', 'floorNumber', 'actions'];
  activated: boolean=false;
  modified: boolean = false;
  selectedFloor ?: Floor;
  file?: File;

  form = new FormGroup({
    name: new FormControl(''),
    description:  new FormControl(''),
    image: new FormControl(''),
    floorNumber: new FormControl('')
  });

  formEdit = new FormGroup({
    name: new FormControl(''),
    description:  new FormControl(''),
    image: new FormControl(''),
    floorNumber: new FormControl('')
  });

  constructor(private floorService: FloorService, private dialog: MatDialog, private mediaService: MediaService) { }

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
    this.floorService.findAll().subscribe(
      res=>{
        this.floors=res;
        console.log(res);
      },
      err=>console.log(err)
    );

  }

  onSelect(floor: Floor): void {
    this.selectedFloor = floor;
    console.log(floor);
  }

  loadForm(){
    this.activated = true;
  }

  loadFormEdit(){
    this.modified = true;
    this.formEdit.get('name')?.setValue(this.selectedFloor?.name as never);
    this.formEdit.get('description')?.setValue(this.selectedFloor?.description as never);
    this.formEdit.get('image')?.setValue(this.selectedFloor?.image as never);
    this.formEdit.get('floorNumber')?.setValue(this.selectedFloor?.floorNumber.toString() as never);
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
    this.floorService.create({ name: this.form.get('name')?.value, description: this.form.get('description')?.value, floorNumber: this.form.get('floorNumber')?.value, image: this.file.name}as unknown as Floor)
      .subscribe(floor => {
        if(this.file?.name != ''){
          this.upload(this.file as File);
        }
        this.floors.push(floor);
        this.findAll();
        this.form.setValue({
          name: '',
          description: '',
          image: '',
          floorNumber: ''
        })
      });
  }

  private removeElementFromArrayByIndex(index: number) {
    const elementIndex = this.floors.findIndex((element: any) => element.id === index);
      if (elementIndex > -1) {
        this.floors.splice(elementIndex, 1);
      }
  }

  edit(): void {

    this.file =this.formEdit.value.image as unknown as File;

    this.floorService.edit(this.selectedFloor?.id as number, { name: this.formEdit.get('name')?.value, description: this.formEdit.get('description')?.value, floorNumber: this.formEdit.get('floorNumber')?.value, image: this.file.name }as unknown as Floor)
      .subscribe((floor: Floor) => {
        if(this.file?.name != ''){
          this.upload(this.file as File);
        }
        this.removeElementFromArrayByIndex(floor.id);
        this.floors.push(floor);
        this.findAll();
      });
      this.formEdit.setValue({
        name: '',
        description: '',
        image: '',
        floorNumber: ''
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
        this.delete(this.selectedFloor as Floor);
        this.selectedFloor= undefined;
      }
    });
  }

  delete(floor: Floor): void{
    this.floors = this.floors.filter((f: Floor) => f !== floor);
    if(floor.id){
    this.floorService.delete(floor.id).subscribe();
  }
  }
}
