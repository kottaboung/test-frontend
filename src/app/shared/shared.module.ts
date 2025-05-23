import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// สมมุติว่าคุณมี LoadingModalComponent อยู่
import { LoadingModalComponent } from './loading-modal/loading-modal.component';
import { AlertModalComponent } from './alert-modal/alert-modal.component';

@NgModule({
  declarations: [
    LoadingModalComponent,
    AlertModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingModalComponent,
    AlertModalComponent
  ]
})
export class SharedModule {}
