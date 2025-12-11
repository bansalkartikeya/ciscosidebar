function openModal(el) {
    $(el).addClass('is-active');
}

function closeModal(el) {
    $(el).removeClass('is-active');
}

function closeAllModals() {
    let modals = $('.modal');
    for(let modal of modals){
        closeModal(modal);
    };
}

function addCallLogRow(call_log) {

    // Extract values safely
    const timestamp = call_log?.timestamp || "";
    const agent = call_log?.agent || "";
    const callType = call_log?.call_type || "";
    const companyContacts = (call_log?.company_contacts || []).join(", ");
    const reasonForCall = call_log?.reason_for_call || "";
    const callerName = call_log?.caller_name || "";
    const callerCompany = call_log?.caller_company || "";
    const callbackNumber = call_log?.callback_number || "";
    const callerEmail = call_log?.caller_email || "";

    // Build row using plain TD + span
    const row = $(`
        <tr class="call-log-row">

            <td class="custom-cell"><span class="cl-timestamp">${timestamp}</span></td>
            <td class="custom-cell"><span class="cl-agent">${agent}</span></td>
            <td class="custom-cell"><span class="cl-call-type">${callType}</span></td>
            <td class="custom-cell"><span class="cl-company-contact">${companyContacts}</span></td>
            <td class="custom-cell"><span class="cl-reason">${reasonForCall}</span></td>
            <td class="custom-cell"><span class="cl-caller-name">${callerName}</span></td>
            <td class="custom-cell"><span class="cl-caller-company">${callerCompany}</span></td>
            <td class="custom-cell"><span class="cl-callback-number">${callbackNumber}</span></td>
            <td class="custom-cell"><span class="cl-caller-email">${callerEmail}</span></td>
            <td class="custom-cell">
                <button class="button is-small action-view"><i class="fas fa-eye"></i></button>
            </td>
        </tr>
    `);

    // Store full call log object for view/edit later
    row.data("call-log-data", call_log);

    //Call log view-button function
    row.find(".action-view").on("click", function () {
    const data = row.data("call-log-data");
    viewCallLog(data);
    });

    // Add to table
    if ($("#call-log-settings").length) {
        $("#call-log-settings").prepend(row);
    } else if ($("#call-logs").length) {
        $("#call-logs").prepend(row);
    } else {
        console.error("No call log table found!");
    }
    
}

function viewCallLog(data) {
    if (!data) return;

    $('#view-timestamp').val(data.timestamp || "");
    $('#view-agent').val(data.agent || "");
    $('#view-call-type').val(data.call_type || "");
    $('#view-company-contacts').val((data.company_contacts || []).join(", "));
    $('#view-caller-name').val(data.caller_name || "");
    $('#view-caller-company').val(data.caller_company || "");
    $('#view-callback-number').val(data.callback_number || "");
    $('#view-caller-email').val(data.caller_email || "");
    // $('#view-reason-for-call').val(data.reason_for_call || "");
    $('#view-reason-for-call').html(data.reason_for_call || '');

    openModal('#modal-calllog-view');
}
//-------------------------------------contact section for admin----------------------------------------------------------------
function editContact(data) {

    // Re-enable everything
    $('#add-contact-modal input, #add-contact-modal select, #add-contact-modal textarea')
    .prop('disabled', false);

    if (!data) return;
    // Fill modal fields
    $('#contact-name').val(data.name || '');
    $('#contact-dept').val(data.department || '');
    $('#contact-answer-mode').val(data.answering_mode || '');
    $('#contact-transfer-phone').val(data.transfer_phone || '');
    $('#contact-instructions').val(data.instructions || '');

    $('#contact-email').val(data.email || '');
    $('#contact-office').val(data.office_phone || '');
    $('#contact-cell').val(data.cell_phone || '');
    $('#contact-home').val(data.home_phone || '');
    $('#contact-other').val(data.other_phone || '');

    // Change button text
    $('#save-contact-button')
        .text("Save Changes")
        .removeClass("is-primary")
        .addClass("is-success")
        .show();

    // Mark the modal as EDIT mode
    $('#add-contact-modal').attr('data-mode', 'edit');
    // Open modal
    openModal('#add-contact-modal')    
}

