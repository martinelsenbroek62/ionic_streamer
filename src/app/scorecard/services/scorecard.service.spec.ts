import { TestBed } from '@angular/core/testing';

import { ScorecardService } from './scorecard.service';

describe('ScorecardService', () => {
  let service: ScorecardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScorecardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
