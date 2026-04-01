import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoginForm } from './new-login-form';

describe('NewLoginForm', () => {
  let component: NewLoginForm;
  let fixture: ComponentFixture<NewLoginForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLoginForm],
    }).compileComponents();

    fixture = TestBed.createComponent(NewLoginForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
