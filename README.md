# QCObjects Lib SendMail (NodeMailer)

QCObjects Lib to send emails using NodeMailer and Gmail.

## Instructions

1. Install this dependency in your project using npm

```shell
npm i --save qcobjects-lib-sendemail
```

2. In your config.json file, create the following settings

```shell
{
  "gmail_user":"$ENV(GMAIL_USER)",
  "gmail_password":"$ENV(GMAIL_PASSWORD)",
  "gmail_from":"$ENV(GMAIL_FROM)",
  "gmail_to":"$ENV(GMAIL_TO)",
  "sendemail_subject_user": "$ENV(SENDEMAIL_SUBJECT_USER)",
  "sendemail_subject_backoffice": "$ENV(SENDEMAIL_SUBJECT_BACKOFFICE)",
  "sendemail_user_template_file": "$ENV(SENDEMAIL_USER_TEMPLATE_FILE)",
  "sendemail_backoffice_template_file": "$ENV(SENDEMAIL_BACKOFFICE_TEMPLATE_FILE)",
  "gmail_subject":"$ENV(GMAIL_SUBJECT)"
}
```

Above settings will bring the API Key values from the following environment variables:

GMAIL_USER
GMAIL_PASSWORD
GMAIL_FROM
GMAIL_TO
SENDEMAIL_SUBJECT_USER
SENDEMAIL_SUBJECT_BACKOFFICE
GMAIL_SUBJECT


Learn more about NodeMailer in the official [NodeMailer Documentation website](https://nodemailer.com/about/)

5. Test the integration

```shell
npm test
```

4. Start the QCObjects HTTP2 Server

```shell
qcobjects-server
```
If you haven't installed QCObjects before, learn more about [Installing QCObjects here](https://docs.qcobjects.org/#installing)
