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

function addCallLogRow(call_log){
    let timestampInput = $(`<input name="call-log-field8" class="input" type="text" placeholder="Timestamp" readonly>`);
    let agentInput = $(`<input name="call-log-field9" class="input" type="text" placeholder="Agent" readonly>`);
    let callTypeInput = $(`<input name="call-log-field1" class="input" type="text" placeholder="Call Type" readonly>`);
    let companyContactInput = $(`<input name="call-log-field3" class="input" type="text" placeholder="Company Contact" readonly>`);
    let reasonForCallInput = $(`<input name="call-log-field5" class="input" type="text" placeholder="Reason For Call" readonly>`);
    let callerNameInput = $(`<input name="call-log-field4" class="input" type="text" placeholder="Caller Name" readonly>`);
    let callerCompanyInput = $(`<input name="call-log-field6" class="input" type="text" placeholder="Caller Company" readonly>`);
    let callbackNumberInput = $(`<input name="call-log-field2" class="input" type="text" placeholder="Callback Number" readonly>`);
    let callerEmailInput = $(`<input name="call-log-field7" class="input" type="text" placeholder="Caller Email" readonly>`);

    if(call_log){
        if(call_log.timestamp){
            timestampInput.val(call_log.timestamp);
        }
        if(call_log.agent){
            agentInput.val(call_log.agent);
        }
        if(call_log.call_type){
            callTypeInput.val(call_log.call_type);
        }
        if (call_log.company_contacts && Array.isArray(call_log.company_contacts)) {
            companyContactInput.val(call_log.company_contacts.join(", "));
        }
        if(call_log.reason_for_call){
            reasonForCallInput.val(call_log.reason_for_call);
        }
        if(call_log.caller_name){
            callerNameInput.val(call_log.caller_name);
        }
        if(call_log.caller_company){
            callerCompanyInput.val(call_log.caller_company);
        }
        if(call_log.callback_number){
            callbackNumberInput.val(call_log.callback_number);
        }
        if(call_log.caller_email){
            callerEmailInput.val(call_log.caller_email);
        }
    }
    let row = $('<tr class="call-log-row">');
    row.append(
        $('<td class="is-hoverable-cell is-striped-cell is-cell-input">').append(timestampInput),
        $('<td class="is-hoverable-cell is-striped-cell is-cell-input">').append(agentInput),
        $('<td class="is-hoverable-cell is-striped-cell is-cell-input">').append(callTypeInput),
        $('<td class="is-hoverable-cell is-striped-cell is-cell-input">').append(companyContactInput),
        $('<td class="is-hoverable-cell is-striped-cell is-cell-input">').append(reasonForCallInput),
        $('<td class="is-hoverable-cell is-striped-cell is-cell-input">').append(callerNameInput),
        $('<td class="is-hoverable-cell is-striped-cell is-cell-input">').append(callerCompanyInput),
        $('<td class="is-hoverable-cell is-striped-cell is-cell-input">').append(callbackNumberInput),
        $('<td class="is-hoverable-cell is-striped-cell is-cell-input">').append(callerEmailInput),
    );
    $('#call-log-settings').prepend(row)
    // #call-log-settings is the table body that exists in the html, the rows and row data is done dynamivally

}


// function addActionRow(action){
//     let nameInput = $(`<input name="action-name" class="input" type="text" placeholder="Contact Name">`);
//     let numberInput = $(`<input name="action-number" class="input" type="text" placeholder="Contact Phone Number">`);
//     let voiceMailChecked = "";
//     if(action){
//         if(action.name){
//             nameInput.val(action.name);
//         }
//         if(action.number){
//             numberInput.val(action.number);
//         }
//         if(action.voicemail){
//             voiceMailChecked = "checked";
//         }
//     }
//     let row = $('<tr class="action-row">');
//     row.append(
//         $('<td class="custom-cell">').append($(`<button name="action-delete" class="button">`).append(
//             $(`<span class="icon"><i class="fas fa-trash" aria-hidden="true"></i></span>`)
//         ).on('click', function(e){
//             $(e.currentTarget.parentNode.parentNode).remove();
//         })),
//         $('<td class="custom-cell">').append(nameInput),
//         $('<td class="custom-cell">').append(numberInput),
//         $('<td class="custom-cell pt-4">').append($(`<label class="checkbox"><input name="action-voicemail" type="checkbox" ${voiceMailChecked}/> Voicemail Enabled</label>`))
//     );
//     $('#contacts-settings').append(row)
//     // #contacts-settings is the table body that exists in the html, the rows and row data is done dynamivally
// }
function updateContactRow(row, action) {

    let transferNumber = "";
    switch (action.transfer_phone) {
        case "Office Phone": transferNumber = action.office_phone; break;
        case "Cell Phone": transferNumber = action.cell_phone; break;
        case "Home Phone": transferNumber = action.home_phone; break;
        case "Other Phone": transferNumber = action.other_phone; break;
    }
    //clean transfer phone despense with select... if exists
    const transferPhone = $('#contact-transfer-phone').val();
    action.transfer_phone = transferPhone === "Select..." ? "" : transferPhone;

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


function editContact(data) {
    // store row reference globally so we can update it later
    window.currentEditRow = row;
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
        .addClass("is-success");

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
        editContact(row.data('action-data'));
    });


    $('#contacts-settings').append(row);
}


