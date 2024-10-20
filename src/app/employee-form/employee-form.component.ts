import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Employee } from '../employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    CommonModule, // Add CommonModule here
  ],
  styles: `
    .employee-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
    }
    .mat-mdc-radio-button ~ .mat-mdc-radio-button {
      margin-left: 16px;
    }
    .mat-mdc-form-field {
      width: 100%;
    }
  `,
  template: `
    <form
      class="employee-form"
      autocomplete="off"
      [formGroup]="employeeForm"
      (submit)="submitForm()"
    >
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput placeholder="Name" formControlName="name" required />
        <mat-error *ngIf="name.invalid && name.touched">
          Name must be at least 3 characters long.
        </mat-error>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Position</mat-label>
        <input
          matInput
          placeholder="Position"
          formControlName="position"
          required
        />
        <mat-error *ngIf="position.invalid && position.touched">
          Position must be at least 5 characters long.
        </mat-error>
      </mat-form-field>

      <mat-radio-group formControlName="level" aria-label="Select an option">
        <mat-radio-button name="level" value="junior" required>
          Junior
        </mat-radio-button>
        <mat-radio-button name="level" value="mid">
          Mid
        </mat-radio-button>
        <mat-radio-button name="level" value="senior">
          Senior
        </mat-radio-button>
      </mat-radio-group>
      <br />
      <button
        mat-raised-button
        color="primary"
        type="submit"
        [disabled]="employeeForm.invalid"
      >
        Add
      </button>
    </form>
  `,
})
export class EmployeeFormComponent implements OnInit, OnChanges {
  @Input() initialState?: Employee;

  @Output() formValuesChanged = new EventEmitter<Employee>();
  @Output() formSubmitted = new EventEmitter<Employee>();

  employeeForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      position: ['', [Validators.required, Validators.minLength(5)]],
      level: ['junior', [Validators.required]],
    });

    if (this.initialState) {
      this.employeeForm.patchValue({
        name: this.initialState.name || '',
        position: this.initialState.position || '',
        level: this.initialState.level || 'junior',
      });
    }

    this.employeeForm.valueChanges.subscribe(value => {
      this.formValuesChanged.emit(value as Employee);
    });
  }

  ngOnChanges(): void {
    if (this.initialState) {
      this.employeeForm.patchValue({
        name: this.initialState.name || '',
        position: this.initialState.position || '',
        level: this.initialState.level || 'junior',
      });
    }
  }

  get name() {
    return this.employeeForm.get('name')!;
  }

  get position() {
    return this.employeeForm.get('position')!;
  }

  get level() {
    return this.employeeForm.get('level')!;
  }

  submitForm() {
    if (this.employeeForm.valid) {
      this.formSubmitted.emit(this.employeeForm.value as Employee);
    }
  }
}
