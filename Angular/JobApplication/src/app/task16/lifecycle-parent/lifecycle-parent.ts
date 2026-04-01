import { Component } from '@angular/core';
import { Lifecycle } from "../lifecycle/lifecycle";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-lifecycle-parent',
  imports: [Lifecycle,NgIf],
  templateUrl: './lifecycle-parent.html',
  styleUrl: './lifecycle-parent.css',
})
export class LifecycleParent {
  information:string = "Angular"
  show:boolean = true

  toggle(){
    this.show = !this.show
  }
}
