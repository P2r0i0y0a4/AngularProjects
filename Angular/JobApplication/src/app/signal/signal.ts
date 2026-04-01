import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-signal',
  imports: [NgClass],
  templateUrl: './signal.html',
  styleUrl: './signal.css',
})
export class Signal {
  property='go'
  property1='wait'
  property2='stop'
}
