import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent, TabsItemComponent } from '@ui';
import { TabsComponent } from '../../../../libs/ui/src/lib/tabs/tabs.component';

@Component({
  standalone: true,
  imports: [RouterModule, CardComponent, TabsComponent, TabsItemComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'app';
}
