
let voices = [];
let voiceSelect = document.querySelector("select");

// Function to populate the voices in the select dropdown
function populateVoices() {
    voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
        // Clear any existing options in case populateVoices is called multiple times
        voiceSelect.innerHTML = '';
        voices.forEach((voice, i) => {
            let option = new Option(`${voice.name} (${voice.lang})`, i);
            voiceSelect.add(option);
        });
    } else {
        console.error("No voices found");
    }
}

// Event listener for when the voices change (in case of delayed loading)
window.speechSynthesis.onvoiceschanged = () => {
    populateVoices();
};

// Call it directly as well to ensure voices are populated
populateVoices();

// Add a fallback mechanism to retry voice loading if it's delayed
function checkVoices() {
    if (window.speechSynthesis.getVoices().length === 0) {
        setTimeout(checkVoices, 500);  // Retry every 500ms until voices are loaded
    } else {
        populateVoices();
    }
}

checkVoices();  // Initial check for voices

// Event listener for the button click to convert text to speech
document.querySelector("button").addEventListener("click", () => {
    // Create a new SpeechSynthesisUtterance instance for each click
    let speech = new SpeechSynthesisUtterance();

    // Get the value of the textarea
    let textAreaValue = document.querySelector("textarea").value;
    if (textAreaValue.trim() === "") {
        alert("Please enter some text to convert to speech");
        return;
    }

    // Assign the selected voice
    let selectedVoiceIndex = voiceSelect.value;  // Get the index of the selected voice
    if (voices.length > 0 && selectedVoiceIndex !== "") {
        speech.voice = voices[selectedVoiceIndex];  // Apply the selected voice
        speech.lang = voices[selectedVoiceIndex].lang;  // Apply the selected voice's language
    } else {
        // Fallback to the first available voice if no voice is selected or voices are missing
        console.warn("No voice selected or available, using fallback voice.");
        speech.voice = voices[0];
        speech.lang = voices[0].lang;
    }

    // Set the text for the speech
    speech.text = textAreaValue;

    // Stop ongoing speech if any
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel(); // Stop any currently speaking utterances
    }

    // Speak the text
    window.speechSynthesis.speak(speech);
});
