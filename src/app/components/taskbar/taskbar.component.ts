import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StartMenuComponent } from "../start-menu/start-menu.component";
@Component({
  selector: 'app-taskbar',
  imports: [CommonModule, MatIconModule, StartMenuComponent],
  templateUrl: './taskbar.component.html',
  styleUrl: './taskbar.component.scss'
})
export class TaskbarComponent {
  @Input() openWindows: {id: number; title: string}[] = [];
  @Output() openWindow = new EventEmitter<number>();
  @Output() startClicked = new EventEmitter<number>();

  onAppClick(id: number){
    this.openWindow.emit(id);
  }

  onClickTask(id: number){
    this.openWindow.emit(id);
  }

  onStartClick(){
    this.startClicked.emit();
  }



   time: string = '';
   date: string = '';

   showStartMenu = false;
    toggleStartMenu(){
      this.showStartMenu = !this.showStartMenu;
    }

    handleShutdown(){
      window.location.href = '';
    }


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
