import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticsItemCard } from './logistics-item-card';

describe('LogisticsItemCard', () => {
  let component: LogisticsItemCard;
  let fixture: ComponentFixture<LogisticsItemCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogisticsItemCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogisticsItemCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
