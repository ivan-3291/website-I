let rmidCounter = 0
function createRoom(type, number, section = ''){
    return{
        ID: rmidCounter++,
        type: type,
        number: number,
        section: section, //used to group multiple rooms together eg in levels, REDUNDANT/UNUSED
        booking_status: 'unavailable',
        room_serviced_status: 'none', //REDUNDANT/UNUSED
        tasks: [],
        setBkStatus: function(state){
            this.booking_status = state;
        },
        setRSVStatus: function(state){}
    }
}

roomTypes = {
    single: {
        toiletry_set: -1, soap: -1, bodywash_bottle: -1, hairwash_bottle: -1, Towels: -1, slippers: -1,
        pillowcase: -1, bedsheet_single: -1, duvet_single: -1
    },
    double: {
        toiletry_set: -2, soap: -2, bodywash_bottle: -2, hairwash_bottle: -2, Towels: -2, slippers: -2,
        pillowcase: -2, bedsheet_single: -2, duvet_single: -2
    },
    queen: {
        toiletry_set: -2, soap: -2, bodywash_bottle: -2, hairwash_bottle: -2, Towels: -2, slippers: -2,
        pillowcase: -2, bedsheet_queen: -1, duvet_queen: -1
    },
    family: {
        toiletry_set: -3, soap: -3, bodywash_bottle: -3, hairwash_bottle: -3, Towels: -3, slippers: -3,
        pillowcase: -3, bedsheet_single: -1, duvet_single: -1, bedsheet_queen: -1, duvet_queen: -1
    }
}
roomTypesDesc = {
    single: '1 max', double: '2 max', queen: '2 max', family: '3 max'
}
let currentDisplayedRoomType = '';
function loadRoomTypeData(type){ //Loads data into table to be modified or changed
    document.getElementById('RoomTypeDescription').textContent = roomTypesDesc[type];
    let roomTypeDataTableElm = document.getElementById('RoomTypeDataTable');
    roomTypeDataTableElm.innerHTML = `<tr class="listRw"><th class="listClm">index</th><th class="listClm">item</th><th class="listClm">amount used/consumed</th></tr>`;
    Object.keys(roomTypes[type]).forEach((key, index)=>{
        roomTypeDataTableElm.innerHTML += `<tr class="listRw">
        <td class="listClm">${index}</td>
        <td class="listClm">${key}</td>
        <td class="listClm">${roomTypes[type][key]}</td>`;
    });
    currentDisplayedRoomType = type;
}
function updtRmDttexthandler(e, isBlur=false) { //Checks inputted data to update room type data
    if (e.key=='Enter' || isBlur){e.target.rezValue = verifyInvModData(e.target.value, 2); e.target.value = dctToStr(e.target.rezValue); orderList = e.target.rezValue;}
}
function applyRmdtChanges(){
    let updates = document.getElementById('RoomDataUpdateList').rezValue;
    Object.keys(updates).forEach((key)=>{
        if (updates[key] == 0) {delete roomTypes[currentDisplayedRoomType][key];}
        else {roomTypes[currentDisplayedRoomType][key] = updates[key];}
    });
    loadRoomTypeData(currentDisplayedRoomType);
}

//==================employee management n access stuff=================
let emplidCounter = 0;
function addNewEmployee(name, age, Pn, Email){
    emplidCounter++;
    Employees.push({
        ID: emplidCounter,
        Name: name,
        Tasklist: []
    });
    EmployeesPersonalDataTableElm.querySelector('tbody').innerHTML += `
    <tr><td class="listClm">${emplidCounter}</td><td class="listClm">${name}</td><td class="listClm">${age}</td><td class="listClm">${Pn}</td><td class="listClm">${Email}</td></tr>
    `;
    loadTables();
}
let currentRRindex = 0
function rrEmpSlc(){ //round robins all employees when eg assigning tasks
    currentRRindex++;
    if (currentRRindex == Employees.length) {currentRRindex = 0}
    return Employees[currentRRindex];
}

//================inventory management n access stuff====================
/*
inv item: itemname, amount_avl
Tags determine how a item works in the system
permanent: amount_inuse
consumeable:
Laundryable: laundrying
*/
function addInventoryItem(itemName, amount, tags){
    Inventory[itemName] = {
        amount_avl: amount
    }
}
//place into inventory item object
function modifyInventory(itemName, change){
    if (Object.keys(Inventory).includes(itemName)){
        Inventory[itemName].amount_avl += change;
    }
}


