import type { Language } from './translations'

export type DiseaseCopyKey =
  | 'pageKicker'
  | 'pageTitle'
  | 'pageSubtitle'
  | 'modeGemini'
  | 'modeYolo'
  | 'geminiToolTitle'
  | 'geminiToolDesc'
  | 'geminiToolPlaceholder'
  | 'findConditionBtn'
  | 'quickTestTitle'
  | 'uploadHeader'
  | 'targetCrop'
  | 'photoLabel'
  | 'dropzoneText'
  | 'dropzoneSub'
  | 'replaceBtn'
  | 'removeBtn'
  | 'runDiagnosisBtn'
  | 'analyzingText'
  | 'analyzingSub'
  | 'advisoryHeader'
  | 'healthyTitle'
  | 'pathogenDetected'
  | 'primaryDiagnosis'
  | 'confidenceLabel'
  | 'probabilitiesTitle'
  | 'symptomsTitle'
  | 'causeTitle'
  | 'chemicalTitle'
  | 'organicTitle'
  | 'recoveryTitle'
  | 'stageTitle'
  | 'preventionTitle'
  | 'readAloudBtn'
  | 'speakingBtn'
  | 'emptyHeader'
  | 'emptyDesc'
  | 'historyTitle'
  | 'clearHistoryBtn'
  | 'noHistoryText'

