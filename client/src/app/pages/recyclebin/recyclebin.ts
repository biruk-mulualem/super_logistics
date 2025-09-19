import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';


import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-recyclebin',
  imports: [Header,FormsModule],
  templateUrl: './recyclebin.html',
  styleUrl: './recyclebin.css'
})
export class Recyclebin {

}