//==============
// all data lists used globally
let Rooms = []
let SectionRoomRef = [] //holds references to room objects in separate groups REDUNDANT/UNUSED
let Employees = []
let Inventory = {}

// Initialise example data here except for employees
function initData() {
    initRooms = [['101', 'single'],['102', 'single'],['103', 'double'],['104', 'double'],['105', 'double'],['106', 'queen'],['107', 'queen'],['108', 'queen'],['109', 'queen'],['110', 'queen'],['111', 'family'],['112', 'family'],
        ['201', 'single'],['202', 'single'],['203', 'double'],['204', 'double'],['205', 'double'],['206', 'queen'],['207', 'queen'],['208', 'queen'],['209', 'queen'],['210', 'queen'],['211', 'family'],['212', 'family'],
        ['301', 'single'],['302', 'single'],['303', 'double'],['304', 'double'],['305', 'double'],['306', 'queen'],['307', 'queen'],['308', 'queen'],['309', 'queen'],['310', 'queen'],['311', 'family'],['312', 'family'],
    ];
    initEmployees = [
        'Zenir', 'Zendalf', 'Zinner', 'Cherd', 'Mike'
    ];
    initInventory = [
        //consumed
        ['toiletry_set', 100], //{amount: 0}
        ['soap', 100],
        ['bodywash_bottle', 100],
        ['hairwash_bottle', 100],
        ['Towels', 80],
        ['slippers', 100],

        //permanent
        ['pillowcase', 100],
        ['bedsheet_single', 50],
        ['bedsheet_queen', 60],
        ['duvet_single', 50],
        ['duvet_queen', 60],

        //Reuseable unless damaged
        ['pillowbase', 100],
        ['matress_single', 50],
        ['matress_queen', 60],
        ['hairdryer', 100],
        ['telly_remote', 100],
        ['aircon_remote', 100],
    ];

    initRooms.forEach(element => {Rooms.push(createRoom(element[1], element[0]))});
    //example Employee data is loaded at initializepage
    initInventory.forEach(element => {addInventoryItem(element[0], element[1])});
}
initData();

//=====================task creation=====================
let MTasklist = []
function createTask(type, priority, room, employee, details = '-'){
    return{
        type: type,
        priority: priority,
        room: room,
        employee: employee,
        details: details,
        taskDone: function(curT){
            room.tasks = ascplice(room.tasks, room.tasks.indexOf(curT),1)//removes items from different lists
            MTasklist = ascplice(MTasklist, MTasklist.indexOf(curT),1)
            employee.Tasklist = ascplice(employee.Tasklist, employee.Tasklist.indexOf(curT),1)
            
            //push notification
            addtoNotifList('done', curT, [this.room.booking_status, this.actionOnDone.bookingStateTo], this.actionOnDone.inventoryChange, [this.actionOnDone.bookingStateTo, this.actionOnDone.inventoryChange])
            
            this.room.booking_status = this.actionOnDone.bookingStateTo;//excecute changes to datalists
            Object.keys(this.actionOnDone.inventoryChange).forEach((key)=>{
                modifyInventory(key, this.actionOnDone.inventoryChange[key]);
            });
            this.isDone = true;
            loadTables();
        },
        actionOnDone: { //change inventory, switch booking/housekeep states
            bookingStateTo: '',
            inventoryChange: {}
        },
        isDone: false
    }
}
/*Housekeep-checkout, Housekeep-request, Maintainence-request, Guest-request, Other*/


