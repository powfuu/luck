import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitComponent } from "./init/init.component"
import { DashboardComponent } from "./dashboard/dashboard.component"
import { RaffleComponent } from "./raffle/raffle.component"
import { NorouteComponent } from "./noroute/noroute.component"
import { environment } from '../environments/environment'

const routes: Routes = [
  {path:'', component: InitComponent},
  {path:'dashboard', component: DashboardComponent},
  {path:'secured/:id', component:RaffleComponent},
  {path:'**', component: NorouteComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
