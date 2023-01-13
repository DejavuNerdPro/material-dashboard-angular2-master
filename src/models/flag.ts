import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
  })
export class Flag{
    public isDisplaySearchCalender=true;
    public construction(){}
    public set setIsDisplaySearchCalender(isDisplaySearchCalender:any){
        this.isDisplaySearchCalender=isDisplaySearchCalender;
    }
    public get getIsDisplaySearhCalender():any{
        return this.isDisplaySearchCalender;
    }
}