//==============custom tasks===================
let idCstTskCtr = 0;
let defTaskActions = {}
function addCustomTask(){
    idCstTskCtr++;
    defTaskActions[`custom task ${idCstTskCtr}`] = {bookingStateTo: 'unavailable', inventoryChange: {}}; //add new task into dictionary
    let tableBodyElm = CustomTaskDataTableElm.querySelector('tbody');
    //reload table
    tableBodyElm.innerHTML = `<tr class="listRw"><th class="listClm">Task Name</th><th class="listClm">Task Details (on task done)</th><th class="listClm">Remove</th></tr>`;
    Object.keys(defTaskActions).forEach((key)=>{
        let row = document.createElement('tr');
        row.className = "listRw";
        row.innerHTML = `
        <td class="listClm"><input type="text" value="${key}" prevval="${key}"></td>
        <td class="listClm" style="line-height: 2;">
        Booking state to: <select value="${defTaskActions[key].bookingStateTo}"><option>unavailable</option><option>available</option><option>booked</option><option>checked in</option><option>checked out</option></select><br/>
        Inventory change: <textarea rezValue placeholder="itemName: amount change\nitemName2: amount change\n..." style="vertical-align: text-top; width: 200px"></textarea>
        </td>
        <td class="listClm">
        <div style="background-color: red; border-radius: 5px; width: 20px; height: 20px"></div>
        </td>
        `;
        row.children[0].children[0].prevval = `${key}`;
        row.children[0].children[0].addEventListener('blur', (e)=>{
            if (e.target.value != e.target.prevval && !Object.keys(defTaskActions).includes(e.target.value)){
                defTaskActions[e.target.value] = defTaskActions[e.target.prevval]; delete defTaskActions[e.target.prevval]; e.target.prevval = e.target.value;}});
        row.children[1].children[0].addEventListener('input', (e)=>{defTaskActions[row.children[0].children[0].value].bookingStateTo = e.target.value;})
        row.children[1].children[2].addEventListener('keydown', (e)=>{if (e.key=='Enter'){
            e.target.rezValue = verifyInvModData(e.target.value); e.target.value = dctToStr(e.target.rezValue);
            defTaskActions[row.children[0].children[0].value].inventoryChange = e.target.rezValue;}});
        row.children[1].children[2].addEventListener('blur', (e)=>{
            e.target.rezValue = verifyInvModData(e.target.value); e.target.value = dctToStr(e.target.rezValue);
            defTaskActions[row.children[0].children[0].value].inventoryChange = e.target.rezValue;});
        row.children[2].children[0].addEventListener('click', ()=>{delete defTaskActions[row.children[0].children[0].value]; row.remove();});
        tableBodyElm.appendChild(row);
    });
}
//two useful helper like functions for processing inventory change data
function verifyInvModData(data, onlyposOrng = 0){//onlyposOrng = 0=+/-, 1=+, 2=- 
    let interim = data.split('\n');
    let signCheck = (number)=>{switch (onlyposOrng){case 0: return true; break; case 1: return number > 0; break; case 2: return number <= 0; break;}} //-ve zero included for room dta updating
    let findata = {}
    interim.forEach(item=>{
        let item2 = item.split(':');
        if (item2.length == 2 && item2[0] != '' && item2[1] != ''){
            item2[0].trim(); item2[1].trim();
            if (Object.keys(Inventory).includes(item2[0]) && !Object.keys(findata).includes(item2[0]) && !isNaN(Math.floor(+item2[1])) && signCheck(+item2[1])){
                findata[item2[0]] = Math.floor(+item2[1]);
            }
        }
    })
    return findata;
}
function dctToStr(dataObj){return Object.keys(dataObj).map((key)=>{return `${key}: ${dataObj[key]}`;}).join('\n');} //converts inv change data to display string

//==============inv ressuply page========================
let idRsplyOrdCtr = 0;
orderList = {};
function orderlisttexthandler(e, isBlur=false) {
    if (e.key=='Enter' || isBlur){e.target.rezValue = verifyInvModData(e.target.value, 1); e.target.value = dctToStr(e.target.rezValue); orderList = e.target.rezValue;}
}
function addInvRsplyOrder(){
    if (Object.keys(document.getElementById('orderList').rezValue).length == 0) {return; }
    idRsplyOrdCtr++;
    let row = document.createElement('tr');
    row.innerHTML = `
    <td class="listClm">${idRsplyOrdCtr}</td>
    <td class="listClm">${(new Date()).toLocaleDateString()}</td>
    <td class="listClm">${document.getElementById('orderList').value.replaceAll('\n', '</br>')}</td>
    <td class="listClm"><select oninput="if(this.value == 'complete'){this.nextSibling.style.display = 'inline'}"><option>pending</option><option>complete</option></select><span style="display: none; cursor: pointer;"> [-]</span></td>
    `;
    row.children[2].rezValue = document.getElementById('orderList').rezValue;
    row.children[3].children[1].addEventListener('click', (e)=>{e.target.textContent=' [/]'; ressuplyInv(row.children[2].rezValue);})
    OrderLogsTableElm.querySelector('tbody').appendChild(row);
}
function ressuplyInv(changes){
    Object.keys(changes).forEach((key)=>{
        modifyInventory(key, changes[key]);
    });
    loadTables();
}

