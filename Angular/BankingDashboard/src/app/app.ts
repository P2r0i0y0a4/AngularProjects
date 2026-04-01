import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header-component/header-component";
import { FooterComponent } from "./footer-component/footer-component";
import { AccountSummaryComponent } from "./account-summary-component/account-summary-component";
import { TransactionComponent } from "./transaction-component/transaction-component";
import { QuickActionComponent } from "./quick-action-component/quick-action-component";
import { MainComponent } from "./main-component/main-component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AccountSummaryComponent, TransactionComponent, QuickActionComponent, MainComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('BankingDashboard');
}
