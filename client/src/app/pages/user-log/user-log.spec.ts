import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLog } from './user-log';

describe('UserLog', () => {
  let component: UserLog;
  let fixture: ComponentFixture<UserLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
