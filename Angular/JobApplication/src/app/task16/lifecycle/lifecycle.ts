import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-lifecycle',
  imports: [],
  templateUrl: './lifecycle.html',
  styleUrl: './lifecycle.css',
})
export class Lifecycle implements OnChanges,OnInit,DoCheck ,AfterContentInit,AfterContentChecked,AfterViewInit,AfterViewChecked,OnDestroy{
  @Input()
  data !: string 
  counter :number=0
  timer !:any

  ngOnChanges() {
    
    console.log("OnChange occured and the data is : ",this.data); 
  }
  ngOnInit(): void {
    console.log('onInit -> component intialized');
    this.timer = setInterval(()=>{
      this.counter++;
      console.log('counter : ',this.counter);
    },2000)
  }

  ngDoCheck(): void {
    console.log('-----------------ngDoCheck runned-----------------');
  }

  ngAfterContentInit(): void {
    console.log('-----------------ngAFterContentInit runned-----------------');
  }

  ngAfterContentChecked(): void {
    console.log('-----------------ngAfterContentChecked runned-----------------');

  }

  ngAfterViewInit(): void {
    console.log('-----------------ngAfterViewInit runned-----------------');

  }
  ngAfterViewChecked(): void {
    console.log('-----------------ngAfterViewChecked runned-----------------');

  }

  ngOnDestroy(): void {
    console.log('-----------------ngDestroy -> cleanup ----------------------------');
    clearInterval(this.timer)
  }
}
