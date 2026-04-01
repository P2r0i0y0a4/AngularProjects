import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stream-data',
  imports: [],
  templateUrl: './stream-data.html',
  styleUrl: './stream-data.css',
})
export class StreamData {
  data = new Observable((observer)=>{
    observer.next('hello'),
    observer.next('world'),
    observer.error('data not found'),
    observer.next('hiii'),
    observer.complete()
  })
  datainfo(){
    console.log(this.data);
    this.data.subscribe({
      next:data=>{
        console.log(data);
      },
      //to handle that error
      error:(error)=>{
        console.log(error);
      }
    })
  }
}
