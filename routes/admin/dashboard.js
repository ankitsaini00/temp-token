const express = require("express");
const { f10aDash } = require("../../controllers/admin/dashboard");
var router = express.Router({ mergeParams: true }),
  Admin = require("../../models/admin"),
  PinCode = require("../../models/pincode"),
  nameCity = require("../../models/nameCity");
(puppeteer = require("puppeteer")),
  (path = require("path")),
  (Order = require("../../models/order")),
  (Customer = require("../../models/customer")),
  (fs = require("fs")),
  (ejs = require("ejs")),
  (shell = require("shelljs")),
  ({
    f1aDash,
    f2aDash,
    f3aDash,
    f4aDash,
    f5aDash,
    f6aDash,
    f7aDash,
    f8aDash,
    f9aDash,
    f11aDash,
    f12aDash,
    f13aDash,
    f14aDash,
    f15aDash,
    f16aDash,
    f17aDash,
    f18aDash,
    f19aDash,
    f20aDash,
    f21aDash,
    f22aDash,
    f23aDash,
    f24aDash,
    f25aDash,
    getAnalytics,
    addCustomers,
    showCustomers,
    deleteCustomers
  } = require("../../controllers/admin/dashboard")),
  ({ isAdmin } = require("../../middleware/index"));
  const excelToJson = require('convert-excel-to-json');
 

// Order.find({isPaid:true,isOnline:true},(err,orders)=>{
//     orders.forEach((o)=>{
//       console.log(convertDate(o.order_date))
//     })
// })
// @route to get dashboard
router.get("/orders/:type", isAdmin, f1aDash);

// @route to customer list
router.get("/customerlist", isAdmin, f2aDash);

// route to post orders history for a customer
router.post("/history", isAdmin, f3aDash);

// @route to show order history
router.get("/history/:cid", isAdmin, f4aDash);

// @route to pay the bill
router.get("/paid/:oid", isAdmin, f5aDash);

// @route to delete order
router.get("/order/delete/:oid", isAdmin, f6aDash);

// @route to vouchers page
router.get("/vouchers", isAdmin, f7aDash);

// @route to reports page
router.get("/report", isAdmin, f8aDash);

// @route to report invoice page
router.get("/invoices/:date", isAdmin, f9aDash);

// @route to access order with desc
router.get("/orders/desc/:type", isAdmin, f19aDash);

// @route to access order with desc
router.get("/orders/with/total", isAdmin, f20aDash);

router.get("/dashboard/analytics/phone",f21aDash);

router.get("/dashboard/analytics/city",f22aDash);

router.post("/dashboard/analytics/:type",f23aDash);

router.get("/dashboard/analytics/graph",getAnalytics);


router.get("/inventory/report", isAdmin, f24aDash);

// @route to report invoice page
router.get("/inventory/single/:date", isAdmin, f25aDash);

// ======= new routes for mobile app ======== //
router.post("/mob/orders_detail", f11aDash);
router.post("/mob/report_mob", f12aDash);
router.get("/mob/my_iphones", f13aDash);
router.get("/mob/my_iwatches", f14aDash);
router.get("/mob/my_ipods", f15aDash);
router.post("/mob/new_price", f16aDash);
router.post("/mob/new_quantity", f17aDash);
router.post("/mob/monthly_report", f18aDash);
// ========================================== //

// @route to invoices by date page
router.get("/invoices_date", isAdmin, f10aDash);

// @route to show Customer page
router.get("/vouchers/customer",isAdmin,showCustomers);
 
// @route to add Customer
router.post("/vouchers/customer/add",isAdmin,addCustomers);

// @route to delete Customer
router.get("/vouchers/customer/delete/:cid",isAdmin,deleteCustomers);

// @route to print pdf
router.get("/print-pdf/:oid", isAdmin, (req, res) => {
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
            createPDF(order, res, req);
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
});

