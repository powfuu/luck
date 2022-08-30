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
  token: any = localStorage.getItem('token')
  selectedSelector: string="first"
  type: string|null = "";
  maximumWinners: number = 1;
  mainpic_selector: string = "upload.png"
  isMoney: boolean = false;
  environment:  any = environment;
  pic1_selector: string = "upload.png"
  pic2_selector: string = "upload.png"
  pic3_selector: string = "upload.png"

  constructor(private router: Router) { }

  ngOnInit(): void {
    // localStorage.removeItem("token")
    if(!this.token){
      this.router.navigate([''])
    }else{
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

}
