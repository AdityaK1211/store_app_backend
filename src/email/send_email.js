const nodemailer = require("nodemailer");
const emailAddress = process.env.EMAIL_ADDRESS;
const password = process.env.PASSWORD;

const registration_otp_email = (name, email, otp) => {
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: emailAddress,
            pass: password
        }
    });
    const message = {
        to: email,
        subject: "Verification Code For Registration",
        text: `We've received a request for registration of your account with ${name} in MI Store App. If you didn't make this request ignore this Email.
Otherwise here is the Verification Code : ${otp} 
Thanks You`
    };
    console.log("Mail Message", message)
    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log("Error Info", err);
        } else {
            console.log("Info", info);
        }
    });
}

module.exports = {
    registration_otp_email
};