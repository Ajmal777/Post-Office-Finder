const doc = document;

const landingPage = doc.getElementById('landing-section');
const mainPage = doc.getElementById('main-section');

const startBtn = doc.getElementById('landing-page__btn');
const landingPageIP = doc.getElementById('landing-page__ip');

const mainPageIP = doc.getElementById('user-ip');
const latitude = doc.getElementById('pos-lat');
const longitude = doc.getElementById('pos-long');
const city = doc.getElementById('loc-city');
const region = doc.getElementById('loc-region');
const org = doc.getElementById('host-org');
const hostname = doc.getElementById('host-name');

const map = doc.getElementById('g-map');

const timezone = doc.getElementById('time-zone');
const dateTime = doc.getElementById('date-n-time');
const pincode = doc.getElementById('pincode');
const message = doc.getElementById('msg');

const po_list = doc.getElementById('post-office-list');

const searchBar = doc.getElementById('searchBar');

let USER_IP;
let USER_LOC_OBJ = {};
let TOKEN = '0265ad6b82d2c1';

let PO_LIST = [];

// Get user's IP Address
async function getIP(){
    const data = await fetch('https://api.ipify.org?format=json');
    const parsedObj = await data.json();

    USER_IP = parsedObj.ip;   

    landingPageIP.innerText = USER_IP;
    mainPageIP.innerText = USER_IP;

    getUserLocationDetails();
}

async function getUserLocationDetails(){
    const data = await fetch(`https://ipinfo.io/${USER_IP}?token=${TOKEN}`);
    USER_LOC_OBJ = await data.json();


    city.innerText = USER_LOC_OBJ.city;
    region.innerText = USER_LOC_OBJ.region;

    const loc = USER_LOC_OBJ.loc.split(',');
    latitude.innerText = loc[0];
    longitude.innerText = loc[1];
    
    const idx = USER_LOC_OBJ.org.indexOf(' ');
    org.innerText = USER_LOC_OBJ.org;
    hostname.innerText = location.hostname;
    
    map.src = `https://maps.google.com/maps?q=${loc[0]}, ${loc[1]}&z=15&output=embed`

    timezone.innerText = USER_LOC_OBJ.timezone;
    pincode.innerText = USER_LOC_OBJ.innerText;

    let currTime = new Date().toLocaleString("en-US", {timeZone: USER_LOC_OBJ.timeZone});
    dateTime.innerText = currTime;
    pincode.innerText = USER_LOC_OBJ.postal;

    fetchPostOffices(USER_LOC_OBJ.postal);
}

async function fetchPostOffices(pin){
    const request = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    const data = await request.json();
    message.innerText = data[0].Message;
    PO_LIST = data[0].PostOffice;
    renderPostOffices(PO_LIST);
}

let timer;
searchBar.addEventListener('input', ()=>{
    if(timer) clearTimeout(timer);
    timer = setTimeout(()=>{
        const input = searchBar.value.trim().toLowerCase();

        if(input === ''){
            renderPostOffices(PO_LIST);     //to render back all data, if no inputs are given
            return;
        }  

        const temp = PO_LIST.filter(obj => {
            if(obj.Name.toLowerCase().includes(input) || obj.BranchType.toLowerCase().includes(input)){
                return obj;
            }
        })
        renderPostOffices(temp);
    }, 200);
})

function renderPostOffices(data){
    po_list.innerHTML = '';
    data.forEach(obj => {
        createData(obj);
    })
}

function createData(obj){
    const div = doc.createElement('div');
    div.className = "post-office";
    div.innerHTML = 
    `<div class="post-office-name">
        Name <span id="po-name">${obj.Name}</span>
    </div>
    <div class="post-office-branch">
        Branch Type <span id="po-branch">${obj.BranchType}</span>
    </div>
    <div class="post-office-delivery-status">
        Delivery Status <span id="op-delivery">${obj.DeliveryStatus}</span>
    </div>
    <div class="post-office-district">
        District <span id="po-district">${obj.District}</span>
    </div>
    <div class="post-office-division">
        Division <span id="po-division">${obj.Division}</span>
    </div>`

    po_list.appendChild(div);
}

getIP();

startBtn.addEventListener('click', ()=>{
    landingPage.style.display = 'none';
    mainPage.style.display = 'block';
})