function viewContact(data) {
    if (!data) return;

    // Fill modal fields
    $('#contact-name').val(data.name || '');
    $('#contact-dept').val(data.department || '');
    $('#contact-answer-mode').val(data.answering_mode || '');
    $('#contact-transfer-phone').val(data.transfer_phone || '');
    $('#contact-instructions').val(data.instructions || '');

    $('#contact-email').val(data.email || '');
    $('#contact-office').val(data.office_phone || '');
    $('#contact-cell').val(data.cell_phone || '');
    $('#contact-home').val(data.home_phone || '');
    $('#contact-other').val(data.other_phone || '');

    // Make all fields read-only
    $('#add-contact-modal input, #add-contact-modal select, #add-contact-modal textarea')
        .prop('disabled', true);

    // Hide Add/Save button
    $('#save-contact-button').hide();

    // Show only Close button
    $('#close-contact-modal').show();

    // Open modal
    openModal('#add-contact-modal')
}

function addActionRow(action) {
    // Determine transfer number
    let transferNumber = '';
    switch(action.transfer_phone) {
        case 'Office Phone': transferNumber = action.office_phone; break;
        case 'Cell Phone': transferNumber = action.cell_phone; break;
        case 'Home Phone': transferNumber = action.home_phone; break;
        case 'Other Phone': transferNumber = action.other_phone; break;
    }
    //clean transfer phone despense with select... if exists
    const transferPhone = $('#contact-transfer-phone').val();
    action.transfer_phone = transferPhone === "Select..." ? "" : transferPhone;

    // Compose agent instruction
    let agentInstruction = '';
    if(action.answering_mode && action.transfer_phone) {
        agentInstruction = `${action.answering_mode} to ${action.transfer_phone}`;
    }
    else if(action.answering_mode){
        agentInstruction = `${action.answering_mode}`
    }
    //voicemail
    agentVoicemail='false'
    if (action.answering_mode === 'Send Voicemail'){
        agentVoicemail='true'
    }
    let row = $(`
        <tr class="action-row">
            <td class="custom-cell">
                <button class="button is-small action-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
            <td class="custom-cell"><span class="action-name">${action.name}</span></td>
            <td class="custom-cell"><span class="action-dept">${agentInstruction}</span></td>
            <td class="custom-cell"><span class="action-answering">${transferNumber}</span></td>
            <td class="custom-cell"><span class="action-transfer">${agentVoicemail}</span></td>
            <td class="custom-cell">
                <button class="button is-small action-view"><i class="fas fa-eye"></i></button>
            </td>
             <td class="custom-cell">
                <button class="button is-small action-edit"><i class="fas fa-edit"></i></button>
            </td>
        </tr>
    `);

    // Store full data in the row for saveSettings
    row.data('action-data', action);

    // Delete button
    row.find('.action-delete').on('click', function() {
        row.remove();
    });

    //view the data
    row.find('.action-view').on('click', function() {
        viewContact(row.data('action-data'));
    });

    //edit the data
    row.find('.action-edit').on('click', function() {
        window.currentEditRow = row;
        editContact(row.data('action-data'));
    });


    $('#contacts-settings').append(row);
}

function updateContactRow(row, action) {
    console.log (action)

    // clean transfer phone first
    const transferPhone = $('#contact-transfer-phone').val();
    action.transfer_phone = transferPhone === "Select..." ? "" : transferPhone;

    let transferNumber = "";
    switch (action.transfer_phone) {
        case "Office Phone": transferNumber = action.office_phone; break;
        case "Cell Phone": transferNumber = action.cell_phone; break;
        case "Home Phone": transferNumber = action.home_phone; break;
        case "Other Phone": transferNumber = action.other_phone; break;
    }

    let agentInstruction = "";
    if (action.answering_mode && action.transfer_phone) {
        agentInstruction = `${action.answering_mode} to ${action.transfer_phone}`;
    } else if (action.answering_mode) {
        agentInstruction = action.answering_mode;
    }
    //voicemail
    agentVoicemail='false'
    if (action.answering_mode === 'Send Voicemail'){
        agentVoicemail='true'
    }


    // Update displayed text
    row.find('.action-name').text(action.name);
    row.find('.action-dept').text(agentInstruction);
    row.find('.action-answering').text(transferNumber);
    row.find('.action-transfer').text(agentVoicemail);

    // update stored full data
    row.data('action-data', action);
}

function searchContacts() {
    const term = $('#contact-search').val().toLowerCase();

    $('#contacts-settings .action-row').each(function () {
        const row = $(this);

        // stored action object
        const data = row.data('action-data') || {};

        // Make one searchable string
        const combined = Object.values(data)
            .join(' ')
            .toLowerCase();

        if (combined.includes(term)) {
            row.show();
        } else {
            row.hide();
        }
    });
}
//-------------------------------------contact section for admin---------------------------------------------------------------------------


