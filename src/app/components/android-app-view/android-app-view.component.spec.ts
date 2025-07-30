import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndroidAppViewComponent } from './android-app-view.component';

describe('AndroidAppViewComponent', () => {
  let component: AndroidAppViewComponent;
  let fixture: ComponentFixture<AndroidAppViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AndroidAppViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AndroidAppViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
