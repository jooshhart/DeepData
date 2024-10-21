require('dotenv').config()
const sgMail = require('@sendgrid/mail');
const Api455Error = require('../middleware/error-handling/api455Error');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


/*****************************
 * Function: sendUserWelcomeEmail
 * 
 * 
 * Description: Sends the user an introduction email
 * 
 * 
 * Inputs: name, email
 * 
 * 
 * Outputs: email to suer
 * 
 * 
 * Use case: Welcome Email
 * 
 * 
 *********************** */

const sendUserWelcomeEmail = async (name, email) => {
  try {
    const msg = {
      to: `${email}`, // Change to your recipient
      from: 'DeepDataVisuals', // Change to your verified sender
      template_id: 'd-e5208d820d144236a9cf6ee3fd5eb524',
      dynamic_template_data: {
        "username": username
      }
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
    } catch(err){
      throw new Api455Error(`${err.message}`);
    }
}

/*****************************
 * Function: sendRegistrationSubmissionEmail
 * 
 * 
 * Description: sends business owner an email confirming the registration creation
 * 
 * 
 * Inputs: email
 * 
 * 
 * Outputs: an email to the business owner 
 * 
 * 
 * Use case: confirm registration (add registration function in business controller)
 * 
 * 
 *********************** */

const sendRegistrationSubmissionEmail = async (email) => {
  try{
    const msg = {
      to: `${email}`, // Change to your recipient
      from: 'DeepDataVisuals', // Change to your verified sender
      template_id: 'd-8c36e8ef9b384bb189fd14d9664d7201'
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
  } catch(err){
    throw new Api455Error(`${err.message}`);
  }
};

/*****************************
 * Function: sendRegistrationApprovedEmail
 * 
 * 
 * Description: Sends email with a code, link to the business owner to finish onboarding
 * 
 * 
 * Inputs: email, code <- temp password, name, link <- stripe onboarding link
 * 
 * 
 * Outputs: email
 * 
 * 
 * Use case: approveRegistration
 * 
 * 
 *********************** */

const sendRegistrationApprovedEmail = async (email, code, name, link) => {
  try{
  const msg = {
    to: `${email}`, // Change to your recipient
    from: 'DeepDataVisuals', // Change to your verified sender
    template_id: 'd-96a8597a01dc482eaf824f6acf0a7164',
    dynamic_template_data: {
      "code": code,
      "username": username,
      "link": link
    }
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
  } catch(err){
    throw new Api455Error(`${err.message}`);
  }
};

/*****************************
 * Function: sendRegistrationDeniedEmail
 * 
 * 
 * Description: Lets business owner know they weren't approved for our platform
 * 
 * 
 * Inputs: name, email
 * 
 * 
 * Outputs: email
 * 
 * 
 * Use case: denyRegistration
 * 
 * 
 *********************** */

const sendRegistrationDeniedEmail = async(name, email) => {
  try{
    const msg = {
      to: `${email}`, // Change to your recipient
      from: 'DeepDataVisuals', // Change to your verified sender
      template_id: 'd-63fac6f6a18745fdbfb17fdce48ef077',
      dynamic_template_data: {
        "username": username
    }
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
    } catch(err){
    throw new Api455Error(`${err.message}`);
  }
};

/*****************************
 * Function: sendPasswordResetEmail
 * 
 * 
 * Description: sends the email with the link for them to reset their password
 * 
 * 
 * Inputs: data.name: first name, and data.link <- url to the FE to reset password
 * 
 * 
 * Outputs: email to reset the password
 * 
 * 
 * Use case: Forgot/Reset Password
 * 
 * 
 *********************** */
const sendResetPasswordEmail = async(data) => {
  try{
    const msg = {
      to: `${data.email}`,
      from: 'DeepDataVisuals',
      template_id:'d-b32eaf80c4a948c7b3d36d681e21af9b',
      dynamic_template_data: {
        "username": data.username,
        "link": data.link,
      }
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
  } catch(err){
    throw new Api455Error(`${err.message}`);
  }
};

module.exports = {
    sendUserWelcomeEmail,
    sendRegistrationApprovedEmail,
    sendRegistrationDeniedEmail,
    sendRegistrationSubmissionEmail,
    sendResetPasswordEmail,
};

/*****************************
 * Function: 
 * 
 * 
 * Description: 
 * 
 * 
 * Inputs: 
 * 
 * 
 * Outputs: 
 * 
 * 
 * Use case: 
 * 
 * 
 *********************** */