function fillSettings(data, editable = false) {

    const htmlFields = ["instructions", "script", "website", "info"];

    for (let item of allInputs) {

        let key = item.id.replaceAll("-", "_");
        let settingId = `${item.id}-settings`;
        let container = $(`#${settingId}`);
        container.empty();

        let value = data ? data[key] : "";

        // ---------------------------------------------------------
        // EDIT MODE (inside Edit Profile modal)
        // ---------------------------------------------------------
        if (editable) {
            if (htmlFields.includes(item.id)) {
                container.html(`
                    <textarea id="${item.id}-input"
                        class="textarea admin-input"
                        rows="6">${value || ""}</textarea>
                `);
            } else {
                container.html(`
                    <input id="${item.id}-input"
                        class="input admin-input"
                        value="${value || ""}">
                `);
            }
            continue;
        }

        // ---------------------------------------------------------
        // PREVIEW MODE (on main settings screen)
        // ---------------------------------------------------------

        // Visible preview div
        container.append(`<div class="preview">${value || ""}</div>`);

        // Hidden admin-input (needed for #modal-settings-save backend save)
        if (htmlFields.includes(item.id)) {
            container.append(`
                <textarea id="${item.id}-input"
                    class="admin-input is-hidden"
                    rows="1">${value || ""}</textarea>
            `);
        } else {
            container.append(`
                <input id="${item.id}-input"
                    class="admin-input is-hidden"
                    value="${value || ""}">
            `);
        }
    }

    // ---------------------------------------------------------
    // Contacts and Call Logs remain unchanged
    // ---------------------------------------------------------
    $('#contacts-settings').empty();
    if (data && data.actions) data.actions.forEach(addActionRow);

    $('#call-log-settings').empty();
    if (data && data.call_logs) data.call_logs.forEach(addCallLogRow);

}

function openSettings(entry){
    fillSettings(entry);
    currentEntry = entry;
    if(entry){
        $('#modal-settings-delete').show();
        // modal-settings-delete is a button in the footer of the modal that exists in the html
    } else {
        $('#modal-settings-delete').hide();
    }
    openModal('#modal-settings');
    // #modal-settings is a modal div whose skeleton is defined in the html header,section,footer
    $('#settings-menu').hide();
}

function clearCallLogModal(){
    $('#callType').val('');
    $('#callbackNumber').val('');
    $('#companyContact').empty().append(`<option value="">Select</option>`);
    $('#callerName').val('');
    $('#callerCompany').val('');
    $('#callerEmail').val('');

    // Reset Quill editor + hidden field
    if (window.quillEditor) {
        window.quillEditor.setText('');
        $('#reasonForCall').val('');
    }

    // Company name label
    $('#companyName').val('');
}
let companyContactSelect = null;

function initCompanyContactSelect() {
  if (companyContactSelect) return; // prevent re-initializing

  companyContactSelect = new TomSelect("#companyContact", {
    persist: false,
    maxItems: null,   // allow unlimited selections
    plugins: ['remove_button'],
  });
}


function openCallLogModal(currentEntry){
    console.log(currentEntry)
    //clear current entries
    clearCallLogModal();
    initCompanyContactSelect();  // initialize multi-select
    const select = companyContactSelect;
    // Clear existing options + items
    select.clear();
    select.clearOptions();

    // if existing company
    if (currentEntry) {
        // fill company name
        $('#companyName').val(currentEntry.company);

        // fill contacts dropdown
        $('#companyContact').empty().append(`<option value="">Select</option>`);
        if (currentEntry.actions && currentEntry.actions.length) {
            currentEntry.actions.forEach(a => {
               select.addOption({ value: a.name, text: a.name });
            });
        }
    }
    // if it's new company (currentEntry == undefined)
    else {
        $('#companyName').val('');
        // $('#companyContact').empty().append(`<option value="">Select</option>`);
    }

    // finally open modal
    openModal('#modal-subform');

}

