import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserStore } from './user.service';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4">
      <div>
        Name:
        <input
          class="rounded-md border border-gray-400"
          formControlName="name" />
      </div>
      <div>
        Address:
        <div>
          street:
          <input
            class="rounded-md border border-gray-400"
            formControlName="street" />
        </div>
        <div>
          zipCode:
          <input
            class="rounded-md border border-gray-400"
            formControlName="zipCode" />
        </div>
        <div>
          city:
          <input
            class="rounded-md border border-gray-400"
            formControlName="city" />
        </div>
      </div>
      <div>
        note:
        <input
          class="rounded-md border border-gray-400"
          formControlName="note" />
      </div>
      <div>
        title:
        <input
          class="rounded-md border border-gray-400"
          formControlName="title" />
      </div>
      <div>
        salary:
        <input
          class="rounded-md border border-gray-400"
          formControlName="salary" />
      </div>
      <button class="w-fit border p-2">Submit</button>
    </form>
  `,
  host: {
    class: 'block border border-gray-500 p-4 pt-10 m-4',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  userStore = inject(UserStore);

  form = new FormGroup({
    name: new FormControl(this.userStore.name(), { nonNullable: true }),
    street: new FormControl(this.userStore.street(), {
      nonNullable: true,
    }),
    zipCode: new FormControl(this.userStore.zipCode(), {
      nonNullable: true,
    }),
    city: new FormControl(this.userStore.city(), {
      nonNullable: true,
    }),
    note: new FormControl(this.userStore.note(), { nonNullable: true }),
    title: new FormControl(this.userStore.jobTitle(), { nonNullable: true }),
    salary: new FormControl(this.userStore.salary(), {
      nonNullable: true,
    }),
  });

  submit() {
    this.userStore.name.update(() => this.form.getRawValue().name);
    this.userStore.note.update(() => this.form.getRawValue().note);
    this.userStore.street.update(() => this.form.getRawValue().street);
    this.userStore.zipCode.update(() => this.form.getRawValue().zipCode);
    this.userStore.city.update(() => this.form.getRawValue().city);
    this.userStore.jobTitle.update(() => this.form.getRawValue().title);
    this.userStore.salary.update(() => this.form.getRawValue().salary);
  }
}
