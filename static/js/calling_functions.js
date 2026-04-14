//interacting with webex Calling through the WEBEX REST API

//webex calling requires E.164 format, this function ensures that any number starts with a "+"
function updateDestination(destination){
    customLog("updateDestination (initial):", destination);
    if(destination[0] !== "+"){
        destination = "+" + destination;
    }
    customLog("updateDestination (updated):", destination);
    return destination;
}

//this returns all active calls for the agent(inbound,outbound,held...)
async function getCalls(){
    let callsResponse = await fetch(`${webexUrl}/telephony/calls`, {
        method: 'GET',
        headers: webexHeaders
    });
    return callsResponse;
}

//fetches all calls for agent using above function and loops through
//finds call by matching caller Id or caller name to the remote party number and returns call ID
async function getCall(callerId, callerName){
    customLog("getCall callerId", callerId);
    let callsResponse = await getCalls();
    let matchedId;
    if(callsResponse.status === 401){
        window.location.reload(true);
    } else {
        let calls = await callsResponse.json();
        customLog('getCall calls:', calls)
        for(let call of calls.items){
            if(call.remoteParty.number === callerId){
                matchedId = call.id;
                customLog(`getCall matched callId: ${call.id}`);
                break;
            }
        }
        if(!matchedId){
            customLog(`getCall: No matched callId, trying with secondary id.`);
            for(let c of calls.items){
                if(c.remoteParty.number === callerName){
                    customLog("getCall Remote Number matches callerName");
                    matchedId = c.id;
                    customLog(`getCall matched callId: ${matchedId}`);
                    break;
                }
            }
        }
    }
    return matchedId;
}

//places a new outbound call
async function dial(destination){
    let dialResponse = await fetch(`${webexUrl}/telephony/calls/dial`, {
        method: 'POST',
        headers: webexHeaders,
        body: JSON.stringify({destination: destination,})
    });
    customLog(`dial dialResponse.status:${dialResponse.status}`);
    return dialResponse;
}

// depending on the payload a call can be diverted(i.e transfered, forwarded..)
async function divert(payload){
    let divertResponse = await fetch(`${webexUrl}/telephony/calls/divert`, {
        method: 'POST',
        headers: webexHeaders,
        body: JSON.stringify(payload)
    });
    customLog(divertResponse);
    customLog(`divert divertResponse.status:${divertResponse.status}`);
    return divertResponse;
}

//fetches all details for the current agent/person logged in 
async function getCurrentUser(){
    try {
        const response = await fetch('https://webexapis.com/v1/people/me', {
          method: "GET",
          headers: webexHeaders,
        });
        
        const person = await response.json();
        console.log('getPerson response status:', response.status);
        
        if (response.status === 429) {
          person.retry = response.headers.get('Retry-After');
        }
        
        return person;
    } catch (error) {
        console.error('Error getting person:', error);
        throw error;
    }
}