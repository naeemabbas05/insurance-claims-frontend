import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  standalone: false,
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent {
  readonly exactLinkActiveOptions = { exact: true };
  readonly linkActiveOptions = { exact: false };
  private readonly claimantLinks = [
    { label: 'Dashboard', path: '/claimant/dashboard' },
    { label: 'Submit a claim', path: '/claimant/submit-claim' },
    { label: 'My claims', path: '/claimant/my-claims' }
  ];
  private readonly officerLinks = [
    { label: 'Dashboard', path: '/officer/dashboard' },
    { label: 'Claims', path: '/officer/claims' },
    { label: 'Claim form', path: '/form-builder' }
  ];
  private readonly managementLinks = [
    { label: 'Dashboard', path: '/management/dashboard' },
    { label: 'Reports', path: '/management/reports' },
    { label: 'Claim form', path: '/form-builder' }
  ];
  private readonly formBuilderLinks = [{ label: 'Claim form', path: '/form-builder' }];
  private readonly userLinks = [
    { label: 'Users', path: '/' },
    { label: 'Add user', path: '/add' }
  ];

  constructor(private readonly router: Router) {}

  get sectionLabel(): string {
    switch (this.activeArea) {
      case 'claimant':
        return 'Claimant';
      case 'officer':
        return 'Claims officer';
      case 'management':
        return 'Management';
      case 'form-builder':
        return 'Claim form';
      default:
        return 'User administration';
    }
  }

  get sectionLinks(): { label: string; path: string }[] {
    switch (this.activeArea) {
      case 'claimant':
        return this.claimantLinks;
      case 'officer':
        return this.officerLinks;
      case 'management':
        return this.managementLinks;
      case 'form-builder':
        return this.formBuilderLinks;
      default:
        return this.userLinks;
    }
  }

  get activeArea(): 'claimant' | 'officer' | 'management' | 'form-builder' | 'users' {
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
    if (path.startsWith('/form-builder')) {
      return 'form-builder';
    }
    return 'users';
  }
}
