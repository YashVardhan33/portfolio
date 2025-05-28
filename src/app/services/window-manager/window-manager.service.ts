import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
interface OpenWindow{
  id: number;
  title: string;
  filename: string;
  content: string;
  zIndex: number;
  isMinimized: boolean;
  iconUrl?: string;
}


@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
    public windows: OpenWindow[] = [];
    private nextId = 1;
    private zCounter = 100;
    private windowsSubject = new BehaviorSubject<OpenWindow[]>([]);
    windows$ = this.windowsSubject.asObservable();

    openWindow(title: string, filename: string, content: string,iconUrl: string = 'assets/icons/file.svg'){
      const newWindow: OpenWindow = {
        id: this.nextId++,
        title,
        filename,
        content,
        zIndex: this.zCounter++,
        isMinimized : false,
        iconUrl,
      };

      this.windows.push(newWindow);
      this.update();

    }


    closeWindow(id: number){
      this.windows = this.windows.filter(w=> w.id!==id);
      this.update();
    }

    bringToFront(id: number){
      const win = this.windows.find(w=>w.id===id);
      if(win){
        win.zIndex = this.zCounter++;
        this.update();
      }
    }

    minimizeWindow(id: number): void {
      const win = this.windows.find(w=>w.id===id);
      if(win){
        win.isMinimized = true;
        this.emit();
      }
    }
    private emit(): void {
    this.windowsSubject.next([...this.windows]);
  }

    private update(){
      this.windowsSubject.next([...this.windows]);
    }
  constructor() { }
}
