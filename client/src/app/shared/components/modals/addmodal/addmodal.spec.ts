import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addmodal } from './addmodal';

describe('Addmodal', () => {
  let component: Addmodal;
  let fixture: ComponentFixture<Addmodal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addmodal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addmodal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
