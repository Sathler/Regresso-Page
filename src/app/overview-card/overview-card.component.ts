import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OverviewServerService } from '../overview-server.service';
import overviewResult from '../../interface/OverviewResults'

@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.scss']
})
export class OverviewCardComponent {
  showComponent: boolean;
  results: overviewResult[];
  aprox: number;
  formato: string;

  constructor(
    private overviewServerService: OverviewServerService,
    private cdr: ChangeDetectorRef
  ){
    this.showComponent = false;
    this.results = []
    this.aprox = 4
    this.formato = `1.${this.aprox}-${this.aprox}`
    console.log(this.formato)
  }

  ngOnInit() {
    this.overviewServerService.recoverResults().subscribe(
      (results) => {
        this.results = results;
        this.cdr.detectChanges();
        this.showComponent = !(this.results.length == 0)
      }
    )
  }
}
