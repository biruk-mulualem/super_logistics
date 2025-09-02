import { TestBed } from '@angular/core/testing';
import { IntransitResolverService } from './intransit-resolver.service';



describe('IntransitResolverService', () => {
  let service: IntransitResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntransitResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
