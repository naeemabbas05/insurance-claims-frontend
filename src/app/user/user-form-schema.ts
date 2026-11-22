import { DynamicFormSchema, FieldOption } from '../core/forms/form-schema.models';
import { createSection, createStarterField, createUniqueId } from '../core/forms/form-schema.utils';

export function createUserFormSchema(skillSets: FieldOption[]): DynamicFormSchema {
  const section = createSection('User information');
  section.fields = [
    createStarterField('text', 'userName', 'User Name'),
    createStarterField('email', 'mail', 'Email'),
    createStarterField('text', 'phoneNumber', 'Phone Number'),
    createStarterField('text', 'hobby', 'Hobby'),
    createStarterField('multiselect', 'userSkillSets', 'Skill Sets', {
      options: skillSets,
      defaultValue: []
    })
  ];

  return {
    id: createUniqueId(),
    name: 'User form',
    title: 'User details',
    description: 'Manage user contact details and assigned skill sets.',
    submitLabel: 'Save user',
    lifecycle: 'DRAFT',
    version: 1,
    sections: [section]
  };
}
