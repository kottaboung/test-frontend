import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:3000/auth';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUserSubject.next(JSON.parse(userStr));
    }
  }

  login(dto: { email: string; password: string }) {
    return this.http.post<{ accessToken: string, refreshToken: string }>(`${this.API_URL}/login`, dto).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`);
  }

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.clear();
    this.http.post(`${this.API_URL}/logout`, {}).subscribe();
    this.currentUserSubject.next(null);
  }


//   private API_URL = 'http://localhost:3000/auth'

//   constructor(private http: HttpClient) {}

//   login(dto: { email: string; password: string }) {
//     return this.http.post(`${this.API_URL}/login`, dto).pipe(
//       tap((res: any) => {
//         localStorage.setItem('accessToken', res.accessToken);
//         localStorage.setItem('refreshToken', res.refreshToken);
//       })
//     );
//   }

  register(dto: { name: string; email: string; password: string }) {
    return this.http.post(`${this.API_URL}/register`, dto).pipe(
      tap((res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
  return localStorage.getItem('refreshToken');
  }

//   getMe(): Observable<any> {
//     const token = this.getAccessToken();

//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${token}`
//     });

//     return this.http.get(`${this.API_URL}/me`, { headers });
//   }
}
