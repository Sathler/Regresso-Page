import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormdataService {
  dadosCompartilhados$ = new BehaviorSubject<any>(null);

  atualizarDados(dados: {params: string, results: string, aprox: number, function?: string}) {
    this.dadosCompartilhados$.next(dados);
  }
}
