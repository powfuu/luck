import { Component, OnInit } from '@angular/core';
import axios from 'axios'
import { environment } from '../../environments/environment'
import { Router } from "@angular/router"

@Component({
  selector: 'app-raffle',
  templateUrl: './raffle.component.html',
  styleUrls: ['./raffle.component.scss']
})
export class RaffleComponent implements OnInit {

  code: any = window.location.pathname.replace("%2F","/").slice(9)
  token: any = localStorage.getItem('token')
  data: [] = []

  constructor( private router: Router ) {
  }
  ngOnInit(): void {
    axios.post(`${environment.host}/check-code`, {
      code: this.code
    }, {
      headers: {
        "Authorization":this.token
      }
    }).then((req)=>{
      if(!req.data.success){
        this.router.navigate(['dashboard'])
      }
    })
    axios.post(`${environment.host}/get-raff-data`, {
      code:this.code
    },
    {headers: { 
        "Authorization" : this.token
      }}).then((req)=>{
      if(req.data.data){
        this.data=req.data.data
      } 
    })
  }

}
