import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from "@angular/http";

import { MyDatePickerModule } from 'mydatepicker';

import { AppComponent } from './app.component';
import { BarChartComponent } from './visuals/graph/bar-chart/bar-chart.component';
import { PieChartComponent } from './visuals/graph/pie-chart/pie-chart.component';
import { DonutChartComponent } from './visuals/graph/donut-chart/donut-chart.component';
import { BarSelectionService } from './visuals/shared/services/barSelection.service';
import { DataService } from './visuals/shared/services/data.service';
import { HttpService } from './visuals/shared/services/http-service';

@NgModule({
  declarations: [
    AppComponent,
    BarChartComponent,
    PieChartComponent,
    DonutChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MyDatePickerModule
  ],
  providers: [HttpService, BarSelectionService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
