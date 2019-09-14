import { Component, OnInit, Output, Input, ChangeDetectorRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'plus-minus',
  templateUrl: './plus-minus.component.html',
  styleUrls: ['./plus-minus.component.scss']
})
export class PlusMinusComponent implements OnInit {

  
  @Output() updateValue;
  @Input() inputVal: number;
  @Input() caption: string;
  @Input() stepVal: number;

  minusBtnFlg: boolean = true;

  constructor(private changeDet: ChangeDetectorRef) {
    this.inputVal = 1;
    this.caption = "";
    this.updateValue = new EventEmitter();
  }

  ngOnInit() {
    if (this.inputVal > 1) this.minusBtnFlg = false;
  }

  increment() {
    this.inputVal += this.stepVal;
    this.updateValue.emit(this.inputVal);

    if (this.inputVal == 1) this.minusBtnFlg = true;
    else this.minusBtnFlg = false;

    this.changeDet.detectChanges();
  }

  decrement() {
    if (this.inputVal > 1) this.inputVal -= this.stepVal;

    if (this.inputVal == 1) this.minusBtnFlg = true;
    else this.minusBtnFlg = false;

    this.updateValue.emit(this.inputVal);
    this.changeDet.detectChanges();
  }

}
