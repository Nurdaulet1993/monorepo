import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent, OptionComponent, SelectComponent, TabsItemComponent } from '@ui';
import { TabsComponent } from '@ui';

@Component({
  standalone: true,
  imports: [RouterModule, CardComponent, TabsComponent, TabsItemComponent, SelectComponent, OptionComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'app';

  onOpen() {
    console.log('Opened');
  }

  onClosed() {
    console.log('Closed');
  }
}
