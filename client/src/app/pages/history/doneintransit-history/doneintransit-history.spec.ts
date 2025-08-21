import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneintransitHistory } from './doneintransit-history';

describe('DoneintransitHistory', () => {
  let component: DoneintransitHistory;
  let fixture: ComponentFixture<DoneintransitHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneintransitHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneintransitHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
