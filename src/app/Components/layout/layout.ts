import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { Main } from "../main/main";

@Component({
  selector: 'app-layout',
  imports: [Sidebar, Main],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

}
