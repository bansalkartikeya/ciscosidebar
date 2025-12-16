import axios from 'axios';

const MAILGUN_DOMAIN = 'sandbox49bf71aa94204dbeb76bd4ce5ae828ce.mailgun.org';
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;

export async function sendCallLogEmail(callLog) {
  if (!MAILGUN_API_KEY) {
    throw new Error('MAILGUN_API_KEY not set');
  }

  const text = `
New call log saved

Agent: ${callLog.agent}
Call Type: ${callLog.call_type}
Caller Name: ${callLog.caller_name || 'N/A'}
Company: ${callLog.caller_company || 'N/A'}
Callback Number: ${callLog.callback_number || 'N/A'}
Reason: ${callLog.reason_for_call || 'N/A'}
Timestamp: ${callLog.timestamp}
`;

  return axios.post(
    `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
    new URLSearchParams({
      from: `Call Logs <postmaster@${MAILGUN_DOMAIN}>`,
      to: 'shawnnarebecca.largoafonso@orange.com',
      to: 'kartikeya.bansal@orange.com',
      subject: 'New Call Log Created',
      text
    }),
    {
      auth: {
        username: 'api',
        password: MAILGUN_API_KEY
      }
    }
  );
}
