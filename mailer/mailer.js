import Mailgun from 'mailgun-js';
import moment from 'moment';

let mailgun = new Mailgun({apiKey:process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

function handleError(err) {
  return err;
}

let Emailer ={

  purchaseConfirmation: function (options){

    let sendData = {
      //Specify email data
      from: 'myexam.pe@gmail.com',
      //The email to contact
      to: options.user.email,
      bcc:'myexam.pe@gmail.com',
      //Subject and text data
      subject: `Thank you for your purchase from Pass-MyExam!`,
      html: `<div>This is to confirm your purchase from Pass-MyExam. Please review your purchase order below.</div>
              <div>
                        <table>
                            <tbody>
                            <tr>
                                <th>Order #</th>
                                <td style="text-transform: uppercase;">${options.order.orderId}</td>
                            </tr>
                            <tr>
                                <th>Item</th>
                                <td>${options.examDescription.title}</td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td>${options.examDescription.shortDescription}</td>
                            </tr>
                            <tr>
                                <th>Date of Purchase</th>
                                <td>${moment(options.order.createdAt).format('MM-DD-YYYY')}</td>
                            </tr>
                            <tr>
                                <th>Payment Type</th>
                                <td>${options.paymentOptions.brand} - ************${options.paymentOptions.last4}</td>
                            </tr>
                            <tr>
                                <th>Amount</th>
                                <td>$${options.examDescription.price}</td>
                            </tr>

                            <tr class="border-top">
                                <th>Total Paid</th>
                                <td>$${options.examDescription.price}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
            <p>Thank you for purchasing our exams! You're already on the right path!</p>
            <p>Best Regards,</p>
            <p>The Pass-MyExam Team</p>`
    };

   return mailgun.messages().send(sendData)
        .then((res)=>{

          return res;

        }, (err)=>{

          return err;
        });
  },

  sendPasswordResetToken: function (options){

    let sendData = {
      //Specify email data
      from: 'myexam.pe@gmail.com',
      //The email to contact
      to: options.to,
      //Subject and text data
      subject: `Pass-MyExam: Your Password Reset Link`,
      html: `<div style="margin: 10px 0;">Hello,</div>
                <div style="margin: 10px 0;">You recently requested a new password. Follow the link below to reset your password</div>
                <div style="margin: 10px 0;"></div>
                <div style="margin: 10px 0;"><a href="${options.resetUrl}">Click Here To Set Your New Password!</a></div>
                <div style="margin: 10px 0;"></div>
                 <div style="margin: 10px 0;">If you did not request a new password please contact us immediately.</div>
                <div style="margin: 10px 0;"></div>
                <div style="margin: 10px 0;">Best Regards,<br/> The Pass-MyExam Team</div>`
    };

    return mailgun.messages().send(sendData)
        .then((res)=>{
          return {data:'success'};
        }, (err)=>{
          return {error: 'Error'};
        });
  },

};

module.exports = Emailer;