/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useParams, 
  useLocation,
  useNavigate
} from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Droplets, 
  Flame, 
  Hammer, 
  Radio, 
  ChevronLeft, 
  CheckCircle2, 
  Circle, 
  AlertTriangle,
  Compass,
  ArrowRight,
  Info,
  Layers,
  Map as MapIcon,
  ShieldCheck,
  FileText,
  Database
} from 'lucide-react';
import { cn } from './lib/utils';
import contentData from './content.json';

// --- Types ---

interface Craft {
  id: string;
  title: string;
  difficulty: string;
  image: string;
  schematic: string;
  materials: string[];
  steps: string[];
  expertTip: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  crafts: Craft[];
}

// --- Components ---

const IconMap: Record<string, any> = {
  Droplets,
  Flame,
  Hammer,
  Radio,
  Compass,
  ShieldCheck,
  MapIcon,
  Layers,
  AlertTriangle,
  Info
};

const DifficultyBadge = ({ level }: { level: string }) => {
  const colors = {
    'Baixa': 'bg-green-900/30 text-green-400 border-green-800/50',
    'Média': 'bg-yellow-900/30 text-yellow-400 border-yellow-800/50',
    'Alta': 'bg-red-900/30 text-red-400 border-red-800/50',
  };
  
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border font-bold",
      colors[level as keyof typeof colors] || colors['Baixa']
    )}>
      {level}
    </span>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

// --- Pages ---

