import { Component, input, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'ui-tab-item',
  standalone: true,
  imports: [],
  templateUrl: './tab-item.component.html',
  styleUrl: './tab-item.component.scss'
})
export class TabItemComponent {
  label = input.required<string>();
  templateRef = viewChild.required<TemplateRef<any>>(TemplateRef);
}
