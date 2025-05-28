import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { WebApiService } from '../api/web-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-send-tip',
  templateUrl: './send-tip.component.html',
  styleUrls: ['./send-tip.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class SendTipComponent implements OnInit {
  tipForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  searchResults: any[] = [];
  private searchSubject = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private api: WebApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tipForm = this.fb.group({
      receiverLink: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      message: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['link']) {
        this.tipForm.patchValue({
          receiverLink: params['link']
        });
      }
    });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length < 2) {
          this.searchResults = [];
          return [];
        }
        return this.api.searchUsers(query);
      })
    ).subscribe(results => {
      this.searchResults = results;
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  selectUser(user: any) {
    this.tipForm.patchValue({
      receiverLink: user.publicLink
    });
    this.searchResults = [];
  }

  onSubmit() {
    if (this.tipForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.api.sendTip(this.tipForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.tipForm.reset();
          this.router.navigate(['/tips']);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          if (error.error === 'Insufficient balance') {
            this.errorMessage = 'Insufficient funds in balance for sending tips';
          } else {
            this.errorMessage = error.error || 'error sending tip';
          }
          console.error('Error sending tip:', error);
        }
      });
    }
  }
} 