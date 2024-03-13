import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import overviewResult from '../interface/OverviewResults'

@Injectable({
  providedIn: 'root'
})
export class OverviewServerService {
  private results: overviewResult[] = []
  private resultsSubject = new BehaviorSubject<overviewResult[]>(this.results)
  constructor() { }

  addResult(result: overviewResult){
    this.results.push(result)
    this.results.sort(this.sortResults);
    this.resultsSubject.next([...this.results])
    this.setBetterCurve()
  }

  recoverResults(): Observable<overviewResult[]>{
    return this.resultsSubject.asObservable();
  }

  clearResults() {
    this.results = []
    this.resultsSubject.next([...this.results])
  }

  sortResults(a: overviewResult, b: overviewResult){
    if(a.determination != b.determination){
      return b.determination - a.determination;
    }
    return a.rmse - b.rmse;
  }

  setBetterCurve(){
    if(this.results.length > 0){
      let valorMaximo = Math.max(...this.results.map(dic => dic.determination));

      // Marcar todos os dicionários com o valor máximo
      this.results.forEach(dic => {
        if (dic.determination === valorMaximo) {
          dic.betterCurve = true;
        }
        else{
          dic.betterCurve = false;
        }
      });
    }
  }

}
