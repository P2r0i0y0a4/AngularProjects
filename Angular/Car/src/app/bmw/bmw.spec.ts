import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bmw } from './bmw';

describe('Bmw', () => {
  let component: Bmw;
  let fixture: ComponentFixture<Bmw>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bmw],
    }).compileComponents();

    fixture = TestBed.createComponent(Bmw);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
