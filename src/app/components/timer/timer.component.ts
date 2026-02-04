import { Component, inject, computed } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer',
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent {
  protected readonly sessionService = inject(SessionService);
  
  // Expose computed signals for template
  protected readonly formattedTime = this.sessionService.formattedTime;
  protected readonly isRunning = this.sessionService.timerIsRunning;
  protected readonly progress = this.sessionService.progress;
  protected readonly intensity = this.sessionService.intensity;
  protected readonly activeTask = this.sessionService.activeTask;
  
  // CSS custom property for breathing effect
  protected readonly breathingIntensity = computed(() => `${this.intensity()}`);
  protected readonly progressPercent = computed(() => `${this.progress()}%`);

  protected onStartPause(): void {
    if (this.isRunning()) {
      this.sessionService.pauseTimer();
    } else {
      this.sessionService.startTimer();
    }
  }

  protected onReset(): void {
    this.sessionService.resetTimer();
  }
}
