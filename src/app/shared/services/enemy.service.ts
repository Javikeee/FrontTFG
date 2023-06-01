import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Enemy } from '../models/enemy';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnemyService {

  private url='http://localhost:8080/api/enemy';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Enemy[]> {
    return this.http.get<Enemy[]>(this.url)
  }

  create(enemy: Enemy):Observable<any> {
    return this.http.post(this.url, enemy);
  }

  edit(id:number, enemy: Enemy):Observable<any> {
    return this.http.put(this.url+'/'+id, enemy);
  }

  delete(id:number):Observable<any> {
    return this.http.delete(this.url+'/'+id);
  }


}
