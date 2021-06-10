import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ChatService } from 'src/app/chat/services/chat.service';
import { CcutilService } from 'src/app/services/ccutil.service';
import { UserService } from '../service/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userObject: any;
  loginForm : FormGroup;
  registerForm : FormGroup;
  loadingSpinner: any;
  loginSubmitted: boolean = false;
  registerSubmitted: boolean = false;
  activeTab: any = 'login';
  countriesList: any = [];

  constructor(private userApi: UserService, private router: Router, private chatService: ChatService, 
    private navCtrl: NavController, public formbuilder: FormBuilder, public ccUtil: CcutilService) {
    // redirect to maintabs - if already logged in
    if (localStorage.getItem('userId')) {
      // this.router.navigate(['/maintabs']);
    }
  }

  ngOnInit() {
    this.geAllCountries();
    this.loginForm = this.formbuilder.group({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.registerForm = this.formbuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      countryCode: ['IND', Validators.required],
      password: new FormControl('', [Validators.required]),
      termsAcceptance: new FormControl(false, [Validators.requiredTrue]),
    });
  }

  addSearchAndFlags() {
    setTimeout(() => {
      // start: add searchbar at the header of the select
      let alertHead: any = document.getElementsByClassName('alert-head');
      // add searchbar to the head of ion-select alert
      alertHead[0].innerHTML = '<ion-searchbar></ion-searchbar>';
      // add style to remove padding - not required in searchbar
      alertHead[0].style.padding = 0;
      // also add event listner as its a dynamic input
      // this input will call filterMobileCodeOnSearch() function every time user type something in search input
      alertHead[0].addEventListener('input', this.filterMobileCodeOnSearch.bind(this));
      // end
      this.loadFlags();
    }, 500);
  }

  loadFlags() {
    setTimeout(() => {
      // start: add flag to the radio options
      let radios = document.getElementsByClassName('alert-radio-label');
      for (let index = 0; index < radios.length; index++) {
        // get country code
        const countryCode = radios[index]['innerText'].substr(1);
        let tempArray = countryCode.split('(');
        if (tempArray) {
          let tempCountryCode = tempArray[1].split(')');
          // get country name by country code
          let countryObject = this.countriesList.find((o) => (o.code === tempCountryCode[0]));
          if (countryObject) {
            let element = radios[index];
            element.innerHTML='';
            element.innerHTML=element.innerHTML.concat('<img class="country-image" style="width: 30px;margin-left: 5px;" src="assets/images/flags/latest/' + countryObject.code + '.png" />&nbsp;&nbsp;<span style="top: -7px;position: relative;">+'+ countryObject['mobileCode'] +' ('+ countryObject['code'] +')</span>');
          }
        }
      }
      // end
    }, 500);
  }

  filterMobileCodeOnSearch(event) {
    const radioListElem = document.getElementsByClassName('alert-radio-group');
    // first show all - because when we search rest of the non-searched items are hidden
    // that is why every time we need to put style display block to every items
    for (const index in this.countriesList) {
      if (radioListElem[0] && radioListElem[0].children[index]) {
        radioListElem[0].children[index].style.display = 'block';
      }
    }
    // get the search keyword
    const searchTerm = event.srcElement.value;
    // console.log('searchTerm', searchTerm);
    if (!searchTerm) {
      // return back if searchTerm is found empty or null
      return;
    }
    // hide elements which are not comes in search criteria
    for (const index in this.countriesList) {
        if (this.countriesList[index]) {
          const country = this.countriesList[index];
          const mobileCode = '+' + country['mobileCode'];
          // check to make sure which items are coming in search criteria
          if (country['code'].indexOf(searchTerm.toUpperCase()) === -1 && mobileCode.indexOf(searchTerm) === -1 && radioListElem[0].children[index]) {
            radioListElem[0].children[index].style.display = 'none';
          }
      }
    }
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  geAllCountries(){
    // show loader
    this.loadingSpinner = true;
    // this.errorMessage = '';

    this.userApi.getCountries()
      .subscribe((value: any) => {
        
        // hide loader
        this.loadingSpinner = false;

        // check response
        if (value.responseState && value.data) {
          this.countriesList = value.data;
        } else {
          // if(value.errorMessage){
          //   this.errorMessage = value.errorMessage;
          // }
        }
      }, (error) => {
        // hide loader
        this.loadingSpinner = false;
        console.log('Api error');
        if(error.name == 'HttpErrorResponse')
          this.ccUtil.fail_modal('Please check your Network Connection');
        else
          this.ccUtil.fail_modal(error.message);
      });
  }

  login(){
    this.loginSubmitted = true;
    if (this.loginForm.valid) {
      const data = {
        userName: this.loginForm.value.userName,
        password: this.loginForm.value.password
      }
      this.userApi.loginUser(data)
      .subscribe((response: any) => {
        if (response.data) {
          // set user details in localstorage
          // set a key/value
          // this.storage.set('userLoginData', response.data);

          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('userName', response.data.userName);
          localStorage.setItem('fName', response.data.fName);
          localStorage.setItem('lName', response.data.lName);
          localStorage.setItem('X-Auth-Token', response.data.authToken);
          localStorage.setItem('profileImage', response.data.profileImage);

          this.ccUtil.userFullName =  response.data.fName + ' ' +  response.data.lName;
          this.ccUtil.userProfilePic = response.data.profileImage;
          this.ccUtil.userToken = response.data.authToken;

          if (localStorage.getItem('userId')) {
            // call a function to create chat sync listener
            // this.chatService.chatSyncOnlineUsers(localStorage.getItem('userId'));

            // update user status to be used in managing when user is last loggedin
            this.chatService.callUpdateUserStatus('login');
          }
          this.loginSubmitted = false;

          this.router.navigate(['/maintabs'], { state: { data: 'mygames'} });
        } else if(!response.responseState){
          this.loginSubmitted = false;
          this.ccUtil.messageAlert('Login Failed', response.errorMessage);
        }
      },(error) => {
        console.log('Api error : ' + error);
        this.loginSubmitted = false;
        if(error.name == 'HttpErrorResponse')
          this.ccUtil.messageAlert('Login Failed', 'Please check your Network Connection');
        else
          this.ccUtil.messageAlert('Login Failed', error.message);
      });
    }
  }

  registerTab(){
    this.activeTab = 'register';
  }

  loginTab(){
    this.activeTab = 'login';
  }

  register() {
    this.registerSubmitted = true;
    // if form is valid then only allow to submit
    if (this.registerForm.valid) {
      const data = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        phoneNumber: this.registerForm.value.phoneNumber,
        countryCode: this.registerForm.value.countryCode,
        password: this.registerForm.value.password
      }
      this.loadingSpinner = true;
      this.userApi.registerUser(data)
        .subscribe((response: any) => {
          this.loadingSpinner = false;
          if (response.data) {
            // redirect to corresponding page
            this.router.navigate(['/otp'], {
              state: {
                  phone: data.phoneNumber,
                  countryCode: data.countryCode,
                  userId: response.data
              }
            });
          } else if(!response.responseState){
            this.ccUtil.messageAlert('Registration Failed', response.errorMessage);
          }
          this.registerSubmitted = false;
        },(error) => {
          this.loadingSpinner = false;
          console.log('Api error : ' + error);
          this.loginSubmitted = false;
          if(error.name == 'HttpErrorResponse')
            this.ccUtil.messageAlert('Registration Failed', 'Please check your Network Connection');
          else
            this.ccUtil.messageAlert('Registration Failed', error.message);
        });
    }
  }
}
