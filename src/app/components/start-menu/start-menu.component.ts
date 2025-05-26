import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-start-menu',
  imports: [],
  templateUrl: './start-menu.component.html',
  styleUrl: './start-menu.component.scss'
})
export class StartMenuComponent {
    @Output() shutdown = new EventEmitter<void>();
}
