import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { CustomChartPageComponent } from './custom-chart-page/custom-chart-page.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ChartComponent
  },
  {
    path: 'custom-chart',
    component: CustomChartPageComponent
  },
  {
    path: 'about',
    component: AboutComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
