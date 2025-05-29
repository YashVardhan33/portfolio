import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { evaluate } from 'mathjs';
@Component({
  selector: 'app-calculator',
  imports: [CommonModule,FormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {
    display = '';

    append(char: string){
      this.display+=char;
    }
    clear(){
      this.display='';
    }
    calculate(){
      try {
        this.display = evaluate(this.display).toString();
      } catch ( e) {
        this.display = 'error';
      }
    }
}
