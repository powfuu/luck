import { Component, OnInit } from '@angular/core';
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
    timer: 4000,
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

  tr: boolean = false;
  mtr: boolean = false;
  accs: boolean = false;

  float_account_view_status: boolean = false;
  float_settings_view_status: boolean = true;
  float_notifications_view_status: boolean = false;

  isChangingPassword: boolean = false;

  //inputs
  oldPasswordField: string = '';
  newPasswordField: string = '';
  confirmNewPasswordField: string = '';

  settings_status: string = 'Account Information';

  data: any = '';
  iamXtext: string = '';

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
        title: `Password is invalid or too short (min char: 7)`,
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
    axios.post(`${environment.host}/update-fullname`,{
      fullname:fn
    },{
      headers:{
        "Authorization":this.token
      }
    }).then((req)=>{
      if(req.data.fullname){
        this.data.name=req.data.fullname;
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
    })
  }
  onUpdateDescription(desc: string) {
    axios.post(`${environment.host}/update-description`,{
      description:desc
    },{
      headers:{
        "Authorization":this.token
      }
    }).then((req)=>{
      if(req.data.description){
        this.data.description=req.data.description;
      }else{
            this.Toast.fire({
              icon: 'error',
              title: "Description is too short",
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
  onHandleType() {

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
          if (req.data.data.type === 'normal') {
            this.iamXtext = 'Change to creator account';
          } else if (req.data.data.type === 'creator') {
            this.iamXtext = 'Change to follower account';
          }
        }
      });
  }
}
