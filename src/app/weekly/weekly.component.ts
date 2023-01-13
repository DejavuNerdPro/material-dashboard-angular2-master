// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-weekly',
//   templateUrl: './weekly.component.html',
//   styleUrls: ['./weekly.component.scss']
// })
// export class WeeklyComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SearchFiltering } from '../../models/searchFiltering';
import { HttpServiceService } from '../../services/http-service.service';

@Component({
  selector: 'app-weekly',
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.scss']
})
export class WeeklyComponent implements OnInit {
currentUserID=2000; //acquire from localStorage
searchText='';
isOpen=false;
dataFromPicker="";
profile:any;
searchProfile:any;
isSetDefaultImage:boolean;
isSetSearchDefaultImage:boolean;
optimizedSearchFiltering:SearchFiltering[] = [];
isSearch:boolean=false;
searchFiltering:any[]=[];
username='';
teamname='';
searchUsername='';
searchTeamname='';
usernameTeam:any;
  constructor(
    private HttpService:HttpServiceService,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    console.log("Date Picked : ",this.dataFromPicker);
    console.log("key up ",this.isOpen);
    console.log("Search text : ",this.searchText);
    //getting search array
    this.HttpService.getMethod("http://localhost:8080/user/serchUsesDetails").subscribe(
      async (response) => {
        this.searchFiltering = response as any[];
        this.optimizedSearchFiltering = this.searchFiltering.map((e, i) => {
          return {
            userId: e.userId,
            username: e.uname,
            departmentname: e.departmentName,
            userImage: e.imageData,
          };
        });
  
        for (let e of this.optimizedSearchFiltering) {
          e.userImage = await this.imageResolver(e.userImage);
        }
        console.log("Optimized  search array : ", this.optimizedSearchFiltering);
      },
      (error) => {
        console.log(error);
      }
    );

    //to get username and team name
    this.HttpService.getMethod("http://localhost:8080/user/serchUserProfile?userId="+this.currentUserID).subscribe(
     async (response) => {
      this.usernameTeam=response;
      console.log("Getting username and team: ",this.usernameTeam);
      this.usernameTeam.map(
        (data)=>{
          this.username=data.uname;
          this.teamname=data.team;
          console.log("Current username : ",this.username);
          console.log("Current team name : ",this.teamname);
        }
      );
     }
    );

    this.HttpService.getMethod(
      "http://localhost:8080/image/getImage?id=" + this.currentUserID
    ).subscribe(async (response) => {
      this.profile = response;
      console.log(this.profile.userImageData);
      this.profile = this.sanitizer.bypassSecurityTrustUrl(
        "data:image/png;base64," + this.profile.userImageData
      );
      console.log("Profile image Data : ", this.profile);
      console.log(typeof this.profile);
      //setting default image
      if (this.profile === undefined) {
        console.log("Profile image is not set yet.");
        this.isSetDefaultImage = true;
      } else {
        console.log("Profile image already exist.");
        this.isSetDefaultImage = false;
      }
    });

  }
 isShow(){
 this.isSearch=true;

  //get image profile
  this.HttpService.getMethod(
    "http://localhost:8080/image/getImage?id=" + this.currentUserID
  ).subscribe(async (response) => {
    this.searchProfile = response;
    this.searchProfile = this.sanitizer.bypassSecurityTrustUrl(
      "data:image/png;base64," + this.searchProfile.userImageData
    );
    console.log("Search Profile image Data : ", this.searchProfile);
    console.log(typeof this.searchProfile);
    //setting default image
    if (this.searchProfile === undefined) {
      console.log("Search Profile image is not set yet.");
      this.isSetSearchDefaultImage = true;
    } else {
      console.log("Search Profile image already exist.");
      this.isSetSearchDefaultImage = false;
    }
  });
 }
 getUserName(id:string,i:number){
console.log("Clicked "+i);

  if (this.isOpen == true) {
    this.searchUsername = this.searchFiltering[i].uname;
    this.searchTeamname = this.searchFiltering[i].teamName;
    this.isOpen = !this.isOpen;
  }
 }
 //searchbar
 imageResolver(byte: any[]) {
  return this.sanitizer.bypassSecurityTrustUrl(
    "data:image/png;base64," + byte
  );
}

previousProcess(){

}

nextProcess(){
  
}

currentweek(){
  
}



}
