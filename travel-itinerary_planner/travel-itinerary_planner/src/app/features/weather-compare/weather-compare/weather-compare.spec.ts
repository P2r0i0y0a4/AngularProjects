import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherCompare } from './weather-compare';

describe('WeatherCompare', () => {
  let component: WeatherCompare;
  let fixture: ComponentFixture<WeatherCompare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherCompare],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherCompare);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
