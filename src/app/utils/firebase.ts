import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';
import { callbackify } from 'util';

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
        // debugger;
        this.db.database.ref('/users_info/' + obj.id).update({
            name: obj.name,
            ['/address/address' + 1]: JSON.stringify(obj.address),
            // area: obj.area,
            // floor: obj.floor,
            // door: obj.door,
            // block: obj.block,
            // landmark: obj.landmark,
            // pincode: obj.pincode,
            // aprtment: obj.address.apartment,
            // inst: obj.inst
            active: "no"
        }, (error) => {
            if (error) callback("Write Failed.");
            else callback("Success");
        });
    }

    // "name": data.Name,
    //     "address": data.Address,
    //     "active": "no ",
    //     "apartment": data.Apartment,
    //     "door": data.Door || "",
    //     "block": data.Block || "",
    //     "floor": data.Floor || "",
    //     "inst": data.Instructions || "",
    //     "area": data.Area || "",
    //     "landmark": data.Landmark || "",
    //     "pincode": data.Pincode || ""


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

    public update_delivery_status_order(id, obj, date, callback) {
        this.db.database.ref("/orders/" + date + "/" + id + "/").update({
            "tender": JSON.stringify(obj)
        }, (error) => {
            if (error) console.log("The write failed :: updateDeliveryStatus");
            else {
                callback();
                console.log("Data saved successfully! :: updateDeliveryStatus");
            }
        });
    }

    public update_delivery_status_user_history(mobile, index, date, obj, callback) {
        console.log("update_delivery_status_user_history :: ", mobile, index, date, obj);
        this.db.database.ref("/users_info/" + mobile + "/history/" + index + "/dates/" + date + "/").update({
            "delivered": obj.delivered,
            "delivered_by": obj.delivered_by
        }, (error) => {
            if (error) console.log("The write failed :: update_delivery_status_user_history");
            else {
                callback();
                // console.log("Data saved successfully! :: updateDeliveryStatus");
            }
        });
    }

    public editupdateWrite(id, cnt, obj, date, callback) {
        this.db.database.ref("/users_info/" + id + "/history/" + cnt + "/details").update({
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

    public packagePaidHistoryUpdate(id, cnt, val, callback) {
        this.db.database.ref("/users_info/" + id + "/history/" + cnt + "/details/history/").update({
            [new Date().getTime()]: val,
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

    public readUserAddress(id) {
        return new Observable((observer) => {
            var ref = this.db.database.ref('/users_info/' + id);
            ref.on("value", function (snapshot) {
                observer.next(snapshot.exportVal());
            });
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

    deleteUserHistory(id, historyLen, callback) {
        var ref = this.db.database.ref("/users_info/" + id + "/history/" + historyLen);

        ref.remove()
            .then(function () {
                console.log("Remove succeeded.");
                callback();
            })
            .catch(function (error) {
                console.log("Remove failed: " + error.message)
            });
    }


    deleteUserOrder(id, date, callback) {
        var ref = this.db.database.ref("/orders/" + date + "/" + id);
        ref.remove()
            .then(function () {
                console.log("Remove succeeded from orders.");
                callback();
            })
            .catch(function (error) {
                console.log("Remove failed: " + error.message)
            });
    }

    deleteFromCart(target, user_id, product_id) {
        var ref = this.db.database.ref('/' + target + '/' + user_id);
        ref.on("value", (snapshot) => {

        })
    }

    /*
    * Write stock update
    */
    stock_update(year, month, date, obj, callback) {
        var ref = this.db.database.ref("/stock/" + year + "/" + month + "/" + date + "/").update({
            // var ref = this.db.database.ref("/stock/" + date + "/").update({
            "large_count": obj['large_count'],
            "large_unit_price": obj['large_unit_price'],
            "small_count": obj['small_count'],
            "small_unit_price": obj['small_unit_price'],
            "orange_count": obj['orange_count'],
            "orange_unit_price": obj['orange_unit_price'],
            "total_price": obj['total_price'],
            "remaining": obj['remaining'],
        }, (error) => {
            if (error) console.log("Stock_price_update write failed...");
            else callback();
        });
    }


    local_sale_update(date, date_id, obj, callback) {
        var ref = this.db.database.ref("/local_sales/" + date + "/").update({
            [date_id]: {
                "large": obj.large,
                "small": obj.small,
                "orange": obj.orange,
                "price": obj.price
            }
        }, (error) => {
            if (error) console.log("local_sale_update write failed...");
            else callback();
        });
    }

    /*
   * Read local sales
   */

    read_local_sales(date) {
        return new Observable((observer) => {
            var ref = this.db.database.ref("/local_sales/" + date + "/");
            ref.on("value", function (snapshot) {
                observer.next(snapshot.exportVal());
            });
        });
    }


    stock_remaining_update(year, month, date, formatedDate, obj, callback) {
        // debugger;
        var ref = this.db.database.ref("/stock/" + year + "/" + month + "/" + date + "/remaining").update({
            // var ref = this.db.database.ref("/stock/" + date + "/").update({
            [formatedDate]: obj,
        }, (error) => {
            if (error) console.log("stock_remaining_update write failed...");
            else callback();
        });
    }



    /*
   * read stocki
   */
    read_stock(year, month) {
        return new Observable((observer) => {
            var ref = this.db.database.ref("/stock/" + year + "/" + month + "/");
            ref.on("value", function (snapshot) {
                observer.next(snapshot.exportVal());
            });
        });
    }

    /*
    * read stock status date wise
    */
    read_stock_status_update_by_date(date) {
        return new Observable((observer) => {
            var ref = this.db.database.ref("/stock_status/" + date + "/");
            ref.on("value", function (snapshot) {
                observer.next(snapshot.exportVal());
            });
        });
    }

    /*
    * Write daily stock status
    */
    daily_stock_status_update(date, obj) {
        var ref = this.db.database.ref("/stock_status/" + date + "/").update({
            'total': obj['total'],
            'remaining': obj['remaining'],
            'large': obj['large'],
            'small': obj['small'],
            'orange': obj['orange'],
            'local': obj['local'],
            'stock_total': obj['stock_total'],
            'total_local': obj['total_local'],
            'profit': obj['profit'],
            'rent': obj['rent'],
            'salary': obj['salary'],
        });
    }


    public logout() {
        //logout
    }
}

