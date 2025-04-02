// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdSrqNfJM-KtWFGWKzz5zWt5F4uhX08UE",
  authDomain: "guess-who-mutuals.firebaseapp.com",
  databaseURL: "https://guess-who-mutuals-default-rtdb.firebaseio.com",
  projectId: "guess-who-mutuals",
  storageBucket: "guess-who-mutuals.appspot.com",
  messagingSenderId: "143567987652",
  appId: "1:143567987652:web:d98ed24a5ed5aa34cd0576"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const gameStateRef = database.ref('gameState');
const sessionId = generateSessionId(); // Generate a unique session ID for this game instance

// Generate a random session ID for sharing
function generateSessionId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

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
    
    // Shuffle and save to Firebase
    const shuffledImages = shuffleArray(images);
    
    // Save the shuffled array to Firebase to sync with all clients
    gameStateRef.child(sessionId).set({
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        shuffledImages: shuffledImages
    });
}

function initializeGame() {
    const people = document.querySelectorAll('.person');
    selectedPerson = null;
    
    people.forEach(person => {
        person.addEventListener('click', handlePersonClick);
    });
}

// Listen for session changes from Firebase
function listenForGameUpdates() {
    gameStateRef.child(sessionId).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.shuffledImages) {
            // Reset the selected person
            selectedPerson = null;
            
            // Clear any selection message
            const messageContainer = document.getElementById('message-container');
            if (messageContainer) {
                messageContainer.innerHTML = '';
            }
            
            // Render the grid with the shuffled images from Firebase
            renderPeopleGrid(data.shuffledImages);
        }
    });
}

// Create session info and share section
function createSessionControls() {
    const controlsContainer = document.getElementById('controls-container');
    
    // Add session ID display and sharing options
    const sessionDisplay = document.createElement('div');
    sessionDisplay.className = 'session-display';
    sessionDisplay.innerHTML = `
        <div class="session-info">
            <p>Session ID: <span class="session-id">${sessionId}</span></p>
            <button id="copy-session-btn">Copy Session ID</button>
        </div>
        <div class="join-session">
            <input type="text" id="join-session-input" placeholder="Enter Session ID">
            <button id="join-session-btn">Join Session</button>
        </div>
    `;
    
    // Insert after the shuffle button
    controlsContainer.appendChild(sessionDisplay);
    
    // Add event listener for copying session ID
    document.getElementById('copy-session-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(sessionId)
            .then(() => {
                alert('Session ID copied to clipboard! Share it with friends to play together.');
            })
            .catch(err => {
                console.error('Could not copy session ID: ', err);
            });
    });
    
    // Add event listener for joining a session
    document.getElementById('join-session-btn').addEventListener('click', () => {
        const newSessionId = document.getElementById('join-session-input').value.trim().toUpperCase();
        if (newSessionId && newSessionId !== sessionId) {
            // Unsubscribe from current session
            gameStateRef.child(sessionId).off();
            // Update session ID
            document.querySelector('.session-id').textContent = newSessionId;
            // Set new session ID
            window.sessionId = newSessionId;
            // Listen for updates from the new session
            listenForNewSession(newSessionId);
        }
    });
}

// Listen for updates from a different session
function listenForNewSession(newSessionId) {
    gameStateRef.child(newSessionId).once('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.shuffledImages) {
            // Reset the selected person
            selectedPerson = null;
            
            // Clear any selection message
            const messageContainer = document.getElementById('message-container');
            if (messageContainer) {
                messageContainer.innerHTML = '';
            }
            
            // Render the grid with the shuffled images from Firebase
            renderPeopleGrid(data.shuffledImages);
            
            // Subscribe to future updates
            listenForGameUpdates();
        } else {
            alert('Session not found or empty. Please check the Session ID and try again.');
        }
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
const initialShuffledImages = shuffleArray(images);
renderPeopleGrid(initialShuffledImages);

// Save initial state to Firebase
gameStateRef.child(sessionId).set({
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    shuffledImages: initialShuffledImages
});

// Add event listener to the shuffle button
document.getElementById('shuffle-button').addEventListener('click', handleShuffleClick);

// Create session controls after initial render
createSessionControls();

// Start listening for game updates
listenForGameUpdates();

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