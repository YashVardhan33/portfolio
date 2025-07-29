import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-taskbar',
  imports: [CommonModule, MatIconModule], // Remove StartMenuComponent
  templateUrl: './taskbar.component.html',
  styleUrl: './taskbar.component.scss'
})
export class TaskbarComponent {
  @Input() openWindows: {id: number; title: string; iconUrl?:string}[] = [];
  @Output() openWindow = new EventEmitter<number>();
  @Output() startClicked = new EventEmitter<void>(); // Change to void

  onAppClick(id: number){
    this.openWindow.emit(id);
  }

  onStartClick(){
    this.startClicked.emit(); // Just emit without parameter
  }

  startIconUrl = 'assets/icons/start.svg';
  time: string = '';
  date: string = '';

  // Remove showStartMenu and toggleStartMenu - not needed anymore
  // Remove handleShutdown - not needed anymore

  constructor(){
    this.updateTime();
    setInterval(()=>this.updateTime(),1000);
    this.updateDate();
    setInterval(()=>this.updateDate(),1000);
  }

  updateTime(){
    const now = new Date();
    this.time = now.toLocaleTimeString([],{
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  updateDate(){
    const now = new Date();
    this.date = now.toLocaleDateString([],{
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
