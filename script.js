let selectedPerson = null;

function handlePersonClick(event) {
    const person = event.currentTarget;
    const messageContainer = document.getElementById('message-container');

    if (!selectedPerson) {
        selectedPerson = person;
        person.classList.add('selected-person');
        
        if (messageContainer) {
            messageContainer.innerHTML = '<div class="selection-message">Your secret person is selected! Keep it hidden from your opponent.</div>';
        }
    } else if (person !== selectedPerson) {
        person.classList.toggle('eliminated');
    }
}

function initializeGame() {
    const people = document.querySelectorAll('.person');
    selectedPerson = null;
    
    people.forEach(person => {
        person.addEventListener('click', handlePersonClick);
    });
}

// Instead of fetching from JSON, directly list your images
const images = [
'_quinnstrom_',
'aaliahana',
'aidanvabaran',
'albinrstromberg',
'alina.patell',
'andrewkim713',
'auroraallen13',
'austin_o630',
'ava.young22',
'charlesdoehring6',
'chelseaachenn',
'claire.chungg',
'claireeeegilliam',
'dnielalta',
'ellabagull.07',
'eunikwonn',
'evan_fife16',
'graceassicurato',
'hannah.w.fang',
'ieunseo._.o',
'imaad_abbasi',
'jacquelinefang3',
'jamiekonieczka_',
'jemimaccerezo',
'johanstired',
'jvillanueva0x2',
'kasra_makes_art',
'kellybrillantes',
'kevinxue_',
'keyan.k1',
'laila_razi1',
'masha_teofanovic',
'masonbernacki',
'mattrogers1590',
'mira.cunningham_',
'morganmehrhoff',
'najyashadikhan',
'patrick_buckley25',
'patrickpiller_',
'phoebee.teoli',
'rayjanprakash',
'tallmasdaboom',
'tiff4ny.tu',
'uaikimh',
'ygupta26',
];

const peopleContainer = document.getElementById('people-container');
peopleContainer.innerHTML = images
    .map(name => `
        <div class="person" data-username="${name}">
            <img src="images/${name}.jpg" alt="${name}">
        </div>
    `).join('');

initializeGame(); 