import { ClaimFormSchema, FormSection } from '../../core/forms/form-schema.models';
import { createSection, createStarterField, createStarterForm } from '../../core/forms/form-schema.utils';

function motorSections(): FormSection[] {
  const policy = createSection('Policy and incident');
  policy.fields = [
    createStarterField('text', 'policyNumber', 'Policy number', { required: true }),
    createStarterField('text', 'vehicleRegistration', 'Vehicle registration', { required: true }),
    createStarterField('date', 'incidentDate', 'Incident date', { required: true }),
    createStarterField('text', 'incidentLocation', 'Incident location', { required: true }),
    createStarterField('textarea', 'accidentDescription', 'Accident description', {
      required: true,
      minLength: 20,
      maxLength: 4000,
      validationMessages: { minLength: 'Describe the incident in at least 20 characters.' }
    }),
    createStarterField('radio', 'policeReportFiled', 'Police report filed?', {
      required: true,
      defaultValue: 'yes',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
      ]
    }),
    createStarterField('text', 'policeReportNumber', 'Police report number', {
      required: true,
      visibleWhen: { fieldKey: 'policeReportFiled', operator: 'equals', value: 'yes' }
    }),
    createStarterField('repeatable-group', 'damagedParts', 'Damaged vehicle parts', {
      minItems: 1,
      maxItems: 20,
      children: [
        createStarterField('text', 'partName', 'Damaged part', { required: true }),
        createStarterField('textarea', 'partDamageDescription', 'Damage details')
      ]
    })
  ];

  const documents = createSection('Supporting documents');
  documents.fields = [
    createStarterField('file', 'vehiclePhotographs', 'Vehicle photographs', {
      accept: ['.jpg', '.jpeg', '.png'],
      maxFileSizeMb: 10,
      multiple: true
    }),
    createStarterField('file', 'repairEstimate', 'Repair estimate', {
      accept: ['.pdf', '.jpg', '.png'],
      maxFileSizeMb: 20,
      multiple: false
    }),
    createStarterField('checkbox', 'declaration', 'I confirm these details are accurate', {
      required: true,
      defaultValue: false,
      validationMessages: { required: 'Confirm the declaration to continue.' }
    })
  ];

  return [policy, documents];
}

function propertySections(): FormSection[] {
  const incident = createSection('Property and incident');
  incident.fields = [
    createStarterField('text', 'policyNumber', 'Policy number', { required: true }),
    createStarterField('text', 'propertyAddress', 'Property address', { required: true }),
    createStarterField('date', 'incidentDate', 'Incident date', { required: true }),
    createStarterField('dropdown', 'damageType', 'Damage type', {
      required: true,
      options: [
        { label: 'Water', value: 'water' },
        { label: 'Fire', value: 'fire' },
        { label: 'Storm', value: 'storm' },
        { label: 'Other', value: 'other' }
      ]
    }),
    createStarterField('textarea', 'damageDescription', 'Damage description', {
      required: true,
      minLength: 20,
      maxLength: 4000
    }),
    createStarterField('number', 'estimatedLoss', 'Estimated loss', {
      required: true,
      minValue: 0.01,
      maxValue: 100000000,
      placeholder: 'Enter the amount'
    }),
    createStarterField('repeatable-group', 'damagedItems', 'Damaged items', {
      minItems: 1,
      maxItems: 50,
      children: [
        createStarterField('text', 'itemName', 'Item name', { required: true }),
        createStarterField('textarea', 'itemDamageDescription', 'Damage details'),
        createStarterField('number', 'itemEstimatedLoss', 'Estimated item loss', { minValue: 0 })
      ]
    })
  ];

  const documents = createSection('Supporting documents');
  documents.fields = [
    createStarterField('file', 'supportingPhotographs', 'Supporting photographs', {
      accept: ['.jpg', '.jpeg', '.png'],
      maxFileSizeMb: 10,
      multiple: true
    }),
    createStarterField('file', 'supportingDocuments', 'Supporting documents', {
      accept: ['.pdf', '.doc', '.docx'],
      maxFileSizeMb: 20,
      multiple: true
    }),
    createStarterField('checkbox', 'declaration', 'I confirm these details are accurate', {
      required: true,
      defaultValue: false
    })
  ];

  return [incident, documents];
}

export function createMotorSample(): ClaimFormSchema {
  return createStarterForm(
    'MOTOR',
    'Motor claim',
    'Motor insurance claim',
    'Provide details about the vehicle incident and supporting evidence.',
    motorSections()
  );
}

export function createPropertySample(): ClaimFormSchema {
  return createStarterForm(
    'PROPERTY',
    'Property claim',
    'Property insurance claim',
    'Describe the property damage and provide supporting evidence.',
    propertySections()
  );
}
