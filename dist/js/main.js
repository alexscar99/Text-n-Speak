// initialize SpeechSynth API
const synth = window.speechSynthesis;

// store DOM elements
const textForm = document.querySelector('form');
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const rate = document.getElementById('rate');
const rateValue = document.getElementById('rate-value');
const pitch = document.getElementById('pitch');
const pitchValue = document.getElementById('pitch-value');
const body = document.querySelector('body');

// get voices from API, store in array, iterate through to create each option element
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  voices.forEach(voice => {
    const option = document.createElement('option');
    option.textContent = voice.name + '(' + voice.lang + ')';

    // set attrs and append to select element
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

const speak = () => {
  // handle err if speaking already
  if (synth.speaking) {
    console.error('Already speaking');
    return;
  }

  if (textInput.value !== '') {
    // add animation to bg
    body.style.background = '#141414 url(img/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';

    // instantiate speech obj, pass speak text to it
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    speakText.onend = e => {
      console.log('Done speaking');
      body.style.background = '#141414';
    };

    speakText.onerror = event => {
      console.log('Something went wrong');
    };

    // store chosen voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
    );

    // iterate through all voices, choose voice if iteration matches selected
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // set pitch and rate, then speak
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    synth.speak(speakText);
  }
};

// event listeners
textForm.addEventListener('submit', event => {
  event.preventDefault();
  speak();
  textInput.blur();
});

rate.addEventListener('change', event => (rateValue.textContent = rate.value));

pitch.addEventListener(
  'change',
  event => (pitchValue.textContent = pitch.value)
);

voiceSelect.addEventListener('change', event => speak());
