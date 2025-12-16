import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersMessages } from './users-messages';

describe('UsersMessages', () => {
  let component: UsersMessages;
  let fixture: ComponentFixture<UsersMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersMessages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersMessages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