export const diseaseTranslations: Record<Language, Record<DiseaseCopyKey, string>> = {
  en: {
    pageKicker: 'AI PLANT PATHOLOGY & CROP DIAGNOSIS',
    pageTitle: 'Crop Condition & Disease Diagnostic Tools',
    pageSubtitle: 'Find crop condition instantly using Google Gemini Multimodal Vision & Tools and PlantDiseaseDetection YOLO.',
    modeGemini: 'Mode: Gemini 3.6 Flash Vision',
    modeYolo: 'Mode: YOLO Detector',
    geminiToolTitle: 'Find Condition with Gemini Agronomic Tools:',
    geminiToolDesc: 'Describe any leaf spots, curling, pest damage, yellowing, or nutrient symptoms to find exact condition and treatment:',
    geminiToolPlaceholder: 'e.g. Tomato leaves turning yellow with brown target rings, flower drop...',
    findConditionBtn: 'Find Condition',
    quickTestTitle: '⚡ Quick Test with Verified Reference Leaves:',
    uploadHeader: 'Leaf Image Scanner',
    targetCrop: 'Target Crop',
    photoLabel: 'Upload / Camera Leaf Photo',
    dropzoneText: 'Tap to select leaf photo or take picture',
    dropzoneSub: 'Supports JPG, PNG, WEBP (Max 10MB)',
    replaceBtn: 'Replace',
    removeBtn: 'Remove',
    runDiagnosisBtn: 'Run AI Leaf Diagnosis',
    analyzingText: 'AI Diagnostic Tools Analyzing...',
    analyzingSub: 'Inspecting cellular lesion patterns, nutrient indicators, and pathology markers',
    advisoryHeader: 'Diagnostic Advisory',
    healthyTitle: 'Condition: Healthy Crop & Vigorous Foliage!',
    pathogenDetected: 'Condition Detected — Action Recommended',
    primaryDiagnosis: 'Primary Diagnosis',
    confidenceLabel: 'Model Confidence',
    probabilitiesTitle: '📊 Multi-Class Probabilities',
    symptomsTitle: 'Visual Diagnostic Symptoms',
    causeTitle: 'Underlying Cause',
    chemicalTitle: 'Chemical Fungicide / Spray',
    organicTitle: 'Organic / Bio Remedy',
    recoveryTitle: 'Recovery Timeline',
    stageTitle: 'Vulnerable Stage',
    preventionTitle: '🛡️ Preventive Farm Care',
    readAloudBtn: '🔊 Read Condition Diagnosis Aloud',
    speakingBtn: 'Speaking Diagnosis...',
    emptyHeader: 'No Active Leaf Diagnosis',
    emptyDesc: 'Upload a plant leaf photo or describe symptoms in the Gemini tool above.',
    historyTitle: 'Diagnostic Check History',
    clearHistoryBtn: 'Clear History',
    noHistoryText: 'No previous disease checks recorded.',
  },
  hi: {
    pageKicker: 'एआई पादप रोग विज्ञान एवं फसल निदान',
    pageTitle: 'फसल स्वास्थ्य एवं रोग निदान उपकरण',
    pageSubtitle: 'गूगल जेमिनी मल्टीमॉडल विज़न और वाईओएलओ मॉडल से तुरंत सटीक फसल स्थिति और उपचार जानें।',
    modeGemini: 'मोड: जेमिनी विज़न',
    modeYolo: 'मोड: वाईओएलओ डिटेक्टर',
    geminiToolTitle: 'जेमिनी एग्रोनॉमिक टूल से फसल की स्थिति जानें:',
    geminiToolDesc: 'पत्तियों पर धब्बे, मुड़ना, कीट का प्रकोप या पीलापन लिखें और तुरंत सटीक दवा व उपचार पाएं:',
    geminiToolPlaceholder: 'उदा. टमाटर की पत्तियों पर भूरे छल्लेदार धब्बे, फूल गिर रहे हैं...',
    findConditionBtn: 'स्थिति पहचानें',
    quickTestTitle: '⚡ प्रमाणित पत्तियों के नमूनों से तुरंत जांचें:',
    uploadHeader: 'पत्ती फोटो स्कैनर',
    targetCrop: 'फसल का चयन',
    photoLabel: 'पत्ती की फोटो अपलोड करें या खींचें',
    dropzoneText: 'पत्ती की फोटो चुनें या कैमरा से लें',
    dropzoneSub: 'JPG, PNG, WEBP का समर्थन (अधिकतम 10MB)',
    replaceBtn: 'बदलें',
    removeBtn: 'हटाएं',
    runDiagnosisBtn: 'एआई फसल निदान शुरू करें',
    analyzingText: 'एआई पत्ती का विश्लेषण कर रहा है...',
    analyzingSub: 'रोग के धब्बों, पोषक तत्वों की कमी और सूक्ष्मजीवों की जांच की जा रही है',
    advisoryHeader: 'रोग निदान सलाह',
    healthyTitle: 'स्थिति: फसल पूरी तरह स्वस्थ और हरी-भरी है!',
    pathogenDetected: 'रोग के लक्षण मिले — तुरंत उपचार करें',
    primaryDiagnosis: 'पहचाना गया मुख्य रोग',
    confidenceLabel: 'निदान सटीकता',
    probabilitiesTitle: '📊 बहु-श्रेणी संभावना स्कोर',
    symptomsTitle: 'रोग के प्रमुख लक्षण',
    causeTitle: 'रोग का मुख्य कारण',
    chemicalTitle: 'रासायनिक कीटनाशक / स्प्रे (सटीक मात्रा)',
    organicTitle: 'जैविक / देसी उपचार',
    recoveryTitle: 'ठीक होने का समय',
    stageTitle: 'प्रभावित फसल अवस्था',
    preventionTitle: '🛡️ फसल सुरक्षा व बचाव के उपाय',
    readAloudBtn: '🔊 निदान बोलकर सुनें',
    speakingBtn: 'निदान सुना रहा है...',
    emptyHeader: 'कोई सक्रिय निदान नहीं है',
    emptyDesc: 'पत्ती की फोटो अपलोड करें या ऊपर जेमिनी टूल में लक्षण लिखें।',
    historyTitle: 'निदान जांच इतिहास',
    clearHistoryBtn: 'इतिहास साफ करें',
    noHistoryText: 'कोई पुराना रिकॉर्ड नहीं मिला।',
  },
  te: {
    pageKicker: 'AI మొక్కల వ్యాధి నిర్ధారణ & సంరక్షణ',
    pageTitle: 'పంట పరిస్థితి & తెగుళ్ల నిర్ధారణ టూల్స్',
    pageSubtitle: 'గూగుల్ జెమిని మల్టీమోడల్ విజన్ మరియు YOLO మోడల్స్ ద్వారా పంట వ్యాధులను వెంటనే గుర్తించి ఖచ్చితమైన మందులు తెలుసుకోండి.',
    modeGemini: 'మోడ్: జెమిని విజన్',
    modeYolo: 'మోడ్: YOLO డిటెక్టర్',
    geminiToolTitle: 'జెమిని అసిస్టెంట్ ద్వారా పంట పరిస్థితిని తెలుసుకోండి:',
    geminiToolDesc: 'ఆకులపై మచ్చలు, ముడుత, పురుగుల దాడి లేదా పసుపు రంగు లక్షణాలను రాసి సరైన నివారణ మందులను తెలుసుకోండి:',
    geminiToolPlaceholder: 'ఉదా. టమాటా ఆకులపై నల్లని గుండ్రటి మచ్చలు, పూత రాలిపోతోంది...',
    findConditionBtn: 'పరిస్థితిని కనుగొనండి',
    quickTestTitle: '⚡ ధృవీకరించబడిన ఆకు నమూనాలతో వెంటనే పరీక్షించండి:',
    uploadHeader: 'ఆకు ఫోటో స్కానర్',
    targetCrop: 'ఎంచుకున్న పంట',
    photoLabel: 'ఆకు ఫోటోను ఎంచుకోండి లేదా కెమెరాతో తీయండి',
    dropzoneText: 'ఆకు ఫోటోను ఎంచుకోవడానికి నొక్కండి',
    dropzoneSub: 'JPG, PNG, WEBP ఫార్మాట్లు (గరిష్టంగా 10MB)',
    replaceBtn: 'మార్చండి',
    removeBtn: 'తొలగించండి',
    runDiagnosisBtn: 'AI వ్యాధి నిర్ధారణ చేయండి',
    analyzingText: 'AI ఆకును విశ్లేషిస్తోంది...',
    analyzingSub: 'వ్యాధి మచ్చలు, తెగుళ్ల సంకేతాలు మరియు పోషక లోపాలను పరిశీలిస్తోంది',
    advisoryHeader: 'వ్యాధి నిర్ధారణ & నివారణ సలహా',
    healthyTitle: 'పరిస్థితి: పంట పూర్తిగా ఆరోగ్యంగా మరియు బలంగా ఉంది!',
    pathogenDetected: 'తెగులు గుర్తించబడింది — వెంటనే నివారణ చర్యలు తీసుకోండి',
    primaryDiagnosis: 'గుర్తించిన ప్రధాన వ్యాధి',
    confidenceLabel: 'నిర్ధారణ ఖచ్చితత్వం',
    probabilitiesTitle: '📊 బహుళ-వ్యాధి సంభావ్యత',
    symptomsTitle: 'ప్రధాన వ్యాధి లక్షణాలు',
    causeTitle: 'వ్యాధికి కారణం',
    chemicalTitle: 'రసాయన మందు / పిచికారీ (మోతాదుతో)',
    organicTitle: 'సేంద్రీయ / జీవ నివారణ పద్ధతి',
    recoveryTitle: 'కోలుకునే సమయం',
    stageTitle: 'ప్రభావిత పంట దశ',
    preventionTitle: '🛡️ ముందస్తు రక్షణ & యాజమాన్య పద్ధతులు',
    readAloudBtn: '🔊 వ్యాధి నిర్ధారణను వినండి',
    speakingBtn: 'వివరిస్తోంది...',
    emptyHeader: 'ఎటువంటి వ్యాధి నిర్ధారణ లేదు',
    emptyDesc: 'ఆకు ఫోటోను అప్‌లోడ్ చేయండి లేదా పై జెమిని బాక్స్‌లో లక్షణాలను రాయండి.',
    historyTitle: 'వ్యాధి పరీక్ష చరిత్ర',
    clearHistoryBtn: 'చరిత్రను తొలగించండి',
    noHistoryText: 'గత పరీక్షల రికార్డులు ఏవీ లేవు.',
  },
}

export function getDiseaseCopy(lang: Language, key: DiseaseCopyKey): string {
  return diseaseTranslations[lang]?.[key] || diseaseTranslations.en[key]
}

