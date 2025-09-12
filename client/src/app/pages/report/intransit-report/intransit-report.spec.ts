import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntransitReport } from './intransit-report';

describe('IntransitReport', () => {
  let component: IntransitReport;
  let fixture: ComponentFixture<IntransitReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntransitReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntransitReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
