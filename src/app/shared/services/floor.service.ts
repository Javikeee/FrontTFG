import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Floor } from '../models/floor';

@Injectable({
  providedIn: 'root'
})
export class FloorService {

  private url='http://localhost:8080/api/floor';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Floor[]> {
    return this.http.get<Floor[]>(this.url)
  }

  create(floor: Floor):Observable<any> {
    console.log(floor);
    return this.http.post(this.url, floor);
  }

  edit(id:number, floor: Floor):Observable<any> {
    return this.http.put(this.url+'/'+id, floor);
  }

  delete(id:number):Observable<any> {
    return this.http.delete(this.url+'/'+id);
  }
}
