var nodemailer = require("nodemailer"),
    dotenv = require('dotenv'),
    { google } = require("googleapis"),
    OAuth2 = google.auth.OAuth2;
dotenv.config();
const oauth2Client = new OAuth2(
    process.env.clientId, // ClientID
    process.env.clientSecret, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);
oauth2Client.setCredentials({
    refresh_token: process.env.refreshToken
});
const accessToken = oauth2Client.getAccessToken()


module.exports = {
    nodemailerSendEmail(userEmail, subject, text, callback) {
        const smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "wahid@marvansmobile.com",
                clientId: process.env.clientId,
                clientSecret: process.env.clientSecret,
                refreshToken: process.env.refreshToken,
                accessToken: accessToken
            }
        });
        var mailOptions = {
            to: userEmail,
            from: 'wahid@marvansmobile.com',
            subject: subject,
            text: text
        };
        smtpTransport.sendMail(mailOptions, function (err) {
            if (err) {
                return callback(0, err);
            } else {
                return callback(1);
            }
        })

    },

    nodemailerSendEmailAll(emails, callback) {
        const smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "wahid@marvansmobile.com",
                clientId: process.env.clientId,
                clientSecret: process.env.clientSecret,
                refreshToken: process.env.refreshToken,
                accessToken: accessToken
            }
        });
        var stop = emails.length;
        var done = 0;
        // console.log(emails)
        emails.forEach((email) => {
            var mailOptions = {
                to: email.mail,
                from: 'wahid@marvansmobile.com',
                subject: email.sub,
                text: email.text,
                html:email.html
            };

            smtpTransport.sendMail(mailOptions, function (err) {
                if (err) {

                } else {
                    done += 1;
                    if (done == stop) {
                        return callback(1);
                    }
                }
            })

        })


    }
}




