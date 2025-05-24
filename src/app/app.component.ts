import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { User } from './interface/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  avatarUrl: string = 'assets/user.png'; // แก้ path รูป
  isLoggedIn = false;
  
  constructor(
    private router: Router,
    private authService: AuthService
    ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.isLoggedIn = !!user;
      this.avatarUrl = user?.profileImage || 'assets/user.png';
    });
  }

  goLoginOrLogout() {
    if (this.isLoggedIn) {
      this.authService.logout();
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goSetting() {
    this.router.navigate(['/setting']);
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('currentUser'); // clear เฉพาะ currentUser
    this.avatarUrl = 'assets/user.png';
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }
}
