import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { ToastService } from '../toast.service';
import { FormdataService } from '../formdata.service';
// @ts-ignore
import plotly from 'plotly.js-dist';
import { OverviewServerService } from '../overview-server.service';
import { Subscription } from 'rxjs';
import overviewResult from 'src/interface/OverviewResults';

@Component({
  selector: 'app-generic-retractable-card',
  templateUrl:'./generic-retractable-card.component.html',
  styleUrls: ['./generic-retractable-card.component.scss']
})
export class GenericRetractableCardComponent implements OnInit {
  sub?: Subscription
  isCollapsed = true; // Variável para controlar o estado retrátil do card
  showResult = true;
  coeffs: number[] = [];
  equationValue = '';
  determinationCoef = 0.0;
  correlationCoef = 0.0;
  relativeError = 0.0;
  rmse = 0.0;
  blocked = true;
  @Input() type: string = '';
  title = ''
  dados!: {params: string, results: string, aprox: number, function: string};
  params!: number[]
  results!: number[]
  aprox: number
  aproxCoef: number
  aprox_format: string
  function: string

  chart_types = {
    'linear': {
      chart_element: 'chart-linear',
      min_size: 2,
      func: this.calculateLinearChart.bind(this),
      title: 'Regressão Linear'
    },
    'quadratic': {
      chart_element: 'chart-quadratic',
      min_size: 3,
      func: this.calculateQuadraticChart.bind(this),
      title: 'Regressão Quadrática'
    },
    'cubic': {
      chart_element: 'chart-cubic',
      min_size: 4,
      func: this.calculateCubicChart.bind(this),
      title: 'Regressão Cúbica'
    },
    'exp': {
      chart_element: 'chart-exp',
      min_size: 2,
      func: this.calculateExponentialChart.bind(this),
      title: 'Regressão Exponencial'
    },
    'logaritmic': {
      chart_element: 'chart-logaritmic',
      min_size: 2,
      func: this.calculateLogaritmicChart.bind(this),
      title: 'Regressão Logaritmica'
    },
    'n_logaritmic': {
      chart_element: 'chart-n_logaritmic',
      min_size: 2,
      func: this.calculateNLogaritmicChart.bind(this),
      title: 'Regressão N Log(N)'
    },
    'n2_logaritmic': {
      chart_element: 'chart-n2_logaritmic',
      min_size: 2,
      func: this.calculateN2LogaritmicChart.bind(this),
      title: 'Regressão N2 Log(N)'
    },
    'power': {
      chart_element: 'chart-power',
      min_size: 2,
      func: this.calculatePowerChart.bind(this),
      title: 'Regressão Potência'
    },
    'n_logaritmic2': {
      chart_element: 'chart-n_logaritmic2',
      min_size: 2,
      func: this.calculateNLogaritmic2Chart.bind(this),
      title: 'Regressão N Log(N)2'
    },
    'ema': {
      chart_element: 'chart-ema',
      min_size: 6,
      func: this.calculateEMAChart.bind(this),
      title: 'Regressão EMA'
    },
    'custom': {
      chart_element: 'chart-custom',
      min_size: 1,
      func: this.calculateCustomChart.bind(this),
      title: 'Regressão de Função Personalizada.'
    }
  }

  config = {
    responsive: true // Define o gráfico como responsivo
  };

  layout = {
    'xaxis': {
      'rangemode': 'tozero',
      'title': 'N'
    },
    'yaxis': {
      'rangemode': 'tozero',
      'title': 'Tempo'
    }
  }

  constructor(
    private formdataService: FormdataService,
    private apiService: ApiService,
    private toastService: ToastService,
    private overviewServerService: OverviewServerService
  ) {
    this.dados = {
      'params': '',
      'results': '',
      'aprox': 4,
      'function': ''
    };
    this.params = [];
    this.results = [];
    this.aprox = 4;
    this.aprox_format = `1.0-${this.aprox}`;
    this.function = '';
    this.aproxCoef = 2;
  }

