import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ButtonComponent } from '../Shared/button/button.component';
import { TableComponent } from '../Shared/table/table.component';
import { UserService } from '../services/user-service';
import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent, ButtonComponent, TableComponent],
      imports: [CommonModule, FormsModule, RouterTestingModule],
      providers: [{
        provide: UserService,
        useValue: {
          getUsersPaginated: () => of({ data: [], totalRecords: 0, pageNumber: 1, pageSize: 10 })
        }
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
