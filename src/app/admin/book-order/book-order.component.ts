import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-order',
  templateUrl: './book-order.component.html',
  styleUrls: ['./book-order.component.scss']
})
export class BookOrderComponent implements OnInit {

  constructor(
    private _router: Router,
  ) { }

  ngOnInit() {
  }


}
