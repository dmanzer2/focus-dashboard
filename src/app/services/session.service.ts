// Managing all states using signals in this service to centralize state management for better performance, simpler debugging, and improved reactivity.
import { Injectable, signal, computed, effect, linkedSignal } from '@angular/core';

export interface Task {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  createdAt: Date;
}

export interface SessionStats {
  totalSessions: number;
  completedTasks: number;
  totalFocusMinutes: number;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  // Core state signals
  private readonly tasks = signal<Task[]>([]);
  private readonly activeTaskId = signal<string | null>(null);
  
  // Timer state
  private readonly timeRemaining = signal<number>(25 * 60); // 25 minutes in seconds
  private readonly isRunning = signal<boolean>(false);
  private timerInterval: any = null;
  
  // Session stats
  private readonly stats = signal<SessionStats>({
    totalSessions: 0,
    completedTasks: 0,
    totalFocusMinutes: 0
  });

  // Linked signal: when active task changes, auto-adjust timer duration based on difficulty
  private readonly timerDuration = linkedSignal<number>(() => {
    const taskId = this.activeTaskId();
    if (!taskId) return 25 * 60; // Default 25 minutes
    
    const task = this.tasks().find(t => t.id === taskId);
    if (!task) return 25 * 60;
    
    // Adjust timer based on task difficulty
    switch (task.difficulty) {
      case 'easy': return 15 * 60; // 15 minutes
      case 'medium': return 25 * 60; // 25 minutes
      case 'hard': return 45 * 60; // 45 minutes
      default: return 25 * 60;
    }
  });

  // Computed signals for UI
  readonly allTasks = computed(() => this.tasks());
  readonly activeTasks = computed(() => this.tasks().filter(t => !t.completed));
  readonly completedTasks = computed(() => this.tasks().filter(t => t.completed));
  readonly activeTask = computed(() => {
    const id = this.activeTaskId();
    return id ? this.tasks().find(t => t.id === id) : null;
  });
  
  readonly currentTime = computed(() => this.timeRemaining());
  readonly timerIsRunning = computed(() => this.isRunning());
  readonly sessionStats = computed(() => this.stats());
  
  // Formatted time display (MM:SS)
  readonly formattedTime = computed(() => {
    const time = this.timeRemaining();
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });
  
  // Progress percentage for visual effects
  readonly progress = computed(() => {
    const duration = this.timerDuration();
    const remaining = this.timeRemaining();
    return ((duration - remaining) / duration) * 100;
  });
  
  // Intensity increases as timer approaches zero (for breathing effect)
  readonly intensity = computed(() => {
    const remaining = this.timeRemaining();
    const duration = this.timerDuration();
    const percentRemaining = (remaining / duration) * 100;
    
    if (percentRemaining > 50) return 0.3;
    if (percentRemaining > 25) return 0.5;
    if (percentRemaining > 10) return 0.7;
    return 1.0;
  });

  // Productivity score based on completed tasks and focus time
  readonly productivityScore = computed(() => {
    const currentStats = this.stats();
    const completedTasksScore = currentStats.completedTasks * 10;
    const focusTimeScore = Math.floor(currentStats.totalFocusMinutes / 25) * 5;
    return Math.min(100, completedTasksScore + focusTimeScore);
  });

  constructor() {
    // Auto-reset timer when active task changes
    effect(() => {
      const duration = this.timerDuration();
      if (!this.isRunning()) {
        this.timeRemaining.set(duration);
      }
    });

    // Load saved data from localStorage
    this.loadFromStorage();
  }

  // Task management
  addTask(title: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      difficulty,
      completed: false,
      createdAt: new Date()
    };
    
    this.tasks.update(tasks => [...tasks, newTask]);
    this.saveToStorage();
  }

  deleteTask(id: string): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
    if (this.activeTaskId() === id) {
      this.activeTaskId.set(null);
    }
    this.saveToStorage();
  }

  toggleTaskComplete(id: string): void {
    this.tasks.update(tasks => 
      tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
    
    const task = this.tasks().find(t => t.id === id);
    if (task?.completed) {
      this.stats.update(s => ({
        ...s,
        completedTasks: s.completedTasks + 1
      }));
    } else {
      this.stats.update(s => ({
        ...s,
        completedTasks: Math.max(0, s.completedTasks - 1)
      }));
    }
    
    this.saveToStorage();
  }

  setActiveTask(id: string | null): void {
    this.activeTaskId.set(id);
    this.pauseTimer();
  }

  // Timer controls
  startTimer(): void {
    if (this.isRunning()) return;
    
    this.isRunning.set(true);
    this.timerInterval = setInterval(() => {
      this.timeRemaining.update(time => {
        if (time <= 1) {
          this.completeSession();
          return 0;
        }
        return time - 1;
      });
    }, 1000);
  }

  pauseTimer(): void {
    this.isRunning.set(false);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer(): void {
    this.pauseTimer();
    this.timeRemaining.set(this.timerDuration());
  }

  private completeSession(): void {
    this.pauseTimer();
    
    // Update stats
    const duration = this.timerDuration();
    this.stats.update(s => ({
      ...s,
      totalSessions: s.totalSessions + 1,
      totalFocusMinutes: s.totalFocusMinutes + Math.floor(duration / 60)
    }));
    
    // Complete active task if exists
    const activeId = this.activeTaskId();
    if (activeId) {
      this.toggleTaskComplete(activeId);
      this.activeTaskId.set(null);
    }
    
    this.saveToStorage();
  }

  // Persistence
  private saveToStorage(): void {
    localStorage.setItem('focus-dashboard-tasks', JSON.stringify(this.tasks()));
    localStorage.setItem('focus-dashboard-stats', JSON.stringify(this.stats()));
  }

  private loadFromStorage(): void {
    const savedTasks = localStorage.getItem('focus-dashboard-tasks');
    const savedStats = localStorage.getItem('focus-dashboard-stats');
    
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks);
        this.tasks.set(tasks.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt)
        })));
      } catch (e) {
        console.error('Failed to load tasks', e);
      }
    }
    
    if (savedStats) {
      try {
        this.stats.set(JSON.parse(savedStats));
      } catch (e) {
        console.error('Failed to load stats', e);
      }
    }
  }

  clearAllData(): void {
    this.tasks.set([]);
    this.activeTaskId.set(null);
    this.stats.set({
      totalSessions: 0,
      completedTasks: 0,
      totalFocusMinutes: 0
    });
    this.resetTimer();
    localStorage.removeItem('focus-dashboard-tasks');
    localStorage.removeItem('focus-dashboard-stats');
  }
}
