import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  transition,
  animate,
  style,
} from '@angular/animations';
import { environment } from '../../environments/environment';
import axios from 'axios';
import swal from 'sweetalert2';

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
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  animations: [fadeIn, fadeOut],
})
export class NavComponent implements OnInit {
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
  token: any = localStorage.getItem('token');
  settings() {}
  privacy_list: any[] = [
    {
      id: 0,
      title: 'Hide total raffles in which you have participated',
    },
    {
      id: 1,
      title: 'Hide all raffles you have made',
    },
    {
      id: 2,
      title: 'Hide total participations from all of your raffles',
    },
  ];
  joinraffle(){
    environment.joiningInRaffle=true;
  }
  createraffle(){
    environment.creatingRaffle=true
  }
  settings_list: any[] = [
    {
      title: 'Account Information',
      ic: 'bx bx-user',
    },
    {
      title: 'Privacy',
      ic: 'bx bx-block',
    },
    {
      title: 'Security',
      ic: 'bx bx-lock',
    },
  ];

  @ViewChild("bannerfile") bannerfile: ElementRef;
  @ViewChild("picfile") picfile: ElementRef;

  tr: boolean = false;
  mtr: boolean = false;
  accs: boolean = false;

  float_account_view_status: boolean = false;
  float_settings_view_status: boolean = false;
  float_notifications_view_status: boolean = false;

  isChangingPassword: boolean = false;

  typeText: string = ""

  //inputs
  oldPasswordField: string = '';
  newPasswordField: string = '';
  confirmNewPasswordField: string = '';

  bannerFile: any=null
  picFile: any=null

  settings_status: string = 'Settings';

  data: any = '';
  data_stats: any = '';

  descr: string = ""

  iamXtext: string = 'Change account ';

