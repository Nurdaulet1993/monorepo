import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[uiTabsTitle]',
  standalone: true,
})
export class TabsTitleDirective {
  templateRef: TemplateRef<any> = inject(TemplateRef);
}
