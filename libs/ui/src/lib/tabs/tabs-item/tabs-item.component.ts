import { booleanAttribute, Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'ui-tabs-item',
  standalone: true,
  imports: [],
  templateUrl: './tabs-item.component.html',
  styleUrl: './tabs-item.component.scss'
})
export class TabsItemComponent {
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ required: true }) label!: string;
  @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;
}
