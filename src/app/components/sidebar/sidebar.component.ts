import { Component, OnInit } from "@angular/core";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "/home", title: "Home", icon: "home", class: "" },
  { path: "/user-profile", title: "User Profile", icon: "person", class: "" },
  {
    path: "/table-list",
    title: "Table List",
    icon: "content_paste",
    class: "",
  },

  {
    path: "/notifications",
    title: "Notifications",
    icon: "notifications",
    class: "",
  },
  { path: "/daily", title: "Daily", icon: "content_paste", class: "" },
  { path: "/schedule", title: "Schedule", icon: "content_paste", class: "" },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
