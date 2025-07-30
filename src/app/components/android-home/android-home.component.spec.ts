import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndroidHomeComponent } from './android-home.component';

describe('AndroidHomeComponent', () => {
  let component: AndroidHomeComponent;
  let fixture: ComponentFixture<AndroidHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AndroidHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AndroidHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
