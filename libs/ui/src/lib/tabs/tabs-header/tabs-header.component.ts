import { Component, computed, ElementRef, EventEmitter, inject, Output, viewChild } from '@angular/core';
import { TabsComponent } from '@ui';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ui-tabs-header',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './tabs-header.component.html',
  styleUrl: './tabs-header.component.scss'
})
export class TabsHeaderComponent {
  @Output() onItemSelected = new EventEmitter<number>();
  tabsComp = inject(TabsComponent, { skipSelf: true });
  scrollSize = 250;
  tabItems = this.tabsComp.tabItems;
  selectedIndex$ = this.tabsComp.selectedIndex$;
  scrollContainer = viewChild('scrollContainer', { read: ElementRef })
  isScrollable = computed(() => {
    const el = this.scrollContainer()?.nativeElement as HTMLDivElement;
    return el.scrollWidth > el.clientWidth;
  })


  setNewSelectedIndex(index: number) {
    this.onItemSelected.emit(index);
  }

  scroll(): void {
    const el = this.scrollContainer()?.nativeElement as HTMLDivElement;
    (<HTMLDivElement>this.scrollContainer()?.nativeElement).scrollLeft += 250;
    console.log(el.scrollLeft + el.clientWidth);
    console.log(el.scrollWidth);
    console.log(el.scrollWidth - 250 < el.scrollLeft + el.clientWidth);
  }
}
