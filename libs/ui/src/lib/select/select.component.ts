import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input, OnDestroy,
  Output,
  output,
  QueryList
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { OptionComponent } from './option/option.component';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, startWith, Subject, switchMap, takeUntil } from 'rxjs';

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
  ]
})
export class SelectComponent implements AfterContentInit, OnDestroy {
  @Input() label: string = 'Select value ...';
  @Input()
  set value (value: string | null) {
    if (!value) return;
    this.selectionModel.clear();
    this.selectionModel.select(value);
  }
  get value() {
    if (this.selectionModel.isEmpty()) return null;
    return this.selectionModel.selected[0]
  }
  @Input() isOpen = false;
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() selectionChanged = new EventEmitter<string | null>();
  @ContentChildren(OptionComponent, { descendants: true }) options!: QueryList<OptionComponent>;
  private selectionModel = new SelectionModel<string>();
  private unsubscribe$ = new Subject<void>();

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  onPanelAnimationDone({ fromState, toState }: AnimationEvent): void {
    if (fromState === 'void' && toState == null && this.isOpen) this.opened.emit();
    if (fromState == null && toState === 'void' && !this.isOpen) this.closed.emit();
  }

  ngAfterContentInit(): void {
    this.highlightSelectedOption(this.value);
    this.selectionModel.changed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(values => {
        values.removed.forEach(value => this.findOptionByValue(value)?.deselect());
        values.added.forEach(value => this.findOptionByValue(value)?.highlightAsSelected()); // If value changes after some time
      })

    this.options.changes
      .pipe(
        startWith<QueryList<OptionComponent>>(this.options),
        switchMap(options => merge(...options.map(o => o.selected))),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((selectedOption: OptionComponent) => this.handleSelection(selectedOption))
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private highlightSelectedOption(value: string | null) {
    this.findOptionByValue(value)?.highlightAsSelected();
  }

  private findOptionByValue(value: string | null): OptionComponent | undefined {
    return this.options && this.options.find(option => option.value === value);
  }

  private handleSelection(option: OptionComponent): void {
    if (option.value) {
      this.selectionModel.toggle(option.value);
      this.selectionChanged.emit(this.value);
    }
    this.close();
  }


}