//===========test and validate control input, Create tasks at control pane=================
let message = '';  // (!)Invalid, /!\Warning
let checkedDta = ''
function processControlsData(){//process and validates control input
    message = '';
    checkedDta = 'False';
    roomNum = Rooms.findIndex((rm)=>rm.number==RoomNumberInpElm.value);
    if (roomNum != -1){
        //checks if action makes sense, otherwise do a warning
        if (['Housekeep-checkout','Housekeep-request','Guest-request'].includes(taskTypeSlcElm.value)) {
            if (['unavailable','available','booked','checked in'].includes(Rooms[roomNum].booking_status)){
                message += "/!\\ booking status not checked out!<br/>";
            }
        }
        message += 'valid input';
        checkedDta = 'True';
    }
    else {message += "(!) Invalid Room Number";}
    ControlsMessagesElm.innerHTML = message;
}
function buttonStages(){ //handler for task submit button and task creation
    if (taskSubmitBtnElm.textContent == 'validate' && checkedDta == 'True'){
        taskSubmitBtnElm.textContent = 'submit';
        if (taskTypeSlcElm.value == 'Housekeep-checkout'){
            ControlsMessagesElm.innerHTML += '<br/>Action: - Switches booking status to unavailable'
        }
        else if (taskTypeSlcElm.value == 'Housekeep-request'){}
        else if (taskTypeSlcElm.value == 'Guest-request'){}
    }
    else if (taskSubmitBtnElm.textContent == 'submit'){
        ControlsMessagesElm.innerHTML = 'Success';
        let room = Rooms.find((rm)=>rm.number==RoomNumberInpElm.value); //adds task everywhere
        let emply = EmplySlcElm.value=='Random' ? rrEmpSlc() : Employees.find((emp)=>emp.Name==EmplySlcElm.value)
        let aTask = createTask(taskTypeSlcElm.value, 0, room, emply, detailsInpElm.value);
        room.tasks.push(aTask);
        emply.Tasklist.push(aTask);
        MTasklist.push(aTask);
        
        //should do?/actions loaded/data loaded for task
        if (taskTypeSlcElm.value == 'Housekeep-checkout'){
            addtoNotifList('assigned', aTask, [room.booking_status, 'unavailable'], {}, [room.booking_status, {}]);
            room.booking_status = 'unavailable';
            let invData = {}
            aTask.actionOnDone.bookingStateTo = 'available';
            aTask.actionOnDone.inventoryChange = roomTypes[room.type];
        }
        else if(taskTypeSlcElm.value == 'Other'){
            if (Object.keys(defTaskActions).includes(customTaskInpElm.value)){
                addtoNotifList('assigned', aTask, ['', ''], {}, [room.booking_status, {}]);
                aTask.type = customTaskInpElm.value;
                aTask.actionOnDone.bookingStateTo = defTaskActions[customTaskInpElm.value].bookingStateTo;
                aTask.actionOnDone.inventoryChange = defTaskActions[customTaskInpElm.value].inventoryChange;
            }
            else {
                addtoNotifList('assigned', aTask, ['', ''], {}, [room.booking_status, {}]);
                aTask.type = customTaskInpElm.value;
            }
        }
        else{
            addtoNotifList('assigned', aTask, ['', ''], {}, [room.booking_status, {}]);
        }
        loadTables();
        //clear input fields
        RoomNumberInpElm.value = '';
        EmplySlcElm.value = 'Random';
        taskTypeSlcElm.value = 'Housekeep-checkout';
        detailsInpElm.value = '';
        taskSubmitBtnElm.value = 'validate';
        ControlsMessagesElm.innerHTML = '';
    }
}

