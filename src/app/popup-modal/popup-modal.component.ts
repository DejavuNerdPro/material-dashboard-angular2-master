import { Component, OnInit ,Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject } from 'rxjs';

import { RemoveUserPopUpComponent } from "../remove-user-pop-up/remove-user-pop-up.component";

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.css'],
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class PopupModalComponent implements OnInit {
title='';
description='';
attendees:any;
start_time='';
approximated_end_time='';
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private dialogView:MatDialog) { 
    
        this.title=data.title;
        this.description=data.description;
        this.attendees=data.attendees;
        this.start_time=data.start;
        this.approximated_end_time=data.end;
        console.log("Attendees : ",this.attendees);
      
  }

  ngOnInit(): void {
    console.log("datum dialog");
  }

  DisplayPopup(){
    this.dialogView.open(RemoveUserPopUpComponent);
  }

}
