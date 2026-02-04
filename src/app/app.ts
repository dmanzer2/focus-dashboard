import { Component } from '@angular/core';
import { TimerComponent } from './components/timer/timer.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { StatsComponent } from './components/stats/stats.component';
import { CelebrationHostComponent } from './components/celebration-host.component';

@Component({
  selector: 'app-root',
  imports: [TimerComponent, TaskListComponent, StatsComponent, CelebrationHostComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
