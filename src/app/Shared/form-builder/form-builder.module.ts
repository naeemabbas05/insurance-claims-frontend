import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicFormsModule } from '../../features/dynamic-forms/dynamic-forms.module';
import { FormBuilderComponent } from './form-builder.component';

@NgModule({
  declarations: [FormBuilderComponent],
  imports: [CommonModule, DynamicFormsModule],
  exports: [FormBuilderComponent]
})
export class FormBuilderModule {}
