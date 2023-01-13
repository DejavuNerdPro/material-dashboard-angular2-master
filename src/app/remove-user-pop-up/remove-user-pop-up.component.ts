import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../../services/data-share.service';

@Component({
  selector: 'app-remove-user-pop-up',
  templateUrl: './remove-user-pop-up.component.html',
  styleUrls: ['./remove-user-pop-up.component.css']
})
export class RemoveUserPopUpComponent implements OnInit {
  constructor(private data:DataShareService) { }

  ngOnInit(): void {
    
  }

  delete(){
    this.data.changeMessage(false);
    console.log("Remove Button clicked. Set false.");
  }

}
