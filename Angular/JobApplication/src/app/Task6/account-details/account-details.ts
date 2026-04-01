import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AccountPipe } from '../account-pipe';

@Component({
  selector: 'app-account-details',
  imports: [CommonModule, AccountPipe],
  templateUrl: './account-details.html',
  styleUrl: './account-details.css',
})
export class AccountDetails {
  account = {
    name : 'Alex',
    accountNumber : '298748973589232',
    balance : 600000,
    lastTransactionDate : new Date()
  }
}
