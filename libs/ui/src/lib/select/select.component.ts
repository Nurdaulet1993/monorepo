import {
  AfterContentInit, AfterViewInit, Attribute, booleanAttribute,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChildren, ElementRef,
  EventEmitter, inject,
  Input, OnChanges,
  OnDestroy, OnInit,
  Output,
  QueryList, SimpleChanges
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { OptionComponent } from './option/option.component';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type SelectValue<T> = T | T[] | null;

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [
    OverlayModule
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true
    }
  ],
  host: {
    '(click)': 'open()',
    '[class.open]': 'isOpen',
    '[class.disabled]': 'isDisabled',
  },
  animations: [
    trigger('dropDown', [
      state('void', style({  opacity: 0, transform: 'translateY(-10px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)'})),
      transition(':enter', [animate('320ms cubic-bezier(0, 1, 0.45, 1.34)')]),
      transition(':leave', [animate('220ms cubic-bezier(0.88,-0.7, 0.86, 0.85)')]),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent<T> implements AfterContentInit, OnDestroy, OnChanges, AfterViewInit, ControlValueAccessor {
  @Input() label: string = 'Select value ...';
  @Input()
  set value (value: SelectValue<T>) {
    this.setValue(value);
    this.onChange(this.value);
    this.highlightSelectedOption();
  }
  get value(): SelectValue<T> {
    if (this.selectionModel.isEmpty()) return null;
    if (this.selectionModel.isMultipleSelection()) {
      return this.selectionModel.selected;
    }
    return this.selectionModel.selected[0];
  }
  @Input({ transform: booleanAttribute, alias: 'opened' }) isOpen = false;
  @Input({ transform: booleanAttribute, alias: 'disabled' }) isDisabled = false;
  @Input() displayWith: ((value: T) => string | number) | null = null;
  @Input() compareWith: (value1: T | null, value2: T | null) => boolean = (v1, v2) => v1 === v2;
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() selectionChanged = new EventEmitter<SelectValue<T>>();
  @ContentChildren(OptionComponent, { descendants: true }) options!: QueryList<OptionComponent<T>>;
  private selectionModel!: SelectionModel<T>;
  private unsubscribe$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);
  private optionMap = new Map<T | null, OptionComponent<T>>();

  private el = inject(ElementRef);
  overlayWidth: number = 0;

  constructor(@Attribute('multiple') private multiple: string) {
    this.selectionModel = new SelectionModel<T>(coerceBooleanProperty(this.multiple))
  }

  protected get displayValue() {
    if (this.displayWith && this.value) {
      if (Array.isArray(this.value)) {
        return this.value.map(this.displayWith);
      }

      return this.displayWith(this.value);
    }

    return this.value;
  }

  get isMultiSelect(): boolean {
    return this.selectionModel.isMultipleSelection();
  }

  open(): void {
    if (this.isDisabled) return;
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
    this.cdr.markForCheck();
  }

  onPanelAnimationDone({ fromState, toState }: AnimationEvent): void {
    if (fromState === 'void' && toState == null && this.isOpen) this.opened.emit();
    if (fromState == null && toState === 'void' && !this.isOpen) this.closed.emit();
  }

  ngAfterContentInit(): void {
    this.selectionModel.changed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(values => {
        values.removed.forEach(value => this.optionMap.get(value)?.deselect());
        values.added.forEach(value => this.optionMap.get(value)?.highlightAsSelected()); // If value changes after some time
      })

    this.options.changes
      .pipe(
        startWith<QueryList<OptionComponent<T>>>(this.options),
        tap(() => this.refreshOptionMap()),
        tap(() => queueMicrotask(() => this.highlightSelectedOption())),
        switchMap(options => merge(...options.map(o => o.selected))),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((selectedOption: OptionComponent<T>) => this.handleSelection(selectedOption))
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private refreshOptionMap() {
    this.optionMap.clear();
    this.options.forEach(option => this.optionMap.set(option.value, option))
  }

  private highlightSelectedOption() {
    const valuesWithUpdatedReferences = this.selectionModel.selected.map(value => {
      const correspondingOption = this.findOptionByValue(value);
      return correspondingOption ? correspondingOption.value! : value;
    });
    this.selectionModel.clear();
    this.selectionModel.select(...valuesWithUpdatedReferences);
  }

  private findOptionByValue(value: T | null): OptionComponent<T> | undefined {
    if (this.optionMap.has(value)) return this.optionMap.get(value);
    return this.options && this.options.find(option => this.compareWith(option.value, value));
  }

  private handleSelection(option: OptionComponent<T>): void {
    if (this.isDisabled) return;
    if (option.value) {
      this.selectionModel.toggle(option.value);
      this.selectionChanged.emit(this.value);
      this.onChange(this.value);
    }
    if (!this.selectionModel.isMultipleSelection()) this.close();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compareWith']) {
      this.selectionModel.compareWith = changes['compareWith'].currentValue;
      this.highlightSelectedOption();
    }
  }

  clear(event: MouseEvent) {
    if (this.isDisabled) return;
    event.stopPropagation();
    this.selectionModel.clear();
    this.selectionChanged.emit(this.value);
    this.onChange(this.value);
  }

  setValue(value: SelectValue<T>) {
    this.selectionModel.clear();
    if (!value) return;
    Array.isArray(value)
      ? this.selectionModel.select(...value)
      : this.selectionModel.select(value);
  }

  protected onChange: (newValue: SelectValue<T>) => void = () => {};

  ngAfterViewInit(): void {
    this.overlayWidth = this.el.nativeElement.offsetWidth;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: SelectValue<T>): void {
    this.setValue(value);
    this.highlightSelectedOption();
  }
}
