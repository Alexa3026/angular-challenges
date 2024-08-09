import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserStore {
  name = signal('Nata');
  street = signal('');
  zipCode = signal('');
  city = signal('');
  note = signal('');
  jobTitle = signal('');
  salary = signal(0);
}
