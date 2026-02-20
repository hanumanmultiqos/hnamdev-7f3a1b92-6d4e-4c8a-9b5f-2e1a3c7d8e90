import { Injectable, inject } from '@angular/core';
import { decryptData, encryptData } from '../encdec-data/encdec-data';
import swal from 'sweetalert2';
import { Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonConstants } from '../constants/common-constants';
import * as CryptoJS from 'crypto-js';
import {
  AbstractControl,
  UntypedFormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class HelperService {
  pageName = new Subject<any>();
  private _router = inject(Router);
  public setLocalStorageData(keyName: any, keyValue: any) {
    localStorage.setItem(keyName, <string>encryptData(keyValue));
    return true;
  }

  public getLocalStorageData(keyName: string) {
    try {
      const localStorageDetails = localStorage.getItem(keyName);
      if (
        localStorageDetails &&
        localStorageDetails != null &&
        localStorageDetails.trim() !== ''
      ) {
        return JSON.parse(decryptData(localStorageDetails));
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error reading localStorage:', error);

      localStorage.clear();
      this._router.navigate(['/login']);

      return null;
    }
  }

  decryptResponse(cipherText: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(
        cipherText,
        CommonConstants.encryptSecretKey,
      );
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) {
        throw new Error(
          'Decryption returned empty string. Possibly wrong key or corrupted input.',
        );
      }

      return JSON.parse(decryptedText);
    } catch (error: any) {
      console.error('Decryption failed:', error.message || error);
      return null;
    }
  }

  public removeLocalStorageData(keyName: any) {
    if (keyName) {
      localStorage.removeItem(keyName);
    }
  }

  clearLocalStorageData() {
    this.removeLocalStorageData(CommonConstants.USER_DATA);
    this.removeLocalStorageData(CommonConstants.TOKEN);
    this.removeLocalStorageData(CommonConstants.FORGOT_EMAIL);
  }
  setSessionData(key: string, data: any): void {
    try {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        CommonConstants.encryptSecretKey,
      ).toString();
      sessionStorage.setItem(key, encryptedData);
    } catch (error) {
      console.error('Session encryption failed', error);
    }
  }

  getSessionData(key: string): any {
    try {
      const encryptedData = sessionStorage.getItem(key);
      if (!encryptedData) {
        return null;
      }
      const bytes = CryptoJS.AES.decrypt(
        encryptedData,
        CommonConstants.encryptSecretKey,
      );
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Session decryption failed', error);
      return null;
    }
  }

  toast(message: any, icon: any) {
    const Toast = swal.mixin({
      toast: true,
      position: 'bottom-right',
      customClass: {
        popup: 'colored-toast',
      },
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: false,
    });
    return Toast.fire({
      icon: icon,
      title: message,
    });
  }

  public handleAuthError(err: any): any {
    console.log(err);

    console.error('Error Response:', err.error);

    const errorMessage = err?.error?.message || 'Something went wrong.';

    switch (err.status) {
      case 0:
        this.toast('Server is not reachable. Please try again later.', 'error');
        break;

      case 400:
        this.toast(errorMessage, 'error');
        break;

      case 401:
        this.toast(errorMessage, 'error');
        this.getUnauthorizedUser();
        break;

      case 404:
        this.toast(errorMessage, 'error');
        break;

      case 500:
        this.toast('Internal Server Error. Please try again later.', 'error');
        break;

      default:
        this.toast(errorMessage, 'error');
        break;
    }

    return throwError(() => err);
  }
  getUnauthorizedUser() {
    this._router.navigateByUrl('/login');
    // this.removeLocalStorageData(CommonConstants.TOKEN);
    this.clearLocalStorageData();
  }

  getLoginUser() {
    return this.getLocalStorageData(CommonConstants.USER_DATA);
  }

  checkLogin(keyName: any) {
    const localStorageDetails = localStorage.getItem(keyName);
    if (localStorageDetails != null && localStorageDetails != '') {
      return true;
    } else {
      return false;
    }
  }

  getAuthToken() {
    return this.getLocalStorageData(CommonConstants.TOKEN);
  }
}

export const passwordsMatchValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;

  // don't validate mismatch until both are filled
  if (!password || !confirm) return null;

  return password === confirm ? null : { mismatch: true };
};
