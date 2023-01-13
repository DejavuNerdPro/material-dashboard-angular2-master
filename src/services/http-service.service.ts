import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  constructor(private http:HttpClient) { }
  getMethod(url:string){
    return this.http.get(url);
  }
  postMethod(url:string){
    return this.http.post(url,[]);
  }
}