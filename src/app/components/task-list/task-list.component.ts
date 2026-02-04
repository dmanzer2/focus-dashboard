import { Component, inject, signal } from '@angular/core';
import { SessionService, Task } from '../../services/session.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  protected readonly sessionService = inject(SessionService);
  
  protected readonly activeTasks = this.sessionService.activeTasks;
  protected readonly completedTasks = this.sessionService.completedTasks;
  protected readonly activeTask = this.sessionService.activeTask;
  
  // Form state
  protected readonly newTaskTitle = signal('');
  protected readonly newTaskDifficulty = signal<'easy' | 'medium' | 'hard'>('medium');
  protected readonly showCompleted = signal(false);

  protected addTask(): void {
    const title = this.newTaskTitle().trim();
    if (title) {
      this.sessionService.addTask(title, this.newTaskDifficulty());
      this.newTaskTitle.set('');
      this.newTaskDifficulty.set('medium');
    }
  }

  protected selectTask(task: Task): void {
    const currentActiveId = this.activeTask()?.id;
    
    if (currentActiveId === task.id) {
      this.sessionService.setActiveTask(null);
    } else {
      this.sessionService.setActiveTask(task.id);
    }
  }

  protected deleteTask(id: string, event: Event): void {
    event.stopPropagation();
    this.sessionService.deleteTask(id);
  }

  protected toggleComplete(id: string, event: Event): void {
    event.stopPropagation();
    this.sessionService.toggleTaskComplete(id);
  }

  protected toggleShowCompleted(): void {
    this.showCompleted.update(v => !v);
  }

  // Track by function for @for performance
  protected trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}
