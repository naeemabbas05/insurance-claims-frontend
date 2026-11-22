import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { evaluateCondition } from '../../core/forms/condition-evaluator';
import { validatorsForField } from '../../core/forms/dynamic-field-validators';
import { DynamicFormField, DynamicFormSchema, ValidationMessages } from '../../core/forms/form-schema.models';

@Component({
  selector: 'app-dynamic-form-renderer',
  standalone: false,
  templateUrl: './dynamic-form-renderer.component.html',
  styleUrls: ['./dynamic-form-renderer.component.scss']
})
export class DynamicFormRendererComponent implements OnChanges, OnDestroy {
  @Input() schema: DynamicFormSchema | null = null;
  @Input() initialValues: Record<string, unknown> | null = null;
  @Input() previewOnly = true;
  @Input() submitDisabled = false;
  @Output() validSubmit = new EventEmitter<Record<string, unknown>>();

  form: FormGroup = new FormGroup({});
  validationAttempted = false;
  submitMessage: string | null = null;
  private valueChanges?: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['schema'] || changes['initialValues']) && this.schema) {
      this.createForm();
    }
  }

  ngOnDestroy(): void {
    this.valueChanges?.unsubscribe();
  }

  controlFor(field: DynamicFormField, parent?: AbstractControl): AbstractControl | null {
    return parent ? parent.get(field.key) : this.form.get(field.key);
  }

  repeatableArray(field: DynamicFormField, parent?: AbstractControl): FormArray | null {
    const control = this.controlFor(field, parent);
    return control instanceof FormArray ? control : null;
  }

  isVisible(field: DynamicFormField, parent?: AbstractControl): boolean {
    const parentValues = parent?.getRawValue() ?? {};
    return evaluateCondition(field.visibleWhen, {
      ...this.form.getRawValue(),
      ...parentValues
    });
  }

  validationMessage(field: DynamicFormField, parent?: AbstractControl): string | null {
    const control = this.controlFor(field, parent);
    if (!control?.errors || (!control.touched && !this.validationAttempted)) {
      return null;
    }

    const messages: ValidationMessages = field.validationMessages ?? {};
    if (field.type === 'repeatable-group' && control.errors['minlength']) {
      return messages.minItems ?? `Add at least ${field.minItems} items.`;
    }
    if (field.type === 'repeatable-group' && control.errors['maxlength']) {
      return messages.maxItems ?? `Add no more than ${field.maxItems} items.`;
    }
    if (control.errors['required'] || control.errors['requiredTrue']) {
      return messages.required ?? `${field.label} is required.`;
    }
    if (control.errors['minlength']) {
      return messages.minLength ?? `Enter at least ${field.minLength} characters.`;
    }
    if (control.errors['maxlength']) {
      return messages.maxLength ?? `Enter no more than ${field.maxLength} characters.`;
    }
    if (control.errors['min']) {
      return messages.min ?? `Enter a value of at least ${field.minValue}.`;
    }
    if (control.errors['max']) {
      return messages.max ?? `Enter a value no greater than ${field.maxValue}.`;
    }
    if (control.errors['email']) {
      return messages.email ?? 'Enter a valid email address.';
    }
    if (control.errors['date']) {
      return messages.date ?? 'Enter a valid date.';
    }
    if (control.errors['fileType']) {
      return messages.fileType ?? `Choose a file with an allowed extension: ${(field.accept ?? []).join(', ')}.`;
    }
    if (control.errors['fileSize']) {
      return messages.fileSize ?? `Each file must be no larger than ${field.maxFileSizeMb} MB.`;
    }
    return 'This value is invalid.';
  }

  onFileSelected(field: DynamicFormField, event: Event, parent?: AbstractControl): void {
    const target = event.target as HTMLInputElement;
    this.controlFor(field, parent)?.setValue(target.files);
    this.controlFor(field, parent)?.markAsTouched();
  }

  addRepeatableItem(field: DynamicFormField): void {
    const array = this.repeatableArray(field);
    if (!array || (field.maxItems !== undefined && array.length >= field.maxItems)) {
      return;
    }
    array.push(this.createGroup(field.children ?? []));
  }

  removeRepeatableItem(field: DynamicFormField, index: number): void {
    const array = this.repeatableArray(field);
    if (!array || array.length <= (field.minItems ?? 0)) {
      return;
    }
    array.removeAt(index);
  }

  submit(): void {
    this.validationAttempted = true;
    this.submitMessage = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.previewOnly) {
      this.submitMessage = 'Preview only. This schema is not published and no claim was submitted.';
      return;
    }
    this.validSubmit.emit(this.form.value as Record<string, unknown>);
  }

  private createForm(): void {
    this.valueChanges?.unsubscribe();
    const fields = this.schema?.sections.flatMap(section => section.fields) ?? [];
    this.form = this.createGroup(fields, this.initialValues ?? undefined);
    this.refreshConditionalControls();
    this.valueChanges = this.form.valueChanges.subscribe(() => this.refreshConditionalControls());
    this.validationAttempted = false;
    this.submitMessage = null;
  }

  private createGroup(fields: DynamicFormField[], initialValues?: Record<string, unknown>): FormGroup {
    const controls: Record<string, AbstractControl> = {};
    for (const field of fields) {
      if (field.type === 'repeatable-group') {
        const minimum = field.minItems ?? 1;
        const initialItems = Array.from({ length: minimum }, () => this.createGroup(field.children ?? []));
        controls[field.key] = new FormArray(initialItems, validatorsForField(field));
      } else {
        const value = initialValues && Object.prototype.hasOwnProperty.call(initialValues, field.key)
          ? initialValues[field.key]
          : this.defaultValue(field);
        controls[field.key] = new FormControl(value, validatorsForField(field));
      }
    }
    return new FormGroup(controls);
  }

  private defaultValue(field: DynamicFormField): unknown {
    if (field.defaultValue !== undefined) {
      return field.defaultValue;
    }
    if (field.type === 'checkbox' || field.type === 'toggle') {
      return false;
    }
    if (field.type === 'multiselect') {
      return [];
    }
    return '';
  }

  private refreshConditionalControls(): void {
    const fields = this.schema?.sections.flatMap(section => section.fields) ?? [];
    for (const field of fields) {
      const control = this.form.get(field.key);
      if (control) {
        this.setControlVisibility(field, control);
      }

      const rows = this.repeatableArray(field);
      if (rows && field.type === 'repeatable-group') {
        rows.controls.forEach(row => {
          if (row instanceof FormGroup) {
            for (const child of field.children ?? []) {
              const childControl = row.get(child.key);
              if (childControl) {
                this.setControlVisibility(child, childControl, row);
              }
            }
          }
        });
      }
    }
  }

  private setControlVisibility(field: DynamicFormField, control: AbstractControl, parent?: FormGroup): void {
    const visible = this.isVisible(field, parent);
    if (!visible && control.enabled) {
      if (control instanceof FormArray) {
        control.clear({ emitEvent: false });
      } else {
        control.reset(this.defaultValue(field), { emitEvent: false });
      }
      control.disable({ emitEvent: false });
    } else if (visible && control.disabled) {
      control.enable({ emitEvent: false });
      if (control instanceof FormArray) {
        const minimum = field.minItems ?? 1;
        while (control.length < minimum) {
          control.push(this.createGroup(field.children ?? []), { emitEvent: false });
        }
      }
    }
  }
}
