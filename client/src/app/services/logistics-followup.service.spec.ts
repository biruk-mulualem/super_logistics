import { TestBed } from '@angular/core/testing';

import { LogisticsFollowupService } from './logistics-followup.service';

describe('LogisticsFollowupService', () => {
  let service: LogisticsFollowupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogisticsFollowupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
