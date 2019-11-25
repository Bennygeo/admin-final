import { Injectable } from '@angular/core';

@Injectable()
export class Utils {
    monthNames: Array<string>;
    weekdays: Array<string>;
    monthName: Object;
    weeks: Object;
    orderService: number;
    todayNo: number;
    todayDate: Date;
    todayString: string;

    constructor(
    ) {
        // this.orderService = (this._localStorage.getItem("itemPrice")) ? (this._localStorage.getItem("itemPrice")) : 1;
        this.todayDate = new Date();
        this.todayNo = this.todayDate.getDay();


        this.monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        this.weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        this.todayString = this.weekdays[this.todayNo];
    }

    static trace = console.log;

    public formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    generateRandomNumber(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }
    static getDate(divider): string {
        var today = new Date();
        return today.getDate() + divider + (today.getMonth() + 1) + divider + today.getFullYear();
    }

    sortDateObject(obj, dateUtils) {
        // debugger;
        let order_length = Object.keys(obj.dates).length - 1;

        let sort_date_ary = [];
        let tmp = Object.keys(obj.dates);
        for (let j = 0; j <= order_length; j++) {
            sort_date_ary.push(new Date(dateUtils.stdDateFormater(dateUtils.dateFormater(tmp[j], "-"), "/")));
        }
        
           // /* Do sort the dates array */
        sort_date_ary.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return a.getTime() - b.getTime();
        });

        return {
            "start_date": sort_date_ary[0],
            "end_date": sort_date_ary[sort_date_ary.length - 1],
        }
    }
}


export class UserDetails {
    name: string;
    email: string;
    mobile: string;
    address: string;
    area: string;
    history: OrderDetails;
    mobileNo: number;
    constructor(

    ) { }
}

export class OrderDetails {
    start: string;
    end: string;
    quantity: number;
    straw: boolean;
    price: number;
    constructor(
    ) { }
}

export class Globals {
    constructor() {

    }

    public static Places: Places[] = [
        { value: 'Nandambakkam', viewValue: 'Nandambakkam' },
        { value: 'Kattupakkam', viewValue: 'Kattupakkam' },
        { value: 'Mogappair', viewValue: 'Mogappair' },
        { value: 'Porur', viewValue: 'Porur' },
        { value: 'Mugalivakkam', viewValue: 'Mugalivakkam' },
        { value: 'Nolambur', viewValue: 'Nolambur' },
        { value: 'Other', viewValue: 'Other' }
    ];

    public static account_validation_messages: any = {
        'username': [
            { type: 'required', message: 'Username is required' },
            { type: 'minlength', message: 'Username must be at least 5 characters long' },
            { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
            { type: 'pattern', message: 'Your username must contain only numbers and letters' },
        ],
        'email': [
            { type: 'required', message: 'Email is required' },
            { type: 'pattern', message: 'Enter a valid email' }
        ]
    }
}

export class Places {
    value: string;
    viewValue: string;
}

export interface NuType {
    value: string;
    viewValue: number;
    price: number;
    minCount: number;
}