router.get("/download/:date", isAdmin, async (req, res) => {
  console.log(req.params);
  const pincode = await PinCode.findOne({}).exec();
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
    function decDate(actDate, numDays) {
      var actDate2 = new Date(actDate);
      actDate2.setDate(actDate.getDate() - numDays);
      function pad(s) {
        return s < 10 ? "0" + s : s;
      }
      var d = new Date(actDate2);
      return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join(
        "-"
      );
    }
    function previousDay(date){
      let ranges = pincode.voucherDate || {},min =1,max =2;
      if(ranges){
        min = ranges.min;
        max = ranges.max;
      }
      function pad(s) {
        return s < 10 ? "0" + s : s;
      }
      const td = new Date(date);
      td.setDate(td.getDate() - max);
      const dd = new Date(date);
      dd.setDate(dd.getDate() - min);
      function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
      }
      const d = randomDate(td, dd);
      const y= [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-');
      return y;
    }
    function getDiscount(priced){
      const price = Number(priced);
      if(price < 30000){
        return 500;
      }
      else if(price >= 30000 && price <= 50000){
        return 1000;
      }
      else if(price > 50000 && price <= 80000){
        return 1500;
      }
      else if(price > 80000){
        return 2000;
      }
    }
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
            var pdt_Arr = orders.map((e) => {
              let pd = {}
              pd.order_date = e.order_date;
              pd.products1 = e.products1;
              return pd;
            });
            var pdts = [];
            pdt_Arr.forEach((e) => {
              
              e.products1.forEach((p) => {
                p.date = e.order_date;
                pdts.push(p);
              });
            });
            nameCity.findOne((err, nc) => {
              if (err) {
                console.log(err);
                req.flash("error", "database error");
                res.redirect("back");
              } else {
                if (
                  nc !== undefined &&
                  nc.detail !== undefined &&
                  nc.detail.length > 0
                ) {
                  var records = nc.detail;
                  var discounts = [200, 300, 400];
                  var disDates = [25, 26, 27, 28, 29];
                  var n = pdts.length;
                  pdts = pdts.map((e, index) => {
                    return {
                      _id: e._id,
                      product_id: e.product_id,
                      name: records[(index + n) % records.length].name,
                      product: e.product,
                      desc: e.desc,
                      details: e.details,
                      quantity: e.quantity,
                      price: e.price,
                      ctipin: e.ctpin,
                      discount: e.price - getDiscount(e.price),
                      city: records[(index + n) % records.length].city,
                      date: previousDay(e.date),
                    };
                  });
                  createPDF2(pdts, req.params.date, res, req);
                } else {
                  req.flash("error", "database error");
                  res.redirect("back");
                }
              }
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
});

router.post("/create/voucher", isAdmin, async (req, res) => {
  const { name, price,qty } = req.body;
  const customers = await Customer.find({}).exec();
  const count = customers.length - qty;
  const randomIndex = Math.floor(Math.random() * count);
  const customer = customers.slice(randomIndex, randomIndex + qty);
  function randomDate(date1, date2){
        function randomValueBetween(min, max) {
          return Math.random() * (max - min) + min;
        }
        var date1 = date1 || '01-01-1970'
        var date2 = date2 || new Date().toLocaleDateString()
        date1 = new Date(date1).getTime()
        date2 = new Date(date2).getTime()
        if( date1>date2){
            return new Date(randomValueBetween(date2,date1)).toLocaleDateString()   
        } else{
            return new Date(randomValueBetween(date1, date2)).toLocaleDateString()  

        }
    }
    const pdts = [];
    for(let i=0;i<qty;i++){
        pdts.push({
            _id: "5fe6ecfd060a220017bd9234",
            product_id: "5fe6ecfd060a220017bd9asd34",
            name: customer[i].name,
            productname : name,
            product: `${name}`,
            desc: "",
            details: "3 MONTH WARRANTY MARVANS",
            quantity: 1,
            price: Number(price),
            ctipin: Math.floor(Math.random()*90000) + 10000,
            discount: 0,
            city: customer[i].city,
            date: randomDate('01/01/2022', '03/01/2022'),
        })
    }
    console.log(pdts);
    createPDF2(pdts, 'duplicate', res, req);

});


router.get("/excel/voucher", async (req, res) => {
      const result = excelToJson({
        sourceFile: path.join(__dirname,'/uploads/')+"JulyPurchase.xlsx"
    });
    function av(today){
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1; // Months start at 0!
      let dd = today.getDate();
  
      if (dd < 10) dd = '0' + String(Number(dd)+1);
      if (mm < 10) mm = '0' + mm;
  
      const tosday = dd + '-' + mm + '-' + yyyy;
      return tosday
    }
    const pdts = [];
    for(let i=1;i<result.Sheet1.length;i++){
        pdts.push({
            _id: "5fe6ecfd060a220017bd9234",
            product_id: "5fe6ecfd060a220017bd9asd34",
            name: result.Sheet1[i].E,
            productname : result.Sheet1[i].D,
            product: result.Sheet1[i].D,
            desc: "",
            details: "3 MONTH WARRANTY MARVANS",
            quantity: result.Sheet1[i].G,
            price: result.Sheet1[i].H,
            ctipin: result.Sheet1[i].C,
            discount: 0,
            city: result.Sheet1[i].I,
            date: av(result.Sheet1[i].B),
        })
    }
    createPDF2(pdts, 'duplicate', res, req);

});

router.get("/invoices_download/:date", isAdmin, (req, res) => {
  console.log(req.params);
  if (req.params.date) {
    var dt = req.params.date;
    dt = dt.split("-").reverse().join("-");
    var ndt = new Date(dt);
    var nextDay = new Date(dt);
    nextDay.setDate(ndt.getDate() + 1);
    Order.find({
      order_date: { $gte: new Date(dt), $lt: nextDay },
      isPaid: true,
      isOnline: false,
    })
      .populate("customer")
      .exec((err, orders) => {
        if (err) {
          console.log(err);
          req.flash("error", "database error");
          res.redirect("back");
        } else {
          if (orders !== undefined) {
            createPDF3(orders, dt, res, req);
          } else {
            req.flash("error", "orders not found");
            res.redirect("back");
          }
        }
      });
  } else {
    req.flash("error", "invalid url");
    res.redirect("back");
  }
});

// function to generate pdf
async function createPDF2(products, dt, res, req) {
  if(dt == 'duplicate'){
    var templateEjs = fs.readFileSync(
      path.join(process.env.PWD, "views", "admin", "duplicate.ejs"),
      "utf8"
    );
  } else {
  var templateEjs = fs.readFileSync(
    path.join(process.env.PWD, "views", "admin", "ctpin.ejs"),
    "utf8"
  );
  }
  var template = ejs.compile(templateEjs);
  var html = template({ products: products });

  var dir = "./bills/";

  if (!fs.existsSync(dir)) {
    shell.mkdir("-p", dir);
  }
  var pdfPath = path.join(process.env.PWD, "bills", dt + ".pdf");

  var options = {
    // width: '1384px',
    // height: '1012px',
    // landscape: true,
    displayHeaderFooter: false,
    format: "A4",
    margin: "none",
    printBackground: true,
    path: pdfPath,
  };

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  var page = await browser.newPage();
  await page.setContent(html);
    await page.waitForTimeout('*');

  await page.pdf(options);
  await browser.close();
  var readStream = fs.createReadStream(pdfPath);
  readStream.pipe(res);
  // res.redirect("/products")
  // res.render("bill1",{bill:bill})
  // await res.download(pdfPath,customer.cref+'-'+bill.billno+'.pdf');
}

// function to generate pdf
async function createPDF(bill, res, req) {
  var templateEjs = fs.readFileSync(
    path.join(process.env.PWD, "views", "admin", "pdf.ejs"),
    "utf8"
  );
  var template = ejs.compile(templateEjs);
  var html = template({ bill: bill });

  var dir = "./bills/";

  if (!fs.existsSync(dir)) {
    shell.mkdir("-p", dir);
  }
  var pdfPath = path.join(process.env.PWD, "bills", "bill.pdf");

  var options = {
    // width: '1384px',
    // height: '1012px',
    // landscape: true,
    displayHeaderFooter: false,
    format: "A4",
    margin: "none",
    printBackground: true,
    path: pdfPath,
  };

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  var page = await browser.newPage();
  await page.setContent(html);
    await page.waitForTimeout('*');

  await page.pdf(options);
  await browser.close();
  var readStream = fs.createReadStream(pdfPath);
  readStream.pipe(res);
  // res.redirect("/products")
  // res.render("bill1",{bill:bill})
  // await res.download(pdfPath,customer.cref+'-'+bill.billno+'.pdf');
}

// function to generate pdf
async function createPDF3(bills, dt, res, req) {
  var templateEjs = fs.readFileSync(
    path.join(process.env.PWD, "views", "admin", "bills.ejs"),
    "utf8"
  );
  var template = ejs.compile(templateEjs);
  var html = template({ bills: bills });

  var dir = "./bills/";

  if (!fs.existsSync(dir)) {
    shell.mkdir("-p", dir);
  }
  var pdfPath = path.join(process.env.PWD, "bills", "bills-" + dt + ".pdf");

  var options = {
    // width: '1384px',
    // height: '1012px',
    // landscape: true,
    displayHeaderFooter: false,
    format: "A4",
    margin: "none",
    printBackground: true,
    path: pdfPath,
  };

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  var page = await browser.newPage();
  await page.setContent(html);
    await page.waitForTimeout('*');

  await page.pdf(options);
  await browser.close();
  var readStream = fs.createReadStream(pdfPath);
  readStream.pipe(res);
  // res.redirect("/products")
  // res.render("bill1",{bill:bill})
  // await res.download(pdfPath,customer.cref+'-'+bill.billno+'.pdf');
}

module.exports = router;
