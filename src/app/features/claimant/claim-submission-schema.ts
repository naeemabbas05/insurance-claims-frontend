import { DynamicFormSchema } from '../../core/forms/form-schema.models';
import { createSection, createStarterField, createUniqueId } from '../../core/forms/form-schema.utils';

export function createClaimSubmissionSchema(): DynamicFormSchema {
  const claimDetails = createSection('Claim details');
  claimDetails.fields = [
    createStarterField('text', 'marketCode', 'Market code', {
      required: true,
      maxLength: 16
    }),
    createStarterField('text', 'policyNumber', 'Policy number', {
      required: true,
      maxLength: 64
    }),
    createStarterField('dropdown', 'claimType', 'Claim type', {
      required: true,
      defaultValue: 'motor',
      options: [
        { label: 'Motor', value: 'motor' },
        { label: 'Property', value: 'property' }
      ]
    }),
    createStarterField('datetime', 'incidentAt', 'Incident date and time', { required: true }),
    createStarterField('number', 'estimatedLossAmount', 'Estimated loss', {
      required: true,
      minValue: 0.01,
      defaultValue: 0
    }),
    createStarterField('text', 'currencyCode', 'Currency code', {
      required: true,
      maxLength: 3,
      placeholder: 'AUD'
    }),
    createStarterField('textarea', 'incidentDescription', 'Incident description', {
      required: true,
      maxLength: 4000
    })
  ];

  const claimantContact = createSection('Claimant contact');
  claimantContact.fields = [
    createStarterField('text', 'claimantName', 'Full name', {
      required: true,
      maxLength: 200
    }),
    createStarterField('email', 'claimantEmail', 'Email', {
      required: true,
      maxLength: 320,
      helpText: 'Use the verified email address for your signed-in claimant account.'
    }),
    createStarterField('text', 'claimantPhone', 'Phone', {
      required: true,
      maxLength: 32
    })
  ];

  return {
    id: createUniqueId(),
    name: 'Claim submission',
    title: 'Submit a claim',
    description: 'Provide the incident and policy details. Required fields are marked.',
    submitLabel: 'Submit claim',
    lifecycle: 'DRAFT',
    version: 1,
    sections: [claimDetails, claimantContact]
  };
}
