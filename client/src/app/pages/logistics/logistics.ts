import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ReusableTable } from '../../shared/components/reusable-table/reusable-table';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-logistics',
  imports: [ReusableTable,Sidebar,Header],
  templateUrl: './logistics.html',
  styleUrl: './logistics.css'
})
export class Logistics {
  tableHeaders = [
  'Item', 'uom', 'Quantity','loaded-on','container-type','Loading-Date', 'B-No', 'Shipper', 'Transitor',
   'Djb-Arrived', 'Djb-Departed',
  'Akk-Arrived', 'Sdt-Arrived', 'Cont-Returned', 'Remark'
];

tableData = [
  {
    item: 'Apple',
     uom: 'Kg',
    quantity: 100,
       'loaded-on': '4',
      'container-type': '20FT',
      'loading-date': '2025-08-10',
    'b-no': 'BN123',
    shipper: 'ABC Corp',
    transitor: 'XYZ Trans',
   
    
    'djb-arrived': 'Yes',
    'djb-departed': 'No',

  

    'akk-arrived': 'No',
    'sdt-arrived': 'Yes',
    'cont-returned': 'No',
    remark: 'Pending'
  },
  {
    item: 'Apple',
     uom: 'Kg',
    quantity: 100,
       'loaded-on': '4',
      'container-type': '20FT',
      'loading-date': '2025-08-10',
    'b-no': 'BN123',
    shipper: 'ABC Corp',
    transitor: 'XYZ Trans',
   
    
    'djb-arrived': 'Yes',
    'djb-departed': 'No',

  

    'akk-arrived': 'No',
    'sdt-arrived': 'Yes',
    'cont-returned': 'No',
    remark: 'Pending'
  },
  {
    item: 'Apple',
     uom: 'Kg',
    quantity: 100,
       'loaded-on': '4',
      'container-type': '20FT',
      'loading-date': '2025-08-10',
    'b-no': 'BN123',
    shipper: 'ABC Corp',
    transitor: 'XYZ Trans',
   
    
    'djb-arrived': 'Yes',
    'djb-departed': 'No',

  

    'akk-arrived': 'No',
    'sdt-arrived': 'Yes',
    'cont-returned': 'No',
    remark: 'Pending'
  },
  {
    item: 'Apple',
     uom: 'Kg',
    quantity: 100,
       'loaded-on': '4',
      'container-type': '20FT',
      'loading-date': '2025-08-10',
    'b-no': 'BN123',
    shipper: 'ABC Corp',
    transitor: 'XYZ Trans',
   
    
    'djb-arrived': 'Yes',
    'djb-departed': 'No',

  

    'akk-arrived': 'No',
    'sdt-arrived': 'Yes',
    'cont-returned': 'No',
    remark: 'Pending'
  },
  {
    item: 'Apple',
     uom: 'Kg',
    quantity: 100,
       'loaded-on': '4',
      'container-type': '20FT',
      'loading-date': '2025-08-10',
    'b-no': 'BN123',
    shipper: 'ABC Corp',
    transitor: 'XYZ Trans',
   
    
    'djb-arrived': 'Yes',
    'djb-departed': 'No',

  

    'akk-arrived': 'No',
    'sdt-arrived': 'Yes',
    'cont-returned': 'No',
    remark: 'Pending'
  },
  {
    item: 'Apple',
     uom: 'Kg',
    quantity: 100,
       'loaded-on': '4',
      'container-type': '20FT',
      'loading-date': '2025-08-10',
    'b-no': 'BN123',
    shipper: 'ABC Corp',
    transitor: 'XYZ Trans',
   
    
    'djb-arrived': 'Yes',
    'djb-departed': 'No',

  

    'akk-arrived': 'No',
    'sdt-arrived': 'Yes',
    'cont-returned': 'No',
    remark: 'Pending'
  },
  // More rows...
];
 

}
