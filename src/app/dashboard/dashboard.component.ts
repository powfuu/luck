import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from "@angular/router"
import axios from 'axios'
import { environment } from "../../environments/environment"
import swal from "sweetalert2"
import {
  trigger,
  state,
  transition,
  animate,
  style,
} from '@angular/animations';
const enterTransition = transition(':enter', [
  style({
    opacity: 0,
  }),
  animate(
    '.3s ease-in',
    style({
      opacity: 1,
    })
  ),
]);

const leaveTrans = transition(':leave', [
  style({
    opacity: 1,
  }),
  animate(
    '.3s ease-out',
    style({
      opacity: 0,
    })
  ),
]);

const fadeIn = trigger('fadeIn', [enterTransition]);

const fadeOut = trigger('fadeOut', [leaveTrans]);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeIn, fadeOut]
})
export class DashboardComponent implements OnInit {
  @ViewChild("pic0") pic0: ElementRef;
  @ViewChild("pic1") pic1: ElementRef;
  @ViewChild("pic2") pic2: ElementRef;
  @ViewChild("pic3") pic3: ElementRef;
  @ViewChild("joinfield") joinfield: ElementRef;
  Toast: any = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', swal.stopTimer);
      toast.addEventListener('mouseleave', swal.resumeTimer);
    },
  });
  
  codeField: string = ""
  token: any = localStorage.getItem('token')
  selectedSelector: string="first"
  type: string|null = "";
  maximumWinners: number = 1;
  mainpic_selector: string = "../../assets/db/upload.png"
  isMoney: boolean = true;
  environment:  any = environment;
  pic1_selector: string = "../../assets/db/upload.png"
  pic2_selector: string = "../../assets/db/upload.png"
  pic3_selector: string = "../../assets/db/upload.png"

  //data fields
  raffleTitleField: string|null = null
  raffleDescriptionField: string|null = null
  raffleMaxPField: number = 2
  rafflePrize: number = 0
  rafflePic0: any = null
  rafflePic1: any = null
  rafflePic2: any = null
  rafflePic3: any = null
  f0: string = ""
  f1: string = ""
  f2: string = ""
  f3: string = ""

  dashboardActiveRaffles:any = [] 
  dashboardInactiveRaffles:any = [] 

  statistics: any = {}

  handleIsMoney(is: boolean){
    this.isMoney = is;
    if(is === false){
      this.rafflePrize=0
    }else if(is === true){
        this.pic1_selector = "../../assets/db/upload.png"
        this.pic2_selector = "../../assets/db/upload.png"
        this.pic3_selector = "../../assets/db/upload.png"
        this.rafflePic1 = null
        this.rafflePic2 = null
        this.rafflePic3 = null
        this.f1 = ""
        this.f2 = ""
        this.f3 = ""
    }
  }
  onHandleField(e: any, field: string){
    switch(field){
      case 'title':
        this.raffleTitleField = e.target.value;
      break;
      case 'description':
        this.raffleDescriptionField = e.target.value; 
      break;
      case 'max_participants':
         this.raffleMaxPField = e.target.value
      break;
      case 'prize':
         this.rafflePrize = e.target.value
      break;
      case 'code':
          this.codeField = e.target.value;
      break;
    }
  }
  handlepic0(){
    if(this.rafflePic0 != null){
      let fd0 = new FormData;
      fd0.append('pic0', this.rafflePic0)
    axios.post(`${environment.host}/upfr0`, fd0).then(req=>{
      if(req.data.file){
        this.f0 = req.data.file;
      }
    }) 
    }
  }
  handlepic1(){
    if(this.rafflePic1 != null){
      let fd1 = new FormData;
      fd1.append('pic1', this.rafflePic1)
    axios.post(`${environment.host}/upfr1`, fd1).then(req=>{
      if(req.data.file){
        this.f1 = req.data.file;
      }
    })  
    }
  }
  handlepic2(){
    if(this.rafflePic2 != null){
      let fd2 = new FormData;
      fd2.append('pic2', this.rafflePic2)
    axios.post(`${environment.host}/upfr2`,fd2).then(req=>{
      if(req.data.file){
        this.f2 = req.data.file;
      }
    })  
    }
  }
  handlepic3(){
    if(this.rafflePic3 != null){
      let fd3 = new FormData;
      fd3.append('pic3', this.rafflePic3)
    axios.post(`${environment.host}/upfr3`, fd3).then(req=>{
      if(req.data.file){
        this.f3 = req.data.file;
      }
    })  
    }
  }
  joinIntoRaffle(){
    axios.post(`${environment.host}/join-into-raffle`, {
      code:this.codeField
    }, {
      headers:{
        "Authorization":this.token
      }
    }).then((req)=>{
      if(req.data.success){
        this.Toast.fire({
              icon: 'success',
              title: "You has been joined successfully",
              iconColor: '#73e415',
              showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster',
              },
            });
            setTimeout(() => {
              window.location.reload() 
            }, 700);
      }else if(req.data.failed){
        this.Toast.fire({
              icon: 'error',
              title: req.data.failed,
              iconColor: '#ff6868',
              showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster',
              },
            });
      }
    })
  }
  handlePublish(){
    axios.post(`${environment.host}/publish-raffle`, {
      raffleTitleField: this.raffleTitleField,
      raffleDescriptionField: this.raffleDescriptionField,
      raffleMaxPField: this.raffleMaxPField,
      raffleMaxWField: this.maximumWinners,
      rafflePrize: this.rafflePrize,
      f0: this.f0,
      f1: this.f1,
      f2: this.f2,
      f3: this.f3,
      isMoney:this.isMoney
    },{
      headers: { "Authorization":this.token  }
    }).then((req)=>{
      if(req.data.status_ok){
        this.Toast.fire({
              icon: 'success',
              title: "Raffle has been published successfully",
              iconColor: '#73e415',
              showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster',
              },
            });
            setTimeout(() => {
              window.location.reload() 
            }, 700);
      }else if(req.data.status_failed){
      this.Toast.fire({
        icon: 'error',
        title: `${req.data.status_failed}`,
        iconColor: '#ff6868',
        showClass: {
          popup: 'animate__animated animate__fadeInDown animate__faster',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp animate__faster',
        },
      });
      }
    })
  }
  publishRaffle() {
    setTimeout(() => {
    this.handlepic0()
    }, 0);
    setTimeout(() => {
    this.handlepic1()
    }, 20);
    setTimeout(() => {
    this.handlepic2()
    }, 40);
    setTimeout(() => {
    this.handlepic3()
    }, 60);
    setTimeout(() => {
    this.handlePublish()
    }, 80);
  }

  constructor(private router: Router) { }

  handlePic(id: number){
    if(id == 1){
      this.pic1.nativeElement.click()
    }else if(id == 2){
      this.pic2.nativeElement.click()
    }else if(id == 3){
      this.pic3.nativeElement.click()
    }else if(id == 0){
      this.pic0.nativeElement.click()
    }
  }

  handleFilePic(event:any, id: number) {
    if (event.target.files && event.target.files[0]) {
      if(id == 0){
        this.rafflePic0 = event.target.files[0]
      }
      if(id == 1){
        this.rafflePic1 = event.target.files[0]
      }
      if(id == 2){
        this.rafflePic2 = event.target.files[0]
      }
      if(id == 3){
        this.rafflePic3 = event.target.files[0]
      }
       var reader = new FileReader();
       reader.onload = (event: any) => {
         if(id == 0 ){
          this.mainpic_selector = event.target.result;
         }
         if(id == 1 ){
          this.pic1_selector = event.target.result;
         }
         if(id == 2 ){
          this.pic2_selector = event.target.result;
         }
         if(id == 3 ){
          this.pic3_selector = event.target.result;
         }
       }
       reader.readAsDataURL(event.target.files[0]);
    }
  }

  ngOnInit(): void {
    // localStorage.removeItem("token")
    if(!this.token){
      this.router.navigate([''])
    }else{
      axios.post(`${environment.host}/get-statistics`, { }, {
        headers: {"Authorization": this.token}
      }).then((req)=>{
        if(req.data.statistics){
          this.statistics = req.data.statistics
        }
      })
      axios.post(`${environment.host}/get-ai-dashboard-raffles`,{},{
        headers:{"Authorization": this.token}
      }).then((req)=>{
          if(req.data.raffles){
            this.dashboardActiveRaffles = req.data.raffles.filter((prop:any)=>prop.raffleIsActive)
            this.dashboardInactiveRaffles = req.data.raffles.filter((prop:any)=>!prop.raffleIsActive)
          }
      })
      axios.post(`${environment.host}/check-type`, {  
        token:this.token
      }, { headers: {'Authorization':this.token} }).then((req)=>{
      if(req.data.type === null){
  swal.fire({
  title: 'What is your interest?',
  text: "This will not affect in Luck platform (you can change your interest in any time)",
  icon: 'question',
  iconColor:'rgb(80,80,80)',
  confirmButtonText:'I follow content creator raffles',
  showCancelButton:true,
  cancelButtonText:"I'm a content creator",
allowOutsideClick: false,
  customClass:{
    confirmButton:"btn-ifollow",
    cancelButton:"btn-theyfollow",
  }
}).then((result) => {
  if (result.isConfirmed) {
    axios.post(`${environment.host}/update-type`, { 
      type:"normal"
      }, { headers: {'Authorization':this.token} }).then((req2)=>{
        if(req2.data.token){
          localStorage.setItem('token',req2.data.token)
        }
      })
  }else{
    axios.post(`${environment.host}/update-type`, { 
      type:"creator"
      }, { headers: {'Authorization':this.token} }).then((req2)=>{
        if(req2.data.token){
          localStorage.setItem('token',req2.data.token)
        }
      })
  }
})
      }
    })
    }
  }
  getSelector(s: string){
    if(s === this.selectedSelector){
      return "selected"
    }else{
      return "not_selected"
    }
  }
  setSelector(s: string){
    this.selectedSelector = s;
  }
  navigateToRaffle(path: string){
    this.router.navigate(['secured',path], {state:{
      data:{
        code:`${path}`
      }
    }})
  }
}
