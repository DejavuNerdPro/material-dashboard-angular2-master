// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-daily',
//   templateUrl: './daily.component.html',
//   styleUrls: ['./daily.component.scss']
// })
// export class DailyComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

//}
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RemoveUserPopUpComponent } from '../remove-user-pop-up/remove-user-pop-up.component';
import { DataShareService } from '../../services/data-share.service';
import { BehaviorSubject } from 'rxjs';
//calendar
import { FullCalendarComponent } from "@fullcalendar/angular";
import { PopupModalComponent } from "../popup-modal/popup-modal.component";
import { Attendee } from "../../models/attendee";
import { bindCallback } from "rxjs";
import { HttpServiceService } from "../../services/http-service.service";
import { Event } from "../../models/event";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";

//searchbar
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { SearchFiltering } from '../../models/searchFiltering';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

//sweetAlert2
import Swal from "sweetalert2";

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss']
})

export class DailyComponent implements OnInit,OnChanges{
  currentTime=new Date();
  isDisplay:boolean=false;
  calendarOptions: any;
  isEditable=true;
  currentLoginUserId=2001; //acquire from local storage
  currentLoginUsername='';
  currentLoginUsernameHost:any;
  eventarray:any[]=[];
  optimizedeventarray: any[]=[];
  searchEventArray:any[]=[];
  optimizedSearchEventArray:any[]=[];
  searchCalendarOptions: any;
  isExpired=false;
  isOpen = false;
  searchText = '';
  staffname = '';
  staffnamefetch='';
  searchUserId:any;
  searchUserIdArray:string[]=[];
  optimizedSearchUserIdArray:string[]=[];
  searchUsernameArray:any;
  staffdepartment = '';
  responseStaff: any[] = [];
  userIdinLS:any;
  indexCounter=0; 
  optimizedSearchFiltering: SearchFiltering[] = [];
  previousUser:any[]=[];
  optimizedPreviousUser:any[]=[];
  nextUser:any[]=[];
  optimizedNextUser:any[]=[];
  eventTitle:any;
  eventStartDate:any;
  eventStartTime:any;
  url = 'http://localhost:8080/user/serchUsesDetails';
  testImage: any;
  eventData:any;
  optimizedEventData:any;
  title:any;
  description:any;
  attendees:any;
  start:any;
  end:any;
  searchtitle:any;
  searchdescription:any;
  searchattendees:any;
  searchstart:any;
  searchend:any;
  searchEventData:any;
  optimizedSearchEventData:any;
  attendee:any;
  scheduleId:any;
  scheduleIdHost:any;
  attendeesHost:any;
  optimizedattendeesHost:any;
constructor(private dialogView:MatDialog,private data:DataShareService,private httpService: HttpServiceService,private sanitizer: DomSanitizer){}
@ViewChild("calendar", { static: true })
  calendarComponent!: FullCalendarComponent;
  @ViewChild("searchCalendar", { static: true })
  searchCalendarComponent!: FullCalendarComponent; 

//  icon=document.getElementById('header-toggle') as HTMLSpanElement;
//  icon.class="";

