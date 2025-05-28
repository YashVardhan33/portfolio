import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContentModalComponent } from "./components/content-modal/content-modal.component";
import { DesktopIconComponent } from './components/desktop-icon/desktop-icon.component';
import { StartMenuComponent } from "./components/start-menu/start-menu.component";
import { TaskbarComponent } from "./components/taskbar/taskbar.component";
import { WindowManagerService } from './services/window-manager/window-manager.service';

@Component({
  selector: 'app-root',
  imports: [TaskbarComponent, DesktopIconComponent, ContentModalComponent, CommonModule, StartMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  startMenuOpen = false;

toggleStartMenu() {
  this.startMenuOpen = !this.startMenuOpen;
}




  openWindow(fileName: string): void{
    const icon = this.getIconForFile(fileName);
    const dummyContent = `# ${fileName}\n\nThis is content loaded for "${fileName}"\nMore text here...`;
    this.windowManager.openWindow(fileName, fileName, dummyContent,icon);
    console.log('Open file: ', fileName);
  }

  handleClose(id: number){
    this.windowManager.closeWindow(id);
  }

  handleFocus(id: number){
    this.windowManager.bringToFront(id);
  }

   handleAboutMeDoubleClick = (): void => {
    this.openWindow('AboutMe.md'); // Corrected from 'projects.json' if this icon is for AboutMe
  }

  handleProjectsDoubleClick = (): void => {
    this.openWindow('projects.json');
  }

  handleMinimize(id: number) {
  this.windowManager.minimizeWindow(id);
}

handleRestore(id: number){
  const win = this.windowManager.windows.find(w=>w.id===id);
  if(win){
    win.isMinimized = !win.isMinimized;
    if (!win.isMinimized) {
      this.windowManager.bringToFront(id);
    } else {
      this.windowManager.minimizeWindow(id);
    }


  }
}

getIconForFile(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'md': return 'assets/icons/md.svg';
    case 'json': return 'assets/icons/json.svg';
    case 'java': return 'assets/icons/java.svg';
    case 'txt': return 'assets/icons/txt.svg';
    default: return 'assets/file-icons/file.svg';
  }
}



  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  constructor(public windowManager: WindowManagerService){}

  // constructor(
  //   private portfolioData: PortfolioDataService

  //   //public themeService: ThemeService;
  // ){}

  // title = 'portfolio-frontend';
}
