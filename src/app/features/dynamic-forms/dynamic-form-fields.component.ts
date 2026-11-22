import { Component, Input } from '@angular/core';
import { MetaModel } from '../../models/meta-model';

@Component({
  selector: 'app-dynamic-form-fields',
  standalone: false,
  templateUrl: './dynamic-form-fields.component.html',
  styleUrls: ['./dynamic-form-fields.component.scss']
})
export class DynamicFormFieldsComponent {
  @Input() meta: MetaModel[] = [];
  @Input() mappingModel: any;

  isInputType(inputType: string): boolean {
    return ['text', 'email', 'tel', 'number', 'date'].includes(inputType);
  }

  compareOptions(left: any, right: any): boolean {
    return left?.SkillSetsId === right?.SkillSetsId;
  }
}
