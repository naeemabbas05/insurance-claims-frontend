import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicFormFieldsComponent } from './dynamic-form-fields.component';

@NgModule({
  declarations: [DynamicFormFieldsComponent],
  imports: [CommonModule, FormsModule],
  exports: [DynamicFormFieldsComponent]
})
export class DynamicFormsModule {}
