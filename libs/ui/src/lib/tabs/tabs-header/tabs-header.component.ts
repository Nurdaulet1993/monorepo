import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
  viewChild,
  ViewEncapsulation
} from '@angular/core';
import { TabsComponent } from '@ui';
import { AsyncPipe } from '@angular/common';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'ui-tabs-header',
  standalone: true,
  imports: [
    AsyncPipe,
    ScrollingModule
  ],
  templateUrl: './tabs-header.component.html',
  styleUrl: './tabs-header.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsHeaderComponent {
  @Output() onItemSelected = new EventEmitter<number>();
  tabsComp = inject(TabsComponent, { skipSelf: true });
  scrollSize = 350;
  tabItems = this.tabsComp.tabItems;
  selectedIndex$ = this.tabsComp.selectedIndex$;
  // scrollContainer = viewChild('scrollContainer', { read: ElementRef })
  // isScrollable = computed(() => {
  //   const el = this.scrollContainer()?.nativeElement as HTMLDivElement;
  //   return el.scrollWidth > el.clientWidth;
  // })
  viewport = viewChild(CdkVirtualScrollViewport);

  setNewSelectedIndex(index: number) {
    this.onItemSelected.emit(index);
  }

  scroll(index: number): void {
    // console.log(this.viewport().elementScrolled().)
    const currentOffset = this.viewport()?.measureScrollOffset('start');
    if (currentOffset != undefined) this.viewport()?.scrollToOffset(currentOffset + this.scrollSize, 'smooth');
    // const el = this.scrollContainer()?.nativeElement as HTMLDivElement;
    // (<HTMLDivElement>this.scrollContainer()?.nativeElement).scrollLeft += 250;
    // console.log(el.scrollLeft + el.clientWidth);
    // console.log(el.scrollWidth);
    // console.log(el.scrollWidth - 250 < el.scrollLeft + el.clientWidth);
  }

  onScroll() {
    const viewportSize = this.viewport()?.getViewportSize();
    const currentOffset = this.viewport()?.measureScrollOffset('start');
    if (!viewportSize) return;
    const maxOffset = this.viewport()!.measureRenderedContentSize() - viewportSize;

    // console.log(currentOffset >= maxOffset);
  }
}
