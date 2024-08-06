import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren, HostBinding,
  input,
  QueryList,
  TemplateRef
} from '@angular/core';
import { TabItemComponent } from './tab-item/tab-item.component';
import { NgTemplateOutlet } from '@angular/common';

let tabsId = 0;

@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  selectedIndex = input<number>(0);
  currentTab: TemplateRef<any> | null = null;
  @ContentChildren(TabItemComponent) tabs!: QueryList<TabItemComponent>;
  @HostBinding('attr.id') readonly id: string = `tabsItem-${tabsId++}`;
}
