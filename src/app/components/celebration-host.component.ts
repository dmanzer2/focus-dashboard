import { Component, inject, ViewContainerRef, effect } from '@angular/core';
import { SessionService } from '../services/session.service';
import { CelebrationComponent } from './celebration/celebration.component';

@Component({
  selector: 'app-celebration-host',
  template: '',
  standalone: true
})
export class CelebrationHostComponent {
  private readonly sessionService = inject(SessionService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private previousSessions = 0;

  constructor() {
    // Watch for session completion
    effect(() => {
      const stats = this.sessionService.sessionStats();
      if (stats.totalSessions > this.previousSessions && this.previousSessions > 0) {
        this.showCelebration();
      }
      this.previousSessions = stats.totalSessions;
    });
  }

  private showCelebration(): void {
    // Use the new createComponent API
    const componentRef = this.viewContainerRef.createComponent(CelebrationComponent);
    
    // Auto-remove after animation
    setTimeout(() => {
      componentRef.destroy();
    }, 4000);
  }
}
