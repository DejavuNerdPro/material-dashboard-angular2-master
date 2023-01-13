import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataShareService {
  public show=new BehaviorSubject<boolean>(true);
  currentMessage=this.show.asObservable();

  constructor() { }
  changeMessage(message:boolean){
    this.show.next(message)
    console.log("send Msg : "+message);
  }
}
