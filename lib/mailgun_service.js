import Mailgun from "mailgun.js";
import formData from "form-data";

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY
});

const DOMAIN = "sandbox737e1e36c84845259455cce45078fbc7.mailgun.org";


export async function sendCallLogEmail(callLog) {
  if (!callLog.caller_email) return;

  console.log("Sending email to:", callLog.caller_email);

  const subject = `Call Log - ${callLog.caller_company || "Company"} | ${callLog.agent} | ${new Date(callLog.timestamp).toLocaleString()}`;
  const text = callLog.reason_for_call || "N/A";
    try {
        await mg.messages.create(DOMAIN, {
            from: `postmaster@${DOMAIN}`,
            to: callLog.caller_email,
            subject,
            text
        });
    } catch (error) {
    
    console.error("Mailgun error while sending email");
    console.error("Status:", error.status);
    console.error("Message:", error.message);
    console.error("Details:", error.details || error.response?.body);
    throw error;
  }

}