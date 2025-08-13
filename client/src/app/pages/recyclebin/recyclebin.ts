import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ReusableTable } from '../../shared/components/reusable-table/reusable-table';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-recyclebin',
  imports: [ReusableTable,Sidebar,Header],
  templateUrl: './recyclebin.html',
  styleUrl: './recyclebin.css'
})
export class Recyclebin {

}
