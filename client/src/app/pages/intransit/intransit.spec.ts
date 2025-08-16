import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Intransit } from './intransit';

describe('Intransit', () => {
  let component: Intransit;
  let fixture: ComponentFixture<Intransit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Intransit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Intransit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
