import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './Layout/default-layout/default-layout.component';
import { UserComponent } from './user/user.component';
import { AddComponent } from './user/add/add.component';
import { TableComponent } from './Shared/table/table.component';
import { ButtonComponent } from './Shared/button/button.component';
import { HttpClientModule } from '@angular/common/http';
import { FeedbackModule } from './Shared/feedback/feedback.module';
import { DynamicFormsModule } from './features/dynamic-forms/dynamic-forms.module';

@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    TableComponent,
    ButtonComponent,
    UserComponent,
    AddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DynamicFormsModule,
    FeedbackModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
