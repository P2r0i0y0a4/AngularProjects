import { Directive , ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlights]',
})
export class Highlight {
  constructor(private el : ElementRef) {

    setTimeout(()=>{
    let text = this.el.nativeElement.innerText.trim()
    if(text == 'Selected'){
      this.el.nativeElement.style.color = 'white'
      this.el.nativeElement.style.backgroundColor = 'green'
    }
    else if(text == 'In View'){
      this.el.nativeElement.style.color = 'white'
      this.el.nativeElement.style.backgroundColor = 'orange'
    }
    else if(text == 'Rejected'){
      this.el.nativeElement.style.color = 'white'
      this.el.nativeElement.style.backgroundColor = 'red'
    }
    else{
      this.el.nativeElement.style.color = 'black'
    }
    })
    this.el.nativeElement.style.fontSize = '18px'
    this.el.nativeElement.style.borderRadius = '10px'
    this.el.nativeElement.style.padding = '10px'
  }
}