function fillSettings(data, editable = false) {

    const htmlFields = ["instructions", "script", "website", "info"];

    for (let item of allInputs) {

        let id = `${item.id}-settings`;
        let container = $(`#${id}`);
        container.empty();

        let dbKey = item.id.replaceAll("-", "_");
        let value = data ? data[dbKey] : "";

        // --------------------------
        // EDIT MODE
        // --------------------------
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

        // --------------------------
        // PREVIEW MODE
        // --------------------------
        if (htmlFields.includes(item.id)) {
            container.html(value || "");
        } else {
            container.html(`<div>${value || ""}</div>`);
        }
    }

    // Contacts & call logs
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
    // for(let action of actions){
    //     let names = $(action).find('[name="action-name"]:first');
    //     let numbers = $(action).find('[name="action-number"]:first');
    //     let voicemails = $(action).find('[name="action-voicemail"]:first');
    //     if(names.length === 1 && numbers.length === 1){
    //         let action = {"name": $(names[0]).val(), "number": $(numbers[0]).val()};
    //         if(voicemails.length === 1 && $(voicemails[0]).is(':checked')){
    //             action.voicemail = true;
    //         }
    //         newEntry.actions.push(action);
    //     }
    // }
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
            queue_id: currentEntry._id,   // IMPORTANT: link to queue
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

    const htmlFields = ["instructions", "script", "website", "info"];

    const isSettingsMode = identifier === "-settings";

    function createRow(row, colId) {

        // Label
        let labelDiv = $(`
            <div class="column is-one-third has-text-weight-bold has-background-${backgroundColor}-ter mb-1 py-1"
                 style="border-radius: 5px;">
        `);

        if (isSettingsMode && htmlFields.includes(row.id)) {
            labelDiv.html(`
                ${row.name}
                <button class="button is-small is-info edit-field-btn ml-2"
                        data-field="${row.id}">
                    Edit
                </button>
            `);
        } else {
            labelDiv.html(row.name);
        }

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
            let row = $('<tr>')
            row.append(
                $('<td class="custom-cell">').text(call_log.call_type),
                $('<td class="custom-cell">').text(call_log.callback_number),
                $('<td class="custom-cell">').text(call_log.company_contact),
                $('<td class="custom-cell">').text(call_log.caller_name),
                $('<td class="custom-cell">').text(call_log.reason_for_call),
                $('<td class="custom-cell">').text(call_log.caller_company),
                $('<td class="custom-cell">').text(call_log.caller_email),
                $('<td class="custom-cell">').text(call_log.timestamp),
            );
            $('#call-logs').append(row)
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
            updateContactRow(window.currentEditRow, contact);
        } else {
            addActionRow(contact);
        }
        $('#save-contact-button').removeClass('is-loading');
        //close the modal
        closeModal('#add-contact-modal')
    })

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

    $('#open-call-log-modal').on('click', function(e){
    console.log('#open-call-log-modal was clicked');
    openModal("#modal-subform");
    //there might have to be a different function like openCallLogModal (similar to openSettings) that fills data first (data that may be needed for dropdowns) then call openModal()
    // when this modal opens there will be a save button in that modal , this button should call a function called saveCallLogs() which will post to backend
    })
    // $('#modal-subform-save').on('click', async function(e){
    // console.log('#modal-subform-save save call log');
    // $('#modal-subform-save').addClass('is-loading');
    // await saveCallLog();
    // })

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

    //edit button function for Company Profile
    // $(document).on("click", "#edit-profile-button", function () {

    // console.log("Edit Profile clicked");

    // // Switch modal to EDIT MODE
    // fillSettings(currentEntry, true);

    // // Hide Edit button so user cannot click again
    // $("#edit-profile-button").hide();

    // // Ensure Save button appears
    // $("#modal-settings-save").show();
    // });
    $(document).on("click", "#edit-profile-button", function () {
    loadProfileEditModal(currentEntry);
    openModal("#modal-profile-edit");
    });
    
    //close button for company profile
    $(document).on("click", ".close-edit-profile", function(){
    closeModal("#modal-profile-edit");
    });

    //Modify the save button inside Company Profile modal
    $(document).on("click", "#save-profile-edit", function(){

    $(".edit-field").each(function(){
        let key = $(this).data("key").replaceAll("-", "_");
        let newValue = $(this).val();

        // Update the currentEntry object
        currentEntry[key] = newValue;
    });

    // Refresh preview mode on main page
    fillSettings(currentEntry, false);

    // Close edit modal
    closeModal("#modal-profile-edit");

    // Make sure edit button stays visible
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
function loadProfileEditModal(data){

    const htmlFields = ["instructions", "script", "website", "info"];
    let html = "";

    for (let item of allInputs) {

        let key = item.id.replaceAll("-", "_");
        let value = data ? data[key] : "";

        if (htmlFields.includes(item.id)) {
            html += `
                <div class="field mb-4">
                    <label class="label">${item.name}</label>
                    <textarea class="textarea edit-field" data-key="${item.id}" rows="5">${value || ""}</textarea>
                </div>
            `;
        } else {
            html += `
                <div class="field mb-4">
                    <label class="label">${item.name}</label>
                    <input class="input edit-field" data-key="${item.id}" value="${value || ""}">
                </div>
            `;
        }
    }

    $("#profile-edit-container").html(html);
}
