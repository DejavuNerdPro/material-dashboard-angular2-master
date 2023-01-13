import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { User } from "../models/user";
@Injectable({
  providedIn: "root",
})
export class UserCrudService {
  private baseUrl = "http://localhost:8081/register";
  constructor(private httpClient: HttpClient) {}

  addUser(user: User): Observable<Object> {
    return this.httpClient.post(this.baseUrl, user);
  }
}
