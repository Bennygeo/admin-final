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


  addrData: any = [
    {
      "apartment": "Prestige Bella Vista",
      "name": "Shweta Rai",
      "mobile": "9840867255",
      "address": "1A Tower, 15th Floor, 1172",
      "notes": "Renew?",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Anantharam",
      "mobile": "9791036931",
      "address": "1B Tower, 11th Floor, 1125",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Mohammed",
      "mobile": "9952161126",
      "address": "1B Tower, 13th Floor, 1158",
      "notes": "Water nut",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Abirami",
      "mobile": "7358638220",
      "address": "2A Tower, 2nd Floor, 2032",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Sandeep Reddy",
      "mobile": "9110576979",
      "address": "2A Tower, 2nd Floor,  2031",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Susheela",
      "mobile": "9820900461",
      "address": "2A Tower, 10th Floor,  2111",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Mrs. Deepa Sridhar",
      "mobile": "9384050505",
      "address": "2A Tower, 11th Floor, 2122",
      "notes": "Between 7 n 8, Sweet n hard nut  HOLE & OPEN",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Usharani Anbazhagan",
      "mobile": "7358732153",
      "address": "2A Tower, 14th Floor, 2153",
      "notes": "Small nuts",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Nishanth",
      "mobile": "9942991117",
      "address": "2B Tower, 8th Floor, 2096",
      "notes": "Hole n Open Prev Balance 350",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Raj",
      "mobile": "9677844318",
      "address": "3A Tower, 1st Floor, 3024",
      "notes": "4 straws",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Supra",
      "mobile": "9442628610",
      "address": "3B Tower, 1st Floor, 3025",
      "notes": "Orange Nut",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Suyamprakash",
      "mobile": "9444964126",
      "address": "3B, 1st Floor, 3028",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Lakshmi Priya",
      "mobile": "9003718110",
      "address": "3B Tower, 8th Floor, 3096",
      "notes": "Place on the door(Don't ring)Sweet Water! ",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Muhua",
      "mobile": "6383243977",
      "address": "4A Tower, Ground Floor, 4011",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Vaishnavi",
      "mobile": "9600030869",
      "address": "4A, 7th Floor, 4082",
      "notes": "Renew?",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Jawahar",
      "mobile": "9560039770",
      "address": "4A Tower, 10th Floor, 4114",
      "notes": "Renew?",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Jayanthi",
      "mobile": "9962040261",
      "address": "4B Tower, 1st Floor, 4025",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Rajesh",
      "mobile": "9003093888",
      "address": "4B Tower, 4095",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Vidya",
      "mobile": "9553656665",
      "address": "4B Tower, 10th Floor, 4115",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Abhinav",
      "mobile": "9962586954",
      "address": "4B, 13th Floor, 4158",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Farishtha -- OLD",
      "mobile": "9940094684",
      "address": "5 Tower, 5th Floor, 5063",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Vani",
      "mobile": "9561489568",
      "address": "5 Tower, 13th Floor, 5153",
      "notes": "Hole n Open",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Anushka",
      "mobile": "6382009070",
      "address": "6 Tower, 1st Floor, 6024",
      "notes": "PayTm? Renew?",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Mansi",
      "mobile": "9962044488",
      "address": "6 Tower, 11th Floor, 6123",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Josephine",
      "mobile": "8220727777",
      "address": "6 Tower, 15th Floor, 6161",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Farishtha",
      "mobile": "9940094684",
      "address": "7 Tower, 1st Floor, 7024",
      "notes": "Take big opener",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Mullai",
      "mobile": "9677167931",
      "address": "7 Tower, 3rd Floor, 7044",
      "notes": "Customer Test",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Bopanna MB",
      "mobile": "9444903131",
      "address": "7 Tower, 5th Floor, 7064",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Sivaprakash",
      "mobile": "9942795240",
      "address": "7 Tower, 10th Floor, 7111",
      "notes": "One Straw!",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Mayank Agarwal",
      "mobile": "9003326614",
      "address": "7 Tower, 15th Floor, 7172",
      "notes": "Medium hard Nuts",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Muthu",
      "mobile": "9894579240",
      "address": "8 Tower, 9th Floor, 8103",
      "notes": "Renew?",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Parthasarathy AR",
      "mobile": "9884710106",
      "address": "9A Tower, 2nd Floor, 9033",
      "notes": "2 straws per day!",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Durga Sridaran",
      "mobile": "9841312817",
      "address": "9A Tower, 4th Floor, 9053",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Rajakumar",
      "mobile": "9884096982",
      "address": "9A Tower, 9th Floor, 9101",
      "notes": "Hole n Open",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Indumathi",
      "mobile": "9344227431",
      "address": "9A Tower, 10th Floor, 9114",
      "notes": "Orange TC!",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Madhusudhan",
      "mobile": "9904183353",
      "address": "9A Tower, 10th Floor, 9111",
      "notes": "Easy to open nuts",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Vidhya",
      "mobile": "8637419276",
      "address": "9A Tower, 15th Floor, 9173",
      "notes": "Orange Nuts",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Latha",
      "mobile": "9962512979",
      "address": "9B Tower, 5nd Floor, 9068",
      "notes": "Either before 7:15 or after 7:45 -- Renew?",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Llavanya",
      "mobile": "9884720595",
      "address": "9B Tower, 8th Floor, 9097",
      "notes": "Big Nuts Before 7:15",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Jaishankar",
      "mobile": "9176698859",
      "address": "9B Tower, 8th Floor, 9097",
      "notes": "Small Nuts (pack of 3) -- renew?",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Ramkumar",
      "mobile": "8056122425",
      "address": "9B Tower, 14th Floor, 9166",
      "notes": "Orange Nuts - old balance 150",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Srilatha",
      "mobile": "7032123870",
      "address": "9B Tower, 14th Floor, 9168",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Nandini",
      "mobile": "9791967924",
      "address": "9C Tower, 11th Floor, 91211",
      "notes": "Sweet Water",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Geetha Arun",
      "mobile": "9611122207",
      "address": "9C Tower, 12th Floor,  91411",
      "notes": "Give 2 good orange nuts!",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Jai",
      "mobile": "8447730540",
      "address": "10 Tower, 15th Floor, 10171",
      "notes": "Renew? PayTm?",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Tarika",
      "mobile": "9663133055",
      "address": "10 Tower, 15th Floor, 10174",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Ayushi",
      "mobile": "7003170933",
      "address": "10 Tower, 16th Floor, 10184",
      "notes": "Hole - Only water nuts! -- Renew?",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Banu",
      "mobile": "9790975202",
      "address": "11 Tower, 1st Floor, 11022",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Sundararajan",
      "mobile": "9940022849",
      "address": "11 Tower, 2nd Floor, 11031",
      "notes": "Before 7:30, Hole n Open",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Nellaiappan",
      "mobile": "9841040939",
      "address": "11 Tower, 5th Floor, 11064",
      "notes": "Green Nuts open oldbalance 35",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Kumaran",
      "mobile": "",
      "address": "11 Tower, 5th Floor, 11061",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Neha",
      "mobile": "7397294845",
      "address": "11 Tower, 16th Floor, 11182",
      "notes": "Renew?",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Prithi",
      "mobile": "8939332480",
      "address": "12 Tower, 1st Floor, 120210",
      "notes": "Please collect cash!",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Ahmed",
      "mobile": "9789479999",
      "address": "12, 8th Floor, 12092",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Sudeep Agarwal",
      "mobile": "7835052434",
      "address": "12 Tower, 9th Floor,  121011",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Unknown (Get name)",
      "mobile": "7550134803",
      "address": "13 Tower, 5th Floor, 13061",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Divya",
      "mobile": "9884863536",
      "address": "13 Tower, 7th Floor, 13081",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Sudha",
      "mobile": "9600169950",
      "address": "13 Tower, 8th Floor, 130910",
      "notes": "New Customer (Light coconut meat) hole and Open (Previous balance 150)",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Thilakavathi",
      "mobile": "",
      "address": "13 Tower, 11th Floor, 131211",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Gayathri Selvarasan",
      "mobile": "9791811211",
      "address": "13 Tower, 11th Floor, 131211",
      "notes": "Soft Nuts -- Renew?",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Sravani",
      "mobile": "9818115742",
      "address": "13 Tower, 16th Floor, 13188",
      "notes": "Give younger nut or closely cut harder nuts!",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Poojith",
      "mobile": "9493222309",
      "address": "14, 12th Floor, 14145",
      "notes": "Green Nuts --- Renew?",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Subin",
      "mobile": "9940070573",
      "address": "14 Tower, 16th Floor, 141812",
      "notes": "Green Nuts",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Jothi",
      "mobile": "9940155880",
      "address": "15A Tower, 8th Floor, 15091",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Sathya Narayanan",
      "mobile": "9099036252",
      "address": "15A Tower, 15th Floor, 15171",
      "notes": "Give the youngest nut WITHOUT MEAT",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Nandhakumar",
      "mobile": "9840465975",
      "address": "15B Tower, 1st Floor, 15028",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Preetha",
      "mobile": "8056272443",
      "address": "15B, 9th Floor, 15108",
      "notes": "Orange Nuts",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Abarna",
      "mobile": "9944134447",
      "address": "15B Tower, 9th Floor, 15105",
      "notes": "Green Nuts -- Renew?",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Uma Maheshwari Sriram",
      "mobile": "9943167878",
      "address": "15B Tower, 13th Floor, 15155",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Kartik",
      "mobile": "9500128060",
      "address": "15B Tower, 14th Floor, 15168",
      "notes": "1. Easy to open nuts 2. water with coconut meat 3. Big nuts 4. Don't ring",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Pavithra Palanisamy",
      "mobile": "9840717270",
      "address": "16A Tower, 3rd Floor, 16043",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Prabaharan",
      "mobile": "9902001476",
      "address": "16A Tower, 7th Floor, 16081",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Sivapriya",
      "mobile": "9944095349",
      "address": "16A Tower, 13th Floor, 16152",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Subramanian",
      "mobile": "9840668986",
      "address": "16A Tower, 15th Floor, 16172",
      "notes": "Sweet Water",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Sangeetha balasubramani",
      "mobile": "8925623047",
      "address": "16B Tower, 15th Floor, 16168",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Ravi Kumar",
      "mobile": "9629276508",
      "address": "17A Tower, ground Floor, 17013",
      "notes": "By 7 am please! Hole n open",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Mamtha",
      "mobile": "8667275651",
      "address": "17B Tower, 0th Floor, 17015",
      "notes": "Hole & Open",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Nithya",
      "mobile": "9446565205",
      "address": "17B Tower, 4th Floor, 17058",
      "notes": "Medium hard n sweet nuts",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Mohana",
      "mobile": "6379083549",
      "address": "17B Tower, 4th Floor, 17056",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Hina",
      "mobile": "7760749664",
      "address": "17B Tower, 12th Floor, 17146",
      "notes": "Place on the door(Don't ring)",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Ramya Krishnan",
      "mobile": "9176631115",
      "address": "17B Tower, 14th Floor, 17167",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Dr. Mathun Ram",
      "mobile": "9952476633",
      "address": "18A Tower, 2nd Floor, 18032",
      "notes": "By 8-8:30, Pro customer TC",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Sri Sai Varun",
      "mobile": "9600954694",
      "address": "18A Tower, 4th Floor, 18053",
      "notes": "Easy to open nuts",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Sembian",
      "mobile": "9987557967",
      "address": "18A Tower, 4th Floor, 18052",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Kushboo Singhal",
      "mobile": "9940522607",
      "address": "18A Tower, 16th Floor, 18182",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Vikas Radhakrishnan",
      "mobile": "9962554258",
      "address": "18B Tower, 15th Floor, 18176",
      "notes": "2 Straws per day!",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Usha",
      "mobile": "9940078076",
      "address": "18C Tower, 2nd Floor, 18039",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Geetha",
      "mobile": "9884178948",
      "address": "18C Tower, 14th Floor, 18169",
      "notes": "Hole n Open",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Raghuram",
      "mobile": "9840061616",
      "address": "18C Tower, 16th Floor, 18189",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Lucky",
      "mobile": "9943071448",
      "address": "19 Tower, 3rd Floor, 19043",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Kripa",
      "mobile": "8106449004",
      "address": "19 Tower, 4th Floor, 19052",
      "notes": "Easy to open nuts",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Lavanya",
      "mobile": "9940673535",
      "address": "19 Tower, 4th Floor, 19054",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Raju",
      "mobile": "8500856789",
      "address": "19 Tower, 5th Floor, 19062",
      "notes": "Before 6:45",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Thilakavathi",
      "mobile": "9965535611",
      "address": "19 Tower, 10th Floor, 19111",
      "notes": "Orange Nuts",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Lalitha Jayashankar",
      "mobile": "9444083391",
      "address": "19 Tower, 10th Floor, 19112",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Mrs. Ramesh",
      "mobile": "9080145466",
      "address": "19 Tower, 13th Floor, 19151",
      "notes": "Small Nuts (pack of 3)",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Velumani",
      "mobile": "8870014113",
      "address": "19th Tower, 15th Floor, 19172",
      "notes": "Don't cut bottom",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Sriram",
      "mobile": "8637658347",
      "address": "20A Tower, 2nd Floor, 20031",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Rajeshwari Karthikeyan",
      "mobile": "7010632124",
      "address": "20B Tower, 9th Floor, 20105",
      "notes": "Tasty water",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Padma",
      "mobile": "9080331363",
      "address": "20B Tower, 9th Floor,  20108",
      "notes": "Small Nuts (pack of 3)",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Gautham",
      "mobile": "9677370302",
      "address": "20B Tower, 13th Floor, 20156",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Vidya Swaminathan",
      "mobile": "9884094456",
      "address": "20B Tower, 13th Floor, 20158",
      "notes": "3 Straws",
      "area": "Porur"
    },
    {
      "apartment": "Prestige Bella Vista",
      "name": "Angeline Mahiba",
      "mobile": "7598625380",
      "address": "20C Tower, 4th Floor, 200512",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "VGN-Avenue",
      "name": "Krishnadas EP",
      "mobile": "9092644987",
      "address": "46, Seneerkuppam, Near Anjaneyar Temple",
      "notes": "Same time!",
      "area": "Nolambur"
    },
    {
      "apartment": "Ocean Chlorophyll",
      "name": "Ram",
      "mobile": "9686748030",
      "address": "Tower 6, 3rd Floor, 6031",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Ocean Chlorophyll",
      "name": "Mansi Mishra",
      "mobile": "9176699653",
      "address": "Tower 6, 12th Floor, 6127",
      "notes": "Give good nuts",
      "area": "Porur"
    },
    {
      "apartment": "Ocean Chlorophyll",
      "name": "Karpagam",
      "mobile": "9790859631",
      "address": "Tower 7, 6th Floor, 7061",
      "notes": "Hole n Open",
      "area": "Porur"
    },
    {
      "apartment": "Ocean Chlorophyll",
      "name": "Mathuravalli",
      "mobile": "8056039789",
      "address": "Tower 7, 9th Floor, 7096",
      "notes": "Hole n Open",
      "area": "Porur"
    },
    {
      "apartment": "Ocean Chlorophyll",
      "name": "Lekha",
      "mobile": "9176210191",
      "address": "Tower 9, 7th Floor, 9073",
      "notes": "After 8",
      "area": "Porur"
    },
    {
      "apartment": "Ocean Chlorophyll",
      "name": "Latha",
      "mobile": "8939911332",
      "address": "Tower 9, 7th Floor, 9077",
      "notes": "Give good nuts",
      "area": "Porur"
    },
    {
      "apartment": "Ocean Chlorophyll",
      "name": "Dharmesh",
      "mobile": "9840858246",
      "address": "Tower 9, 7th Floor, 9076",
      "notes": "Give water nuts",
      "area": "Porur"
    },
    {
      "apartment": "XS Real - La Celeste",
      "name": "Sheetal",
      "mobile": "9884038807",
      "address": "P1-D2D",
      "notes": "Customer Test - Good nuts daily - Renew?",
      "area": "Mugalivakkam"
    },
    {
      "apartment": "XS Real - La Celeste",
      "name": "Nikita Beniwal",
      "mobile": "9789714406",
      "address": "P5-B4A",
      "notes": "",
      "area": "Mugalivakkam"
    },
    {
      "apartment": "XS Real - La Celeste",
      "name": "Sourav",
      "mobile": "9940273868",
      "address": "P1-A3B",
      "notes": "",
      "area": "Mugalivakkam"
    },
    {
      "apartment": "co",
      "name": "Shadik",
      "mobile": "9840045151",
      "address": "36/45, Valluvar Salai, Arumbakkam",
      "notes": "Give balance 355",
      "area": "unknown"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "A.V. Nethaji Mudaliar",
      "mobile": "9442020000",
      "address": "2-3-1 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "Get sign in the paper!",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Anandhi",
      "mobile": "9940613716",
      "address": "2-10-1 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "D. Sekhar",
      "mobile": "9444450381",
      "address": "2-0-3 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Sounder",
      "mobile": "9841394444",
      "address": "2-3-3 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Kishore",
      "mobile": "6369155117",
      "address": "5-14-4 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Jaswanth",
      "mobile": "9789823836",
      "address": "3-7-1 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "A mishra",
      "mobile": "9769000100",
      "address": "3-14-4 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "Small Nuts (pack of 3)",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Hema",
      "mobile": "9176358467",
      "address": "5-7-1 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "Small Nuts (pack of 3)",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Subramaniyam",
      "mobile": "9003667604",
      "address": "2-1-3 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Latha Sabarish",
      "mobile": "9884300102",
      "address": "2-3-2 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Navarasam",
      "mobile": "6379511021",
      "address": "5-7-3 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "Tender Nuts",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Raja",
      "mobile": "9487416987",
      "address": "1-0-2 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Thirumaran",
      "mobile": "9381250010",
      "address": "1-9-4 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Parag",
      "mobile": "9790766851",
      "address": "1-10-4 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "Customer testing, give good nuts",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Himanshu",
      "mobile": "9312989976",
      "address": "3-7-4 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "Send bigger nuts! Prev balance 400",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Subramanian",
      "mobile": "9840281675",
      "address": "3-2-4 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "",
      "area": "koyambedu"
    },
    {
      "apartment": "Arihant magestic Towers",
      "name": "Eshwari",
      "mobile": "9445545867",
      "address": "3-7-2 Arihant magestic Towers,110, Jawaharlal Nehru Road, Koyembedu",
      "notes": "",
      "area": "koyambedu"
    },
    {
      "apartment": "Anna Nagar",
      "name": "Mridula",
      "mobile": "9176630061",
      "address": "3088, 22nd Blk, 3rd Floor, Gate2,Jeevan Bhima Nagar",
      "notes": "Collect Payment, Renew?",
      "area": "Anna Nagar"
    },
    {
      "apartment": "Anna Nagar",
      "name": "Jayasurrya",
      "mobile": "9176648899",
      "address": "213, 51st Street, TVS Colony,Annanagar West Extn,Near Hatson",
      "notes": "",
      "area": "Anna Nagar"
    },
    {
      "apartment": "Anna Nagar",
      "name": "Vandana",
      "mobile": "9884423766",
      "address": "21/82, Gate2,Jeevan Bhima Nagar",
      "notes": "",
      "area": "Anna Nagar"
    },
    {
      "apartment": "Manapakkam",
      "name": "Bharath Ram",
      "mobile": "9176646323",
      "address": "4/2, Sriram Gardens, Indira Nagar, Near indira nagar bus stop",
      "notes": "Location sent -- SMALL NUT PACK",
      "area": "Manapakkam"
    },
    {
      "apartment": "Anna Nagar",
      "name": "Karthik",
      "mobile": "9176302157",
      "address": "1193, 49th Blk, 1st Floor, Gate5,Jeevan Bhima Nagar",
      "notes": "have to deliver remaining 6",
      "area": "Anna Nagar"
    },
    {
      "apartment": "Anna Nagar",
      "name": "Prakalya",
      "mobile": "9941729725",
      "address": "1190, 48th Blk, LIC quarters, Jeevan Bhima nagar",
      "notes": "2 Straws per day!",
      "area": "Anna Nagar"
    },
    {
      "apartment": "Arumbakkam",
      "name": "Kevin John Mathew",
      "mobile": "8637684554",
      "address": "B6-Achala Vihar Ai-116, 2nd Street, 8th Main road",
      "notes": "",
      "area": "Arumbakkam"
    },
    {
      "apartment": "Swara Appartment",
      "name": "Alex Antony",
      "mobile": "9751091812",
      "address": "B208, 1st St, Moovendhar Nagar,Balaji nagar Extn, Pillayar Madathangal, Kattupakkam",
      "notes": "",
      "area": "Kattupakkam"
    },
    {
      "apartment": "Swara Appartment",
      "name": "Arun",
      "mobile": "9884415224",
      "address": "C305, 1st St, Moovendhar Nagar,Balaji nagar Extn, Pillayar Madathangal, Kattupakkam",
      "notes": "Renew?",
      "area": "Kattupakkam"
    },
    {
      "apartment": "Swara Appartment",
      "name": "Sakthi",
      "mobile": "9894700013",
      "address": "A301, 1st St, Moovendhar Nagar,Balaji nagar Extn, Pillayar Madathangal, Kattupakkam",
      "notes": "",
      "area": "Kattupakkam"
    },
    {
      "apartment": "Abinaya Appartment",
      "name": "Raji",
      "mobile": "9884874808",
      "address": "F2, 1st Main Rd, Vijayalakshmi Nagar, Kattupakkam",
      "notes": "",
      "area": "Kattupakkam"
    },
    {
      "apartment": "Mithilam",
      "name": "Charles Wesley",
      "mobile": "9715777707",
      "address": "4A, 8",
      "notes": "Give good nuts",
      "area": "Nolambur"
    },
    {
      "apartment": "Mithilam",
      "name": "Vinesh",
      "mobile": "9836300997",
      "address": "8A, 2",
      "notes": "",
      "area": "Nolambur"
    },
    {
      "apartment": "Ceebros Gardens",
      "name": "Nishitha",
      "mobile": "9025397118",
      "address": "2B, Orchid, 38, Arcot Road, Virugambakkam",
      "notes": "Young easy to open nuts  Call don't ring bell",
      "area": "Virugambakkam"
    },
    {
      "apartment": "Appaswamy Cerus",
      "name": "Punitha",
      "mobile": "9779551747",
      "address": "2051, Blk2, 134, Arcot Rd, Virugambakkam",
      "notes": "",
      "area": "Virugambakkam"
    },
    {
      "apartment": "Appaswamy Cerus",
      "name": "Anusha",
      "mobile": "9884809685",
      "address": "1143, Blk1, 134, Arcot Rd, Virugambakkam",
      "notes": "Small Nuts (pack of 3)",
      "area": "Virugambakkam"
    },
    {
      "apartment": "Appaswamy Cerus",
      "name": "Bhanu Prakash",
      "mobile": "9840022348",
      "address": "3043, Blk3, 134, Arcot Rd, Virugambakkam",
      "notes": "",
      "area": "Virugambakkam"
    },
    {
      "apartment": "Appaswamy Cerus",
      "name": "Pauline",
      "mobile": "9952925659",
      "address": "3032, Blk3, 134, Arcot Rd, Virugambakkam",
      "notes": "",
      "area": "Virugambakkam"
    },
    {
      "apartment": "DABC Gokulam Phase 2",
      "name": "Prabhu R",
      "mobile": "7358718459",
      "address": "7, Block 2B",
      "notes": "Small Nuts (Pack of 3)",
      "area": "Nolambur"
    },
    {
      "apartment": "DABC Gokulam Phase 2",
      "name": "Rufina",
      "mobile": "9500755568",
      "address": "12, Block 2B",
      "notes": "Collect 350",
      "area": "Nolambur"
    },
    {
      "apartment": "DABC Abinayam Phase 3",
      "name": "Mohit",
      "mobile": "8610661643",
      "address": "A1-15",
      "notes": "Small Nuts",
      "area": "Nolambur"
    },
    {
      "apartment": "ETA-Verde",
      "name": "Velu Ammaiyappah",
      "mobile": "9894320000",
      "address": "A-1101, 11th Flr, Building 6,Arcot Road",
      "notes": "4",
      "area": "valasaravakkam"
    },
    {
      "apartment": "Sterling Ganges",
      "name": "Rubini",
      "mobile": "9843643342",
      "address": "H-21",
      "notes": "",
      "area": "unknown"
    },
    {
      "apartment": "Sterling Ganges",
      "name": "Priyank",
      "mobile": "",
      "address": "D-32",
      "notes": "",
      "area": "unknown"
    },
    {
      "apartment": "Muktha Nirman Appartments",
      "name": "Sindhu",
      "mobile": "9710783632",
      "address": "A1F1, (Near Saravana Stores), Lakshmi Nagar",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "SNSS White Petals",
      "name": "Ali Imran",
      "mobile": "9600940644",
      "address": "Block F, 2nd Floor, S1",
      "notes": "",
      "area": "Kattupakkam"
    },
    {
      "apartment": "SNSS White Petals",
      "name": "Gokulkumar",
      "mobile": "9677063210",
      "address": "Block H, 2nd Floor, S1",
      "notes": "3",
      "area": "Kattupakkam"
    },
    {
      "apartment": "Moulivakkam",
      "name": "Vivek T",
      "mobile": "9976529264",
      "address": "46, Rajarajan Street, Baikadai, Moulivakkam",
      "notes": "1 Straw each day!",
      "area": "Moulivakkam"
    },
    {
      "apartment": "Moulivakkam",
      "name": "Shalini",
      "mobile": "9945740796",
      "address": "Plot No 7B & 8A, 2/162B, S1, B-Block, Sri Sakthi Homes, Mouleeshwarar Nagar",
      "notes": "",
      "area": "Moulivakkam"
    },
    {
      "apartment": "Mugalivakkam",
      "name": "Poornima Nair",
      "mobile": "7738784403",
      "address": "F4, a block, Sri Krishna palace, Krishnanagar extension 4, Madanadapuram (near Madanadapuram Mugalivakkam road)",
      "notes": "",
      "area": "Mugalivakkam"
    },
    {
      "apartment": "Location sent",
      "name": "Ravi Sundar",
      "mobile": "7824800562",
      "address": "",
      "notes": "",
      "area": "unknown"
    },
    {
      "apartment": "Chester Fields",
      "name": "Mrs. Saran",
      "mobile": "9281057176",
      "address": "A6",
      "notes": "",
      "area": "unknown"
    },
    {
      "apartment": "Location sent",
      "name": "Sushil",
      "mobile": "9176294460",
      "address": "44/13, Gandhi Rd, Alwarthirunagar",
      "notes": "Water nut",
      "area": "Alwarthirunagar"
    },
    {
      "apartment": "Nandambakkam",
      "name": "Ashwin",
      "mobile": "7358329845",
      "address": "KK Enclave, Block 2c, PP Kovil 1st Street,Mettu Colony",
      "notes": "",
      "area": "Nandambakkam"
    },
    {
      "apartment": "Mugalivakkam",
      "name": "Siddhanth Goyal",
      "mobile": "8448098930",
      "address": "No 28, Gowri Nagar, 2nd st",
      "notes": "Location sent",
      "area": "Mugalivakkam"
    },
    {
      "apartment": "Mugalivakkam",
      "name": "Lavanya",
      "mobile": "9566133533",
      "address": "Plot No 5, Dwaraka Appartment, B Block, F4, Ashram Avenue",
      "notes": "",
      "area": "Mugalivakkam"
    },
    {
      "apartment": "Mugalivakkam",
      "name": "Jeevan",
      "mobile": "9442424761",
      "address": "Plot No 8, Spacio Gourou Grandeza, B Block, Flat No B3, 1st Floor, Karthik Balaji Nagar Extn., Near Ashram Avenue",
      "notes": "",
      "area": "Mugalivakkam"
    },
    {
      "apartment": "Mugalivakkam",
      "name": "Ashok Rao",
      "mobile": "8754470650",
      "address": "No 22, Ashram Avenue,",
      "notes": "Location sent",
      "area": "Mugalivakkam"
    },
    {
      "apartment": "Mugalivakkam",
      "name": "Moni",
      "mobile": "9551073464",
      "address": "No 37 (Gokulam), Ashram Avenue - Phase1",
      "notes": "Orange Nuts",
      "area": "unknown"
    },
    {
      "apartment": "Mugalivakkam",
      "name": "Atchith",
      "mobile": "9884598645",
      "address": "F4, Plot No 20.21, Kumudham Nagar 2nd street, Mugalivakkam",
      "notes": "",
      "area": "Mugalivakkam"
    },
    {
      "apartment": "Location sent",
      "name": "Nivetha Sri",
      "mobile": "9791569899",
      "address": "60, Sri Krishna Nagar, Alapakkam",
      "notes": "1 straw per day (2)",
      "area": "Alapakkam"
    },
    {
      "apartment": "Location sent",
      "name": "Jagadeeshwari",
      "mobile": "7358554811",
      "address": "74, Sri Krishna Nagar, Alapakkam(Opposite house of Nivetha sri)",
      "notes": "",
      "area": "Alapakkam"
    },
    {
      "apartment": "Porur",
      "name": "Ragul",
      "mobile": "9791169800",
      "address": "23, Ranganathan Nagar, Kanniyappan Salai, Porur",
      "notes": "Give good nuts",
      "area": "Porur"
    },
    {
      "apartment": "Porur",
      "name": "Gautham",
      "mobile": "9786907259",
      "address": "2nd Cross Street, Devi Nagar, Porur",
      "notes": "1 straw",
      "area": "Porur"
    },
    {
      "apartment": "Siddharth Upscale",
      "name": "Vaasil",
      "mobile": "9003121721",
      "address": "D307",
      "notes": "Reference Info?",
      "area": "unknown"
    },
    {
      "apartment": "Ashok Nandavanam",
      "name": "Vijay Kumar",
      "mobile": "8838666576",
      "address": "2nd Main road, Goparasa Nallur",
      "notes": "Location sent",
      "area": "unknown"
    },
    {
      "apartment": "Sreshta Riverside",
      "name": "Gayathri",
      "mobile": "9047199755",
      "address": "3/2, Wood Creek Road, Nandambakkam",
      "notes": "Green Nuts - Google Sreshta Riverside Renew?",
      "area": "Nandambakkam"
    },
    {
      "apartment": "Abhinayam Phase3",
      "name": "Srihari",
      "mobile": "9789481188",
      "address": "D2-13,Sriram Nagar Main Road, Nolambur, Mogappair West, Chennai 95",
      "notes": "2 Straws",
      "area": "Nolambur"
    },
    {
      "apartment": "Grassland Apartment",
      "name": "Arti",
      "mobile": "8939393817",
      "address": "D-12, Block-D, Opposite to Paradise Biriyani, Mugalivakkam",
      "notes": "Renew?",
      "area": "Mugalivakkam"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Nganavathy",
      "mobile": "9710420344",
      "address": "H1,F2",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Vikas Mittal",
      "mobile": "9840886080",
      "address": "A2,S2",
      "notes": "Place on the door(Don't ring) Prev balance 560 + 700+700+100Collect Payment",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Prakash",
      "mobile": "9941873025",
      "address": "J1,S1",
      "notes": "Place on the door(Don't ring)",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Ponnana",
      "mobile": "9841970077",
      "address": "H2,S2",
      "notes": "Don't ring, give a call",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "VK Guptha",
      "mobile": "7904348078",
      "address": "H1,Fth2",
      "notes": "Renew?",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Rahul Saxena",
      "mobile": "9644064147",
      "address": "F2, 1",
      "notes": "Place on the door(Don't ring)",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Unknown",
      "mobile": "9840632826",
      "address": "F2,",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Suresh Meel",
      "mobile": "9884101097",
      "address": "J1, T1",
      "notes": "Renew?",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Manish",
      "mobile": "7014397146",
      "address": "J2,T3",
      "notes": "Don't ring, keep near shoe rack --- Green Nuts -- Renew?",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Jaslin",
      "mobile": "9600635830",
      "address": "H2,S3",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Aswin Raj",
      "mobile": "9597277084",
      "address": "A4,T1",
      "notes": "Renew?",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Srilakshmi",
      "mobile": "9445586868",
      "address": "A4,F2",
      "notes": "Deliver to Apollo Hospital!",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Nitin Nayak",
      "mobile": "7845097977",
      "address": "J1,T2",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Shanthi",
      "mobile": "9566050433",
      "address": "J1, S3",
      "notes": "Renew?",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Sanjeev Sharma",
      "mobile": "9884058887",
      "address": "J1, Fth1",
      "notes": "Renew?",
      "area": "nolambur"
    },
    {
      "apartment": "VGN-Minerva",
      "name": "Gomathi",
      "mobile": "9962090607",
      "address": "F2, F3",
      "notes": "If possible give BIG orange nut or give 2 smaller nuts",
      "area": "nolambur"
    },
    {
      "apartment": "S & P Garden",
      "name": "S. Sankar",
      "mobile": "8072397639",
      "address": "140 B",
      "notes": "Water nut by 6:30",
      "area": "nolambur"
    },
    {
      "apartment": "S & P Garden",
      "name": "Subramaniyan",
      "mobile": "9551309979",
      "address": "173",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Location sent",
      "name": "Sujatha",
      "mobile": "7550049309",
      "address": "72 & 73, VGN Phase 4, VOC st",
      "notes": "By 7:30 - Hole",
      "area": "nolambur"
    },
    {
      "apartment": "TVS Colony, Annanagar west",
      "name": "Vignesh",
      "mobile": "7299920920",
      "address": "1178-A, G2 - 58th St,",
      "notes": "+2 straws",
      "area": "Annanagar"
    },
    {
      "apartment": "Gerugambakkam",
      "name": "Manikandan",
      "mobile": "9841063388",
      "address": "S2, Sri Guru Flats, 2nd Floor, SGR Nagar, Gerugambakkam",
      "notes": "",
      "area": "Gerugambakkam"
    },
    {
      "apartment": "Location sent",
      "name": "Rajasekar",
      "mobile": "9884447144",
      "address": "10, 2nd Floor, Ramamurthy Avenue, 3rd Street, Sakthi Nagar, Porur",
      "notes": "",
      "area": "Porur"
    },
    {
      "apartment": "Location sent",
      "name": "Elavarasan",
      "mobile": "7904665278",
      "address": "F2, 1st Floor, plot 18, 1st Street, Om Sakthi Nagar, Maduravoyal",
      "notes": "",
      "area": "Maduravoyal"
    },
    {
      "apartment": "Location sent",
      "name": "Sulaiman",
      "mobile": "9445058262",
      "address": "",
      "notes": "",
      "area": "unknown"
    },
    {
      "apartment": "Location sent",
      "name": "Srividya",
      "mobile": "9940064916",
      "address": "",
      "notes": "Don't ring",
      "area": "unknown"
    },
    {
      "apartment": "Location sent",
      "name": "Nalini",
      "mobile": "9840930889",
      "address": "Plot.No.172, 15th street, Chowdry Nagar,Valasaravakkam",
      "notes": "",
      "area": "Valasaravakkam"
    },
    {
      "apartment": "Location sent",
      "name": "Diwakar S",
      "mobile": "9841737768",
      "address": "S3, 2nd Floor, 173 & 174,MG Chakrapani Nagar Main Road,Near Bharathi Nagar ParkMaduravoyal",
      "notes": "",
      "area": "Maduravoyal"
    },
    {
      "apartment": "Location sent",
      "name": "Diwakar S - DAD",
      "mobile": "9841737768",
      "address": "33, Abirami Nagar, 4th Street, near SM store, Maduravoyal",
      "notes": "Renew?",
      "area": "Maduravoyal"
    },
    {
      "apartment": "Location sent",
      "name": "Shreedar RM",
      "mobile": "",
      "address": "Plot No 32, F2, 1st Floor, Murali Krishna Nagar Main Road,Alwarthirunagar",
      "notes": "Only Green nuts!",
      "area": "Maduravoyal"
    },
    {
      "apartment": "Location sent",
      "name": "Beaula",
      "mobile": "9176702052",
      "address": "C6, Radha Flats, 33/8,VOC Street, Kaikankuppam road,Valasaravakkam",
      "notes": "Collect Payment",
      "area": "Valasaravakkam"
    },
    {
      "apartment": "KG",
      "name": "Kirubalan",
      "mobile": "9677235792",
      "address": "B-304",
      "notes": "",
      "area": "Mogappair"
    },
    {
      "apartment": "KG",
      "name": "Usha",
      "mobile": "9789429547",
      "address": "G1-905",
      "notes": "",
      "area": "Mogappair"
    },
    {
      "apartment": "KG",
      "name": "Devi",
      "mobile": "9444907563",
      "address": "B-808",
      "notes": "This is a replacement",
      "area": "Mogappair"
    },
    {
      "apartment": "KG",
      "name": "Aravindh Sankar",
      "mobile": "8754463978",
      "address": "C-1411",
      "notes": "",
      "area": "Mogappair"
    },
    {
      "apartment": "KG",
      "name": "Deepa",
      "mobile": "8939251385",
      "address": "D1-705",
      "notes": "Give easy to open nuts!",
      "area": "Mogappair"
    },
    {
      "apartment": "KG",
      "name": "Madhavi",
      "mobile": "8825414936",
      "address": "B-208",
      "notes": "",
      "area": "Mogappair"
    },
    {
      "apartment": "Sky City",
      "name": "Farzana",
      "mobile": "7904926349",
      "address": "Tower 5, 3rd Floor, 303",
      "notes": "",
      "area": "Vanagaram"
    },
    {
      "apartment": "Sky City",
      "name": "Vijay",
      "mobile": "950001005589600095967",
      "address": "Tower 8, 1st Floor, 101",
      "notes": "",
      "area": "Vanagaram"
    },
    {
      "apartment": "Sky City",
      "name": "Rajalakshmi",
      "mobile": "7397393988",
      "address": "Tower 10, 4th Floor, 402",
      "notes": "Inform about price change Before 8:15",
      "area": "Vanagaram"
    },
    {
      "apartment": "Sky City",
      "name": "Rajendra",
      "mobile": "9962393222",
      "address": "Tower 13, 4th Floor, 402",
      "notes": "",
      "area": "Vanagaram"
    },
    {
      "apartment": "Sky City",
      "name": "Soumya",
      "mobile": "7683877683",
      "address": "Tower 3, 3rd Floor, 303",
      "notes": "hole CARD",
      "area": "Vanagaram"
    },
    {
      "apartment": "Sky City",
      "name": "Lakshmanan",
      "mobile": "9444230021",
      "address": "Tower 24, 4th Floor, 403",
      "notes": "",
      "area": "Vanagaram"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Nikitha",
      "mobile": "8072397553",
      "address": "Block 12, 4C",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Nalini",
      "mobile": "9840842538",
      "address": "Block 11, 3A",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Ritu",
      "mobile": "9840067356",
      "address": "Block 15, 4D",
      "notes": "Renew?",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Priya",
      "mobile": "7358561491",
      "address": "Block 15, 2E",
      "notes": "Hole & Open",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Swarna Priya",
      "mobile": "9444907023",
      "address": "Block 14, 1B",
      "notes": "Orange Nuts",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Padma",
      "mobile": "9790888017",
      "address": "Block 15, 2D",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Anand PM",
      "mobile": "9884865804",
      "address": "Block 12,1C",
      "notes": "Give a little harder nut - sweet water",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Vidhya Chandrasekar",
      "mobile": "9940110382",
      "address": "Block 10, 4C",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Preetha",
      "mobile": "9940626795",
      "address": "Block 10, 1B",
      "notes": "Collect Payment -- Renew?",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Aarthy",
      "mobile": "8610663509",
      "address": "Block 1, 3A",
      "notes": "Hole & Open",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Rakhi",
      "mobile": "7358241777",
      "address": "Block 13, 2F",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Deepa",
      "mobile": "9500328306",
      "address": "Block 1, 3H",
      "notes": "Ask for renewal n cash!",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Sarita Rai",
      "mobile": "8667498929",
      "address": "Block 17, 3F",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Aruna Kumari",
      "mobile": "9743638065",
      "address": "Block 1, 4D",
      "notes": "4 straws",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Sunderban",
      "name": "Anuradha",
      "mobile": "8056014755",
      "address": "Block 3, 2F",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Loganathan",
      "mobile": "9444167080",
      "address": "Block 1, FOF",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Rajendran",
      "mobile": "9688909678",
      "address": "Block 7, FOC",
      "notes": "Previous balance 150",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Amruthavalli",
      "mobile": "9940912017",
      "address": "Block 4, 3E or TE",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Tamilselvan",
      "mobile": "9940481579",
      "address": "Block 9, SB",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Mohankumar",
      "mobile": "9840569109",
      "address": "Block 12, FB",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Devi G",
      "mobile": "9940117336",
      "address": "Block 9, TF",
      "notes": "Old balance 100",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Kabita",
      "mobile": "8610218419",
      "address": "Block 8, FOE",
      "notes": "Take big opener",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Meera",
      "mobile": "9442932175",
      "address": "Block 8, SC",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Chandra Nikam",
      "mobile": "9941303300",
      "address": "Block 13, FF",
      "notes": "Collect Payment (28 Delivered)",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Sambath",
      "mobile": "9025088601",
      "address": "Block 13, TF",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Rajeshwari",
      "mobile": "Ask for phone",
      "address": "Block 3, FF",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Ask for Name",
      "mobile": "Ask for phone",
      "address": "Block 1, FOF",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Ask for Name",
      "mobile": "Ask for phone",
      "address": "Block 1, FOF",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Bagyalaxmi",
      "mobile": "Ask for phone",
      "address": "Block 3, FC",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Jains Nakshatra",
      "name": "Get Name",
      "mobile": "Ask for phone",
      "address": "Block 15, FOE",
      "notes": "",
      "area": "nolambur"
    },
    {
      "apartment": "Indus Metropolitian",
      "name": "Padmapriya",
      "mobile": "9840215533",
      "address": "1st Floor, A31",
      "notes": "Hole --- Renew?",
      "area": "vanagaram"
    },
    {
      "apartment": "AKS Serinity",
      "name": "Ashutosh",
      "mobile": "7904042499",
      "address": "D-203",
      "notes": "",
      "area": "mogappair"
    },
    {
      "apartment": "AKS Serinity",
      "name": "Vikas Mishra",
      "mobile": "9726894391",
      "address": "D-009",
      "notes": "",
      "area": "mogappair"
    },
    {
      "apartment": "Sterling Pradhan",
      "name": "Durga",
      "mobile": "9884918329",
      "address": "Varsha F-CRajankuppam, Ayanambakkam",
      "notes": "2 straws each day!",
      "area": "Ayanambakkam"
    },
    {
      "apartment": "Sunstone Appartment",
      "name": "Jeya",
      "mobile": "9176828408",
      "address": "CS6",
      "notes": "",
      "area": "mogappair"
    },
    {
      "apartment": "Sky Dugar Homes",
      "name": "Prasant",
      "mobile": "9790840834",
      "address": "Tower 5, 302",
      "notes": "Hole & Open --- Sweet water",
      "area": "vanagaram"
    },
    {
      "apartment": "Sky Dugar Homes",
      "name": "Karthick",
      "mobile": "9962245106",
      "address": "Tower 8, 101",
      "notes": "",
      "area": "vanagaram"
    },
    {
      "apartment": "Sky Dugar Homes",
      "name": "Anbu Selvi",
      "mobile": "9790886577",
      "address": "Tower 9, 302",
      "notes": "Hole & Open --- Sweet water  - Collect Payment",
      "area": "vanagaram"
    },
    {
      "apartment": "Sky Dugar Homes",
      "name": "Sri latha",
      "mobile": "9597965041",
      "address": "Tower 9, 403",
      "notes": "Small nuts",
      "area": "vanagaram"
    },
    {
      "apartment": "Sky Dugar Homes",
      "name": "Suresh K Raman",
      "mobile": "9566070986",
      "address": "Tower 12, 212",
      "notes": "",
      "area": "vanagaram"
    },
    {
      "apartment": "Prince Green Woods",
      "name": "Chanreyee Mitra",
      "mobile": "9840178228",
      "address": "Cypress, Blk A, 102, 1st Flr",
      "notes": "Hole n Open Green Nuts",
      "area": "Ambattur"
    },
    {
      "apartment": "Prince Green Woods",
      "name": "Unknown",
      "mobile": "9884074084",
      "address": "Larch, 303, 3rd Flr",
      "notes": "",
      "area": "Ambattur"
    },
    {
      "apartment": "S&P Living Spaces",
      "name": "Krishna Priya",
      "mobile": "8610118162",
      "address": "302, 3rd Floor, Block T,Kamarajar Street, Ayanambakkam",
      "notes": "Give only water nuts",
      "area": "ayanambakkam"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Mahendran",
      "mobile": "9840051341",
      "address": "4/7",
      "notes": "",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Geeta",
      "mobile": "9841046009",
      "address": "7/4",
      "notes": "Don't ring place in the cover, cash will be there",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Rehana",
      "mobile": "9962756905",
      "address": "3/1",
      "notes": "",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Smitha",
      "mobile": "9940016343",
      "address": "7/5",
      "notes": "Hole & Open",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Uma Balaji",
      "mobile": "9176752403",
      "address": "12/13",
      "notes": "",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Sripriya Gopal",
      "mobile": "9840955829",
      "address": "4/5",
      "notes": "",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Karuna",
      "mobile": "9500099406",
      "address": "3/16",
      "notes": "",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Saravana Kumari",
      "mobile": "9962449228",
      "address": "1/5",
      "notes": "Hole & Open",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Yuvaraj",
      "mobile": "9884490408",
      "address": "11/1",
      "notes": "",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Neha",
      "mobile": "9500012263",
      "address": "4/15",
      "notes": "Give water only better size nuts!",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Ramakrishnan",
      "mobile": "9940312350",
      "address": "9/4",
      "notes": "Water and soft nuts",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Hemavathi",
      "mobile": "9841579909",
      "address": "9/2",
      "notes": "Pack Started 21th May, ends 29th May Pack Started 30th May, ends 5th June Collect Payment",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Isha",
      "mobile": "9840935726",
      "address": "10/8",
      "notes": "",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Arathi",
      "mobile": "9840032255",
      "address": "3/13",
      "notes": "",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Girish Nair",
      "mobile": "9944684166",
      "address": "2/16",
      "notes": "Renew?",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Thirumagal",
      "mobile": "9962530999",
      "address": "13/7",
      "notes": "",
      "area": "vanagaram"
    },
    {
      "apartment": "Golden Tressure",
      "name": "Abhinaya",
      "mobile": "9884951231",
      "address": "5/6",
      "notes": "",
      "area": "vanagaram"
    }
  ]

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
    // debugger;

    //to write from excel sheet.
    // for (var key in this.addrData) {
    //   let data = this.addrData[key];
    //   console.log(data);
    //   this.firebase.adminWriteUserAddress({
    //     "id": data.mobile,
    //     "email": "",
    //     "name": data.name,
    //     "address": data.address,
    //     "area": data.area,
    //     "active": "no "
    //   }, (result) => {
    //     // this._commons.openSnackBar(result, "");
    //   });
    // }
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

