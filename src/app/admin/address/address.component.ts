import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { UserDetails, Utils, Places, Globals } from 'src/app/utils/utils';

import { ErrorStateMatcher, MatDialogRef } from '@angular/material';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { StorageService } from 'src/app/utils/storage.service';
import { ValidationService } from 'src/app/utils/validation.service';
import { CommonsService } from 'src/app/services/commons.service';
import { MatDialogComponent } from 'src/app/others/mat-dialog/mat-dialog.component';

@Component({
  selector: 'address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  typeGroup: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;

  userDetails: UserDetails;
  othersFlag: boolean = true;
  areaName: string;

  matcher = new MyErrorStateMatcher();
  userArea: string;
  firebase: FireBase;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  places: Places[] = Globals.Places;

  constructor(private router: Router, private fb: FormBuilder,
    private db: AngularFireDatabase,
    private _storage: StorageService,
    private _router: Router,
    public dialogRef: MatDialogRef<MatDialogComponent>,
    private _commons: CommonsService
  ) {
    this.userDetails = new UserDetails();
    this.firebase = new FireBase(this.db);
  }

  ngOnInit() {
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', [Validators.required, ValidationService.checkLimit(5000000000, 9999999999)]]
    });

    this.thirdFormGroup = this.fb.group({
      emailCtrl: ['', [Validators.required, ValidationService.emailValidatorFn()]]
    });

    this.fourthFormGroup = this.fb.group({
      addressCtrl: ['', Validators.minLength(40)]
    });

    this.typeGroup = this.fb.group({
      hideRequired: true,
      floatLabel: 'home',
    });

    this.fifthFormGroup = this.fb.group({
      // selectCtrl: ['', Validators.required],
      selectCtrl: ['', Validators.minLength(1)]
    });

    this.firstFormGroup = this.fb.group({
      name: ['', Validators.minLength(3)],
      mobile: ['', Validators.minLength(10)],
      floor: ['', Validators.minLength(1)],
      block: ['', Validators.minLength(1)],
      building: ['', Validators.minLength(3)],
      street: ['', Validators.minLength(3)],
      landmark: ['', Validators.minLength(3)],
    });
  }

  onAreaSelect(val) {
    if (val == "Other")
      this.othersFlag = false;
    else
      this.othersFlag = true;
  }

  onSearchChange(val) {
    this.areaName = val;
  }

  onSaveBtnClick(evt) {
    // console.log("SDfds : " + this.firstFormGroup.invalid);
    // this.firebase.writeUserAddress();
    let vals = this.firstFormGroup.value;
    let emailVal = this.thirdFormGroup.value.emailCtrl;
    let typeLabel = this.typeGroup.value.floatLabel;
    let areaLabel = this.fifthFormGroup.value.selectCtrl;

    this.firebase.adminWriteUserAddress({
      "id": vals.mobile,
      "email": emailVal,
      "name": vals.name,
      "address": {
        block: vals.block,
        floor: vals.floor,
        building: vals.building,
        street: vals.street,
        type: typeLabel
      },
      "area": areaLabel,
      "active": "no "
    }, (result) => {
      this._commons.openSnackBar(result, "");
    });
    this.closeDialog();
  }

  closeDialog() {
    console.log("Close dialog");
    // this.dialogRef.close();
    // this._router.navigate([{ outlets: { homeOutlet: null } }]);
    this._router.navigate(["admin/customer_list"]);
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

