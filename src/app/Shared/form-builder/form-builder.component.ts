import { Component, Input } from '@angular/core';
import { MetaModel } from '../../models/meta-model';

@Component({
  selector: 'app-form-builder',
  standalone: false,
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent {
  @Input() title = '';
  @Input() meta: MetaModel[] = [];
  @Input() mappingModel: any;
}
