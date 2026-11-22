import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';
import { FeedbackModule } from '../../Shared/feedback/feedback.module';
import { DynamicFormsModule } from '../../features/dynamic-forms/dynamic-forms.module';
import { SkillSetService } from '../../services/skillset-service';
import { UserService } from '../../services/user-service';
import { AddComponent } from './add.component';

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let skillSetService: jasmine.SpyObj<SkillSetService>;
  let skillSetsResponse: Subject<{ data: { id: number; name: string }[] }>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj<UserService>('UserService', ['getUserById', 'insert', 'update']);
    userService.insert.and.returnValue(of({}));
    userService.update.and.returnValue(of({}));
    userService.getUserById.and.returnValue(of({ data: {} }));
    skillSetService = jasmine.createSpyObj<SkillSetService>('SkillSetService', ['getSkillSet']);
    skillSetsResponse = new Subject();
    skillSetService.getSkillSet.and.returnValue(skillSetsResponse.asObservable());

    await TestBed.configureTestingModule({
      declarations: [AddComponent],
      imports: [CommonModule, DynamicFormsModule, FeedbackModule, RouterTestingModule],
      providers: [
        { provide: SkillSetService, useValue: skillSetService },
        { provide: UserService, useValue: userService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.ready).toBeTrue();
    expect(fixture.nativeElement.querySelector('app-dynamic-form-renderer')).not.toBeNull();
  });

  it('submits the shared form values in the existing user API shape', () => {
    skillSetsResponse.next({ data: [{ id: 7, name: 'Claims' }] });
    component.submit({
      userName: '  Riley  ',
      mail: 'riley@example.com',
      phoneNumber: '12345',
      hobby: 'Reading',
      userSkillSets: ['7']
    });

    expect(userService.insert).toHaveBeenCalledWith(jasmine.objectContaining({
      userName: 'Riley',
      mail: 'riley@example.com',
      phoneNumber: '12345',
      hobby: 'Reading',
      userSkillSets: [{ SkillSetsId: 7, Name: 'Claims' }]
    }));
  });
});
