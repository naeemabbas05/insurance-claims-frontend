export type ClaimCategory = 'MOTOR' | 'PROPERTY';
export type FormLifecycle = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type MarketCode = 'MY' | 'SG' | 'HK' | 'AU' | 'TH' | 'OTHER_APAC';

export type DynamicFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'date'
  | 'datetime'
  | 'dropdown'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'toggle'
  | 'file'
  | 'repeatable-group';

export type PaletteItemType = DynamicFieldType | 'section';

export interface FieldOption {
  label: string;
  value: string;
}

export type ConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'isEmpty'
  | 'isNotEmpty';

export interface FieldCondition {
  fieldKey: string;
  operator: ConditionOperator;
  value?: string | number | boolean;
}

export interface ConditionGroup {
  all?: VisibilityCondition[];
  any?: VisibilityCondition[];
}

export type VisibilityCondition = FieldCondition | ConditionGroup;

export interface ValidationMessages {
  required?: string;
  minLength?: string;
  maxLength?: string;
  min?: string;
  max?: string;
  email?: string;
  date?: string;
  fileType?: string;
  fileSize?: string;
  minItems?: string;
  maxItems?: string;
}

export interface DynamicFormField {
  id: string;
  key: string;
  type: DynamicFieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: string | number | boolean | string[];
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  options?: FieldOption[];
  accept?: string[];
  maxFileSizeMb?: number;
  multiple?: boolean;
  visibleWhen?: VisibilityCondition;
  minItems?: number;
  maxItems?: number;
  children?: DynamicFormField[];
  validationMessages?: ValidationMessages;
}

export interface FormSection {
  id: string;
  key: string;
  title: string;
  description?: string;
  fields: DynamicFormField[];
}

export interface DynamicFormSchema {
  id: string;
  name: string;
  title: string;
  description: string;
  submitLabel?: string;
  category?: ClaimCategory;
  marketCode?: MarketCode;
  lifecycle: FormLifecycle;
  version: number;
  sections: FormSection[];
}

export interface ClaimFormSchema extends DynamicFormSchema {
  category: ClaimCategory;
  marketCode: MarketCode;
}

export interface FieldPaletteItem {
  type: PaletteItemType;
  label: string;
  description: string;
}
