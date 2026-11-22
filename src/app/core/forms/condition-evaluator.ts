import { ConditionGroup, FieldCondition, VisibilityCondition } from './form-schema.models';

export function evaluateCondition(
  condition: VisibilityCondition | undefined,
  values: Readonly<Record<string, unknown>>
): boolean {
  if (!condition) {
    return true;
  }

  if (isConditionGroup(condition)) {
    const allMatch = condition.all?.every(item => evaluateCondition(item, values)) ?? true;
    const anyMatch = condition.any?.some(item => evaluateCondition(item, values)) ?? true;
    return allMatch && anyMatch;
  }

  return evaluateFieldCondition(condition, values[condition.fieldKey]);
}

function isConditionGroup(condition: VisibilityCondition): condition is ConditionGroup {
  return 'all' in condition || 'any' in condition;
}

function evaluateFieldCondition(condition: FieldCondition, actual: unknown): boolean {
  switch (condition.operator) {
    case 'equals':
      return actual === condition.value;
    case 'notEquals':
      return actual !== condition.value;
    case 'contains':
      return Array.isArray(actual)
        ? actual.includes(condition.value)
        : typeof actual === 'string' && actual.includes(String(condition.value ?? ''));
    case 'isEmpty':
      return isEmpty(actual);
    case 'isNotEmpty':
      return !isEmpty(actual);
  }
}

function isEmpty(value: unknown): boolean {
  return value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);
}
