import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContentModalComponent } from "./components/content-modal/content-modal.component";
import { DesktopIconComponent } from './components/desktop-icon/desktop-icon.component';
import { StartMenuComponent } from "./components/start-menu/start-menu.component";
import { TaskbarComponent } from "./components/taskbar/taskbar.component";
import { StartMenuService } from './services/StartMenu/start-menu.service';
import { WindowManagerService } from './services/window-manager/window-manager.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [TaskbarComponent, DesktopIconComponent, ContentModalComponent, CommonModule, StartMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit,OnDestroy {

  startMenuOpen = false;
  private startMenuService = inject(StartMenuService);
  private sub = new Subscription();

  @ViewChild('startMenuRef') startMenuRef?: ElementRef;
  @ViewChild('taskbarRef') taskbarRef?: ElementRef;

toggleStartMenu() {
  this.startMenuOpen = !this.startMenuOpen;
}




  openWindow(fileName: string): void{
    const icon = this.getIconForFile(fileName);
    const dummyContent = `# ${fileName}\n\nThis is content loaded for "${fileName}"\nMore text here...`;
    this.windowManager.openWindow(fileName, fileName, dummyContent,icon);
    console.log('Open file: ', fileName);
  }

  openWin(fileName: string,icon : string, content : string): void{
    //const icon = this.getIconForFile(fileName);
    //const dummyContent = `# ${fileName}\n\nThis is content loaded for "${fileName}"\nMore text here...`;
    this.windowManager.openWindow(fileName, fileName, content,icon);
    console.log('Open file: ', fileName);
  }




  handleClose(id: number){
    this.windowManager.closeWindow(id);
  }

  handleFocus(id: number){
    this.windowManager.bringToFront(id);
  }

   handleAboutMeDoubleClick = (): void => {
    const fileContent = `##AboutMe\n\nHi I am Yash Vardhan Singh, a student of IIT(BHU) Varanasi.\nI am pursuing Integrated Dual degree in Ceramic Engineering.\nMy cgpa is 8.34.\nYou can contact me at yashshekhawat2511@gmail.com\nMy Graduation year is 2026`;
    const icon = 'assets/icons/md.svg';
    this.openWin('AboutMe.md',icon,fileContent);
    // this.openWindow('AboutMe.md');
  }

  handleSkillsDoubleClick = (): void => {
    const fileContent = `# Skills\n\n{
                \n  "languages": ["Java", "JavaScript", "TypeScript", "SQL"],\n  "frameworks": ["Spring", "Spring Boot", "Hibernate", "Angular", "Flutter"],\n  "interests": ["Competitive Programming", "Web Development", "DSA"]
                \n}
`;
    const icon = 'assets/icons/json.svg';
    this.openWin('Skills.json',icon,fileContent);
    // this.openWindow('AboutMe.md');
  }

  handleProjectsDoubleClick = (): void => {
    const fileContent = `## Projects
                \n### **Therapy Journal Backend (2025)**\nAn emotion journal management application that facilitates \nclient-therapist communication, emotional record-keeping, \nand secure messaging.
                \n   **Exposure:**\n    Designed a robust backend using Spring Boot.\n    Integrated DynamoDB for scalable data storage, \n    and implemented advanced querying techniques \n    for efficient data retrieval.\n
                \n### **E-commerce App (2024)**\nA Full stack E-commerce application/website that has real \nworld features like buy/sell products, admin dashboard, \norder tracking and many more.
                \n   **Exposure:**\n    Used SpringBoot framework for backend.\n    Used Angular framework for frontend.\n    Utilized MySQL for efficient data storage and retrieval.`;
    const icon = 'assets/icons/md.svg';

    this.openWin('Projects.md',icon, fileContent);
  }

  handlePoRDoubleClick = (): void => {
    const fileContent = `## Position of Responsibility
                \n- Served as SCS Induction Mentor under the SCS Induction Mentorship Programme 2022-23.\n- Worked as Content Executive in Riva Metaverse Seminar organized by Club of Sustainability and Innovation,
 IIT(BHU).\n- Worked as Informal Executive in the Informal Team of Spardha 2022.`;
    const icon = 'assets/icons/file.svg';

    this.openWin('PoR',icon, fileContent);
  }

  handleAchievementDoubleClick = (): void => {
    const fileContent = `## Achievement
                \nString academic = " Secured AIR 15467 in JEE Main 2021 among more than a million candidates."\nString codeforces= "Codeforces: Max. Rating: 1130 — Handle: yashvardhan3" \nString rank = "Ranked 4434 Globally in the Codeforces Round 924"\nString certification =" Certified by HackerRank on Problem Solving (Intermediate) skills"`;
    const icon = 'assets/icons/java.svg';

    this.openWin('PoR',icon, fileContent);
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

    this.sub.add(this.startMenuService.calculatorClicked$.subscribe(()=>{
      console.log('app component calculator clicked$ received');
      this.handleCalculatorDoubleClick();
    }))
    //throw new Error('Method not implemented.');
  }

  constructor(public windowManager: WindowManagerService){}
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    //throw new Error('Method not implemented.');
  }

  handleCalculatorDoubleClick = (): void => {
  this.windowManager.openWindow(
    'Calculator',
    'Calculator.exe',
    '', // No raw content for calculator
    'assets/icons/calc.svg',
    'calculator'
  );
  console.log("calculator clicked method ended");
};

closeStartMenu() {
  this.startMenuOpen = false;
}


// @HostListener('document:click', ['$event'])
// onDocumentClick(event: MouseEvent) {
//   const target = event.target as HTMLElement;
//   const startMenuElement = document.querySelector('.start-menu-wrapper');
//   if (this.startMenuOpen && startMenuElement && !startMenuElement.contains(target)) {
//     console.log('Clicked outside Start Menu from AppComponent');
//     this.startMenuOpen = false;
//   }
// }
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  if (!this.startMenuOpen) return;

  const target = event.target as HTMLElement;

  // Check if click is inside start menu
  const startMenuElement = this.startMenuRef?.nativeElement;
  const isInsideStartMenu = startMenuElement && startMenuElement.contains(target);

  // Check if click is on start button
  const startButton = document.querySelector('[data-start-button]');
  const isStartButton = startButton && startButton.contains(target);

  // Close menu if clicked outside both start menu and start button
  if (!isInsideStartMenu && !isStartButton) {
    console.log('Clicked outside Start Menu - closing');
    this.startMenuOpen = false;
  }
}







}
