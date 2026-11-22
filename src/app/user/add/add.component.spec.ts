import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ButtonComponent } from '../../Shared/button/button.component';
import { FormBuilderModule } from '../../Shared/form-builder/form-builder.module';
import { SkillSetService } from '../../services/skillset-service';
import { UserService } from '../../services/user-service';
import { AddComponent } from './add.component';

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddComponent, ButtonComponent],
      imports: [CommonModule, FormBuilderModule, RouterTestingModule],
      providers: [
        { provide: SkillSetService, useValue: { getSkillSet: () => of({ data: [] }) } },
        { provide: UserService, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
