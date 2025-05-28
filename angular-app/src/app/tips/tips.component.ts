import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../api/web-api.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

interface Tip {
  id: number;
  amount: number;
  message: string;
  createdAt: string;
  sender: {
    email: string;
    firstname: string;
    lastname: string;
  };
  receiver: {
    email: string;
    firstname: string;
    lastname: string;
    publicLink: string;
  };
}

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class TipsComponent implements OnInit {
  receivedTips: Tip[] = [];
  sentTips: Tip[] = [];
  isLoading = false;
  errorMessage = '';
  selectedTab = 0;

  constructor(
    private api: WebApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTips();
  }

  loadTips() {
    this.isLoading = true;
    this.errorMessage = '';

    this.api.getReceivedTips().subscribe({
      next: (tips) => {
        console.log('Received tips:', tips);
        this.receivedTips = tips.sort((a: Tip, b: Tip) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading received tips:', error);
        this.errorMessage = 'Error loading received tips';
        this.isLoading = false;
      }
    });

    this.api.getSentTips().subscribe({
      next: (tips) => {
        console.log('Sent tips:', tips);
        this.sentTips = tips.sort((a: Tip, b: Tip) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading sent tips:', error);
        this.errorMessage = 'Error loading sent tips';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US');
  }

  onTabChange(index: number) {
    this.selectedTab = index;
  }

  sendTipAgain(publicLink: string) {
    this.router.navigate(['/tip', publicLink]);
  }
} 