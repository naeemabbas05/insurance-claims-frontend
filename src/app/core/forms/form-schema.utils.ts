import { ClaimCategory, ClaimFormSchema, DynamicFieldType, DynamicFormField, FormSection } from './form-schema.models';

export function createUniqueId(): string {
  return crypto.randomUUID();
}

export function createBlankFormSchema(): ClaimFormSchema {
  return {
    id: createUniqueId(),
    name: 'New claim form',
    category: 'MOTOR',
    marketCode: 'MY',
    title: 'Claim form',
    description: '',
    lifecycle: 'DRAFT',
    version: 1,
    sections: [createSection('Claim details')]
  };
}

export function createSection(title: string): FormSection {
  return {
    id: createUniqueId(),
    key: toFieldKey(title),
    title,
    description: '',
    fields: []
  };
}

export function createField(type: DynamicFieldType, key: string, label: string): DynamicFormField {
  const field: DynamicFormField = {
    id: createUniqueId(),
    key,
    type,
    label,
    required: false
  };

  if (type === 'dropdown' || type === 'multiselect' || type === 'radio') {
    field.options = [{ label: 'Option 1', value: 'option-1' }];
  }
  if (type === 'multiselect') {
    field.defaultValue = [];
  }
  if (type === 'file') {
    field.accept = ['.jpg', '.png', '.pdf'];
    field.maxFileSizeMb = 10;
    field.multiple = true;
  }
  if (type === 'repeatable-group') {
    field.minItems = 1;
    field.maxItems = 10;
    field.children = [createField('text', `${key}Item`, 'Item')];
  }
  if (type === 'checkbox' || type === 'toggle') {
    field.defaultValue = false;
  }

  return field;
}

export function toFieldKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'field';
}

export function createStarterField(
  type: DynamicFieldType,
  key: string,
  label: string,
  options: Partial<DynamicFormField> = {}
): DynamicFormField {
  return { ...createField(type, key, label), ...options };
}

export function createStarterForm(
  category: ClaimCategory,
  name: string,
  title: string,
  description: string,
  sections: FormSection[]
): ClaimFormSchema {
  return {
    id: createUniqueId(),
    name,
    category,
    marketCode: 'MY',
    title,
    description,
    lifecycle: 'DRAFT',
    version: 1,
    sections
  };
}
