import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { environment } from '../../environment/environment';

declare const google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  submitted = false;

  showModal = false;
  modalTitle = '';
  modalMessage = '';
  isSuccess = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // ngAfterViewInit(): void {
  //     google.account.id.initialize({
  //       client_id: environment.googleClientId,
  //       callback: (response: any) => this.handleCredentialResponse(response),
  //     });

  //      google.accounts.id.renderButton(
  //     document.getElementById('googleSignInDiv'),
  //     { theme: 'outline', size: 'large', type: 'standard' }
  //   );
  // }

  ngAfterViewInit(): void {
    const win = window as any;
    const interval = setInterval(() => {
      if (win.google && win.google.accounts && win.google.accounts.id) {
        clearInterval(interval);
        this.initGoogleSignIn();
      }
    }, 100);
  }

  initGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    google.accounts.id.renderButton(
      document.getElementById('googleSignInDiv'),
      { theme: 'outline', size: 'large' }
    );
  }

  handleCredentialResponse(response: any) {
    console.log('Google ID Token:', response);
    this.authService.loginWithGoogle(response.credential).subscribe({
    next: (res) => {
      console.log('Google login response:', res);
      this.modalTitle = 'Login success!';
      this.isSuccess = true;
      this.showModal = true;
      location.reload();
    },
    error: (err) => {
      this.modalTitle = 'Google login failed';
      this.modalMessage = err.error?.message || 'Something went wrong';
      this.isSuccess = false;
      this.showModal = true;
    }
  });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.authService.login({ email, password }).subscribe({
        next: () => {
          this.authService.getMe().subscribe({
            next: (user) => {
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.authService.setCurrentUser(user);
              console.log(user);
              this.modalTitle = 'Login success!';
              this.isSuccess = true;
              this.showModal = true;
            },
            error: () => {
              this.modalTitle = 'Error loading user profile';
              this.modalMessage = 'Please try again.';
              this.isSuccess = false;
              this.showModal = true;
            }
          });
        },
        error: (err) => {
          this.modalTitle = 'Login failed';
          this.modalMessage = err.error.message;
          this.isSuccess = false;
          this.showModal = true;
        },
      });
    }
  }

//   onGoogleSignIn(event: any) {
//   console.log('clicked');
//   const user = event as SocialUser;
//   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
//     console.log('Google login success:', user);
//     this.authService.loginWithGoogle(user.idToken).subscribe({
//       next: (res) => {
//         this.authService.getMe().subscribe({
//           next: (user) => {
//             localStorage.setItem('currentUser', JSON.stringify(user));
//             this.authService.setCurrentUser(user);
//             this.modalTitle = 'Login success!';
//             this.isSuccess = true;
//             this.showModal = true;
//           },
//           error: () => {
//             this.modalTitle = 'Error loading user profile';
//             this.modalMessage = 'Please try again.';
//             this.isSuccess = false;
//             this.showModal = true;
//           },
//         });
//       },
//       error: (err) => {
//         this.modalTitle = 'Google login failed';
//         this.modalMessage = err.error.message || 'Something went wrong';
//         this.isSuccess = false;
//         this.showModal = true;
//       },
//     });
//   }).catch((err) => {
//     console.error('Google sign-in error:', err);
//     this.modalTitle = 'Google login failed';
//     this.modalMessage = err.error?.message || 'Something went wrong';
//     this.isSuccess = false;
//     this.showModal = true;
//   });
// }

  onModalClose() {
    this.showModal = false;
    if (this.isSuccess) {
      this.router.navigate(['/home']); // หรือหน้า dashboard ที่ต้องการ
    }
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

}
