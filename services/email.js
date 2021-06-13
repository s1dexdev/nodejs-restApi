const Mailgen = require('mailgen');

class EmailService {
  constructor(env, sender) {
    this.sender = sender;

    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000';
        break;
      case 'production':
        this.link = 'link for production';
        break;

      default:
        this.link = 'http://localhost:3000';
        break;
    }
  }

  #createTemplateVerifyEmail(token) {
    const mailGenerator = new Mailgen({
      theme: 'salted',
      product: {
        name: 'System Contacts',
        link: this.link,
      },
    });
    const email = {
      body: {
        name: 'Guest',
        intro:
          "Welcome to System Contacts! We're very excited to have you on board.",
        action: {
          instructions:
            'To get started with System Contacts, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${token}`,
          },
        },
      },
    };

    // Generate an HTML email with the provided contents
    return mailGenerator.generate(email);
  }

  async sendVerifyPasswordEmail(token, email) {
    const emailBody = this.#createTemplateVerifyEmail(token);
    const result = await this.sender.send({
      to: email,
      subject: 'Verify your account',
      html: emailBody,
    });
    console.log(result);
  }
}

module.exports = EmailService;