  ngOnChanges(changes: SimpleChanges): void {
//     console.log("This is onChange.");
//     this.data.currentMessage.subscribe(msg=>this.isDisplay=msg);
// console.log("Show : "+this.isDisplay);
//  if(this.isDisplay==true){
//   console.log("isStyleDisplay :  true");
//  }else{
//   console.log("isStyleDisplay : false");
//  }
   }
  ngOnInit(): void {
    
    
    console.log("init : "+this.isDisplay);

    //get logined username

    this.httpService.getMethod("http://localhost:8080/user/serchUserProfile?userId="+this.currentLoginUserId).subscribe(
      async (response)=>{
        this.currentLoginUsernameHost=response;
        console.log("Current Logined User name Host : ",this.currentLoginUsernameHost);
        this.currentLoginUsernameHost.map(
          (data)=>{
            this.currentLoginUsername=data.uname;
            console.log("Current Login User name : ",this.currentLoginUsername);
          }
        );
      }
    );

    //calendar

    this.httpService.getMethod("http://localhost:8080/user/serchUserSchedule?userId="+this.currentLoginUserId)
    .subscribe(
      async (response)=>{
        this.eventarray=response as any[];
        
        console.log("The response : ",response);
        this.optimizedeventarray=this.eventarray.map(
          (e)=>{
            var start=e.start+'T'+e.start_time;
            var end=e.end+'T'+e.end_time;
            return{
              resourceId: "1",
              title:e.title,
              start:start,
              end:end,
              color:this.colorization(e.status)
            };
          }
        );
        this.calendarOptions.events=this.optimizedeventarray;
        for (let e of this.optimizedeventarray) {
         console.log("title : "+e.title);
         console.log("start : "+e.start);
         console.log("end : "+e.end);
        //  console.log("color : "+e.color);
        }
        console.log("Optimized event : ",this.optimizedeventarray);
        // this.calendarComponent.addEvent();
      },
      (error) => { console.log(error); }
    );

    //searchbar
    this.httpService.getMethod(this.url).subscribe(
      async (response) => {
        this.responseStaff = response as any[];
        this.optimizedSearchFiltering = this.responseStaff.map((e, i) => {
          return {
            userId: e.userId,
            username: e.uname,
            departmentname: e.departmentName,
            userImage: e.imageData
          };
        });

        for (let e of this.optimizedSearchFiltering) {
          e.userImage = await this.imageResolver(e.userImage);

        }
        console.log("Optimized array ", this.optimizedSearchFiltering);
      },
      (error) => { console.log(error); }
    );

    //calendar
    this.calendarOptions = {
      // schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
      timeZone: "local",
      plugins: [dayGridPlugin, resourceTimeGridPlugin, interactionPlugin,resourceTimelinePlugin],
      allDaySlot:false, //remove allday header
      contentHeight:400, //remove scroll bar and specify hight
      resources: [{ id: '1', title: 'Room A' }], //to insert json
      selectable: true,
      dayMaxEventRows: true,
      dayMaxEvents: true,
      handleWindowResize:true, //to be responsive to window size
      initialView: "timeGridDay",
      // dateClick: this.onDateClick.bind(this),
      // events:this.optimizedeventarray,
      eventClick: this.isEditable? this.handleEventClick.bind(this):null,
      eventTimeFormat: { // like '14:30:00'
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        meridiem: true
      },
      // eventTypes:[ { title: 'Type 1', id: 1, selected: true, color: 'red' },
      // { title: 'Type 2', id: 2, selected: true, color: 'blue' },
      // { title: 'Type 3', id: 3, selected: true, color: 'green' },],
      displayEventEnd: true,
      displayEventTime: true,
      editable: true,
      eventResizableFromStart: true,
      eventOverlap: true, //overlap event each other
      drop: '',
      headerToolbar: {
        left: '',
        center: '',
        right: 'prev,next today'
      },
      dayHeaders:true, //remove header
      hiddenDays: [ 0, 6 ],
      weekends:false,
      dayHeaderFormat:{ weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true },
      scrollTime: '07:00', //initial cursor
      aspectRatio: 0.0,
      slotDuration:'00:15:00', //time interval
      validRange: {
        start: "00:00",
        end: "06:00"
      }
    };

    //searchCalendar
    this.searchCalendarOptions = {
      // schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
      timeZone: "local",
      plugins: [dayGridPlugin, resourceTimeGridPlugin, interactionPlugin,resourceTimelinePlugin],
      allDaySlot:false, //remove allday header
      contentHeight:400, //remove scroll bar and specify hight
      resources: [{ id: '1', title: 'Room A' }], //to insert json
      selectable: true,
      dayMaxEventRows: true,
      dayMaxEvents: true,
      handleWindowResize:true, //to be responsive to window size
      // eventStartEditable: false,
      initialView: "timeGridDay",
      // dateClick: this.onDateClick.bind(this),
      // events: this.eventarray,
      eventClick: this.isEditable? this.searchHandleEventClick.bind(this):null,
      eventTimeFormat: { // like '14:30:00'
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        meridiem: true
      },
      // eventTypes:[ { title: 'Type 1', id: 1, selected: true, color: 'red' },
      // { title: 'Type 2', id: 2, selected: true, color: 'blue' },
      // { title: 'Type 3', id: 3, selected: true, color: 'green' },],
      displayEventEnd: true,
      displayEventTime: true,
      editable: true,
      eventResizableFromStart: true,
      eventOverlap: true, //overlap event each other
      drop: '',
      headerToolbar: {
        left: '',
        center: '',
        right: 'prev,next today'
      },
      dayHeaders:true, //remove header
      hiddenDays: [ 0, 6 ],
      weekends:false,
      dayHeaderFormat:{ weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true },
      scrollTime: '07:00', //initial cursor
      aspectRatio: 0.0,
      slotDuration:'00:15:00', //time interval
      validRange: {
        start: "00:00",
        end: "06:00"
      },
      // slotLaneClassNames:"pg"
    };

  

  }
  
