import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Calander } from './calander';

describe('Calander', () => {
  let component: Calander;
  let fixture: ComponentFixture<Calander>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calander]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Calander);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
