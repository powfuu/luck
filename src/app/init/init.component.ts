import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { trigger,state,transition,animate,style } from '@angular/animations'
import axios from 'axios'
import { environment } from "../../environments/environment"
import swal from 'sweetalert2'
import { Router } from '@angular/router'

const enterTransition = transition(':enter', [
  style({
    opacity: 0
  }),
  animate('.3s ease-in', style({
    opacity: 1
  }))
]);

const leaveTrans = transition(':leave', [
  style({
    opacity: 1
  }),
  animate('.3s ease-out', style({
    opacity: 0
  }))
])

const fadeIn = trigger('fadeIn', [
  enterTransition
]);

const fadeOut = trigger('fadeOut', [
  leaveTrans
]);
@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss'],
animations: [
  fadeIn,
  fadeOut
]
})
export class InitComponent implements OnInit {
@ViewChild("joinli") joinli: ElementRef;
@ViewChild("secondli") secondli: ElementRef;
@ViewChild("thirdli") thirdli: ElementRef;

@ViewChild("loginemail") loginemail: ElementRef;
@ViewChild("loginpassword") loginpassword: ElementRef;

@ViewChild("emailsignup") emailsignup: ElementRef;
@ViewChild("fullnamesignup") fullnamesignup: ElementRef;
@ViewChild("passwordsignup") passwordsignup: ElementRef;
@ViewChild("confirmpasswordsignup") confirmpasswordsignup: ElementRef;

@ViewChild("signupform") signupform: ElementRef;


  Toast:any = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', swal.stopTimer)
    toast.addEventListener('mouseleave', swal.resumeTimer)
  }
})
topri: string=""; 
isInBox:boolean = false;
isInLogin: boolean = false;
isInSignup: boolean = false;
boxTitle:string = ""
selectedItem:string="join"
navBg: string="black"
scheme: string="white"
inverseScheme: string="black"
logint: string="rgb(245,245,245)"
hamStatus: boolean = false;

loginEmailField: string=""
loginPasswordField: string=""

signupEmailField: string=""
signupFullNameField: string=""
signupPasswordField: string=""
signupConfirmPasswordField: string=""

signupIsLoading: boolean = false;
loginIsLoading: boolean = false;

mailformat: any = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

onSignup(){
  if(this.signupEmailField.match(this.mailformat) && this.signupFullNameField.length >= 3 && this.signupPasswordField.length >= 7 && this.signupConfirmPasswordField === this.signupPasswordField){
  this.signupIsLoading=true
  axios.post(`${environment.host}/signup`, {
    email:this.signupEmailField,
    fullName:this.signupFullNameField,
    password:this.signupPasswordField,
  }).then((req)=>{
    if(req.data.success_signup){
      //success signup 
this.signupform.nativeElement.reset()
this.signupEmailField=""
this.signupFullNameField=""
this.signupPasswordField=""
this.signupConfirmPasswordField=""
this.isInSignup=false
this.Toast.fire({
  icon: 'success',
  title: `Signup Successfully`,
  iconColor:'#73e415',
  showClass: {
    popup: 'animate__animated animate__fadeInDown animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp animate__faster'
  }
})
this.signupIsLoading=false
    }else{
      //failed signup
this.Toast.fire({
  icon: 'error',
  title: `Email already exist`,
  iconColor:'#ff6868',
  showClass: {
    popup: 'animate__animated animate__fadeInDown animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp animate__faster'
  }
})
this.signupIsLoading=false
    }
  })
  }else{
    let error:string=""
    this.emailsignup.nativeElement.style.borderColor="rgb(200,200,200)"
    this.fullnamesignup.nativeElement.style.borderColor="rgb(200,200,200)"
    this.confirmpasswordsignup.nativeElement.style.borderColor="rgb(200,200,200)"
    this.passwordsignup.nativeElement.style.borderColor="rgb(200,200,200)"
    if(!this.signupEmailField.match(this.mailformat)){
      this.emailsignup.nativeElement.style.borderColor="#ff6868"
      error="Email is not valid"
    }else if(this.signupFullNameField.length <= 2){
      this.fullnamesignup.nativeElement.style.borderColor="#ff6868"
      error="Name is too short"
    }else if(this.signupConfirmPasswordField != this.signupPasswordField){
      this.passwordsignup.nativeElement.style.borderColor="#ff6868"
      this.confirmpasswordsignup.nativeElement.style.borderColor="#ff6868"
      error="Password does not match" 
    }else if(this.signupPasswordField.length <= 6){
      this.passwordsignup.nativeElement.style.borderColor="#ff6868"
      error="Password is too short"
    }  
this.Toast.fire({
  icon: 'error',
  title: `${error}`,
  iconColor:'#ff6868',
  showClass: {
    popup: 'animate__animated animate__fadeInDown animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp animate__faster'
  }
})
  }
}
onForgotPassword(){
this.Toast.fire({
  icon: 'question',
  title: `Forgot password is under maintenance!`,
  iconColor:'#666',
  showClass: {
    popup: 'animate__animated animate__fadeInDown animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp animate__faster'
  }
})
}
onLogin(){
  this.loginIsLoading=true
  axios.post(`${environment.host}/login`, {
    email:this.loginEmailField,
    password:this.loginPasswordField,
  }).then((req)=>{
    if(req.data.success_login){
      //success login
      localStorage.setItem('token',req.data.success_login)
      this.goDashboard()
    }else{
      //failed login
      this.loginemail.nativeElement.style.borderColor="#ff6868"
      this.loginpassword.nativeElement.style.borderColor="#ff6868"
this.Toast.fire({
  icon: 'error',
  title: `Account does not match`,
  iconColor:'#ff6868',
  showClass: {
    popup: 'animate__animated animate__fadeInDown animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp animate__faster'
  }
})
this.loginIsLoading=false
    }
  })
}
onChangeFieldValue(event: any, value: string){
  switch(value){
    case "loginEmailField":
      this.loginEmailField = event.target.value;
      break;
    case "loginPasswordField":
      this.loginPasswordField= event.target.value;
      break;
    case "signupEmailField":
      this.signupEmailField= event.target.value;
      break;
    case "signupFullNameField":
      this.signupFullNameField= event.target.value;
      break;
    case "signupPasswordField":
      this.signupPasswordField= event.target.value;
      break;
    case "signupConfirmPasswordField":
      this.signupConfirmPasswordField= event.target.value;
      break;
    default:
        alert('ERROR: 4002* Field is undefined')
      break;
  }
}

