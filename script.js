let selectedPerson = null;

function initializeGame() {
    const people = document.querySelectorAll('.person');
    
    people.forEach(person => {
        person.addEventListener('click', (e) => {
            // If no person is selected yet, allow selection
            if (!selectedPerson) {
                selectedPerson = person;
                person.classList.add('selected-person');
                
                // Add message to show selection is made
                const message = document.createElement('div');
                message.className = 'selection-message';
                message.textContent = 'Your secret person is selected! Keep it hidden from your opponent.';
                document.querySelector('h1').after(message);
            } else if (person !== selectedPerson) {
                // If not the selected person, toggle the blur effect
                person.classList.toggle('eliminated');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeGame); 