# Flow State Dashboard

A modern productivity dashboard built with **Angular 20** to track deep-work sessions, manage tasks, and visualize productivity metrics. This project showcases cutting-edge Angular features including Zoneless change detection, Signals, and dynamic component creation.

## 🌟 Features

### Core Functionality
- **High-Fidelity Visual Timer** - Circular progress ring with smooth animations and breathing effects
- **Dynamic Task Management** - Add, track, and complete tasks with difficulty-based durations
- **Live Productivity Score** - Real-time calculation based on completed sessions and tasks
- **Celebration Overlay** - Dynamic component created when sessions complete
- **Local Persistence** - All data saved to localStorage

### Task Difficulty System
- **Easy** - 15-minute focus sessions
- **Medium** - 25-minute focus sessions (default)
- **Hard** - 45-minute focus sessions

## 🎯 Angular 20 Features Demonstrated

### 1. Zoneless Change Detection
```typescript
// app.config.ts
provideZonelessChangeDetection()
```
The app runs entirely without Zone.js, showcasing optimal performance with signal-based reactivity.

### 2. Signals & linkedSignal
The SessionService demonstrates advanced signal patterns:

```typescript
// Auto-adjusting timer based on active task
private readonly timerDuration = linkedSignal<number>(() => {
  const taskId = this.activeTaskId();
  const task = this.tasks().find(t => t.id === taskId);
  // Returns different duration based on task difficulty
});
```

### 3. Computed Signals
Multiple computed signals for derived state:

```typescript
readonly formattedTime = computed(() => {
  const time = this.timeRemaining();
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

readonly intensity = computed(() => {
  // Dynamic intensity for breathing effect
  const percentRemaining = (this.timeRemaining() / this.timerDuration()) * 100;
  if (percentRemaining > 50) return 0.3;
  if (percentRemaining > 25) return 0.5;
  if (percentRemaining > 10) return 0.7;
  return 1.0;
});
```

### 4. Modern Control Flow (@if, @for, track)
All templates use Angular's built-in control flow:

```html
@if (activeTasks().length === 0) {
  <div class="empty-state">No tasks yet</div>
} @else {
  @for (task of activeTasks(); track trackByTaskId($index, task)) {
    <div class="task-card">{{ task.title }}</div>
  }
}
```

### 5. Dynamic Component Creation (createComponent API)
Celebration overlay is created dynamically without ComponentFactory:

```typescript
const componentRef = this.viewContainerRef.createComponent(CelebrationComponent);
setTimeout(() => componentRef.destroy(), 4000);
```

## 🎨 UI/UX Features

### Dark Theme
- **Primary Focus Color**: Neon mint (#64ffda) - reduces eye strain
- **Deep Background**: Dark navy (#0a0e1a)
- **Smooth Gradients**: Subtle breathing background effect

### Micro-Interactions
1. **Breathing Animation** - Timer intensity increases as time runs out
2. **Smooth Transitions** - All state changes are animated
3. **Hover Effects** - Cards lift and glow on hover
4. **Confetti Animation** - Celebration particles on session complete
5. **Glow Effects** - Timer and buttons pulse with focus color

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus-visible indicators
- Semantic HTML structure
- Screen reader friendly

## 📁 Project Structure

```
src/app/
├── app.config.ts                    # Zoneless config
├── app.ts                           # Root component
├── components/
│   ├── celebration/                 # Success overlay
│   ├── celebration-host.component.ts # Dynamic component host
│   ├── stats/                       # Productivity metrics
│   ├── task-list/                   # Task management
│   └── timer/                       # Focus timer
└── services/
    └── session.service.ts           # Core state management with Signals
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Navigate to `http://localhost:4200/` - the app will automatically reload when you make changes.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
