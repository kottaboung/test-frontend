import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'home',
    loadChildren: () => 
      import('./features/home/home.module').then(m => m.HomeModule)
  },

  {
    path: 'login',
    loadChildren: () => 
      import('./features/login/login.module').then(m => m.LoginModule)
  },
  { 
    path: 'register',
    loadChildren: () => import('./features/register/register.module').then(m => m.RegisterModule) 
  },

  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
