import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AndroidApp } from '../android-home/android-home.component';
import { CalculatorComponent } from '../calculator/calculator.component';

@Component({
  selector: 'app-android-app-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, CalculatorComponent],
  templateUrl: './android-app-view.component.html',
  styleUrl: './android-app-view.component.scss'
})
export class AndroidAppViewComponent {
  @Input() currentApp: AndroidApp | null = null;
  @Output() backPressed = new EventEmitter<void>();
  @Output() homePressed = new EventEmitter<void>();

  onBack() {
    this.backPressed.emit();
  }

  onHome() {
    this.homePressed.emit();
  }

  getContentForApp(appId: string): string {
    switch (appId) {
      case 'about':
        return `About Me

Hi I am Yash Vardhan Singh, a student of IIT(BHU) Varanasi.
I am pursuing Integrated Dual degree in Ceramic Engineering.
My cgpa is 8.34.
You can contact me at yashshekhawat2511@gmail.com
My Graduation year is 2026`;

      case 'skills':
        return `Skills

{
  "languages": ["Java", "JavaScript", "TypeScript", "SQL"],
  "frameworks": ["Spring", "Spring Boot", "Hibernate", "Angular", "Flutter"],
  "interests": ["Competitive Programming", "Web Development", "DSA"]
}`;

      case 'projects':
        return `Projects

Therapy Journal Backend (2025)
An emotion journal management application that facilitates client-therapist communication, emotional record-keeping, and secure messaging.

Exposure:
• Designed a robust backend using Spring Boot.
• Integrated DynamoDB for scalable data storage, and implemented advanced querying techniques for efficient data retrieval.

E-commerce App (2024)
A Full stack E-commerce application/website that has real world features like buy/sell products, admin dashboard, order tracking and many more.

Exposure:
• Used SpringBoot framework for backend.
• Used Angular framework for frontend.
• Utilized MySQL for efficient data storage and retrieval.`;

      case 'por':
        return `Position of Responsibility

• Served as SCS Induction Mentor under the SCS Induction Mentorship Programme 2022-23.
• Worked as Content Executive in Riva Metaverse Seminar organized by Club of Sustainability and Innovation, IIT(BHU).
• Worked as Informal Executive in the Informal Team of Spardha 2022.`;

      case 'achievements':
        return `Achievements

Academic Achievement:
Secured AIR 15467 in JEE Main 2021 among more than a million candidates.

Codeforces:
Max. Rating: 1130 — Handle: yashvardhan3

Competition:
Ranked 4434 Globally in the Codeforces Round 924

Certification:
Certified by HackerRank on Problem Solving (Intermediate) skills`;

      default:
        return 'Content not available';
    }
  }
}
