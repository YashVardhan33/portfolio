import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface AndroidApp {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

@Component({
  selector: 'app-android-home',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './android-home.component.html',
  styleUrl: './android-home.component.scss'
})
export class AndroidHomeComponent {
  @Output() appOpened = new EventEmitter<AndroidApp>();
  @Output() backPressed = new EventEmitter<void>();
  @Output() homePressed = new EventEmitter<void>();

  time: string = '';
  canGoBack: boolean = false;

  apps: AndroidApp[] = [
    {
      id: 'about',
      label: 'About Me',
      icon: 'assets/icons/txt.svg',
      action: () => this.openAboutMe()
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: 'assets/icons/json.svg',
      action: () => this.openSkills()
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: 'assets/icons/md.svg',
      action: () => this.openProjects()
    },
    {
      id: 'calculator',
      label: 'Calculator',
      icon: 'assets/icons/calc.svg',
      action: () => this.openCalculator()
    },
    {
      id: 'por',
      label: 'Experience',
      icon: 'assets/icons/file.svg',
      action: () => this.openPoR()
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: 'assets/icons/java.svg',
      action: () => this.openAchievements()
    }
  ];

  constructor() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
    this.time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  openApp(app: AndroidApp) {
    this.canGoBack = true;
    app.action();
    this.appOpened.emit(app);
  }

  goBack() {
    if (this.canGoBack) {
      this.backPressed.emit();
      this.canGoBack = false;
    }
  }

  goHome() {
    this.homePressed.emit();
    this.canGoBack = false;
  }

  showRecents() {
    // Implementation for recent apps
  }

  // App opening methods
  openAboutMe() {
    // This will be handled by parent component
  }

  openSkills() {
    // This will be handled by parent component
  }

  openProjects() {
    // This will be handled by parent component
  }

  openCalculator() {
    // This will be handled by parent component
  }

  openPoR() {
    // This will be handled by parent component
  }

  openAchievements() {
    // This will be handled by parent component
  }
}
