import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from '../models/character';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private url='http://localhost:8080/api/character';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Character[]> {
    return this.http.get<Character[]>(this.url)
  }

  create(character: Character):Observable<any> {
    return this.http.post(this.url, character);
  }

  edit(id:number, character: Character):Observable<any> {
    return this.http.put(this.url+'/'+id, character);
  }

  delete(id:number):Observable<any> {
    return this.http.delete(this.url+'/'+id);
  }

}
