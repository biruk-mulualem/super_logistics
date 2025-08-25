import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mainmodal } from './mainmodal';

describe('Mainmodal', () => {
  let component: Mainmodal;
  let fixture: ComponentFixture<Mainmodal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mainmodal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mainmodal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