  ngOnInit() {
    this.sub = this.formdataService.dadosCompartilhados$.subscribe(dados => {
      this.dados = dados;
      if(this.validate_params(this.dados.params) && this.validate_params(this.dados.results)){
        this.params = this.dados.params.trim().split(/\s+/).map(str => parseFloat(str))
        this.results = this.dados.results.trim().split(/\s+/).map(str => parseFloat(str))
        this.title = this.chart_types[this.type as keyof typeof this.chart_types].title
        this.aprox = this.dados.aprox
        this.aprox_format = `1.0-${this.aprox}`;
        this.aproxCoef = this.aprox
        if('function' in this.dados){
          this.function = this.dados.function
        }
        else{
          this.function = ''
        }
        if(!isNaN(this.params[0]) && !isNaN(this.results[0])){
          this.renderChart(this.params, this.results, this.aprox, this.function);
        }
      }
      else{
        this.toastService.showToast('Error', "Existem caracteres inválidos na entrada.")
      }
    });
  }

  ngOnDestroy(){
    this.sub?.unsubscribe();
  }

  ngAfterViewInit() {
    this.renderChart()
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed || this.blocked; // Função para alternar o estado retrátil do card
  }

  disableCard() {
    this.blocked = true;
  }

  activateCard() {
    this.blocked = false;
  }

  validate_params(text: string){
    const regex = /^[0-9.\s]*$/;
    return regex.test(text)
  }

  async renderChart(params?: number[], results?: number[], aprox?: number, cfunc?: string) {
    const min_size = this.chart_types[this.type as keyof typeof this.chart_types].min_size;
    const chart_element = this.chart_types[this.type as keyof typeof this.chart_types].chart_element
    const func = this.chart_types[this.type as keyof typeof this.chart_types].func
    const title = this.chart_types[this.type as keyof typeof this.chart_types].title
    
    if(params !== undefined && results !== undefined && aprox !== undefined){
      if(aprox > 10){
        this.toastService.showToast('Error', "O máximo de casas decimais permitidas é 10")
        this.isCollapsed = true
        this.disableCard()
      }
      else if(aprox < 0){
        this.toastService.showToast('Error', "O número de casas decimais deve ser positivo")
        this.isCollapsed = true
        this.disableCard()
      }

      else if(params.length != results.length){
        this.toastService.showToast('Error', "A quantidade de valores de X e Y devem ser iguais")
        this.isCollapsed = true
        this.disableCard()
      }
      else if(params.length < min_size){
        console.log(`${title} deve receber pelo menos ${min_size} resultados.`); //depende do tipo
        plotly.newPlot(chart_element, []);
        this.isCollapsed = true
        this.disableCard()
      }
      else{ 
        try {
          let data = await func(params, results, aprox, cfunc??"")
          plotly.newPlot(chart_element, data, this.layout, this.config);

          this.activateCard()
          this.isCollapsed = false && !this.blocked
          let resultOverview: overviewResult = {
            type: this.title,
            determination: this.determinationCoef,
            correlation: this.correlationCoef,
            error: this.relativeError,
            rmse: this.rmse,
            aprox: `1.0-${this.aprox}`,
            betterCurve: false
          }
          this.overviewServerService.addResult(resultOverview)
        }
        catch (error){
          console.error(error)
          this.toastService.showToast('Error', <string> error)
        }
      }
    }
    else{
      plotly.newPlot(chart_element, []);
    }
  }

  async calculateLinearChart(params: number[], results: number[], aprox: number) {
    let response = await this.apiService.getDataRegression(this.type, params, results, 20)

    if(response.success){
      let trace1 = {
        x: params,
        y: results,
        mode: 'markers',
        type: 'scatter',
        name: 'Amostra',
        marker: {
          color: 'black'
        }
      }

      let coef  = response.response['coef_0'] as number
      let intercept = response.response['coef_1'] as number

      this.coeffs = [coef, intercept]

      let x1 = Math.min(...params, 0)
      let x2 = Math.max(...params)
      let y1 = coef * x1 + intercept
      let y2 = coef * x2 + intercept

      let trace2 = {
        x: [x1, x2],
        y: [y1, y2],
        mode: 'lines',
        type: 'scatter',
        name: 'Curva calculada',
        line: {
          color: '#72ceff'
        }
      }

      let data = [trace1, trace2];

      this.determinationCoef = response.response['r_squared'];
      this.correlationCoef = response.response['correlation_coefficient'];
      this.relativeError = response.response['relative_error']*100
      this.rmse = response.response['rmse']

      return data
    }
    else {
      throw new Error(response.message)
    }
  }

