import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent, TabItemComponent, TabsComponent } from '@ui';

@Component({
  standalone: true,
  imports: [RouterModule, CardComponent, TabsComponent, TabItemComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'app';

  index = 1;

  ngOnInit(): void {
    setTimeout(() => {
      this.index = 2;
    }, 3000)
  }
}
