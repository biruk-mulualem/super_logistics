import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ReusableTable } from '../../shared/components/reusable-table/reusable-table';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-history',
  imports: [ReusableTable,Sidebar,Header],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History {

}
