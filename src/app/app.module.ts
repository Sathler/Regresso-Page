import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ChartComponent } from './chart/chart.component';
import { GenericToastComponent } from './generic-toast/generic-toast.component';
import { GenericRetractableCardComponent } from './generic-retractable-card/generic-retractable-card.component';
import { FormDataComponent } from './form-data/form-data.component';
import { AppRoutingModule } from './app-routing.module';
import { CustomChartPageComponent } from './custom-chart-page/custom-chart-page.component';
import { CustomChartFormComponent } from './custom-chart-form/custom-chart-form.component';
import { OverviewCardComponent } from './overview-card/overview-card.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ChartComponent,
    GenericToastComponent,
    GenericRetractableCardComponent,
    FormDataComponent,
    CustomChartPageComponent,
    CustomChartFormComponent,
    OverviewCardComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
