import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormdataService } from '../formdata.service';
import { OverviewServerService } from '../overview-server.service';

@Component({
  selector: 'app-form-data',
  templateUrl: './form-data.component.html',
  styleUrls: ['./form-data.component.scss']
})
export class FormDataComponent implements OnInit {
  paramsForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private FormdataService: FormdataService, private overviewServerService: OverviewServerService) {
    this.paramsForm = this.formBuilder.group({
      params: '',
      results: '',
      aprox: 4
    });
  }

  ngOnInit() {
    this.overviewServerService.clearResults()
    this.FormdataService.atualizarDados(this.paramsForm.value);
  }

  onSubmit() {
    this.overviewServerService.clearResults()
    this.FormdataService.atualizarDados(this.paramsForm.value);
  }
}
