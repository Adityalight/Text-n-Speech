// to access speech synthesis API 
// init speech api
const synth = window.speechSynthesis;

// DOM elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

//Init voices array
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();

    // Loop through voices and create an option for each one
    voices.forEach(voice => {
        // Create option element
        const option = document.createElement('option');

        // Fill option with voice and language
        option.textContent = voice.name + '(' + voice.lang + ')';

        // Set needed option attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
    console.log("voices",voices)
};

getVoices();
if(synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

// Code for speaking part
const speak = () => {
    //Check if already speaking
    if(synth.speaking){
        console.error('Already speaking...');
        return;
    }
    if(textInput.value !== ''){

        // Add background wave animation
        body.style.background = '#141414 url(dist/img/wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';   //we want the wave to be repeated in x direction only
        body.style.backgroundSize = '100% 100%';    //we want to cover the whole background so set 100%

        //Get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);

        //End of speaking
        speakText.onend = e => {
            console.log('Done speaking...');
            body.style.background = '#141414';  //as soon as finished speaking then again setting the background as black so that the 
        };

        // Speak error
        speakText.onerror = e => {
            console.error('Something went wrong');
        };

        // Selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].
        getAttribute('data-name');

        // Loop through voices
        voices.forEach(voice => {
            if (voice.name === selectedVoice) {
            speakText.voice = voice;
            }
        });

        //Set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;
        // Speak
        synth.speak(speakText);
    }
};

// EVENT LISTENERS

//Text form submit
//Here when we click the speak it button we want to call the speak function which selects the voice
//pitch, rate and speaks
textForm.addEventListener('submit', e => {
    e.preventDefault();     //using this we want to prevent this submit event listener from actually submiting to a file as it is a form itself
    speak();
    textInput.blur();
});

// Rate value change
rate.addEventListener('change', e => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener('change', e => (pitchValue.textContent = pitch.value));

// Voice select change
//Also we want as soon as we select a different voice for current text we want it to 
//speak and we don't have to click speak it again
voiceSelect.addEventListener('change', e => speak());