const Home = () => {
  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-6 py-24 relative">
        <header className="mb-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-survival-green/40 border border-survival-accent/30 text-survival-accent text-[10px] font-bold uppercase tracking-[0.4em] mb-8 animate-pulse-soft"
          >
            <Compass className="w-3.5 h-3.5" /> Protocolo de Campo Ativo
          </motion.div>
          <h1 className="text-7xl sm:text-9xl font-black text-stone-100 tracking-tighter mb-8 drop-shadow-2xl">
            SURVIVAL<span className="text-survival-accent">IST</span>
          </h1>
          <p className="text-stone-400 max-w-2xl mx-auto text-xl font-light leading-relaxed mb-12">
            Acesse o conhecimento ancestral refinado pela ciência moderna. 
            Módulos de sobrevivência tática para ambientes hostis.
          </p>
          <div className="flex justify-center gap-4">
            <div className="h-px w-12 bg-survival-accent/30 self-center" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-stone-600 font-black">Selecione o Módulo</span>
            <div className="h-px w-12 bg-survival-accent/30 self-center" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {contentData.modules.map((module, idx) => {
            const Icon = IconMap[module.icon] || Info;
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link 
                  to={`/module/${module.id}`}
                  className="group relative block h-full"
                >
                  <div className="absolute -inset-px bg-gradient-to-br from-survival-moss/40 to-transparent rounded-[2rem] blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative h-full glass-panel-heavy p-10 rounded-[2rem] overflow-hidden transition-all duration-500 group-hover:translate-y-[-4px] group-hover:border-survival-accent/40">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Icon className="w-32 h-32 text-white" />
                    </div>
                    
                    <div className="flex justify-between items-start mb-16">
                      <div className="w-16 h-16 rounded-2xl bg-survival-green-light border border-survival-accent/40 flex items-center justify-center shadow-2xl shadow-black group-hover:scale-110 transition-transform duration-700">
                        <Icon className="w-8 h-8 text-survival-accent" />
                      </div>
                      <span className="text-[11px] font-mono text-survival-accent/60 font-black uppercase tracking-[0.3em]">Módulo 0{idx + 1}</span>
                    </div>
                    
                    <h2 className="text-4xl font-black text-stone-100 mb-6 group-hover:text-survival-accent transition-colors leading-none">{module.title}</h2>
                    <p className="text-stone-400 text-base leading-relaxed mb-10 font-light">{module.description}</p>
                    
                    <div className="flex items-center gap-3 text-survival-accent text-[11px] font-black uppercase tracking-[0.2em] border-t border-white/5 pt-8">
                      Iniciar Treinamento <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const module = contentData.modules.find(m => m.id === moduleId);
  const navigate = useNavigate();

  if (!module) return <div>Módulo não encontrado</div>;

  const Icon = IconMap[module.icon] || Info;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-6 py-24">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-stone-500 hover:text-survival-accent transition-colors mb-12 text-xs uppercase font-black tracking-[0.2em]"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar ao Início
        </button>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-8 mb-16"
        >
          <div className="w-20 h-20 rounded-3xl bg-survival-green-light border border-survival-accent/30 flex items-center justify-center shadow-2xl shadow-black">
            <Icon className="w-10 h-10 text-survival-accent" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-stone-100 leading-tight tracking-tight">{module.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-px w-8 bg-survival-accent/40" />
              <p className="text-survival-accent/60 text-[11px] uppercase tracking-[0.3em] font-black">Procedimentos Operacionais</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {module.crafts.map((craft, idx) => (
            <motion.div
              key={craft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link 
                to={`/craft/${craft.id}`}
                className="group flex items-center justify-between p-8 glass-panel rounded-3xl hover:border-survival-accent/40 hover:bg-survival-green/30 transition-all duration-500"
              >
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 rounded-2xl border border-white/5 flex-shrink-0 shadow-xl bg-survival-green-dark flex flex-col items-center justify-center p-2 group-hover:border-survival-accent/40 transition-colors">
                    <FileText className="w-6 h-6 text-survival-accent/50 mb-2 group-hover:text-survival-accent transition-colors" />
                    <span className="text-[8px] font-mono text-survival-accent/50 uppercase tracking-widest text-center group-hover:text-survival-accent transition-colors">Ref.<br/>{craft.id.substring(0,4)}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-stone-200 group-hover:text-stone-100 transition-colors">{craft.title}</h3>
                    <div className="flex items-center gap-4 mt-3">
                      <DifficultyBadge level={craft.difficulty} />
                      <span className="text-[10px] text-stone-500 uppercase font-black tracking-[0.2em]">{craft.steps.length} Etapas Técnicas</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:border-survival-accent/40 group-hover:bg-survival-accent/10 transition-all duration-500">
                  <ArrowRight className="w-5 h-5 text-stone-700 group-hover:text-survival-accent group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

const CraftDetail = () => {
  const { craftId } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  
  let craft: Craft | undefined;
  let module: Module | undefined;
  
  for (const m of contentData.modules) {
    const found = m.crafts.find(c => c.id === craftId);
    if (found) {
      craft = found;
      module = m;
      break;
    }
  }

  if (!craft || !module) return <div>Craft não encontrado</div>;

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-6 py-24">
        <button 
          onClick={() => navigate(`/module/${module?.id}`)}
          className="flex items-center gap-2 text-stone-500 hover:text-survival-accent transition-colors mb-12 text-xs uppercase font-black tracking-[0.2em]"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar ao Módulo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Info & Steps */}
          <div className="lg:col-span-7 space-y-16">
            <header>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-6"
              >
                <DifficultyBadge level={craft.difficulty} />
                <div className="h-px w-8 bg-survival-accent/30" />
                <span className="text-[11px] text-survival-accent/60 uppercase font-black tracking-[0.3em]">Manual de Instrução Real</span>
              </motion.div>
              <h1 className="text-6xl font-black text-stone-100 leading-none mb-8 tracking-tight">{craft.title}</h1>
              <p className="text-xl text-stone-400 leading-relaxed font-light border-l-4 border-survival-accent pl-8 py-2">
                Este guia técnico detalha a construção do item <span className="text-stone-200 font-medium">{craft.title.toLowerCase()}</span>, uma habilidade essencial para o módulo de <span className="text-stone-200 font-medium">{module.title.toLowerCase()}</span>.
              </p>
            </header>

            <section>
              <h2 className="text-[11px] uppercase tracking-[0.4em] text-survival-accent font-black mb-8 flex items-center gap-3">
                <Layers className="w-4 h-4" /> Inventário de Materiais
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {craft.materials.map((m, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-5 glass-panel rounded-2xl border-white/5 hover:border-survival-accent/20 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-survival-accent shadow-[0_0_8px_rgba(163,177,138,0.6)]" />
                    <span className="text-base text-stone-300 font-light">{m}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-[11px] uppercase tracking-[0.4em] text-survival-accent font-black mb-10 flex items-center gap-3">
                <MapIcon className="w-4 h-4" /> Protocolo de Execução
              </h2>
              <div className="space-y-10 relative">
                <div className="absolute left-[19px] top-4 bottom-4 w-px bg-white/5" />
                {craft.steps.map((step, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-10 group relative"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-survival-green-light border border-white/10 flex items-center justify-center text-xs font-mono text-stone-400 group-hover:border-survival-accent group-hover:text-survival-accent group-hover:scale-110 transition-all duration-500 z-10 shadow-xl">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="pt-2">
                      <p className="text-lg text-stone-300 leading-relaxed font-light group-hover:text-stone-100 transition-colors">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-survival-moss/20 border border-survival-accent/20 rounded-[2rem] flex gap-6 shadow-2xl"
            >
              <AlertTriangle className="w-8 h-8 text-survival-accent flex-shrink-0" />
              <div>
                <p className="text-[11px] uppercase font-black text-survival-accent mb-3 tracking-[0.2em]">Nota do Especialista</p>
                <p className="text-lg text-stone-300 italic leading-relaxed font-light">"{craft.expertTip}"</p>
              </div>
            </motion.div>

            <button 
              onClick={() => setCompleted(!completed)}
              className={cn(
                "w-full py-8 rounded-[2rem] text-sm uppercase tracking-[0.4em] font-black transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl",
                completed 
                  ? "bg-survival-accent text-survival-dark shadow-survival-accent/30" 
                  : "bg-survival-green-light text-stone-400 hover:bg-survival-green hover:text-stone-100 border border-white/5"
              )}
            >
              {completed ? <><ShieldCheck className="w-6 h-6" /> Missão Concluída</> : "Marcar como Concluído"}
            </button>
          </div>

          {/* Right Column: References */}
          <div className="lg:col-span-5 space-y-12">
            <div className="sticky top-24 space-y-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] bg-survival-green-dark/60 p-8 glass-panel-heavy"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] uppercase font-black text-survival-accent tracking-[0.3em]">Dados de Referência</span>
                  <Database className="w-5 h-5 text-survival-accent/50" />
                </div>
                <div className="space-y-6 font-mono text-xs text-stone-400">
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span>ID do Arquivo:</span>
                    <span className="text-stone-200">REF-{craft.id.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span>Classificação:</span>
                    <span className="text-stone-200">{module.title.split(':')[0]}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span>Status de Mídia:</span>
                    <span className="text-red-400/80 font-bold">REMOVIDA (Modo Texto)</span>
                  </div>
                  <div className="pt-4 text-[11px] leading-relaxed text-stone-500 font-sans">
                    As imagens fotográficas e esquemas visuais foram suprimidos para economizar recursos de processamento em campo. Siga estritamente o protocolo de execução descrito.
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-[2.5rem] overflow-hidden border border-survival-accent/20 bg-survival-moss/10 p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <FileText className="w-6 h-6 text-survival-accent" />
                  <span className="text-[10px] uppercase font-black text-survival-accent tracking-[0.3em]">Registro de Campo</span>
                </div>
                <div className="font-mono text-xs text-stone-400 leading-relaxed space-y-4">
                  <p>{">"} Inicializando protocolo de montagem...</p>
                  <p>{">"} Verificando integridade dos materiais...</p>
                  <p>{">"} Status: <span className="text-survival-accent">Aguardando execução manual</span></p>
                  <div className="w-full h-px bg-white/10 my-4" />
                  <p className="text-[10px] text-stone-600 uppercase tracking-[0.4em] font-black text-center">Terminal de Sobrevivência v2.4</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <Router>
      <ScrollToTop />
      <div className="relative min-h-screen selection:bg-survival-accent selection:text-survival-dark overflow-x-hidden">
        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-survival-green/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-survival-earth/10 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        </div>

        {/* Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-survival-accent origin-left z-50"
          style={{ scaleX }}
        />

        {/* Main Content */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/module/:moduleId" element={<ModuleDetail />} />
              <Route path="/craft/:craftId" element={<CraftDetail />} />
            </Routes>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="py-24 px-6 border-t border-stone-800 bg-stone-900/20 text-center relative z-10">
          <div className="max-w-xl mx-auto space-y-8">
            <div className="w-12 h-12 rounded-full border border-stone-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-survival-accent" />
            </div>
            <h2 className="text-3xl font-bold text-stone-100">Pronto para o Campo?</h2>
            <p className="text-stone-400">
              Este manual é uma ferramenta. A prática é o que garante a sobrevivência. 
              Revise as técnicas, prepare seu kit e mantenha a calma.
            </p>
            <p className="text-[10px] text-stone-600 uppercase tracking-widest pt-12">
              © 2026 Survivalist Manual • Desenvolvido para Exploradores
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
