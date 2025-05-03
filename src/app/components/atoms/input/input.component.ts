import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() label: string = '';
  @Input() type: 'text' | 'number' | 'textarea' | 'email' = 'text';
  @Input() contentText: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = true;
  @Input() maxwidth: number = 90;
  count = 0;

  @Output() inputChange: EventEmitter<string> = new EventEmitter<string>();

  onInputChange() {
    this.inputChange.emit(this.contentText);
    this.count = this.contentText.length;
  }

  // falta hacer el contador
}
