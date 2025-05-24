import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
  
  CommonModule,
    SettingRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    
  ]
})
export class SettingModule { }
