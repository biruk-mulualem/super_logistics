import { TestBed } from '@angular/core/testing';
import { LogisticsDoneResolverService } from './logisticsdone-resolver.service';
describe('LogisticsDoneResolverService', () => {
  let service: LogisticsDoneResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogisticsDoneResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
