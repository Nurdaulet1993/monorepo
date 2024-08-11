import {
  ChangeDetectionStrategy,
  Component, computed, contentChild,
  contentChildren,
  Input, TemplateRef
} from '@angular/core';
import { TabItemComponent } from './tab-item/tab-item.component';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { BehaviorSubject, map, Observable, scan } from 'rxjs';
import { TabsTitleDirective } from './tabs-title.directive';
import { TabsHeaderComponent } from './tabs-header/tabs-header.component';


@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    AsyncPipe,
    TabsHeaderComponent
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  @Input() set selectedIndex(value: number | null) {
    this.selectedIndexSub.next(value)
  };
  title = contentChild(TabsTitleDirective);
  tabItems = contentChildren(TabItemComponent);
  private readonly selectedIndexSub = new BehaviorSubject<number | null>(null);
  selectedIndex$ = this.selectedIndexSub
    .pipe(scan((value, newValue) => value === newValue ? null : newValue));
  currentTabTemplate$: Observable<TemplateRef<any> | null> = this.selectedIndex$
    .pipe(map(value => value === null ? null : this.tabItems()[value].templateRef()));
  selectIndex(index: number): void {
    this.selectedIndexSub.next(index);
  }

  setSelectedIndex(index: number) {
    this.selectedIndexSub.next(index);
  }
}
