import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { selectedImageBase64, updateUser } from '../../interface/user';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent implements OnInit {
  form: FormGroup;
  profileImageUrl: string = 'assets/user.png';
  selectedImageBase64: string | null = null;
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  isSuccess = false;

  constructor(
    private imageCompress: NgxImageCompressService,
    private authService: AuthService,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      username: [''],
      email: [''],
      profileImage: [null],
    });
  }

  ngOnInit(): void {
    const userStr = localStorage.getItem('currentUser');
    console.log(userStr);
    if (userStr) {
      const user = JSON.parse(userStr);
      this.form.patchValue({
        username: user.name || '',
        email: user.email || '',
      });
      if (user.profileImage) {
        this.profileImageUrl = user.profileImage;
      }
    }
  }

  onProfileImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = e.target.result;
      this.imageCompress.compressFile(image, -1, 50, 50).then(
        compressedImage => {
          this.profileImageUrl = compressedImage;
          this.selectedImageBase64 = compressedImage;

          const userStr = localStorage.getItem('currentUser');
          if (userStr) {
            const user = JSON.parse(userStr);
            user.profileImage = compressedImage;
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
        }
      );
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.form.valid) {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        this.modalTitle = 'Authentication required';
        this.modalMessage = 'Please log in again.';
        this.isSuccess = false;
        this.showModal = true;
        return;
      }

      const data: updateUser = {
        name: this.form.value.username,
        email: this.form.value.email,
        profileImage: this.selectedImageBase64 || null,
      };

      this.authService.updateProfile(data).subscribe({
        next: (updatedUser) => {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.profileImageUrl = updatedUser.profileImage || 'assets/user.png';

          this.form.patchValue({
            profileImage: updatedUser.profileImage,
            username: updatedUser.name,
            email: updatedUser.email,
          });

          this.modalTitle = 'Profile updated successfully!';
          this.modalMessage = '';
          this.isSuccess = true;
          this.showModal = true;
        },
        error: (err) => {
          this.modalTitle = 'Update failed';
          this.modalMessage = err.error?.message || 'An error occurred';
          this.isSuccess = false;
          this.showModal = true;
        }
      });
    }
  }

  onModalClose() {
  this.showModal = false;
  location.reload();
}

}
