import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherCompareComponent } from './weather.compare.component';

describe('WeatherCompareComponent', () => {
  let component: WeatherCompareComponent;
  let fixture: ComponentFixture<WeatherCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherCompareComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherCompareComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
