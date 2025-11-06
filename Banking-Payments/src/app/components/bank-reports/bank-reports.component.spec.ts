import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankReportsComponent } from './bank-reports.component';

describe('BankReportsComponent', () => {
  let component: BankReportsComponent;
  let fixture: ComponentFixture<BankReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
