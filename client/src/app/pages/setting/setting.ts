import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';


import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-setting',

   imports: [Header,FormsModule],
 
  templateUrl: './setting.html',
  styleUrl: './setting.css'
})
export class Setting {

}
