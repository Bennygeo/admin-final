import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { UserDetails, Places, Globals } from 'src/app/utils/utils';

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

  addrData: any = [
    {
      "Name": "Srihari",
      "Apartment": "Abhinayam Phase3",
      "Contact": "9789481188",
      "Address": "D2-13,\nSriram Nagar Main Road, Nolambur, Mogappair West, Chennai 95",
      "Door ": "D2-13",
      "Street": "Sriram Nagar Main Road, Nolambur, ",
      "Area": "Mogappair West,",
      "Pincode": "600095",
      "Instructions": "2 Straws"
    },
    {
      "Name": "Raji",
      "Apartment": "Abinaya Appartment",
      "Contact": "9884874808",
      "Address": "F2, 1st Main Rd, \nVijayalakshmi Nagar, Kattupakkam",
      "Door ": "F2",
      "Floor": " ",
      "Street": " 1st Main Rd, Vijayalakshmi Nagar,",
      "Area": "Kattupakkam"
    },
    {
      "Name": "Ashutosh",
      "Apartment": "AKS Serinity",
      "Contact": "7904042499",
      "Address": "D-203",
      "Door ": "D-203"
    },
    {
      "Name": "Vikas Mishra",
      "Apartment": "AKS Serinity",
      "Contact": "9726894391",
      "Address": "D-009",
      "Door ": "D-009"
    },
    {
      "Name": "Jayasurrya",
      "Apartment": "Anna Nagar",
      "Contact": "9176648899",
      "Address": "213, 51st Street, TVS Colony,\nAnnanagar West Extn,\nNear Hatson",
      "Door ": "213",
      "Block": " 51st Street",
      "Street": " TVS Colony",
      "Area": "Annanagar West Extn",
      "Landmark": "Near Hatson"
    },
    {
      "Name": "Karthik",
      "Apartment": "Anna Nagar",
      "Contact": "9176302157",
      "Address": "1193, 49th Blk, 1st Floor, Gate5,\nJeevan Bhima Nagar",
      "Door ": "1193",
      "Block": " 49th Blk",
      "Floor": " 1st Floor",
      "Street": " Gate5",
      "Area": "Jeevan Bhima Nagar",
      "Instructions": "have to deliver remaining 6"
    },
    {
      "Name": "Mridula",
      "Apartment": "Anna Nagar",
      "Contact": "9176630061",
      "Address": "3088, 22nd Blk, 3rd Floor, Gate2,\nJeevan Bhima Nagar",
      "Door ": "3088",
      "Block": " 22nd Blk",
      "Floor": " 3rd Floor",
      "Street": " Gate2",
      "Area": "Jeevan Bhima Nagar",
      "Instructions": "Collect Payment, Renew?"
    },
    {
      "Name": "Prakalya",
      "Apartment": "Anna Nagar",
      "Contact": "9941729725",
      "Address": "1190, 48th Blk, LIC quarters, \nJeevan Bhima nagar",
      "Door ": "1190",
      "Block": " 48th Blk",
      "Floor": " LIC quarters",
      "Street": " ",
      "Area": "Jeevan Bhima Nagar",
      "Instructions": "2 Straws per day! "
    },
    {
      "Name": "Vandana",
      "Apartment": "Anna Nagar",
      "Contact": "9884423766",
      "Address": "21/82, Gate2,\nJeevan Bhima Nagar",
      "Door ": "21/82",
      "Street": " Gate2",
      "Area": "Jeevan Bhima Nagar"
    },
    {
      "Name": "Anusha",
      "Apartment": "Appaswamy Cerus",
      "Contact": "9884809685",
      "Address": "1143, Blk1, 134, Arcot Rd, Virugambakkam",
      "Door ": "1143",
      "Block": " Blk1",
      "Floor": "14th Floor",
      "Street": " Arcot Rd",
      "Area": " Virugambakkam"
    },
    {
      "Name": "Bhanu Prakash",
      "Apartment": "Appaswamy Cerus",
      "Contact": "9840022348",
      "Address": "3043, Blk3, 134, Arcot Rd, Virugambakkam",
      "Door ": "3043",
      "Block": " Blk3",
      "Floor": "4th Floor",
      "Street": " Arcot Rd",
      "Area": " Virugambakkam",
      "Instructions": "Before 7:30 AM"
    },
    {
      "Name": "Pauline",
      "Apartment": "Appaswamy Cerus",
      "Contact": "9952925659",
      "Address": "3032, Blk3, 134, Arcot Rd, Virugambakkam",
      "Door ": "3032",
      "Block": " Blk3",
      "Floor": "3rd Floor",
      "Street": " Arcot Rd",
      "Area": " Virugambakkam"
    },
    {
      "Name": "Punitha",
      "Apartment": "Appaswamy Cerus",
      "Contact": "9779551747",
      "Address": "2051, Blk2, 134, Arcot Rd, Virugambakkam",
      "Door ": "2051",
      "Block": " Blk2",
      "Floor": "5th Floor",
      "Street": " Arcot Rd",
      "Area": " Virugambakkam"
    },
    {
      "Name": "A mishra",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9769000100",
      "Address": "3-14-4 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "4",
      "Block": "3",
      "Floor": "14th Floor",
      "Instructions": "Small Nuts (pack of 3)"
    },
    {
      "Name": "A.V. Nethaji Mudaliar",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9442020000",
      "Address": "2-3-1 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "1",
      "Block": "2",
      "Floor": "3rd Floor",
      "Instructions": "Get sign in the paper! "
    },
    {
      "Name": "Anandhi",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9940613716",
      "Address": "2-10-1 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "1",
      "Block": "2",
      "Floor": "10th Floor"
    },
    {
      "Name": "D. Sekhar",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9444450381",
      "Address": "2-0-3 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "3",
      "Block": "2",
      "Floor": "GF"
    },
    {
      "Name": "Eshwari",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9445545867",
      "Address": "3-7-2 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "2",
      "Block": "3",
      "Floor": "7th Floor"
    },
    {
      "Name": "Gopal",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9840806350",
      "Address": "2-8-2 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "2",
      "Block": "2",
      "Floor": "8th Floor"
    },
    {
      "Name": "Hema ",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9176358467",
      "Address": "5-7-1 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "1",
      "Block": "5",
      "Floor": "7th Floor",
      "Instructions": "Small Nuts (pack of 3)"
    },
    {
      "Name": "Himanshu",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9312989976",
      "Address": "3-7-4 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "4",
      "Block": "3",
      "Floor": "7th Floor",
      "Instructions": "Send bigger nuts!"
    },
    {
      "Name": "Jaswanth",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9789823836",
      "Address": "3-7-1 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "1",
      "Block": "3",
      "Floor": "7th Floor"
    },
    {
      "Name": "Kishore",
      "Apartment": "Arihant magestic Towers",
      "Contact": "6369155117",
      "Address": "5-14-4 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "4",
      "Block": "5",
      "Floor": "14th Floor"
    },
    {
      "Name": "Latha Sabarish",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9884300102",
      "Address": "2-3-2 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "2",
      "Block": "2",
      "Floor": "3rd Floor"
    },
    {
      "Name": "Madhu",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9052623336",
      "Address": "2-13-1 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "1",
      "Block": "2",
      "Floor": "13th Floor",
      "Instructions": "Green nuts"
    },
    {
      "Name": "Navarasam",
      "Apartment": "Arihant magestic Towers",
      "Contact": "6379511021",
      "Address": "5-7-3 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "3",
      "Block": "5",
      "Floor": "7th Floor",
      "Instructions": "Tender Nuts"
    },
    {
      "Name": "Parag",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9790766851",
      "Address": "1-10-4 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "4",
      "Block": "1",
      "Floor": "10th Floor",
      "Instructions": "Customer testing, give good nuts"
    },
    {
      "Name": "Raja",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9487416987",
      "Address": "1-0-2 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "2",
      "Block": "1",
      "Floor": "GF"
    },
    {
      "Name": "Sounder",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9841394444",
      "Address": "2-3-3 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "3",
      "Block": "2",
      "Floor": "3rd Floor"
    },
    {
      "Name": "Subramanian",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9840281675",
      "Address": "3-2-4 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "4",
      "Block": "3",
      "Floor": "2nd Floor"
    },
    {
      "Name": "Subramaniyam",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9003667604",
      "Address": "2-1-3 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "3",
      "Block": "2",
      "Floor": "1st Floor"
    },
    {
      "Name": "Thirumaran",
      "Apartment": "Arihant magestic Towers",
      "Contact": "9381250010",
      "Address": "1-9-4 Arihant magestic Towers,\n110, Jawaharlal Nehru Road, Koyembedu",
      "Door ": "4",
      "Block": "1",
      "Floor": "9th Floor"
    },
    {
      "Name": "Kevin John Mathew",
      "Apartment": "Arumbakkam",
      "Contact": "8637684554",
      "Address": "B6-Achala Vihar Ai-116, 2nd Street, \n8th Main road",
      "Door ": "B6",
      "Floor": " ",
      "Street": "Achala Vihar Ai-116, 2nd Street, \n8th Main road",
      "Area": "Arumbakkam"
    },
    {
      "Name": "Shadik",
      "Apartment": "Arumbakkam",
      "Contact": "9840045151",
      "Address": "36/45, Valluvar Salai, Arumbakkam",
      "Door ": "36/45",
      "Street": " Valluvar Salai",
      "Area": " Arumbakkam",
      "Instructions": "Give balance 355"
    },
    {
      "Name": "Vijay Kumar",
      "Apartment": "Ashok Nandavanam",
      "Contact": "8838666576",
      "Address": "2nd Main road, Goparasa Nallur",
      "Street": "2nd Main road",
      "Area": " Goparasa Nallur",
      "Instructions": "Location sent"
    },
    {
      "Name": "Nishitha",
      "Apartment": "Ceebros Gardens",
      "Contact": "9025397118",
      "Address": "2B, Orchid, 38, Arcot Road, Virugambakkam",
      "Door ": "2B",
      "Block": " Orchid",
      "Street": " 38, Arcot Road",
      "Area": " Virugambakkam",
      "Instructions": "Young easy to open nuts \n Call don’t ring bell"
    },
    {
      "Name": "Mrs. Saran",
      "Apartment": "Chester Fields",
      "Contact": "9281057176",
      "Address": "A6",
      "Door ": "A6"
    },
    {
      "Name": "Mohit",
      "Apartment": "DABC Abinayam Phase 3",
      "Contact": "8610661643",
      "Address": "A1-15",
      "Door ": "15",
      "Block": "Block A1",
      "Instructions": "Small Nuts"
    },
    {
      "Name": "Prabhu R",
      "Apartment": "DABC Gokulam Phase 2",
      "Contact": "7358718459",
      "Address": "7, Block 2B",
      "Door ": "7",
      "Block": " Block 2B",
      "Instructions": "Small Nuts (Pack of 3)"
    },
    {
      "Name": "Rufina",
      "Apartment": "DABC Gokulam Phase 2",
      "Contact": "9500755568",
      "Address": "17, Block 1B",
      "Door ": "17",
      "Block": " Block 1B"
    },
    {
      "Name": "Velu Ammaiyappah",
      "Apartment": "ETA-Verde",
      "Contact": "9894320000",
      "Address": "A-1101, 11th Flr, Building 6,\nArcot Road",
      "Door ": "A-1101",
      "Block": " 11th Flr",
      "Floor": " Building 6",
      "Street": "Arcot Road",
      "Area": "Virugambakkam"
    },
    {
      "Name": "Manikandan",
      "Apartment": "Gerugambakkam",
      "Contact": "9841063388",
      "Address": "S2, Sri Guru Flats, 2nd Floor, SGR Nagar, Gerugambakkam",
      "Door ": "S2",
      "Block": " Sri Guru Flats",
      "Floor": "2nd Floor",
      "Street": " SGR Nagar",
      "Area": " Gerugambakkam"
    },
    {
      "Name": "Abhinaya",
      "Apartment": "Golden Tressure",
      "Contact": "9884951231",
      "Address": "5/6",
      "Door ": "6",
      "Block": "5"
    },
    {
      "Name": "Arathi",
      "Apartment": "Golden Tressure",
      "Contact": "9840032255",
      "Address": "3/13",
      "Door ": "13",
      "Block": "3"
    },
    {
      "Name": "Geeta",
      "Apartment": "Golden Tressure",
      "Contact": "9841046009",
      "Address": "7/4",
      "Door ": "4",
      "Block": "7",
      "Instructions": "Don’t ring place in the cover, cash will be there"
    },
    {
      "Name": "Geetha",
      "Apartment": "Golden Tressure",
      "Contact": "9840649486",
      "Address": "3/7",
      "Door ": "7",
      "Block": "3"
    },
    {
      "Name": "Girish Nair",
      "Apartment": "Golden Tressure",
      "Contact": "9944684166",
      "Address": "2/16",
      "Door ": "16",
      "Block": "2",
      "Instructions": "Renew?"
    },
    {
      "Name": "Hemavathi",
      "Apartment": "Golden Tressure",
      "Contact": "9841579909",
      "Address": "9/2",
      "Door ": "2",
      "Block": "9",
      "Instructions": "Pack Started 21th May, ends 29th May \nPack Started 30th May, ends 5th June \nCollect Payment"
    },
    {
      "Name": "Isha",
      "Apartment": "Golden Tressure",
      "Contact": "9840935726",
      "Address": "10/8",
      "Door ": "8",
      "Block": "10"
    },
    {
      "Name": "Karuna",
      "Apartment": "Golden Tressure",
      "Contact": "9500099406",
      "Address": "3/16",
      "Door ": "16",
      "Block": "3"
    },
    {
      "Name": "Mahendran",
      "Apartment": "Golden Tressure",
      "Contact": "9840051341",
      "Address": "4/7",
      "Door ": "7",
      "Block": "4"
    },
    {
      "Name": "Neha",
      "Apartment": "Golden Tressure",
      "Contact": "9500012263",
      "Address": "4/15",
      "Door ": "15",
      "Block": "4",
      "Instructions": "Give water only better size nuts!"
    },
    {
      "Name": "Ramakrishnan",
      "Apartment": "Golden Tressure",
      "Contact": "9940312350",
      "Address": "9/4",
      "Door ": "4",
      "Block": "9",
      "Instructions": "Water and soft nuts "
    },
    {
      "Name": "Rehana",
      "Apartment": "Golden Tressure",
      "Contact": "9962756905",
      "Address": "3/1",
      "Door ": "1",
      "Block": "3"
    },
    {
      "Name": "Saravana Kumari",
      "Apartment": "Golden Tressure",
      "Contact": "9962449228",
      "Address": "1/5",
      "Door ": "5",
      "Block": "1",
      "Instructions": "Hole & Open"
    },
    {
      "Name": "Smitha",
      "Apartment": "Golden Tressure",
      "Contact": "9940016343",
      "Address": "7/5",
      "Door ": "5",
      "Block": "7",
      "Instructions": "Hole & Open\nBefore 7"
    },
    {
      "Name": "Sripriya Gopal",
      "Apartment": "Golden Tressure",
      "Contact": "9840955829",
      "Address": "4/5",
      "Door ": "5",
      "Block": "4",
      "Instructions": "Before 7:30"
    },
    {
      "Name": "Thirumagal",
      "Apartment": "Golden Tressure",
      "Contact": "9962530999",
      "Address": "13/7",
      "Door ": "7",
      "Block": "13"
    },
    {
      "Name": "Uma Balaji",
      "Apartment": "Golden Tressure",
      "Contact": "9176752403",
      "Address": "12/13",
      "Door ": "13",
      "Block": "12",
      "Instructions": "Before 7:30"
    },
    {
      "Name": "Yuvaraj",
      "Apartment": "Golden Tressure",
      "Contact": "9884490408",
      "Address": "11/1",
      "Door ": "1",
      "Block": "11"
    },
    {
      "Name": "Arti",
      "Apartment": "Grassland Apartment",
      "Contact": "8939393817",
      "Address": "D-12, Block-D, Opposite to Paradise Biriyani, Mugalivakkam",
      "Door ": "D-12",
      "Block": " Block-D",
      "Floor": " Opposite to Paradise Biriyani",
      "Street": " Mugalivakkam",
      "Instructions": "Renew?"
    },
    {
      "Name": "Padmapriya",
      "Apartment": "Indus Metropolitian",
      "Contact": "9840215533",
      "Address": "1st Floor, A31",
      "Door ": " A31",
      "Block": "Block A",
      "Floor": "1st Floor",
      "Instructions": "Hole\nBefore 6:45"
    },
    {
      "Name": "Amruthavalli",
      "Apartment": "Jains Nakshatra",
      "Contact": "9940912017",
      "Address": "Block 4, 3E or TE",
      "Door ": "TE",
      "Block": "Block 4",
      "Floor": "3rd Floor"
    },
    {
      "Name": "Chandra Nikam",
      "Apartment": "Jains Nakshatra",
      "Contact": "9941303300",
      "Address": "Block 13, FF",
      "Door ": " FF",
      "Block": "Block 13",
      "Floor": "1st Floor",
      "Instructions": "Collect Payment (28 Delivered)"
    },
    {
      "Name": "Devi G",
      "Apartment": "Jains Nakshatra",
      "Contact": "9940117336",
      "Address": "Block 9, TF",
      "Door ": " TF",
      "Block": "Block 9",
      "Floor": "3rd Floor",
      "Instructions": "Old balance 100"
    },
    {
      "Name": "Get Name",
      "Apartment": "Jains Nakshatra",
      "Contact": "Ask for phone",
      "Address": "Block 15, FOE",
      "Door ": " FOE",
      "Block": "Block 15",
      "Floor": "4th Floor"
    },
    {
      "Name": "Kabita",
      "Apartment": "Jains Nakshatra",
      "Contact": "8610218419",
      "Address": "Block 8, FOE",
      "Door ": " FOE",
      "Block": "Block 8",
      "Floor": "4th Floor",
      "Instructions": "Take big opener"
    },
    {
      "Name": "Loganathan",
      "Apartment": "Jains Nakshatra",
      "Contact": "9444167080",
      "Address": "Block 1, FOF",
      "Door ": " FOF",
      "Block": "Block 1",
      "Floor": "4th Floor"
    },
    {
      "Name": "Meera",
      "Apartment": "Jains Nakshatra",
      "Contact": "9442932175",
      "Address": "Block 8, SC",
      "Door ": " SC",
      "Block": "Block 8",
      "Floor": "2nd Floor"
    },
    {
      "Name": "Mohankumar",
      "Apartment": "Jains Nakshatra",
      "Contact": "9840569109",
      "Address": "Block 12, FB",
      "Door ": " FB",
      "Block": "Block 12",
      "Floor": "1st Floor"
    },
    {
      "Name": "Rajendran",
      "Apartment": "Jains Nakshatra",
      "Contact": "9688909678",
      "Address": "Block 7, FOC",
      "Door ": " FOC",
      "Block": "Block 7",
      "Floor": "4th Floor",
      "Instructions": "Previous balance 150"
    },
    {
      "Name": "Sambath",
      "Apartment": "Jains Nakshatra",
      "Contact": "9025088601",
      "Address": "Block 13, TF",
      "Door ": " TF",
      "Block": "Block 13",
      "Floor": "3rd Floor"
    },
    {
      "Name": "Tamilselvan",
      "Apartment": "Jains Nakshatra",
      "Contact": "9940481579",
      "Address": "Block 9, SB",
      "Door ": " SB",
      "Block": "Block 9",
      "Floor": "2nd Floor"
    },
    {
      "Name": "Aarthy",
      "Apartment": "Jains Sunderban",
      "Contact": "8610663509",
      "Address": "Block 1, 3A",
      "Door ": " 3A",
      "Block": "Block 1",
      "Floor": "3rd Floor",
      "Instructions": "Hole & Open"
    },
    {
      "Name": "Anand PM",
      "Apartment": "Jains Sunderban",
      "Contact": "9884865804",
      "Address": "Block 12,1C",
      "Door ": "1C",
      "Block": "Block 12",
      "Floor": "1st Floor",
      "Instructions": "Give a little harder nut - sweet water"
    },
    {
      "Name": "Anuradha",
      "Apartment": "Jains Sunderban",
      "Contact": "8056014755",
      "Address": "Block 3, 2F",
      "Door ": " 2F",
      "Block": "Block 3",
      "Floor": "2nd Floor"
    },
    {
      "Name": "Aruna Kumari",
      "Apartment": "Jains Sunderban",
      "Contact": "9743638065",
      "Address": "Block 1, 4D",
      "Door ": " 4D",
      "Block": "Block 1",
      "Floor": "4th Floor"
    },
    {
      "Name": "Deepa",
      "Apartment": "Jains Sunderban",
      "Contact": "9500328306",
      "Address": "Block 1, 3H",
      "Door ": " 3H",
      "Block": "Block 1",
      "Floor": "3rd Floor"
    },
    {
      "Name": "Mithra",
      "Apartment": "Jains Sunderban",
      "Contact": "7795747843",
      "Address": "Block 17, 4A",
      "Door ": " 4A",
      "Block": "Block 17",
      "Floor": "4th Floor",
      "Instructions": "Please give bigger sized nuts"
    },
    {
      "Name": "Nalini",
      "Apartment": "Jains Sunderban",
      "Contact": "9840842538",
      "Address": "Block 11, 3A",
      "Door ": " 3A",
      "Block": "Block 11",
      "Floor": "3rd Floor"
    },
    {
      "Name": "Nikitha",
      "Apartment": "Jains Sunderban",
      "Contact": "8072397553",
      "Address": "Block 12, 4C",
      "Door ": " 4C",
      "Block": "Block 12",
      "Floor": "4th Floor"
    },
    {
      "Name": "Padma",
      "Apartment": "Jains Sunderban",
      "Contact": "9790888017",
      "Address": "Block 15, 2D",
      "Door ": " 2D",
      "Block": "Block 15",
      "Floor": "2nd Floor"
    },
    {
      "Name": "Preetha",
      "Apartment": "Jains Sunderban",
      "Contact": "9940626795",
      "Address": "Block 10, 1B",
      "Door ": " 1B",
      "Block": "Block 10",
      "Floor": "1st Floor",
      "Instructions": "Collect Payment -- Renew?"
    },
    {
      "Name": "Priya ",
      "Apartment": "Jains Sunderban",
      "Contact": "7358561491",
      "Address": "Block 15, 2E",
      "Door ": " 2E",
      "Block": "Block 15",
      "Floor": "2nd Floor",
      "Instructions": "Hole & Open"
    },
    {
      "Name": "Rakhi",
      "Apartment": "Jains Sunderban",
      "Contact": "7358241777",
      "Address": "Block 13, 2F",
      "Door ": " 2F",
      "Block": "Block 13",
      "Floor": "2nd Floor"
    },
    {
      "Name": "Ritu",
      "Apartment": "Jains Sunderban",
      "Contact": "9840067356",
      "Address": "Block 15, 4D",
      "Door ": " 4D",
      "Block": "Block 15",
      "Floor": "4th Floor",
      "Instructions": "Renew?"
    },
    {
      "Name": "Sarita Rai",
      "Apartment": "Jains Sunderban",
      "Contact": "8667498929",
      "Address": "Block 17, 3F",
      "Door ": " 3F",
      "Block": "Block 17",
      "Floor": "3rd Floor",
      "Instructions": "Prev pack from 27 Aug to 25 sep"
    },
    {
      "Name": "Swarna Priya",
      "Apartment": "Jains Sunderban",
      "Contact": "9444907023",
      "Address": "Block 14, 1B",
      "Door ": " 1B",
      "Block": "Block 14",
      "Floor": "1st Floor",
      "Instructions": "Orange Nuts"
    },
    {
      "Name": "Vidhya Chandrasekar",
      "Apartment": "Jains Sunderban",
      "Contact": "9940110382",
      "Address": "Block 10, 4C",
      "Door ": " 4C",
      "Block": "Block 10",
      "Floor": "4th Floor"
    },
    {
      "Name": "Aravindh Sankar",
      "Apartment": "KG",
      "Contact": "8754463978",
      "Address": "C-1411",
      "Door ": "1411",
      "Block": "C",
      "Floor": "14th Floor"
    },
    {
      "Name": "Deepa",
      "Apartment": "KG",
      "Contact": "8939251385",
      "Address": "D1-705",
      "Door ": "705",
      "Block": "D1",
      "Floor": "7th Floor",
      "Instructions": "Give easy to open nuts!"
    },
    {
      "Name": "Devi",
      "Apartment": "KG",
      "Contact": "9444907563",
      "Address": "B-808",
      "Door ": "808",
      "Block": "B",
      "Floor": "8th Floor",
      "Instructions": "This is a replacement"
    },
    {
      "Name": "Kirubalan",
      "Apartment": "KG",
      "Contact": "9677235792",
      "Address": "B-304",
      "Door ": "304",
      "Block": "B",
      "Floor": "3rd Floor"
    },
    {
      "Name": "Madhavi",
      "Apartment": "KG",
      "Contact": "8825414936",
      "Address": "B-208",
      "Door ": "208",
      "Block": "B",
      "Floor": "3rd Floor"
    },
    {
      "Name": "Usha",
      "Apartment": "KG",
      "Contact": "9789429547",
      "Address": "G1-905",
      "Door ": "905",
      "Block": "G1",
      "Floor": "9th Floor"
    },
    {
      "Name": "Beaula",
      "Apartment": "Location sent",
      "Contact": "9176702052",
      "Address": "C6, Radha Flats, 33/8,\nVOC Street, Kaikankuppam road,\nValasaravakkam",
      "Door ": "C6",
      "Block": " Radha Flats",
      "Street": " 33/8,VOC Street, Kaikankuppam road,\n",
      "Area": "Valasaravakkam",
      "Instructions": "Collect Payment"
    },
    {
      "Name": "Diwakar S",
      "Apartment": "Location sent",
      "Contact": "9841737768",
      "Address": "S3, 2nd Floor, 173 & 174,\nMG Chakrapani Nagar Main Road,\nNear Bharathi Nagar Park\nMaduravoyal",
      "Door ": "S3",
      "Block": " 2nd Floor",
      "Street": "173 & 174,\nMG Chakrapani Nagar Main Road,",
      "Area": "Maduravoyal",
      "Landmark": "Near Bharathi Nagar Park\n"
    },
    {
      "Name": "Diwakar S - DAD",
      "Apartment": "Location sent",
      "Contact": "9841737768",
      "Address": "33, Abirami Nagar, 4th Street, \nnear SM store, Maduravoyal",
      "Door ": "33",
      "Block": " ",
      "Street": "Abirami Nagar,  4th Street ",
      "Area": "Maduravoyal",
      "Landmark": "Near SM Store\n",
      "Instructions": "Renew?"
    },
    {
      "Name": "Elavarasan",
      "Apartment": "Location sent",
      "Contact": "7904665278",
      "Address": "F2, 1st Floor, plot 18, 1st Street, Om Sakthi Nagar, Maduravoyal",
      "Door ": "F2",
      "Block": " 1st Floor",
      "Street": " plot 18, 1st Street, Om Sakthi Nagar",
      "Area": " Maduravoyal"
    },
    {
      "Name": "Jagadeeshwari",
      "Apartment": "Location sent",
      "Contact": "7358554811",
      "Address": "74, Sri Krishna Nagar, Alapakkam\n",
      "Door ": "74",
      "Street": "Sri Krishna Nagar,",
      "Area": "Alapakkam",
      "Landmark": "(Opposite house of Nivetha sri)"
    },
    {
      "Name": "Nalini",
      "Apartment": "Location sent",
      "Contact": "9840930889",
      "Address": "Plot.No.172, 15th street, Chowdry Nagar,\nValasaravakkam",
      "Door ": "Plot.No.172",
      "Street": "Plot.No.172, 15th street, Chowdry Nagar,",
      "Area": "Valasaravakkam",
      "Instructions": "15 days"
    },
    {
      "Name": "Nivetha Sri",
      "Apartment": "Location sent",
      "Contact": "9791569899",
      "Address": "60, Sri Krishna Nagar, Alapakkam",
      "Door ": "60",
      "Street": " Sri Krishna Nagar",
      "Area": " Alapakkam",
      "Instructions": "1 straw per day"
    },
    {
      "Name": "Rajasekar",
      "Apartment": "Location sent",
      "Contact": "9884447144",
      "Address": "10, 2nd Floor, Ramamurthy Avenue, 3rd Street, Sakthi Nagar, Porur",
      "Door ": "10",
      "Block": " 2nd Floor",
      "Street": "  Ramamurthy Avenue, 3rd Street,  Sakthi Nagar",
      "Area": " Porur"
    },
    {
      "Name": "Shreedar RM",
      "Apartment": "Location sent",
      "Contact": "9566181555",
      "Address": "Plot No 32, F2, 1st Floor, \nMurali Krishna Nagar Main Road,\nAlwarthirunagar",
      "Door ": "Plot No 32",
      "Block": " F2",
      "Floor": " 1st Floor",
      "Street": " ",
      "Instructions": "Only Green nuts!"
    },
    {
      "Name": "Srividya",
      "Apartment": "Location sent",
      "Contact": "9940064916",
      "Address": "",
      "Door ": "",
      "Block": "",
      "Floor": "",
      "Street": "",
      "Instructions": "Don’t ring"
    },
    {
      "Name": "Sujatha",
      "Apartment": "Location sent",
      "Contact": "7550049309",
      "Address": "72 & 73, VGN Phase 4, VOC st",
      "Door ": "72 & 73",
      "Block": " VGN Phase 4",
      "Street": " VOC st",
      "Instructions": "By 7:30 - Hole"
    },
    {
      "Name": "Sulaiman",
      "Apartment": "Location sent",
      "Contact": "9445058262",
      "Address": "",
      "Door ": "",
      "Block": "",
      "Street": "",
      "Instructions": ""
    },
    {
      "Name": "Sushil",
      "Apartment": "Location sent",
      "Contact": "9176294460",
      "Address": "44/13, Gandhi Rd, Alwarthirunagar",
      "Door ": "44/13",
      "Street": " Gandhi Rd",
      "Area": " Alwarthirunagar",
      "Instructions": "Water nut"
    },
    {
      "Name": "Bharadwaj",
      "Apartment": "Maduravoyal",
      "Contact": "9003239324",
      "Address": "19, MCK Nagar Phase 3,\nChennai by-pass service road,\nAdayalampattu",
      "Door ": "19",
      "Street": " MCK Nagar Phase 3, Chennai by-pass service road,",
      "Area": "Adayalampattu"
    },
    {
      "Name": "Bharath Ram",
      "Apartment": "Manapakkam",
      "Contact": "9176646323",
      "Address": "4/2, ",
      "Door ": "4/2",
      "Street": "Sriram Gardens, ",
      "Area": "Indira Nagar",
      "Landmark": "Near indira nagar bus stop",
      "Instructions": "Before 7:30"
    },
    {
      "Name": "Charles Wesley",
      "Apartment": "Mithilam",
      "Contact": "9715777707",
      "Address": "4A, 8",
      "Door ": "8",
      "Block": "Block 4A",
      "Instructions": "Give good nuts"
    },
    {
      "Name": "Vinesh",
      "Apartment": "Mithilam",
      "Contact": "9836300997",
      "Address": "8A, 2",
      "Door ": "2",
      "Block": "Block 8A"
    },
    {
      "Name": "Shalini",
      "Apartment": "Moulivakkam",
      "Contact": "9945740796",
      "Address": "Plot No 7B & 8A, 2/162B, S1, B-Block, Sri Sakthi Homes, Mouleeshwarar Nagar",
      "Door ": "Plot No 7B & 8A",
      "Block": "Block B",
      "Street": "2/162B, S1, B-Block, Sri Sakthi Homes,",
      "Area": " Mouleeshwarar Nagar"
    },
    {
      "Name": "Vivek T",
      "Apartment": "Moulivakkam",
      "Contact": "9976529264",
      "Address": "46, Rajarajan Street, Baikadai, \nMoulivakkam",
      "Door ": "46",
      "Street": " Rajarajan Street",
      "Area": " Baikadai",
      "Instructions": "1 Straw each day!"
    },
    {
      "Name": "Ashok Rao",
      "Apartment": "Mugalivakkam",
      "Contact": "8754470650",
      "Address": "No 22, Ashram Avenue,",
      "Door ": "No 22",
      "Street": " Ashram Avenue",
      "Instructions": "Location sent "
    },
    {
      "Name": "Atchith",
      "Apartment": "Mugalivakkam",
      "Contact": "9884598645",
      "Address": "F4, Plot No 20.21, Kumudham Nagar 2nd street, Mugalivakkam",
      "Door ": "F4",
      "Street": " Plot No 20.21, Kumudham Nagar 2nd street",
      "Area": " Mugalivakkam"
    },
    {
      "Name": "Jeevan",
      "Apartment": "Mugalivakkam",
      "Contact": "9442424761",
      "Address": "Plot No 8, Spacio Gourou Grandeza, B Block, Flat No B3, 1st Floor, Karthik Balaji Nagar Extn., Near Ashram Avenue",
      "Door ": "B3",
      "Block": "Block B",
      "Floor": "1st Floor",
      "Street": "Plot No 8, Spacio Gourou Grandeza, Karthik Balaji Nagar Extn",
      "Area": " Near Ashram Avenue"
    },
    {
      "Name": "Lavanya",
      "Apartment": "Mugalivakkam",
      "Contact": "9566133533",
      "Address": "Plot No 5, Dwaraka Appartment, B Block, F4, Ashram Avenue",
      "Door ": "Plot No 5",
      "Block": " Dwaraka Appartment",
      "Floor": " B Block",
      "Street": "F4",
      "Area": " Ashram Avenue"
    },
    {
      "Name": "Moni",
      "Apartment": "Mugalivakkam",
      "Contact": "9551073464",
      "Address": "No 37 (Gokulam), Ashram Avenue\n - Phase1",
      "Door ": "No 37 (Gokulam)",
      "Street": "Phase 1",
      "Area": " Ashram Avenue ",
      "Instructions": "Orange Nuts --- Renew?"
    },
    {
      "Name": "Poornima Nair",
      "Apartment": " Sri Krishna palace",
      "Contact": "7738784403",
      "Address": "F4, a block, Sri Krishna palace, Krishnanagar extension 4, Madanadapuram \n(near Madanadapuram Mugalivakkam road)",
      "Door ": "F4",
      "Block": "Block A",
      "Street": "Krishnanagar extension 4",
      "Area": " Madanadapuram "
    },
    {
      "Name": "Siddhanth Goyal",
      "Apartment": "Mugalivakkam",
      "Contact": "8448098930",
      "Address": "No 28, Gowri Nagar, 2nd st",
      "Door ": "No 28",
      "Street": "Gowri Nagar, 2nd st",
      "Area": "Mugalivakkam",
      "Instructions": "Location sent"
    },
    {
      "Name": "Sindhu",
      "Apartment": "Muktha Nirman Appartments",
      "Contact": "9710783632",
      "Address": "A1F1, (Near Saravana Stores), Lakshmi Nagar",
      "Door ": "A1F1",
      "Street": " Lakshmi Nagar",
      "Landmark": " (Near Saravana Stores)"
    },
    {
      "Name": "Ashwin",
      "Apartment": "KK Enclave",
      "Contact": "7358329845",
      "Address": "KK Enclave, Block 2c, PP Kovil 1st Street,Mettu Colony",
      "Door ": "2c",
      "Block": " Block 2c",
      "Street": "PP Kovil 1st Street, Mettu Colony",
      "Area": "Nandambakkam"
    },
    {
      "Name": "Dharmesh",
      "Apartment": "Ocean Chlorophyll",
      "Contact": "9840858246",
      "Address": "Tower 9, 7th Floor, 9076",
      "Door ": "9076",
      "Block": "Tower 9",
      "Floor": " 7th Floor",
      "Instructions": "Give water nuts"
    },
    {
      "Name": "Karpagam",
      "Apartment": "Ocean Chlorophyll",
      "Contact": "9790859631",
      "Address": "Tower 7, 6th Floor, 7061",
      "Door ": "7061",
      "Block": "Tower 7",
      "Floor": " 6th Floor",
      "Instructions": "Hole n Open"
    },
    {
      "Name": "Latha",
      "Apartment": "Ocean Chlorophyll",
      "Contact": "8939911332",
      "Address": "Tower 9, 7th Floor, 9077",
      "Door ": "9077",
      "Block": "Tower 9",
      "Floor": " 7th Floor",
      "Instructions": "Give good nuts"
    },
    {
      "Name": "Lekha",
      "Apartment": "Ocean Chlorophyll",
      "Contact": "9176210191",
      "Address": "Tower 9, 7th Floor, 9073",
      "Door ": "9073",
      "Block": "Tower 9",
      "Floor": " 7th Floor",
      "Instructions": "After 8"
    },
    {
      "Name": "Mansi Mishra",
      "Apartment": "Ocean Chlorophyll",
      "Contact": "9176699653",
      "Address": "Tower 6, 12th Floor, 6127",
      "Door ": "6127",
      "Block": "Tower 6",
      "Floor": " 12th Floor",
      "Instructions": "Give good nuts"
    },
    {
      "Name": "Mathuravalli",
      "Apartment": "Ocean Chlorophyll",
      "Contact": "8056039789",
      "Address": "Tower 7, 9th Floor, 7096",
      "Door ": "7096",
      "Block": "Tower 7",
      "Floor": " 9th Floor",
      "Instructions": "Hole n Open"
    },
    {
      "Name": "Ram",
      "Apartment": "Ocean Chlorophyll",
      "Contact": "9686748030",
      "Address": "Tower 6, 3rd Floor, 6031",
      "Door ": "6031",
      "Block": "Tower 6",
      "Floor": " 3rd Floor"
    },
    {
      "Name": "Gautham",
      "Apartment": "Porur",
      "Contact": "9786907259",
      "Address": "2nd Cross Street, Devi Nagar, Porur",
      "Street": "2nd Cross Street, Devi Nagar, ",
      "Area": "Porur",
      "Instructions": "1 straw"
    },
    {
      "Name": "Ragul",
      "Apartment": "Porur",
      "Contact": "9791169800",
      "Address": "23, Ranganathan Nagar, Kanniyappan Salai, Porur",
      "Door ": "23",
      "Street": "Ranganathan Nagar, Kanniyappan Salai, ",
      "Area": "Porur",
      "Instructions": "Give good nuts"
    },
    {
      "Name": "Abarna",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9944134447",
      "Address": "15B Tower, 9th Floor, 15105",
      "Door ": "15105",
      "Block": "15B Tower",
      "Floor": " 9th Floor",
      "Instructions": "Green Nuts -- Renew?"
    },
    {
      "Name": "Abhinav",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9962586954",
      "Address": "4B, 13th Floor, 4158",
      "Door ": "4158",
      "Block": "4B",
      "Floor": " 13th Floor"
    },
    {
      "Name": "Abirami",
      "Apartment": "Prestige Bella Vista",
      "Contact": "7358638220",
      "Address": "2A Tower, 2nd Floor, 2032",
      "Door ": "2032",
      "Block": "2A Tower",
      "Floor": " 2nd Floor"
    },
    {
      "Name": "Ahmed",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9789479999",
      "Address": "12, 8th Floor, 12092",
      "Door ": "12092",
      "Block": "12",
      "Floor": " 8th Floor"
    },
    {
      "Name": "Amuthan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "Get Number",
      "Address": "17B Tower, 9th Floor, 17107",
      "Door ": "17107",
      "Block": "17B Tower",
      "Floor": " 9th Floor"
    },
    {
      "Name": "Anantharam",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9791036931",
      "Address": "1B Tower, 11th Floor, 1125",
      "Door ": "1125",
      "Block": "1B Tower",
      "Floor": " 11th Floor"
    },
    {
      "Name": "Angeline Mahiba",
      "Apartment": "Prestige Bella Vista",
      "Contact": "7598625380",
      "Address": "20C Tower, 4th Floor, 200512",
      "Door ": "200512",
      "Block": "20C Tower",
      "Floor": " 4th Floor"
    },
    {
      "Name": "Anushka",
      "Apartment": "Prestige Bella Vista",
      "Contact": "6382009070",
      "Address": "6 Tower, 1st Floor, 6024",
      "Door ": "6024",
      "Block": "6 Tower",
      "Floor": " 1st Floor"
    },
    {
      "Name": "Ayushi",
      "Apartment": "Prestige Bella Vista",
      "Contact": "7003170933",
      "Address": "10 Tower, 16th Floor, 10184",
      "Door ": "10184",
      "Block": "10 Tower",
      "Floor": " 16th Floor",
      "Instructions": "Hole - Only water nuts!\nBefore 8:30 AM"
    },
    {
      "Name": "Banu",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9790975202",
      "Address": "11 Tower, 1st Floor, 11022",
      "Door ": "11022",
      "Block": "11 Tower",
      "Floor": " 1st Floor"
    },
    {
      "Name": "Bhuvana",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9500029687",
      "Address": "17B Tower, 5th Floor, 17068",
      "Door ": "17068",
      "Block": "17B Tower",
      "Floor": " 5th Floor",
      "Instructions": "Orange Nuts"
    },
    {
      "Name": "Bopanna MB",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9444903131",
      "Address": "7 Tower, 5th Floor, 7064",
      "Door ": "7064",
      "Block": "7 Tower",
      "Floor": " 5th Floor"
    },
    {
      "Name": "Divya",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9884863536",
      "Address": "13 Tower, 7th Floor, 13081",
      "Door ": "13081",
      "Block": "13 Tower",
      "Floor": " 7th Floor"
    },
    {
      "Name": "Dr. Mathun Ram",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9952476633",
      "Address": "18A Tower, 2nd Floor, 18032",
      "Door ": "18032",
      "Block": "18A Tower",
      "Floor": " 2nd Floor",
      "Instructions": "By 8-8:30, Pro customer TC "
    },
    {
      "Name": "Durga Sridaran",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9841312817",
      "Address": "9A Tower, 4th Floor, 9053",
      "Door ": "9053",
      "Block": "9A Tower",
      "Floor": " 4th Floor"
    },
    {
      "Name": "Farishtha",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9940094684",
      "Address": "7 Tower, 1st Floor, 7024",
      "Door ": "7024",
      "Block": "7 Tower",
      "Floor": " 1st Floor",
      "Instructions": "Take big opener"
    },
    {
      "Name": "Farishtha -- OLD",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9940094684",
      "Address": "5 Tower, 5th Floor, 5063",
      "Door ": "5063",
      "Block": "5 Tower",
      "Floor": " 5th Floor"
    },
    {
      "Name": "Gautham",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9677370302",
      "Address": "20B Tower, 13th Floor, 20156",
      "Door ": "20156",
      "Block": "20B Tower",
      "Floor": " 13th Floor",
      "Instructions": "Orange Nuts"
    },
    {
      "Name": "Gayathri Selvarasan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9791811211",
      "Address": "13 Tower, 11th Floor, 131211",
      "Door ": "131211",
      "Block": "13 Tower",
      "Floor": " 11th Floor",
      "Instructions": "Soft Nuts -- Renew?"
    },
    {
      "Name": "Geetha ",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9884178948",
      "Address": "18C Tower, 14th Floor, 18169",
      "Door ": "18169",
      "Block": "18C Tower",
      "Floor": " 14th Floor",
      "Instructions": "Hole n Open"
    },
    {
      "Name": "Geetha Arun",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9611122207",
      "Address": "9C Tower, 12th Floor,  91411",
      "Door ": "91411",
      "Block": "9C Tower",
      "Floor": " 12th Floor",
      "Instructions": "Give 2 good orange nuts! "
    },
    {
      "Name": "Sundaravalli Mani",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9841014473",
      "Address": "7 Tower, 15th Floor, 7174",
      "Door ": "7174",
      "Block": "7 Tower",
      "Floor": " 15th Floor"
    },
    {
      "Name": "Hina",
      "Apartment": "Prestige Bella Vista",
      "Contact": "7760749664",
      "Address": "17B Tower, 12th Floor, 17146",
      "Door ": "17146",
      "Block": "17B Tower",
      "Floor": " 12th Floor",
      "Instructions": "Place on the door(Don’t ring) "
    },
    {
      "Name": "Indumathi",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9344227431",
      "Address": "9A Tower, 10th Floor, 9114",
      "Door ": "9114",
      "Block": "9A Tower",
      "Floor": " 10th Floor",
      "Instructions": "Orange TC! "
    },
    {
      "Name": "Jai",
      "Apartment": "Prestige Bella Vista",
      "Contact": "8447730540",
      "Address": "10 Tower, 15th Floor, 10171",
      "Door ": "10171",
      "Block": "10 Tower",
      "Floor": " 15th Floor",
      "Instructions": "Renew? PayTm?"
    },
    {
      "Name": "Jaishankar",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9176698859",
      "Address": "9B Tower, 8th Floor, 9097",
      "Door ": "9097",
      "Block": "9B Tower",
      "Floor": " 8th Floor",
      "Instructions": "Small Nuts (pack of 3) -- renew?"
    },
    {
      "Name": "Jawahar",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9560039770",
      "Address": "4A Tower, 10th Floor, 4114",
      "Door ": "4114",
      "Block": "4A Tower",
      "Floor": " 10th Floor",
      "Instructions": "Renew?"
    },
    {
      "Name": "Jayanthi",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9962040261",
      "Address": "4B Tower, 1st Floor, 4025",
      "Door ": "4025",
      "Block": "4B Tower",
      "Floor": " 1st Floor"
    },
    {
      "Name": "John Kennedy",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9790125141",
      "Address": "18B Tower, 2nd Floor, 18038",
      "Door ": "18038",
      "Block": "18B Tower",
      "Floor": " 2nd Floor"
    },
    {
      "Name": "Josephine",
      "Apartment": "Prestige Bella Vista",
      "Contact": "8220727777",
      "Address": "6 Tower, 15th Floor, 6161",
      "Door ": "6161",
      "Block": "6 Tower",
      "Floor": " 15th Floor"
    },
    {
      "Name": "Jothi",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9940155880",
      "Address": "15A Tower, 8th Floor, 15091",
      "Door ": "15091",
      "Block": "15A Tower",
      "Floor": " 8th Floor"
    },
    {
      "Name": "Kartik",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9500128060",
      "Address": "15B Tower, 14th Floor, 15168",
      "Door ": "15168",
      "Block": "15B Tower",
      "Floor": " 14th Floor",
      "Instructions": "1. Easy to open nuts\n2. water with coconut meat\n3. Big nuts\n4. Don’t ring"
    },
    {
      "Name": "Kripa",
      "Apartment": "Prestige Bella Vista",
      "Contact": "8106449004",
      "Address": "19 Tower, 4th Floor, 19052",
      "Door ": "19052",
      "Block": "19 Tower",
      "Floor": " 4th Floor",
      "Instructions": "Easy to open nuts"
    },
    {
      "Name": "Kumaran",
      "Apartment": "Prestige Bella Vista",
      "Address": "11 Tower, 5th Floor, 11061",
      "Door ": "11061",
      "Block": "11 Tower",
      "Floor": " 5th Floor"
    },
    {
      "Name": "Kushboo Singhal",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9940522607",
      "Address": "18A Tower, 16th Floor, 18182",
      "Door ": "18182",
      "Block": "18A Tower",
      "Floor": " 16th Floor"
    },
    {
      "Name": "Lakshmi Narayanan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9894399788",
      "Address": "15B Tower, 8th Floor, 15096",
      "Door ": "15096",
      "Block": "15B Tower",
      "Floor": " 8th Floor",
      "Instructions": "Watery orange nuts"
    },
    {
      "Name": "Lakshmi Priya",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9003718110",
      "Address": "3B Tower, 8th Floor, 3096",
      "Door ": "3096",
      "Block": "3B Tower",
      "Floor": " 8th Floor",
      "Instructions": "Place on the door(Don’t ring) \nSweet Water! "
    },
    {
      "Name": "Lalitha Jayashankar",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9444083391",
      "Address": "19 Tower, 10th Floor, 19112",
      "Door ": "19112",
      "Block": "19 Tower",
      "Floor": " 10th Floor"
    },
    {
      "Name": "Latha",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9962512979",
      "Address": "9B Tower, 5nd Floor, 9068",
      "Door ": "9068",
      "Block": "9B Tower",
      "Floor": " 5nd Floor",
      "Instructions": "Either before 7:15 or after 7:45 -- Renew?"
    },
    {
      "Name": "Lavanya",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9940673535",
      "Address": "19 Tower, 4th Floor, 19054",
      "Door ": "19054",
      "Block": "19 Tower",
      "Floor": " 4th Floor"
    },
    {
      "Name": "Llavanya",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9884720595",
      "Address": "9B Tower, 8th Floor, 9097",
      "Door ": "9097",
      "Block": "9B Tower",
      "Floor": " 8th Floor",
      "Instructions": "Big Nuts Before 7:15"
    },
    {
      "Name": "Lucky",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9943071448",
      "Address": "19 Tower, 3rd Floor, 19043",
      "Door ": "19043",
      "Block": "19 Tower",
      "Floor": " 3rd Floor"
    },
    {
      "Name": "Madhusudhan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9904183353",
      "Address": "9A Tower, 10th Floor, 9111",
      "Door ": "9111",
      "Block": "9A Tower",
      "Floor": " 10th Floor",
      "Instructions": "Easy to open nuts"
    },
    {
      "Name": "Mamtha",
      "Apartment": "Prestige Bella Vista",
      "Contact": "8667275651",
      "Address": "17B Tower, 0th Floor, 17015",
      "Door ": "17015",
      "Block": "17B Tower",
      "Floor": " 0th Floor",
      "Instructions": "Hole & Open"
    },
    {
      "Name": "Mansi",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9962044488",
      "Address": "6 Tower, 11th Floor, 6123",
      "Door ": "6123",
      "Block": "6 Tower",
      "Floor": " 11th Floor"
    },
    {
      "Name": "Mayank Agarwal",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9003326614",
      "Address": "7 Tower, 15th Floor, 7172",
      "Door ": "7172",
      "Block": "7 Tower",
      "Floor": " 15th Floor",
      "Instructions": "Medium hard Nuts"
    },
    {
      "Name": "Mohammed",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9952161126",
      "Address": "1B Tower, 13th Floor, 1158",
      "Door ": "1158",
      "Block": "1B Tower",
      "Floor": " 13th Floor",
      "Instructions": "Water nut"
    },
    {
      "Name": "Mohana",
      "Apartment": "Prestige Bella Vista",
      "Contact": "6379083549",
      "Address": "17B Tower, 4th Floor, 17056",
      "Door ": "17056",
      "Block": "17B Tower",
      "Floor": " 4th Floor"
    },
    {
      "Name": "Mrs. Deepa Sridhar",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9384050505",
      "Address": "2A Tower, 11th Floor, 2122",
      "Door ": "2122",
      "Block": "2A Tower",
      "Floor": " 11th Floor",
      "Instructions": "Between 7 n 8, Sweet n hard nut  HOLE & OPEN -- Renew?"
    },
    {
      "Name": "Mrs. Ramesh",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9080145466",
      "Address": "19 Tower, 13th Floor, 19151",
      "Door ": "19151",
      "Block": "19 Tower",
      "Floor": " 13th Floor",
      "Instructions": "Small Nuts (pack of 3)"
    },
    {
      "Name": "Muhua",
      "Apartment": "Prestige Bella Vista",
      "Contact": "6383243977",
      "Address": "4A Tower, Ground Floor, 4011",
      "Door ": "4011",
      "Block": "4A Tower",
      "Floor": " Ground Floor"
    },
    {
      "Name": "Mullai",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9677167931",
      "Address": "7 Tower, 3rd Floor, 7044",
      "Door ": "7044",
      "Block": "7 Tower",
      "Floor": " 3rd Floor",
      "Instructions": "Customer Test"
    },
    {
      "Name": "Muthu",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9894579240",
      "Address": "8 Tower, 9th Floor, 8103",
      "Door ": "8103",
      "Block": "8 Tower",
      "Floor": " 9th Floor",
      "Instructions": "Renew?"
    },
    {
      "Name": "Nandhakumar",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9840465975",
      "Address": "15B Tower, 1st Floor, 15028",
      "Door ": "15028",
      "Block": "15B Tower",
      "Floor": " 1st Floor"
    },
    {
      "Name": "Nandini",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9791967924",
      "Address": "9C Tower, 11th Floor, 91211",
      "Door ": "91211",
      "Block": "9C Tower",
      "Floor": " 11th Floor",
      "Instructions": "Sweet Water"
    },
    {
      "Name": "Neha",
      "Apartment": "Prestige Bella Vista",
      "Contact": "7397294845",
      "Address": "11 Tower, 16th Floor, 11182",
      "Door ": "11182",
      "Block": "11 Tower",
      "Floor": " 16th Floor",
      "Instructions": "Renew?"
    },
    {
      "Name": "Nellaiappan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9841040939",
      "Address": "11 Tower, 5th Floor, 11064",
      "Door ": "11064",
      "Block": "11 Tower",
      "Floor": " 5th Floor",
      "Instructions": "Green Nuts open oldbalance 35"
    },
    {
      "Name": "Nishanth",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9942991117",
      "Address": "2B Tower, 8th Floor, 2096",
      "Door ": "2096",
      "Block": "2B Tower",
      "Floor": " 8th Floor",
      "Instructions": "Hole n Open"
    },
    {
      "Name": "Nithya",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9446565205",
      "Address": "17B Tower, 4th Floor, 17058",
      "Door ": "17058",
      "Block": "17B Tower",
      "Floor": " 4th Floor",
      "Instructions": "Medium hard n sweet nuts\n"
    },
    {
      "Name": "Padma",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9080331363",
      "Address": "20B Tower, 9th Floor,  20108",
      "Door ": "20108",
      "Block": "20B Tower",
      "Floor": " 9th Floor",
      "Instructions": "Small Nuts (pack of 3)"
    },
    {
      "Name": "Palak",
      "Apartment": "Prestige Bella Vista",
      "Contact": "990880883",
      "Address": "18A Tower, 14th Floor, 18163",
      "Door ": "18163",
      "Block": "18A Tower",
      "Floor": " 14th Floor",
      "Instructions": "Prev balance 350"
    },
    {
      "Name": "Parthasarathy AR",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9884710106",
      "Address": "9A Tower, 2nd Floor, 9033",
      "Door ": "9033",
      "Block": "9A Tower",
      "Floor": " 2nd Floor",
      "Instructions": "2 straws per day! "
    },
    {
      "Name": "Pavithra Palanisamy",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9840717270",
      "Address": "16A Tower, 3rd Floor, 16043",
      "Door ": "16043",
      "Block": "16A Tower",
      "Floor": " 3rd Floor"
    },
    {
      "Name": "Poojith",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9493222309",
      "Address": "14, 12th Floor, 14145",
      "Door ": "14145",
      "Block": "14",
      "Floor": " 12th Floor",
      "Instructions": "Green Nuts --- Renew?"
    },
    {
      "Name": "Prabaharan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9902001476",
      "Address": "16A Tower, 7th Floor, 16081",
      "Door ": "16081",
      "Block": "16A Tower",
      "Floor": " 7th Floor"
    },
    {
      "Name": "Pratima",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9821920927",
      "Address": "10 Tower, 5th Floor, 10064",
      "Door ": "10064",
      "Block": "10 Tower",
      "Floor": " 5th Floor"
    },
    {
      "Name": "Preetha",
      "Apartment": "Prestige Bella Vista",
      "Contact": "8056272443",
      "Address": "15B, 9th Floor, 15108",
      "Door ": "15108",
      "Block": "15B",
      "Floor": " 9th Floor",
      "Instructions": "Orange Nuts"
    },
    {
      "Name": "Prithi",
      "Apartment": "Prestige Bella Vista",
      "Contact": "8939332480",
      "Address": "12 Tower, 1st Floor, 120210",
      "Door ": "120210",
      "Block": "12 Tower",
      "Floor": " 1st Floor",
      "Instructions": "Please collect cash!"
    },
    {
      "Name": "Raghuram",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9840061616",
      "Address": "18C Tower, 16th Floor, 18189",
      "Door ": "18189",
      "Block": "18C Tower",
      "Floor": " 16th Floor"
    },
    {
      "Name": "Raj",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9677844318",
      "Address": "3A Tower, 1st Floor, 3024",
      "Door ": "3024",
      "Block": "3A Tower",
      "Floor": " 1st Floor",
      "Instructions": "4 straws"
    },
    {
      "Name": "Rajakumar",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9884096982",
      "Address": "9A Tower, 9th Floor, 9101",
      "Door ": "9101",
      "Block": "9A Tower",
      "Floor": " 9th Floor",
      "Instructions": "Hole n Open"
    },
    {
      "Name": "Rajesh",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9003093888",
      "Address": "4B Tower, 4095",
      "Block": "4B Tower",
      "Floor": "4095"
    },
    {
      "Name": "Rajeshwari Karthikeyan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "7010632124",
      "Address": "20B Tower, 9th Floor, 20105",
      "Door ": "20105",
      "Block": "20B Tower",
      "Floor": " 9th Floor",
      "Instructions": "Tasty water"
    },
    {
      "Name": "Raju",
      "Apartment": "Prestige Bella Vista",
      "Contact": "8500856789",
      "Address": "19 Tower, 5th Floor, 19062",
      "Door ": "19062",
      "Block": "19 Tower",
      "Floor": " 5th Floor",
      "Instructions": "Before 6:45"
    },
    {
      "Name": "Ramkumar",
      "Apartment": "Prestige Bella Vista",
      "Contact": "8056122425",
      "Address": "9B Tower, 14th Floor, 9166",
      "Door ": "9166",
      "Block": "9B Tower",
      "Floor": " 14th Floor",
      "Instructions": "Orange Nuts - old balance 150"
    },
    {
      "Name": "Ramya Krishnan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9176631115",
      "Address": "17B Tower, 14th Floor, 17167",
      "Door ": "17167",
      "Block": "17B Tower",
      "Floor": " 14th Floor"
    },
    {
      "Name": "Ravi Kumar",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9629276508",
      "Address": "17A Tower, ground Floor, 17013",
      "Door ": "17013",
      "Block": "17A Tower",
      "Floor": " ground Floor",
      "Instructions": "By 7 am please! Hole n open"
    },
    {
      "Name": "Sai sudha",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9940645860",
      "Address": "20C Tower, 5th Floor, 200610",
      "Door ": "200610",
      "Block": "20C Tower",
      "Floor": " 5th Floor"
    },
    {
      "Name": "Sandeep Reddy",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9110576979",
      "Address": "2A Tower, 2nd Floor,  2031",
      "Door ": "2031",
      "Block": "2A Tower",
      "Floor": " 2nd Floor",
      "Instructions": "Remaining 3"
    },
    {
      "Name": "Sangeetha balasubramani",
      "Apartment": "Prestige Bella Vista",
      "Contact": "8925623047",
      "Address": "16B Tower, 15th Floor, 16168",
      "Door ": "16168",
      "Block": "16B Tower",
      "Floor": " 15th Floor"
    },
    {
      "Name": "Saravanan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9500099559",
      "Address": "17B Tower, 9th Floor, 17105",
      "Door ": "17105",
      "Block": "17B Tower",
      "Floor": " 9th Floor",
      "Instructions": "till 12th Oct"
    },
    {
      "Name": "Sargunam",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9894010394",
      "Address": "16A Tower, 3rd Floor, 16042",
      "Door ": "16042",
      "Block": "16A Tower",
      "Floor": " 3rd Floor"
    },
    {
      "Name": "Sathya Narayanan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9099036252",
      "Address": "15A Tower, 15th Floor, 15171",
      "Door ": "15171",
      "Block": "15A Tower",
      "Floor": " 15th Floor",
      "Instructions": "Give the youngest nut WITHOUT MEAT "
    },
    {
      "Name": "Sembian",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9987557967",
      "Address": "18A Tower, 4th Floor, 18052",
      "Door ": "18052",
      "Block": "18A Tower",
      "Floor": " 4th Floor"
    },
    {
      "Name": "Shweta Rai",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9840867255",
      "Address": "1A Tower, 15th Floor, 1172",
      "Door ": "1172",
      "Block": "1A Tower",
      "Floor": " 15th Floor"
    },
    {
      "Name": "Sivaprakash",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9942795240",
      "Address": "7 Tower, 10th Floor, 7111",
      "Door ": "7111",
      "Block": "7 Tower",
      "Floor": " 10th Floor",
      "Instructions": "One Straw!"
    },
    {
      "Name": "Sivapriya",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9944095349",
      "Address": "16A Tower, 13th Floor, 16152",
      "Door ": "16152",
      "Block": "16A Tower",
      "Floor": " 13th Floor"
    },
    {
      "Name": "Sravani",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9818115742",
      "Address": "13 Tower, 16th Floor, 13188",
      "Door ": "13188",
      "Block": "13 Tower",
      "Floor": " 16th Floor",
      "Instructions": "Give younger nut or closely cut harder nuts!"
    },
    {
      "Name": "Sri Sai Varun",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9600954694",
      "Address": "18A Tower, 4th Floor, 18053",
      "Door ": "18053",
      "Block": "18A Tower",
      "Floor": " 4th Floor",
      "Instructions": "Easy to open nuts"
    },
    {
      "Name": "Srilatha",
      "Apartment": "Prestige Bella Vista",
      "Contact": "7032123870",
      "Address": "9B Tower, 14th Floor, 9168",
      "Door ": "9168",
      "Block": "9B Tower",
      "Floor": " 14th Floor"
    },
    {
      "Name": "Sriram",
      "Apartment": "Prestige Bella Vista",
      "Contact": "8637658347",
      "Address": "20A Tower, 2nd Floor, 20031",
      "Door ": "20031",
      "Block": "20A Tower",
      "Floor": " 2nd Floor"
    },
    {
      "Name": "Subin",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9940070573",
      "Address": "14 Tower, 16th Floor, 141812",
      "Door ": "141812",
      "Block": "14 Tower",
      "Floor": " 16th Floor",
      "Instructions": "Green Nuts  "
    },
    {
      "Name": "Subramanian",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9840668986",
      "Address": "16A Tower, 15th Floor, 16172",
      "Door ": "16172",
      "Block": "16A Tower",
      "Floor": " 15th Floor",
      "Instructions": "Sweet Water "
    },
    {
      "Name": "Sudeep Agarwal",
      "Apartment": "Prestige Bella Vista",
      "Contact": "7835052434",
      "Address": "12 Tower, 9th Floor,  121011",
      "Door ": "121011",
      "Block": "12 Tower",
      "Floor": " 9th Floor"
    },
    {
      "Name": "Sudha",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9600169950",
      "Address": "13 Tower, 8th Floor, 130910",
      "Door ": "130910",
      "Block": "13 Tower",
      "Floor": " 8th Floor",
      "Instructions": "New Customer (Light coconut meat) \nhole and Open (Previous balance 150)"
    },
    {
      "Name": "Sundararajan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9940022849",
      "Address": "11 Tower, 2nd Floor, 11031",
      "Door ": "11031",
      "Block": "11 Tower",
      "Floor": " 2nd Floor",
      "Instructions": "Before 7:30, Hole n Open"
    },
    {
      "Name": "Supra",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9442628610",
      "Address": "3B Tower, 1st Floor, 3025",
      "Door ": "3025",
      "Block": "3B Tower",
      "Floor": " 1st Floor",
      "Instructions": "Prev Balance 900 Collect 900"
    },
    {
      "Name": "Susheela",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9820900461",
      "Address": "2A Tower, 10th Floor,  2111",
      "Door ": "2111",
      "Block": "2A Tower",
      "Floor": " 10th Floor"
    },
    {
      "Name": "Suyamprakash",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9444964126",
      "Address": "3B, 1st Floor, 3028",
      "Door ": "3028",
      "Block": "3B",
      "Floor": " 1st Floor"
    },
    {
      "Name": "Tarika",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9663133055",
      "Address": "10 Tower, 15th Floor, 10174",
      "Door ": "10174",
      "Block": "10 Tower",
      "Floor": " 15th Floor"
    },
    {
      "Name": "Thilakavathi",
      "Apartment": "Prestige Bella Vista",
      "Address": "13 Tower, 11th Floor, 131211",
      "Door ": "131211",
      "Block": "13 Tower",
      "Floor": " 11th Floor"
    },
    {
      "Name": "Thilakavathi",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9965535611",
      "Address": "19 Tower, 10th Floor, 19111",
      "Door ": "19111",
      "Block": "19 Tower",
      "Floor": " 10th Floor",
      "Instructions": "Orange Nuts"
    },
    {
      "Name": "Uma Maheshwari Sriram",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9943167878",
      "Address": "15B Tower, 13th Floor, 15155",
      "Door ": "15155",
      "Block": "15B Tower",
      "Floor": " 13th Floor"
    },
    {
      "Name": "Unknown (Get name)",
      "Apartment": "Prestige Bella Vista",
      "Contact": "7550134803",
      "Address": "13 Tower, 5th Floor, 13061",
      "Door ": "13061",
      "Block": "13 Tower",
      "Floor": " 5th Floor"
    },
    {
      "Name": "Usha",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9940078076",
      "Address": "18C Tower, 2nd Floor, 18039",
      "Door ": "18039",
      "Block": "18C Tower",
      "Floor": " 2nd Floor"
    },
    {
      "Name": "Usharani Anbazhagan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "7358732153",
      "Address": "2A Tower, 14th Floor, 2153",
      "Door ": "2153",
      "Block": "2A Tower",
      "Floor": " 14th Floor",
      "Instructions": "Small nuts"
    },
    {
      "Name": "Vaishnavi",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9600030869",
      "Address": "4A, 7th Floor, 4082",
      "Door ": "4082",
      "Block": "4A",
      "Floor": " 7th Floor",
      "Instructions": "Renew?"
    },
    {
      "Name": "Vani",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9561489568",
      "Address": "5 Tower, 13th Floor, 5153",
      "Door ": "5153",
      "Block": "5 Tower",
      "Floor": " 13th Floor",
      "Instructions": "Hole n Open"
    },
    {
      "Name": "Velumani",
      "Apartment": "Prestige Bella Vista",
      "Contact": "8870014113",
      "Address": "19th Tower, 15th Floor, 19172",
      "Door ": "19172",
      "Block": "19th Tower",
      "Floor": " 15th Floor",
      "Instructions": "Don’t cut bottom "
    },
    {
      "Name": "Vidhya ",
      "Apartment": "Prestige Bella Vista",
      "Contact": "8637419276",
      "Address": "9A Tower, 15th Floor, 9173",
      "Door ": "9173",
      "Block": "9A Tower",
      "Floor": " 15th Floor",
      "Instructions": "Orange Nuts"
    },
    {
      "Name": "Vidya  ",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9553656665",
      "Address": "4B Tower, 10th Floor, 4115",
      "Door ": "4115",
      "Block": "4B Tower",
      "Floor": " 10th Floor"
    },
    {
      "Name": "Vidya Swaminathan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9884094456",
      "Address": "20B Tower, 13th Floor, 20158",
      "Door ": "20158",
      "Block": "20B Tower",
      "Floor": " 13th Floor",
      "Instructions": "3 Straws"
    },
    {
      "Name": "Vikas Radhakrishnan",
      "Apartment": "Prestige Bella Vista",
      "Contact": "9962554258",
      "Address": "18B Tower, 15th Floor, 18176",
      "Door ": "18176",
      "Block": "18B Tower",
      "Floor": " 15th Floor",
      "Instructions": "2 Straws per day! "
    },
    {
      "Name": "Chanreyee Mitra",
      "Apartment": "Prince Green Woods",
      "Contact": "9840178228",
      "Address": "Cypress, Blk A, 102, 1st Flr",
      "Door ": "102",
      "Block": "Block A",
      "Floor": "1st Floor",
      "Instructions": "Hole n Open -- Green Nuts -- Renew?"
    },
    {
      "Name": "Unknown",
      "Apartment": "Prince Green Woods",
      "Contact": "9884074084",
      "Address": "Larch, 303, 3rd Flr",
      "Door ": "303",
      "Block": "Larch",
      "Floor": " 3rd Flr"
    },
    {
      "Name": "S. Sankar",
      "Apartment": "S & P Garden",
      "Contact": "8072397639",
      "Address": "140 B",
      "Door ": "104",
      "Block": "Block B",
      "Instructions": "Water nut by 6:30"
    },
    {
      "Name": "Subramaniyan",
      "Apartment": "S & P Garden",
      "Contact": "9551309979",
      "Address": "173",
      "Door ": "173"
    },
    {
      "Name": "Krishna Priya",
      "Apartment": "S&P Living Spaces",
      "Contact": "8610118162",
      "Address": "302, 3rd Floor, Block T,\nKamarajar Street, Ayanambakkam",
      "Door ": "302",
      "Block": "Block T",
      "Floor": "3rd Floor",
      "Instructions": "Give only water nuts"
    },
    {
      "Name": "Vaasil",
      "Apartment": "Siddharth Upscale",
      "Contact": "9003121721",
      "Address": "D307",
      "Door ": "D307",
      "Instructions": "Reference Info?"
    },
    {
      "Name": "Farzana",
      "Apartment": "Sky City ",
      "Contact": "7904926349",
      "Address": "Tower 5, 3rd Floor, 303",
      "Door ": "303",
      "Block": "Tower 5",
      "Floor": " 3rd Floor"
    },
    {
      "Name": "Lakshmanan",
      "Apartment": "Sky City ",
      "Contact": "9444230021",
      "Address": "Tower 24, 4th Floor, 403",
      "Door ": "403",
      "Block": "Tower 24",
      "Floor": " 4th Floor"
    },
    {
      "Name": "Rajalakshmi",
      "Apartment": "Sky City ",
      "Contact": "7397393988",
      "Address": "Tower 10, 4th Floor, 402",
      "Door ": "402",
      "Block": "Tower 10",
      "Floor": " 4th Floor",
      "Instructions": "Inform about price change Before 8:15"
    },
    {
      "Name": "Rajendra",
      "Apartment": "Sky City ",
      "Contact": "9962393222",
      "Address": "Tower 13, 4th Floor, 402",
      "Door ": "402",
      "Block": "Tower 13",
      "Floor": " 4th Floor"
    },
    {
      "Name": "Soumya",
      "Apartment": "Sky City ",
      "Contact": "7683877683",
      "Address": "Tower 3, 3rd Floor, 303",
      "Door ": "303",
      "Block": "Tower 3",
      "Floor": " 3rd Floor",
      "Instructions": "hole CARD"
    },
    {
      "Name": "Vijay ",
      "Apartment": "Sky City ",
      "Contact": "9600095967",
      "Address": "Tower 8, 1st Floor, 101",
      "Door ": "101",
      "Block": "Tower 8",
      "Floor": " 1st Floor"
    },
    {
      "Name": "Anbu Selvi",
      "Apartment": "Sky Dugar Homes",
      "Contact": "9790886577",
      "Address": "Tower 9, 302",
      "Door ": "302",
      "Block": "Tower 9",
      "Floor": "3rd Floor",
      "Instructions": "Hole & Open --- Sweet water  - \nCollect Payment"
    },
    {
      "Name": "Karthick",
      "Apartment": "Sky Dugar Homes",
      "Contact": "9962245106",
      "Address": "Tower 8, 101",
      "Door ": "101",
      "Block": "Tower 8",
      "Floor": "1st Floor"
    },
    {
      "Name": "Prasant",
      "Apartment": "Sky Dugar Homes",
      "Contact": "9790840834",
      "Address": "Tower 5, 302",
      "Door ": "302",
      "Block": "Tower 5",
      "Floor": "3rd Floor",
      "Instructions": "Hole & Open --- Sweet water"
    },
    {
      "Name": "Shailaja",
      "Apartment": "Sky Dugar Homes",
      "Contact": "9840751533",
      "Address": "Tower 5, 301",
      "Door ": "301",
      "Block": "Tower 5",
      "Floor": "3rd Floor"
    },
    {
      "Name": "Sri latha",
      "Apartment": "Sky Dugar Homes",
      "Contact": "9597965041",
      "Address": "Tower 9, 403",
      "Door ": "403",
      "Block": "Tower 9",
      "Floor": "4th Floor",
      "Instructions": "Small nuts"
    },
    {
      "Name": "Suresh K Raman",
      "Apartment": "Sky Dugar Homes",
      "Contact": "9566070986",
      "Address": "Tower 12, 212",
      "Door ": "212",
      "Block": "Tower 12",
      "Floor": "2nd Floor"
    },
    {
      "Name": "Ali Imran",
      "Apartment": "SNSS White Petals",
      "Contact": "9600940644",
      "Address": "Block F, 2nd Floor, S1",
      "Door ": " S1",
      "Block": "Block F",
      "Floor": " 2nd Floor"
    },
    {
      "Name": "Gokulkumar",
      "Apartment": "SNSS White Petals",
      "Contact": "9677063210",
      "Address": "Block H, 2nd Floor, S1",
      "Door ": " S1",
      "Block": "Block H",
      "Floor": " 2nd Floor",
      "Instructions": "3 remaining"
    },
    {
      "Name": "Gayathri",
      "Apartment": "Sreshta Riverside",
      "Contact": "9047199755",
      "Address": "3/2, Wood Creek Road, Nandambakkam",
      "Door ": "3/2",
      "Street": " Wood Creek Road",
      "Area": " Nandambakkam",
      "Instructions": "Green Nuts --- Google \"Sreshta Riverside\""
    },
    {
      "Name": "Priyank",
      "Apartment": "Sterling Ganges",
      "Contact": "8800506494",
      "Address": "D-32",
      "Door ": "32",
      "Block": "Block D"
    },
    {
      "Name": "Rubini",
      "Apartment": "Sterling Ganges",
      "Contact": "9843643342",
      "Address": "H-21",
      "Door ": "21",
      "Block": "Block H"
    },
    {
      "Name": "Durga  ",
      "Apartment": "Sterling Pradhan",
      "Contact": "9884918329",
      "Address": "Varsha F-C\nRajankuppam, Ayanambakkam",
      "Door ": "Varsha F-C",
      "Street": "Rajankuppam, ",
      "Area": "Ayanambakkam",
      "Instructions": "2 straws each day!"
    },
    {
      "Name": "Jeya",
      "Apartment": "Sunstone Appartment",
      "Contact": "9176828408",
      "Address": "CS6",
      "Door ": "CS6"
    },
    {
      "Name": "Alex Antony",
      "Apartment": "Swara Appartment",
      "Contact": "9751091812",
      "Address": "B208, 1st St, Moovendhar Nagar,\nBalaji nagar Extn, Pillayar Madathangal, Kattupakkam",
      "Door ": "208",
      "Block": "Block B",
      "Floor": "2nd Floor",
      "Street": " 1st St",
      "Area": " Moovendhar Nagar"
    },
    {
      "Name": "Arun",
      "Apartment": "Swara Appartment",
      "Contact": "9884415224",
      "Address": "C305, 1st St, Moovendhar Nagar,\nBalaji nagar Extn, Pillayar Madathangal, Kattupakkam",
      "Door ": "305",
      "Block": "Block C",
      "Floor": "3rd Floor",
      "Street": " 1st St",
      "Area": " Moovendhar Nagar",
      "Instructions": "Renew?"
    },
    {
      "Name": "Sakthi",
      "Apartment": "Swara Appartment",
      "Contact": "9894700013",
      "Address": "A301, 1st St, Moovendhar Nagar,\nBalaji nagar Extn, Pillayar Madathangal, Kattupakkam",
      "Door ": "301",
      "Block": "Block A",
      "Floor": "3rd Floor",
      "Street": " 1st St",
      "Area": " Moovendhar Nagar"
    },
    {
      "Name": "Vignesh",
      "Apartment": "TVS Colony, Annanagar west",
      "Contact": "7299920920",
      "Address": "1178-A, G2 - 58th St, ",
      "Door ": "1178-A",
      "Block": "Block G2",
      "Floor": " ",
      "Street": "58th St",
      "Instructions": "+2 straws"
    },
    {
      "Name": "Krishnadas EP",
      "Apartment": "VGN-Avenue",
      "Contact": "9092644987",
      "Address": "46, Seneerkuppam,\n Near Anjaneyar Temple",
      "Door ": "46",
      "Area": " Seneerkuppam",
      "Landmark": "Near Anjaneyar Temple",
      "Instructions": "Same time!"
    },
    {
      "Name": "Aswin Raj",
      "Apartment": "VGN-Minerva",
      "Contact": "9597277084",
      "Address": "A4,T1",
      "Door ": "T1",
      "Block": "A4",
      "Floor": "3rd Floor",
      "Instructions": "Renew?"
    },
    {
      "Name": "Kishore Reddy",
      "Apartment": "VGN-Minerva",
      "Contact": "9440223823",
      "Address": "E1,T4",
      "Door ": "T4",
      "Block": "E1",
      "Floor": "3rd Floor"
    },
    {
      "Name": "Gomathi",
      "Apartment": "VGN-Minerva",
      "Contact": "9962090607",
      "Address": "F2, F3",
      "Door ": " F3",
      "Block": "F2",
      "Floor": "1st Floor",
      "Instructions": "Big Nuts"
    },
    {
      "Name": "Jaslin",
      "Apartment": "VGN-Minerva",
      "Contact": "9600635830",
      "Address": "H2,S3",
      "Door ": "S3",
      "Block": "H2",
      "Floor": "2nd Floor"
    },
    {
      "Name": "Manish",
      "Apartment": "VGN-Minerva",
      "Contact": "7014397146",
      "Address": "J2,T3",
      "Door ": "T3",
      "Block": "J2",
      "Floor": "3rd Floor",
      "Instructions": "Don’t ring, keep near shoe rack \n--- Green Nuts -- Renew?"
    },
    {
      "Name": "Nganavathy",
      "Apartment": "VGN-Minerva",
      "Contact": "9710420344",
      "Address": "H1,F2",
      "Door ": "F2",
      "Block": "H1",
      "Floor": "1st Floor"
    },
    {
      "Name": "Nitin Nayak",
      "Apartment": "VGN-Minerva",
      "Contact": "7845097977",
      "Address": "J1,T2",
      "Door ": "T2",
      "Block": "J1",
      "Floor": "3rd Floor"
    },
    {
      "Name": "Ponnana",
      "Apartment": "VGN-Minerva",
      "Contact": "9841970077",
      "Address": "H2,S2",
      "Door ": "S2",
      "Block": "H2",
      "Floor": "2nd Floor",
      "Instructions": "Don’t ring, give a call"
    },
    {
      "Name": "Prakash",
      "Apartment": "VGN-Minerva",
      "Contact": "9941873025",
      "Address": "J1,S1",
      "Door ": "S1",
      "Block": "J1",
      "Floor": "2nd Floor",
      "Instructions": "Place on the door(Don’t ring) "
    },
    {
      "Name": "Rahul Saxena",
      "Apartment": "VGN-Minerva",
      "Contact": "9644064147",
      "Address": "F2, 1",
      "Door ": "1",
      "Block": "F2",
      "Floor": "1st Floor",
      "Instructions": "Place on the door(Don’t ring) "
    },
    {
      "Name": "Sanjeev Sharma",
      "Apartment": "VGN-Minerva",
      "Contact": "9884058887",
      "Address": "J1, Fth1",
      "Door ": " Fth1",
      "Block": "J1",
      "Floor": "4th Floor",
      "Instructions": "Renew?"
    },
    {
      "Name": "Shanthi",
      "Apartment": "VGN-Minerva",
      "Contact": "9566050433",
      "Address": "J1, S3",
      "Door ": " S3",
      "Block": "J1",
      "Floor": "2nd Floor",
      "Instructions": "Renew?"
    },
    {
      "Name": "Srilakshmi",
      "Apartment": "VGN-Minerva",
      "Contact": "9445586868",
      "Address": "A4,F2",
      "Door ": "F2",
      "Block": "A4",
      "Floor": "1st Floor",
      "Instructions": "Deliver to Apollo Hospital!"
    },
    {
      "Name": "Suresh Meel",
      "Apartment": "VGN-Minerva",
      "Contact": "9884101097",
      "Address": "J1, T1",
      "Door ": " T1",
      "Block": "J1",
      "Floor": "3rd Floor",
      "Instructions": "Renew?"
    },
    {
      "Name": "Unknown",
      "Apartment": "VGN-Minerva",
      "Contact": "9840632826",
      "Address": "F2,",
      "Block": "F2",
      "Floor": "1st Floor"
    },
    {
      "Name": "Vikas Mittal",
      "Apartment": "VGN-Minerva",
      "Contact": "9840886080",
      "Address": "A2,S2",
      "Door ": "S2",
      "Block": "A2",
      "Floor": "2nd Floor"
    },
    {
      "Name": "VK Guptha",
      "Apartment": "VGN-Minerva",
      "Contact": "7904348078",
      "Address": "H1,Fth2",
      "Door ": "Fth2",
      "Block": "H1",
      "Floor": "4th Floor"
    },
    {
      "Name": "Nikita Beniwal",
      "Apartment": "XS Real - La Celeste",
      "Contact": "9789714406",
      "Address": "P5-B4A",
      "Door ": "B4A",
      "Block": "P5-B",
      "Floor": "4th Floor"
    },
    {
      "Name": "Sheetal",
      "Apartment": "XS Real - La Celeste",
      "Contact": "9884038807",
      "Address": "P1-D2D",
      "Door ": "D2D",
      "Block": "P1-D",
      "Floor": "2nd Floor",
      "Instructions": "Customer Test - Good nuts daily - Renew?"
    },
    {
      "Name": "Sourav",
      "Apartment": "XS Real - La Celeste",
      "Contact": "9940273868",
      "Address": "P1-A3B",
      "Door ": "A3B",
      "Block": "P1-A",
      "Floor": "3rd Floor"
    }
  ]

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
    //   // console.log(data);
    //   // debugger;

    //  // "id": vals.mobile,
    //   // "email": emailVal,
    //   // "name": vals.name,
    //   // "address": {
    //   //   "apartment": vals.apartment || "",
    //   //   "block": vals.block || "",
    //   //   "floor": vals.floor || "",
    //   //   "door": vals.door || "",
    //   //   "area": areaLabel || "",
    //   //   "street": vals.street || "",
    //   //   "type": typeLabel,
    //   //   "inst": vals.inst || "",
    //   // },

    //   this.firebase.adminWriteUserAddress({
    //     "id": data.Contact,
    //     "email": "",
    //     "name": data.Name,
    //     "address": {
    //         "apartment": data.Apartment || "",
    //       "block": data.Block || "",
    //       "floor": data.Floor || "",
    //       "door": data.Door || "",
    //       "area": data.Area || "",
    //       "street": data.Address || "",
    //       "type": "",
    //       "inst": data.Instructions || "",
    //     },
    //     "active": "no ",
    //   }, (result) => {
    //     console.log("user info writew");
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
      apartment: ['', Validators.minLength(3)],
      block: ['', Validators.minLength(1)],
      floor: ['', Validators.minLength(1)],
      door: ['', Validators.minLength(1)],
      street: ['', Validators.minLength(3)],
      landmark: ['', Validators.minLength(3)],
      inst: ['', Validators.minLength(3)],
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
        "apartment": vals.apartment || "",
        "block": vals.block || "",
        "floor": vals.floor || "",
        "door": vals.door || "",
        "area": areaLabel || "",
        "street": vals.street || "",
        "type": typeLabel,
        "inst": vals.inst || "",
      },
      // "door": vals.door,
      // "floor": vals.floor,
      // "block": vals.block,
      // "landmark": vals.landmark || "",
      // "pincode": vals.pincode || "",
      // "area": areaLabel || "",
      // "aprtment": vals.apartment || "",
      // "inst": vals.inst || "",
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

