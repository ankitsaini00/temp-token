const axios = require('axios');

module.exports = {
    //send otp for login
    async sendSms(message, number) {
        await axios({
            method: 'POST',
            url: 'https://control.msg91.com/api/sendhttp.php',
            params: {
                route: "4",
                sender: 'HAPDLS',
                country: "91",
                mobiles: number,
                message: message,
                authkey: process.env.msg91Key
            }
        })
    },

    async sendSmsAll(sms) {
        sms.forEach(async(msg) => {
            await axios({
                method: 'POST',
                url: 'https://control.msg91.com/api/sendhttp.php',
                params: {
                    route: "4",
                    sender: 'MWMOBI',
                    country: "91",
                    mobiles: msg.mobile,
                    message: msg.message,
                    authkey: process.env.msg91Key
                }
            })
        })

    },
    async sendWhatsApp(billName, billItems, billAmount, number) {
        const headers = {
            'apiSecret': process.env.gallaApi_secretKey,
            'apiKey': process.env.gallaApiKey
        }
        const data = {
            "channelId": process.env.channelId,
            "channelType": "whatsapp",

            "recipient": {
                "name": `${billName}`,
                "phone": `${number}`
            },
            "botId": "61980d26506f0200049c71da",
            "whatsapp": {
                "type": "template",
                "template": {
                    "templateName": "offline_purchase_confirmation",
                    "bodyValues": {
                        "name": `${billName}`,
                        "product_items": `${billItems}`,
                        "amount": `${billAmount}`
                    }
                }
            }
        };
        const abc = await axios.post('https://server.gallabox.com/devapi/messages/whatsapp', data, { headers: headers });
        console.log(abc.data);
    }

}