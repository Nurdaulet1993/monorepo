import { ChangeDetectionStrategy, Component, ContentChildren, InjectionToken, Input, QueryList } from '@angular/core';
import { TabsHeaderComponent } from './tabs-header/tabs-header.component';
import { TabsItemComponent } from './tabs-item/tabs-item.component';
import { BehaviorSubject, filter, map, scan, tap } from 'rxjs';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';

export const TABS = new InjectionToken<TabsComponent>('tabs_comp');

@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [
    TabsHeaderComponent,
    NgTemplateOutlet,
    AsyncPipe
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  @Input() set selectedIndex(value: number | null) {
    setTimeout(() => {
      this.selectedIndexSub.next(value);
    })
  }
  @ContentChildren(TabsItemComponent) tabItems!: QueryList<TabsItemComponent>;
  private readonly selectedIndexSub = new BehaviorSubject<number | null>(null);
  selectedIndex$ = this.selectedIndexSub.asObservable();
  currentTab$ = this.selectedIndex$
    .pipe(
      filter(value => value !== null),
      map(value => this.tabItems.get(value)?.templateRef),
    )

  onSelectIndex(index: number) {
    this.selectedIndexSub.next(index);
  }
}
