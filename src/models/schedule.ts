import { DatePipe } from "@angular/common";

export class Schedule {
  start!: String;
  end!: String;
  // start_hour!: String;
  // start_min!: String;
  start_time!: String;
  end_time!: String;
  // end_hour!: String;
  // end_min!: String;
  title!: String;
  description!: String;
  privacy!: Boolean;
  place!: String;
  status!: String;
  membersList: any[] = [];
  member!: String;
  // schduleFile: any[] = [];
  schduleFile?: File[];
  //schduleFile?: File;
  uname!: String;
  userId!: String;
}
