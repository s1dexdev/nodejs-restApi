const sgMail = require('@sendgrid/mail');
require('dotenv').config();

class CreateSenderSendgrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    return await sgMail.send({ ...msg, from: 's1dexsender@ex.ua' });
  }
}

module.exports = CreateSenderSendgrid;
