import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent, OptionComponent, SelectComponent, TabsComponent, TabsItemComponent, SelectValue } from '@ui';
import { User } from './user';

@Component({
  standalone: true,
  imports: [RouterModule, CardComponent, TabsComponent, TabsItemComponent, SelectComponent, OptionComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'app';

  private cdr = inject(ChangeDetectorRef);
  users: User[] = [
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
    new User(3, 'Marie Curie', 'marie', 'Poland/French'),
    new User(4, 'Isaac Newton', 'isaac', 'United Kingdom'),
    new User(5, 'Stephen Hawking', 'stephen', 'United Kingdom', true),
    new User(6, 'Max Planck', 'max', 'Germany'),
    new User(7, 'James Clerk Maxwell', 'james', 'United Kingdom'),
    new User(8, 'Michael Faraday', 'michael', 'United Kingdom'),
    new User(9, 'Richard Feynman', 'richard', 'USA'),
    new User(10, 'Ernest Rutherford', 'ernest', 'New Zealand'),
  ];
  selectValue: SelectValue<User> = [
    new User(3, 'Marie Curie', 'marie', 'Poland/French'),
    new User(7, 'James Clerk Maxwell', 'james', 'United Kingdom'),
  ]

  displayWith(user: User): string {
    return user.name;
  }

  compareWith(user1: User | null, user2: User | null): boolean {
    return user1?.id === user2?.id;
  }

  onOpen() {
    console.log('Opened');
  }

  onClosed() {
    console.log('Closed');
  }

  onSelect(value: SelectValue<User>) {
    console.log('"Selected value":', value)
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.selectValue = new User(8, 'Michael Faraday', 'michael', 'United Kingdom');
    //   this.users = [
    //     new User(7, 'James Clerk Maxwell', 'james', 'United Kingdom'),
    //     new User(8, 'Michael Faraday', 'michael', 'United Kingdom'),
    //     new User(9, 'Richard Feynman', 'richard', 'USA'),
    //     new User(10, 'Ernest Rutherford', 'ernest', 'New Zealand'),
    //   ]
    //   this.cdr.markForCheck()
    // }, 5000)
  }
}
