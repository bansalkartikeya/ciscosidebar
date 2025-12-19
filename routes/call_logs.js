import express from 'express';
import cors from 'cors';
import { requireAuth } from '../lib/auth.js';
import { insertCallLog, getCallLogs, updateCallLog, deleteCallLog, getQueueByObjectId } from '../lib/database.js';
import { getPerson } from '../lib/webexService.js';
// import { sendCallLogEmail } from '../lib/mailgun.js';
import { sendCallLogEmail } from '../lib/mailgun_service.js';

const router = express.Router();



// Create a call log
router.post('/call_logs', requireAuth, async (req, res) => {
  try {
    
    const callLog = req.body;

    // pull company contacts for matching emails
    const companyEntry = await getQueueByObjectId(callLog.queue_id);
    callLog.full_actions = companyEntry?.actions || [];
   
    //Save to DB
    const insert = await insertCallLog(callLog);

    //Send email AFTER save
    try {
      await sendCallLogEmail(callLog);
      console.log("Email function completed");
    } catch (emailError) {
      console.error('Mailgun email failed:', emailError.message);
    }

    res.json({ insertedId: insert.insertedId });
  } catch (error) {
    console.error('Call log insert error:', error);
    res.status(500).json({ error: "Failed to create call log" });
  }
});

// Get call logs (filter by agent, queue, or all)
router.get('/call_logs', requireAuth, async (req, res) => {
  try {
    const logs = await getCallLogs(req.query);
    res.json(logs);
  } catch (error) {
    console.error('Call log fetch error:', error);
    res.status(500).json({ error: "Failed to get call logs" });
  }
});

// Update a call log
router.put('/call_logs/:id', requireAuth, async (req, res) => {
  try {
    const update = await updateCallLog(req.params.id, req.body);
    res.json(update);
  } catch (error) {
    console.error('Call log update error:', error);
    res.status(500).json({ error: "Failed to update call log" });
  }
});

// Delete a call log
router.delete('/call_logs/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await deleteCallLog(req.params.id);
    res.json(deleted);
  } catch (error) {
    console.error('Call log delete error:', error);
    res.status(500).json({ error: "Failed to delete call log" });
  }
});


export default router;