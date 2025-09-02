import { TestBed } from '@angular/core/testing';

import { LogisticsCancelledResolverService } from './logisticscancelled-resolver.service';

describe('LogisticsCancelledResolverService', () => {
  let service: LogisticsCancelledResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogisticsCancelledResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
