import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { confirmPassword, passwordStrength } from '../../utils/passCheck'; // Adjust path if needed

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.css',
})
export class RegistrationForm {
  
  form = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, passwordStrength()]),
      ConfirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: [confirmPassword],
    },
  );

  // // Helper for Checkboxes (FormArray)
  // onCheckChange(event: any) {
  //   const subjects: FormArray = this.form.get('subjects') as FormArray;
  //   if (event.target.checked) {
  //     subjects.push(new FormControl(event.target.value));
  //   } else {
  //     const index = subjects.controls.findIndex(x => x.value === event.target.value);
  //     subjects.removeAt(index);
  //   }
  // }

 

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form);

      console.log(this.form.value);
    }
    else {
      // This forces the error messages to show if the user clicks Register too early
      this.form.markAllAsTouched();
    }
  }
}