async function saveSettings(){
    console.log('saveSettings currentEntry', currentEntry);
    $("#modal-settings-error").empty();
    let newEntry = {};
    let inputs = $('.admin-input');
    for(let input of inputs){
        newEntry[input.id.replace("-input","").replace("-","_")] = $(input).val();
    }
    let actions = $('#contacts-settings').find('tr');
    newEntry.actions = [];
    actions.each(function() {
        const data = $(this).data('action-data');
        if(data) newEntry.actions.push(data);
    });
    if(currentEntry){
        newEntry["_id"] = currentEntry["_id"];
    }
    console.log("saveSettings newEntry", newEntry);
    let response = await fetch('/admin',{
        method: "POST",
        headers:customHeaders,
        body: JSON.stringify(newEntry)
    });
    let json = await response.json();
    $('#modal-settings-save').removeClass('is-loading');
    customLog("saveSettings POST /admin response:", json);
    if(json.error){
        $("#modal-settings-error").addClass("has-text-danger");
        $("#modal-settings-error").removeClass("has-text-success");
        $("#modal-settings-error").text(json.error);
    } else {
        if(json._id && !currentEntry){
            currentEntry = {"_id": json._id, "company":newEntry.company};
            $('#modal-settings-delete').show();
        }
        $("#modal-settings-error").addClass("has-text-success");
        $("#modal-settings-error").removeClass("has-text-danger");
        $("#modal-settings-error").text("Save successful");

        // Restore company profile edit button
        $("#edit-profile-button").show();
    }
}

async function saveCallLog(){
    $("#modal-settings-error").empty();   //using this error div from the admin modal only(footer)
    //create the data to be sent
    const currentUser = await getCurrentUser(); //get current user
    let callLog = {
            queue_id: window.currentAgentEntry._id || currentEntry._id,   // IMPORTANT: link to queue
            timestamp: new Date(),
            call_type:  $('#callType').val().trim(),
            callback_number: $('#callbackNumber').val().trim() || null,
            // company_contact: $('#companyContact').val().trim() || null,
            company_contacts: companyContactSelect.getValue(),
            caller_name: $('#callerName').val().trim() || null,
            reason_for_call: $('#reasonForCall').val().trim() || null,
            caller_company: $('#callerCompany').val().trim() || null,
            caller_email: $('#callerEmail').val().trim() || null,
            agent: currentUser.displayName
    };
    //post the data to the backend
    let response = await fetch('/call_logs',{
        method: "POST",
        headers:customHeaders,
        body: JSON.stringify(callLog)
    });

    //getting json from response
    let json = await response.json();
    $('#modal-subform-save').removeClass('is-loading');
    customLog("calllog created:", json);
    if(json.error){
        $("#modal-settings-error").addClass("has-text-danger");
        $("#modal-settings-error").removeClass("has-text-success");
        $("#modal-settings-error").text(json.error);
    }else{
        $("#modal-settings-error").addClass("has-text-success");
        $("#modal-settings-error").removeClass("has-text-danger");
        $("#modal-settings-error").text("Save successful");
    }
    closeModal("#modal-subform");
    addCallLogRow(callLog)
}


function buildColumns(identifier = "") {

    function createRow(row, colId) {

        // Label WITHOUT individual edit buttons
        let labelDiv = $(`
            <div class="column is-one-third has-text-weight-bold has-background-${backgroundColor}-ter mb-1 py-1"
                 style="border-radius: 5px;">
                ${row.name}
            </div>
        `);

        // Container
        let containerId = row.id + identifier;
        let containerDiv = $(`<div id="${containerId}" class="column is-two-thirds mb-1 py-1"></div>`);

        $(`#${colId}${identifier}`).append(labelDiv, containerDiv);
    }

    for (let row of firstColumn) createRow(row, "first-column");
    for (let row of secondColumn) createRow(row, "second-column");
}

function buildCustomer(json){
    if(json.data){
        let data = json.data;
        let fields = ["name", "email", "company"];
        for(let f of fields){
            if(data[f]){
                $(`#api-${f}`).show();
                $(`#api-${f}-text`).text(data[f]);
            } else {
                $(`#api-${f}`).hide();
                $(`#api-${f}-text`).text("?");
            }
        }
    }

    if(json.url){
        $('#api-link-text').attr('href', json.url);
        $('#api-link').show();
    } else {
        $('#api-link').hide();
    }

    if(json.error){
        customLog(`buildCustomer ERROR: ${json.error}`);
    } else {
        $('#api-info-div').show();
    }
}

function buildCompany(callerId, callerName, data){
    customLog('buildCompany data:');
    customLog(data);
    for(let key of Object.keys(data)){
        //customLog(key);
        let useKey = key;
        if(key.indexOf("_") >= 0){
            useKey = key.replaceAll("_","-");
        }
        if(key === "email"){
            let style = "";
            if(color){
                style = `style="color:${color}"`;
            }
            $(`#${key}`).html(`<a href="mailto:${data[key]}" ${style}>${data[key]}</a>`);
        } else if(key === "center_number"){
            $(`#${useKey}`).html(data[key]).append(
                buildButton("Blind Xfer", data[key], callerId, callerName)
            );
        } else if(key === "voicemail"){
            $(`#${useKey}`).html(data[key]).append(
                buildButton("Voicemail", data[key], callerId, callerName)
            );
        } else if(["actions"].indexOf(key) < 0){
            try{
                $(`#${useKey}`).html(data[key]);
            } catch(e){
                customLog('buildCompany key error:');
                customLog(e);
            }
        }
    }
    if(color){
        $('#main-content').find('a').css({"color": color});
    }
}

