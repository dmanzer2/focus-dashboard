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
  private previousSessions = this.sessionService.sessionStats().totalSessions;

  constructor() {
    // Watch for session completion
    effect(() => {
      const stats = this.sessionService.sessionStats();
      if (stats.totalSessions > this.previousSessions) {
        this.showCelebration();
      }
      this.previousSessions = stats.totalSessions;
    });
  }

  private showCelebration(): void {
    const activeTask = this.sessionService.activeTask();
    const taskTitle = activeTask?.title || 'Focus Session';
    const stats = this.sessionService.sessionStats();
    
    // Use the new createComponent API
    const componentRef = this.viewContainerRef.createComponent(CelebrationComponent);
    
    // Pass inputs
    componentRef.setInput('taskTitle', taskTitle);
    componentRef.setInput('duration', 25);
    componentRef.setInput('scoreBoost', 10);
    
    // Listen for close event and destroy component
    componentRef.instance.closed.subscribe(() => {
      componentRef.destroy();
    });
  }
}
