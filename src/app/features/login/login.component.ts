import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  submitted = false;

  showModal = false;
  modalTitle = '';
  modalMessage = '';
  isSuccess = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.authService.login({ email, password }).subscribe({
        next: () => {
          this.modalTitle = 'Login success!';
          this.isSuccess = true;
          this.showModal = true;
        },
        error: (err) => {
          this.modalTitle = 'Login failed '
          this.modalMessage = err.error.message;
          this.isSuccess = false;
          this.showModal = true;
        },
      });
    }
  }

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