function buildContacts(callerId, callerName, actionData){
    try{
        $('#contacts').empty();
        for(let data of actionData){
            customLog('buildContacts data:', data);
            let row = $('<tr>')
            row.append(
                $('<th class="custom-cell" style="vertical-align: middle;">').append(
                    $('<span class="panel-icon">').append(
                        $('<i class="fas fa-hashtag" aria-hidden="true">')
                    )
                ),
                $('<td class="custom-cell">').text(data.name),
                $('<td class="custom-cell">'),
                $('<td class="custom-cell">').text(data.number),
                $('<td class="custom-cell">').append(
                    buildButton("Warm Xfer", data.number, callerId, callerName, false, true)
                ),
                $('<td class="custom-cell">').append(
                    buildButton("Blind Xfer", data.number, callerId, callerName)
                )
            );
            let voiceMailButton = $('<td class="custom-cell">')
            if(data.voicemail){
                voiceMailButton.append(
                    buildButton("Voicemail", data.number, callerId, callerName, true)
                );
            }
            row.append(voiceMailButton);
            $('#contacts').append(row)
        }
    } catch(e){
        customLog("buildContacts Error:");
        customLog(e);
    }
}

function buildCallLogs(callLogs){
    try{
        $('#call-logs').empty();
        for(let call_log of callLogs){
                // Extract values safely
                const timestamp = call_log?.timestamp || "";
                const agent = call_log?.agent || "";
                const callType = call_log?.call_type || "";
                const companyContacts = (call_log?.company_contacts || []).join(", ");
                const reasonForCall = call_log?.reason_for_call || "";
                const callerName = call_log?.caller_name || "";
                const callerCompany = call_log?.caller_company || "";
                const callbackNumber = call_log?.callback_number || "";
                const callerEmail = call_log?.caller_email || "";

                // Build row using plain TD + span
                const row = $(`
                    <tr class="call-log-row">

                        <td class="custom-cell"><span class="cl-timestamp">${timestamp}</span></td>
                        <td class="custom-cell"><span class="cl-agent">${agent}</span></td>
                        <td class="custom-cell"><span class="cl-call-type">${callType}</span></td>
                        <td class="custom-cell"><span class="cl-company-contact">${companyContacts}</span></td>
                        <td class="custom-cell"><span class="cl-reason">${reasonForCall}</span></td>
                        <td class="custom-cell"><span class="cl-caller-name">${callerName}</span></td>
                        <td class="custom-cell"><span class="cl-caller-company">${callerCompany}</span></td>
                        <td class="custom-cell"><span class="cl-callback-number">${callbackNumber}</span></td>
                        <td class="custom-cell"><span class="cl-caller-email">${callerEmail}</span></td>
                        <td class="custom-cell">
                            <button class="button is-small action-view"><i class="fas fa-eye"></i></button>
                        </td>
                    </tr>
                `);
                // Store full call log object for view/edit later
                row.data("call-log-data", call_log);
                //Call log view-button function
                row.find(".action-view").on("click", function () {
                const data = row.data("call-log-data");
                viewCallLog(data);
                });
                $("#call-logs").prepend(row);
        }
      
    }
    catch(e){
        customLog("buildCallLogs Error:");
        customLog(e);
    }
}

function buildButton(text, key, callerId, callerName, voicemail, warm){
    let button;
    if(warm){
        button = $('<button class="button is-warm ml-3" disabled="disabled">').text(text);
    } else {
        button = $('<button class="button is-blind ml-3">').text(text);
    }
    if(textColor){
        button.css({"color":`#${textColor}`});
    }
    if(color){
        button.css({"background-color":`#${color}`});
    } else {
        button.addClass('is-info');
    }
    if(warm){
        button.on('click', async function(){
            await warmXferButton(key);
        });
    } else {
        button.on('click', async function(){
            await blindXferButton(key,callerId,callerName,voicemail);
        });
    }
    return button;
}