  async calculateQuadraticChart(params: number[], results: number[], aprox: number) {
    let response = await this.apiService.getDataRegression(this.type, params, results, 20)

    if(response.success){

      let trace1 = {
        x: params,
        y: results,
        mode: 'markers',
        type: 'scatter',
        name: 'Amostra',
        marker: {
          color: 'black'
        }
      }

      let coef_0 = response.response['coef_0'] as number
      let coef_1 = response.response['coef_1'] as number
      let coef_2 = response.response['coef_2'] as number

      this.coeffs = [coef_0, coef_1, coef_2]

      let x1 = Math.min(...params, 0)
      let x2 = Math.max(...params)

      let values_x: number[] = []
      let values_y: number[] = []

      let intervalo = (x2-x1)/100

      for(let i = x1;i <= x2; i+=intervalo){
        values_x.push(i)
        values_y.push(
          coef_0 * (i ** 2) + coef_1 * i + coef_2
        )
      }

      let trace2 = {
        x: values_x,
        y: values_y,
        mode: 'lines',
        type: 'scatter',
        line: {
          shape: 'spline',
          color: '#72ceff'
        },
        name: 'Curva calculada'
      }

      let data = [trace1, trace2];

      this.equationValue = `${coef_0.toFixed(this.aproxCoef)} * (x ** 2) + ${coef_1.toFixed(this.aproxCoef)} * x + ${coef_2.toFixed(this.aproxCoef)}`
      this.determinationCoef = response.response['r_squared'];
      this.correlationCoef = response.response['correlation_coefficient'];
      this.relativeError = response.response['relative_error']*100
      this.rmse = response.response['rmse']

      return data
    }
    else {
      throw new Error(response.message)
    }
  }

