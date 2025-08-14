import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    HttpClientModule   // <-- Add this here
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}

// Then bootstrap your app somewhere else like this:
// bootstrapApplication(App);