async function blindXferButton(number, callerId, callerName, voicemail){
    try{
        customLog("blindXferButton button pressed");
        let destination = updateDestination(number);
        matchedId = await getCall(callerId, callerName);
        customLog("blindXferButton matchedId", matchedId);
        let payload = {
                        callId: matchedId,
                        destination: destination,
                    }
        if(voicemail){
            payload.toVoicemail = true;
        }
        if(matchedId){
            let divertResponse = await divert(payload);
            if(divertResponse.status >= 200 && divertResponse.status < 300){
                //this.updateResultSpan(`Transferred ${remoteNumber} to ${meetingName}.`, "green");
            } else {
                await handleXferError(divertResponse);
            }
        }
    }catch(e){
        customLog("blindXferButton Error:");
        customLog(e);
        $('#modal-error-text').text(e);
        openModal('#modal-error');
    }
}

async function warmXferButton(number){
    try{
        customLog("warmXferButton button pressed");
        let dialResponse = await dial(updateDestination(number));
        if(dialResponse.status >= 200 && dialResponse.status < 300){
            //this.updateResultSpan(`Transferred ${remoteNumber} to ${meetingName}.`, "green");
        } else {
            await handleXferError(dialResponse);
        }
    }catch(e){
        customLog("warmXferButton Error:");
        customLog(e);
        $('#modal-error-text').text(e);
        openModal('#modal-error');
    }
}

function formatErrorJson(errorText){
    return `<br><pre class="py-1 my-2">${JSON.stringify(errorText, null, 2)}</pre>`;
}

async function handleXferError(divertResponse){
    let msg = `Transfer failed. Status: ${divertResponse.status}`
    try{
        let errorText = await divertResponse.json();
        msg += formatErrorJson(errorText);
    }catch(e){}
    $('#modal-error-text').html(msg);
    openModal('#modal-error');
}


function applyTheme(theme){
    customLog("applyTheme theme:", theme)
    if(theme){
        Cookies.set('theme', theme, { expires: 365 });
        if(theme.indexOf("dark") >= 0){
            $('html').addClass("theme-dark");
            $('html').removeClass("theme-light");
            backgroundColor = "black";
            iconColor = 'white';
            $('.column.is-one-third').addClass('has-background-black-ter');
            $('.column.is-one-third').removeClass('has-background-white-ter');
            $('#script-column').addClass('has-background-black-ter');
            $('#script-column').removeClass('has-background-white-ter');
            $('.panel-block.row-item').addClass('has-background-black');
        } else {
            $('html').addClass("theme-light");
            $('html').removeClass("theme-dark");
            backgroundColor = "white";
            iconColor = 'black';
            $('.column.is-one-third').addClass('has-background-white-ter');
            $('.column.is-one-third').removeClass('has-background-black-ter');
            $('#script-column').addClass('has-background-white-ter');
            $('#script-column').removeClass('has-background-black-ter');
            $('.panel-block.row-item').removeClass('has-background-black');
        }
        let colors = theme.split("-");
        if(colors.length > 1 && themes[colors[1]]){
            color = themes[colors[1]].color;
            headerColor = themes[colors[1]].headerColor;
            titleColor = themes[colors[1]].titleColor;
            textColor = themes[colors[1]].textColor;
        }
        $('#main-content').find('button').css({'color':textColor,'background-color':color});
        $('#main-content').find('a').css({'color':color});
        $('#main-title').css({"color":titleColor});
        $('#header-box').css({"background-color":headerColor});
        $('#script-div').css({"color":color});
        if(headerColor){
            $('#header-box').removeClass('has-background-info');
        } else {
            $('#header-box').addClass('has-background-info');
        }
        if(color){
            $('#main-content').find('button').removeClass("is-info");
            $('#script-div').removeClass("is-info");
            $('#script-div').removeClass("is-light");
        } else {
            $('#main-content').find('button').addClass("is-info");
            $('#script-div').addClass("is-info");
            $('#script-div').addClass("is-light");
        }
        
        $('.icon.is-small').remove();
        $(`#${theme}`).append(
            $(`<span class="icon is-small ml-2" style="color:${iconColor};"> <i class="fas fa-check" aria-hidden="true"></i></span>`)
        )
    }
}

