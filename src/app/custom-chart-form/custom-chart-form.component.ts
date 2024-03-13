import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormdataService } from '../formdata.service';

@Component({
  selector: 'app-custom-chart-form',
  templateUrl: './custom-chart-form.component.html',
  styleUrls: ['./custom-chart-form.component.scss']
})
export class CustomChartFormComponent implements OnInit {
  paramsForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private FormdataService: FormdataService) {
    this.paramsForm = this.formBuilder.group({
      params: '1 2 3 4 5 6',
      results: '1 2 3 4 5 6',
      aprox: 4,
      function: 'a*(b**(x))*(x**d)*(log2(x)**e)+f'
    });
  }

  ngOnInit() {
    this.FormdataService.atualizarDados(this.paramsForm.value);
  }

  onSubmit() {
    this.FormdataService.atualizarDados(this.paramsForm.value);
  }
}
