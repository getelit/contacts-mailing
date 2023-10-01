const selectCompaniesBtn = document.querySelector('#select-companies-btn');
const selectContactsBtn = document.querySelector('#select-contacts-btn');
const sendFormBtn = document.querySelector('#send-form-btn');
const logStoryBtn = document.querySelector('#log-story-btn');
const leasingCompaniesBtn = document.querySelector('#leasing-companies-btn');
const suppliersBtn = document.querySelector('#suppliers-btn');

const companiesWindow = document.querySelector('#companies-window');
const contactsWindow = document.querySelector('#contacts-window');
const companiesList = document.querySelector('#companies-list');
const logStory = document.querySelector('#log-story');
const tabs = document.querySelectorAll('.tab-wrapper button');

let companiesWinOpened = false;
let contactsWinOpened = false;
let logStoryOpened = false;

let currentTab = 'leasing-companies';

let companiesData = [];

function addContact(companyName, contactName, contactEmail) {
    let companyExists = false;

    companiesData.forEach(function(company) {
        if (company.name === companyName) {
            companyExists = true;
        }
    });

    let contact = {
        // id: 0,
        name: contactName,
        company: companyName,
        email: contactEmail,
        checked: false,
    };

    if (companyExists) {
        companiesData.find(company => company.name === companyName).contacts.push(contact);
    } else {
        let newCompany = {
            // id: 0,
            name: companyName,
            contacts: [contact],
            checked: false
        };
        
        companiesData.push(newCompany);
    }
}

function setCompanies() {
    companiesList.innerHTML = '';

    companiesData.forEach(company => {
        let companyElement = document.createElement('li');
        companyElement.classList.add('company');
        companyElement.classList.add('item');

        let input = document.createElement('input');
        input.classList.add('checkbox');
        input.type = 'checkbox';
        input.checked = company.checked;

        let companyName = document.createElement('p');
        companyName.textContent = company.name;

        companyElement.appendChild(input);
        companyElement.appendChild(companyName);

        companiesList.appendChild(companyElement);
    });

    setCheckedCompanies();
}

function setContacts() {
    let contactsList = document.querySelector("#contacts-list");

    contactsList.innerHTML = '';

    companiesData.forEach(company => {
        if (company.checked) {
            let companyTitle = document.createElement('li');
            companyTitle.classList.add('company');
            companyTitle.textContent = company.name;

            let ul = document.createElement('ul');
            ul.appendChild(companyTitle);

            company.contacts.forEach(contact => {
                let contactElement = document.createElement('li');
                contactElement.classList.add('contact');
                contactElement.classList.add('item');

                let contactCheckbox = document.createElement('input');
                contactCheckbox.type = 'checkbox';
                contactCheckbox.classList.add('checkbox');
                contactCheckbox.checked = contact.checked;

                let contactName = document.createElement('p');
                contactName.textContent = contact.name;

                contactElement.appendChild(contactCheckbox);
                contactElement.appendChild(contactName);

                ul.appendChild(contactElement);
            });

            contactsList.appendChild(ul);
        }
    });
}

function handleCompanies() {
    const companiesItems = document.querySelectorAll('#companies-list .company');

    companiesItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const companyName = item.querySelector('p').textContent;
        const company = companiesData.find(c => c.name === companyName);

        function selectCompany() {
            const btnText = document.querySelector('#select-companies-btn-text');

            checkbox.checked = !checkbox.checked;

            if (!checkbox.checked) {
                company.contacts.forEach(contact => {
                    contact.checked = false;
                });
            }

            company.checked = checkbox.checked;

            setCheckedCompanies();
        }

        item.addEventListener('click', selectCompany);
    });
}

function handleContacts() {
    const contactsItems = document.querySelectorAll('#contacts-list .contact');

    contactsItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const contactName = item.querySelector('p').textContent;

        const company = companiesData.find(company => {
            return company.contacts.find(contact => contact.name === contactName);
        });

        const contact = company.contacts.find(c => c.name === contactName);

        function selectContact() {
            const btnText = document.querySelector('#select-contacts-btn-text');

            contact.checked = !contact.checked;
            checkbox.checked = contact.checked;

            // setCheckedCompanies();

            const checkedCheckboxes = document.querySelectorAll('#contacts-list input[type="checkbox"]:checked');
            const checkedCount = checkedCheckboxes.length;
            
            if (checkedCount > 0) {
                btnText.innerText = "Выбрано: " + checkedCount;
            } else {
                btnText.innerText = "Не выбрано ";
            }
        }
        
        item.addEventListener('click', selectContact);
    });
}