  removeAction(){
    // this.dialogView.open(RemoveUserPopUpComponent);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Removed!',
          'Member has been removed.',
          'success'
        )
      }
    });
    this.isDisplay=!this.isDisplay;
    console.log("U removed search User Id : ",this.searchUserId);
    this.searchUserIdArray=this.searchUserIdArray.filter(item=>item!=this.searchUserId);
    console.log("Search User array after removing : ",this.searchUserIdArray);
    localStorage.clear();
    localStorage.setItem("Search_EVENT_KEY@userId",JSON.stringify(this.searchUserIdArray));
    console.log("New re-allocation array in local storage : ",localStorage.getItem("Search_EVENT_KEY@userId"));
  }

  loadElement(){
    console.log("This is onChange.");
    this.data.currentMessage.subscribe(msg=>this.isDisplay=msg);
console.log("Show : "+this.isDisplay);
 if(this.isDisplay==true){
  console.log("isStyleDisplay :  true");
 }else{
  console.log("isStyleDisplay : false");
 }
  }

  handleEventClick(arg:any){
    console.log("start : ",arg.event.startStr);//2023-01-09T08:00:00+06:30
    this.eventTitle=arg.event._def.title;
    console.log("Event Title : ",this.eventTitle);
    this.eventStartDate=arg.event.startStr.substring(0,10);
    console.log("Event Start Date : ",this.eventStartDate);
    this.eventStartTime=arg.event.startStr.substring(11,19);
    console.log("Event Start Time : ", this.eventStartTime);

    //get scheduleId
    this.httpService.getMethod("http://localhost:8080/user/eventDetails?userId="+this.currentLoginUserId+"&title="+this.eventTitle+"&start="+this.eventStartDate+"&starttime="+this.eventStartTime).subscribe(
  async (response)=>{
   this.scheduleIdHost=response;
    console.log("Schedule Id Host : ",this.scheduleIdHost);
    this.scheduleIdHost.map(
      (data)=>{
        this.scheduleId=data.id;
        console.log("Schedule Id : ",this.scheduleId);
        this.httpService.getMethod("http://localhost:8080/user/serchMeetingSchedule?scheduleId="+this.scheduleId).subscribe(
    async (response)=>{
    this.attendeesHost=response;
    console.log("Attendee Host : ",this.attendeesHost);
  }
);
      }
    );
  }
);

    this.httpService.getMethod("http://localhost:8080/user/eventDetails?userId="+this.currentLoginUserId+"&title="+this.eventTitle+"&start="+this.eventStartDate+"&starttime="+this.eventStartTime).subscribe(
      async (response)=>{
        this.eventData=response;
        console.log("Event Data : ",this.eventData);
        // this.grapAttandee(this.currentLoginUserId,this.eventTitle,this.eventStartDate,this.eventStartTime);
        this.optimizedEventData=this.eventData.map(
          (data)=>{
            return{
              title:data.title,
              description:data.description,
              attendees:this.attendeesHost,
              start:data.start_time,
              end:data.end_time,
            };
          }
        );
        console.log("Optimized Event Data : ",this.optimizedEventData);

        this.optimizedEventData.map(
          (data)=>{
            this.title=data.title;
            this.description=data.description;
            this.attendees=data.attendees;
            this.start=data.start;
            this.end=data.end;
          }
        );
    console.log("Title: ",this.title,this.description,this.attendees,this.start,this.end);

      }
    );

    console.log("Attendee : ",this.attendeesHost);

    if(this.isEditable){
      // Swal.fire({
      //   title: 'Meeting Details',
      //   icon: 'info',
      //   html:'Title'+
      //           '<td class="text-primary">{{title}}</td>'+
      //       '</tr>'+
      //       '<tr>'+
      //           <td>Description</td>
      //           <td class="text-primary">{{description}}</td>
      //       </tr>
      //       <tr>
      //           <td>Meeting start at</td>
      //           <td class="text-primary">{{start_time}}</td>
      //       </tr>
      //       <tr>
      //           <td>Approximatly end at &nbsp;&nbsp;&nbsp;</td>
      //           <td class="text-primary">{{approximated_end_time}}</td>
      //       </tr>'
      // }
      // );
      this.dialogView.open(PopupModalComponent,{
        data:{title:this.title,description:this.description,attendees:this.attendees,start:this.start,end:this.end},
        width: '25vw', //sets width of dialog
          height:'50vh', //sets width of dialog
          maxWidth: '100vw', //overrides default width of dialog
          maxHeight: '100vh', //overrides default height of dialog
          disableClose: true //disables closing on clicking outside box. You will need to make a dedicated button to close
      });
    }else{
      console.log("Meeting passed through.");
     }
  }

  searchHandleEventClick(arg:any){
    console.log("start : ",arg.event.startStr);//2023-01-09T08:00:00+06:30
    this.eventTitle=arg.event._def.title;
    console.log("Event Title : ",this.eventTitle);
    this.eventStartDate=arg.event.startStr.substring(0,10);
    console.log("Event Start Date : ",this.eventStartDate);
    this.eventStartTime=arg.event.startStr.substring(11,19);
    console.log("Event Start Time : ", this.eventStartTime);

    this.httpService.getMethod("http://localhost:8080/user/eventDetails?userId="+this.searchUserId+"&title="+this.eventTitle+"&start="+this.eventStartDate+"&starttime="+this.eventStartTime).subscribe(
      async (response)=>{
        this.searchEventData=response;
        console.log("Search Event Data : ",this.searchEventData);
        this.grapAttandee(this.searchUserId,this.eventTitle,this.eventStartDate,this.eventStartTime);
        console.log("Search Attendee : ",this.attendeesHost);
        this.optimizedSearchEventData=this.searchEventData.map(
          (data)=>{
            return{
              title:data.title,
              description:data.description,
              attendees:this.attendeesHost,
              start:data.start_time,
              end:data.end_time,
            };
          }
        );
        console.log("Optimized Search Event Data : ",this.optimizedSearchEventData);

        this.optimizedSearchEventData.map(
          (data)=>{
            this.searchtitle=data.title;
            this.searchdescription=data.description;
            this.searchattendees=data.attendees;
            this.searchstart=data.start;
            this.searchend=data.end;
          }
        );
    console.log("Title: ",this.searchtitle,this.searchdescription,this.searchattendees,this.searchstart,this.searchend);

      }
    );

   
    if(this.isEditable){
      // this.dialogView.open(PopupModalComponent,{
      //   data:{title:this.searchtitle,description:this.searchdescription,attendees:this.searchattendees,start:this.searchstart,end:this.searchend},
      //   width: '25vw', //sets width of dialog
      //     height:'50vh', //sets width of dialog
      //     maxWidth: '100vw', //overrides default width of dialog
      //     maxHeight: '100vh', //overrides default height of dialog
      //     disableClose: true //disables closing on clicking outside box. You will need to make a dedicated button to close
        
      // });
    }else{
      console.log("Meeting passed through.");
    }
  }

  colorization(status:string){
    if(status!='ongoing'){
      this.isEditable=false;
    }else{
      this.isEditable=true;
    }
    return status=='ongoing'? '#1B98E080':'gray';
  }
  //searchbar
  imageResolver(byte:any[]){
    return this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,'+byte);
  }

  getUsername(id: string, index: number) {
    console.log(this.responseStaff[index]);
    console.log(this.staffname);
    if (this.isOpen == true) {
      this.searchText = this.responseStaff[index].uname;
      this.staffnamefetch = this.responseStaff[index].uname;
      this.searchUserId=this.responseStaff[index].userId;
      console.log(this.searchText+" : "+this.searchUserId);
      //add to local Storage
      this.searchUserIdArray.push(this.searchUserId);
       this.isOpen = !this.isOpen;
     
    }

  }

  isShow() {
    console.log("Search Show .");
    this.data.changeMessage(true);
    this.httpService.getMethod("http://localhost:8080/user/serchUserSchedule?userId="+this.searchUserId).subscribe(
      async (response)=>{
        this.searchEventArray=response as any[];
        console.log("The response : ",response);
        this.optimizedSearchEventArray=this.searchEventArray.map(
          (e)=>{
            var start=e.start+'T'+e.start_time;
            var end=e.end+'T'+e.end_time;
            return{
              resourceId: "1",
              title:e.title,
              start:start,
              end:end,
              color:this.colorization(e.status)
            };
          });
          this.searchCalendarOptions.events=this.optimizedSearchEventArray;
      }
    );
    this.data.currentMessage.subscribe(msg=>this.isDisplay=msg);
console.log("Show : "+this.isDisplay);
 if(this.isDisplay==true){
  console.log("isStyleDisplay :  true");
 }else{
  console.log("isStyleDisplay : false");
 }
 
 //filter no inclusive same item
 localStorage.setItem("Search_EVENT_KEY@userId",JSON.stringify(this.searchUserIdArray));
 this.userIdinLS=JSON.parse(localStorage.getItem("Search_EVENT_KEY@userId")!);
 console.log("search user ID in local Storage : ",this.userIdinLS);
 console.log(typeof this.userIdinLS);
 console.log("search user ID in local Storage with index : ",this.userIdinLS[0],this.userIdinLS[1],this.userIdinLS[2]);
    this.staffname=this.staffnamefetch;
  }

  previousfetch(){
    console.log("current index moved forword to index : ",this.indexCounter);
    // this.refilterSearchArray()
    const userIdinLS=JSON.parse(localStorage.getItem("Search_EVENT_KEY@userId")!);
    if(userIdinLS.length==1){
      this.indexCounter=0;
    }else{
      this.indexCounter=( this.indexCounter+1 ) % userIdinLS.length;
    }
     const previousSearchUserId=userIdinLS[this.indexCounter];
     console.log("search user ID change as : ",previousSearchUserId);
     
       //prevent click in initial state
       if(this.searchUserIdArray==undefined){
        this.isDisplay=false;
       }else{
        this.isDisplay=true;
        
       }
       this.httpService.getMethod("http://localhost:8080/user/serchUserSchedule?userId="+previousSearchUserId).subscribe(
      async (response)=>{
        this.previousUser=response as any[];
        console.log("The response : ",response);
        this.optimizedPreviousUser=this.previousUser.map(
          (e)=>{
            var start=e.start+'T'+e.start_time;
            var end=e.end+'T'+e.end_time;
            return{
              resourceId: "1",
              title:e.title,
              start:start,
              end:end,
              color:this.colorization(e.status)
            };
          });
          //get user name while searching
          this.searchUsernameArray=this.previousUser.map(
            (data)=>{
              this.staffname=data.uname;
              console.log("Staff name change in searching ",this.staffname);
            }
          );
          this.searchCalendarOptions.events=this.optimizedPreviousUser;
      }
    );
    this.searchUserId=previousSearchUserId;
    console.log("current search user Id : (previous)",this.searchUserId);
 
  }

  nextfetch(){
    const userIdinLS=JSON.parse(localStorage.getItem("Search_EVENT_KEY@userId")!);
    this.indexCounter--;
    if(this.indexCounter==-1){
      this.indexCounter=userIdinLS.length-1;
    }
    
    // this.refilterSearchArray();
    console.log("current index move forword to index : ",this.indexCounter);
    const nextSearchUserId=userIdinLS[this.indexCounter];
    console.log("search user ID change as : ",nextSearchUserId);
    // this.searchEventArray.map((data) => {
    //   this.staffname=data.uname;
    //   console.log("Staff name change in searching ",this.staffname);
    //  });

     //prevent click in initial state
     if(this.searchUserIdArray==undefined){
      this.isDisplay=false;
     }else{
      this.isDisplay=true;
      
     }

     this.httpService.getMethod("http://localhost:8080/user/serchUserSchedule?userId="+nextSearchUserId).subscribe(
      async (response)=>{
        this.nextUser=response as any[];
        console.log("The response : ",response);
        this.optimizedNextUser=this.nextUser.map(
          (e)=>{
            var start=e.start+'T'+e.start_time;
            var end=e.end+'T'+e.end_time;
            return{
              resourceId: "1",
              title:e.title,
              start:start,
              end:end,
              color:this.colorization(e.status)
            };
          });
          //get search user name
    this.searchUsernameArray=this.nextUser.map(
      (data)=>{
        this.staffname=data.uname;
        console.log("Staff name change in searching ",this.staffname);
      }
    );
          this.searchCalendarOptions.events=this.optimizedNextUser;
      }
    );
    this.searchUserId=nextSearchUserId;
    console.log("current search user Id : (next)",this.searchUserId);
 
  }
  
  refilterSearchArray(){
    localStorage.clear();
    this.searchUserIdArray=this.searchUserIdArray.filter(item=>item!=item);
    console.log("Refilter in local storage search array : ",this.searchUserIdArray);
    localStorage.setItem("Search_EVENT_KEY@userId",JSON.stringify(this.searchUserIdArray));
  }

  grapAttandee(id:any,title:string,start:any,starttime:any){
    //get scheduleId
    this.httpService.getMethod("http://localhost:8080/user/eventDetails?userId="+id+"&title="+title+"&start="+start+"&starttime="+starttime).subscribe(
  async (response)=>{
   this.scheduleIdHost=response;
    console.log("Schedule Id Host : ",this.scheduleIdHost);
    this.scheduleIdHost.map(
      (data)=>{
        this.scheduleId=data.id;
        console.log("Schedule Id : ",this.scheduleId);
        this.httpService.getMethod("http://localhost:8080/user/serchMeetingSchedule?scheduleId="+this.scheduleId).subscribe(
    async (response)=>{
    this.attendeesHost=response;
    console.log("Attendee Host : ",this.attendeesHost);
  }
);
      }
    );
  }
);
  }
}


