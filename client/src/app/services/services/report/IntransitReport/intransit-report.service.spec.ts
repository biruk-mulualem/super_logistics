import { TestBed } from '@angular/core/testing';
import { IntransitReportService } from './intransit-report.service';

describe('IntransitReportService', () => {
  let service: IntransitReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntransitReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
