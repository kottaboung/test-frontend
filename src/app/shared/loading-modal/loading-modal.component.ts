import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-modal',
  template: `
    <div *ngIf="show" class="overlay">
      <div class="spinner-border text-light" role="status"></div>
    </div>
  `,
  styleUrls: ['./loading-modal.component.scss']
})
export class LoadingModalComponent {
  @Input() show = false;
}
