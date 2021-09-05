const phoneNumber = process.env.TWILIO_PHONE_NUMBER
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const registration_otp = (name, phone, otp) => {
    console.log("Number", phone)
    client.messages
        .create({
            body: `We've received a request for registration of your account with ${name} in MI Store App. If you didn't make this request ignore this Email.
Otherwise here is the Verification Code : ${otp} 
Thanks You`,
            from: phoneNumber, //Provide mobile number used of Twilio Account
            to: `+91${phone}` //Country code and then the variable phone comes from the function call
        })
        .then(message => console.log("response of sms: ", message.sid))
        .catch(e => console.log("error of sms: ", e));
}

module.exports = {
    registration_otp,
};
