import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  standalone: false,
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent {
  constructor(private readonly router: Router) {}

  get sectionLabel(): string {
    switch (this.activeArea) {
      case 'claimant':
        return 'Claimant';
      case 'officer':
        return 'Claims officer';
      case 'management':
        return 'Management';
      default:
        return 'User administration';
    }
  }

  get sectionLinks(): { label: string; path: string }[] {
    switch (this.activeArea) {
      case 'claimant':
        return [
          { label: 'Dashboard', path: '/claimant/dashboard' },
          { label: 'Submit a claim', path: '/claimant/submit-claim' },
          { label: 'My claims', path: '/claimant/my-claims' }
        ];
      case 'officer':
        return [
          { label: 'Dashboard', path: '/officer/dashboard' },
          { label: 'Claims', path: '/officer/claims' }
        ];
      case 'management':
        return [
          { label: 'Dashboard', path: '/management/dashboard' },
          { label: 'Reports', path: '/management/reports' }
        ];
      default:
        return [
          { label: 'Users', path: '/' },
          { label: 'Add user', path: '/add' }
        ];
    }
  }

  get activeArea(): 'claimant' | 'officer' | 'management' | 'users' {
    const path = this.router.url;
    if (path.startsWith('/claimant')) {
      return 'claimant';
    }
    if (path.startsWith('/officer')) {
      return 'officer';
    }
    if (path.startsWith('/management')) {
      return 'management';
    }
    return 'users';
  }
}
