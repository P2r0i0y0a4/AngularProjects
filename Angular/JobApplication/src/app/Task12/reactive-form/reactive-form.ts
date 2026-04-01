import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reactive-form',
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-form.html',
  styleUrl: './reactive-form.css',
})
export class ReactiveForm {

   genderData = [
    {label:'Male',value:'male'},
    {label:'Female',value:'female'},
    {label:'others',value:'others'},
  ]
  subjectData=[
    {name:'Java', value:'java'},
    {name:'Angular',value:'angular'},
    {name:'JavaScript',value:'javascript'},
    {name:'Typescript',value:'typescript'}
  ]
   
  form = new FormGroup({

    firstname: new FormControl('',[Validators.required,Validators.minLength(4)]),
    lastname: new FormControl('',[Validators.required,Validators.maxLength(4)]),
    email: new FormControl('',[Validators.required,Validators.email]),
    subject: new FormArray([]),
    gender: new FormControl(''),
    password: new FormControl('')

  })

  get name(){
    return this.form.get('firstname')
  }
  get lname(){
    return this.form.get('lastname')
  }

  get subjects():FormArray{
    return this.form.get('subject') as FormArray
  }
  handleChange(event:Event){
    let target = event.target as HTMLInputElement
    if(target.checked){
      this.subjects.push(new FormControl(target.value))
    }
    else{
      let index=this.subjects.controls.findIndex((ele)=>ele.value == target.value)
      this.subjects.removeAt(index)
    }
  }

  handlesubmit(){
    console.log(this.form.value);
  }
}
