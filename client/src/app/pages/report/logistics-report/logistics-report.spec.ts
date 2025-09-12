import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticsReport } from './logistics-report';

describe('LogisticsReport', () => {
  let component: LogisticsReport;
  let fixture: ComponentFixture<LogisticsReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogisticsReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogisticsReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