//==============create and manage notifications=======================
function addtoNotifList(taskStatus, task, roomStatusFT = ['',''], invChng = {}, revertTo){//adds new notification. taskStatus == 'assigned'/'done', roomStatusFT = [s1,s2],{item1: int, item2: int}// revertTo --> data that is overwritten/changed afterwards [initial room status, inv change done now]
    let notif = document.createElement('div');
    notif.classList.add('notification');
    notif.innerHTML = `
        <div onclick="if (notifierElm.children.length == 1) {closenotifs();} this.parentElement.remove();" class="notifXmark">&times;</div>
        <div class="notifModifyTaskBtn" style="flex-grow: 1;">
            - <strong>Task ${taskStatus}</strong> (${task.type}, Room ${task.room.number}, ${task.employee.Name})<br/>
            ${roomStatusFT[0] != roomStatusFT[1] ? `- <strong>Room status changed</strong> (${roomStatusFT[0]} to ${roomStatusFT[1]})<br/>` : ''}
            ${Object.keys(invChng).length != 0 ? `- <strong>Inventory changed</strong>: ${Object.keys(invChng).map((key)=>{return `${key}: ${invChng[key]}`;}).join(', ')}` : ''}
        </div>
    `;
    notif.querySelector('.notifModifyTaskBtn').addEventListener('click', (e)=>{ //on notification click open action pane
        if (task.isDone && taskStatus == 'assigned') //check if is assigned notif and is outdated (task aldy done)
            {e.target.innerHTML = '/!\\ outdated /!\\';}
        else {loadTaskData(taskStatus, task, [roomStatusFT[1], invChng], revertTo);} //else open action panel
        notif.style.opacity = '0';
        setTimeout(()=>{if (notifierElm.children.length == 1) {closenotifs();} e.target.parentElement.remove();}, 310);
    });
    notif.style.opacity = '0';
    notifierElm.appendChild(notif);
    setTimeout(()=>{ 
        notif.style.opacity = '1'; 
    }, 10);
    openNotifPrv();
    if (openedView == true) {notifierElm.lastElementChild.scrollIntoView({behavior: 'smooth', block: 'end'})}
}
let opensTriggered = 0;
function openNotifPrv(){ //Opens notification bar in preview (mini) mode
    ntfrShellElm.classList.remove('notifsNotdispld');
    opensTriggered++;
    setTimeout(()=>{ 
        opensTriggered--;
        if (opensTriggered == 0 && openedView == false) {
            ntfrShellElm.classList.add('notifsNotdispld');
        }
    }, 5000);
}
let openedView = false;
function openAllNotifs(){ //open notification bar in full
    if (openedView == true) { return; }//avoid repeated triggers
    openedView = true;
    ntfrShellElm.classList.remove('notifsNotdispld');
    notifierElm.classList.add('notifLogsOpen');
    ntfrShellElm.classList.add('ntfrShlOpen');
}
function closenotifs(){ //close notification bar in full
    openedView = false;
    ntfrShellElm.classList.add('notifsNotdispld');
    notifierElm.classList.remove('notifLogsOpen');
    ntfrShellElm.classList.remove('ntfrShlOpen');
}
function notifBarClicked(){
    if (openedView == true) {closenotifs();}
    else {openAllNotifs();}
}

