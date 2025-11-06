import { TestBed } from '@angular/core/testing';

import { SuperAdminReportService } from './super-admin-report.service';

describe('SuperAdminReportService', () => {
  let service: SuperAdminReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperAdminReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
