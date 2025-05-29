import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StartMenuService {
private calculatorClickSubject = new Subject<void>();
calculatorClicked$= this.calculatorClickSubject.asObservable();

triggerCalculatorClick(){
  this.calculatorClickSubject.next();
}
  constructor() { }
}