//========================Action pane functions====================
function toggleActionPane(isOpened){rez = isOpened ? '' : 'none'; ActionConfmrFrcrElm.style.display = rez; ActionConfmrElm.style.display = rez;}
function loadTaskData(taskStatus, task, assgnAction = ['',''], revertTo = ['unavailable', {}]){ //asssgnAction is for modification done on task assigned
    targetTaskElm.innerHTML = `For Task [${task.type}, Room ${task.room.number}, ${task.employee.Name}] <span>initiated/done</span>`;
    TargetRoomElm.innerHTML = task.room.number.toString();
    targetTaskElm.querySelector('span').innerHTML = `
        ${taskStatus == 'assigned'?`<span onclick="saveTaskActions('done', tempDoneData); toOnTask('assigned');" id="asgndActSlc">assigned</span>/<span onclick="saveTaskActions('assigned', tempAssgnData); toOnTask('done');" id="dneActSlc">done</span>`:'done'}
        `;
    if (taskStatus == 'assigned') {//if assgnd/done, do assigned first
        assignedElm = document.getElementById('asgndActSlc'); doneElm = document.getElementById('dneActSlc');
        tempAssgnData = assgnAction; tempDoneData = [task.actionOnDone.bookingStateTo, task.actionOnDone.inventoryChange];
        toOnTask('assigned');
        isTaskStatusOn = 'assigned'; reversionData = revertTo; targetRoom = task.room; targetTask = task;
    }
    else {// action for done task
        loadTaskActions('done', [task.actionOnDone.bookingStateTo, task.actionOnDone.inventoryChange]);
        currentStatus = 'done';
        isTaskStatusOn = 'done'; reversionData = revertTo; targetRoom = task.room; targetTask = task;
    }
    toggleActionPane(true);
}
//separately loads assigned or done actions.
function loadTaskActions(onToTaskStatus, actions){
    ActionMessagesElm.innerHTML = '';
    clearInvModItems();
    if (actions[1]){ //check if inventory change obj has items
        Object.keys(actions[1]).reverse().forEach((key)=>{addItemtoInvMod(key, actions[1][key]);});
    }
    bkStatusToInpElm.value = actions[0];
}
//save changes to temporary variable
function saveTaskActions(onToTaskStatus, actions){
    let newInvMod = {}
    let newToStatus = bkStatusToInp.value;
    Object.values(inventoryModsElm.children).forEach((childElm)=>{
        newInvMod[childElm.children[0].innerHTML] = isNaN(+childElm.children[1].value) ? 0 : +childElm.children[1].value;
    })
    if (onToTaskStatus == 'assigned') {tempAssgnData = [newToStatus, newInvMod];}
    else {tempDoneData = [newToStatus, newInvMod];}
}
//modifies task's on done data or currently excecuted changes
function modifyTaskActions(){ 
    if (currentStatus == 'assigned') {saveTaskActions('assigned', '');} else {saveTaskActions('done', '');} //save data to temp assign variable
    if (isTaskStatusOn == 'assigned') { //undo and do task assign action and store on task done action
        targetRoom.setBkStatus(reversionData[0]);
        Object.keys(reversionData[1]).forEach((key)=>{modifyInventory(key, -reversionData[1][key]);});//undo changes
        targetRoom.setBkStatus(tempAssgnData[0]);
        Object.keys(tempAssgnData[1]).forEach((key)=>{modifyInventory(key, tempAssgnData[1][key]);});//do new changes
        targetTask.actionOnDone.bookingStateTo = tempDoneData[0]; //save done actions to task obj
        targetTask.actionOnDone.inventoryChange = tempDoneData[1];
    }
    else{ //undo and do task done action
        targetRoom.setBkStatus(reversionData[0]);
        Object.keys(reversionData[1]).forEach((key)=>{modifyInventory(key, -reversionData[1][key]);});//undo changes
        targetRoom.setBkStatus(tempDoneData[0]);
        Object.keys(tempDoneData[1]).forEach((key)=>{modifyInventory(key, tempDoneData[1][key]);});//do new changes
    }
    loadTables();
}
let isTaskStatusOn, currentStatus, targetTask, targetRoom, reversionData; //for checking whether is task assigned or task done, data to revert previous changes
let tempAssgnData, tempDoneData; //store current modifications
let assignedElm, doneElm;
function toOnTask(taskStatus){ //manages switching between different task status
    if (taskStatus == 'assigned')
        {assignedElm.classList.add('taskStSlctd'); doneElm.classList.remove('taskStSlctd'); loadTaskActions('assigned', tempAssgnData); currentStatus = 'assigned';}
    else {assignedElm.classList.remove('taskStSlctd'); doneElm.classList.add('taskStSlctd'); loadTaskActions('done', tempDoneData); currentStatus = 'done';}
}
let prsntModInvLst = [];
function addItemtoInvMod(itemTadd, itemNum = 0){ //handler for adding new items for inventory modification
    if (Object.keys(Inventory).includes(itemTadd) && !prsntModInvLst.includes(itemTadd)){
        let itemNw = document.createElement('div');
        itemNw.innerHTML = `<Label>${itemTadd}</Label> : 
                        <input onkeydown="return onlyDigitsOnInp(event)" class="itemQtyInp" required type="number" placeholder="+/-amt" value="${itemNum}"/>
                        <span class="removeItem">-</span>`;
        inventoryModsElm.prepend(itemNw); //insert item at start of parent
        prsntModInvLst.push(itemTadd);
        presentListIdx = prsntModInvLst.length - 1;
        itemNw.querySelector('.removeItem').addEventListener('click' ,()=>{
            prsntModInvLst = ascplice(prsntModInvLst, presentListIdx, 1);
            event.target.parentElement.remove();});
    }
}
function clearInvModItems(){inventoryModsElm.innerHTML = ''; prsntModInvLst = [];}
function onlyDigitsOnInp(e){ return !(e.key.length == 1) || "-0123456789".includes(e.key);}


headerData = {
    Task: ['Index','Type', 'Room', 'Employee','Details',],
    Rooms: ['ID', 'Room Type', 'Room Number','Booking Status','Room Serviced Status','Tasks'],
    Employees: ['ID','Name','Tasklist'],
    Inventory: ['Item','Amount Available']
}
function ascplice(array, index, count){
    return [...array.slice(0,index),...array.slice(index + count, array.length)];
}
//===================================================

