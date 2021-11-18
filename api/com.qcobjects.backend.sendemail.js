/**
 * QCObjects SendEmail
 * ________________
 *
 * Author: Jean Machuca <correojean@gmail.com>
 *
 * Cross Browser Javascript Framework for MVC Patterns
 * QuickCorp/QCObjects is licensed under the
 * GNU Lesser General Public License v3.0
 * [LICENSE] (https://github.com/QuickCorp/QCObjects/blob/master/LICENSE.txt)
 *
 * Permissions of this copyleft license are conditioned on making available
 * complete source code of licensed works and modifications under the same
 * license or the GNU GPLv3. Copyright and license notices must be preserved.
 * Contributors provide an express grant of patent rights. However, a larger
 * work using the licensed work through interfaces provided by the licensed
 * work may be distributed under different terms and without source code for
 * the larger work.
 *
 * Copyright (C) 2015 Jean Machuca,<correojean@gmail.com>
 *
 * Everyone is permitted to copy and distribute verbatim copies of this
 * license document, but changing it is not allowed.
*/
/*eslint no-unused-vars: "off"*/
/*eslint no-redeclare: "off"*/
/*eslint no-empty: "off"*/
/*eslint strict: "off"*/
/*eslint no-mixed-operators: "off"*/
/*eslint no-undef: "off"*/
/*eslint no-useless-escape: "off"*/
"use strict";
const fs = require("fs");
const path = require("path");
const absolutePath = path.resolve(__dirname, "./");
const templatesPath = path.resolve(absolutePath, "../../templates/");
var nodemailer = require("nodemailer");

const assignData = function (source, data) {
//  source = source.replace(new RegExp("\\*\\|(.*)\\|\\*", "g"),"{{$1}}");
  source = source.replace(new RegExp("\\*\\|(.*)\:(.*)\\|\\*", "g"),"{{$1_$2}}");
  return new Promise( (resolve, reject) => {
    (New(Component, {
        name: "static_source",
        template: source,
        cached:false,
        tplsource: "inline",
        data: JSON.parse(data),
        done ({request, component}) {
          resolve(component.parsedAssignmentText);
          return Promise.resolve({request, component});
        }
      }));
  }).catch ( e => {
    logger.debug(e.toString());
  });
};

Package("com.qcobjects.backend.sendemail",[
  Class ("EmailNotification", {
    microservice: null,
    parseData (formData, name) {
      return JSON.parse(formData.toString())[name];
    },

    sendEmailUser (formData) {
      let microservice = this.microservice;
      let emailNotification = this;
      return emailNotification.sendEmail(formData,
                             CONFIG.get("gmail_from"),
                             emailNotification.parseData(formData, "email"),
                             CONFIG.get("sendemail_subject_user"),
                             CONFIG.get("sendemail_user_template_file")
                           );
    },

    sendEmailBackoffice (formData) {
      let microservice = this.microservice;
      let emailNotification = this;
      return emailNotification.sendEmail(formData,
                             CONFIG.get("gmail_from"),
                             CONFIG.get("gmail_to"),
                             CONFIG.get("sendemail_subject_backoffice"),
                             CONFIG.get("sendemail_backoffice_template_file")
                           );
    },

    sendEmail (formData, from, to, subject, email_template_name){
      var microservice = this.microservice;
      let emailNotification = this;
      return new Promise ((resolve, reject)=> {

        logger.debug("PREPARING DATA TO SEND EMAIL...");
        var emailBody = fs.readFileSync(path.resolve(templatesPath , `email/${email_template_name}`));

        assignData (emailBody.toString(), formData.toString()).then (function (response){
          logger.debug("SENDING EMAIL...");
          emailBody = response;
          var transport = {
           attachDataUrls:true,
           service: "gmail",
           auth: {
                  user: CONFIG.get("gmail_user"),
                  pass: CONFIG.get("gmail_password")
              }
          };

          var transporter = nodemailer.createTransport(transport);

          const mailOptions = {
            from: from, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: emailBody// plain text body

          };

          microservice.body = {result:"OK"};
          try {
            transporter.sendMail(mailOptions, function (err, info) {
               if(err){
                logger.warn(err.toString());
                reject(err);
               } else {
                logger.info(_DataStringify(info));
                resolve();
               }

            });
          } catch (e){
            logger.debug(e.toString());
            reject(e);
          }
        }).catch (function (e){
          logger.debug(e.toString());
          reject(e);
        });

      });
    }

  })
]);
