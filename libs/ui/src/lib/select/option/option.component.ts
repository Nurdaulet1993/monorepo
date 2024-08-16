import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';
import { SelectComponent } from '../select.component';

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
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent<T> {
  @Input() value: T | null = null;
  @Input({ transform: booleanAttribute, alias: 'disabled' }) isDisabled = false;
  @Output() selected = new EventEmitter<OptionComponent<T>>();
  protected isSelected = false;
  private cdr = inject(ChangeDetectorRef);
  private selectComp = inject(SelectComponent);
  isMultiselect = this.selectComp.isMultiSelect;

  protected select(): void {
    if (this.isDisabled) return;
    this.highlightAsSelected();
    this.selected.emit(this);
  }
  deselect(): void {
    this.isSelected = false;
    this.cdr.markForCheck();
  }

  highlightAsSelected(): void {
    this.isSelected = true;
    this.cdr.markForCheck();
  }
}
