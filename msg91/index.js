const axios = require('axios');

module.exports = {
  //send otp for login
  async sendOtp(otp, number) {
    await axios({
      method: 'POST',
      url: 'https://control.msg91.com/api/sendotp.php',
      params: {
        otp,
        sender: 'HAPDLS',
        message: `OTP for your Happiness Deals account is : ${otp}`,
        mobile: `91${number}`,
        authkey: process.env.msg91Key
      }
    })
  }
}