smoothScroll = () => {
  window.scrollTo({
    top:0,
    behavior:'smooth'
  })
}
constructor( private route: Router ) {
  }
goDashboard(){
  this.route.navigate(['dashboard'])
}
  ngAfterViewInit() {
    setTimeout(() =>{
      this.goToView('join')
      this.hamStatus=false;
    },50)
  }
  handleBox(title: string){
    this.isInBox = true;
    if(this.hamStatus === true){
      this.hamStatus=!this.hamStatus;
    }
  }
  closeBox(){
    this.isInBox = false;
  }
  isInLoginf(){
    if(!localStorage.getItem('token')){
    this.isInLogin= true;
    if(this.hamStatus === true){
      this.hamStatus=!this.hamStatus;
    }
    }else{
      this.route.navigate(['dashboard'])
    }
  }
  closeLogin(){
    this.isInLogin= false;
  }
  isInSignupf(){
    this.isInSignup= true;
    if(this.hamStatus === true){
      this.hamStatus=!this.hamStatus;
    }
  }
  closeSignup(){
    this.isInSignup= false;
  }
  fromLoginToSignup(){
    this.isInLogin= false;
    this.isInSignup=true
  }
  fromViewToLegalTerms(){
    this.isInLogin=false
    this.isInSignup=false
    this.isInBox = true
  }
  goToView(view: string){
    if(this.hamStatus === true){
      this.hamStatus=!this.hamStatus;
    }
    if(view === "join"){
      this.selectedItem=view
      window.scrollTo({
        top:0,
        behavior:'smooth'
      });
    }
    else if(view === "growimprove"){
      this.selectedItem=view
      window.scrollTo({
        top: 685,
        behavior:'smooth'
      });
    }
    else if(view === "howitworks"){
      this.selectedItem=view
      window.scrollTo({
        top: 3360,
        behavior:'smooth'
      });
    }
  }
  getSelected(selected: string, color: string): void | string{
    if(selected === this.selectedItem){
      if(color === "white"){
        return "black"
      }else if(color === "black"){
        return "white"
      }
    }else{
      return "rgb(160,160,160)"
    }
  }
  ngOnInit(): void {
    window.addEventListener('scroll',(e: any)=>{
      let y = window.scrollY;
      if(y <= 49){
        this.topri = "-200px";
      }else if(y >= 50){
        this.topri = "10px";
      }
      if(y >= 624 && y <= 3359){
          this.joinli.nativeElement.style.color="rgb(150,150,150)"
          this.secondli.nativeElement.style.color="black"
          this.thirdli.nativeElement.style.color="rgb(150,150,150)"
        this.navBg = "rgba(247,247,247,1)"
        this.scheme="black"
        this.inverseScheme="white"
        this.logint="rgb(55,55,55)"
      }
      if(y>= 3360){
          this.navBg = "rgba(255,255,255,1)"
          this.joinli.nativeElement.style.color="rgb(150,150,150)"
          this.secondli.nativeElement.style.color="rgb(150,150,150)"
          this.thirdli.nativeElement.style.color="black"
      }
      if(y <= 623){
        this.navBg = "rgba(0,0,0,1)"
        this.scheme="white"
        this.inverseScheme="black"
        this.logint="rgb(245,245,245)"
          this.joinli.nativeElement.style.color="white"

          this.secondli.nativeElement.style.color="rgb(150,150,150)"
          this.thirdli.nativeElement.style.color="rgb(150,150,150)"
      }
    })
  }

}
