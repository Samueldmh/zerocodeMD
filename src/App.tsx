import React, { useState } from 'react';
import { Stethoscope, GraduationCap, Github, Info, Flame, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUpload } from './components/FileUpload';
import { QuizComponent } from './components/QuizComponent';
import { ResultSummary } from './components/ResultSummary';
import { generateQuizFromContent, generateQuizFromText } from './services/gemini';
import { Quiz, AppState, QuizResult } from './types';

export default function App() {
  const [state, setState] = useState<AppState>('IDLE');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<QuizResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatingConfig, setGeneratingConfig] = useState<{count: number, type: 'OBJECTIVE' | 'THEORY'} | null>(null);

  const handleUpload = async (
    content: { mimeType: string; data: string }[] | string, 
    fileName: string, 
    isText?: boolean, 
    questionCount: number = 25,
    quizType: 'OBJECTIVE' | 'THEORY' = 'OBJECTIVE'
  ) => {
    setGeneratingConfig({ count: questionCount, type: quizType });
    setState('GENERATING');
    setError(null);
    try {
      let result: { quiz: Quiz; usage: any };
      if (isText && typeof content === 'string') {
        result = await generateQuizFromText(content, fileName, questionCount, quizType);
      } else if (Array.isArray(content)) {
        result = await generateQuizFromContent(content, fileName, questionCount, quizType);
      } else {
        throw new Error("Invalid content format");
      }
      
      setQuiz(result.quiz);
      setState('QUIZ');
    } catch (err: any) {
      console.error("Generation Error:", err);
      
      let errorMessage = 'Failed to generate quiz. Please ensure the file is readable and try again.';
      
      if (err.message?.includes('safety')) {
        errorMessage = 'The AI declined to process this content due to safety filters. Please ensure the material is strictly medical/academic.';
      } else if (err.message?.includes('quota') || err.message?.includes('429')) {
        errorMessage = 'API rate limit or daily quota exceeded. Please try uploading a smaller file, requesting fewer questions, or wait a few minutes before trying again.';
      } else if (err.message?.includes('Invalid content')) {
        errorMessage = 'The file format was not recognized. Please try a different file.';
      } else if (err.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setError(errorMessage);
      setState('IDLE');
    }
  };

  const handleQuizComplete = (quizResults: QuizResult[]) => {
    setResults(quizResults);
    setState('RESULTS');
  };

  const handleRestart = () => {
    setQuiz(null);
    setResults(null);
    setState('IDLE');
  };

  return (
    <div className="min-h-screen bg-quizard-bg font-sans text-white selection:bg-quizard-accent selection:text-quizard-bg">
      {/* Header */}
      <header className="bg-quizard-bg/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleRestart}>
            <div className="w-12 h-12 bg-quizard-accent rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)] group-hover:scale-110 transition-transform duration-300">
              <Stethoscope className="text-quizard-bg w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none text-white">zerocode<span className="text-quizard-accent">md</span></h1>
              <p className="text-[10px] font-black text-quizard-accent/60 uppercase tracking-[0.2em] mt-1">Clinical Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-bold text-white/60 hover:text-quizard-accent transition-colors">Methodology</a>
              <a href="#" className="text-sm font-bold text-white/60 hover:text-quizard-accent transition-colors">Standards</a>
              <button className="px-6 py-2.5 bg-white/5 text-white rounded-2xl text-sm font-black hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95">
                Support
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatePresence mode="wait">
          {state === 'IDLE' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="mb-16">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-quizard-accent/10 text-quizard-accent rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-quizard-accent/20"
                >
                  <GraduationCap className="w-4 h-4" />
                  Next-Gen Medical Board Prep
                </motion.div>
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.85]"
                >
                  Master Medicine.<br />
                  <span className="text-quizard-accent drop-shadow-[0_0_30px_rgba(0,229,255,0.3)]">Play to Win.</span>
                </motion.h2>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-medium"
                >
                  Ready to transform complex clinical data into high-yield interactive assessments?
                </motion.p>
              </div>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <FileUpload onUpload={handleUpload} isGenerating={false} />
              </motion.div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] text-rose-400 text-sm max-w-md mx-auto flex items-center gap-3 font-bold"
                >
                  <Info className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {[
                  {
                    title: "Clinical Deep Scan",
                    desc: "Proprietary algorithms scan every diagram, table, and clinical vignette for 100% material coverage.",
                    icon: "🔬",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    title: "Evidence-Based",
                    desc: "Every answer is cross-referenced with your specific source material for absolute accuracy.",
                    icon: "📚",
                    color: "from-purple-500 to-indigo-500"
                  },
                  {
                    title: "Board Standard",
                    desc: "Questions are calibrated to match the difficulty and style of major medical board examinations.",
                    icon: "🩺",
                    color: "from-emerald-500 to-teal-500"
                  }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="p-10 bg-quizard-card rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-quizard-accent/30 transition-all group relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${feature.color} opacity-50`} />
                    <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{feature.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed font-medium">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {state === 'GENERATING' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <FileUpload onUpload={() => {}} isGenerating={true} generatingConfig={generatingConfig || undefined} />
            </motion.div>
          )}

          {state === 'QUIZ' && quiz && (
            <motion.div
              key={`quiz-${quiz.title}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-4"
            >
              <QuizComponent 
                quiz={quiz} 
                onComplete={handleQuizComplete} 
                onQuit={handleRestart}
              />
            </motion.div>
          )}

          {state === 'RESULTS' && results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <ResultSummary 
                results={results} 
                onRestart={handleRestart} 
                isTheory={quiz?.type === 'THEORY'}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-16 border-t border-white/5 bg-quizard-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-quizard-accent rounded-xl flex items-center justify-center shadow-lg shadow-quizard-accent/20">
              <Stethoscope className="text-quizard-bg w-6 h-6" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">zerocode<span className="text-quizard-accent">md</span></span>
          </div>
          
          <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] text-center">
            © 2026 zerocodemd. Professional Medical Intelligence.
          </div>

          <div className="flex items-center gap-8">
            <a href="#" className="text-white/30 hover:text-quizard-accent transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="text-[10px] font-black text-white/30 hover:text-white transition-colors uppercase tracking-[0.2em]">Privacy</a>
            <a href="#" className="text-[10px] font-black text-white/30 hover:text-white transition-colors uppercase tracking-[0.2em]">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
