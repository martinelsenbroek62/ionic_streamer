import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {

  constructor() { }

  /*
  The password should be a minimum of eight characters long.
  It has at least one lower case letter.
  It has at least one upper case letter.
  It has at least one number.
  */
  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('newPassword').value; // get password from our password form control
    const confirmPassword: string = control.get('cfmPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('cfmPassword').setErrors({ NoPassswordMatch: true });
    }
  }
  oldPasswordValidator(control: AbstractControl) {
    const password: string = control.get('currentPassword').value; // get password from our password form control
    const confirmPassword: string = control.get('newPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password == confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('newPassword').setErrors({ NoPassswordMatch: true });
    }
  }
}