function notifySend() {
    let counter = 1;
    let logNotifier = document.querySelector('#log-notifier');

    // clear existing notify
    while (logNotifier.firstChild) {
        logNotifier.removeChild(logNotifier.firstChild);
    }

    let sendTitle = document.createElement('h2');
    sendTitle.innerHTML = "Отправлено:<br>";
    sendTitle.style.margin = '50px 0px 10px 0px';
    logNotifier.appendChild(sendTitle);

    companiesData.forEach(company => {
        company.contacts.forEach(contact => {
            if (contact.checked) {
                let contactLine = document.createElement('h3');
                contactLine.innerHTML = `${counter}) ${contact.name} => ${contact.email}` + "<br>";
                counter += 1;
                
                logNotifier.appendChild(contactLine);
            }
        });
    });
}

function addLogRecord() {
    let logStory = document.querySelector("#log-story");

    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();   
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds(); 

    const dateTime = `${day}.${month}.${year} - ${hours}:${minutes}:${seconds}\n`;
    logStory.value += dateTime;

    let messageForm = document.querySelector("#msg-form");
    let messageText = messageForm.value;

    let counter = 1;
    companiesData.forEach(company => {
        company.contacts.forEach(contact => {
            if (contact.checked) {
                logStory.value += `${counter}) ${contact.name} => ${contact.email}\n`;
                counter += 1;
            }
        });
    });

    logStory.value += "\nТекст сообщения:\n" + messageText + "\n\n";
    
    logStory.value += "--------------------------------------------------------------\n\n";
}

function companiesSearch() {
    const inputSearch = document.querySelector('#search-companies').value.toLowerCase();
    const companies = document.querySelectorAll('#companies-list .company');

    companies.forEach(company => {
        const companyName = company.querySelector('p');

        if (companyName) {
            let textValue = companyName.textContent || companyName.innerHTML;
            if (textValue.toLowerCase().indexOf(inputSearch) > -1) {
                company.style.display = "";
            } else {
                company.style.display = "none";
            }
        }
    }); 
}

function contactsSearch() {
    const inputSearch = document.querySelector('#search-contacts').value.toLowerCase();
    // const contacts = document.querySelectorAll('#contacts-list ul .contact');
    const companies = document.querySelectorAll('#contacts-list ul');

    companies.forEach(company => {
        const companyName = company.querySelector('.company');

        if (companyName) {
            let textValue = companyName.textContent || companyName.innerHTML;
            if (textValue.toLowerCase().indexOf(inputSearch) > -1) {
                company.style.display = "";
            } else {
                company.style.display = "none";
            }
        }
    });
}

function saveData() {
    const data = JSON.stringify(companiesData);
    localStorage.setItem(`${currentTab}Data`, data);
}
  
function loadData(tab) {
    const data = localStorage.getItem(`${tab}Data`);

    if (data) {
        companiesData = JSON.parse(data); 
    }

    logStory.value = '';
    if (localStorage.getItem(`${tab}Log`)) {
        logStory.value = localStorage.getItem(`${tab}Log`); 
    }

    // console.log(companiesData + ' loaded');
}

function setCheckedCompanies() {
    const btnText = document.querySelector('#select-companies-btn-text');

    const checkedCheckboxes = document.querySelectorAll('#companies-list input[type="checkbox"]:checked');
    const checkedCount = checkedCheckboxes.length;
    
    if (checkedCount > 0) {
        btnText.innerText = "Выбрано: " + checkedCount;
    } else {
        btnText.innerText = "Не выбрано ";
    }
}

