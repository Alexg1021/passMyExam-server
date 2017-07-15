import Mailgun from 'mailgun-js';
import moment from 'moment';

let mailgun = new Mailgun({apiKey:process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

function handleError(err) {
  return err;
}

let Emailer ={

  purchaseConfirmation: function (options){

     let payType = function payType(){

       if(options.paymentOptions.brand){

         return `${options.paymentOptions.brand} - ************${options.paymentOptions.last4}`;

       }else{

         return `${options.paymentOptions.payer.payment_method}`;
       }
    };

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
                                <td>${payType()}</td>
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

          console.log('unsuccessful', err);
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
                <div style="margin: 10px 0;">You recently requested a new password. Follow the link below to reset your password--You will have 1 hour to reset your password.</div>
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

  userExamResults: function (options){

    let percent = options.examResults.answeredCorrectly / options.examResults.totalQuestions;
    percent = Math.floor(percent * 100);

    let sendData = {
      //Specify email data
      from: 'myexam.pe@gmail.com',
      //The email to contact
      to: options.user.email,
      //Subject and text data

      /*
       * { __v: 0,
       exam: 595c2c5759c8a153af5e3b42,
       _id: 59696cfe704c324d921f61d7,
       deletedAt: null,
       updatedAt: 2017-07-15T01:16:46.686Z,
       createdAt: 2017-07-15T01:16:46.686Z,
       averageTimePerQuestion: null,
       answeredIncorrectly: 3,
       answeredCorrectly: 0,
       totalTime: null,
       totalQuestions: 31,
       answeredQuestions: 3 }
       * */
      subject: `Way to Go! View Your Exam Results`,
      html: `<div>Hello ${options.user.firstName} ${options.user.lastName},</div>
                <p>Congratulations on finishing your exam. Below are your exam results! To view an in depth analysis of your results navigate over to
                 <a href="${process.env.CLIENT_URL}/my-pme/my-exam-results" target="_blank">${process.env.EMAIL_CLIENT_URL}</a> to see more.</p>
              <div>
                        <table>
                            <tbody style="text-align: left;">
                            <tr>
                                <th>Total Questions</th>
                                <td style="text-transform: uppercase;">${options.examResults.totalQuestions}</td>
                            </tr>
                            <tr>
                                <th>Questions Answered</th>
                                <td>${options.examResults.answeredQuestions}</td>
                            </tr>
                            <tr>
                                <th>Questions Answered Correctly</th>
                                <td>${options.examResults.answeredCorrectly}</td>
                            </tr>
                            <tr>
                                <th>Exam Score</th>
                                <td>${percent}%</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
            <p>Your path to owning your future is already underway. Continue to push yourself by taking another exam and learning about your test taking skills with us today!</p>
            <p><small>If you feel you have received this email by mistake please contact us immediately.</small></p>
            <p>Best Regards,</p>
            <p>The Pass-MyExam Team</p>`
    };

    return mailgun.messages().send(sendData)
        .then((res)=>{

          return res;

        }, (err)=>{

          return err;
        });
  }

};

module.exports = Emailer;