import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgetPassComponent } from "./forget-pass/forget-pass.component";
import { PasswordComponent } from "./password/password.component";
import { GetstartedComponent } from "./getstarted/getstarted.component";
import { MatDialogModule } from "@angular/material/dialog";
import { FullCalendarModule } from "@fullcalendar/angular";
import { OverlayModule } from "@angular/cdk/overlay";
import { BrowserModule } from "@angular/platform-browser";
import { FilterPipe } from "services/filter.pipe";
import { PopupModalComponent } from "./popup-modal/popup-modal.component";
import { RemoveUserPopUpComponent } from "./remove-user-pop-up/remove-user-pop-up.component";
import { DailyComponent } from "./daily/daily.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    BrowserModule,
    NgbModule,
    OverlayModule,
    FullCalendarModule,
    MatDialogModule,
  
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    SignupComponent,
    ForgetPassComponent,
    PasswordComponent,
    GetstartedComponent,
    FilterPipe,
    PopupModalComponent,
    RemoveUserPopUpComponent,
    DailyComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