function initializeDOMListeners(){
    $('#theme-button').on('click', function(e){
        $('#theme-menu').toggle();
    });

    $('#settings-button').on('click', async function(e){
        if($('#settings-menu').is(":hidden")){
            $('#settings-button').addClass('is-loading');
            $('#settings-menu-content').empty();
            try{
                let response = await fetch('/admin',{
                    method: "GET",
                    headers:customHeaders
                });
                let companyData = await response.json();
                console.log(companyData);
                for(let entry of companyData){
                    //get all call logs for specific entry
                    let logsResponse=await fetch(`/call_logs?queue_id=${entry._id}`,{
                    method: "GET",
                    headers:customHeaders
                    });
                    console.log("this is the log response ")
                    console.log(logsResponse)
                    let callLogs = await logsResponse.json();
                    console.log(callLogs)
                    //append to each entry
                    entry.call_logs=callLogs
                    $('#settings-menu-content').append(
                        $(`<a id="${entry._id}" href="#" class="dropdown-item"><span>${entry.company}</span></a>`).on('click', async function(e){
                            openSettings(entry);
                        })
                    )
                }
            }catch(e){
                console.error(e);
            }
            $('#settings-menu-content').append(
                $(`<a id="add" href="#" class="dropdown-item"><span class="icon"><i class="fas fa-plus" aria-hidden="true"></i></span><span>Add New</span></a>`)
                    .on('click', async function(e){
                        openSettings();
                    })
            )
            $('#settings-button').removeClass('is-loading');
        }
        $('#settings-menu').toggle();
        //openModal('#modal-settings');
    })
    //--------------------section for adding company contacts----------------------------------------------
    // this button action-add is defined at the end of company contact in the modal in html
    $('#action-add').on('click', function(e){
        console.log('#action-add opens modal');
        // Re-enable everything
        $('#add-contact-modal input, #add-contact-modal select, #add-contact-modal textarea')
        .prop('disabled', false);
        // Show save button again
        $('#save-contact-button').show();            
        // Clear all input + textarea +select fields
        $('#add-contact-modal').find('input, textarea').val('');
        $('#add-contact-modal').find('select').each(function () {
            $(this).prop('selectedIndex', 0);
        });
        $('#save-contact-button').text("Add Contact").addClass("is-primary")
        openModal("#add-contact-modal")
    })
    $('#save-contact-button').on('click', function(e){
        const mode = $('#add-contact-modal').attr('data-mode');
        $('#save-contact-button').addClass('is-loading');
        console.log('#save-contact-button to save contacts');
        //collect values
        const action = {
            name: $('#contact-name').val().trim(),
            department: $('#contact-dept').val().trim(),
            answering_mode: $('#contact-answer-mode').val(),
            transfer_phone: $('#contact-transfer-phone').val(),
            instructions: $('#contact-instructions').val().trim(),
            email: $('#contact-email').val().trim(),
            office_phone: $('#contact-office').val().trim(),
            cell_phone: $('#contact-cell').val().trim(),
            home_phone: $('#contact-home').val().trim(),
            other_phone: $('#contact-other').val().trim()
        };
        if (mode === "edit") {
            updateContactRow(window.currentEditRow, action);
        } else {
            addActionRow(action);
        }
        $('#save-contact-button').removeClass('is-loading');
        //close the modal
        closeModal('#add-contact-modal')
    })
    //searchs in contacts
    $('#contact-search').on('input', function () {
    searchContacts();
    });

    //closes the modal
    $('#close-contact-modal').on('click', function(e){
        closeModal('#add-contact-modal')
    });
    //---------------------------------------------------------------------------------------------------

    $('#modal-settings-save').on('click', async function(e){
        console.log('#modal-settings-save save entry');
        $('#modal-settings-save').addClass('is-loading');
        await saveSettings();
    })
    // this button modal-settings-save is defined in the footer of the modal in the html

    $('#modal-settings-delete').on('click', function(e){
        console.log('#modal-settings-delete delete entry');
        $('#modal-delete-confirm-text').text(`Are you sure you want to delete company profile: "${currentEntry.company}"?`);
        openModal("#modal-delete-confirm");
    })
    // modal-settings-delete is a button in the footer of the modal in html

    $('#modal-delete-confirm-delete').on('click', async function(e){
        $("#modal-delete-confirm-error").empty();
        $('#modal-delete-confirm-delete').addClass('is-loading');
        let response = await fetch('/admin',{
            method: "POST",
            headers:customHeaders,
            body: JSON.stringify({"command":"delete", "_id":currentEntry._id})
        });
        let json = await response.json();
        $('#modal-delete-confirm-delete').removeClass('is-loading');
        customLog("#modal-delete-confirm-delete POST /admin response:", json);
        if(json.error){
            $("#modal-delete-confirm-error").text(json.error);
        } else {
            closeAllModals();
        }
    })
    //this is a seperate modal skeleton in the html 

    $('.dropdown-item').on('click', function(e){
        applyTheme(e.currentTarget.id);
        $('#theme-menu').hide();
    });

    $('#api-link').on('click', function(e){
        window.open($('#api-link-text').attr('href'));
    });

    $('#caller-info-button').on('click', function(e){
        if($('#call-behavior-message').is(":visible")){
            $('#call-behavior-message').hide();
        } else {
            $('#call-behavior-message').show();
        }
    });

    $('#delete-api-info').on('click', function(e){
        $('#api-info-div').hide();
    });

    $('#delete-caller-info').on('click', function(e){
        $('#caller-message').empty();
        $('#caller-info').hide();
    });

    $('.close').on('click', function(e){
        //console.log(e.currentTarget.id);
        let parts = e.currentTarget.id.split("-close");
        closeModal(`#${parts[0]}`);
    });

//-----------------------------------call log table----------------------------------------------------------------------------------------------------------------------------------------------------
    
    //agent call log
    $('#open-call-log-modal').on('click', function(e){
    console.log('#open-call-log-modal was clicked');
    openCallLogModal(window.currentAgentEntry);   
    })
    //admin call log
    $('#open-subform').on('click', function(e){
    console.log('#open-subform was clicked');
    //there might have to be a different function like openCallLogModal (similar to openSettings) that fills data first (data that may be needed for dropdowns) then call openModal()
    openCallLogModal(currentEntry);
    // when this modal opens there will be a save button in that modal , this button should call a function called saveCallLogs() which will post to backend
    })

    //close admin call log modal
    $('#modal-subform-close').on('click', function(e){
        closeModal('#modal-subform')
    });
    $('#modal-subform-close-lower').on('click', function(e){
        closeModal('#modal-subform')
    });
    
    // saving call logs for admin
    $('#modal-subform-save').on('click', async function(e){
    console.log('#modal-subform-save save call log');
    $('#modal-subform-save').addClass('is-loading');
    await saveCallLog();
    })

    //close call log view modal
    $('.close-calllog-view').on('click', function () {
    closeModal('#modal-calllog-view');
    });
//-----------------------------------------------call log table ------------------------------------------------------------------------------------------------------------
    // //edit button function for Company Profile
    
    // ----- Open Edit Profile Modal -----
    $(document).on("click", "#edit-profile-button", function () {

        if (!currentEntry || typeof currentEntry !== "object") {
            currentEntry = {}; // prevents crash for "Add New"
        }

        loadProfileEditModal(currentEntry);
        openModal("#modal-profile-edit");
    });

    // ----- Close Edit Modal -----
    $(document).on("click", ".close-edit-profile", function () {
        closeModal("#modal-profile-edit");
    });

    // ----- Save changes locally for Company Profile -----
    $(document).on("click", "#save-profile-edit", function () {

        $(".edit-field").each(function () {
            let key = $(this).data("key").replaceAll("-", "_");
            let newValue = $(this).val();
            currentEntry[key] = newValue; // local update
        });

        // Refresh preview (this updates the hidden admin-inputs too)
        fillSettings(currentEntry, false);

        closeModal("#modal-profile-edit");
        $("#edit-profile-button").show();

        console.log("Profile updated locally:", currentEntry);
    });
}


