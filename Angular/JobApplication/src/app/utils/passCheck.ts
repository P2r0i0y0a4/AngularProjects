// import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// export function confirmPassword(controls: AbstractControl): ValidationErrors | null {
//   // We use control.get() to find the specific fields within the group
//   let password = controls.get('password')?.value;
//   let confirmPassword = controls.get('ConfirmPassword')?.value;

//   // If the fields haven't been loaded yet, return null
//     if (!password || !confirmPassword) {
//       return null;
//     }

//     // If values don't match, return an error object: { passCheck: true }
//     // Otherwise, return null (meaning the form is valid)
//     return password.value === confirmPassword.value ? null : { passCheck: true };

// //   if (!password || !confirmPassword) {
// //     return { passCheck: true };
// //   }
// //   return null;
// }

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// --- FIXED PASSWORD MATCH VALIDATOR ---
export function confirmPassword(controls: AbstractControl): ValidationErrors | null {
  // Get the values directly
  const password = controls.get('password')?.value;
  const confirmPassword = controls.get('ConfirmPassword')?.value;

  // If either field is empty, don't show the error yet (let Validators.required handle it)
  if (!password || !confirmPassword) {
    return null;
  }

  // FIXED: Compare the variables directly, DO NOT use .value again here
  return password === confirmPassword ? null : { passCheck: true };
}

// --- NEW PASSWORD STRENGTH VALIDATOR ---
export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    // Logic: Requires 1 Uppercase, 1 Lowercase, and 1 Number
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

    return !passwordValid ? { passwordStrength: true } : null;
  };
}
