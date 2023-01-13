import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Employee } from "models/employee";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private baseUrl = "http://localhost:8081/employee";
  constructor(private httpClient: HttpClient) {}

  addEmployee(employee: Employee): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, employee);
  }

  getEmployeeList(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.baseUrl}`);
  }

  deleteEmployee(empId: String): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${empId}`);
  }

  getEmployeeByEmpId(empId: String): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.baseUrl}/${empId}`);
  }
  updateEmployee(empId: String, employee: Employee): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${empId}`, employee);
  }
}
