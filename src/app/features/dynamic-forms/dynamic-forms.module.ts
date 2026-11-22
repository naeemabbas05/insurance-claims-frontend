import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormRendererComponent } from './dynamic-form-renderer.component';

@NgModule({
  declarations: [DynamicFormRendererComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [DynamicFormRendererComponent]
})
export class DynamicFormsModule {}
