'use strict';

/**
 * Central language configuration for PehliMadad.
 * Supported: Hindi, English, Bengali, Tamil, Telugu, Marathi,
 *            Gujarati, Kannada, Malayalam, Punjabi
 */
const LANG_CONFIG = {
  hi: { name: 'Hindi',     nativeName: 'हिंदी',    transcribeCode: 'hi-IN', ttsProvider: 'polly' },
  en: { name: 'English',   nativeName: 'English',   transcribeCode: 'en-US', ttsProvider: 'polly' },
  bn: { name: 'Bengali',   nativeName: 'বাংলা',     transcribeCode: 'bn-IN', ttsProvider: 'google', googleVoice: 'bn-IN-Wavenet-A', googleLang: 'bn-IN' },
  ta: { name: 'Tamil',     nativeName: 'தமிழ்',    transcribeCode: 'ta-IN', ttsProvider: 'google', googleVoice: 'ta-IN-Wavenet-A', googleLang: 'ta-IN' },
  te: { name: 'Telugu',    nativeName: 'తెలుగు',   transcribeCode: 'te-IN', ttsProvider: 'google', googleVoice: 'te-IN-Standard-A', googleLang: 'te-IN' },
  mr: { name: 'Marathi',   nativeName: 'मराठी',    transcribeCode: 'mr-IN', ttsProvider: 'google', googleVoice: 'mr-IN-Wavenet-A', googleLang: 'mr-IN' },
  gu: { name: 'Gujarati',  nativeName: 'ગુજરાતી',  transcribeCode: 'gu-IN', ttsProvider: 'google', googleVoice: 'gu-IN-Wavenet-A', googleLang: 'gu-IN' },
  kn: { name: 'Kannada',   nativeName: 'ಕನ್ನಡ',    transcribeCode: 'kn-IN', ttsProvider: 'google', googleVoice: 'kn-IN-Wavenet-A', googleLang: 'kn-IN' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം',   transcribeCode: 'ml-IN', ttsProvider: 'google', googleVoice: 'ml-IN-Wavenet-A', googleLang: 'ml-IN' },
  pa: { name: 'Punjabi',   nativeName: 'ਪੰਜਾਬੀ',   transcribeCode: 'pa-IN', ttsProvider: 'google', googleVoice: 'pa-IN-Wavenet-A', googleLang: 'pa-IN' },
};

// Transcribe language code → internal lang code
const TRANSCRIBE_TO_LANG = Object.fromEntries(
  Object.entries(LANG_CONFIG).map(([code, cfg]) => [cfg.transcribeCode, code])
);
TRANSCRIBE_TO_LANG['en-IN'] = 'en';

function getLangCode(transcribeCode) {
  if (!transcribeCode) return 'hi';
  return TRANSCRIBE_TO_LANG[transcribeCode] || 'hi';
}

/**
 * Detect language from text using Unicode script ranges + keywords.
 * Unique scripts are detected first. Devanagari is disambiguated
 * between Hindi and Marathi using keywords.
 */
function detectLang(text) {
  if (!text) return 'hi';
  const count = (range) => (text.match(range) || []).length;

  if (count(/[\u0980-\u09FF]/g) > 2) return 'bn'; // Bengali script
  if (count(/[\u0B80-\u0BFF]/g) > 2) return 'ta'; // Tamil script
  if (count(/[\u0C00-\u0C7F]/g) > 2) return 'te'; // Telugu script
  if (count(/[\u0C80-\u0CFF]/g) > 2) return 'kn'; // Kannada script
  if (count(/[\u0D00-\u0D7F]/g) > 2) return 'ml'; // Malayalam script
  if (count(/[\u0A80-\u0AFF]/g) > 2) return 'gu'; // Gujarati script
  if (count(/[\u0A00-\u0A7F]/g) > 2) return 'pa'; // Gurmukhi (Punjabi)

  // Devanagari: Hindi or Marathi — keyword disambiguation
  if (count(/[\u0900-\u097F]/g) > 2) {
    if (/\b(आहे|नाही|मला|आम्ही|तुम्ही|काय|माझ्या|होते|वेदना|ताप|आहेत|नाहीत|करा)\b/.test(text)) return 'mr';
    return 'hi';
  }

  // Hinglish (Latin script with Hindi words)
  if (/\b(hai|ka|ki|ke|ko|se|mera|meri|mere|kya|aur|nahi|bahut|dard|bukhar|saans|chakkar|ulti|bhai|beta|beti|bachcha|abhi|jaldi|zila|rajya|umra|kal|aaj|hain|mujhe|hum)\b/i.test(text)) return 'hi';

  return 'en';
}

// ── Translations ──────────────────────────────────────────────────────────────

const M = {
  audioUnclear: {
    hi: 'आवाज़ स्पष्ट नहीं सुनाई दी। ज़रा तेज़ बोलकर दोबारा भेजें।',
    en: 'Voice not clear. Please speak louder and send again.',
    bn: 'আওয়াজ স্পষ্ট নয়। একটু জোরে বলে আবার পাঠান।',
    ta: 'குரல் தெளிவாக கேட்கவில்லை. கொஞ்சம் உரக்க பேசி மீண்டும் அனுப்பவும்.',
    te: 'మీ గొంతు స్పష్టంగా వినిపించలేదు. కొంచెం గట్టిగా మాట్లాడి మళ్ళీ పంపండి.',
    mr: 'आवाज स्पष्ट ऐकू येत नाही. जरा मोठ्याने बोलून पुन्हा पाठवा.',
    gu: 'અવાજ સ્પષ્ટ સંભળાઈ નહીં. થોડા જોરથી બોલીને ફરીથી મોકલો.',
    kn: 'ಧ್ವನಿ ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿಸಲಿಲ್ಲ. ಸ್ವಲ್ಪ ಜೋರಾಗಿ ಮಾತನಾಡಿ ಮತ್ತೆ ಕಳುಹಿಸಿ.',
    ml: 'ശബ്ദം വ്യക്തമായി കേൾക്കുന്നില്ല. അൽപ്പം ഉറക്കെ സംസാരിച്ച് വീണ്ടും അയക്കൂ.',
    pa: 'ਆਵਾਜ਼ ਸਾਫ਼ ਨਹੀਂ ਸੁਣਾਈ ਦਿੱਤੀ. ਥੋੜਾ ਜ਼ੋਰ ਨਾਲ ਬੋਲ ਕੇ ਦੁਬਾਰਾ ਭੇਜੋ.',
  },
  audioError: {
    hi: 'आवाज़ नहीं सुन पाए। टेक्स्ट में लिखकर भेजें।',
    en: 'Could not process voice. Please type and send.',
    bn: 'আওয়াজ শুনতে পাইনি। টেক্সটে লিখে পাঠান।',
    ta: 'குரல் கேட்கவில்லை. உரையில் தட்டச்சு செய்து அனுப்பவும்.',
    te: 'గొంతు వినిపించలేదు. టెక్స్ట్‌లో రాసి పంపండి.',
    mr: 'आवाज ऐकू येत नाही. मजकूर लिहून पाठवा.',
    gu: 'અવાજ સંભળાઈ નહીં. ટેક્સ્ટમાં લખીને મોકલો.',
    kn: 'ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ಪಠ್ಯದಲ್ಲಿ ಬರೆದು ಕಳುಹಿಸಿ.',
    ml: 'ശബ്ദം കേൾക്കുന്നില്ല. ടെക്സ്റ്റിൽ ടൈപ്പ് ചെയ്ത് അയക്കൂ.',
    pa: 'ਆਵਾਜ਼ ਨਹੀਂ ਸੁਣ ਸਕੇ. ਟੈਕਸਟ ਵਿੱਚ ਲਿਖ ਕੇ ਭੇਜੋ.',
  },
  serviceUnavailable: {
    hi: '⚠️ सेवा उपलब्ध नहीं। आपातकाल में 108 पर कॉल करें।',
    en: '⚠️ Service unavailable. For emergencies call 108.',
    bn: '⚠️ সেবা পাওয়া যাচ্ছে না। জরুরি অবস্থায় 108 নম্বরে কল করুন।',
    ta: '⚠️ சேவை கிடைக்கவில்லை. அவசரநிலையில் 108 அழைக்கவும்.',
    te: '⚠️ సేవ అందుబాటులో లేదు. అత్యవసరంలో 108 కి కాల్ చేయండి.',
    mr: '⚠️ सेवा उपलब्ध नाही. आपत्कालीन स्थितीत 108 वर कॉल करा.',
    gu: '⚠️ સેવા ઉપલબ્ધ નથી. કટોકટીમાં 108 પર કૉલ કરો.',
    kn: '⚠️ ಸೇವೆ ಲಭ್ಯವಿಲ್ಲ. ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ 108 ಗೆ ಕರೆ ಮಾಡಿ.',
    ml: '⚠️ സേവനം ലഭ്യമല്ല. അടിയന്തരാവസ്ഥയിൽ 108 ൽ വിളിക്കൂ.',
    pa: "⚠️ ਸੇਵਾ ਉਪਲਬਧ ਨਹੀਂ. ਐਮਰਜੈਂਸੀ ਵਿੱਚ 108 'ਤੇ ਕਾਲ ਕਰੋ.",
  },
  locationReceived: {
    hi: '📍 Location mil gayi! Ab yeh batayein:\n• Mariz ki umra\n• Yeh takleef kab se hai',
    en: "📍 Location received! Now please tell me:\n• Patient's age\n• Since how long are the symptoms present",
    bn: '📍 অবস্থান পাওয়া গেছে! এখন জানান:\n• রোগীর বয়স\n• কতদিন ধরে সমস্যা হচ্ছে',
    ta: '📍 இருப்பிடம் கிடைத்தது! இப்போது தெரிவிக்கவும்:\n• நோயாளியின் வயது\n• எத்தனை நாட்களாக பிரச்சினை',
    te: '📍 స్థానం వచ్చింది! ఇప్పుడు చెప్పండి:\n• రోగి వయస్సు\n• ఎన్ని రోజులనుండి సమస్య',
    mr: '📍 स्थान मिळाले! आता सांगा:\n• रुग्णाचे वय\n• किती दिवसांपासून त्रास आहे',
    gu: '📍 સ્થાન મળ્યું! હવે જણાવો:\n• દર્દીની ઉંમર\n• કેટલા દિવસથી તકલીફ છે',
    kn: '📍 ಸ್ಥಳ ಸಿಕ್ಕಿತು! ಈಗ ತಿಳಿಸಿ:\n• ರೋಗಿಯ ವಯಸ್ಸು\n• ಎಷ್ಟು ದಿನಗಳಿಂದ ತೊಂದರೆ',
    ml: '📍 സ്ഥലം ലഭിച്ചു! ഇപ്പോൾ അറിയിക്കൂ:\n• രോഗിയുടെ പ്രായം\n• എത്ര ദിവസമായി ബുദ്ധിമുട്ട്',
    pa: '📍 ਟਿਕਾਣਾ ਮਿਲ ਗਿਆ! ਹੁਣ ਦੱਸੋ:\n• ਮਰੀਜ਼ ਦੀ ਉਮਰ\n• ਕਿੰਨੇ ਦਿਨਾਂ ਤੋਂ ਤਕਲੀਫ਼ ਹੈ',
  },
  locationAsk: {
    hi: 'Location mil gayi! Ab bataiye — kya takleef hai? (voice note ya text mein)',
    en: 'Location received! Now please describe the emergency (voice or text).',
    bn: 'অবস্থান পাওয়া গেছে! এখন বলুন — কী সমস্যা? (ভয়েস বা টেক্সটে)',
    ta: 'இருப்பிடம் கிடைத்தது! இப்போது சொல்லுங்கள் — என்ன பிரச்சினை? (குரல் அல்லது உரை)',
    te: 'స్థానం వచ్చింది! ఇప్పుడు చెప్పండి — ఏం సమస్య? (వాయిస్ లేదా టెక్స్ట్)',
    mr: 'स्थान मिळाले! आता सांगा — काय त्रास आहे? (व्हॉइस किंवा मजकूर)',
    gu: 'સ્થાન મળ્યું! હવે જણાવો — શું તકલીફ છે? (વૉઇસ કે ટેક્સ્ટ)',
    kn: 'ಸ್ಥಳ ಸಿಕ್ಕಿತು! ಈಗ ಹೇಳಿ — ಏನು ತೊಂದರೆ? (ಧ್ವನಿ ಅಥವಾ ಪಠ್ಯ)',
    ml: 'സ്ഥലം ലഭിച്ചു! ഇപ്പോൾ പറയൂ — എന്ത് പ്രശ്നം? (ശബ്ദം അല്ലെങ്കിൽ ടെക്സ്റ്റ്)',
    pa: 'ਟਿਕਾਣਾ ਮਿਲ ਗਿਆ! ਹੁਣ ਦੱਸੋ — ਕੀ ਤਕਲੀਫ਼ ਹੈ? (ਵੌਇਸ ਜਾਂ ਟੈਕਸਟ)',
  },
  reminder: {
    hi: 'Kripya batayein: jagah ka naam, zila, rajya (ya WhatsApp location 📎), mariz ki umra, aur kitne din se takleef hai.',
    en: 'Please share: place name/district/state (or WhatsApp location 📎), patient age, and duration of symptoms.',
    bn: 'অনুগ্রহ করে জানান: জায়গার নাম, জেলা, রাজ্য (বা WhatsApp location 📎), রোগীর বয়স, কতদিন ধরে সমস্যা।',
    ta: 'தயவுசெய்து தெரிவிக்கவும்: இடம், மாவட்டம், மாநிலம் (அல்லது WhatsApp location 📎), நோயாளி வயது, எத்தனை நாட்களாக.',
    te: 'దయచేసి చెప్పండి: ప్రాంతం, జిల్లా, రాష్ట్రం (లేదా WhatsApp location 📎), రోగి వయస్సు, ఎన్ని రోజులనుండి.',
    mr: 'कृपया सांगा: जागेचे नाव, जिल्हा, राज्य (किंवा WhatsApp location 📎), रुग्णाचे वय, किती दिवसांपासून.',
    gu: 'કૃપા કરીને જણાવો: જગ્યાનું નામ, જિલ્લો, રાજ્ય (અથવા WhatsApp location 📎), દર્દીની ઉંમર, કેટલા દિવસથી.',
    kn: 'ದಯವಿಟ್ಟು ತಿಳಿಸಿ: ಜಾಗದ ಹೆಸರು, ಜಿಲ್ಲೆ, ರಾಜ್ಯ (ಅಥವಾ WhatsApp location 📎), ರೋಗಿಯ ವಯಸ್ಸು, ಎಷ್ಟು ದಿನಗಳಿಂದ.',
    ml: 'ദയവായി അറിയിക്കൂ: സ്ഥലത്തിന്റെ പേര്, ജില്ല, സംസ്ഥാനം (അല്ലെങ്കിൽ WhatsApp location 📎), രോഗിയുടെ പ്രായം, എത്ര ദിവസമായി.',
    pa: 'ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ: ਜਗ੍ਹਾ ਦਾ ਨਾਮ, ਜ਼ਿਲ੍ਹਾ, ਰਾਜ (ਜਾਂ WhatsApp location 📎), ਮਰੀਜ਼ ਦੀ ਉਮਰ, ਕਿੰਨੇ ਦਿਨਾਂ ਤੋਂ.',
  },
  doctorInstruction: {
    hi: '📋 *यह summary doctor को दिखाएं जब आप पहुंचें:*',
    en: '📋 *Show this summary to the doctor when you arrive:*',
    bn: '📋 *ডাক্তারের কাছে পৌঁছে এই সারসংক্ষেপ দেখান:*',
    ta: '📋 *மருத்துவரிடம் போகும்போது இந்த சுருக்கத்தை காட்டவும்:*',
    te: '📋 *డాక్టర్ దగ్గరకు వెళ్ళినప్పుడు ఈ సారాంశం చూపించండి:*',
    mr: '📋 *डॉक्टरकडे पोहोचल्यावर हा सारांश दाखवा:*',
    gu: '📋 *ડૉક્ટર પાસે પહોંચ્યા ત્યારે આ સારાંશ બતાવો:*',
    kn: '📋 *ವೈದ್ಯರ ಬಳಿ ಹೋದಾಗ ಈ ಸಾರಾಂಶ ತೋರಿಸಿ:*',
    ml: '📋 *ഡോക്ടറെ കാണാൻ ചെല്ലുമ്പോൾ ഈ സംഗ്രഹം കാണിക്കൂ:*',
    pa: "📋 *ਡਾਕਟਰ ਕੋਲ ਪਹੁੰਚਣ 'ਤੇ ਇਹ ਸਾਰਾਂਸ਼ ਦਿਖਾਓ:*",
  },
  facilitiesHeader: {
    hi: '📍 *नज़दीकी स्वास्थ्य सुविधाएं (दूरी के अनुसार):*',
    en: '📍 *Nearby health facilities (sorted by distance):*',
    bn: '📍 *কাছের স্বাস্থ্য সুবিধা (দূরত্ব অনুযায়ী):*',
    ta: '📍 *அருகிலுள்ள சுகாதார வசதிகள் (தூரம் வரிசையில்):*',
    te: '📍 *సమీప ఆరోగ్య సౌకర్యాలు (దూరం వరుసలో):*',
    mr: '📍 *जवळच्या आरोग्य सुविधा (अंतरानुसार):*',
    gu: '📍 *નજીકની સ્વાસ્થ્ય સુવિધાઓ (અંતર પ્રમાણે):*',
    kn: '📍 *ಹತ್ತಿರದ ಆರೋಗ್ಯ ಸೌಲಭ್ಯಗಳು (ದೂರದ ಕ್ರಮದಲ್ಲಿ):*',
    ml: '📍 *അടുത്തുള്ള ആരോഗ്യ സൗകര്യങ്ങൾ (ദൂരം ക്രമത്തിൽ):*',
    pa: '📍 *ਨੇੜੇ ਦੀਆਂ ਸਿਹਤ ਸਹੂਲਤਾਂ (ਦੂਰੀ ਅਨੁਸਾਰ):*',
  },
  openNow: {
    hi: ' ✅ अभी खुला', en: ' ✅ Open now',
    bn: ' ✅ এখন খোলা', ta: ' ✅ இப்போது திறந்திருக்கிறது',
    te: ' ✅ ఇప్పుడు తెరిచి ఉంది', mr: ' ✅ आत्ता उघडे',
    gu: ' ✅ હવે ખુલ્લું', kn: ' ✅ ಈಗ ತೆರೆದಿದೆ',
    ml: ' ✅ ഇപ്പോൾ തുറന്നിരിക്കുന്നു', pa: ' ✅ ਹੁਣ ਖੁੱਲ੍ਹਾ',
  },
  closedNow: {
    hi: ' ❌ अभी बंद', en: ' ❌ Closed now',
    bn: ' ❌ এখন বন্ধ', ta: ' ❌ இப்போது மூடியிருக்கிறது',
    te: ' ❌ ఇప్పుడు మూసివేసి ఉంది', mr: ' ❌ आत्ता बंद',
    gu: ' ❌ હવે બંધ', kn: ' ❌ ಈಗ ಮುಚ್ಚಿದೆ',
    ml: ' ❌ ഇപ്പോൾ അടഞ്ഞിരിക്കുന്നു', pa: ' ❌ ਹੁਣ ਬੰਦ',
  },
  facilitiesFooter: {
    hi: '_Ayushman Bharat card saath le jaayein — sarkari hospital mein ilaj muft mein ho sakta hai._',
    en: '_Carry your Ayushman Bharat card — govt hospitals may offer free treatment._',
    bn: '_আয়ুষ্মান ভারত কার্ড সাথে নিন — সরকারি হাসপাতালে বিনামূল্যে চিকিৎসা হতে পারে।_',
    ta: '_ஆயுஷ்மான் பாரத் அட்டை எடுத்துச் செல்லவும் — அரசு மருத்துவமனையில் இலவச சிகிச்சை கிடைக்கலாம்._',
    te: '_ఆయుష్మాన్ భారత్ కార్డు తీసుకెళ్ళండి — ప్రభుత్వ ఆసుపత్రిలో ఉచిత చికిత్స అందవచ్చు._',
    mr: '_आयुष्मान भारत कार्ड सोबत घ्या — सरकारी रुग्णालयात मोफत उपचार होऊ शकतात._',
    gu: '_આયુષ્માન ભારત કાર્ડ સાથે લઈ જાઓ — સરકારી હૉસ્પિટલમાં મફત સારવાર મળી શકે છે._',
    kn: '_ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಕಾರ್ಡ್ ತನ್ನಿ — ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಉಚಿತ ಚಿಕಿತ್ಸೆ ಸಿಗಬಹುದು._',
    ml: '_ആയുഷ്മാൻ ഭാരത് കാർഡ് കൊണ്ടുപോകൂ — സർക്കാർ ആശുപത്രിയിൽ സൗജന്യ ചികിത്സ ലഭിച്ചേക്കാം._',
    pa: '_ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ ਕਾਰਡ ਨਾਲ ਲੈ ਜਾਓ — ਸਰਕਾਰੀ ਹਸਪਤਾਲ ਵਿੱਚ ਮੁਫ਼ਤ ਇਲਾਜ ਹੋ ਸਕਦਾ ਹੈ।_',
  },
};

/** Get a translated message — falls back to Hindi if lang not found */
function t(key, lang) {
  const msgs = M[key];
  if (!msgs) return '';
  return msgs[lang] || msgs.hi;
}

module.exports = { LANG_CONFIG, detectLang, getLangCode, t };
