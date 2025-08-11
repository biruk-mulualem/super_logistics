import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ReusableTable } from '../../shared/components/reusable-table/reusable-table';

@Component({
  selector: 'app-logistics',
  imports: [ReusableTable],
  templateUrl: './logistics.html',
  styleUrl: './logistics.css'
})
export class Logistics {
  tableHeaders = [
  'Item', 'B-No', 'Shipper', 'Transitor', 'uom', 'Quantity',
  'Loading-Date', 'Djb-Arrived', 'Djb-Departed',
  'Akk-Arrived', 'Sdt-Arrived', 'Cont-Returned', 'Remark'
];

tableData = [
  {
    item: 'Apple',
    'b-no': 'BN123',
    shipper: 'ABC Corp',
    transitor: 'XYZ Trans',
    uom: 'Kg',
    quantity: 100,
    'loading-date': '2025-08-10',
    'djb-arrived': 'Yes',
    'djb-departed': 'No',
    'akk-arrived': 'No',
    'sdt-arrived': 'Yes',
    'cont-returned': 'No',
    remark: 'Pending'
  },
    {
    item: 'Apple',
    'b-no': 'BN123',
    shipper: 'ABC Corp',
    transitor: 'XYZ Trans',
    uom: 'Kg',
    quantity: 100,
    'loading-date': '2025-08-10',
    'djb-arrived': 'Yes',
    'djb-departed': 'No',
    'akk-arrived': 'No',
    'sdt-arrived': 'tt',
    'cont-returned': 'No',
    remark: 'Pending'
  },
  // More rows...
];
 

}
