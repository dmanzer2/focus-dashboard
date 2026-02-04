import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-celebration',
  imports: [CommonModule],
  templateUrl: './celebration.component.html',
  styleUrl: './celebration.component.scss'
})
export class CelebrationComponent {
  protected readonly sessionService = inject(SessionService);
  protected readonly score = this.sessionService.productivityScore;
  protected readonly stats = this.sessionService.sessionStats;
  protected readonly visible = signal(true);

  protected close(): void {
    this.visible.set(false);
  }
}
