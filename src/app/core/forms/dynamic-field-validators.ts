import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DynamicFormField } from './form-schema.models';

export function validatorsForField(field: DynamicFormField): ValidatorFn[] {
  if (field.type === 'repeatable-group') {
    const validators: ValidatorFn[] = [];
    if (field.minItems !== undefined) {
      validators.push(Validators.minLength(field.minItems));
    }
    if (field.maxItems !== undefined) {
      validators.push(Validators.maxLength(field.maxItems));
    }
    return validators;
  }

  const validators: ValidatorFn[] = [];
  if (field.required) {
    validators.push(
      field.type === 'checkbox' || field.type === 'toggle'
        ? Validators.requiredTrue
        : Validators.required
    );
  }
  if (field.minLength !== undefined) {
    validators.push(Validators.minLength(field.minLength));
  }
  if (field.maxLength !== undefined) {
    validators.push(Validators.maxLength(field.maxLength));
  }
  if (field.minValue !== undefined) {
    validators.push(Validators.min(field.minValue));
  }
  if (field.maxValue !== undefined) {
    validators.push(Validators.max(field.maxValue));
  }
  if (field.type === 'email') {
    validators.push(Validators.email);
  }
  if (field.type === 'date') {
    validators.push(validDate);
  }
  if (field.type === 'datetime') {
    validators.push(validDateTime);
  }
  if (field.type === 'file') {
    validators.push(fileType(field.accept ?? []), fileSize(field.maxFileSizeMb));
  }
  return validators;
}

function validDate(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value !== 'string') {
    return { date: true };
  }

  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isNaN(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value
    ? { date: true }
    : null;
}

function validDateTime(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  return value === null || value === undefined || value === '' ||
    (typeof value === 'string' && !Number.isNaN(Date.parse(value)))
    ? null
    : { date: true };
}

function fileType(acceptedExtensions: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const files = getFiles(control.value);
    if (files.length === 0 || acceptedExtensions.length === 0) {
      return null;
    }

    const allowed = acceptedExtensions.map(extension => extension.trim().toLowerCase());
    const invalidFiles = files.filter(file => {
      const fileName = file.name.toLowerCase();
      return !allowed.some(extension => fileName.endsWith(extension));
    });
    return invalidFiles.length > 0 ? { fileType: { invalidFiles: invalidFiles.map(file => file.name) } } : null;
  };
}

function fileSize(maxFileSizeMb?: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (maxFileSizeMb === undefined) {
      return null;
    }

    const maxBytes = maxFileSizeMb * 1024 * 1024;
    const oversizedFiles = getFiles(control.value).filter(file => file.size > maxBytes);
    return oversizedFiles.length > 0
      ? { fileSize: { maxFileSizeMb, oversizedFiles: oversizedFiles.map(file => file.name) } }
      : null;
  };
}

function getFiles(value: unknown): File[] {
  if (typeof FileList === 'undefined' || !(value instanceof FileList)) {
    return [];
  }
  return Array.from(value);
}
