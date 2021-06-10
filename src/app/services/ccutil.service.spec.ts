import { TestBed } from '@angular/core/testing';

import { CcutilService } from './ccutil.service';

describe('CcutilService', () => {
  let service: CcutilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CcutilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
