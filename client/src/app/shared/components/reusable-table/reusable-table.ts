import { Component, Input, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { LogisticsFollowupService } from '../../../services/logistics-followup.service';


@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-reusable-table',
  templateUrl: './reusable-table.html',
  styleUrls: ['./reusable-table.css']
})
export class ReusableTable implements OnInit {
@Input() headers: { label: string; key: string }[] = [];

  @Input() data: any[] = [];

  
  filteredData: any[] = [];
  searchQuery: string = '';

  currentPage: number = 1;
  rowsPerPage: number = 13;

  isBrowser: boolean;

  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;

  addData: any = {};
  editData: any = {};
  deleteRowData: any = null;
  constructor(
  @Inject(PLATFORM_ID) private platformId: Object,
  private logisticsService: LogisticsFollowupService   // <-- add this
) {
  this.isBrowser = isPlatformBrowser(this.platformId);
}


  ngOnInit(): void {
    this.filteredData = [...this.data];

    if (this.isBrowser) {
      this.setRowsPerPageBasedOnWidth(window.innerWidth);
    } else {
      this.rowsPerPage = 13;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.isBrowser) {
      this.setRowsPerPageBasedOnWidth(event.target.innerWidth);
    }
  }

  private setRowsPerPageBasedOnWidth(width: number) {
    if (width <= 480) {
      this.rowsPerPage = 1;
    } else {
      this.rowsPerPage = 13;
    }
    this.currentPage = 1;
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredData.slice(start, start + this.rowsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.rowsPerPage);
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredData = this.data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(query)
      )
    );
    this.currentPage = 1;
  }

  setPage(page: number): void {
    this.currentPage = page;
  }
  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  // --- Modal handling with body scroll toggle ---

  private toggleBodyScroll(disable: boolean) {
    if (!this.isBrowser) return;
    if (disable) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }
openAddModal(): void {
  this.addData = {}; // Reset any previous data

  this.headers.forEach(header => {
    this.addData[header.key] = ''; // Initialize each form field with an empty string
  });

  this.showAddModal = true;       // Show the modal
  this.toggleBodyScroll(true);    // Optional UX improvement
}

  closeAddModal(): void {
    this.showAddModal = false;
    this.toggleBodyScroll(false);
  }

saveAdd(): void {
  console.log('saveAdd clicked', this.addData);

  const sanitizedData = {
    ...this.addData,

    // Convert to numbers or fallback to 0
    quantity: Number(this.addData.quantity) || 0,
    loadedOnfcl: Number(this.addData.loadedOnfcl) || 0,
    numberofContReturned: Number(this.addData.numberofContReturned) || 0,

    // Normalize date fields
    etadjb: this.formatDate(this.addData.etadjb),
    loadingDate: this.formatDate(this.addData.loadingDate),
    djbArrived: this.formatDate(this.addData.djbArrived),
    docSentDjb: this.formatDate(this.addData.docSentDjb),
    docCollected: this.formatDate(this.addData.docCollected),
    billCollected: this.formatDate(this.addData.billCollected),
    taxPaid: this.formatDate(this.addData.taxPaid),
    djbDeparted: this.formatDate(this.addData.djbDeparted),
    akkArrived: this.formatDate(this.addData.akkArrived),
    sdtArrived: this.formatDate(this.addData.sdtArrived),
    containerReturned: this.formatDate(this.addData.containerReturned)
  };

  // ❌ Prevent `id` from being sent
  delete (sanitizedData as any).id;

  this.logisticsService.createFollowup(sanitizedData).subscribe({
    next: (res: any) => {
      console.log('Entry added', res);
      this.loadFollowups();
      this.closeAddModal();
    },
    error: (err: any) => {
      console.error('Failed to add', err);

      if (err.error?.errors) {
        for (let key in err.error.errors) {
          console.warn(`${key}: ${err.error.errors[key].join(', ')}`);
        }
      }
    }
  });
}


private formatDate(date: string | null | undefined): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString().split('T')[0]; // "YYYY-MM-DD"
}



loadFollowups() {
  this.logisticsService.getFollowups().subscribe(data => {
    this.data = data;
    this.applyFilterAndPagination();
  });
}



  openEditModal(row: any): void {
    this.editData = { ...row };
    this.showEditModal = true;
    this.toggleBodyScroll(true);
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.toggleBodyScroll(false);
  }

saveEdit(): void {
  this.logisticsService.updateFollowup(this.editData.id, this.editData).subscribe({
    next: () => {
      this.loadFollowups(); // Reload after update
      this.closeEditModal();
    },
    error: (err) => {
      console.error('Failed to update', err);
    }
  });
}


  openDeleteModal(row: any): void {
    this.deleteRowData = row;
    this.showDeleteModal = true;
    this.toggleBodyScroll(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteRowData = null;
    this.toggleBodyScroll(false);
  }

confirmDelete(): void {
  if (!this.deleteRowData) return;

  this.logisticsService.deleteFollowup(this.deleteRowData.id).subscribe({
    next: () => {
      this.loadFollowups(); // Reload after delete
      this.closeDeleteModal();
    },
    error: (err) => {
  console.error('Failed to add', err); 

    }
  });
}

  private applyFilterAndPagination() {
    this.onSearch();
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000);
  }




}
