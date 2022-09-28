var Pincode = require("../../models/pincode"),
  Order = require("../../models/order"),
  Customer = require("../../models/customer"),
  Iphone = require("../../models/iphone"),
  Iwatch = require("../../models/iwatch"),
  Ipod = require("../../models/ipod");
const order = require("../../models/order");
const Invoice = require("../../models/invoices");

Invoice.findOne({}, (err, iv) => {
  if (err) {
    console.log(err);
    req.flash("error", "database error");
    res.redirect("back");
  } else {
    if (iv) {
    } else {
      Invoice.create({});
    }
  }
});

module.exports = {
  f1aNew(req, res) {
    Customer.findOne({ mobile: String(req.body.mobile) }, (err, cust) => {
      if (err) {
        console.log(err);
        req.flash("error", "Database Error");
        res.redirect("/");
      } else {
        if (cust) {
          Pincode.findOne({}, (err, pin) => {
            if (err) {
              console.log(err);
              req.flash("error", "Database Error");
              res.redirect("/");
            } else {
              if (pin) {
                Order.create({ isOnline: false }, (err, norder) => {
                  if (err) {
                    console.log(err);
                    req.flash("error", "Database Error");
                    res.redirect("/");
                  } else {
                    norder.billno = pin.billno;
                    norder.customer = cust._id;
                    pin.billno += 1;
                    norder.save((err) => {
                      if (err) {
                        console.log(err);
                        req.flash("error", "Database Error");
                        res.redirect("/");
                      } else {
                        pin.save((err) => {
                          if (err) {
                            console.log(err);
                            req.flash("error", "Database Error");
                            res.redirect("/");
                          } else {
                            res.redirect("/new/" + norder._id);
                          }
                        });
                      }
                    });
                  }
                });
              } else {
                Pincode.create({}, (err, pin) => {
                  if (err) {
                    console.log(err);
                    req.flash("error", "Database Error");
                    res.redirect("/");
                  } else {
                    Order.create({ isOnline: false }, (err, norder) => {
                      if (err) {
                        console.log(err);
                        req.flash("error", "Database Error");
                        res.redirect("/");
                      } else {
                        norder.billno = pin.billno;
                        norder.customer = cust._id;
                        pin.billno += 1;
                        norder.save((err) => {
                          if (err) {
                            console.log(err);
                            req.flash("error", "Database Error");
                            res.redirect("/");
                          } else {
                            pin.save((err) => {
                              if (err) {
                                console.log(err);
                                req.flash("error", "Database Error");
                                res.redirect("/");
                              } else {
                                res.redirect("/new/" + norder._id);
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            }
          });
        } else {
          Customer.create({ mobile: String(req.body.mobile) }, (err, cust) => {
            if (err) {
              console.log(err);
              req.flash("error", "Database Error");
              res.redirect("/");
            } else {
              Pincode.findOne({}, (err, pin) => {
                if (err) {
                  console.log(err);
                  req.flash("error", "Database Error");
                  res.redirect("/");
                } else {
                  if (pin) {
                    Order.create({ isOnline: false }, (err, norder) => {
                      if (err) {
                        console.log(err);
                        req.flash("error", "Database Error");
                        res.redirect("/");
                      } else {
                        norder.billno = pin.billno;
                        norder.customer = cust._id;
                        cust.refno = pin.refno;
                        pin.billno += 1;
                        pin.refno += 1;
                        norder.save((err) => {
                          if (err) {
                            console.log(err);
                            req.flash("error", "Database Error");
                            res.redirect("/");
                          } else {
                            pin.save((err) => {
                              if (err) {
                                console.log(err);
                                req.flash("error", "Database Error");
                                res.redirect("/");
                              } else {
                                cust.save((err) => {
                                  if (err) {
                                    console.log(err);
                                    req.flash("error", "Database Error");
                                    res.redirect("/");
                                  } else {
                                    res.redirect("/new/" + norder._id);
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  } else {
                    Pincode.create({}, (err, pin) => {
                      if (err) {
                        console.log(err);
                        req.flash("error", "Database Error");
                        res.redirect("/");
                      } else {
                        Order.create({ isOnline: false }, (err, norder) => {
                          if (err) {
                            console.log(err);
                            req.flash("error", "Database Error");
                            res.redirect("/");
                          } else {
                            norder.billno = pin.billno;
                            norder.customer = cust._id;
                            cust.refno = pin.refno;
                            pin.billno += 1;
                            pin.refno += 1;
                            norder.save((err) => {
                              if (err) {
                                console.log(err);
                                req.flash("error", "Database Error");
                                res.redirect("/");
                              } else {
                                pin.save((err) => {
                                  if (err) {
                                    console.log(err);
                                    req.flash("error", "Database Error");
                                    res.redirect("/");
                                  } else {
                                    cust.save((err) => {
                                      if (err) {
                                        console.log(err);
                                        req.flash("error", "Database Error");
                                        res.redirect("/");
                                      } else {
                                        res.redirect("/new/" + norder._id);
                                      }
                                    });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                }
              });
            }
          });
        }
      }
    });
  },

  async f2aNew(req, res) {
    if (req.params.oid.match(/^[0-9a-fA-F]{24}$/)) {
      const pincode = await Pincode.findOne({}).exec();
      Order.findOne({ _id: req.params.oid, isOnline: false })
        .populate("customer")
        .exec((err, order) => {
          if (err) {
            console.log(err);
            req.flash("error", "Database Error");
            res.redirect("/");
          } else {
            if (order) {
             Iphone.find({}).sort({_id:1}).exec((err,phones)=>{
                if (err) {
                  console.log(err);
                  req.flash("error", "Database Error");
                  res.redirect("/");
                } else {
                  Iwatch.find({}).sort({_id:1}).exec((err,watchs)=>{
                    if (err) {
                      console.log(err);
                      req.flash("error", "Database Error");
                      res.redirect("/");
                    } else {
                      Ipod.find({}).sort({_id:1}).exec((err,pods)=>{
                        if (err) {
                          console.log(err);
                          req.flash("error", "Database Error");
                          res.redirect("/");
                        } else {
                          var stop = order.products1.length;
                          var done = 0;
                          if (stop == 0) {
                            order.total = 0;
                            order.save((err) => {
                              if (err) {
                                console.log(err);
                                req.flash("error", "Database Error");
                                res.redirect("back");
                              } else {
                                res.render("admin/new-invoice", {
                                  billName : pincode.billName,
                                  order: order,
                                  phones: phones,
                                  watchs: watchs,
                                  pods: pods,
                                });
                              }
                            });
                          } else {
                            order.total = 0;
                            order.products1.forEach((p) => {
                              order.total += p.price;
                              done += 1;
                              if (done == stop) {
                                order.save((err) => {
                                  if (err) {
                                    console.log(err);
                                    req.flash("error", "Database Error");
                                    res.redirect("back");
                                  } else {
                                    res.render("admin/new-invoice", {
                                      billName : pincode.billName,
                                      order: order,
                                      phones: phones,
                                      watchs: watchs,
                                      pods: pods,
                                    });
                                  }
                                });
                              }
                            });
                          }
                        }
                      });
                    }
                  });
                }
              });
            } else {
              req.flash("error", "Invalid order");
              res.redirect("/");
            }
          }
        });
    } else {
      req.flash("error", "Invalid URL");
      res.redirect("/");
    }
  },

  f3aNew(req, res) {
    if (req.params.oid.match(/^[0-9a-fA-F]{24}$/)) {
      Order.findOne({ _id: req.params.oid, isOnline: false })
        .populate("customer")
        .exec((err, order) => {
          if (err) {
            console.log(err);
            req.flash("error", "Database Error");
            res.redirect("back");
          } else {
            if (order) {
              if (order.isPaid) {
                res.redirect("back");
              } else {
                Invoice.findOne({}, (err, invoice) => {
                  if (err) {
                    console.log(err);
                    req.flash("error", "database error");
                    res.redirect("back");
                  } else {
                    if (invoice) {
                      var orderid = Math.floor(Math.random() * 90000) + 10000;
                      while (invoice.ctpins.includes(orderid)) {
                        orderid = Math.floor(Math.random() * 90000) + 10000;
                      }
                      invoice.ctpins.push(orderid);
                      invoice.save();
                      var detail = req.body.name.split(",");
                      let tempMyPrice = 0;

                      if (req.body.type == "1") {
                        if(!req.body.desc || req.body.size){
                          req.flash("error", "Invalid phone");
                          return res.redirect(`/new/${req.params.oid}`);
                        }
                        Iphone.findOne(
                          { name: detail[0], pid: detail[1] },
                          (err, prod) => {
                            for (let i = 0; i < prod.variants.length; i++) {
                              if (prod.variants[i].storage == req.body.desc) {
                                tempMyPrice =
                                  prod.variants[i].my_price != null
                                    ? prod.variants[i].my_price
                                    : 0;
                                break;
                              }
                            }
                            impFunction();
                          }
                        );
                      } else if (req.body.type == "2") {
                        if(!req.body.desc || !req.body.size){
                          req.flash("error", "Invalid watch");
                          return res.redirect("back");
                        }
                        Iwatch.findOne(
                          { name: detail[0], pid: detail[1] },
                          (err, prod) => {
                            for (let i = 0; i < prod.variants.length; i++) {
                              if (
                                prod.variants[i].size == req.body.size &&
                                prod.variants[i].type == req.body.desc
                              ) {
                                tempMyPrice =
                                  prod.variants[i].my_price != null
                                    ? prod.variants[i].my_price
                                    : 0;
                                break;
                              }
                            }
                            impFunction();
                          }
                        );
                      } else if (req.body.type == "3") {
                        Ipod.findOne({ name: detail[0] }, (err, prod) => {
                          tempMyPrice =
                            prod.my_price != null ? prod.my_price : 0;
                          impFunction();
                        });
                      }

                      function getRandomInt(min, max) {
                        min = Math.ceil(min);
                        max = Math.floor(max);
                        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
                      }

                      function getVoucher(price) {
                        var discounts = [200, 300, 400];
                        let dis = discounts[getRandomInt(0, 3)];
                        return price - dis;
                      }

                      function impFunction() {
                        if (req.body.type == "2") {
                          order.products1.push({
                            vou: getVoucher(Number(req.body.price)),
                            product_id: detail[1],
                            name: detail[0],
                            product: req.body.type,
                            desc: req.body.desc + "," + req.body.size,
                            details: req.body.details,
                            quantity: Number(req.body.quantity),
                            price: Number(req.body.price),
                            my_price: Number(tempMyPrice), //
                            ctpin: orderid,
                          });
                        } else {
                          order.products1.push({
                            vou: getVoucher(Number(req.body.price)),
                            product_id: detail[1],
                            name: detail[0],
                            product: req.body.type,
                            desc: req.body.desc,
                            details: req.body.details,
                            quantity: Number(req.body.quantity),
                            price: Number(req.body.price),
                            my_price: Number(tempMyPrice),
                            ctpin: orderid,
                          });
                        }
                        order.save((err) => {
                          if (err) {
                            console.log(err);
                            req.flash("error", "Database Error");
                            res.redirect("back");
                          } else {
                            // console.log(order.products1[0]._id)
                            res.redirect("/new/" + req.params.oid);
                          }
                        });
                      }

                      // impFunction();
                    } else {
                      // Invoice.create({});
                      req.flash("error", "database error");
                      res.redirect("back");
                    }
                  }
                });
              }
            } else {
              req.flash("error", "Invalid order");
              res.redirect("back");
            }
          }
        });
    } else {
      req.flash("error", "Invalid URL");
      res.redirect("back");
    }
  },

  f4aNew(req, res) {
    if (req.params.oid.match(/^[0-9a-fA-F]{24}$/)) {
      Order.findOne({ _id: req.params.oid, isOnline: false })
        .populate("customer")
        .exec((err, order) => {
          if (err) {
            console.log(err);
            req.flash("error", "Database Error");
            res.redirect("back");
          } else {
            if (order) {
              if (order.isPaid) {
                res.redirect("back");
              } else {
                var detail = req.body.name.split(",");
                console.log(req.body.name);
                if (req.body.type == "2") {
                  order.products1.forEach((p) => {
                    if (p._id == req.params.pid) {
                      p.product_id = detail[1];
                      p.product = req.body.type;
                      p.name = detail[0];
                      p.desc = req.body.desc + "," + req.body.size;
                      p.quantity = Number(req.body.quantity);
                      p.price = Number(req.body.price);
                      p.details = req.body.details;
                    }
                  });
                } else {
                  order.products1.forEach((p) => {
                    if (p._id == req.params.pid) {
                      p.product_id = detail[1];
                      p.product = req.body.type;
                      p.name = detail[0];
                      p.desc = req.body.desc;
                      p.quantity = Number(req.body.quantity);
                      p.price = Number(req.body.price);
                      p.details = req.body.details;
                    }
                  });
                }

                order.save((err) => {
                  if (err) {
                    console.log(err);
                    req.flash("error", "Database Error");
                    res.redirect("back");
                  } else {
                    // console.log(order.products1[0]._id)
                    res.redirect("/new/" + req.params.oid);
                  }
                });
              }
            } else {
              req.flash("error", "Invalid order");
              res.redirect("back");
            }
          }
        });
    } else {
      req.flash("error", "Invalid URL");
      res.redirect("back");
    }
  },

  f5aNew(req, res) {
    if (req.params.oid.match(/^[0-9a-fA-F]{24}$/)) {
      Order.findOne({ _id: req.params.oid, isOnline: false })
        .populate("customer")
        .exec((err, order) => {
          if (err) {
            console.log(err);
            req.flash("error", "Database Error");
            res.redirect("back");
          } else {
            if (order) {
              if (order.isPaid) {
                res.redirect("back");
              } else {
                order.products1 = order.products1.filter((p) => {
                  return p._id != req.params.pid;
                });
                order.save((err) => {
                  if (err) {
                    console.log(err);
                    req.flash("error", "Database Error");
                    res.redirect("back");
                  } else {
                    // console.log(order.products1[0]._id)
                    res.redirect("/new/" + req.params.oid);
                  }
                });
              }
            } else {
              console.log("k");
              req.flash("error", "Invalid order");
              res.redirect("back");
            }
          }
        });
    } else {
      console.log("k");
      req.flash("error", "Invalid URL");
      res.redirect("/");
    }
  },
};
