import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonelogisticsHistory } from './donelogistics-history';

describe('DonelogisticsHistory', () => {
  let component: DonelogisticsHistory;
  let fixture: ComponentFixture<DonelogisticsHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonelogisticsHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonelogisticsHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
