import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder } from '@angular/forms';
import { ToastService } from '../toast.service';
// @ts-ignore
import plotly from 'plotly.js-dist';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  inputForm = this.formBuilder.group({
    params: '',
    results: ''
  });

  config = {
    responsive: true // Define o gráfico como responsivo
  };

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ){}

  ngOnInit(): void {
    // this.renderLinearChart()
    // this.renderQuadraticChart()
  }

  onSubmit(): void {
    const values = this.inputForm.value
    const params = values.params!.split(' ').map(str => parseInt(str, 10))
    const results = values.results!.split(' ').map(str => parseInt(str, 10))

    this.renderLinearChart(params, results)
    this.renderQuadraticChart(params, results)

  }

  async renderLinearChart(params?: number[], result?: number[]) {
    if(params !== undefined && result !== undefined){

      var response = await this.apiService.getDataRegression('linear', params, result)

      if(response.success){
        var trace1 = {
          x: params,
          y: result,
          mode: 'markers',
          type: 'scatter',
          name: 'Amostra'
        }

        var coef = response.response['coef_0']
        var intercept = response.response['coef_1']

        var x1 = Math.min(...params, 0)
        var x2 = Math.max(...params)
        var y1 = coef * x1 + intercept
        var y2 = coef * x2 + intercept

        var trace2 = {
          x: [x1, x2],
          y: [y1, y2],
          mode: 'lines',
          type: 'scatter',
          name: 'Curva calculada'
        }

        const layout = {
          'xaxis': {
            'rangemode': 'tozero',
            'title': 'N'
          },
          'yaxis': {
            'rangemode': 'tozero',
            'title': 'Tempo'
          }
        }

        const data = [trace1, trace2];

        plotly.newPlot('chart_linear', data, layout, this.config);
      }
      else {
        console.log(response.message)
        this.toastService.showToast('Error', <string> response.message)
      }
    }
    else{
      plotly.newPlot('chart_linear', []);
    }
  }

  async renderQuadraticChart(params?: number[], result?: number[]) {

    if(params !== undefined && result !== undefined){

      var response = await this.apiService.getDataRegression('quadratic', params, result)

      if(response.success){

        var trace1 = {
          x: params,
          y: result,
          mode: 'markers',
          type: 'scatter',
          name: 'Amostra'
        }

        var coef_0 = response.response['coef_0']
        var coef_1 = response.response['coef_1']
        var coef_2 = response.response['coef_2']

        var x1 = Math.min(...params, 0)
        var x2 = Math.max(...params)

        var values_x: number[] = []
        var values_y: number[] = []

        var intervalo = (x2-x1)/100

        for(var i = x1;i <= x2; i+=intervalo){
          values_x.push(i)
          values_y.push(
            coef_0 * (i ** 2) + coef_1 * i + coef_2
          )
        }

        var trace2 = {
          x: values_x,
          y: values_y,
          mode: 'lines',
          type: 'scatter',
          line: { shape: 'spline' },
          name: 'Curva calculada'
        }

        const layout = {
          'xaxis': {
            'rangemode': 'tozero',
            'title': 'N'
          },
          'yaxis': {
            'rangemode': 'tozero',
            'title': 'Tempo'
          }
        }

        const data = [trace1, trace2];

        plotly.newPlot('chart_quadratic', data, layout);
      }
      else{
        console.log(response.message)
        this.toastService.showToast('Error', <string> response.message)
      }
    }
    else{
      plotly.newPlot('chart_quadratic', []);
    }
  }
}
