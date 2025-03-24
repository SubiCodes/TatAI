import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    secure:true,
    host: 'smtp.gmail.com',
    port:465,
    auth: {
        user:'tataihomeassistant@gmail.com',
        pass:'rrfycxyyltkinjbi'
    }
})

export const sendResetToken = (to, otp) =>  {
    const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 20px; text-align: center;">
            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #007bff;">Your One-Time Password (OTP)</h2>
                <p style="font-size: 16px; color: #333;">Use the token below to proceed with your password change:</p>
                <div style="font-size: 24px; font-weight: bold; color: #ffffff; background: #007bff; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                    ${otp}
                </div>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">You can only recieve this email 5 times in one day.</p>
            </div>
        </div>
    `;

    transporter.sendMail({
        from: 'tataihomeassistant@gmail.com',
        to: to,
        subject: "Reset Password Token",
        html: htmlTemplate
    }, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

export const sendVerificationToken = (to, otp) =>  {
    const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 20px; text-align: center;">
            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #007bff;">Your One-Time Password (OTP)</h2>
                <p style="font-size: 16px; color: #333;">Use the token below to verify your TatAi Account:</p>
                <div style="font-size: 24px; font-weight: bold; color: #ffffff; background: #007bff; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                    ${otp}
                </div>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">Get home repairs done with ease with help o TatAi.</p>
            </div>
        </div>
    `;

    transporter.sendMail({
        from: 'tataihomeassistant@gmail.com',
        to: to,
        subject: "Reset Password Token",
        html: htmlTemplate
    }, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}
