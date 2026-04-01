import { Component } from '@angular/core';
import { Highlight } from '../highlight'
@Component({
  selector: 'app-candidate-list',
  imports: [Highlight],
  templateUrl: './candidate-list.html',
  styleUrl: './candidate-list.css',
})
export class CandidateList {
  showTable: boolean = false;
  candidates = [
    { id: 1, name: 'priya', role: 'java', status: 'Selected' },
    { id: 2, name: 'mary', role: 'UI designer', status: 'In View' },
    { id: 3, name: 'sil', role: 'content creator', status: 'Rejected' },
    { id: 4, name: 'ajitha', role: 'angular', status: 'Selected' },
  ];
  // showlist() {
  //   this.showTable;
  //   if (this.showTable) {
  //     this.showTable = false;
  //   } else {
  //     this.showTable =  true
  //   }
  // }
  showlist(){
    this.showTable=!this.showTable
  }
}
