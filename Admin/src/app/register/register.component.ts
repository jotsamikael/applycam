import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CandidateRegistrationRequest,
  CreatePromoterRequest,
} from "../services/models";
import { AuthenticationService, PromoterService } from "../services/services";
import { TokenService } from "../services/token/token.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  registerCandidateRequest: CandidateRegistrationRequest = {
    email: "",
    firstname: "",
    lastname: "",
    nationalIdNumber: "",
    password: "",
    phoneNumber: "",
    sex:""
  };
  registerPromoterRequest: CreatePromoterRequest = {
    email: "",
    firstname: "",
    lastname: "",
    nationalIdNumber: "",
    password: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    schoolLevel: "",
  };

  errorMsg: Array<string> = [];
  errorMsgRegister: Array<string> = [];
  errorMsgBusiness: string;
  selectedTabIndex = 0;
  processing: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private promoterService: PromoterService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const tab = +params["tab"];
      if (!isNaN(tab)) {
        this.selectedTabIndex = tab;
      }
    });
  }

  // PROMOTER

  registerPromoterForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),

    firstname: new FormControl("", [
      Validators.required,
      Validators.maxLength(64),
      Validators.minLength(1),
    ]),
    lastname: new FormControl("", [
      Validators.maxLength(64),
      Validators.minLength(1),
    ]),
    nationalIdNumber: new FormControl("", [
      Validators.required,
      Validators.maxLength(64),
      Validators.minLength(9),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.maxLength(64),
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl("", [
      Validators.required,
      Validators.maxLength(64),
      Validators.minLength(8),
    ]),
    phoneNumber: new FormControl("", [
      Validators.required,
      Validators.pattern(/^[0-9]*$/),
      Validators.maxLength(1024),
      Validators.minLength(8),
    ]),
    schoolLevel: new FormControl("", [Validators.required]),
    dateOfBirth: new FormControl("", [Validators.required]),
    address: new FormControl("", [Validators.required]),
    termsAccepted: new FormControl(false, [Validators.requiredTrue]), // this ensures it's checked
  });

  disableFormPROMOTER() {
    this.registerPromoterForm.controls["email"].disable();
    this.registerPromoterForm.controls["firstname"].disable();
    this.registerPromoterForm.controls["lastname"].disable();
    this.registerPromoterForm.controls["nationalIdNumber"].disable();
    this.registerPromoterForm.controls["phoneNumber"].disable();
    this.registerPromoterForm.controls["schoolLevel"].disable();
    this.registerPromoterForm.controls["dateOfBirth"].disable();
    this.registerPromoterForm.controls["address"].disable();

    this.registerPromoterForm.controls["password"].disable();
    this.registerPromoterForm.controls["confirmPassword"].disable();
  }

  enableFormPROMOTER() {
    this.registerPromoterForm.controls["email"].enable();
    this.registerPromoterForm.controls["firstname"].enable();
    this.registerPromoterForm.controls["lastname"].enable();
    this.registerPromoterForm.controls["nationalIdNumber"].enable();
    this.registerPromoterForm.controls["phoneNumber"].enable();
    this.registerPromoterForm.controls["schoolLevel"].enable();
    this.registerPromoterForm.controls["dateOfBirth"].enable();
    this.registerPromoterForm.controls["address"].enable();

    this.registerPromoterForm.controls["password"].enable();
    this.registerPromoterForm.controls["confirmPassword"].enable();
  }

  get f() {
    return this.registerPromoterForm.controls;
  }

  registerFunPromoter() {
    this.errorMsg = [];
    this.errorMsgBusiness = '';
    this.registerPromoterRequest = {
      email: this.registerPromoterForm.controls["email"].value,
      firstname: this.registerPromoterForm.controls["firstname"].value,
      lastname: this.registerPromoterForm.controls["lastname"].value,
      nationalIdNumber: this.registerPromoterForm.controls["nationalIdNumber"].value,
      password: this.registerPromoterForm.controls["password"].value,
      phoneNumber: this.registerPromoterForm.controls["phoneNumber"].value,
      address: this.registerPromoterForm.controls["address"].value,
      dateOfBirth: this.registerPromoterForm.controls["dateOfBirth"].value,
      schoolLevel: this.registerPromoterForm.controls["schoolLevel"].value,
    };
    console.log(this.registerPromoterRequest);
    this.authService.createStaff1({
         body: this.registerPromoterRequest
       }).subscribe({
         next:(res)=>{
           
           //success alert
              Swal.fire({
                   position:'center',
                   text:'Your account was successfully created',
                   icon: 'success',
                   title: 'Success',
                   showConfirmButton: false,
                   timer: 1500
                 });
           
           //navigate
            this.router.navigate(['activate-account'])
         },
         error:(err)=>{
         
           if(err.error.validationErrors){
             this.errorMsg = err.error.validationErrors;
             console.log('error array')
   
           } else if(err.error.businessErrorDescription){
            this.errorMsgBusiness = err.error.businessErrorDescription
            console.log('business logic error',this.errorMsgBusiness)

           }
           
           else{
             this.errorMsg.push(err.error.error);
           }
         }
       })
  }


  //CANDIDATE

  registerCandidateForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),

    firstname: new FormControl("", [
      Validators.required,
      Validators.maxLength(64),
      Validators.minLength(1),
    ]),
    lastname: new FormControl("", [
      Validators.maxLength(64),
      Validators.minLength(1),
    ]),
    sex: new FormControl("M", [
      Validators.required,
    ]),
    nationalIdNumber: new FormControl("", [
      Validators.required,
      Validators.maxLength(64),
      Validators.minLength(6),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.maxLength(64),
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl("", [
      Validators.required,
      Validators.maxLength(64),
      Validators.minLength(8),
    ]),
    phoneNumber: new FormControl("", [
      Validators.required,
      Validators.pattern(/^[0-9]*$/),
      Validators.maxLength(1024),
      Validators.minLength(8),
    ]),
    termsAccepted: new FormControl(false, [Validators.requiredTrue]), // this ensures it's checked
  });

  disableFormCandidate() {
    this.registerCandidateForm.controls["email"].disable();
    this.registerCandidateForm.controls["firstname"].disable();
    this.registerCandidateForm.controls["lastname"].disable();
    this.registerCandidateForm.controls["nationalIdNumber"].disable();
    this.registerCandidateForm.controls["phoneNumber"].disable();

    this.registerCandidateForm.controls["password"].disable();
    this.registerCandidateForm.controls["confirmPassword"].disable();
    this.registerPromoterForm.controls["phoneNumber"].disable(),
    this.registerPromoterForm.controls["sex"].disable()

  }

  enableFormCandidate() {
    this.registerCandidateForm.controls["email"].enable();
    this.registerCandidateForm.controls["firstname"].enable();
    this.registerCandidateForm.controls["lastname"].enable();
    this.registerCandidateForm.controls["nationalIdNumber"].enable();
    this.registerCandidateForm.controls["phoneNumber"].enable();

    this.registerCandidateForm.controls["password"].enable();
    this.registerCandidateForm.controls["confirmPassword"].enable();
    this.registerPromoterForm.controls["phoneNumber"].enable(),
    this.registerPromoterForm.controls["sex"].enable()

    
  }

  get g() {
    return this.registerCandidateForm.controls;
  }

  registerFunCandidate() {
    this.errorMsgRegister = []; //reset error msgs to empty array
    this.registerCandidateRequest = {
      email: this.registerCandidateForm.controls["email"].value,
      firstname: this.registerCandidateForm.controls["firstname"].value,
      lastname: this.registerCandidateForm.controls["lastname"].value,
      nationalIdNumber: this.registerCandidateForm.controls["nationalIdNumber"].value,
      password: this.registerCandidateForm.controls["password"].value,
      phoneNumber: this.registerCandidateForm.controls["phoneNumber"].value,
      sex: this.registerCandidateForm.controls["sex"].value
    };
    console.log(this.registerCandidateRequest);
    /*this.authService.register({
         body: this.registerPromoterRequest
       }).subscribe({
         next:(res)=>{
           
           console.log(res)
           
           //navigate
           this.router.navigate(['activate-account'])
         },
         error:(err)=>{
           if(err.error.validationErrors){
             this.errorMsg = err.error.validationErrors;
   
           } else{
             this.errorMsg.push(err.error.error);
           }
         }
       })*/
  }


  geTolLogin() {
    this.router.navigate(["/login"]);
  }
}
