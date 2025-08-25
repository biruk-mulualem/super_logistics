import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ReusableTable } from '../../shared/components/reusable-table/reusable-table';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-setting',

   imports: [ReusableTable,Sidebar,Header,FormsModule],
 
  templateUrl: './setting.html',
  styleUrl: './setting.css'
})
export class Setting {

}
