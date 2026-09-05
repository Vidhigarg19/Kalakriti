import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, Sparkles, CheckCircle, Store, ArrowRight, ChevronLeft, RefreshCw, Pause, Play, X, AlertCircle, CloudOff, Share2, Volume2 } from 'lucide-react';
import { useApp, demoArtisans } from '@/lib/store';
import { getProviders, type AIResult } from '@/lib/ai-providers';
import { saveDraft, saveAudio, type LocalDraft } from '@/lib/offline-db';
import { fadeUp, staggerContainer, staggerItem, processingPulse, successBurst } from '@/lib/animations';
import type { WorkflowStep, Product, SyncState } from '@/types';

const LANGUAGES = [
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
  { code: 'garhwali', label: 'गढ़वाली' },
  { code: 'kumaoni', label: 'कुमाऊनी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'other', label: 'Other' },
];

const PROMPTS = [
  'What is this product?', 'What is it made from?', 'How did you make it?',
  'How long did it take?', 'What size is it?', 'What colors does it have?',
  'How should it be cared for?', 'What price feels fair to you?',
];

export function NewProductPage() {
  const { t, language, user, isOnline, addProduct, publishProduct, refreshDrafts } = useApp();
  const navigate = useNavigate();
  const providers = getProviders(true);

  const [step, setStep] = useState<WorkflowStep>('show');
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [enhancedUrl, setEnhancedUrl] = useState<string>('');
  const [showEnhanced, setShowEnhanced] = useState(true);
  const [enhancing, setEnhancing] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLang, setAudioLang] = useState('hi');
  const [micError, setMicError] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiError, setAiError] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishedId, setPublishedId] = useState('');
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [draftId, setDraftId] = useState(`draft-${Date.now()}`);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps: { key: WorkflowStep; label: string; icon: typeof Camera }[] = [
    { key: 'show', label: t('workflow.show'), icon: Camera },
    { key: 'enhance', label: t('workflow.enhance.original'), icon: Sparkles },
    { key: 'speak', label: t('workflow.speak'), icon: Mic },
    { key: 'ai', label: t('workflow.ai'), icon: Sparkles },
    { key: 'confirm', label: t('workflow.confirm'), icon: CheckCircle },
    { key: 'sell', label: t('workflow.sell'), icon: Store },
  ];

  // Camera
  const startCamera = useCallback(async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setCameraError(language === 'hi' ? 'कैमरा अनुमति नहीं मिली।' : 'Camera permission denied.');
    }
  }, [language]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setImageDataUrl(dataUrl);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageDataUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Microphone
  const startRecording = useCallback(async () => {
    setMicError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setPaused(false);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      setMicError(language === 'hi' ? 'माइक्रोफोन अनुमति नहीं मिली।' : 'Microphone permission denied.');
    }
  }, [language]);

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setPaused(false);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Save draft locally
  const saveLocalDraft = useCallback(async (partialData?: Partial<LocalDraft>) => {
    if (!user) return;
    const draft: LocalDraft = {
      id: draftId,
      artisanId: user.id,
      step,
      syncState: (isOnline ? 'synced' : 'local-only') as SyncState,
      imageDataUrl,
      audioDuration: duration,
      audioLanguage: audioLang,
      partialData: partialData || undefined,
      revision: 1,
      lastClientOperationId: `op-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...partialData,
    };
    try {
      await saveDraft(draft);
      if (audioBlob) await saveAudio(draftId, audioBlob);
      refreshDrafts();
    } catch {}
  }, [user, draftId, step, isOnline, imageDataUrl, duration, audioLang, audioBlob, refreshDrafts]);

  // AI Processing
  const runAI = async () => {
    if (!audioBlob) return;
    setAiProcessing(true);
    setAiError('');
    try {
      const transcription = await providers.speech.transcribe(audioBlob, audioLang);
      const facts = await providers.listing.extractProductFacts({ transcript: transcription.transcript, language: audioLang, imageDataUrl });
      const listing = await providers.listing.generateListing(facts);
      const pricing = await providers.listing.suggestPrice({ category: facts.category, craftType: facts.craftType, material: facts.materials.join(', '), dimensions: facts.dimensions });
      const uncertainFields = Object.entries(facts).filter(([k, _v]) => k === 'dimensions' || k === 'stockQuantity').map(([k]) => k);
      const result: AIResult = {
        productFacts: facts,
        listing,
        pricing,
        uncertainFields,
        confidence: transcription.confidence,
        fieldConfidence: {
          category: 'confirmed', craftType: 'confirmed', material: 'confirmed',
          colors: 'confirmed', dimensions: 'needs_confirmation',
          priceMin: 'confirmed', priceMax: 'confirmed',
        },
      };
      setAiResult(result);
      setStep('confirm');
      saveLocalDraft({ partialData: { titleEn: listing.titleEn, titleHi: listing.titleHi, priceMin: pricing.minimumPrice || 0, priceMax: pricing.maximumPrice || 0 } });
    } catch {
      setAiError(language === 'hi' ? 'AI प्रसंस्करण विफल। पुनः प्रयास करें।' : 'AI processing failed. Please retry.');
    } finally {
      setAiProcessing(false);
    }
  };

  // Enhance image
  const enhanceImage = async () => {
    if (!imageDataUrl) return;
    setEnhancing(true);
    try {
      const result = await providers.image.enhance(imageDataUrl);
      setEnhancedUrl(result.enhancedUrl);
      setStep('speak');
    } catch {
      setEnhancedUrl(imageDataUrl);
      setStep('speak');
    } finally {
      setEnhancing(false);
    }
  };

  // Publish
  const handlePublish = async () => {
    if (!aiResult || !user) return;
    if (!isOnline) {
      saveLocalDraft();
      return;
    }
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const artisan = demoArtisans.find((a) => a.id === user.artisanId);
    const id = `product-${Date.now()}`;
    const product: Product = {
      id, artisanId: user.artisanId || user.id, status: 'published', revision: 1,
      titleEn: aiResult.listing.titleEn, titleHi: aiResult.listing.titleHi,
      descriptionEn: aiResult.listing.descriptionEn, descriptionHi: aiResult.listing.descriptionHi,
      category: aiResult.productFacts.category, craftType: aiResult.productFacts.craftType,
      material: aiResult.productFacts.materials.join(', '), colors: aiResult.productFacts.colors,
      dimensions: aiResult.productFacts.dimensions, weight: aiResult.productFacts.weight,
      technique: aiResult.productFacts.technique, originRegion: artisan?.location || aiResult.productFacts.originRegion || 'India',
      careInstructionsEn: aiResult.listing.careInstructionsEn, careInstructionsHi: aiResult.listing.careInstructionsHi,
      productionTime: aiResult.productFacts.productionTime,
      stockQuantity: aiResult.productFacts.stockQuantity,
      priceMin: aiResult.pricing.minimumPrice || 0, priceMax: aiResult.pricing.maximumPrice || 0,
      suggestedPrice: aiResult.pricing.suggestedPrice, currency: 'INR',
      storyEn: aiResult.productFacts.artisanStory, storyHi: aiResult.productFacts.artisanStory,
      imageUrl: imageDataUrl, originalImageUrl: imageDataUrl, enhancedImageUrl: enhancedUrl || imageDataUrl,
      voiceLanguage: audioLang, sourceTranscript: aiResult.productFacts.artisanStory,
      aiConfidence: aiResult.confidence, uncertainFields: aiResult.uncertainFields,
      fieldConfidence: aiResult.fieldConfidence,
      publishedAt: new Date().toISOString(), createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), updatedBy: user.id, isDemo: true,
    };
    addProduct(product);
    publishProduct(id);
    setPublishedId(id);
    setPublished(true);
    setStep('sell');
    setPublishing(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/catalog/${publishedId}`;
    if (navigator.share) {
      try { await navigator.share({ title: aiResult?.listing.titleEn || 'My product', url }); } catch {}
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  // Edit field
  const startEdit = (field: string, value: string) => {
    setEditMode(field);
    setEditValue(value);
  };

  const saveEdit = (field: string) => {
    if (!aiResult) return;
    if (field.startsWith('listing.')) {
      const key = field.split('.')[1];
      setAiResult({ ...aiResult, listing: { ...aiResult.listing, [key]: editValue } });
    } else if (field.startsWith('pricing.')) {
      const key = field.split('.')[1];
      setAiResult({ ...aiResult, pricing: { ...aiResult.pricing, [key]: Number(editValue) } });
    } else if (field.startsWith('facts.')) {
      const key = field.split('.')[1];
      setAiResult({ ...aiResult, productFacts: { ...aiResult.productFacts, [key]: editValue } });
    }
    setEditMode(null);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stopCamera]);

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Step Progress */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar">
          {steps.map((s, i) => {
            const activeIndex = steps.findIndex((x) => x.key === step);
            const isActive = i === activeIndex;
            const isDone = i < activeIndex;
            return (
              <div key={s.key} className="flex items-center gap-2 shrink-0">
                <div className={`flex flex-col items-center gap-1 ${isActive ? 'text-terracotta' : isDone ? 'text-olive-light' : 'text-taupe/40'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-terracotta bg-terracotta/10' : isDone ? 'border-olive-light bg-olive/10' : 'border-walnut-light'}`}>
                    <s.icon size={18} />
                  </div>
                  <span className="text-xs">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-6 h-0.5 ${isDone ? 'bg-olive-light' : 'bg-walnut-light'}`} />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* SHOW */}
          {step === 'show' && (
            <motion.div key="show" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="card-surface p-6">
                <h2 className="font-serif text-2xl text-ivory mb-1">{t('workflow.show.title')}</h2>
                <p className="text-taupe text-sm mb-4">{t('workflow.show.instruction')}</p>
                <p className="devanagari text-taupe text-sm mb-6">{t('workflow.show.instructionHi')}</p>

                {!imageDataUrl ? (
                  <div className="space-y-4">
                    <div className="relative bg-walnut-dark rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
                      <canvas ref={canvasRef} className="hidden" />
                      {!streamRef.current && (
                        <div className="text-center">
                          <Camera className="text-taupe/40 mx-auto mb-3" size={48} />
                          <p className="text-taupe text-sm">{language === 'hi' ? 'कैमरा शुरू करने के लिए नीचे टैप करें' : 'Tap below to start camera'}</p>
                        </div>
                      )}
                    </div>
                    {cameraError && (
                      <div className="flex items-center gap-2 text-terracotta-light text-sm bg-terracotta-dark/20 p-3 rounded-lg">
                        <AlertCircle size={16} /> {cameraError}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <button onClick={startCamera} className="btn-primary"><Camera size={18} /> {t('workflow.show.capture')}</button>
                      <label className="btn-secondary cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
                        {t('workflow.show.gallery')}
                      </label>
                    </div>
                    {streamRef.current && (
                      <button onClick={capturePhoto} className="btn-primary w-full text-lg py-4">
                        <Camera size={20} /> {t('workflow.show.capture')}
                      </button>
                    )}
                    {!isOnline && (
                      <div className="flex items-center gap-2 text-taupe text-sm bg-walnut-light/30 p-3 rounded-lg">
                        <CloudOff size={16} /> {t('workflow.show.offlineSaved')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img src={imageDataUrl} alt="Captured product" className="w-full rounded-xl max-h-96 object-contain bg-walnut-dark" />
                    <div className="flex gap-3">
                      <button onClick={() => { setImageDataUrl(''); startCamera(); }} className="btn-secondary">
                        <RefreshCw size={16} /> {t('workflow.show.retake')}
                      </button>
                      <button onClick={enhanceImage} className="btn-primary" disabled={enhancing}>
                        {enhancing ? (
                          <><Sparkles size={16} className="animate-spin" /> {t('workflow.enhance.title')}…</>
                        ) : (
                          <>{t('workflow.enhance.next')} <ArrowRight size={16} /></>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ENHANCE */}
          {step === 'enhance' && (
            <motion.div key="enhance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="card-surface p-6">
                {enhancing ? (
                  <div className="text-center py-12">
                    <motion.div variants={processingPulse} initial="hidden" animate="visible" className="w-20 h-20 rounded-full bg-terracotta/20 flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={32} className="text-terracotta" />
                    </motion.div>
                    <h2 className="font-serif text-xl text-ivory mb-2">{t('workflow.enhance.title')}</h2>
                    <p className="text-taupe text-sm">{t('workflow.enhance.subtitle')}</p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-serif text-2xl text-ivory mb-4">{t('workflow.enhance.title')}</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-taupe mb-2">{t('workflow.enhance.original')}</p>
                        <img src={imageDataUrl} alt="Original" className="w-full rounded-xl max-h-72 object-contain bg-walnut-dark" />
                      </div>
                      <div>
                        <p className="text-xs text-terracotta mb-2">{t('workflow.enhance.enhanced')}</p>
                        <img src={enhancedUrl || imageDataUrl} alt="Enhanced" className="w-full rounded-xl max-h-72 object-contain bg-walnut-dark" />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setStep('show')} className="btn-secondary">
                        <ChevronLeft size={16} /> {t('common.back')}
                      </button>
                      <button onClick={() => setStep('speak')} className="btn-primary">
                        {t('workflow.enhance.next')} <ArrowRight size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* SPEAK */}
          {step === 'speak' && (
            <motion.div key="speak" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="card-surface p-6">
                <h2 className="font-serif text-2xl text-ivory mb-2">{t('workflow.speak.title')}</h2>
                <p className="text-taupe text-sm mb-6">{t('workflow.speak.instruction')}</p>

                {/* Prompts */}
                <div className="bg-walnut-dark rounded-xl p-4 mb-6 space-y-1">
                  {PROMPTS.map((p, i) => (
                    <p key={i} className="text-sm text-taupe">• {p}</p>
                  ))}
                </div>

                {/* Language selector */}
                <label className="text-sm text-taupe mb-1 block">{t('workflow.speak.language')}</label>
                <select value={audioLang} onChange={(e) => setAudioLang(e.target.value)} className="input-field mb-4">
                  {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>

                {/* Recording UI */}
                <div className="bg-walnut-dark rounded-xl p-6 text-center">
                  {micError && (
                    <div className="flex items-center gap-2 text-terracotta-light text-sm mb-4 justify-center">
                      <AlertCircle size={16} /> {micError}
                    </div>
                  )}
                  {!audioBlob && !recording && (
                    <button onClick={startRecording} className="w-20 h-20 rounded-full bg-terracotta flex items-center justify-center mx-auto hover:bg-terracotta-dark transition-colors">
                      <Mic size={32} className="text-ivory" />
                    </button>
                  )}
                  {recording && (
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-4 h-12">
                        {[...Array(30)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-terracotta rounded-full"
                            animate={{ height: [8, 8 + Math.random() * 24, 8] }}
                            transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                          />
                        ))}
                      </div>
                      <p className="text-ivory text-lg font-mono">{formatDuration(duration)}</p>
                      <div className="flex justify-center gap-3 mt-4">
                        {!paused ? (
                          <button onClick={pauseRecording} className="btn-secondary"><Pause size={16} /> {t('workflow.speak.pause')}</button>
                        ) : (
                          <button onClick={resumeRecording} className="btn-secondary"><Play size={16} /> {t('workflow.speak.resume')}</button>
                        )}
                        <button onClick={stopRecording} className="btn-primary"><X size={16} /> {t('workflow.speak.stop')}</button>
                      </div>
                    </div>
                  )}
                  {audioBlob && !recording && (
                    <div>
                      <div className="w-16 h-16 rounded-full bg-olive/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-olive-light" />
                      </div>
                      <p className="text-ivory mb-2">{t('workflow.speak.duration')}: {formatDuration(duration)}</p>
                      <audio src={audioUrl} controls className="w-full mb-4" />
                      <div className="flex gap-3 justify-center">
                        <button onClick={() => { setAudioBlob(null); setDuration(0); startRecording(); }} className="btn-secondary">
                          <RefreshCw size={16} /> {t('workflow.speak.rerecord')}
                        </button>
                        <button onClick={runAI} className="btn-primary" disabled={aiProcessing}>
                          {t('workflow.speak.next')} <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                  {!isOnline && !audioBlob && (
                    <p className="text-taupe text-sm mt-4">{t('workflow.speak.offlineSaved')}</p>
                  )}
                </div>
                <button onClick={() => setStep('enhance')} className="flex items-center gap-1 text-taupe hover:text-ivory text-sm mt-4">
                  <ChevronLeft size={14} /> {t('common.back')}
                </button>
              </div>
            </motion.div>
          )}

          {/* AI UNDERSTANDS */}
          {step === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="card-surface p-6">
                {aiProcessing ? (
                  <div className="text-center py-12">
                    <motion.div variants={processingPulse} initial="hidden" animate="visible" className="w-20 h-20 rounded-full bg-terracotta/20 flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={32} className="text-terracotta" />
                    </motion.div>
                    <h2 className="font-serif text-xl text-ivory mb-2">{t('workflow.ai.title')}</h2>
                    <p className="text-taupe text-sm">{t('workflow.ai.subtitle')}</p>
                  </div>
                ) : (
                  <>
                    {aiError && (
                      <div className="text-center py-8">
                        <AlertCircle className="text-terracotta mx-auto mb-3" size={32} />
                        <p className="text-terracotta-light mb-4">{aiError}</p>
                        <button onClick={runAI} className="btn-primary"><RefreshCw size={16} /> {t('workflow.ai.retry')}</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* CONFIRM */}
          {step === 'confirm' && aiResult && (
            <motion.div key="confirm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="space-y-4">
                <div className="card-surface p-6">
                  <h2 className="font-serif text-2xl text-ivory mb-1">{t('workflow.confirm.title')}</h2>
                  <p className="text-taupe text-sm mb-4">{t('workflow.confirm.subtitle')}</p>

                  {/* Image toggle */}
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => setShowEnhanced(false)} className={`px-3 py-1 rounded-lg text-sm ${!showEnhanced ? 'bg-terracotta text-ivory' : 'bg-walnut text-taupe'}`}>{t('product.originalToggle')}</button>
                    <button onClick={() => setShowEnhanced(true)} className={`px-3 py-1 rounded-lg text-sm ${showEnhanced ? 'bg-terracotta text-ivory' : 'bg-walnut text-taupe'}`}>{t('product.enhancedToggle')}</button>
                  </div>
                  <img src={showEnhanced ? (enhancedUrl || imageDataUrl) : imageDataUrl} alt="Product" className="w-full max-h-64 object-contain rounded-xl bg-walnut-dark mb-4" />

                  {/* Editable fields */}
                  <div className="space-y-3">
                    {[
                      { field: 'listing.titleEn', label: t('workflow.confirm.titleEn'), value: aiResult.listing.titleEn },
                      { field: 'listing.titleHi', label: t('workflow.confirm.titleHi'), value: aiResult.listing.titleHi, devanagari: true },
                      { field: 'listing.descriptionEn', label: t('workflow.confirm.descEn'), value: aiResult.listing.descriptionEn, textarea: true },
                      { field: 'listing.descriptionHi', label: t('workflow.confirm.descHi'), value: aiResult.listing.descriptionHi, devanagari: true, textarea: true },
                      { field: 'facts.materials', label: t('workflow.confirm.materials'), value: aiResult.productFacts.materials.join(', ') },
                      { field: 'facts.colors', label: t('workflow.confirm.colors'), value: aiResult.productFacts.colors.join(', ') },
                      { field: 'facts.technique', label: t('workflow.confirm.technique'), value: aiResult.productFacts.technique },
                      { field: 'facts.dimensions', label: t('workflow.confirm.dimensions'), value: aiResult.productFacts.dimensions },
                      { field: 'facts.originRegion', label: t('workflow.confirm.origin'), value: aiResult.productFacts.originRegion },
                      { field: 'facts.productionTime', label: t('workflow.confirm.makingTime'), value: aiResult.productFacts.productionTime },
                      { field: 'facts.careInstructions', label: t('workflow.confirm.care'), value: aiResult.productFacts.careInstructions },
                      { field: 'facts.stockQuantity', label: t('workflow.confirm.stock'), value: String(aiResult.productFacts.stockQuantity || 0) },
                      { field: 'pricing.minimumPrice', label: t('workflow.confirm.priceMin'), value: String(aiResult.pricing.minimumPrice || 0) },
                      { field: 'pricing.maximumPrice', label: t('workflow.confirm.priceMax'), value: String(aiResult.pricing.maximumPrice || 0) },
                    ].map((item) => (
                      <div key={item.field}>
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-taupe">{item.label}</label>
                          {aiResult.uncertainFields.includes(item.field.split('.')[1] || '') && (
                            <span className="text-xs text-terracotta-light">{t('workflow.ai.uncertainFields')}</span>
                          )}
                        </div>
                        {editMode === item.field ? (
                          <div className="flex gap-2 mt-1">
                            {item.textarea ? (
                              <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} className={`input-field resize-none ${item.devanagari ? 'devanagari' : ''}`} rows={2} autoFocus />
                            ) : (
                              <input value={editValue} onChange={(e) => setEditValue(e.target.value)} className={`input-field ${item.devanagari ? 'devanagari' : ''}`} autoFocus />
                            )}
                            <button onClick={() => saveEdit(item.field)} className="btn-primary"><CheckCircle size={16} /></button>
                            <button onClick={() => setEditMode(null)} className="btn-secondary"><X size={16} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between mt-1 group">
                            <p className={`text-sm text-ivory ${item.devanagari ? 'devanagari' : ''}`}>{item.value}</p>
                            <button onClick={() => startEdit(item.field, item.value)} className="text-xs text-taupe hover:text-terracotta opacity-0 group-hover:opacity-100 transition-opacity">
                              {t('workflow.confirm.typeCorrect')}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Audio playback */}
                  {audioUrl && (
                    <div className="mt-4 flex items-center gap-3 p-3 bg-walnut-dark rounded-xl">
                      <Volume2 size={18} className="text-terracotta" />
                      <audio src={audioUrl} controls className="flex-1" />
                    </div>
                  )}

                  {/* Confidence */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-taupe">{t('workflow.ai.confidence')}:</span>
                    <div className="flex-1 h-2 bg-walnut-dark rounded-full overflow-hidden">
                      <div className="h-full bg-olive rounded-full" style={{ width: `${aiResult.confidence * 100}%` }} />
                    </div>
                    <span className="text-sm text-ivory">{Math.round(aiResult.confidence * 100)}%</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('speak')} className="btn-secondary">
                    <ChevronLeft size={16} /> {t('common.back')}
                  </button>
                  <button onClick={handlePublish} className="btn-primary flex-1" disabled={publishing}>
                    {publishing ? (
                      <><RefreshCw size={16} className="animate-spin" /> {t('workflow.sell.publishing')}</>
                    ) : !isOnline ? (
                      <>{t('workflow.sell.offlineQueued')}</>
                    ) : (
                      <><Store size={16} /> {t('workflow.confirm.publish')}</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SELL */}
          {step === 'sell' && published && (
            <motion.div key="sell" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="card-surface p-8 text-center">
                <motion.div variants={successBurst} initial="hidden" animate="visible" className="w-20 h-20 rounded-full bg-olive/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-olive-light" />
                </motion.div>
                <h2 className="font-serif text-3xl text-ivory mb-2">{t('workflow.sell.title')}</h2>
                <p className="text-taupe mb-6">{t('workflow.sell.subtitle')}</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button onClick={() => navigate(`/catalog/${publishedId}`)} className="btn-primary">
                    {t('workflow.sell.viewInCatalog')} <ArrowRight size={16} />
                  </button>
                  <button onClick={handleShare} className="btn-secondary">
                    <Share2 size={16} /> {t('workflow.sell.share')}
                  </button>
                  <button onClick={() => { setStep('show'); setImageDataUrl(''); setAudioBlob(null); setAiResult(null); setPublished(false); setDraftId(`draft-${Date.now()}`); }} className="btn-secondary">
                    {t('workflow.sell.createAnother')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
