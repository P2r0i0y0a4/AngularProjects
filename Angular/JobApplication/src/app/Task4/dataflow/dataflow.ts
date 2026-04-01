import { Component } from '@angular/core';
import { DataflowChild } from "../dataflow-child/dataflow-child";

@Component({
  selector: 'app-dataflow',
  imports: [DataflowChild],
  templateUrl: './dataflow.html',
  styleUrl: './dataflow.css',
})
export class Dataflow {
  message : string = 'This message is displayed from child component'
  handleClick(){
    alert("Component Communication")
  }
  marks:number[]= [90,89,99,80]
  
  ProductItem :{
    productId :number,
    email:string,
    productName:string
  } = {

    productId:101 ,
    email:'priya@gmail.com',
    productName:'Watch'
  }
  info :string=''
  handleInfo(event:any){
    this.info=event

    alert("Done")
  }
}