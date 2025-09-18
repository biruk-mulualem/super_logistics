import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerTracker } from './container-tracker';

describe('ContainerTracker', () => {
  let component: ContainerTracker;
  let fixture: ComponentFixture<ContainerTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerTracker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerTracker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
