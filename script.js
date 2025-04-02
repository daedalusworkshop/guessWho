let selectedPerson = null;

function handlePersonClick(event) {
    // Get the person element (could be the image or username div, but we want the parent .person div)
    let personElement = event.target;
    while (!personElement.classList.contains('person') && personElement.parentElement) {
        personElement = personElement.parentElement;
    }
    
    const person = personElement;
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
// Add more images as needed
];

function shuffleArray(array) {
    // Create a copy of the array to avoid modifying the original
    const shuffled = [...array];
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function renderPeopleGrid(imageArray) {
    const peopleContainer = document.getElementById('people-container');
    
    // Determine how many cards to show based on screen width
    let numberOfCards = 20; // Default: 5 rows of 4 cards
    
    if (window.innerWidth >= 1400) {
        numberOfCards = 20; // 4 rows of 5 cards for large screens
    } else if (window.innerWidth <= 576) {
        numberOfCards = 16; // 8 rows of 2 cards for mobile
    }
    
    // Only use the required number of images
    const limitedArray = imageArray.slice(0, numberOfCards);
    
    peopleContainer.innerHTML = limitedArray
        .map(name => `
            <div class="person" data-username="${name}">
                <div class="person-image">
                    <img src="images/${name}.jpg" alt="${name}">
                </div>
                <div class="person-username">${name}</div>
            </div>
        `).join('');
    
    initializeGame();
}

function handleShuffleClick() {
    // Reset the selected person when shuffling
    selectedPerson = null;
    
    // Clear any selection message
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.innerHTML = '';
    }
    
    // Shuffle and render the grid
    const shuffledImages = shuffleArray(images);
    renderPeopleGrid(shuffledImages);
}

function initializeGame() {
    const people = document.querySelectorAll('.person');
    selectedPerson = null;
    
    people.forEach(person => {
        person.addEventListener('click', handlePersonClick);
    });
}

// Add shuffle button to the page before initial render
const controlsContainer = document.createElement('div');
controlsContainer.id = 'controls-container';
controlsContainer.innerHTML = '<button id="shuffle-button">Shuffle Grid</button>';

// Add it after the h1 but before message-container
const h1Element = document.querySelector('h1');
document.body.insertBefore(controlsContainer, h1Element.nextSibling);

// Initial render of the grid
renderPeopleGrid(images);

// Add event listener to the shuffle button
document.getElementById('shuffle-button').addEventListener('click', handleShuffleClick);

// Listen for window resize to adjust the grid if needed
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Only re-render if we already have a grid
        if (document.querySelectorAll('.person').length > 0) {
            // Keep the current selection state by storing selected and eliminated cards
            const selectedUsername = selectedPerson ? selectedPerson.getAttribute('data-username') : null;
            const eliminatedUsernames = [];
            document.querySelectorAll('.eliminated').forEach(elem => {
                eliminatedUsernames.push(elem.getAttribute('data-username'));
            });
            
            // Re-render with current image array
            renderPeopleGrid(images);
            
            // Restore selected and eliminated states
            if (selectedUsername) {
                const newSelectedPerson = document.querySelector(`.person[data-username="${selectedUsername}"]`);
                if (newSelectedPerson) {
                    selectedPerson = newSelectedPerson;
                    newSelectedPerson.classList.add('selected-person');
                }
            }
            
            eliminatedUsernames.forEach(username => {
                const elimPerson = document.querySelector(`.person[data-username="${username}"]`);
                if (elimPerson) elimPerson.classList.add('eliminated');
            });
        }
    }, 250); // 250ms delay to prevent excessive re-rendering
}); 