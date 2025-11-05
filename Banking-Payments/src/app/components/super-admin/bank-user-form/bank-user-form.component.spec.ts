import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankUserFormComponent } from './bank-user-form.component';

describe('BankUserFormComponent', () => {
  let component: BankUserFormComponent;
  let fixture: ComponentFixture<BankUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankUserFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
