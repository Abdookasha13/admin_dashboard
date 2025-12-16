import { Component, signal } from '@angular/core';
import { Login } from "./Components/login/login";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('admin_dashboard');
}
