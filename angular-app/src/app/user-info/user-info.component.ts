import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {WebApiService} from "../api/web-api.service";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  userInfo: string = '';
  error: string = '';

  constructor(private authService: AuthService, private webApiService: WebApiService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    this.webApiService.getUserInfo1().subscribe({
      next: (data: string) => {
        this.userInfo = data;
        this.error = '';
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Ошибка при загрузке данных пользователя';
        console.error('Error loading user info:', err);
      }
    });
  }

}
