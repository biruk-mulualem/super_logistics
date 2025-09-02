import { TestBed } from '@angular/core/testing';
import { IntransitCancelledResolverService } from './intransitcancelled-resolver.service';

describe('IntransitCancelledResolverService', () => {
  let service: IntransitCancelledResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntransitCancelledResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
