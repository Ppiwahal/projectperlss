import { Injectable } from '@angular/core';
import { ValidatorFn, FormGroup, AbstractControl } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  constructor() { }

  currencyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^(?:[$]|)[+-]?[0-9]{1,3}(?:[0-9]*(?:[.,][0-9]{1})?|(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|(?:\.[0-9]{3})*(?:,[0-9]{1,2})?)$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidCurrency: true };
    };
  }
  nameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^[a-zA-Z][a-zA-Z\-\' ]+$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidName: true };
    };
  }

  addressAndCityValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^[a-zA-Z0-9 ]*$');
      const valid = regex.test(control.value);
      return valid ? null : { invalid: true };
    };
  }

  specialCharacterValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^[^<>{}\"/|;:.,~!?@#$%^=&*\\]\\\\()\\[¿§«»ω⊙¤°℃℉€¥£¢¡®©_+]*$');
      const valid = regex.test(control.value);
      return valid ? null : { invalid: true, specialCharacterValidator: true };
    };
  }
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      const valid = regex.test(control.value);
      return valid ? null : { invalidEmail: true };
    };
  }
  phonenumberValidator(): ValidatorFn {
    console.log("inside validator before if");
    return (control: AbstractControl): { [key: string]: any } => {
      console.log("inside validator", control.value)
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^[1-9][0-9]*$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidPhone: true };
    };
  }

  datePriorToInitialDate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const priorDate = new Date('01/01/1901');
      const valid = priorDate < control.value;
      return valid ? null : { datePriorToInitialDate: true };
    };
  }

  datePriorToInitialYear(): ValidatorFn {
    console.log("inside validator before if");
    return (control: AbstractControl): { [key: string]: any } => {
      console.log("inside validator", control.value);
      if (!control.value) {
        return null;
      }
      var patt= new RegExp('^((0[1-9])|(1[0-2])|[1-9])\\/(\\d{4})$');
      if(patt.test(control.value)){
     
      const priorYear = 1901;
      const valid = priorYear < control.value.split("/").pop;
      return valid ? null : { datePriorToInitialYear: true };
    } return {datePriorToInitialYearPatteren : true};
    };

  }

  dateInPast(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const currentDate = new Date(new Date().getTime() - (60 * 1000));
      const valid = currentDate < control.value;
      return valid ? null : { dateInPast: true };
    };
  }

  dateInPastExcludingToday(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const currentDate = new Date();
      const valid =  control.value >= currentDate.setHours(0,0,0,0);
      return valid ? null : { dateInPastExcludingToday: true };
    };
  }

  dateInFuture(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const currentDate = new Date();
      const valid = currentDate > control.value;
      return valid ? null : { dateInFuture: true };
    };
  }

  postalCodeValidator(): ValidatorFn {

    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
      const valid = regex.test(control.value);
      return valid ? null : { postalCodeValidator: true };
    }
  }

  ssnValidator(): ValidatorFn {
    console.log("inside validator before if");
    return (control: AbstractControl): { [key: string]: any } => {
      console.log("inside validator", control.value)
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^[1-9][0-9]*$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidSSN: true };
    };
  }
  requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let checked = 0;

      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];

        if (control.value === true) {
          checked++;
        }
      });

      if (checked < minRequired) {
        return {
          requireOneCheckboxToBeChecked: true,
        };
      }

      return null;
    };
  }
};

