import { Component, inject } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {
  protected readonly sessionService = inject(SessionService);
  
  protected readonly stats = this.sessionService.sessionStats;
  protected readonly productivityScore = this.sessionService.productivityScore;
}
