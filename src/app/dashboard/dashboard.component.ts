import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import axios from 'axios'
import { environment } from "../../environments/environment"
import swal from "sweetalert2"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  token: any = localStorage.getItem('token')
  selectedSelector: string="first"
  type: string|null = "";
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
          localStorage.setItem('token',req.data.token)
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
