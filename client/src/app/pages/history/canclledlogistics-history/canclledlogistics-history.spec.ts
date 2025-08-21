import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanclledlogisticsHistory } from './canclledlogistics-history';

describe('CanclledlogisticsHistory', () => {
  let component: CanclledlogisticsHistory;
  let fixture: ComponentFixture<CanclledlogisticsHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanclledlogisticsHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanclledlogisticsHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
