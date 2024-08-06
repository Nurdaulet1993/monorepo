import { Component, inject, input, OnInit, TemplateRef, viewChild } from '@angular/core';
import { TabsComponent } from '../tabs.component';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';

let tabItemId = 0;

@Component({
  selector: 'ui-tab-item',
  standalone: true,
  imports: [],
  templateUrl: './tab-item.component.html',
  styleUrl: './tab-item.component.scss'
})
export class TabItemComponent implements OnInit {
  id = tabItemId++;
  label = input.required<string>();
  templateRef = viewChild(TemplateRef, { read: TemplateRef });
  tabs = inject(TabsComponent);
  private expansionDispatcher = inject(UniqueSelectionDispatcher, { skipSelf: true });

  ngOnInit(): void {
    const selectedIndex = this.tabs.selectedIndex();
    console.log(selectedIndex)

    console.log(this.tabs)
    if (selectedIndex === this.id) {
      this.tabs.currentTab = this.templateRef() ?? null;
    }

    // this.expansionDispatcher.listen(
    //   (id: string, tabsId: string) => {
    //     const selectedIndex = this.tabs.selectedIndex();
    //
    //     console.log('Hello')
    //
    //     if (this.tabs && this.tabs.id === tabsId && this.id !== id) {
    //
    //       if (selectedIndex.toString() === this.id.split('-')[1]) {
    //         this.tabs.currentTab = this.templateRef() ?? null;
    //       }
    //
    //     }
    //
    //
    //   }
    // )
  }
}
