import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitComponent } from "./init/init.component"
import { DashboardComponent } from "./dashboard/dashboard.component"
import { NorouteComponent } from "./noroute/noroute.component"

const routes: Routes = [
  {path:'', component: InitComponent},
  {path:'dashboard', component: DashboardComponent},
  {path:'**', component: NorouteComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
