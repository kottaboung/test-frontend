import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  isLoading = false;
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  isSuccess = false;



  constructor( 
    private router: Router, 
    private fb: FormBuilder, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
  this.submitted = true;
  if (this.form.valid) {
    const { name, email, password } = this.form.value;
    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        this.modalTitle = 'Register success!';
        this.isSuccess = true;          // ✅ เก็บสถานะ success
        this.showModal = true;
      },
      error: (err) => {
        this.modalTitle = 'Register failed ' 
        this.modalMessage = err.error.message;
        this.isSuccess = false;         // ❌ ไม่ redirect ถ้าไม่สำเร็จ
        this.showModal = true;
      },
    });
  }
}

onModalClose() {
  this.showModal = false;
  if (this.isSuccess) {
    this.router.navigate(['/login']);
  }
}



}
