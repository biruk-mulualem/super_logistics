import { TestBed } from '@angular/core/testing';
import { IntransitDoneResolverService } from './intransitdone-resolver.service';


describe('IntransitDoneResolverService', () => {
  let service: IntransitDoneResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntransitDoneResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
