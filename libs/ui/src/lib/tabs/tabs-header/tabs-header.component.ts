import { Component, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { TabsItemComponent } from '@ui';
import { ScrollDirective } from '../scroll.directive';

@Component({
  selector: 'ui-tabs-header',
  standalone: true,
  imports: [
    ScrollDirective
  ],
  templateUrl: './tabs-header.component.html',
  styleUrl: './tabs-header.component.scss',
})
export class TabsHeaderComponent implements OnInit {
  @Input({ required: true }) tabItems!: QueryList<TabsItemComponent>;
  @Output() select = new EventEmitter<number>();

  ngOnInit(): void {}

  onSelect(index: number): void {
    this.select.emit(index)
  }
}

