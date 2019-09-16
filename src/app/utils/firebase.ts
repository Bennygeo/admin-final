import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';

export class FireBase implements OnInit {

    itemValue = '';
    items: Observable<any[]>;
    test: Observable<any[]>;
    database_obs: any;

    constructor(private db: AngularFireDatabase) {
    }

    ngOnInit(): void {

    }

    public readUsers() {
        console.log("read data");
        return new Observable((observer) => {
            var ref = this.db.database.ref('/users_info');
            ref.on("value", function (snapshot) {
                observer.next(snapshot.exportVal());
            });
        });
    }

    public readLoginDetails() {
        return new Observable((observer) => {
            var ref = this.db.database.ref('/login');
            ref.on("value", function (snapshot) {
                observer.next(snapshot.exportVal());
            });
        });
    }

    readDeliverBoys() {
        return new Observable((observer) => {
            var ref = this.db.database.ref('/delivery_boys');
            ref.on("value", function (snapshot) {
                observer.next(snapshot.exportVal());
            });
        });
    }

    public readOrders(id) {
        return new Observable((observer) => {
            var ref = this.db.database.ref("users_info/" + id + '/history/');
            ref.on("value", function (snapshot) {
                observer.next(snapshot.exportVal());
            });
        });
    }

    public readLastOrder(id, lastID) {
        return new Observable((observer) => {
            var ref = this.db.database.ref("users_info/" + id + '/history/' + lastID);
            ref.on("value", function (snapshot) {
                observer.next(snapshot.exportVal());
            });
        });
    }

    public readDailyOrders(date) {
        // console.log("readDailyOrders");
        return new Observable((observer) => {
            var ref = this.db.database.ref("orders/" + date);
            ref.on("value", function (snapshot) {
                observer.next(snapshot.exportVal());
            });
        });
    }

    public writeDailyOrders(mobile, date, data) {
        this.db.database.ref("orders/" + date).update({
            [mobile + '/tender/']: data
        }, (err) => {
            if (err) console.log("The write failed... :: writeDailyOrders");
            else console.log("Data saved successfully!");
        });
    }

    public writeUserMobileNumber(obj) {
        this.db.database.ref('/users/' + obj.id).push({
            mobile: obj.mobile
        }, (error) => {
            if (error) console.log("The write failed...");
            else console.log("Data saved successfully!");
        });
    }

    public writeUserAddress(obj, locId) {
        console.log("write data");
        this.db.database.ref('/users/' + obj.id + '/address/').update({
            ['address' + locId]: JSON.stringify(obj.address)
        }, (error) => {
            if (error) console.log("The address write failed...");
            else console.log("Data saved successfully!")
        });
    }

    public adminWriteUserAddress(obj, callback) {
        this.db.database.ref('/users_info/' + obj.id).update({
            name: obj.name,
            ['/address/address' + 1]: JSON.stringify(obj.address),
            area: obj.area
        }, (error) => {
            if (error) callback("Write Failed.");
            else callback("Success");
        });
    }

    public write_tc_orders(date, id, obj) {
        this.db.database.ref("/orders/" + date + "/" + id + "/").update({
            tender: JSON.stringify(obj)
        }, (error) => {
            if (error) console.log("The write failed...");
            else {
                console.log("Data saved successfully!");
            }
        });
    }

    public write_package_info(mobile, data) {
        this.db.database.ref("/users_info/" + mobile).update({

        });
    }

    public user_history(id, obj, active, cnt, callback) {
        this.db.database.ref("/users_info/" + id + '/history/').update({
            [cnt]: obj,
            // 'active': active
        }, (error) => {
            if (error) console.log("The write failed...");
            else {
                console.log("Data saved successfully!");
                callback();
            }
        });

        // this.db.database.ref("/users_info/" + id + '/history/').update({
        //     [cnt]: obj,
        // }, (error) => {
        //     if (error) console.log("The write failed...");
        //     else {
        //         console.log("Data saved successfully!");
        //         callback();
        //     }
        // });

        // this.db.database.ref("/users_info/" + id + "/").update({
        //     active: active
        // }, (error) => {
        //     if (error) console.log("The write failed...");
        //     // else console.log("Data saved successfully!");
        // });
    }

    /*
    * Write from customer list ts
    */
    public update_user_info(mobile, date, index, data) {
        this.db.database.ref("/users_info/" + mobile + "/history/" + index + "/dates/" + date + "/").update({
            "assigned_to": data
        }, (error) => {
            if (error) console.log("123 :: The write failed : editupdateWrite");
            else {
                // callback();
                // console.log("123 :: Data saved successfully!");
            }
        });
    }

    public editupdateWrite(id, cnt, obj, date, callback) {
        this.db.database.ref("/users_info/" + id + "/history/" + cnt).update({
            "total_price": obj.total_price,
            "remaining_to_pay": obj.remaining_to_pay,
            "paid_status": obj.paid_status
        }, (error) => {
            if (error) console.log("The write failed :: editupdateWrite history main");
            else {
                // callback();
                console.log("Data saved successfully!  history main");
            }
        });
        this.db.database.ref("/users_info/" + id + "/history/" + cnt + "/dates/" + date).update({
            'replacement': obj.replacement,
            'count': obj.count,
            'assigned_to': obj.assigned_to
        }, (error) => {
            if (error) console.log("The write failed :: editupdateWrite");
            else {
                callback();
                console.log("Data saved successfully!");
            }
        });
    }

    //write from order view component
    public packageInfoUpdate(id, cnt, obj, date, callback) {
        this.db.database.ref("/users_info/" + id + "/history/" + cnt + "/details").update({
            "total_price": obj.total_price,
            "remaining_to_pay": obj.remaining_to_pay,
            "paid_amt": obj.paid_amt,
            "paid_status": obj.paid_status
        }, (error) => {
            if (error) console.log("The write failed :: editupdateWrite history main");
            else {
                callback();
                console.log("Data saved successfully!  history main");
            }
        });
    }

    public writeUserBag(id, obj) {
        delete obj.undefined;
        this.db.database.ref('/users/' + id).update({
            userBag: JSON.stringify(obj)
        }, (error) => {
            if (error) console.log("The write failed...");
            else console.log("Data saved successfully!");
        });
    }

    public readAnIndividualUser(target, id) {
        return new Observable((observer) => {

            // const reader = new FileReader();
            // reader.onload = () => console.log("loading");
            // reader.onloadend = () => console.log("loaded");
            // debugger;
            var ref = this.db.database.ref('/' + target + '/' + id);
            ref.on("value", function (snapshot) {
                switch (target) {
                    case "users": {
                        observer.next(snapshot.exportVal());
                    }

                    case "products": {
                        observer.next(snapshot.exportVal());
                    }

                    case "orders": {
                        observer.next(snapshot.exportVal());
                    }

                    case "history": {
                        observer.next(snapshot.exportVal());
                    }

                    case "userBag": {
                        observer.next(snapshot.exportVal());
                    }

                    default:
                        console.log("default");
                        observer.error("Thinkspot :: error Firebase read request.");
                        break;
                }
            });
        });
    }

    deleteFromCart(target, user_id, product_id) {
        var ref = this.db.database.ref('/' + target + '/' + user_id);
        ref.on("value", (snapshot) => {

        })
    }

    public logout() {
        //logout
    }
}

