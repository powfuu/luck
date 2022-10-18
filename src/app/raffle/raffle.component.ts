import { Component, OnInit } from '@angular/core'; import axios from 'axios'
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
  data: any = []
  creatorData: any = []
  list: any = []
  listFiltered: any = []
  raffleStatus: string = ""
  raffleStatusColor: string = ""
  accountId: number|null = null

  constructor( private route: Router ) {
  }
  goBack() {
      this.route.navigate(['dashboard'])
  }
  ngOnInit(): void {
      axios.post(`${environment.host}/get-userId`, {

      }, {
          headers: {
              "Authorization":this.token
          }
      }).then((requst)=>{
          if(requst.data.id){
              this.accountId=requst.data.id
          }
      })
    axios.post(`${environment.host}/get-raffle-participants-list`, {
        code: this.code.replace('%20'," ")
    }, {
      headers: {
        "Authorization":this.token
      }
    }).then((req3)=>{
        if(req3.data.data){
            this.list=req3.data.data;
            setTimeout(() => {
            this.listFiltered=req3.data.data.filter((fi:any)=>fi.userId == this.data.first_winner || fi.userId == this.data.second_winner || fi.userId == this.data.third_winner).reverse()
            }, 200);
        }
    })
    axios.post(`${environment.host}/check-code`, {
      code: this.code.replace('%20'," ")
    }, {
      headers: {
        "Authorization":this.token
      }
    }).then((req)=>{
      if(!req.data.success){
        this.route.navigate(['dashboard'])
      }
    })
    axios.post(`${environment.host}/get-raff-data`, {
      code:this.code.replace('%20'," ")
    },
    {headers: { 
        "Authorization" : this.token
      }}).then((req)=>{
      if(req.data.data){
        this.data=req.data.data[0]
        axios.post(`${environment.host}/get-creator-data`, {
            code:req.data.data[0].creatorId
        },{
            headers: {
                "Authorization": this.token
            }
        }).then((req2)=>{
            if(req2.data.data){
                this.creatorData = req2.data.data[0]
            }
        })
        if(req.data.data[0].raffleIsActive == 0){
            this.raffleStatus="Finished"
            this.raffleStatusColor = "#ff4949"
        }
        else if(req.data.data[0].raffleIsActive == 1){
            this.raffleStatus="Active"
            this.raffleStatusColor = "#38ff73"
        }
      } 
    })
  }
  endRaffle(){
              window.location.reload()
      axios.post(`${environment.host}/end-raffle`,{
          code: this.code.replace('%20'," "),
          nanWin: this.data.max_winners
      },{
          headers:{
              "Authorization": this.token
          }
      }).then((req)=>{
          if(req.data.ok){

          }
      })
  }

}
