import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private url='http://localhost:8080/api/item';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Item[]> {
    return this.http.get<Item[]>(this.url)
  }

  create(item: Item):Observable<any> {
    return this.http.post(this.url, item);
  }

  edit(id:number, item: Item):Observable<any> {
    return this.http.put(this.url+'/'+id, item);
  }

  delete(id:number):Observable<any> {
    return this.http.delete(this.url+'/'+id);
  }
}