function adjustUI(){
    $('body').css({'background-image':`url(${background})`});

    if(logoSize){
        $('#logo').css({'max-height': `${logoSize}px`, 'max-width': `${logoSize}px;`});
    } else {
        $('#logo').css({'max-height': '42px', 'max-width': '42px;'});
    }
    if(logo){
        $('#logo').attr('src', logo);
    } else {
        $('#logo').attr('src', "wxsd-icon.png");
    }
    if(title){
        $('#main-title').text(title);
    }
    if(titleColor){
        $('#main-title').css({"color":`#${titleColor}`});
    }
    if(headerColor){
        $('#header-box').css({"background-color":headerColor});
    } else {
        $('#header-box').addClass('has-background-info');
    }

    if(color){
        $('#script-div').css({"color":color});
    } else {
        $('#script-div').addClass("is-info");
        $('#script-div').addClass("is-light");
    }
}

// Load Company Profile edit Button
//Create Company Profile editable form builder
function loadProfileEditModal(data) {

    const htmlFields = ["instructions", "script", "website", "info"];
    let html = "";

    for (let item of allInputs) {

        let key = item.id.replaceAll("-", "_");
        let value = data ? data[key] : "";

        html += `
            <div class="field mb-4">
                <label class="label">${item.name}</label>
        `;

        if (htmlFields.includes(item.id)) {
            html += `
                <textarea class="textarea edit-field" 
                    data-key="${item.id}" 
                    rows="5">${value || ""}</textarea>
            `;
        } else {
            html += `
                <input class="input edit-field"
                    data-key="${item.id}" 
                    value="${value || ""}">
            `;
        }

        html += `</div>`;
    }

    $("#profile-edit-container").html(html);
}

