import { TestBed } from '@angular/core/testing';

import { OverviewServerService } from './overview-server.service';

describe('OverviewServerService', () => {
  let service: OverviewServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverviewServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
