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

  // send: function(mailReq){
  //
  //   var mailOptions = {
  //     from: mailReq.from, // sender address
  //     to: mailReq.to, // list of receivers
  //     subject: mailReq.subject, // Subject line
  //     html: mailReq.html // email body
  //   };
  //
  //   // send mail with defined transport object
  //   return transporter.sendMail(mailOptions)
  //       .then((data)=>{
  //         return data;
  //       }).catch(handleError);
  // },
  //
  // sendWorkOrderEmail: function(mailReq){
  //
  //   var mailOptions = {
  //     from: 'bis@specialtysalesllc.com', // sender address
  //     to: mailReq.to, // list of receivers
  //     cc:mailReq.cc,
  //     subject: `Specialty Sales: Work Order:${mailReq.workOrderId} Has Been Created`, // Subject line
  //     html: `<div style="margin: 10px 0;">Hello, ${mailReq.toEmployee}</div>
  //               <div style="margin: 10px 0;">A new work order #${mailReq.workOrderId} was assigned to you. Click the link below to view the work order.</div>
  //               <div style="margin: 10px 0;"></div>
  //               <div style="margin: 10px 0;">Dairy: ${mailReq.dairyAlias}, <a href="http://maps.google.com/?q=${mailReq.dairyAddress}">${mailReq.dairyAddress}</a> </div>
  //               <div style="margin: 10px 0;"></div>
  //               <div style="margin: 10px 0;">Work Order: ${mailReq.text}</div>
  //               <div style="margin: 10px 0;"></div>
  //               <div style="margin: 10px 0;"><a href="${mailReq.orderUrl}">Click Here To View Work Order</a></div>
  //               <div style="margin: 10px 0;"></div>
  //               <div style="margin: 10px 0;">Regards,<br/> Specialty Sales</div>` // email body
  //   };
  //
  //   // send mail with defined transport object
  //   return transporter.sendMail(mailOptions)
  //       .then((data)=>{
  //         return data;
  //       }).catch(handleError);
  // },

};

module.exports = Emailer;