import { Component } from '@angular/core';

@Component({
  selector: 'app-sample',
  imports: [],
  templateUrl: './sample.html',
  styleUrl: './sample.css',
})
export class Sample {
  // showName(name:string){
  //   console.log(name);
    
  //   alert(name)
  //}

  showName(name:any){
    console.log(name);
    
    alert(name)
  }
}
