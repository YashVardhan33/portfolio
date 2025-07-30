import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectionService {
  private isMobileSubject = new BehaviorSubject<boolean>(this.checkIfMobile());
  public isMobile$ = this.isMobileSubject.asObservable();

  constructor() {
    this.checkDeviceOnResize();
    // Initial check after constructor
    setTimeout(() => {
      this.isMobileSubject.next(this.checkIfMobile());
    }, 0);
  }

  private checkIfMobile(): boolean {
    if (typeof window === 'undefined') {
      return false; // Server-side rendering fallback
    }

    const isMobileWidth = window.innerWidth <= 768;
    const isMobileUserAgent = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    console.log('Device check:', {
      width: window.innerWidth,
      isMobileWidth,
      isMobileUserAgent,
      result: isMobileWidth || isMobileUserAgent
    });

    return isMobileWidth || isMobileUserAgent;
  }

  private checkDeviceOnResize(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        const newIsMobile = this.checkIfMobile();
        console.log('Resize detected, new isMobile:', newIsMobile);
        this.isMobileSubject.next(newIsMobile);
      });
    }
  }

  get isMobile(): boolean {
    return this.isMobileSubject.value;
  }
}
