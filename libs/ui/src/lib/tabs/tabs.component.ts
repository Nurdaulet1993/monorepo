import { Component, ContentChildren, InjectionToken, QueryList } from '@angular/core';
import { TabsHeaderComponent } from './tabs-header/tabs-header.component';
import { TabsItemComponent } from './tabs-item/tabs-item.component';

export const TABS = new InjectionToken<TabsComponent>('tabs_comp');

@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [
    TabsHeaderComponent
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {
  @ContentChildren(TabsItemComponent) tabItems!: QueryList<TabsItemComponent>;
}
