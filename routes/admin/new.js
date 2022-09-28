const express = require("express");
const { cat } = require("shelljs");
var router = express.Router({ mergeParams: true }),
    Admin = require("../../models/admin"),
    puppeteer =require("puppeteer"),
    path=require("path"),
    Order=require("../../models/order"),
    Customer=require("../../models/customer"),
    Iphone=require("../../models/iphone"),
    Iwatch = require("../../models/iwatch"),
    {nodemailerSendEmailAll}=require("../../nodemailer/nodemailer.js"),
    Ipod = require("../../models/ipod");
    fs=require("fs"),
    ejs=require("ejs"),
    shell=require("shelljs"),
    { f1aNew, f2aNew, f3aNew, f4aNew, f5aNew} = require("../../controllers/admin/new"),
    { isAdmin } = require("../../middleware/index");


// @route to get new invoice
router.post("/",isAdmin, f1aNew);

// @route to new invoice page
router.get("/:oid",isAdmin, f2aNew);

// @route to add product to invoice
router.post("/add/:oid",isAdmin, f3aNew);

// @route to edit product to invoice
router.post("/edit/:oid/:pid",isAdmin, f4aNew);

// @route to delete product to invoice
router.get("/delete/:oid/:pid",isAdmin, f5aNew);

// // @route to vouchers page
// router.get("/vouchers",isAdmin,f6aNew);

