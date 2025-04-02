let selectedPerson = null;
let currentSeed = Math.floor(Math.random() * 10000); // Default random seed between 0-9999
// Configure the default number of cards to display on desktop/large screens
const DEFAULT_CARD_COUNT = 30;

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
];

// Seeded random number generator
function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// Deterministic shuffle based on a seed
function shuffleArrayWithSeed(array, seed) {
    // Create a copy of the array to avoid modifying the original
    const shuffled = [...array];
    let currentSeed = seed;
    
    // Fisher-Yates shuffle algorithm with seeded randomness
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(currentSeed++) * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

function renderPeopleGrid(imageArray) {
    const peopleContainer = document.getElementById('people-container');
    
    // Always use DEFAULT_CARD_COUNT as the base number of cards
    let numberOfCards = DEFAULT_CARD_COUNT;
    
    // Only reduce the number of cards for very small screens where usability would be impacted
    if (window.innerWidth <= 576) {
        // Mobile optimization - check if we need to show fewer cards
        if (window.innerHeight <= 700) {
            numberOfCards = Math.min(DEFAULT_CARD_COUNT, 20); // Small mobile screens but preserve more cards
        }
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
    
    // Get a new seed if the input is empty, or use the entered seed
    const seedInput = document.getElementById('seed-input');
    if (seedInput.value.trim() !== '') {
        currentSeed = parseInt(seedInput.value.trim(), 10);
        if (isNaN(currentSeed)) {
            currentSeed = Math.floor(Math.random() * 10000);
        }
    } else {
        currentSeed = Math.floor(Math.random() * 10000);
    }
    
    // Update the seed input field with the current seed
    seedInput.value = currentSeed;
    
    // Shuffle with the seed and render
    const shuffledImages = shuffleArrayWithSeed(images, currentSeed);
    renderPeopleGrid(shuffledImages);
}

function initializeGame() {
    const people = document.querySelectorAll('.person');
    
    people.forEach(person => {
        person.addEventListener('click', handlePersonClick);
    });
}

// Create controls container with shuffle button and seed input
function createControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'controls-container';
    
    // Create the seed input and shuffle button
    // Mobile optimization: simplify the label for smaller screens
    const isMobile = window.innerWidth <= 576;
    
    controlsContainer.innerHTML = `
        <div class="seed-container">
            <label for="seed-input">${isMobile ? 'Seed:' : 'Shuffle Seed:'}</label>
            <input type="number" id="seed-input" min="0" max="9999" value="${currentSeed}" placeholder="${isMobile ? 'Seed #' : 'Enter seed (0-9999)'}">
            <button id="shuffle-button">Shuffle Grid</button>
        </div>
        <div class="seed-info">
            <p>${isMobile ? 'Share this seed for the same layout!' : 'Share this seed number with friends to get the same grid layout!'}</p>
        </div>
    `;
    
    // Add it after the h1 but before message-container
    const h1Element = document.querySelector('h1');
    document.body.insertBefore(controlsContainer, h1Element.nextSibling);
    
    // Add event listener to the shuffle button
    document.getElementById('shuffle-button').addEventListener('click', handleShuffleClick);
}

// Add styles for the seed controls with better mobile support
const style = document.createElement('style');
style.textContent = `
    .seed-container {
        margin: 15px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
    }
    
    .seed-container label {
        font-family: Georgia, serif;
        color: #3c2f2f;
        font-weight: bold;
    }
    
    #seed-input {
        padding: 8px 12px;
        border-radius: 8px;
        border: 2px solid #e7b9a7;
        font-family: 'Courier New', monospace;
        background: #f8e8df;
        color: #3c2f2f;
        font-size: 1rem;
        width: 100px;
        text-align: center;
        transition: border-color 0.3s;
    }
    
    #seed-input:focus {
        outline: none;
        border-color: #b76e79;
    }
    
    .seed-info {
        margin-top: 5px;
        font-size: 0.9rem;
        color: #944f3d;
        font-style: italic;
    }
    
    @media (max-width: 576px) {
        .seed-container {
            flex-direction: row;
            margin: 10px auto;
            gap: 5px;
        }
        
        #seed-input {
            width: 80px;
            padding: 6px 8px;
            font-size: 0.9rem;
        }
        
        .seed-info {
            font-size: 0.8rem;
            margin-top: 2px;
        }
        
        .seed-info p {
            margin: 3px 0;
        }
    }
    
    @media (max-height: 700px) and (max-width: 576px) {
        .seed-container {
            margin: 5px auto;
        }
    }
`;
document.head.appendChild(style);

// Initial setup
createControls();

// Initial shuffle with random seed
const initialShuffledImages = shuffleArrayWithSeed(images, currentSeed);
renderPeopleGrid(initialShuffledImages);

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
            
            // Get current images from the grid
            const currentImageOrder = [];
            document.querySelectorAll('.person').forEach(elem => {
                currentImageOrder.push(elem.getAttribute('data-username'));
            });
            
            // Re-render with current image array
            renderPeopleGrid(currentImageOrder);
            
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