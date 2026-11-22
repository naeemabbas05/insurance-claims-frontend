import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray } from '@angular/forms';
import { DynamicFormsModule } from './dynamic-forms.module';
import { DynamicFormRendererComponent } from './dynamic-form-renderer.component';
import { createMotorSample } from '../form-builder/sample-form-schemas';

describe('DynamicFormRendererComponent conditional controls', () => {
  let fixture: ComponentFixture<DynamicFormRendererComponent>;
  let component: DynamicFormRendererComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormRendererComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('schema', createMotorSample());
  });

  it('omits hidden conditional field values from the form value', () => {
    fixture.detectChanges();
    const reportFiled = component.form.get('policeReportFiled');
    const reportNumber = component.form.get('policeReportNumber');

    reportNumber?.setValue('PR-123');
    reportFiled?.setValue('no');

    expect(reportNumber?.disabled).toBeTrue();
    expect(component.form.value['policeReportNumber']).toBeUndefined();
  });

  it('disables hidden repeatable groups and restores their minimum rows when visible', () => {
    const damagedParts = component.schema?.sections[0].fields.find(field => field.key === 'damagedParts');
    if (!damagedParts) {
      fail('Motor sample must include damaged parts.');
      return;
    }
    damagedParts.visibleWhen = {
      fieldKey: 'policeReportFiled',
      operator: 'equals',
      value: 'yes'
    };

    fixture.detectChanges();
    const rows = component.form.get('damagedParts') as FormArray;
    expect(rows.enabled).toBeTrue();
    expect(rows.length).toBe(1);

    component.form.get('policeReportFiled')?.setValue('no');
    expect(rows.disabled).toBeTrue();
    expect(rows.length).toBe(0);
    expect(component.form.value['damagedParts']).toBeUndefined();

    component.form.get('policeReportFiled')?.setValue('yes');
    expect(rows.enabled).toBeTrue();
    expect(rows.length).toBe(damagedParts.minItems ?? 1);
  });
});
