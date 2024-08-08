import {
  ChangeDetectionStrategy,
  Component, contentChildren, effect,
  input, TemplateRef
} from '@angular/core';
import { TabItemComponent } from './tab-item/tab-item.component';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { BehaviorSubject, map, Observable, scan } from 'rxjs';

@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    AsyncPipe
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  selected = input<number | null>(null);
  tabs = contentChildren(TabItemComponent);
  private readonly selectedIndexSub =  new BehaviorSubject<number | null>(null);
  selectedIndex$: Observable<number | null> = this.selectedIndexSub
    .pipe(scan((value, newValue) => value === newValue ? null : newValue));
  currentTab$: Observable<TemplateRef<any> | null> = this.selectedIndex$
    .pipe(map(value => value === null ? null : this.tabs()[value].templateRef()));
  selectedEff = effect(() => this.selectedIndexSub.next(this.selected()));

  selectIndex(index: number): void {
    this.selectedIndexSub.next(index)
  }
}
