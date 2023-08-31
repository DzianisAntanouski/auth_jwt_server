const oNodeMailer = require("nodemailer");

class MailService {
    constructor() {
        this.transporter = oNodeMailer.createTransport({            
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });        
    }
    async sendActivationMail(sTo, sLink) {
        console.log(process.env.SMTP_USER)
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: sTo,
            subject: 'Account activation link',
            text: '',
            html: 
                `
                    <div>
                        <h1>Activation link for service ${process.env.API_URL}</h1>
                        <a href="${sLink}">${sLink}</a>
                    </div>
                `
        })
    }
}

module.exports = new MailService();
