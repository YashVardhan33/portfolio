import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-desktop-icon',
  imports: [MatIconModule],
  templateUrl: './desktop-icon.component.html',
  styleUrl: './desktop-icon.component.scss'
})
export class DesktopIconComponent {

  @Input() icon: string = 'icon';
  @Input() label: string = 'Untitled.md';
  @Input() extension : string = '.md';
  @Input() onDoubleClick: ()=> void = ()=>{};

}
