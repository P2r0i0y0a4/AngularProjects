import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  signup(user:any){
    localStorage.setItem('user',JSON.stringify(user));
    
  }

  login(email:string,password:string):boolean{
    const storedData = JSON.parse(localStorage.getItem('user') || '{}')
    if(email == storedData.email && password == storedData.password){
      return true
    }
    else{
      return false
    }
  }
}
