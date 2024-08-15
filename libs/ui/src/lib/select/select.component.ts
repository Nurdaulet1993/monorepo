import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';

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
export class SelectComponent {
  @Input() label: string = 'Select value ...';
  @Input() value: string | null = null;
  @Input() isOpen = false;
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

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
}
