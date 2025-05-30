import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationRequest } from "../services/models/authentication-request";
import { AuthenticationService } from "../services/services/authentication.service";
import { TokenService } from "../services/token/token.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService
  ) {}

  authRequest: AuthenticationRequest = { email: "", password: "" };
  errorMsg: Array<string> = [];
  isProcessing: boolean = false;
  userRole:any;

  errorMsgRegister: Array<string> = [];

  loginFun() {
    this.isProcessing = true;
    this.errorMsg = []; //reset error msgs to empty array
    this.authService
      .authenticate({
        body: this.authRequest,
      })
      .subscribe({
        next: (res) => {
          //Todo save the token
          this.tokenService.token = res.token as string;
          //stop isprocessing
          this.isProcessing = false;

          //navigate to
          this.userRole = this.tokenService.getRoles()
          console.log(this.userRole)

           // Redirect based on user role
        switch (this.userRole[0]) {
          case 'STAFF':
            this.router.navigate(["/backend/overview-staff"]);
            break;
          case 'PROMOTER':
            this.router.navigate(["/backend/training-center-management"]);
            break;
          case 'CANDIDATE':
            this.router.navigate(["/backend/my-applications"]);
            break;
          default:
            this.router.navigate(["/backend/profile"]);
        }
        },
        error: (err) => {
          //stop isprocessing

          this.isProcessing = false;

          if (err.error.validationErrors) {
            this.errorMsg = err.error.validationErrors;
          } else {
            this.errorMsg.push(err.error.error);
          }
        },
      });
  }

}
