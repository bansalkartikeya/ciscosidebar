import Mailgun from "mailgun.js";
import formData from "form-data";

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY
});

const DOMAIN = "sandbox737e1e36c84845259455cce45078fbc7.mailgun.org";


//this function send mail to call log mailer and selected user from Contact Table
export async function sendCallLogEmail(callLog) {

  // Validate caller email
  if (!callLog.caller_email) {
    console.log("No caller email found. Skipping email.");
    return;
  }

  // Primary TO recipient
  const toRecipient = callLog.caller_email;

  // Build CC list from selected contacts
  let ccRecipients = [];

  if (Array.isArray(callLog.company_contacts) && callLog.company_contacts.length > 0) {

    callLog.company_contacts.forEach(name => {
      const match = callLog.full_actions?.find(a => a.name === name);

      if (match && match.email && match.email.trim() !== "") {
        ccRecipients.push(match.email.trim());
      }
    });
  }

  console.log("Email TO:", toRecipient);
  console.log("Email CC:", ccRecipients);

  const subject = `Call Log - ${callLog.caller_company || "N/A"} | ${callLog.agent} | ${new Date(callLog.timestamp).toLocaleString()}`;
  const html = callLog.reason_for_call || "<p>N/A</p>";

  // Build message object
  const emailData = {
    from: `noreply@${DOMAIN}`,
    to: toRecipient,
    subject,
    html
  };

  // Add CC if available
  if (ccRecipients.length > 0) {
    emailData.cc = ccRecipients;
  }

  try {
    await mg.messages.create(DOMAIN, emailData);
  } catch (error) {
    console.error("Mailgun error sending email:");
    console.error("Status:", error.status);
    console.error("Message:", error.message);
    throw error;
  }
}



// this function send mail to only call log mailer
// export async function sendCallLogEmail(callLog) {
    
//   if (!callLog.caller_email) {
//     console.log("No caller_email found. Skipping email.");
//     return;
//   };

//   console.log("Sending email to:", callLog.caller_email);

//   const subject = `Call Log - ${callLog.caller_company || "Company"} | ${callLog.agent} | ${new Date(callLog.timestamp).toLocaleString()}`;
//   const html = callLog.reason_for_call || "<p>N/A</p>";
//   //const text = callLog.reason_for_call || "N/A";

//     //const TEST_EMAIL = "kb21818@gmail.com";
//     //const TEST_TEXT = "Hello, this is a Mailgun test email.";

//     //const subject = "Call Log - Company";
//     //const text = TEST_TEXT;

//     try {
//         await mg.messages.create(DOMAIN, {
//             from: `noreply@${DOMAIN}`,
//             to: callLog.caller_email,
//             subject,
//             html
//         });
//     } catch (error) {
    
//     console.error("Mailgun error while sending email");
//     console.error("Status:", error.status);
//     console.error("Message:", error.message);
//     console.error("Details:", error.details || error.response?.body);
//     throw error;
//   }

// }