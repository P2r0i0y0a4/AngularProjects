import { Component } from '@angular/core';
import { HeaderComponent } from "../header-component/header-component";
import { AccountSummaryComponent } from "../account-summary-component/account-summary-component";
import { TransactionComponent } from "../transaction-component/transaction-component";
import { QuickActionComponent } from "../quick-action-component/quick-action-component";
import { FooterComponent } from "../footer-component/footer-component";

@Component({
  selector: 'app-main-component',
  imports: [HeaderComponent, AccountSummaryComponent, TransactionComponent, QuickActionComponent, FooterComponent],
  templateUrl: './main-component.html',
  styleUrl: './main-component.css',
})
export class MainComponent {}
