import {
  AfterContentInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter, inject,
  Input, OnChanges,
  OnDestroy,
  Output,
  QueryList, SimpleChanges
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { OptionComponent } from './option/option.component';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';

export type SelectValue<T> = T | null;

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [
    OverlayModule
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  host: {
    '(click)': 'open()'
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
export class SelectComponent<T> implements AfterContentInit, OnDestroy, OnChanges {
  @Input() label: string = 'Select value ...';
  @Input()
  set value (value: SelectValue<T>) {
    this.selectionModel.clear();
    if (value) {
      this.selectionModel.select(value);
    }
  }
  get value(): SelectValue<T> {
    if (this.selectionModel.isEmpty()) return null;
    return this.selectionModel.selected[0]
  }
  @Input() isOpen = false;
  @Input() displayWith: ((value: T) => string | number) | null = null;
  @Input() compareWith: (value1: T | null, value2: T | null) => boolean = (v1, v2) => v1 === v2;
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() selectionChanged = new EventEmitter<SelectValue<T>>();
  @ContentChildren(OptionComponent, { descendants: true }) options!: QueryList<OptionComponent<T>>;
  private selectionModel = new SelectionModel<T>();
  private unsubscribe$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);

  protected get displayValue() {
    if (this.displayWith && this.value) {
      return this.displayWith(this.value);
    }

    return this.value;
  }

  open(): void {
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
        values.removed.forEach(value => this.findOptionByValue(value)?.deselect());
        values.added.forEach(value => this.findOptionByValue(value)?.highlightAsSelected()); // If value changes after some time
      })

    this.options.changes
      .pipe(
        startWith<QueryList<OptionComponent<T>>>(this.options),
        tap(() => queueMicrotask(() => this.highlightSelectedOption(this.value))),
        switchMap(options => merge(...options.map(o => o.selected))),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((selectedOption: OptionComponent<T>) => this.handleSelection(selectedOption))
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private highlightSelectedOption(value: SelectValue<T>) {
    this.findOptionByValue(value)?.highlightAsSelected();
  }

  private findOptionByValue(value: SelectValue<T>): OptionComponent<T> | undefined {
    return this.options && this.options.find(option => this.compareWith(option.value, value));
  }

  private handleSelection(option: OptionComponent<T>): void {
    if (option.value) {
      this.selectionModel.toggle(option.value);
      this.selectionChanged.emit(this.value);
    }
    this.close();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compareWith']) {
      this.selectionModel.compareWith = changes['compareWith'].currentValue;
      this.highlightSelectedOption(this.value);
    }
  }
}
