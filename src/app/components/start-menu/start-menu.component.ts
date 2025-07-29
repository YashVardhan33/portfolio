import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { StartMenuService } from '../../services/StartMenu/start-menu.service';

@Component({
  selector: 'app-start-menu',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './start-menu.component.html',
  styleUrl: './start-menu.component.scss'
})
export class StartMenuComponent {
    @Output() shutdown = new EventEmitter<void>();
    @Output() calculator = new EventEmitter<void>();
    private startService = inject(StartMenuService);

    onCalculatorClick(){
      console.log('StartMenuComponent triggering calculator event');
      this.startService.triggerCalculatorClick();
      this.shutdown.emit();
    }

    onShutdown(){
      this.shutdown.emit();
    }
}
