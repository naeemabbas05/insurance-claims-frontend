import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFormSchema, DynamicFormField, FieldOption } from '../../core/forms/form-schema.models';
import { getApiErrorMessage } from '../../core/api/api-error';
import { UserModel } from '../../models/user-model';
import { SkillSetService } from '../../services/skillset-service';
import { UserService } from '../../services/user-service';
import { createUserFormSchema } from '../user-form-schema';

@Component({
  selector: 'app-add',
  standalone: false,
  templateUrl: './add.component.html'
})
export class AddComponent implements OnInit {
  formSchema: DynamicFormSchema = createUserFormSchema([]);
  initialValues: Record<string, unknown> = {};
  userId = 0;
  ready = true;
  saving = false;
  skillSetLoadFailed = false;
  userLoadFailed = false;
  errorMessage: string | null = null;
  private userLoaded = true;

  constructor(
    private readonly skillSetService: SkillSetService,
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = Number(id);
      if (!Number.isInteger(this.userId) || this.userId < 1) {
        this.errorMessage = 'The user ID is invalid.';
        this.userLoadFailed = true;
        this.userLoaded = false;
      } else {
        this.userLoaded = false;
        this.getUserById();
      }
    }
    this.updateReady();
    this.getSkillSet();
  }

  get isEdit(): boolean {
    return this.userId > 0;
  }

  get skillSetField(): DynamicFormField | undefined {
    return this.formSchema.sections.flatMap(section => section.fields)
      .find(field => field.key === 'userSkillSets');
  }

  private getUserById(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (result) => {
        const data = result?.data as UserModel | undefined;
        if (!data) {
          this.errorMessage = 'The requested user was not returned by the user API.';
          this.userLoadFailed = true;
        } else {
          const userSkillSets = Array.isArray(data.userSkillSets) ? data.userSkillSets : [];
          this.initialValues = {
            userName: data.userName ?? '',
            mail: data.mail ?? '',
            phoneNumber: data.phoneNumber ?? '',
            hobby: data.hobby ?? '',
            userSkillSets: userSkillSets
              .map((item: Record<string, unknown>) => item['skillSetsId'] ?? item['SkillSetsId'])
              .filter((id: unknown): id is string | number => typeof id === 'string' || typeof id === 'number')
              .map((id: string | number) => String(id))
          };
        }
        this.userLoaded = true;
        this.updateReady();
      },
      error: (error: unknown) => {
        this.errorMessage = getApiErrorMessage(error);
        this.userLoadFailed = true;
        this.userLoaded = true;
        this.updateReady();
      }
    });
  }

  private getSkillSet(): void {
    this.skillSetService.getSkillSet().subscribe({
      next: (result) => {
        const skillSets = result?.data;
        if (!Array.isArray(skillSets) || !skillSets.every(isSkillSetRecord)) {
          this.errorMessage = 'The skill-set API returned an invalid response.';
          this.skillSetLoadFailed = true;
          return;
        }
        const options: FieldOption[] = skillSets.map((item: { id: number | string; name: string }) => ({
          label: item.name,
          value: String(item.id)
        }));
        if (this.skillSetField) {
          this.skillSetField.options = options;
        }
        this.skillSetLoadFailed = false;
      },
      error: (error: unknown) => {
        this.errorMessage = getApiErrorMessage(error);
        this.skillSetLoadFailed = true;
      }
    });
  }

  submit(values: Record<string, unknown>): void {
    if (this.skillSetLoadFailed) {
      return;
    }
    this.errorMessage = null;
    const user = new UserModel();
    user.userName = this.stringValue(values, 'userName');
    user.mail = this.stringValue(values, 'mail');
    user.phoneNumber = this.stringValue(values, 'phoneNumber');
    user.hobby = this.stringValue(values, 'hobby');

    const selectedIds = Array.isArray(values['userSkillSets'])
      ? values['userSkillSets'].filter((value): value is string => typeof value === 'string')
      : [];
    user.userSkillSets = selectedIds.map(id => {
      const option = this.skillSetField?.options?.find(item => item.value === id);
      return { SkillSetsId: Number(id), Name: option?.label ?? '' };
    });

    this.saving = true;
    const request = this.isEdit
      ? this.userService.update(user)
      : this.userService.insert(user);
    request.subscribe({
      next: () => this.navigateToList(),
      error: (error: unknown) => {
        this.errorMessage = getApiErrorMessage(error);
        this.saving = false;
      }
    });
  }

  navigateToList(): void {
    this.router.navigate(['/']);
  }

  private updateReady(): void {
    this.ready = this.userLoaded && !this.userLoadFailed;
  }

  private stringValue(values: Record<string, unknown>, key: string): string {
    const value = values[key];
    return typeof value === 'string' ? value.trim() : '';
  }
}

function isSkillSetRecord(value: unknown): value is { id: number | string; name: string } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (typeof record['id'] === 'number' || typeof record['id'] === 'string') &&
    typeof record['name'] === 'string';
}
