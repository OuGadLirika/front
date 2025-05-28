import { Component, OnInit } from '@angular/core';
import {WebApiService} from "../api/web-api.service";
import {HttpErrorResponse} from "@angular/common/http";
import {KeycloakService} from "keycloak-angular";
import {Router} from "@angular/router";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userInfo: any = {
    firstname: '',
    lastname: '',
    email: '',
    publicLink: '',
    balance: 0
  };
  newLink = '';
  errorMessage = '';
  isLoading = true;
  isEditingLink = false;
  selectedAvatar: string | null = null;
  showAvatarSelector = false;
  avatars: string[] = [];
  environment = environment;

  constructor(
    private api: WebApiService,
    private keycloak: KeycloakService,
    private router: Router
  ) {
    // Инициализируем массив путей к аватарам с префиксом /api
    for (let i = 1; i <= 10; i++) {
      this.avatars.push(`/api/avatars/avatar${i}.png`);
    }
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  openAvatarSelector() {
    this.showAvatarSelector = true;
  }

  closeAvatarSelector() {
    this.showAvatarSelector = false;
  }

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    this.closeAvatarSelector();
    
    this.isLoading = true;
    this.errorMessage = '';

    this.api.updateAvatar(avatar).subscribe({
      next: () => {
        this.isLoading = false;
        this.errorMessage = '';
        // Обновляем информацию о пользователе после изменения аватара
        this.loadUserInfo();
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.keycloak.login();
        } else {
          this.errorMessage = 'Error updating avatar';
          console.error('Error updating avatar:', error);
        }
      }
    });
  }

  private loadUserInfo() {
    this.isLoading = true;
    this.errorMessage = '';

    this.api.getUserInfo1().subscribe({
      next: (data: string) => {
        try {
          console.log('Received user info:', data); // Добавляем логирование
          const regex = /UserInfo1:\s*(\w+)\s+(\w+),\s*([^,]+),\s*([^,]+),\s*([\d.]+),\s*([^,]+)/;
          const match = data.match(regex);
          
          if (match) {
            this.userInfo = {
              firstname: match[1],
              lastname: match[2],
              email: match[3],
              publicLink: match[4],
              balance: parseFloat(match[5]) || 0,
              avatarUrl: match[6]
            };
            this.newLink = this.userInfo.publicLink || '';
            // Проверяем, что avatarUrl не null и не пустой
            if (this.userInfo.avatarUrl && this.userInfo.avatarUrl !== 'null') {
              this.selectedAvatar = this.userInfo.avatarUrl;
            } else {
              this.selectedAvatar = '/api/avatars/default.png';
            }
            console.log('Selected avatar:', this.selectedAvatar); // Добавляем логирование
            this.errorMessage = '';
          } else {
            // Если не удалось распарсить с балансом и аватаром, пробуем старый формат
            const oldRegex = /UserInfo1:\s*(\w+)\s+(\w+),\s*([^,]+),\s*([^,]+),\s*([\d.]+)/;
            const oldMatch = data.match(oldRegex);
            
            if (oldMatch) {
              this.userInfo = {
                firstname: oldMatch[1],
                lastname: oldMatch[2],
                email: oldMatch[3],
                publicLink: oldMatch[4],
                balance: parseFloat(oldMatch[5]) || 0,
                avatarUrl: '/api/avatars/default.png'
              };
              this.newLink = this.userInfo.publicLink || '';
              this.selectedAvatar = this.userInfo.avatarUrl;
              console.log('Selected avatar (old format):', this.selectedAvatar); // Добавляем логирование
              this.errorMessage = '';
            } else {
              this.errorMessage = 'Invalid profile data format';
              console.error('Invalid profile data format:', data); // Добавляем логирование
            }
          }
        } catch (error) {
          console.error('Error processing profile data:', error);
          this.errorMessage = 'Error processing profile data';
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.keycloak.login();
        } else {
          this.errorMessage = 'Error loading profile data';
          console.error('Error loading profile:', error);
        }
      }
    });
  }

  toggleLinkEdit() {
    this.isEditingLink = !this.isEditingLink;
    if (this.isEditingLink) {
      this.newLink = this.userInfo.publicLink;
    } else {
      this.errorMessage = '';
    }
  }

  updateLink() {
    if (!this.newLink || this.newLink.trim() === '') {
      this.errorMessage = 'Link cannot be empty';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.api.updatePublicLink(this.newLink).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Link updated successfully!');
        this.userInfo.publicLink = this.newLink;
        this.isEditingLink = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.keycloak.login();
        } else if (error.error) {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = 'Error updating link';
        }
        console.error('Error updating link:', error);
      }
    });
  }

  onInput(event: Event) {
    this.newLink = (event.target && (event.target as HTMLInputElement).value) || '';
  }

  addTestBalance() {
    this.userInfo.balance += 100;
  }

  addBalance() {
    this.isLoading = true;
    this.errorMessage = '';

    this.api.addBalance(100).subscribe({
      next: (response: string) => {
        try {
          const regex = /UserInfo1:\s*(\w+)\s+(\w+),\s*([^,]+),\s*([^,]+),\s*([\d.]+)/;
          const match = response.match(regex);
          
          if (match) {
            this.userInfo = {
              firstname: match[1],
              lastname: match[2],
              email: match[3],
              publicLink: match[4],
              balance: parseFloat(match[5]) || 0
            };
            this.errorMessage = '';
          } else {
            this.errorMessage = 'Invalid profile data format';
          }
        } catch (error) {
          console.error('Error processing profile data:', error);
          this.errorMessage = 'Error processing profile data';
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = 'Error adding balance';
        console.error('Error adding balance:', error);
      }
    });
  }
}
