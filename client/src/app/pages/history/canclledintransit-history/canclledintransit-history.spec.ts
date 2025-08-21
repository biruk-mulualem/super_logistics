import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanclledintransitHistory } from './canclledintransit-history';

describe('CanclledintransitHistory', () => {
  let component: CanclledintransitHistory;
  let fixture: ComponentFixture<CanclledintransitHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanclledintransitHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanclledintransitHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
