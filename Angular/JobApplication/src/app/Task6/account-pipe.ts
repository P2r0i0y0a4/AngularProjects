import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'account',
})
export class AccountPipe implements PipeTransform {
  transform(value: string): string{
    if(!value){
      return '';
    }
    let visibleDigits = value.slice(-4)
    return '**** **** **** '+visibleDigits
  }
}