// @route to print-pdf
router.post("/create-pdf/:oid",isAdmin,async (req, res) => {
    if (req.params.oid.match(/^[0-9a-fA-F]{24}$/)) {
        if(req.body.payment_type == 'Other'){
            const total = Number(req.body.total);
            const total2 = Number(req.body.cash) + Number(req.body.card) + Number(req.body.online);
            console.log(total2);
            console.log(total);
            console.log(total2 == total);
            console.log(typeof total2);
            console.log(typeof total);
            if(total2 != total){
                req.flash("error", "Total amount is not matching with the sum of cash, card and bank");
                res.redirect("/new/"+req.params.oid);
                return;
            }
        }
        
        // try {
        //     let order = await Order.findOne({ _id: req.params.oid, isOnline : false }).populate("customer").exec();
        //     if(!order){
        //         req.flash("error", "No Order Found")
        //         res.redirect("back")
        //         return;
        //     }
        //     let ab,ac,ad;
        //     for( const p of order.products1){
        //         if(p.product=="1"){
        //             ab = await Iphone.findOne({pid:p.product_id}).exec();
        //             if(!ab) {
        //                 req.flash("error", "No Product Found")
        //                 res.redirect("back")
        //                 return;
        //             }
        //             ab.variants.forEach((v)=>{
        //                 if(v.storage==p.desc){
        //                     // order.my_price = p.my_price;
        //                     v.quantity-=p.quantity;
        //                     console.log(v.quantity);
        //                 }
        //             })
        //             const save = await ab.save();          

        //         }else if(p.product=="2"){

        //             ac = await Iwatch.findOne({pid:p.product_id}).exec();
        //             if(!ac){
        //                 req.flash("error", "No Product Found")
        //                 res.redirect("back")
        //                 return;
        //             }
        //             ac.variants.forEach((v)=>{
        //                 var desc=v.type+","+v.size;
        //                 if(desc==p.desc){
        //                     v.quantity-=p.quantity;
        //                 }
        //             })
        //             const save = await ac.save();
                
        //         }else if(p.product=="3"){
        //             ad = Ipod.findOne({pid:p.product_id}).exec();
        //             if(!ad) {
        //                 req.flash("error", "No Product Found")
        //                 res.redirect("back")
        //                 return;
        //             }
        //             ad.quantity-=p.quantity;
        //             const save = await ad.save();
        //         }
        //     }
        //     order.payment_type = req.body.payment_type;
        //     order.advance = Number(req.body.advance);
        //     order.customer.name=req.body.username;
        //     order.customer.city=req.body.city;
        //     order.discount=Number(req.body.discount);
        //     order.total_paid=(order.total-(order.total*0.01*order.discount)).toFixed(2);
        //     order.isPaid=true;
        //     if(!order.customer.bills.includes(order._id)){
        //         console.log("domne")
        //         order.customer.bills.push(order._id)
        //     }
        //     if(order.advance>=order.total_paid){
        //         if(!order.customer.paidbills.includes(order._id)){
        //             console.log("domne")
        //             order.customer.paidbills.push(order._id)
        //         }
        //     }else{
        //         if(order.customer.paidbills.includes(order._id)){
        //            order.customer.paidbills=order.customer.paidbills.filter((b)=>{
        //                return b!=order._id;
        //            })
        //         } 
        //     }
        // const admin = await Admin.findOne({}).exec();
        // if(!admin){
        //     req.flash("error", "No Admin Found")
        //     res.redirect("back")
        //     return;
        // }
        // var mail=[],sms=[],str="";
        // order.products1.forEach((p)=>{
        //     str+=" <tr>"+
        //     "<td>"+p.name+"</td>"+
        //     "<td>"+p.desc+"</td>"+
        //     "<td>"+p.quantity+"</td>"+
        //     "<td>"+p.price+"</td>"+
        // "</tr>";
        // })
        // mail.push({
        //     mail: admin.email,
        //     sub: "New Offline Order Placed",
        //     html:"<p><b>New Offline Order</b></p>"+
        //             "<p>BillNo:"+order.billno+"</p>"+
        //             "<p>Customer:"+order.customer.name+"</p>"+
        //             "<p>Mobile No:"+order.customer.mobile+"</p>"+
        //             "<p>Order Amount:"+order.total_paid+"</p>"+
        //             "<table>"+
        //             "<thead>"+
        //                 "<th>Product</th>"+
        //                 "<th>Description</th>"+
        //                 "<th>Quantity</th>"+
        //                 "<th>Amount</th>"+
        //             "</thead>"+
        //             "<tbody>"+
        //             str+
        //             "</tbody>"+
        //         "</table>"
        // })
        // mail.push({
        //     mail: "ankit@stickmanservices.com",
        //     sub: "New Offline Order Placed",
        //     html:"<p><b>New Offline Order</b></p>"+
        //             "<p>BillNo:"+order.billno+"</p>"+
        //             "<p>Customer:"+order.customer.name+"</p>"+
        //             "<p>Mobile No:"+order.customer.mobile+"</p>"+
        //             "<p>Order Amount:"+order.total_paid+"</p>"+
        //             "<table>"+
        //             "<thead>"+
        //                 "<th>Product</th>"+
        //                 "<th>Description</th>"+
        //                 "<th>Quantity</th>"+
        //                 "<th>Amount</th>"+
        //             "</thead>"+
        //             "<tbody>"+
        //             str+
        //             "</tbody>"+
        //         "</table>"
        // })
        // sms.push({
        //     mobile: order.customer.mobile,
        //     message: "Thank You for your purchase of Amount- "+order.total_paid+" at Marvans Mobile.Hope you visit soon."
        // })
        // sms.push({
        //     mobile: admin.mobile,
        //     message: "There is a new offline order placed with billNo: " + order.billno+"\n" +"Customer: "+order.customer.name+" Mobile: "+order.customer.mobile+" Total Amount: "+order.total_paid+ ".\nPlease visit the admin panel for more details."
        // })
        // nodemailerSendEmailAll(mail, (res) => {
        //     console.log(res);
        //     console.log("hello");
        // });
        // console.log("admin")
        // sendSmsAll(sms);
        // const orderSave = await order.save();
        // console.log(orderSave == order);
        // if(!orderSave){
        //     req.flash('error','Error in Operations');
        //     res.redirect('/')
        //     return;
        // }
        //         // console.log(order.products1[0]._id)
        //     // Mapping prod desc to order

        //     const allProducts = order.products1.map( item => `⏩ CTPIN : ` + item.ctpin+", of  "+item.name+" "+item.desc+`. `);
        //     // const message = `Thank you for your purchase at Marvans. You have done total payment of Rs. ${order.total_paid} for purchase of \r\n ${allProducts.toString().trim()}. \r\n On name of : ${order.customer.name}`;
        //     const allProducts1 = allProducts.toString().trim();
        // //    sendWhatsApp(order.customer.name, allProducts1, order.total_paid, parseInt(`91${order.customer.mobile}`));
            
        // createPDF(order,res,req);                                    
        // }
        // catch (err) {
        //     console.log(err);
        // }



        Order.findOne({ _id: req.params.oid, isOnline: false }).populate("customer").exec(async (err, order) => {
            if (err) {
                console.log(err)
                req.flash("error", "Database Error")
                res.redirect("back")
            } else {
                // 
                if (order) {
                    if(order.isPaid){
                       res.redirect("/allorders")
                    }else{
                let ab,ac,ad;
                        ( async () => {
                            for( const p of order.products1){
                                if(p.product=="1"){
                                    ab = await Iphone.findOne({pid:p.product_id}).exec();
                                    if(!ab) {
                                        req.flash("error", "No Product Found")
                                        res.redirect("back")
                                        return;
                                    }
                                    ab.variants.forEach((v)=>{
                                        if(v.storage==p.desc){
                                            // order.my_price = p.my_price;
                                            v.quantity-=p.quantity;
                                            console.log(v.quantity);
                                        }
                                    })
                                    const save = await ab.save();          
        
                                }else if(p.product=="2"){
        
                                    ac = await Iwatch.findOne({pid:p.product_id}).exec();
                                    if(!ac){
                                        req.flash("error", "No Product Found")
                                        res.redirect("back")
                                        return;
                                    }
                                    ac.variants.forEach((v)=>{
                                        var desc=v.type+","+v.size;
                                        if(desc==p.desc){
                                            v.quantity-=p.quantity;
                                        }
                                    })
                                    const save = await ac.save();
                                
                                }else if(p.product=="3"){
                                    ad = await Ipod.findOne({pid:p.product_id}).exec();
                                    if(!ad) {
                                        req.flash("error", "No Product Found")
                                        res.redirect("back")
                                        return;
                                    }
                                    ad.quantity-=p.quantity;
                                    const save = await ad.save();
                                }
                            }
                        })();
                        order.payment_type = req.body.payment_type;
                        if(req.body.payment_type=="Other"){
                            const paid_struc = {
                                cash : Number(req.body.cash),
                                card : Number(req.body.card),
                                bank : Number(req.body.online),
                            };
                            order.paid_struc = paid_struc;
                        }
                        order.advance = Number(req.body.advance);
                        order.customer.name=req.body.username;
                        order.customer.city=req.body.city;
                        order.discount=Number(req.body.discount);
                        order.total_paid=(order.total-(order.total*0.01*order.discount)).toFixed(2);
                        order.isPaid=true;
                        order.billName = req.body.billName;
                        if(!order.customer.bills.includes(order._id)){
                            console.log("domne")
                            order.customer.bills.push(order._id)
                        }
                        if(order.advance>=order.total_paid){
                            if(!order.customer.paidbills.includes(order._id)){
                                console.log("domne")
                                order.customer.paidbills.push(order._id)
                            }
                        }else{
                            if(order.customer.paidbills.includes(order._id)){
                               order.customer.paidbills=order.customer.paidbills.filter((b)=>{
                                   return b!=order._id;
                               })
                            } 
                        }
                        Admin.findOne({},(err,admin)=>{
                            var mail=[],sms=[],str="";
                            order.products1.forEach((p)=>{
                                str+=" <tr>"+
                                "<td>"+p.name+"</td>"+
                                "<td>"+p.desc+"</td>"+
                                "<td>"+p.quantity+"</td>"+
                                "<td>"+p.price+"</td>"+
                            "</tr>";
                            })
                            mail.push({
                                mail: admin.email,
                                sub: "New Offline Order Placed",
                                html:"<p><b>New Offline Order</b></p>"+
                                     "<p>BillNo:"+order.billno+"</p>"+
                                     "<p>Customer:"+order.customer.name+"</p>"+
                                     "<p>Mobile No:"+order.customer.mobile+"</p>"+
                                     "<p>Order Amount:"+order.total_paid+"</p>"+
                                     "<table>"+
                                     "<thead>"+
                                         "<th>Product</th>"+
                                         "<th>Description</th>"+
                                         "<th>Quantity</th>"+
                                         "<th>Amount</th>"+
                                     "</thead>"+
                                     "<tbody>"+
                                        str+
                                     "</tbody>"+
                                 "</table>"
                            })
                            mail.push({
                                mail: "ankit@stickmanservices.com",
                                sub: "New Offline Order Placed",
                                html:"<p><b>New Offline Order</b></p>"+
                                     "<p>BillNo:"+order.billno+"</p>"+
                                     "<p>Customer:"+order.customer.name+"</p>"+
                                     "<p>Mobile No:"+order.customer.mobile+"</p>"+
                                     "<p>Order Amount:"+order.total_paid+"</p>"+
                                     "<table>"+
                                     "<thead>"+
                                         "<th>Product</th>"+
                                         "<th>Description</th>"+
                                         "<th>Quantity</th>"+
                                         "<th>Amount</th>"+
                                     "</thead>"+
                                     "<tbody>"+
                                        str+
                                     "</tbody>"+
                                 "</table>"
                            })
                            sms.push({
                                mobile: order.customer.mobile,
                                message: "Thank You for your purchase of Amount- "+order.total_paid+" at Marvans Mobile.Hope you visit soon."
                            })
                            sms.push({
                                mobile: admin.mobile,
                                message: "There is a new offline order placed with billNo: " + order.billno+"\n" +"Customer: "+order.customer.name+" Mobile: "+order.customer.mobile+" Total Amount: "+order.total_paid+ ".\nPlease visit the admin panel for more details."
                            })
                            nodemailerSendEmailAll(mail, (res) => {
                                console.log(res);
                                console.log("hello");
                            });
                            console.log("admin")
                        })
                        order.customer.save();
                        order.save((err) => {
                            if (err) {
                                console.log(err)
                                req.flash("error", "Database Error")
                                res.redirect("back")
                            } else {
                                // console.log(order.products1[0]._id)
                                 // Mapping prod desc to order

                                 const allProducts = order.products1.map( item => `⏩ CTPIN : ` + item.ctpin+", of  "+item.name+" "+item.desc+`. `);
                                   // const message = `Thank you for your purchase at Marvans. You have done total payment of Rs. ${order.total_paid} for purchase of \r\n ${allProducts.toString().trim()}. \r\n On name of : ${order.customer.name}`;
                                   const allProducts1 = allProducts.toString().trim();
                                   
                                createPDF(order,res,req);
                                
                            }
                        })
                    }
                 


                } else {
                    console.log("k")
                    req.flash("error", "Invalid order")
                    res.redirect("back")
                }
            }
        })
    } else {
        console.log("k")
        req.flash("error", "Invalid URL")
        res.redirect("/")
    }

})






// function to generate pdf
async function createPDF( bill, res,req) {

    var templateEjs = fs.readFileSync(path.join(process.env.PWD, "views","admin", 'pdf.ejs'), 'utf8');
    var template = ejs.compile(templateEjs);
    var html = template({ bill: bill });
    
    var dir = './bills/';

    if (!fs.existsSync(dir)) {
        shell.mkdir('-p', dir);
    }
    var pdfPath = path.join(process.env.PWD,'bills','bill.pdf');

    var options = {
		// width: '1384px',
		// height: '1012px',
		// landscape: true,
        displayHeaderFooter: false,
        format:'A4',
		margin:"none",
		printBackground: true,
		path: pdfPath
	}

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    });
    try {
    var page = await browser.newPage();
    await page.setContent(html);
    await page.waitForTimeout('*');
    await page.pdf(options);
    await browser.close();
    }
    catch(err) {
        console.log(err)
        res.redirect("back")
    }
    var readStream = fs.createReadStream(pdfPath);
    readStream.pipe(res);
    // res.redirect("/products")
    // res.render("bill1",{bill:bill})
    // await res.download(pdfPath,customer.cref+'-'+bill.billno+'.pdf');
}






module.exports = router;