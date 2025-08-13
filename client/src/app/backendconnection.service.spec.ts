import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BackendconnectionService } from './backendconnection.service';

describe('BackendconnectionService', () => {
  let service: BackendconnectionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Import the HttpClient testing module
      providers: [BackendconnectionService]
    });

    service = TestBed.inject(BackendconnectionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();  // Check service was created
  });

  it('should retrieve products from API via GET', () => {
    const dummyProducts = [
      { id: 1, name: 'Product One' },
      { id: 2, name: 'Product Two' }
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne('https://localhost:5001/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);  // Mock the response
  });
});
