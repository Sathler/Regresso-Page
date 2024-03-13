import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomChartFormComponent } from './custom-chart-form.component';

describe('CustomChartFormComponent', () => {
  let component: CustomChartFormComponent;
  let fixture: ComponentFixture<CustomChartFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomChartFormComponent]
    });
    fixture = TestBed.createComponent(CustomChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