  handlePicFile(){
    this.picfile.nativeElement.click()
  }
  handleBannerFile(){
    this.bannerfile.nativeElement.click()
  }
  setPic(file: any){
    let formData: any = new FormData;
    let ext = file.target.files[0].name.split('.').pop();
    if(ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "svg"){
      formData.append('pic', file.target.files[0])
    axios.post(`${environment.host}/update-pic`, formData, {
      headers: { "Authorization":this.token }
    }).then((req)=>{
      if(req.data.token){
        localStorage.setItem("token", req.data.token) 
        this.Toast.fire({
              icon: 'success',
              title: "Picture has been uploaded successfully",
              iconColor: '#73e415',
              showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster',
              },
            });
            this.data.pic = req.data.pic;
      }
    })
    }else{
      this.Toast.fire({
        icon: 'error',
        title: `Error while uploading picture, only .png .jpg .jpeg .svg are valid`,
        iconColor: '#ff6868',
        showClass: {
          popup: 'animate__animated animate__fadeInDown animate__faster',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp animate__faster',
        },
      });
    }
  }



  setBanner(file: any){
    let formData: any = new FormData;
    let ext = file.target.files[0].name.split('.').pop();
    if(ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "svg"){
      formData.append('banner', file.target.files[0])
    axios.post(`${environment.host}/update-banner`, formData, {
      headers: { "Authorization":this.token }
    }).then((req)=>{
      if(req.data.token){
        localStorage.setItem("token", req.data.token) 
        this.Toast.fire({
              icon: 'success',
              title: "Banner has been uploaded successfully",
              iconColor: '#73e415',
              showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster',
              },
            });
            this.data.banner = req.data.banner;
      }
    })
    }else{
      this.Toast.fire({
        icon: 'error',
        title: `Error while uploading banner, only .png .jpg .jpeg .svg are valid`,
        iconColor: '#ff6868',
        showClass: {
          popup: 'animate__animated animate__fadeInDown animate__faster',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp animate__faster',
        },
      });
    }
  }
  updatePrivacy(prop: number) {
    if (prop === 0) {
      this.tr = !this.tr;
    } else if (prop === 1) {
      this.mtr = !this.mtr;
    } else if (prop === 2) {
      this.accs = !this.accs;
    }
    axios.post(
      `${environment.host}/set-privacy`,
      {
        val:
          prop === 0 ? 'tr' : prop === 1 ? 'mtr' : prop === 2 ? 'accs' : null,
        valStatus:
          prop === 0
            ? this.tr
            : prop === 1
            ? this.mtr
            : prop === 2
            ? this.accs
            : null,
      },
      {
        headers: { Authorization: this.token },
      }
    );
  }
  onChangePassword() {
    if (
      this.newPasswordField === this.confirmNewPasswordField &&
      this.newPasswordField.length >= 7
    ) {
      axios
        .post(
          `${environment.host}/change-password`,
          {
            oldPassword: this.oldPasswordField,
            newPasswordField: this.newPasswordField,
          },
          {
            headers: { Authorization: this.token },
          }
        )
        .then((req) => {
          if (req.data.error) {
            this.Toast.fire({
              icon: 'error',
              title: req.data.error,
              iconColor: '#ff6868',
              showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster',
              },
            });
          } else if (req.data.success) {
            this.Toast.fire({
              icon: 'success',
              title: req.data.success,
              iconColor: '#73e415',
              showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster',
              },
            });
          }
        });
    } else {
      this.Toast.fire({
        icon: 'error',
        title: `Password is invalid or too short (min length: 7)`,
        iconColor: '#ff6868',
        showClass: {
          popup: 'animate__animated animate__fadeInDown animate__faster',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp animate__faster',
        },
      });
    }
  }
  onChangeFieldValue(event: any, value: string) {
    switch (value) {
      case 'old-password':
        this.oldPasswordField = event.target.value;
        break;
      case 'new-password':
        this.newPasswordField = event.target.value;
        break;
      case 'confirm-new-password':
        this.confirmNewPasswordField = event.target.value;
        break;
      case 'fullname':
        this.onUpdateFullName(event.target.value);
        break;
      case 'description':
        this.onUpdateDescription(event.target.value);
        break;
    }
  }
  onUpdateFullName(fn: string) {
    if(fn.length>=3){
    axios.post(`${environment.host}/update-fullname`,{
      fullname:fn
    },{
      headers:{
        "Authorization":this.token
      }
    }).then((req)=>{
      if(req.data.fullname){
        this.data.fullname=req.data.fullname;
        localStorage.setItem("token",req.data.token)
            this.Toast.fire({
              icon: 'success',
              title: "Full Name has been changed",
              iconColor: '#73e415',
              showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster',
              },
            });
      }
    })
  }else{
            this.Toast.fire({
              icon: 'error',
              title: "Name is too short",
              iconColor: '#ff6868',
              showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster',
              },
            });
  }
  }
  onUpdateDescription(desc: string) {
    if(desc.length>=7){
    axios.post(`${environment.host}/update-description`,{
      description:desc.replace(/(?:\r\n|\r|\n)/g, "<br>")
    },{
      headers:{
        "Authorization":this.token
      }
    }).then((req)=>{
      if(req.data.description){
        this.data.description=req.data.description;
        localStorage.setItem("token",req.data.token)
          this.descr = req.data.description.replace(new RegExp("<br>", "g"), '\n');
            this.Toast.fire({
              icon: 'success',
              title: "Description has been changed",
              iconColor: '#73e415',
              showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster',
              },
            });
      }
    })
  }else{
            this.Toast.fire({
              icon: 'error',
              title: "Description is too short (min length: 7)",
              iconColor: '#ff6868',
              showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster',
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster',
              },
            });
  }
  }
  onHandleType() {
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
            this.iamXtext = 'Change to creator account';
            this.data.type="normal"
            this.typeText="Follower"
        }
      })
  }else{
    axios.post(`${environment.host}/update-type`, { 
      type:"creator"
      }, { headers: {'Authorization':this.token} }).then((req2)=>{
        if(req2.data.token){
          localStorage.setItem('token',req2.data.token)
            this.iamXtext = 'Change to follower account';
            this.data.type="creator"
            this.typeText="Content Creator"
        }
      })
  }
})
  }
  signout() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
  onSettingsStatusChange(newStatus: string) {
    if (newStatus === 'Settings') {
      this.isChangingPassword = false;
    }
    this.settings_status = newStatus;
  }
  onHandleSettingsClick(user_select: string) {
    if (user_select === 'Account Information') {
      this.onSettingsStatusChange('Account Information');
    } else if (user_select === 'Privacy') {
      this.onSettingsStatusChange('Privacy');
    } else if (user_select === 'Security') {
      this.onSettingsStatusChange('Security');
    }
  }
  handleFloatViewStatus(floatView: string) {
    if (floatView === 'account-view') {
      this.float_account_view_status = !this.float_account_view_status;
      this.float_settings_view_status = false;
      this.float_notifications_view_status = false;
    } else if (floatView === 'settings-view') {
      this.settings_status = 'Settings';
      this.float_settings_view_status = !this.float_settings_view_status;
      this.float_notifications_view_status = false;
      this.float_account_view_status = false;
    } else if (floatView === 'notifications-view') {
      this.float_notifications_view_status =
        !this.float_notifications_view_status;
      this.float_settings_view_status = false;
      this.float_account_view_status = false;
    }
  }
  constructor(private router: Router) {}

  ngOnInit(): void {
    axios
      .post(
        `${environment.host}/get-privacy`,
        {},
        {
          headers: {
            Authorization: this.token,
          },
        }
      )
      .then((req) => {
        if (req.data.data) {
          this.tr = req.data.data.hidden_total_raffles;
          this.mtr = req.data.data.hidden_my_total_raffles;
          this.accs = req.data.data.hidden_accs;
          this.data_stats = req.data.data;
        }
      });
    axios
      .post(
        `${environment.host}/get-data`,
        {},
        {
          headers: {
            Authorization: this.token,
          },
        }
      )
      .then((req) => {
        if (req.data.data) {
          this.data = req.data.data;
          this.descr = req.data.data.description.replace(new RegExp("<br>", "g"), '\n');
          if (req.data.data.type === 'normal') {
            this.iamXtext = 'Change to creator account';
            this.typeText = "Follower"
          } else if (req.data.data.type === 'creator') {
            this.iamXtext = 'Change to follower account';
            this.typeText = "Content Creator"
          }
        }
      });
  }
}
