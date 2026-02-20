import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ApiService } from '../../../core/services/api.service';
import { Api } from '../../../core/services/api-list';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from '../../../core/services/helper.service';
import { CommonConstants } from '../../../core/constants/common-constants';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  providers: [Api, ApiService, AuthService],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;

  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  public _helper = inject(HelperService);
  private _apiService = inject(AuthService);

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    const data = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this._apiService.login(data).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res && res?.access_token) {
          this._helper.setLocalStorageData(
            CommonConstants.TOKEN,
            JSON.stringify(res.access_token),
          );
          const decoded: any = jwt_decode.jwtDecode(res.access_token);
          console.log(decoded);

          this._helper.setLocalStorageData(
            CommonConstants.USER_DATA,
            JSON.stringify(decoded?.role),
          );
          this._router.navigate(['/task-management/list']);
          this._helper.toast('Login Successfully!', 'success');
        } else {
          this._helper.toast(res?.message, 'error');
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this._helper.toast(
          error.message || 'An error occurred. Please try again.',
          'error',
        );
      },
    });
  }
}
