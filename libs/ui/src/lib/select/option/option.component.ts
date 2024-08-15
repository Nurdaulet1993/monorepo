import { booleanAttribute, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-option',
  standalone: true,
  imports: [],
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss',
  host: {
    class: 'block px-4 py-2',
    '[class.selected]': 'isSelected',
    '[class.disabled]': 'isDisabled',
    '(click)': 'select()'
  }
})
export class OptionComponent {
  @Input() value: string | null = null;
  @Input({ transform: booleanAttribute, alias: 'disabled' }) isDisabled = false;
  @Output() selected = new EventEmitter<OptionComponent>();
  protected isSelected = false;

  protected select(): void {
    if (this.isDisabled) return;
    this.highlightAsSelected();
    this.selected.emit(this);
  }
  deselect(): void {
    this.isSelected = false;
  }

  highlightAsSelected(): void {
    this.isSelected = true;
  }
}
