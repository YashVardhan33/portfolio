import { TestBed } from '@angular/core/testing';

import { StartMenuService } from './start-menu.service';

describe('StartMenuService', () => {
  let service: StartMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StartMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
