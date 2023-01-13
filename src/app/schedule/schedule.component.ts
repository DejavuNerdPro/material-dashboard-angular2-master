import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Member } from "models/member";
import { Schedule } from "models/schedule";
import { ScheduleService } from "services/schedule.service";
import { UserCrudService } from "services/user-crud.service";
import { Department } from "models/department";
import { Team } from "models/team";
// import { File } from "models/file";
import { NgToastService } from "ng-angular-popup";
import { title } from "process";
@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent implements OnInit {
  result: string = "";

  currentDate: any = new Date();
  selectStartDate: any;
  selectEndDate: any;
  start: any;
  end: any;

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private router: Router,
    private toast: NgToastService
  ) {
    this.department = [];
    this.teamArr = [];
    this.team = [];
    this.memberArr = [];
    this.member = [];
    this.scheduleArr = [];
    this.unavailableArr = [];
  }

  department: Department[];
  teamArr: Team[];
  team: Team[];

  memberArr: Member[];
  member: Member[];

  scheduleArr: Schedule[];

  unavailableArr: Schedule[] = [];
  ngOnInit() {
    // this.department = this.userCrudService.department();
    // this.pastDate();

    this.saveDepartment();
    this.saveTeam();
    this.saveMember();
    this.saveSchedule();

    this.scheduleForm = this.fb.group({
      start: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      privacy: new FormControl(null, [Validators.required]),
    });
  }

  saveDepartment() {
    this.scheduleService.getDepartmentList().subscribe({
      next: (data) => {
        this.department = data;
        // console.log(this.department);
      },
      error: (e) => console.log(e),
    });
  }

  saveTeam() {
    this.scheduleService.getTeamList().subscribe({
      next: (data) => {
        this.teamArr = data;
        // console.log(this.teamArr);
      },
      error: (e) => console.log(e),
    });
  }

  saveMember() {
    this.scheduleService.getMemberList().subscribe({
      next: (data) => {
        this.memberArr = data;
        console.log(this.memberArr);
      },
      error: (e) => console.log(e),
    });
  }

  saveSchedule() {
    this.scheduleService.getScheduleList().subscribe({
      next: (data: any) => {
        this.scheduleArr = data;
        // console.log(this.scheduleArr);
      },
      error: (e) => console.log(e),
    });
  }

  //date
  onChangeStart(e: any) {
    this.selectStartDate = new Date(e);

    var startDay = this.selectStartDate.getDate();
    if (startDay < 10) {
      startDay = "0" + startDay;
    }
    var startMonth = this.selectStartDate.getMonth() + 1;
    if (startMonth < 10) {
      startMonth = "0" + startMonth;
    }
    var startYear = this.selectStartDate.getFullYear();
    this.start = startYear + "-" + startMonth + "-" + startDay;
  }

  onChangeEnd(dateValue: any) {
    this.selectEndDate = new Date(dateValue);
    var endDay = this.selectEndDate.getDate();
    if (endDay < 10) {
      endDay = "0" + endDay;
    }
    var endMonth = this.selectEndDate.getMonth() + 1;
    if (endMonth < 10) {
      endMonth = "0" + endMonth;
    }
    var endYear = this.selectEndDate.getFullYear();
    this.end = endYear + "-" + endMonth + "-" + endDay;
  }

  startHour: any = [
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
  ];
  startTimeHour: any;
  onSelectStartHour(e: any) {
    this.startTimeHour = e.target.value;
  }
  endTimeHour: any;
  onSelectEndHour(e: any) {
    this.endTimeHour = e.target.value;
  }

  startMin: any = ["00", "15", "30", "45"];
  startTimeMin: any;
  onSelectStartMin(e: any) {
    this.startTimeMin = e.target.value;
  }
  endTimeMin: any;
  onSelectEndMin(e: any) {
    this.endTimeMin = e.target.value;
  }

  //time-varify
  // time disable -start
  current: any;
  shouldDisableHour(startHours: number): boolean {
    var currentDay: any = new Date().getDate();
    if (currentDay < 10) {
      currentDay = "0" + currentDay;
    }
    var currentMonth: any = new Date().getMonth() + 1;
    if (currentMonth < 10) {
      currentMonth = "0" + currentMonth;
    }
    var currentYear: any = new Date().getFullYear();
    this.current = currentYear + "-" + currentMonth + "-" + currentDay;

    const currentHour = new Date().getHours();
    return this.current === this.start && startHours < currentHour;
  }

  shouldDisableMinute(startMins: number): boolean {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    return currentHour == this.startTimeHour && startMins < currentMinute;
  }

  //time disable - end
  shouldDisableHourEnd(startHours: number): boolean {
    return startHours < this.startTimeHour;
  }

  shouldDisableMinEnd(startMins: number): boolean {
    if (this.startTimeHour == this.endTimeHour) {
      return startMins <= this.startTimeMin;
    }
  }

  //attendes
  //team
  onSelect(department) {
    this.team = this.teamArr.filter(
      (e) => e.departmentId == department.target.value
    );
  }

  //member
  onSelect1(team) {
    this.member = this.memberArr.filter((e) => e.team == team.target.value);
  }

  // first-select
  multiselected: any = [];
  preselectedMember: Member = new Member();
  onSelect2(member) {
    this.multiselected = this.memberArr.filter(
      (e) => e.userId == member.target.value
    );

    this.preselectedMember = this.multiselected[0];
    // console.log(this.preselectedMember);
  }

  //add member list
  preselected: any[] = [];
  shifting() {
    this.preselected.push(this.preselectedMember); // duplicated members
    this.preselected = Array.from(new Set(this.preselected)); //clear duplicate key
    // console.log(this.preselected);
  }

  //select-to-remove
  removedmember: any;
  removed: any;
  onSelect3(member) {
    this.removedmember = this.memberArr.filter(
      (e) => e.userId == member.target.value
    );
    this.removed = this.removedmember[0];
    // console.log(this.removed);
  }

  multiselectedUser: any = [];
  filterDate: any = [];

  //remove
  un_shifting() {
    const index = this.preselected.indexOf(this.removed);

    const idx = this.unavailableArr.indexOf(this.removed);
    console.log(index + " space " + idx);
    this.preselected.splice(index, 1);
    this.unavailableArr.splice(idx, 1);

    console.log(this.removed + "hello" + this.removedU);
  }

  //check-available
  checkArr: any = [];
  checkAvailable() {
    this.checkArr = this.preselected;

    for (let i = 0; i < this.checkArr.length; i++) {
      for (let j = 0; j < this.scheduleArr.length; j++) {
        if (this.checkArr[i].userId == this.scheduleArr[j].userId) {
          this.multiselectedUser.push(this.scheduleArr[j]);
        }
      }
    }

    var newStart = new Date(this.start);
    var newEnd = new Date(this.end);
    var NewStartTimeHour = this.startTimeMin / 60 + this.startTimeHour;
    var NewEndTimeHour = this.endTimeMin / 60 + this.endTimeHour;

    for (let i = 0; i < this.multiselectedUser.length; i++) {
      var oldStart = new Date(this.multiselectedUser[i].start);
      var oldEnd = new Date(this.multiselectedUser[i].end);
      var oldStartTime = this.multiselectedUser[i].start_time;
      var oldStartHour = oldStartTime.slice(0, 2);
      var oldStartMinute = oldStartTime.slice(3, 5);
      var oldStartTimeHour = oldStartMinute / 60 + oldStartHour;

      var oldEndTime = this.multiselectedUser[i].end_time;
      var oldEndHour = oldEndTime.slice(0, 2);
      var oldEndMinute = oldEndTime.slice(3, 5);
      var oldEndTimeHour = oldEndMinute / 60 + oldEndHour;

      if (
        newStart == oldStart ||
        newEnd == oldStart ||
        (newStart > oldStart && newStart < oldEnd)
      ) {
        if (
          oldStartTimeHour < NewStartTimeHour < oldEndTimeHour ||
          oldStartTimeHour < NewEndTimeHour < oldEndTimeHour ||
          NewStartTimeHour < oldStartTimeHour < NewStartTimeHour ||
          NewStartTimeHour < oldEndTimeHour < NewStartTimeHour
        ) {
          this.unavailableArr.push(this.multiselectedUser[i]);
          this.unavailableArr = Array.from(new Set(this.unavailableArr));
          console.log(this.unavailableArr);
        }
      }
    }
  }
  // removeSelectedUser(index) {
  //   this.unavailableArr.splice(index, 1);
  //   console.log(this.preselected);
  //   this.preselected.splice(index, 1);
  // }

  //unavailable
  removedUser: any;
  removedU: any;
  //select-to-remove
  onSelect4(event: any) {
    this.removedUser = this.unavailableArr.filter(
      (e) => e.userId == event.target.value
    );

    this.removedU = this.removedUser[0];
    // console.log(this.removedU);
  }

  //file
  // what we facing-- muli upload allowed at once, but can't be choose 1 by 1 uploaded.
  // selectFile: any[] = [];
  // selectFile!: FileList;
  // urls: any = [];
  // files: any = [];

  // filesArr!: File[];
  // file: File = new File();
  errorMessage = "";

  selectFile: File[];
  urls: any = [];
  files: File[];

  saveFile(e: any) {
    if (e.target.files) {
      this.selectFile = e.target.files;

      // for (var i = 0; i < this.selectFile.length; i++) {
      //   if (this.selectFile[i].size < 5000000) {
      //     this.urls.push(this.selectFile[i].name);
      //     // this.file.docName = this.selectFile[i].name;
      //     // this.file.docType = this.selectFile[i].type;
      //     // this.file.data = this.selectFile[i].size;
      //     this.files[i] = this.selectFile[i];
      //     console.log(this.files + "\n" + this.urls);
      //   } else {
      //     alert("your attached file is larger than 5MB.");
      //   }
      // }
    }
  }

  saveFiles() {
    this.scheduleService
      .addFile(this.selectFile, this.schedule.title)
      .subscribe(
        (data: any) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  removeSelectedFile(index) {
    this.urls.splice(index, 1);
    // this.selectFile.splice(index, 1);
  }

  // privacy

  //place
  place!: any;
  onSelectPlace(e: any) {
    this.place = e.target.value;
  }
  //form-submit

  schedule: Schedule = new Schedule();
  onSubmit() {
    this.schedule.start = this.start;
    this.schedule.end = this.end;
    this.schedule.start_time = this.startTimeHour + ":" + this.startTimeMin;
    this.schedule.end_time = this.endTimeHour + ":" + this.endTimeMin;
    this.schedule.membersList = this.preselected;
    this.schedule.schduleFile = this.selectFile;
    this.schedule.place = this.place;
    this.addSchedule();
    this.saveFiles();
    console.log(this.selectFile);
    console.log(this.schedule);
  }

  get f() {
    return this.scheduleForm.controls;
  }

  scheduleForm!: FormGroup;
  submitted: boolean = false;
  schTitle: any;
  addSchedule() {
    this.scheduleService.addSchedule(this.schedule).subscribe(
      (data: any) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