  async calculateCubicChart(params: number[], results: number[], aprox: number) {
    let response = await this.apiService.getDataRegression(this.type, params, results, 20)

    if(response.success){

      let trace1 = {
        x: params,
        y: results,
        mode: 'markers',
        type: 'scatter',
        name: 'Amostra',
        marker: {
          color: 'black'
        }
      }

      let coef_0 = response.response['coef_0'] as number
      let coef_1 = response.response['coef_1'] as number
      let coef_2 = response.response['coef_2'] as number
      let coef_3 = response.response['coef_3'] as number

      this.coeffs = [coef_0, coef_1, coef_2, coef_3]

      let x1 = Math.min(...params, 0)
      let x2 = Math.max(...params)

      let values_x: number[] = []
      let values_y: number[] = []

      let intervalo = (x2-x1)/100

      for(let i = x1;i <= x2; i+=intervalo){
        values_x.push(i)
        values_y.push(
          coef_0 * (i ** 3) + coef_1 * (i**2) + coef_2 * i + coef_3
        )
      }

      let trace2 = {
        x: values_x,
        y: values_y,
        mode: 'lines',
        type: 'scatter',
        line: {
          shape: 'spline',
          color: '#72ceff'
        },
        name: 'Curva calculada'
      }

      let data = [trace1, trace2];

      this.equationValue = `${coef_0.toFixed(this.aproxCoef)} * (x ** 3) + ${coef_1.toFixed(this.aproxCoef)} * (x**2) + ${coef_2.toFixed(this.aproxCoef)} * x + ${coef_3.toFixed(this.aproxCoef)}`
      this.determinationCoef = response.response['r_squared'];
      this.correlationCoef = response.response['correlation_coefficient'];
      this.relativeError = response.response['relative_error']*100
      this.rmse = response.response['rmse']

      return data
    }
    else {
      throw new Error(response.message)
    }
  }
  async calculateExponentialChart(params: number[], results: number[], aprox: number) {
    let response = await this.apiService.getDataRegression(this.type, params, results, 20)

    if(response.success){

      let trace1 = {
        x: params,
        y: results,
        mode: 'markers',
        type: 'scatter',
        name: 'Amostra',
        marker: {
          color: 'black'
        }
      }

      let coef_0 = response.response['coef_0'] as number
      let coef_1 = response.response['coef_1'] as number

      this.coeffs = [coef_0, coef_1]

      let x1 = Math.min(...params, 0)
      let x2 = Math.max(...params)

      let values_x: number[] = []
      let values_y: number[] = []

      let intervalo = (x2-x1)/100

      for(let i = x1;i <= x2; i+=intervalo){
        values_x.push(i)
        values_y.push(
          coef_0 * (coef_1 ** i)
        )
      }

      let trace2 = {
        x: values_x,
        y: values_y,
        mode: 'lines',
        type: 'scatter',
        line: {
          shape: 'spline',
          color: '#72ceff'
        },
        name: 'Curva calculada'
      }

      let data = [trace1, trace2];

      this.equationValue = `${coef_0.toFixed(this.aproxCoef)} * (${coef_1.toFixed(this.aproxCoef)} ** x)`
      this.determinationCoef = response.response['r_squared'];
      this.correlationCoef = response.response['correlation_coefficient'];
      this.relativeError = response.response['relative_error']*100
      this.rmse = response.response['rmse']

      return data
    }
    else {
      throw new Error(response.message)
    }
  }
  async calculateLogaritmicChart(params: number[], results: number[], aprox: number) {
    let response = await this.apiService.getDataRegression(this.type, params, results, 20)

    if(response.success){

      let trace1 = {
        x: params,
        y: results,
        mode: 'markers',
        type: 'scatter',
        name: 'Amostra',
        marker: {
          color: 'black'
        }
      }

      let coef_0 = response.response['coef_0'] as number
      let coef_1 = response.response['coef_1'] as number

      this.coeffs = [coef_0, coef_1]

      let x1 = Math.min(...params, 0)
      let x2 = Math.max(...params)

      let values_x: number[] = []
      let values_y: number[] = []

      let intervalo = (x2-x1)/100

      for(let i = x1;i <= x2; i+=intervalo){
        values_x.push(i)
        values_y.push(
          coef_0 * Math.log2(i) + coef_1
        )
      }

      let trace2 = {
        x: values_x,
        y: values_y,
        mode: 'lines',
        type: 'scatter',
        line: {
          shape: 'spline',
          color: '#72ceff'
        },
        name: 'Curva calculada'
      }

      let data = [trace1, trace2];

      this.equationValue = `${coef_0.toFixed(this.aproxCoef)} * log2(x) + ${coef_1.toFixed(this.aproxCoef)}`
      this.determinationCoef = response.response['r_squared'];
      this.correlationCoef = response.response['correlation_coefficient'];
      this.relativeError = response.response['relative_error']*100
      this.rmse = response.response['rmse']

      return data
    }
    else {
      throw new Error(response.message)
    }
  }
  async calculateNLogaritmicChart(params: number[], results: number[], aprox: number) {
    let response = await this.apiService.getDataRegression(this.type, params, results, 20)

    if(response.success){

      let trace1 = {
        x: params,
        y: results,
        mode: 'markers',
        type: 'scatter',
        name: 'Amostra',
        marker: {
          color: 'black'
        }
      }

      let coef_0 = response.response['coef_0'] as number
      let coef_1 = response.response['coef_1'] as number

      this.coeffs = [coef_0, coef_1]

      let x1 = Math.min(...params, 0)
      let x2 = Math.max(...params)

      let values_x: number[] = []
      let values_y: number[] = []

      let intervalo = (x2-x1)/100

      for(let i = x1;i <= x2; i+=intervalo){
        values_x.push(i)
        values_y.push(
          coef_0 * i * Math.log2(i) + coef_1
        )
      }

      let trace2 = {
        x: values_x,
        y: values_y,
        mode: 'lines',
        type: 'scatter',
        line: {
          shape: 'spline',
          color: '#72ceff'
        },
        name: 'Curva calculada'
      }

      let data = [trace1, trace2];

      this.equationValue = `${coef_0.toFixed(this.aproxCoef)} * x * log2(x) + ${coef_1.toFixed(this.aproxCoef)}`
      this.determinationCoef = response.response['r_squared'];
      this.correlationCoef = response.response['correlation_coefficient'];
      this.relativeError = response.response['relative_error']*100
      this.rmse = response.response['rmse']

      return data
    }
    else {
      throw new Error(response.message)
    }
  }
  async calculateN2LogaritmicChart(params: number[], results: number[], aprox: number) {
    let response = await this.apiService.getDataRegression(this.type, params, results, 20)

    if(response.success){

      let trace1 = {
        x: params,
        y: results,
        mode: 'markers',
        type: 'scatter',
        name: 'Amostra',
        marker: {
          color: 'black'
        }
      }

      let coef_0 = response.response['coef_0'] as number
      let coef_1 = response.response['coef_1'] as number

      this.coeffs = [coef_0, coef_1]

      let x1 = Math.min(...params, 0)
      let x2 = Math.max(...params)

      let values_x: number[] = []
      let values_y: number[] = []

      let intervalo = (x2-x1)/100

      for(let i = x1;i <= x2; i+=intervalo){
        values_x.push(i)
        values_y.push(
          coef_0 * (i ** 2) * Math.log2(i) + coef_1
        )
      }

      let trace2 = {
        x: values_x,
        y: values_y,
        mode: 'lines',
        type: 'scatter',
        line: {
          shape: 'spline',
          color: '#72ceff'
        },
        name: 'Curva calculada'
      }

      let data = [trace1, trace2];

      this.equationValue = `${coef_0.toFixed(this.aproxCoef)} * (x ** 2) * log2(x) + ${coef_1.toFixed(this.aproxCoef)}`
      this.determinationCoef = response.response['r_squared'];
      this.correlationCoef = response.response['correlation_coefficient'];
      this.relativeError = response.response['relative_error']*100
      this.rmse = response.response['rmse']

      return data
    }
    else {
      throw new Error(response.message)
    }
  }
  async calculateNLogaritmic2Chart(params: number[], results: number[], aprox: number) {
    let response = await this.apiService.getDataRegression(this.type, params, results, 20)

    if(response.success){

      let trace1 = {
        x: params,
        y: results,
        mode: 'markers',
        type: 'scatter',
        name: 'Amostra',
        marker: {
          color: 'black'
        }
      }

      let coef_0 = response.response['coef_0'] as number
      let coef_1 = response.response['coef_1'] as number

      this.coeffs = [coef_0, coef_1]

      let x1 = Math.min(...params, 0)
      let x2 = Math.max(...params)

      let values_x: number[] = []
      let values_y: number[] = []

      let intervalo = (x2-x1)/100

      for(let i = x1;i <= x2; i+=intervalo){
        values_x.push(i)
        values_y.push(
          coef_0 * i * (Math.log2(i) ** 2) + coef_1
        )
      }

      let trace2 = {
        x: values_x,
        y: values_y,
        mode: 'lines',
        type: 'scatter',
        line: {
          shape: 'spline',
          color: '#72ceff'
        },
        name: 'Curva calculada'
      }

      let data = [trace1, trace2];

      this.equationValue = `${coef_0.toFixed(this.aproxCoef)} * x * (log2(x) ** 2) + ${coef_1.toFixed(this.aproxCoef)}`
      this.determinationCoef = response.response['r_squared'];
      this.correlationCoef = response.response['correlation_coefficient'];
      this.relativeError = response.response['relative_error']*100
      this.rmse = response.response['rmse']

      return data
    }
    else {
      throw new Error(response.message)
    }
  }
  async calculatePowerChart(params: number[], results: number[], aprox: number) {
    let response = await this.apiService.getDataRegression(this.type, params, results, 20)

    if(response.success){

      let trace1 = {
        x: params,
        y: results,
        mode: 'markers',
        type: 'scatter',
        name: 'Amostra',
        marker: {
          color: 'black'
        }
      }

      let coef_0 = response.response['coef_0'] as number
      let coef_1 = response.response['coef_1'] as number

      this.coeffs = [coef_0, coef_1]

      let x1 = Math.min(...params, 0)
      let x2 = Math.max(...params)

      let values_x: number[] = []
      let values_y: number[] = []

      let intervalo = (x2-x1)/100

      for(let i = x1;i <= x2; i+=intervalo){
        values_x.push(i)
        values_y.push(
          coef_0 * (i ** coef_1)
        )
      }

      let trace2 = {
        x: values_x,
        y: values_y,
        mode: 'lines',
        type: 'scatter',
        line: {
          shape: 'spline',
          color: '#72ceff'
        },
        name: 'Curva calculada'
      }

      let data = [trace1, trace2];

      this.equationValue = `${coef_0.toFixed(this.aproxCoef)} * (x ** ${coef_1.toFixed(this.aproxCoef)})`
      this.determinationCoef = response.response['r_squared'];
      this.correlationCoef = response.response['correlation_coefficient'];
      this.relativeError = response.response['relative_error']*100
      this.rmse = response.response['rmse']

      return data
    }
    else {
      throw new Error(response.message)
    }
  }
  async calculateEMAChart(params: number[], results: number[], aprox: number) {
    let response = await this.apiService.getDataRegression(this.type, params, results, 20)

    if(response.success){

      let trace1 = {
        x: params,
        y: results,
        mode: 'markers',
        type: 'scatter',
        name: 'Amostra',
        marker: {
          color: 'black'
        }
      }

      let coef_0 = response.response['coef_0']
      let coef_1 = response.response['coef_1']
      let coef_2 = response.response['coef_2']
      let coef_3 = response.response['coef_3']
      let coef_4 = response.response['coef_4']
      let coef_5 = response.response['coef_5']

      let x1 = Math.min(...params, 0)
      let x2 = Math.max(...params)

      let values_x: number[] = []
      let values_y: number[] = []

      let intervalo = (x2-x1)/100

      for(let i = x1;i <= x2; i+=intervalo){
        values_x.push(i)
        values_y.push(
          coef_0 * (coef_1 ** (i ** coef_2)) * (i ** coef_3) * (Math.log2(i) ** coef_4) + coef_5
        )
      }

      let trace2 = {
        x: values_x,
        y: values_y,
        mode: 'lines',
        type: 'scatter',
        line: {
          shape: 'spline',
          color: '#72ceff'
        },
        name: 'Curva calculada'
      }

      let data = [trace1, trace2];

      this.equationValue = `${coef_0.toFixed(this.aproxCoef)} * (${coef_1.toFixed(this.aproxCoef)} ** (x ** ${coef_2.toFixed(this.aproxCoef)})) * (x ** ${coef_3.toFixed(this.aproxCoef)}) * (log2(x) ** ${coef_4.toFixed(this.aproxCoef)}) + ${coef_5.toFixed(this.aproxCoef)}`
      this.determinationCoef = response.response['r_squared'];
      this.correlationCoef = response.response['correlation_coefficient'];
      this.relativeError = response.response['relative_error']*100
      this.rmse = response.response['rmse']

      return data
    }
    else {
      throw new Error(response.message)
    }
  }

  async calculateCustomChart(params: number[], results: number[], aprox: number, func: string) {
    let response = await this.apiService.getDataRegression(this.type, params, results, 20, this.aprox, func)

    if(response.success){

      let trace1 = {
        x: params,
        y: results,
        mode: 'markers',
        type: 'scatter',
        name: 'Amostra',
        marker: {
          color: 'black'
        }
      }

      let values_x: number[] = response.response.x_points
      let values_y: number[] = response.response.y_points

      let trace2 = {
        x: values_x,
        y: values_y,
        mode: 'lines',
        type: 'scatter',
        line: {
          shape: 'spline',
          color: '#72ceff'
        },
        name: 'Curva calculada'
      }

      let data = [trace1, trace2];

      if('expression' in response.response && response.response['expression'] !== undefined ){
        this.equationValue = response.response['expression'], this.aprox
      }
      else{
        this.equationValue = ''
      }
      this.determinationCoef = response.response['r_squared'];
      this.correlationCoef = response.response['correlation_coefficient'];
      this.relativeError = response.response['relative_error']*100
      this.rmse = response.response['rmse']

      return data
    }
    else {
      throw new Error(response.message)
    }
  }
}
