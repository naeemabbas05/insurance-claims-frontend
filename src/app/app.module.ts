import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './Layout/default-layout/default-layout.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FeedbackModule } from './Shared/feedback/feedback.module';
import { DynamicFormsModule } from './features/dynamic-forms/dynamic-forms.module';
import { ApiTokenInterceptor } from './core/api/api-token.interceptor';
import { AuthCallbackComponent } from './core/api/auth-callback.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    AuthCallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DynamicFormsModule,
    FeedbackModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ApiTokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
