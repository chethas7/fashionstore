const dotenv = require('dotenv')
dotenv.config()
const accountSid = process.env. ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const ServiceSID = process.env.SERVICEID;
const client = require('twilio')(accountSid, authToken, ServiceSID);


exports.sendOtp = async (phone) => {
    try {
        const data = await client.verify.v2.services(ServiceSID).verifications.create({
            to: `+91${phone}`,
            channel: 'sms'
        })

    } catch (error) {
        console.log(error)
    }
}


exports.verifyOtp = async (phone, otp) => {
    console.log("ethi", "sddddddddddddddddddddddddddddddddddddddddddd")


    try {
        const data = await client.verify.v2.services(ServiceSID).verificationChecks.create({
            to: `+91${phone}`,
            code: otp
        })
        return data


    } catch (error) {
        console.log(error)
    }
}