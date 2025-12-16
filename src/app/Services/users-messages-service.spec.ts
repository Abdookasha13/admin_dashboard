import { TestBed } from '@angular/core/testing';

import { UsersMessagesService } from './users-messages-service';

describe('UsersMessagesService', () => {
  let service: UsersMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
