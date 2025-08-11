import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recyclebin } from './recyclebin';

describe('Recyclebin', () => {
  let component: Recyclebin;
  let fixture: ComponentFixture<Recyclebin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recyclebin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recyclebin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
