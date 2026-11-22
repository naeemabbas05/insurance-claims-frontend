import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './Layout/default-layout/default-layout.component';
import { AuthCallbackComponent } from './core/api/auth-callback.component';

const routes: Routes = [
  { path: 'auth/callback', component: AuthCallbackComponent },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'claimant/dashboard' },
      {
        path: 'claimant',
        loadChildren: () => import('./features/claimant/claimant.module').then(module => module.ClaimantModule)
      },
      {
        path: 'officer',
        loadChildren: () => import('./features/officer/officer.module').then(module => module.OfficerModule)
      },
      {
        path: 'management',
        loadChildren: () => import('./features/management/management.module').then(module => module.ManagementModule)
      },
      {
        path: 'form-builder',
        loadChildren: () => import('./features/form-builder/form-builder-feature.module').then(module => module.FormBuilderFeatureModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
