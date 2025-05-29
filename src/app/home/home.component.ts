import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
    {
      icon: '💎',
      title: 'Secure Transactions',
      description: 'Send and receive tips with blockchain security'
    },
    {
      icon: '⚡',
      title: 'Fast & Easy',
      description: 'Instant transfers with minimal fees'
    },
    {
      icon: '🌐',
      title: 'Global Reach',
      description: 'Connect with creators worldwide'
    }
  ];

  stats = [
    {
      value: '1M+',
      label: 'Total Tips'
    },
    {
      value: '50K+',
      label: 'Active Users'
    },
    {
      value: '100+',
      label: 'Countries'
    }
  ];

  partners = [
    {
      name: 'Posam',
      logo: 'assets/images/partners/posam.png'
    },
    {
      name: 'Posam',
      logo: 'assets/images/partners/posam.png'
    },
    {
      name: 'Posam',
      logo: 'assets/images/partners/posam.png'
    }
  ];

  roadmap = [
    {
      date: 'Q2 2025',
      title: 'Initial Release',
      description: 'Initial release with core tipping functionality'
    },
    {
      date: 'Q3 2025',
      title: 'Mobile App',
      description: 'Native mobile applications for iOS and Android'
    },
    {
      date: 'Q4 2025',
      title: 'Crypto Integration',
      description: 'Integration of cryptocurrency payments'
    },
    {
      date: 'Q1 2026',
      title: 'Global Expansion',
      description: 'Launch in new markets with local payment methods and worldwide connectivity'
    }
  ];
}
