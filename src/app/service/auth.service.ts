import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:3000/auth'

  constructor(private http: HttpClient) {}

  login(dto: { email: string; password: string }) {
    return this.http.post(`${this.API_URL}/login`, dto).pipe(
      tap((res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  register(dto: { name: string; email: string; password: string }) {
    return this.http.post(`${this.API_URL}/register`, dto).pipe(
      tap((res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  logout() {
  this.http.post(`${this.API_URL}/logout`, {}).subscribe();
  localStorage.clear();
}

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
  return localStorage.getItem('refreshToken');
}
}
