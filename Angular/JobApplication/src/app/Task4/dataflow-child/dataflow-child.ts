import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OutletContext } from '@angular/router';

@Component({
  selector: 'app-dataflow-child',
  imports: [],
  templateUrl: './dataflow-child.html',
  styleUrl: './dataflow-child.css',
})
export class DataflowChild {
  @Input()
  msg!: string;
  @Input()
  mark!: number[];
  @Input()
  item!: {
    productId: number;
    email: string;
    productName: string;
  }
  @Output()
  text = new EventEmitter();
  handleClick() {
    this.text.emit('Welcome to Angular');
  }
}
