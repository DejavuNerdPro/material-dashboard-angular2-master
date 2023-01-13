import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-password-confirmation-popup',
  templateUrl: './password-confirmation-popup.component.html',
  styleUrls: ['./password-confirmation-popup.component.scss']
})
export class PasswordConfirmationPopupComponent {
password:number;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private dialogView:MatDialog,private dialogRef: MatDialogRef<PasswordConfirmationPopupComponent>) { 
  //  this.password=data.password;
  }

  getPassword(value){
    this.password=value;
  }

  cancel() {
    // closing itself and sending data to parent component
    this.dialogRef.close({ data: 'you cancelled' })
  }

  confirm() {
    // closing itself and sending data to parent component
    this.dialogRef.close({ data: this.password })
  }

}
