import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from '@ui';

@Component({
  standalone: true,
  imports: [RouterModule, CardComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'app';
}
