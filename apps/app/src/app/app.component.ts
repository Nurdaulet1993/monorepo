import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent, OptionComponent, SelectComponent, TabsComponent, TabsItemComponent } from '@ui';

@Component({
  standalone: true,
  imports: [RouterModule, CardComponent, TabsComponent, TabsItemComponent, SelectComponent, OptionComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'app';
  selectValue = '1';
  private cdr = inject(ChangeDetectorRef)

  onOpen() {
    console.log('Opened');
  }

  onClosed() {
    console.log('Closed');
  }

  onSelect(value: string | null) {
    console.log('"Selected value":', value)
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.selectValue = '3';
    //   this.cdr.detectChanges()
    // }, 2000)
  }
}
