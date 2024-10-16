let voices = [];
let voiceSelect = document.querySelector("select");

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
        voices.forEach((voice, i) => {
            let option = new Option(voice.name, i);
            voiceSelect.add(option);
        });
    }
};

voiceSelect.addEventListener("change", () => {
    let selectedVoiceIndex = voiceSelect.value;
    speech.voice = voices[selectedVoiceIndex];
});

document.querySelector("button").addEventListener("click", () => {
    // Create a new SpeechSynthesisUtterance instance for each click
    let speech = new SpeechSynthesisUtterance();

    let textAreaValue = document.querySelector("textarea").value;
    if (textAreaValue.trim() === "") {
        alert("Please enter some text to convert to speech");
        return;
    }

    // Assign the selected voice
    let selectedVoiceIndex = voiceSelect.value;
    speech.voice = voices[selectedVoiceIndex];
    speech.text = textAreaValue;

    // Stop ongoing speech if any
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel(); // Stop any currently speaking utterances
    }

    // Speak the text
    window.speechSynthesis.speak(speech);
});
