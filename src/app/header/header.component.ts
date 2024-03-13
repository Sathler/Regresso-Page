import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    private apiService: ApiService
  ){}

  title = 'Header'
  selectedOption: string = 'hospedada';

  onSelectionChange(){
    this.apiService.setEnv(this.selectedOption)
  }
}
