var Admin = require("../../models/admin"),
  Pincode = require("../../models/pincode"),
  Order = require("../../models/order"),
  Customer = require("../../models/customer"),
  Iphone = require("../../models/iphone"),
  Iwatch = require("../../models/iwatch"),
  Ipod = require("../../models/ipod"),
  multer = require("multer"),
  Customers = require('../../models/nameCity.js'),
  { cloudinary, cloudinaryUpload } = require("../../cloudinary/cloudinary");
const iphone = require("../../models/iphone");
const Inventory = require("../../models/inventory");
var ObjectID = require("mongodb").ObjectID;

module.exports = {
  f1aDash(req, res) {
    if (req.params.type == "0") {
      Order.find({ isOnline: false, isPaid: true })
        .populate("customer")
        .sort({ order_date: -1 })
        .limit(100)
        .exec((err, orders) => {
          if (err) {
            console.log(err);
            req.flash("error", "Database Error");
            res.redirect("/");
          } else {
            res.render("admin/allorders", {
              orders: orders,
              type: req.params.type,
            });
          }
        });
    } else if (req.params.type == "1") {
      Order.find({ isOnline: false, isPaid: true })
        .populate("customer")
        .sort({ order_date: -1 })
        .exec((err, orders) => {
          if (err) {
            console.log(err);
            req.flash("error", "Database Error");
            res.redirect("/");
          } else {
            res.render("admin/allorders", {
              orders: orders,
              type: req.params.type,
            });
          }
        });
    } else {
      req.flash("error", "Invalid URL");
      res.redirect("back");
    }
  },

  f2aDash(req, res) {
    Customer.find({})
      .populate("bills")
      .exec((err, customers) => {
        if (err) {
          console.log(err);
          req.flash("error", "Database Error");
          res.redirect("/");
        } else {
          res.render("admin/customerlist", { customers: customers });
        }
      });
  },

  f3aDash(req, res) {
    if (req.body.by == "1") {
      console.log("h");
      Customer.findOne({ mobile: String(req.body.mobile) })
        .populate("bills")
        .exec((err, cust) => {
          if (err) {
            console.log(err);
            req.flash("error", "Database Error");
            res.redirect("/");
          } else {
            if (cust) {
              console.log("oh");
              // console.log(cust._id)
              res.redirect("/history/" + cust._id);
            } else {
              req.flash("error", "No such customer");
              res.redirect("/");
            }
          }
        });
    } else {
      Customer.findOne({ refno: String(req.body.mobile) })
        .populate("bills")
        .exec((err, cust) => {
          if (err) {
            console.log(err);
            req.flash("error", "Database Error");
            res.redirect("/");
          } else {
            if (cust) {
              res.redirect("/history/" + cust._id);
            } else {
              req.flash("error", "No such customer");
              res.redirect("/");
            }
          }
        });
    }
  },

  f4aDash(req, res) {
    console.log("helloo");
    if (req.params.cid.match(/^[0-9a-fA-F]{24}$/)) {
      Customer.findOne({ _id: req.params.cid })
        .populate("bills")
        .exec((err, cust) => {
          if (err) {
            console.log(err);
            req.flash("error", "Database Error");
            res.redirect("/");
          } else {
            if (cust) {
              console.log(req.params.cid);
              res.render("admin/history", { cust: cust });
            } else {
              console.log(req.params.cid);
              req.flash("error", "Invalid order");
              res.redirect("/");
            }
          }
        });
    } else {
      req.flash("error", "Invalid URL");
      res.redirect("back");
    }
  },

  f5aDash(req, res) {
    if (req.params.oid.match(/^[0-9a-fA-F]{24}$/)) {
      Order.findOne({ _id: req.params.oid })
        .populate("customer")
        .exec((err, order) => {
          if (err) {
            console.log(err);
            req.flash("error", "Database Error");
            res.redirect("/");
          } else {
            if (order) {
              order.advance = order.total_paid;
              if (!order.customer.paidbills.includes(order._id)) {
                order.customer.paidbills.push(order._id);
              }
              order.customer.save();
              order.save((err) => {
                if (err) {
                  console.log(err);
                  req.flash("error", "Database Error");
                  res.redirect("/");
                } else {
                  res.redirect("back");
                }
              });
            } else {
              // console.log(req.params.cid)
              req.flash("error", "Invalid order");
              res.redirect("/");
            }
          }
        });
    } else {
      req.flash("error", "Invalid URL");
      res.redirect("back");
    }
  },

  f6aDash(req, res) {
    if (req.params.oid.match(/^[0-9a-fA-F]{24}$/)) {
      Order.findOne(
        { isPaid: true, isOnline: false, _id: req.params.oid },
        (err, o) => {
          if (err) {
            console.log(err);
            req.flash("error", "Database Error");
            res.redirect("back");
          } else {
            if (o) {
              var stop = o.products1.length;
              var done = 0;
              if (stop == 0) {
                o.deleteOne((err) => {
                  if (err) {
                    console.log(err);
                    req.flash("error", "Database Error");
                    res.redirect("back");
                  } else {
                    req.flash("success", "Deleted");
                    res.redirect("back");
                  }
                });
              } else {
                o.products1.forEach((p) => {
                  if (p.product == "1") {
                    Iphone.findOne({ pid: p.product_id }, (err, phone) => {
                      if (err) {
                        res.redirect("/");
                      } else {
                        if (phone) {
                          phone.variants.forEach((v) => {
                            if (v.storage == p.desc) {
                              v.quantity += p.quantity;
                            }
                          });
                          phone.save();
                          done += 1;
                          if (done == stop) {
                            o.deleteOne((err) => {
                              if (err) {
                                console.log(err);
                                req.flash("error", "Database Error");
                                res.redirect("back");
                              } else {
                                req.flash("success", "Deleted");
                                res.redirect("back");
                              }
                            });
                          }
                        }
                      }
                    });
                  } else if (p.product == "2") {
                    Iwatch.findOne({ pid: p.product_id }, (err, phone) => {
                      if (err) {
                        res.redirect("/");
                      } else {
                        if (phone) {
                          phone.variants.forEach((v) => {
                            var desc = v.type + "," + v.size;
                            if (desc == p.desc) {
                              v.quantity += p.quantity;
                            }
                          });
                          phone.save();
                          done += 1;
                          if (done == stop) {
                            o.deleteOne((err) => {
                              if (err) {
                                console.log(err);
                                req.flash("error", "Database Error");
                                res.redirect("back");
                              } else {
                                req.flash("success", "Deleted");
                                res.redirect("back");
                              }
                            });
                          }
                        }
                      }
                    });
                  } else {
                    Ipod.findOne({ pid: p.product_id }, (err, phone) => {
                      if (err) {
                        res.redirect("/");
                      } else {
                        if (phone) {
                          phone.quantity += p.quantity;
                          phone.save();
                          done += 1;
                          if (done == stop) {
                            o.deleteOne((err) => {
                              if (err) {
                                console.log(err);
                                req.flash("error", "Database Error");
                                res.redirect("back");
                              } else {
                                req.flash("success", "Deleted");
                                res.redirect("back");
                              }
                            });
                          }
                        }
                      }
                    });
                  }
                });
              }
            } else {
              req.flash("error", "Invalid order");
              res.redirect("back");
            }
          }
        }
      );
    } else {
      req.flash("error", "Invalid URL");
      res.redirect("back");
    }
  },
  f7aDash(req, res) {
    console.log("hello new");
    Order.find(
      {
        order_date: { $gte: new Date("2021-07-31") },
        isPaid: true,
        isOnline: false,
      },
      (err, orders) => {
        if (err) {
          console.log(err);
          req.flash("error", "database error");
          res.redirect("back");
        } else {
          // console.log(orders);
          if (orders) {
            function convertDate(inputFormat) {
              function pad(s) {
                return s < 10 ? "0" + s : s;
              }
              var d = new Date(inputFormat);
              return [
                pad(d.getDate()),
                pad(d.getMonth() + 1),
                d.getFullYear(),
              ].join("-");
            }
            var dates_arr = orders.map((e) => {
              return convertDate(e.order_date);
            });
            // console.log(dates_arr);
            var dates_arr = dates_arr.filter((e, index) => {
              return dates_arr.indexOf(e) === index;
            });
            // console.log(dates_arr);
            res.render("admin/vouchers", { dates: dates_arr });
          } else {
            req.flash("error", "database error");
            res.redirect("back");
          }
        }
      }
    );
  },
  f8aDash(req, res) {
    Order.find({ isPaid: true, isOnline: false })
      .sort({ order_date: 1 })
      .select("order_date")
      .exec((err, orders) => {
        if (err) {
          console.log(err);
          req.flash("error", "database error");
          res.redirect("back");
        } else {
          // console.log(orders);
          if (orders) {
            function convertDate(inputFormat) {
              function pad(s) {
                return s < 10 ? "0" + s : s;
              }
              var d = new Date(inputFormat);
              return [
                pad(d.getDate()),
                pad(d.getMonth() + 1),
                d.getFullYear(),
              ].join("-");
            }
            var dates_arr = orders.map((e) => {
              return convertDate(e.order_date);
            });
            //    console.log(dates_arr);
            var dates_arr = dates_arr.filter((e, index) => {
              return dates_arr.indexOf(e) === index;
            });
            //    console.log(dates_arr);
            res.render("admin/report", { dates: dates_arr });
          } else {
            req.flash("error", "database error");
            res.redirect("back");
          }
        }
      });
  },
  f9aDash(req, res) {
    if (req.params.date) {
      var dt = req.params.date;
      dt = dt.split("-").reverse().join("-");
      var ndt = new Date(dt);
      ndt.setHours(ndt.getHours() - 5);
      ndt.setMinutes(ndt.getMinutes() - 30);
      var nextDay = new Date(dt);
      nextDay.setDate(ndt.getDate() + 1);
      nextDay.setHours(nextDay.getHours() - 5);
      nextDay.setMinutes(nextDay.getMinutes() - 30);
      Order.find(
        {
          order_date: { $gte: new Date(dt), $lt: nextDay },
          isPaid: true,
          isOnline: false,
        },
        (err, orders) => {
          if (err) {
            console.log(err);
            req.flash("error", "database error");
            res.redirect("back");
          } else {
            if (orders !== undefined) {
              orders = orders.reverse();
              var pdts = [];
              var cash = 0;
              var card = 0;
              var online = 0, cashF = 0;
              orders.forEach((e) => {
                if (e.payment_type == "Cash") {
                  cash += e.total_paid;
                } else if (e.payment_type == "Card") {
                  card += e.total_paid;
                } else if (e.payment_type == "Online") {
                  online += e.total_paid;
                }
                else if(e.payment_type == "Other"){
                    cash += e.paid_struc.cash;
                    card += e.paid_struc.card;
                    online += e.paid_struc.bank;
                }
                else if(e.payment_type == "Cashfree"){
                   cashF += e.total_paid;
                 }
                e.products1.forEach((p) => {
                  // ptype => payment type
                  pdts.push({
                    name: p.name,
                    qty: p.quantity,
                    price: p.price,
                    desc: p.desc,
                    ptype: e.payment_type,
                  });
                });
              });
              pdts.push({
                name: 'Cash',
                qty: '',
                price: cash,
                desc: '',
                ptype: '',
              });              
              pdts.push({
                name: 'Card',
                qty: '',
                price: card,
                desc: '',
                ptype: '',
              });
              pdts.push({
                name: 'Bank',
                qty: '',
                price: online,
                desc: '',
                ptype: '',
              });
              pdts.push({
                 name: 'Cashfree',
                 qty: '',
                 price: cashF,
                 desc: '',
                 ptype: '',
               });

              pdts.push({
                name: 'Total',
                qty: '',
                price: online+card+cash+cashF,
                desc: '',
                ptype: '',
              });
              res.render("admin/invoices", {
                products: pdts,
                dt: req.params.date,
                card,
                cash,
                online,
              });
            } else {
              req.flash("error", "orders not found");
              res.redirect("back");
            }
          }
        }
      );
    } else {
      req.flash("error", "invalid url");
      res.redirect("back");
    }
  },
  f10aDash(req, res) {
    Order.find({
      order_date: { $gte: new Date("2021-07-1"), $lte: new Date("2021-07-31") },
      isPaid: true,
      isOnline: false,
    })
      .select("order_date")
      .exec((err, orders) => {
        if (err) {
          console.log(err);
          req.flash("error", "database error");
          res.redirect("back");
        } else {
          // console.log(orders);
          if (orders) {
            function convertDate(inputFormat) {
              function pad(s) {
                return s < 10 ? "0" + s : s;
              }
              var d = new Date(inputFormat);
              return [
                pad(d.getDate()),
                pad(d.getMonth() + 1),
                d.getFullYear(),
              ].join("-");
            }
            var dates_arr = orders.map((e) => {
              return convertDate(e.order_date);
            });
            //    console.log(dates_arr);
            var dates_arr = dates_arr.filter((e, index) => {
              return dates_arr.indexOf(e) === index;
            });
            //    console.log(dates_arr);
            res.render("admin/invs", { dates: dates_arr });
          } else {
            req.flash("error", "database error");
            res.redirect("back");
          }
        }
      });
  },
  f11aDash(req, res) {
    let { date } = req.body;
    let startDate = new Date(String(date).concat("T00:00:00Z"));
    let endDate = new Date(String(date).concat("T00:00:00Z"));
    endDate.setDate(startDate.getDate() + 1);
    Order.find(
      {
        order_date: { $gte: startDate, $lt: endDate },
        isPaid: true,
        isOnline: false,
      },
      (err, orders) => {
        if (err) {
          console.log(err);
          req.flash("error", "database error");
          res.redirect("back");
        } else {
          if (orders !== undefined) {
            orders = orders.reverse();
            var pdts = [];
            orders.forEach((e) => {
              e.products1.forEach((p) => {
                // ptype => payment type
                pdts.push({
                  name: p.name,
                  qty: p.quantity,
                  price: p.price,
                  my_price: p.my_price != null ? p.my_price : 0,
                  desc: p.desc,
                  ptype: e.payment_type,
                  ctpin: p.ctpin,
                });
              });
            });
            res.send({ pdts });
          } else {
            req.flash("error", "orders not found");
            res.redirect("back");
          }
        }
      }
    );
  },
  f12aDash(req, res) {
    let { stD, edD } = req.body;
    let endDate = new Date(String(edD).concat("T00:00:00Z"));
    endDate.setDate(endDate.getDate() + 1);
    Order.find({
      order_date: { $gte: String(stD).concat("T00:00:00Z"), $lt: endDate },
      isPaid: true,
      isOnline: false,
    })
      .sort({ order_date: 1 })
      .exec(async (err, orders) => {
        if (err) {
          console.log(err);
          req.flash("error", "database error");
          res.redirect("back");
        } else {
          if (orders) {
            var newData = {};
            function convertDate(inputFormat) {
              function pad(s) {
                return s < 10 ? "0" + s : s;
              }
              var d = new Date(inputFormat);
              return [
                pad(d.getDate()),
                pad(d.getMonth() + 1),
                d.getFullYear(),
              ].join("-");
            }
            var dates_arr = orders.map((e) => {
              return {
                date: convertDate(e.order_date),
                type: e.payment_type,
                total: e.total_paid,
                myPrices: e.products1.map((e) => e.my_price ?? 0),
                vou: e.products1.map((e) => e.vou ?? 0),
              };
            });
            dates_arr.forEach((e, index) => {
              if (dates_arr.indexOf(e) === index) {
                newData[e.date] = {
                  cash: 0,
                  online: 0,
                  other: 0,
                  my_price: 0,
                  vou: 0,
                };
              }
            });
            dates_arr.forEach((e, index) => {
              if (newData[e.date] != null) {
                if (e.type == "Cash") {
                  newData[e.date].cash += e.total;
                } else if (e.type == "Card") {
                  newData[e.date].other += e.total;
                } else {
                  newData[e.date].online += e.total;
                }
              }
              e.myPrices.forEach((v) => {
                newData[e.date].my_price += v;
              });
              e.vou.forEach((v) => {
                newData[e.date].vou += v;
              });
            });
            res.send(newData);
          } else {
            req.flash("error", "database error");
            res.redirect("back");
          }
        }
      });
  },
  f13aDash(req, res) {
    let iphoneList = [];
    Iphone.find().exec(async (err, ips) => {
      if (err) {
        console.log(err);
        res.send({ error: err });
      } else {
        ips.forEach((e) => {
          let tmp = {};
          tmp.name = e.name;
          tmp.oid = e._id;
          tmp.variants = [];
          for (let i = 0; i < e.variants.length; i++) {
            let model = e.variants[i];
            tmp.variants[i] = {
              vid: model._id,
              storage: model.storage,
              quantity: model.quantity,
              price: model.price,
              isInStock: model.isInStock,
              myPrice: model.my_price != null ? model.my_price : 0,
            };
          }
          iphoneList.push(tmp);
        });
      }
      res.end(JSON.stringify(iphoneList));
    });
  },
  f14aDash(req, res) {
    let iwatchList = [];
    Iwatch.find().exec(async (err, iws) => {
      if (err) {
        console.log(err);
        res.send({ error: err });
      } else {
        iws.forEach((e) => {
          let tmp = {};
          tmp.name = e.name;
          tmp.oid = e._id;
          tmp.variants = [];
          for (let i = 0; i < e.variants.length; i++) {
            let model = e.variants[i];
            tmp.variants[i] = {
              vid: model._id,
              size: model.size,
              type: model.type,
              quantity: model.quantity,
              price: model.price,
              isInStock: model.isInStock,
              myPrice: model.my_price != null ? model.my_price : 0,
            };
          }
          iwatchList.push(tmp);
        });
      }
      res.end(JSON.stringify(iwatchList));
    });
  },
  f15aDash(req, res) {
    let ipodList = [];
    Ipod.find().exec(async (err, iws) => {
      if (err) {
        console.log(err);
        res.send({ error: err });
      } else {
        iws.forEach((e) => {
          let tmp = {};
          tmp.name = e.name;
          tmp.oid = e._id;
          tmp.quantity = e.quantity;
          tmp.price = e.price;
          tmp.isInStock = e.isInStock;
          tmp.myPrice = e.my_price != null ? e.my_price : 0;
          ipodList.push(tmp);
        });
      }
      res.end(JSON.stringify(ipodList));
    });
  },
  f16aDash(req, res) {
    var o_id = new ObjectID(req.body.oid);
    if (req.body.product_code == 1) {
      Iphone.updateOne(
        { _id: o_id, "variants._id": ObjectID(req.body.vid) },
        { $set: { "variants.$.my_price": Number(req.body.price) } },
        (err, value) => {
          if (err) {
            res.send({ status: false });
          } else {
            res.send({ status: true });
          }
        }
      );
    } else if (req.body.product_code == 2) {
      Iwatch.updateOne(
        { _id: o_id, "variants._id": ObjectID(req.body.vid) },
        { $set: { "variants.$.my_price": Number(req.body.price) } },
        (err, value) => {
          if (err) {
            res.send({ status: false });
          } else {
            res.send({ status: true });
          }
        }
      );
    } else if (req.body.product_code == 3) {
      Ipod.updateOne(
        { _id: o_id },
        { $set: { my_price: Number(req.body.price) } },
        (err, value) => {
          if (err) {
            res.send({ status: false });
          } else {
            res.send({ status: true });
          }
        }
      );
    }
  },
   async f17aDash(req, res) {
    var o_id = new ObjectID(req.body.oid);
    let c = new Date();
    c.setHours(0, 0, 0, 0);
    function convertDate(inputFormat) {
      function pad(s) {
        return s < 10 ? "0" + s : s;
      }
      var d = new Date(inputFormat);
      return [
        pad(d.getDate()),
        pad(d.getMonth() + 1),
        d.getFullYear(),
      ].join("-");
    }
    let date_str = convertDate(c);
    let invToday = await Inventory.findOne({ dateAdded: date_str }).exec();
    if(!invToday){
      invToday = new Inventory({
        dateAdded: date_str,
        product : []
      });
    }
    if (req.body.product_code == 1) {
      Iphone.findOneAndUpdate(
        { _id: o_id, "variants._id": ObjectID(req.body.vid) },
        { $inc: { "variants.$.quantity": Number(req.body.quantity) } },
        async (err, value) => {
          if (err) {
            res.send({ status: false  });
          } else {
              let found = false;
              for(let i = 0; i < invToday.product.length; i++){
                if(invToday.product[i].pid == value.pid && invToday.product[i].vid.toString() === req.body.vid.toString()){
                  invToday.product[i].add += Number(req.body.quantity) > 0  ? Number(req.body.quantity) : 0;
                  invToday.product[i].sub += Number(req.body.quantity) < 0 ? Math.abs(Number(req.body.quantity)) : 0;
                  found = true;
                  break;
                }
              }
              if(!found){
                let t = value.variants.filter(e => e._id.toString() ===  req.body.vid)[0].storage;
                invToday.product.push({
                  pid : value.pid,
                  name : value.name+" "+t,
                  desc: t,
                  vid : req.body.vid,
                  add : Number(req.body.quantity) > 0  ? Number(req.body.quantity) : 0,
                  sub : Number(req.body.quantity) < 0 ? Math.abs(Number(req.body.quantity)) : 0,
                })
              }
            }
            await invToday.save();
            res.send({ status: true });
        }
      );
    } else if (req.body.product_code == 2) {
      Iwatch.findOneAndUpdate(
        { _id: o_id, "variants._id": ObjectID(req.body.vid) },
        { $inc: { "variants.$.quantity": Number(req.body.quantity) } },
        async (err, value) => {
          if (err) { 
            res.send({ status: false });
          } else {
              let found = false;
              for(let i = 0; i < invToday.product.length; i++){
                if(invToday.product[i].pid == value.pid && invToday.product[i].vid.toString() === req.body.vid.toString()){
                  invToday.product[i].add += Number(req.body.quantity) > 0  ? Number(req.body.quantity) : 0;
                  invToday.product[i].sub += Number(req.body.quantity) < 0 ? Math.abs(Number(req.body.quantity)) : 0;
                  found = true;
                  break;
                }
              }
              if(!found){
                const t = value.variants.filter(e => e._id.toString() ===  req.body.vid)[0];
                invToday.product.push({
                  pid : value.pid,
                  name : value.name+" "+ t.type+","+t.size,
                  desc: t.type+","+t.size,
                  add : Number(req.body.quantity) > 0  ? Number(req.body.quantity) : 0,
                  sub : Number(req.body.quantity) < 0 ? Math.abs(Number(req.body.quantity)) : 0,
                })
              }
            }
            await invToday.save();
            res.send({ status: true });
        }
      );
    } else if (req.body.product_code == 3) {
      Ipod.findOneAndUpdate(
        { _id: o_id },
        { $inc: { quantity: Number(req.body.quantity) } },
        async (err, value) => {
          if (err) {
            res.send({ status: false });
          } else {
              let found = false;
              for(let i = 0; i < invToday.product.length; i++){
                if(invToday.product[i].pid == value.pid){
                  invToday.product[i].add += Number(req.body.quantity) > 0  ? Number(req.body.quantity) : 0;
                  invToday.product[i].sub += Number(req.body.quantity) < 0 ? Math.abs(Number(req.body.quantity)) : 0;
                  found = true;
                  break;
                }
              }
              if(!found){
                invToday.product.push({
                  pid : value.pid,
                  name : value.name,
                  add : Number(req.body.quantity) > 0  ? Number(req.body.quantity) : 0,
                  sub : Number(req.body.quantity) < 0 ? Math.abs(Number(req.body.quantity)) : 0,
                })
              }
            }
            await invToday.save();
            res.send({ status: true });
          }
      );
    }
  },

  f18aDash(req, res) {
    let { stD, edD } = req.body;
    let endDate = new Date(String(edD).concat("T00:00:00Z"));
    endDate.setDate(endDate.getDate() + 1);
    Order.find({
      order_date: { $gte: String(stD).concat("T00:00:00Z"), $lt: endDate },
      isPaid: true,
      isOnline: false,
    })
      .sort({ order_date: 1 })
      .exec(async (err, orders) => {
        if (err) {
          console.log(err);
          req.flash("error", "database error");
          res.redirect("back");
        } else {
          if (orders) {
            var newData = {};
            function convertDate(inputFormat) {
              function pad(s) {
                return s < 10 ? "0" + s : s;
              }
              var d = new Date(inputFormat);
              return [
                pad(d.getDate()),
                pad(d.getMonth() + 1),
                d.getFullYear(),
              ].join("-");
            }
            var dates_arr = orders.map((e) => {
              return {
                date: convertDate(e.order_date),
                type: e.payment_type,
                total: e.total_paid,
                products: e.products1.map((e) => {
                  return {
                    name: e.name,
                    qty: e.quantity,
                    price: e.price,
                    my_price: e.my_price,
                    ctpin: e.ctpin,
                  };
                }),
              };
            });
            res.send({ data: dates_arr });
          } else {
            req.flash("error", "database error");
            res.redirect("back");
          }
        }
      });
  },
  async f19aDash(req, res) {
    if (req.params.type == "1") {
      Order.find({ isOnline: false, isPaid: true })
        .populate("customer")
        .sort({ order_date: -1 })
        .limit(100)
        .exec((err, orders) => {
          if (err) {
            console.log(err);
            req.flash("error", "Database Error");
            res.redirect("/");
          } else {
            res.render("admin/ordersdesc", {
              orders: orders,
              type: req.params.type,
            });
          }
        });
    } else if (req.params.type == "0") {
      Order.find({ isOnline: false, isPaid: true })
        .populate("customer")
        .sort({ order_date: -1 })
        .exec((err, orders) => {
          if (err) {
            console.log(err);
            req.flash("error", "Database Error");
            res.redirect("/");
          } else {
            res.render("admin/ordersdesc", {
              orders: orders,
              type: req.params.type,
            });
          }
        });
    } else {
      req.flash("error", "Invalid URL");
      res.redirect("back");
    }
  },
  async f20aDash(req, res) {
    try {
    const orders = await Order.find({isOnline: false, isPaid: true },{order_date : 1, total_paid : 1}).sort({order_date : -1 }).exec();
    let ordersbyMonth = {};
    orders.forEach(o=>{
      let date = new Date(o.order_date);
      let month = date.getMonth();
      let year = date.getFullYear();
      let monthYear = year + "-" + (month+1);
      if(ordersbyMonth[monthYear]){
        ordersbyMonth[monthYear] += o.total_paid;
      } 
      else{ 
        ordersbyMonth[monthYear] = o.total_paid;
      }
    });
    return res.render('admin/total', {
      totalMonths : ordersbyMonth
    }) 
    }catch (err) {
      console.log(err);
      res.redirect('/');
    }
  },
  async showCustomers(req, res) { 
    try {
        let customer = await Customers.findOne({}).exec();
        if(customer){
            return res.render("admin/customer", { customer: customer.detail });
        } 
        customer = await Customers.create({});
        return res.render("admin/customer", { customer: [] });

    }
    catch (err) { 
        console.log(err);
        res.redirect("/error");
    }

},

async addCustomers(req, res) {
    try {
        let customer = await Customers.findOne({}).exec();
        console.log(req.body)
        if(req.body.customer ){
            customer.detail.push({
              name : req.body.customer.trim(),
              city : req.body.city.trim()
            })
            const save = await customer.save();
            if(save){
                return res.redirect("/vouchers/customer");
            }
        }
        req.flash('error', 'Please enter valid city and name');
        return res.redirect("/vouchers/customer");
    }
    catch (err) { 
        console.log(err);
        res.redirect("/error");
    }
},

async deleteCustomers(req, res) {
    if(!req.params.cid){
        req.flash('error', 'Please specifiy the delete customer');
        return res.redirect("/vouchers/customer");
    }
    try {
        const customer = await Customers.findOne({}).exec();
        if(customer){
          customer.detail = customer.detail.filter(e => e._id.toString() !== req.params.cid.toString())
          const save = await customer.save();
          if(save){
            req.flash('success',`Deleted customer successfully`)
            return res.redirect("/vouchers/customer");
          }
        } 
    }
    catch (err) { 
        console.log(err);
        res.redirect("/error");
    }
  },
  async f21aDash(req, res) {
    const orders = await Order.aggregate([
      { "$match": { isPaid: true, isOnline: false } },
      { $unwind: '$products1' },
      {
        $group: {
          _id: { name: "$products1.name", variant: "$products1.description" },
          total: { $sum: 1 },
          totalqty: { $sum: '$products1.quantity' },
          price: { "$sum": { "$multiply": ["$products1.price", "$products1.quantity"] } },
        }
      },
      { $sort: { '_id.name': 1 } },
    ]).exec();
    let iphone = [], airpod = [], iwatch = [];
    let oA = {}, oW = {}, oI = {};
    const airpods = await Ipod.find({}, { name: 1, quantity: 1 }).exec();
    const iphoneQty = await Iphone.aggregate([
      { $unwind: '$variants' },
      { $group: { _id: '$name', total: { $sum: '$variants.quantity' } } },
      { $project: { name: '$name', total: 1 } },
    ]).exec();
    const iwatchQty = await Iwatch.aggregate([
      { $unwind: '$variants' },
      { $group: { _id: '$name', total: { $sum: '$variants.quantity' } } },
      { $project: { name: '$name', total: 1 } },
    ]).exec();
    orders.forEach(order => {
      if (order._id.name.split(' ')[0] == "iPhone") {
        iphone.push(order)
        if (!oI[order._id.name]) {
          oI[order._id.name] = order.total;
        } else {
          oI[order._id.name] += order.total;
        }
      } else if (order._id.name.split(' ')[0] == "Watch") {
        iwatch.push(order)
        if (!oW[order._id.name]) {
          oW[order._id.name] = order.total;
        } else {
          oW[order._id.name] += order.total;
        }
      } else if (order._id.name.split(' ')[0] == "Airpods") {
        airpod.push(order)
        if (!oA[order._id.name]) {
          oA[order._id.name] = order.total;
        } else {
          oA[order._id.name] += order.total;
        }
      }
    });
    res.render('admin/analytics', {
      type: 'byphone',
      iphone: iphone,
      airpod: airpod,
      iwatch: iwatch,
      airpods: airpods,
      iphoneQty: iphoneQty,
      iwatchQty: iwatchQty,
      oCity: [],
      oA: oA,
      oI: oI,
      oW: oW,
    });
  },
  async f22aDash(req, res) {
    const orders = await Order.aggregate([
      { "$match": { isPaid: true, isOnline: false } },
      {
        $group: {
          _id: '$city',
          total: { $sum: 1 },
          totalpaid: { $sum: '$total_paid' },
        }
      },
      { $sort: { 'total': -1 } },
    ]).exec();

    res.render('admin/analytics', {
      type: 'bycity',
      orders: orders,
      oCity: orders,
      airpods: [],
      iphoneQty: [],
      iwatchQty: [],
      oA: [],
      oI: [],
      oW: [],
    });
  },
  async f23aDash(req, res) {
    try {
      const type = req.params.type;
      if (type != 'byphone' && type != 'bycity') {
        return res.redirect("/dashboard/analytics/phone");
      }
      if (req.body.range) {
        let query = [];
        var range = req.body.range.split(' ');
        var y1 = range[0].split("-")[0]
        var m1 = range[0].split("-")[1]
        var d1 = range[0].split("-")[2]
        var y2 = range[2].split("-")[0]
        var m2 = range[2].split("-")[1]
        var d2 = range[2].split("-")[2]
        var sd = new Date(y1, Number(m1) - 1, Number(d1) + 1)
        var ed = new Date(y2, Number(m2) - 1, Number(d2) + 1)
        let oA = {}, oW = {}, oI = {};
        if (type == 'byphone') {
          query = [
            { "$match": { isPaid: true, isOnline: false, $and: [{ order_date: { $gte: sd } }, { order_date: { $lte: ed } }] } },
            { $unwind: '$products1' },
            {
              $group: {
                _id: { name: "$products1.name", variant: "$products1.description" },
                total: { $sum: 1 },
                totalqty: { $sum: '$products1.quantity' },
                price: { "$sum": { "$multiply": ["$products1.price", "$products1.quantity"] } },

              }
            },
            { $sort: { '_id.name': 1 } },
          ]
        } else if (type == 'bycity') {
          query = [
            { "$match": { isPaid: true, isOnline: false, $and: [{ order_date: { $gte: sd } }, { order_date: { $lte: ed } }] } },
            {
              $group: {
                _id: '$city',
                total: { $sum: 1 },
                totalpaid: { $sum: '$total_paid' },
              }
            },
            { $sort: { 'total': -1 } },
          ]
        }
        const orders = await Order.aggregate(query).exec();
        if (type == 'byphone') {
          const airpods = await Ipod.find({}, { name: 1, quantity: 1 }).exec();
          const iphoneQty = await Iphone.aggregate([
            { $unwind: '$variants' },
            { $group: { _id: '$name', total: { $sum: '$variants.quantity' } } },
            { $project: { name: '$name', total: 1 } },
          ]).exec();
          const iwatchQty = await Iwatch.aggregate([
            { $unwind: '$variants' },
            { $group: { _id: '$name', total: { $sum: '$variants.quantity' } } },
            { $project: { name: '$name', total: 1 } },
          ]).exec();
          let iphone = [], airpod = [], iwatch = [];
          orders.forEach(order => {
            if (order._id.name.split(' ')[0] == "iPhone") {
              iphone.push(order)
              if (!oI[order._id.name]) {
                oI[order._id.name] = order.total;
              } else {
                oI[order._id.name] += order.total;
              }
            } else if (order._id.name.split(' ')[0] == "Watch") {
              iwatch.push(order)
              if (!oW[order._id.name]) {
                oW[order._id.name] = order.total;
              } else {
                oW[order._id.name] += order.total;
              }
            } else if (order._id.name.split(' ')[0] == "Airpods") {
              airpod.push(order)
              if (!oA[order._id.name]) {
                oA[order._id.name] = order.total;
              } else {
                oA[order._id.name] += order.total;
              }
            }
          });
          return res.json({
            type: 'byphone',
            iphone: iphone,
            airpod: airpod,
            iwatch: iwatch,
            airpods: airpods,
            iphoneQty: iphoneQty,
            iwatchQty: iwatchQty,
            oA: oA,
            oI: oI,
            oW: oW,
          });
        } else {
          return res.json({
            type: 'bycity',
            orders: orders,
            oCity: orders,
            airpods: [],
            iphoneQty: [],
            iwatchQty: [],
            oA: [],
            oI: [],
            oW: [],
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.redirect("/error");
    }
  },
  async getAnalytics(req, res) {
    const order = await Order.find({ isPaid: true, isOnline: false }).sort({ order_date: 1 }).exec();
    const totalOrders = order.length;
    let oProcess = 0, oRejected = 0;
    let oCity = {}, oDate = {}, oProduct = {}, oI = {}, oW = {}, oA = {};
    order.forEach(o => {
      const c = o.order_date.toString().split(' ').slice(1, 4).join().replaceAll(',', '-');
      if (Object.keys(oDate).indexOf(c) == -1) {
        oDate[c] = 1;
      } else {
        oDate[c]++;
      }
      if (o.order_progress == "processing") {
        oProcess++;
      }
      if (o.order_progress == "delivered") {
        oRejected++;
      }

    });
    if (!order) {
      req.flash('error', 'No Orders');
      return res.redirect("/");
    }

    res.render("admin/g-analytics", {
      oDate: oDate,
      oProcess: oProcess,
      oRejected: oRejected,
      totalOrders: totalOrders
    });
  },
  async f24aDash(req, res) {
    let qtyTable ;
    try {
    qtyTable = await Inventory.find({}, { dateAdded : 1 }).exec();
    if (!qtyTable) qtyTable = [];
    } catch (error) {
      req.flash('error', 'Something Went Wrong');
      return res.redirect("/error");
    }  
    Order.find({ isPaid: true, isOnline: false })
      .sort({ order_date: 1 })
      .select("order_date")
      .exec((err, orders) => {
        if (err) {
          console.log(err);
          req.flash("error", "database error");
          res.redirect("back");
        } else {
          // console.log(orders);
          if (orders) {
            function convertDate(inputFormat) {
              function pad(s) {
                return s < 10 ? "0" + s : s;
              }
              var d = new Date(inputFormat);
              return [
                pad(d.getDate()),
                pad(d.getMonth() + 1),
                d.getFullYear(),
              ].join("-");
            }
            var dates_arr = orders.map((e) => {
              return convertDate(e.order_date);
            });

            qtyTable = qtyTable.map(a => {
              return a.dateAdded;
            })
            //    console.log(dates_arr);
            dates_arr.push(...qtyTable);
            var dates_arr = dates_arr.filter((e, index) => {
              return dates_arr.indexOf(e) === index;
            });
            //    console.log(dates_arr);
            res.render("admin/inventory_report", { dates: dates_arr });
          } else {
            req.flash("error", "database error");
            res.redirect("back");
          }
        }
      });
  },
  async f25aDash(req, res) {
    let qtyTable,addedProducts = [];
    if (req.params.date) {
      var dt = req.params.date;
      dt = dt.split("-").reverse().join("-");
      var ndt = new Date(dt);
      var nextDay = new Date(dt);
      let c = ndt.setHours(0, 0, 0, 0);
      nextDay.setDate(ndt.getDate() + 1);
      try {
        qtyTable = await Inventory.find({ dateAdded: req.params.date }).exec();
        if (!qtyTable) qtyTable = [];
        if (qtyTable[0] ) {
          addedProducts = JSON.parse(JSON.stringify(qtyTable[0].product));
          addedProducts.forEach(a => {
          a.qty = 0; a.price = 0;
        });
      }
      const allOrders = await Order.find({ order_date: { $gte: c, $lt: nextDay }, isPaid: true, isOnline: false, }).sort({ order_date : -1}).exec();
      if(allOrders || qtyTable) {
        let cash=0, pdts = [], online=0, card=0;
        allOrders.forEach(order => {
          if(order.payment_type == "Cash") {
            cash+=order.total_paid;
          }
          if(order.payment_method == "Card") {
            card+=order.total_paid;
          }
          else {
            online+=order.total_paid;
          }
          order.products1.forEach((p) => {
            pdts.push({
              pid: p.product_id,
              name: p.name,
              qty: p.quantity,
              add: 0,
              sub: 0,
              price: p.price,
              desc: p.desc,
            });
          });
        });
        pdts.push(...addedProducts);
        let final = {};
        const productsArr = pdts.reduce((k, obj) => {
          let n = obj.pid + "," + obj.desc;
          if (!final[n]) {
            final[n] = Object.assign({}, obj);
            k.push(final[n]);
          } else {
            final[n].qty += obj.qty;
            final[n].add += obj.add;
            final[n].sub += obj.sub;
            final[n].price += obj.price;
          }
          return k;
        },
          []
        );
        if(req.query.today) {
          const iphone = await Iphone.find({}, {name : 1, variants : 1, pid : 1}).exec();
          const airpod = await Ipod.find({}, {name : 1, pid : 1, quantity : 1}).exec();
          const iwatch = await Iwatch.find({}, {name : 1, pid : 1, variants : 1}).exec();
          return res.render("admin/inv_table", {
            today : true,
            iphone: iphone,
            airpod: airpod,
            iwatch: iwatch,
            qtyTable : qtyTable,
            products: productsArr,
            dt: req.params.date,
            card,
            cash,
            online,
          });
        }
      res.render("admin/inv_table", {
          today : false,
          qtyTable : qtyTable,
          products: productsArr,
          dt: req.params.date,
          card,
          cash,
          online,
        });
      } else {
        req.flash("error", "orders not found");
        res.redirect("back");
      }
    } catch (error) {
      console.log(error);
      req.flash("error", "invalid url");
      res.redirect("back");
    }
      // Order.find(
      //   {
      //     order_date: { $gte: c, $lt: nextDay },
      //     isPaid: true,
      //     isOnline: false,
      //   },
      //   (err, orders) => {
      //     if (err) {
      //       console.log(err);
      //       req.flash("error", "database error");
      //       res.redirect("back");
      //     } else {
      //       if (orders !== undefined) {
      //         orders = orders.reverse();
      //         var pdts = [];
      //         var cash = 0;
      //         var card = 0;
      //         var online = 0;
      //         orders.forEach((e) => {
      //           if (e.payment_type == "Cash") {
      //             cash += e.total_paid;
      //           } else if (e.payment_type == "Card") {
      //             card += e.total_paid;
      //           } else {
      //             online += e.total_paid;
      //           }
      //           e.products1.forEach((p) => {
      //             // ptype => payment type
      //             pdts.push({
      //               pid : p.product_id,
      //               name: p.name,
      //               qty: p.quantity,
      //               price: p.price,
      //               desc: p.desc,
      //               ptype: e.payment_type,
      //             });
      //           });
      //         });
      //         res.render("admin/inv_table", {
      //           qtyTable : qtyTable,
      //           products: productsArr,
      //           dt: req.params.date,
      //           card,
      //           cash,
      //           online,
      //         });
      //       } else {
      //         req.flash("error", "orders not found");
      //         res.redirect("back");
      //       }
      //     }
      //   }
      // );
    } else {
      req.flash("error", "invalid url");
      res.redirect("back");
    }
  }
};





// products: e.products1.map((e) => {
//     return {
//       name: e.name,
//       qty: e.quantity,
//       price: e.price,
//       my_price: e.my_price,
//       ctpin: e.ctpin,
//     };
//   }),
