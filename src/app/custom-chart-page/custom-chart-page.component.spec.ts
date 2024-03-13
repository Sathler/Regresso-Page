import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomChartPageComponent } from './custom-chart-page.component';

describe('CustomChartPageComponent', () => {
  let component: CustomChartPageComponent;
  let fixture: ComponentFixture<CustomChartPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomChartPageComponent]
    });
    fixture = TestBed.createComponent(CustomChartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
