import { TestBed } from '@angular/core/testing';

import { BankUserReportService } from './bank-user-report.service';

describe('BankUserReportService', () => {
  let service: BankUserReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankUserReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
