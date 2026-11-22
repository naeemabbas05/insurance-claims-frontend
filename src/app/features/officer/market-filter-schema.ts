import { DynamicFormSchema } from '../../core/forms/form-schema.models';
import { createSection, createStarterField, createUniqueId } from '../../core/forms/form-schema.utils';

export function createMarketFilterSchema(): DynamicFormSchema {
  const section = createSection('Claims market');
  section.fields = [
    createStarterField('text', 'marketCode', 'Market code', {
      required: true,
      maxLength: 16,
      placeholder: 'MY'
    })
  ];

  return {
    id: createUniqueId(),
    name: 'Claims market filter',
    title: 'Claims market',
    description: 'Choose a market to view incoming claims.',
    submitLabel: 'Load claims',
    lifecycle: 'DRAFT',
    version: 1,
    sections: [section]
  };
}