//helper funct for loading display table data ()
function taskTo2dArray(){
    return MTasklist.map((obj,idx)=>{a = Object.values(obj); return [idx,a[0],a[2].number,a[3].Name,a[4]]})
}
function roomsTo2dArray(){
    return Rooms.map((obj,idx)=>{a = Object.values(obj); return [a[0],a[1],a[2],a[4],a[5],'-']})//a[6].length == 0?'-':prsTl(a[6])
}
function invTo2dArray(){
    return Object.entries(Inventory).map((pair,idx)=>{return [pair[0],pair[1].amount_avl];})
}
function emplTo2dArray(){
    return Employees.map((obj,idx)=>{a = Object.values(obj); return [a[0],a[1],'-'];})
}
//parse task list, converts list of task obj to html elements
function prsTl(Tasklist){
    return Tasklist.map(taskObj=>{
        let gtskObj = document.createElement('div');
        gtskObj.className = 'taskItem';
        gtskObj.innerHTML = `
            <div style="display:inline-block">
                <span class="taskType">${taskObj.type}</span>
                <br/>
                <span>Room ${taskObj.room.number}</span>
                <span>[${taskObj.employee.Name}]</span>
            </div>
            <div class="rmvBtn">_</div>`;
        gtskObj.querySelector('.rmvBtn').addEventListener('click', ()=>{taskObj.taskDone(taskObj)});
        return gtskObj;
    });
}


//========================================================================
//main html tables managing and modification

let Pages = {};
let navbarElm = 0;
let TaskTable, RoomTable, InvntTable, EmplTable;
let CustomTaskDataTableElm, OrderLogsTableElm, EmployeesPersonalDataTableElm;

let RoomNumberInpElm, EmplySlcElm, taskTypeSlcElm, detailsInpElm, taskSubmitBtnElm, ControlsMessagesElm;

let ActionConfmrFrcrElm, ActionConfmrElm;
let notifierElm;

function toPage(page, btn, skipbtn=false){ //for switching to different pages
    Object.values(Pages).forEach(pg=>{pg.classList.add("isHdn");})
    page.classList.remove("isHdn")
    Object.values(navbarElm.children).forEach(child=>child.classList.remove("navbar_item_active"));
    if (!skipbtn) {btn.classList.add("navbar_item_active");}
}

function generateTable(data, header = [], clmAtt = []){//2d array, accepts styles for specific columns[column indx, style string]
    clmsToMd = []
    if (clmAtt.length == 0){} else{clmAtt.forEach(atb=>{clmsToMd[atb[0]]=atb[1]});}
    nwTable = document.createElement('table');
    nwTable.style.borderSpacing = '0px';
    nwTable.innerHTML = header.length == 0 ? '' : `<tr class="listRw">${header.map(hd=>`<th class="listClm">${hd}</th>`).join('')}</tr>` +
    data.map(ritem => `<tr class="listRw">
        ${ritem.map((citem,idx)=>`<td class="listClm" ${clmsToMd!=undefined?clmsToMd[idx]:''}>${citem}</td>`).join('')}
        </tr>`).join('');
    return nwTable;
}

