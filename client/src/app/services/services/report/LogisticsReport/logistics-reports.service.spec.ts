import { TestBed } from '@angular/core/testing';

import { LogisticsReportsService } from './logistics-reports.service';

describe('LogisticsReportsService', () => {
  let service: LogisticsReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogisticsReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