function switchTab(tab) {
    const selectCompaniesbtnText = document.querySelector('#select-companies-btn-text');
    const selectContactsbtnText = document.querySelector('#select-contacts-btn-text');

    selectCompaniesbtnText.innerText = "Не выбрано ";
    selectContactsbtnText.innerText = "Не выбрано ";


    const tabBtn = document.querySelector(`#${tab}-btn`);

    contactsWindow.classList.remove('open');

    // change selected visually
    tabs.forEach(t => t.classList.remove('active')); 
    tabBtn.classList.add('active');

    currentTab = tab;

    companiesData = [];
    loadData(tab);

    setCompanies();
    handleCompanies();
}

// --

// switchTab('leasing-companies');

// addContact("ОАО Компания", "Савельев Савелий", "savely@mail.ru");
// addContact("ОАО Компания", "Власов Павел", "vlasov@mail.ru");
// addContact("Транс-Компания", "Кулешов Михаил", "vlasov@mail.ru");
// addContact("Транс-Компания", "Морозова Ева", "vlasov@mail.ru");

// saveData();

// switchTab('suppliers');

// addContact("Лотонг", "Маслова Алёна", "maslova@mail.ru");
// addContact("Лотонг", "Никольская Софья", "nikolskaya@mail.ru");
// addContact("Лотонг", "Кузнецова Виктория", "kuznecova@mail.ru");
// addContact("НК Рисо", "Молчанова Марьям", "molchanova@mail.ru");
// addContact("НК Рисо", "Ершова Елизавета", "ershova@mail.ru");
// addContact("Брон-кист", "Ершов Максим", "ersh-max@mail.ru");
// addContact("Брон-кист", "Ирина Мельник", "irina-melnik@mail.ru");

// saveData();

// --

switchTab('leasing-companies');

// localStorage.clear();

leasingCompaniesBtn.addEventListener('click', () => {
    switchTab('leasing-companies');
});

suppliersBtn.addEventListener('click', () => {
    switchTab('suppliers');
});

selectCompaniesBtn.addEventListener('click', () => {
    // const companiesWindow = document.querySelector('#companies-window');
    // const contactsWindow = document.querySelector('#contacts-window');

    // Open/close
    if(!companiesWinOpened || contactsWinOpened) {
        companiesWindow.classList.add('open');
        companiesWinOpened = true;

        contactsWindow.classList.remove('open');
        contactsWinOpened = false;        
    } else {
        companiesWindow.classList.remove('open');
        companiesWinOpened = false;
    }
});

selectContactsBtn.addEventListener('click', () => {

    // Open/close
    if(!contactsWinOpened || companiesWinOpened) {
        contactsWindow.classList.add('open');
        contactsWinOpened = true;

        companiesWindow.classList.remove('open');
        companiesWinOpened = false; 

        setContacts();
        handleContacts();
        
    } else {
        contactsWindow.classList.remove('open');
        contactsWinOpened = false;
    }
});

logStoryBtn.addEventListener('click', () => {
    const logStory = document.querySelector('#log-story');

    logStory.classList.toggle('open');
});

sendFormBtn.addEventListener('click', () => {
    let emailsToSend = [];
    let msgText = document.querySelector('#msg-form');
    msgText = encodeURIComponent(msgText.value);

    if (msgText === null || msgText === '') {
        alert("Письмо пустое!");
        return;
    }

    let nobodyChecked = true;
    let multipleChecked = false;

    companiesData.forEach(company => {
        let contactsSelected = 0;

        company.contacts.forEach(contact => {
            if (contact.checked) {
                nobodyChecked = false;
                emailsToSend.push(contact.email);
                contactsSelected += 1;
            }
        });

        if (contactsSelected > 1) {
            multipleChecked = true;
        }
    });

    if (nobodyChecked) {
        sendFormBtn.href = '#';
        alert("Не выделен ни один контакт!");
        return;
    }
    
    let confirmSend = false;

    if (multipleChecked) {
        confirmSend = confirm('Отправить сообщение нескольким контактам в одной компании?');
    }

    if (multipleChecked && !confirmSend) {
        sendFormBtn.href = '#';
    } else {
        sendFormBtn.href = "mailto:" + "?body=" + msgText + "&bcc=" + emailsToSend;
        addLogRecord();
        notifySend();

        // save log
        localStorage.setItem(`${currentTab}Log`, logStory.value);
    }
    
});