function initializePage(){ //initialises html element references, called at end of document.
    //page structure
    navbarElm = document.getElementById("navbar");
    Pages.MainPg = document.getElementById('Main page');
    Pages.RoomPg = document.getElementById('Rooms');
    Pages.InvtPg = document.getElementById('Inventory');
    Pages.EmplPg = document.getElementById('Employees');
    Pages.AcCfPg = document.getElementById('ActionConfig');
    Pages.IvRsPg = document.getElementById('InventoryRessuply');
    Pages.EmpDPg = document.getElementById('EmplyDataNReg');
    Pages.RmDtPg = document.getElementById('roomData');
    Pages.SRDtPg = document.getElementById('roomDataSub');
    toPage(Pages.MainPg, navbarElm.children[0]);
    console.log(Pages);

    //inputs & handlers
    RoomNumberInpElm = document.getElementById('RoomNumInp');
    EmplySlcElm = document.getElementById('EmplySlc');
    taskTypeSlcElm = document.getElementById('taskTypeSlc');
    customTaskInpElm = document.getElementById('customTaskInp');
    detailsInpElm = document.getElementById('detailsInp');
    taskSubmitBtnElm = document.getElementById('taskSubmitBtn');
    ControlsMessagesElm = document.getElementById('ControlsMessages'); //on any value change will need revalidation
    RoomNumberInpElm.addEventListener('input', ()=>{taskSubmitBtnElm.textContent = 'validate'; ControlsMessagesElm.textContent = '';})
    EmplySlcElm.addEventListener('input', ()=>{taskSubmitBtnElm.textContent = 'validate'; ControlsMessagesElm.textContent = '';})
    taskTypeSlcElm.addEventListener('input', ()=>{taskSubmitBtnElm.textContent = 'validate'; ControlsMessagesElm.textContent = '';})
    detailsInpElm.addEventListener('input', ()=>{taskSubmitBtnElm.textContent = 'validate'; ControlsMessagesElm.textContent = '';})
    taskSubmitBtnElm.addEventListener('click', ()=>{processControlsData(); buttonStages()})

    ActionConfmrFrcrElm = document.getElementById('ActionConfmrFrcr'); ActionConfmrFrcrElm.style.display = 'none';
    ActionConfmrElm = document.getElementById('ActionConfmr'); ActionConfmrElm.style.display = 'none';
    targetTaskElm = document.getElementById('targetTask');
    itemNameInpElm = document.getElementById('itemNameInp');
    inventoryModsElm = document.getElementById('inventoryMods');
    TargetRoomElm = document.getElementById('TargetRoom');
    bkStatusToInpElm = document.getElementById('bkStatusToInp');
    vNcActionBtnElm = document.getElementById('vNcActionBtn');
    cancelActionBtnElm = document.getElementById('cancelActionBtn');
    ActionMessagesElm = document.getElementById('ActionMessages');

    notifierElm = document.getElementById('notifier');
    openNotifsLogsBtnElm = document.getElementById('openNotifsLogsBtn');
    ntfrShellElm = document.getElementById('ntfrShell');

    CustomTaskDataTableElm = document.getElementById('CustomTaskDataTable');

    OrderLogsTableElm = document.getElementById('OrderLogsTable');

    EmployeesPersonalDataTableElm = document.getElementById('EmployeesPersonalDataTable');

    initEmployees.forEach(element => {addNewEmployee(element, 25, '-', '-')}); //load employee data

    //page data
    loadTables();
}
function loadTables(){ //reloads basically all data.
    Object.values(Pages).forEach(pg=>{pg.querySelector(".listSection").innerHTML = '';})

    TaskTable = Pages.MainPg.querySelector('.listSection').appendChild(generateTable(taskTo2dArray(), headerData.Task));
    RoomTable = Pages.RoomPg.querySelector('.listSection').appendChild(generateTable(roomsTo2dArray(), headerData.Rooms));
    Object.values(RoomTable.children[0].children).forEach((row,cidx)=>{
        if (cidx == 0) {return;}
        cidx--;
        row.children[3].innerHTML = `<select
        style="transform: scale(1.2) translateX(5px); border: none;"
        oninput="Rooms[${cidx}].setBkStatus(this.value); ">
        <option>unavailable</option><option>available</option><option>booked</option>
        <option>checked in</option><option>checked out</option>
        </select>`
        row.children[3].querySelector('select').value = Rooms[cidx].booking_status
        if (Rooms[cidx].tasks.length != 0) {row.children[5].innerHTML=''; prsTl(Rooms[cidx].tasks).forEach((rez)=>{row.children[5].appendChild(rez);})}
        row.children[5].style.cssText = "display: flex; max-width: 500px; overflow: auto;"
    })
    InvntTable = Pages.InvtPg.querySelector('.listSection').appendChild(generateTable(
        invTo2dArray(), headerData.Inventory, [[1,'style="text-align: end;"']]
    ))
    EmplTable = Pages.EmplPg.querySelector('.listSection').appendChild(generateTable(
        emplTo2dArray(), headerData.Employees
    ))
    Object.values(EmplTable.children[0].children).forEach((row, cidx)=>{
        if (cidx == 0) {return;}
        cidx--;
        if (Employees[cidx].Tasklist.length != 0) {row.children[2].innerHTML=''; prsTl(Employees[cidx].Tasklist).forEach((rez)=>{row.children[2].appendChild(rez);})}
        row.children[2].style.display = 'flex';
    })

    //initialise stuff
    EmplySlcElm.innerHTML = `<option>Random</option>` + Employees.map((emplye)=>`<option>${emplye.Name}</option>`).join('');
}
