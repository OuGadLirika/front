import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-app';
  isNavVisible = true;
  lastScrollPosition = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > this.lastScrollPosition && currentScroll > 100) {
      this.isNavVisible = false;
    } else {
      this.isNavVisible = true;
    }
    
    this.lastScrollPosition = currentScroll;
  }
}
