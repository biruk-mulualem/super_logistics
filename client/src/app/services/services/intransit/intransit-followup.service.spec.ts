import { TestBed } from '@angular/core/testing';
import { IntransitFollowupService } from './intransit-followup.service';


describe('IntransitFollowupService', () => {
  let service: IntransitFollowupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntransitFollowupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
