import React, { useState, useEffect, useMemo } from 'react';
import {
    Shield, Heart, User, Activity, ChevronRight,
    AlertCircle, CheckCircle, Info, ArrowLeft, Brain,
    Zap, History, Briefcase, Eye,
    Target, BookOpen, Quote, Sparkles, Anchor,
    Clock, Wind, UserCheck, Award, ZapOff, Flame, Snowflake,
    Baby, Compass
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const WOUNDS_CONFIG = {
    rechazo: {
        name: "Rechazo", mask: "Huidiza", survivalResponse: "Huir",
        survivalDesc: "Tu sistema nervioso entra en modo escape. Buscas desaparecer o disociarte para no sentir el dolor del desprecio.",
        color: "#be185d",
        longDesc: "Esta herida golpea el derecho fundamental a EXISTIR. La adulta 'Huidiza' vive deseando ser vista pero aterrada de ser juzgada.",
        genesis: "Se origina desde la concepción hasta el primer año, vinculado al progenitor del mismo sexo. Ocurre cuando la niña no se siente bienvenida o siente que su presencia es una carga para su madre.",
        awareness: "Tu sanación comienza al validar que tienes derecho a ocupar espacio físico y emocional. El rechazo que temes afuera es el reflejo del rechazo que tú misma te das. Quedarte es tu mayor acto de libertad.",
        fear: "El Pánico a la invisibilidad o al desprecio total.",
        healingKey: "Validar tu derecho a ocupar espacio físico y emocional.",
        oppositeAction: "Quedarte y ocupar tu espacio. Expresar tu opinión aunque sientas ganas de huir.",
        reframe: "Merezco estar aquí. Mi existencia tiene un valor intrínseco."
    },
    abandono: {
        name: "Abandono", mask: "Dependiente", survivalResponse: "Reaccionar",
        survivalDesc: "Tu sistema nervioso busca conexión de forma ansiosa. Te volvés demandante para asegurar que el otro no se vaya.",
        color: "#db2777",
        longDesc: "Nace de la falta de nutrición afectiva. La 'Dependiente' necesita el soporte de otros para sostener su propia valía.",
        genesis: "Surge entre el primer y tercer año con el progenitor del sexo opuesto. Se da por una carencia real o percibida de apoyo paterno. La niña siente que sola no sobrevivirá.",
        awareness: "Tu hambre de atención es en realidad falta de auto-apoyo. Sanar es descubrir quién sos cuando nadie te mira y aprender a ser tu propio refugio seguro.",
        fear: "La Soledad / No ser suficiente para que alguien se quede.",
        healingKey: "Autonomía emocional. Ser tu propio refugio.",
        oppositeAction: "Pasar tiempo a solas de calidad. Poner límites aunque temas que se vayan.",
        reframe: "Yo me acompaño y me sostengo. Mi seguridad nace de mi propio centro."
    },
    humillacion: {
        name: "Humillación", mask: "Masoquista", survivalResponse: "Paralizarse",
        survivalDesc: "Te bloqueás y absorbés el impacto. Te volvés servicial, cargando con dolor ajeno para evitar la vergüenza.",
        color: "#9f1239",
        longDesc: "Es la herida de la LIBERTAD. Surge cuando la niña siente vergüenza de sus impulsos naturales ante sus padres.",
        genesis: "Se despierta entre el primer y tercer año. Ocurre cuando un progenitor se avergüenza de la niña o controla excesivamente su placer, tachándola de sucia o vergonzosa.",
        awareness: "Te has convertido en la salvadora de todos para no mirar tu propia vergüenza. Sanar es entender que el placer no es un pecado, sino una necesidad lícita y digna de vos.",
        fear: "La Libertad de ser vos misma sin censura social.",
        healingKey: "Darse permiso para el placer y el descanso sin justificación.",
        oppositeAction: "Priorizar una necesidad propia hoy. Decir NO a un favor que te agota.",
        reframe: "Tengo derecho a disfrutar. Mi placer es sagrado."
    },
    traicion: {
        name: "Traición", mask: "Controladora", survivalResponse: "Reaccionar",
        survivalDesc: "Modo lucha. Tomás el mando de forma dominante para anticiparte a cualquier engaño o pérdida de poder.",
        color: "#6b1d2f",
        longDesc: "Es la herida de la CONFIANZA. Se activa ante la manipulación percibida. La 'Controladora' quiere mostrarse fuerte.",
        genesis: "Se desarrolla entre los dos y cuatro años con el progenitor del sexo opuesto. La niña sintió que su confianza fue violada por promesas incumplidas.",
        awareness: "Tu control es un escudo contra la impotencia. Confiar no es asegurar que no te fallen, sino saber que tenés la fuerza para sobrevivir si sucede.",
        fear: "La Vulnerabilidad / Ser engañada o manipulada.",
        healingKey: "Soltar la necesidad de control. Delegar y confiar.",
        oppositeAction: "Delegar una tarea importante. Tolerar la incertidumbre sin interrogar.",
        reframe: "Confío en el flujo de la vida. Soy segura incluso en la incertidumbre."
    },
    injusticia: {
        name: "Injusticia", mask: "Rígida", survivalResponse: "Paralizarse",
        survivalDesc: "Tu sistema se 'congela' en la perfección. Te volvés fría y cuadriculada para que ninguna emoción pueda dañarte.",
        color: "#4c0519",
        longDesc: "Es la herida del SENTIR. Surge ante la frialdad o exigencia parental. La 'Rígida' confunde amor con rendimiento.",
        genesis: "Se manifiesta entre los cuatro y seis años con el progenitor del mismo sexo. La niña aprendió que solo vale por lo que hace o por lo bien que se comporta.",
        awareness: "Has bloqueado tu sensibilidad para no sentirte imperfecta. Sanar es permitirte ser humana, caótica y vulnerable; entender que el error es donde reside la conexión.",
        fear: "La Imperfección / Ser juzgada como ineficiente.",
        healingKey: "Conectar con la sensibilidad. Permitirse el error.",
        oppositeAction: "Aceptar un error pequeño sin castigarte. Mostrar una emoción real.",
        reframe: "Soy humana y vulnerable. Mi valor no está en mis logros."
    }
};

const NEUTRAL_OPT = { t: "Nada de lo anterior / No me identifico", w: "neutral" };

const SCENARIOS = {
    personal: [
        { q: "Alguien critica una decisión que tomaste con mucha ilusión...", options: [{ t: "Me retiro y me callo", w: "rechazo" }, { t: "Busco que me entiendan desesperadamente", w: "abandono" }, { t: "Me siento culpable y pequeña", w: "humillacion" }, { t: "Ataco de vuelta cuestionando su vida", w: "traicion" }, { t: "Argumento lógicamente por qué es perfecta", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Ves una foto de amigas en una reunión donde no fuiste invitada...", options: [{ t: "Mejor, no quería ir de todos modos", w: "rechazo" }, { t: "Me siento sola y excluida", w: "abandono" }, { t: "Seguro se están riendo de mí", w: "humillacion" }, { t: "Lo planearon a propósito para molestarme", w: "traicion" }, { t: "Es una falta de ética y respeto social", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Te dan un reconocimiento público por algo que hiciste...", options: [{ t: "Quisiera ser invisible ahora mismo", w: "rechazo" }, { t: "Si no me felicitan todas, me entristezco", w: "abandono" }, { t: "Pienso que no merezco tanto crédito", w: "humillacion" }, { t: "Pienso que me dan por algún interés", w: "traicion" }, { t: "Analizo si el premio es justo y exacto", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Una amiga tarda 2 días en contestar un mensaje tuyo...", options: [{ t: "Ya no le intereso, no vuelvo a escribir", w: "rechazo" }, { t: "Reviso si hice algo mal para que se aleje", w: "abandono" }, { t: "Me siento ignorada y ridícula", w: "humillacion" }, { t: "Me está manipulando con el silencio", w: "traicion" }, { t: "Es una conducta informal e incorrecta", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Alguien te dice que te ve 'muy bien' y radiante...", options: [{ t: "Cambio de tema rápidamente", w: "rechazo" }, { t: "Necesito que me lo diga más veces", w: "abandono" }, { t: "Pienso que está exagerando o miente", w: "humillacion" }, { t: "Pienso que quiere pedirme un favor", w: "traicion" }, { t: "Intento corregir algún defecto que veo", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Debés pedir dinero prestado por una urgencia real...", options: [{ t: "Prefiero sufrir sola antes que pedir", w: "rechazo" }, { t: "Me da pánico que me digan que no", w: "abandono" }, { t: "Me muero de la vergüenza al pedir", w: "humillacion" }, { t: "Me siento humillada al perder poder", w: "traicion" }, { t: "No debería haberme pasado esto, es un error", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Un vecino te pide un favor que te quita mucho tiempo...", options: [{ t: "Digo que sí para evitar conflictos", w: "rechazo" }, { t: "Digo sí para que me valore y quiera", w: "abandono" }, { t: "Me sacrifico aunque me agote", w: "humillacion" }, { t: "Pienso cómo cobrárselo después", w: "traicion" }, { t: "Si es justo por norma, lo hago", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Alguien te halaga efusivamente en público...", options: [{ t: "Quiero que pare ya mismo", w: "rechazo" }, { t: "Me encanta, quiero que todos oigan", w: "abandono" }, { t: "Me siento indigna del halago", w: "humillacion" }, { t: "Pienso qué beneficio busca", w: "traicion" }, { t: "Analizo si el halago es técnicamente exacto", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Te equivocás de camino manejando con gente...", options: [{ t: "Me quedo muda y tensa de estrés", w: "rechazo" }, { t: "Temo que se burlen o se harten", w: "abandono" }, { t: "Me siento la más tonta del mundo", w: "humillacion" }, { t: "Culpo al GPS o a las señales", w: "traicion" }, { t: "Me enfurezco por mi falta de precisión", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Estás sola en casa un viernes por la noche...", options: [{ t: "Me siento aliviada; nadie me juzga", w: "rechazo" }, { t: "Siento un vacío insoportable", w: "abandono" }, { t: "Me pongo a limpiar para sentirme útil", w: "humillacion" }, { t: "Vigilo redes para ver qué hacen otros", w: "traicion" }, { t: "Organizo mi agenda rígidamente", w: "injusticia" }, NEUTRAL_OPT] }
    ],
    pareja: [
        { q: "Tu pareja te pide un tiempo para pensar...", options: [{ t: "Me alejo y no llamo nunca más", w: "rechazo" }, { t: "Suplico desesperadamente que se quede", w: "abandono" }, { t: "Me lo merezco por ser como soy", w: "humillacion" }, { t: "Pienso que tiene a otra persona", w: "traicion" }, { t: "Es una falta de eficiencia relacional", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Tu pareja olvida tu plato favorito en una cena...", options: [{ t: "No digo nada y me cierro emocionalmente", w: "rechazo" }, { t: "Siento que ya no le intereso nada", w: "abandono" }, { t: "No soy lo bastante importante", w: "humillacion" }, { t: "Me está engañando con su atención", w: "traicion" }, { t: "Es injusto, yo recuerdo todo lo suyo", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Tu pareja te dice que te ve muy bien hoy...", options: [{ t: "Me siento incómoda y cambio de tema", w: "rechazo" }, { t: "Necesito que me lo repita más veces", w: "abandono" }, { t: "Lo dice por lástima o costumbre", w: "humillacion" }, { t: "Sospecho qué querrá conseguir de mí", w: "traicion" }, { t: "Analizo si mi aspecto es realmente impecable", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Ves una llamada perdida de un ex en el celu de tu pareja...", options: [{ t: "No pregunto y me distancio muda", w: "rechazo" }, { t: "Me va a cambiar por alguien mejor", w: "abandono" }, { t: "La ex seguro es superior a mí", w: "humillacion" }, { t: "Exijo explicaciones inmediatas", w: "traicion" }, { t: "Es una violación de los términos de lealtad", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Hay un silencio largo durante una comida...", options: [{ t: "Me hundo en mi soledad silenciosa", w: "rechazo" }, { t: "Me aterra que no haya conexión", w: "abandono" }, { t: "Siento que soy aburrida y pesada", w: "humillacion" }, { t: "Me está ocultando un secreto", w: "traicion" }, { t: "La comunicación debe ser fluida y correcta", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Tu pareja tiene un éxito laboral enorme...", options: [{ t: "Me alegro pero me siento pequeña", w: "rechazo" }, { t: "Temo que ahora ya no me necesite", w: "abandono" }, { t: "Siento envidia y luego vergüenza", w: "humillacion" }, { t: "Pienso cómo eso afecta a mi poder", w: "traicion" }, { t: "Es el resultado justo de su esfuerzo", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Proponés intimidad y tu pareja dice que está cansada...", options: [{ t: "Me siento rechazada y me alejo", w: "rechazo" }, { t: "Temo que ya no le atraigo nada", w: "abandono" }, { t: "Me siento degradada y ridícula", w: "humillacion" }, { t: "Pienso que lo hace con otra", w: "traicion" }, { t: "Es injusto, yo siempre estoy disponible", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Tu pareja te critica el modo de gestionar el dinero...", options: [{ t: "No vuelvo a opinar de finanzas", w: "rechazo" }, { t: "Temo que pelemos y me deje", w: "abandono" }, { t: "Soy un desastre, tiene razón", w: "humillacion" }, { t: "Es un ataque a mi autonomía", w: "traicion" }, { t: "Mi método es el más equilibrado", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Tu pareja está muy cariñosa hoy sin motivo...", options: [{ t: "Me siento invadida con tanto contacto", w: "rechazo" }, { t: "Me relajo, pero quiero que sea eterno", w: "abandono" }, { t: "Siento que no merezco tanto afecto", w: "humillacion" }, { t: "Sospecho si hizo algo malo", w: "traicion" }, { t: "Analizo si este afecto es proporcional", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Tienen una discusión y tu pareja se va a otra habitación...", options: [{ t: "Mejor así, prefiero mi soledad", w: "rechazo" }, { t: "Siento un pánico de abandono insoportable", w: "abandono" }, { t: "Seguro se cansó de mi torpeza", w: "humillacion" }, { t: "Pienso que me está castigando adrede", w: "traicion" }, { t: "No es la forma justa de debatir", w: "injusticia" }, NEUTRAL_OPT] }
    ],
    laboral: [
        { q: "Tu jefe pide corregir un trabajo delante de otros colegas...", options: [{ t: "Quiero renunciar de inmediato", w: "rechazo" }, { t: "Temo que ya no confíe en mí", w: "abandono" }, { t: "Me siento la más torpe del edificio", w: "humillacion" }, { t: "Quiere humillarme para ganar él", w: "traicion" }, { t: "Me enfurezco por mi falta de perfección", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Un compañero asciende y vos no, habiendo trabajado igual...", options: [{ t: "No encajo en esta empresa", w: "rechazo" }, { t: "Me siento dejada de lado", w: "abandono" }, { t: "Todos ven mi fracaso patente", w: "humillacion" }, { t: "Hay favoritismos y traiciones internas", w: "traicion" }, { t: "Es una injusticia meritocrática clara", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Te piden liderar una reunión estratégica...", options: [{ t: "Paso un estrés horrible por ser vista", w: "rechazo" }, { t: "Busco apoyo constante para no estar sola", w: "abandono" }, { t: "Temo hacer el ridículo y dar pena", w: "humillacion" }, { t: "Tomo el mando con mucha autoridad", w: "traicion" }, { t: "Debe ser una presentación impecable", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Recibís un bono extra mayor que el de otros...", options: [{ t: "Siento que es un error de contabilidad", w: "rechazo" }, { t: "Me alegra sentirme valorada y útil", w: "abandono" }, { t: "Me da vergüenza frente a mis colegas", w: "humillacion" }, { t: "Sospecho qué interés hay detrás", w: "traicion" }, { t: "Es lo justo por mi alto rendimiento", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Tu jefe no te saluda al entrar hoy por la mañana...", options: [{ t: "Mejor así, menos contacto social", w: "rechazo" }, { t: "Hice algo mal, ya no me quiere", w: "abandono" }, { t: "Soy invisible para la empresa", w: "humillacion" }, { t: "Me está ninguneando a propósito", w: "traicion" }, { t: "Es una falta de profesionalidad total", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Un colaborador comete un error grave bajo tu mando...", options: [{ t: "No le digo nada por no entrar en líos", w: "rechazo" }, { t: "Temo que si lo reto me odie", w: "abandono" }, { t: "Me siento responsable de su torpeza", w: "humillacion" }, { t: "Lo voy a vigilar de cerca, ya no confío", w: "traicion" }, { t: "Debe haber una consecuencia justa", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "La empresa anuncia recortes de personal inminentes...", options: [{ t: "Me voy yo antes de que me echen", w: "rechazo" }, { t: "Me angustia perder mi 'familia' laboral", w: "abandono" }, { t: "Seguro me toca a mí por inútil", w: "humillacion" }, { t: "Busco alianzas para que no me toquen", w: "traicion" }, { t: "Es injusto tras todo mi esfuerzo", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Te asignan el proyecto más difícil del año...", options: [{ t: "Me siento abrumada y quiero huir", w: "rechazo" }, { t: "Espero que me feliciten mucho al acabar", w: "abandono" }, { t: "Siento que me están castigando", w: "humillacion" }, { t: "Es mi oportunidad de tener el control", w: "traicion" }, { t: "Debe ser ejecutado a la perfección", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Un colega te cuenta un secreto de oficina prohibido...", options: [{ t: "Hago como que no sé nada de nada", w: "rechazo" }, { t: "Lo ayudo para que confíe en mí", w: "abandono" }, { t: "Me siento mal por saber algo prohibido", w: "humillacion" }, { t: "Uso la información como poder futuro", w: "traicion" }, { t: "Analizo si es éticamente correcto", w: "injusticia" }, NEUTRAL_OPT] },
        { q: "Te proponen un traslado a otra ciudad...", options: [{ t: "No quiero cambiar mi entorno seguro", w: "rechazo" }, { t: "Me da miedo perder mis vínculos acá", w: "abandono" }, { t: "Voy a hacer el ridículo en un lugar nuevo", w: "humillacion" }, { t: "Voy a negociar el máximo poder allá", w: "traicion" }, { t: "Analizo si es un paso justo en mi carrera", w: "injusticia" }, NEUTRAL_OPT] }
    ]
};

const TEST_QUESTIONS = [
    { q: "¿Cuánto dura aproximadamente el pico de química emocional antes de poder actuar racionalmente?", options: ["15 segundos", "90 segundos", "5 minutos"], correct: 1 },
    { q: "¿Cuál es el objetivo principal del 'Etiquetado Cognitivo'?", options: ["Sentir más la emoción", "Desidentificarte del dolor (Corteza Prefrontal)", "Culpar a otros"], correct: 1 },
    { q: "Si tu respuesta biológica es 'Huir' (Herida de Rechazo), ¿cuál es tu Acción Alternativa?", options: ["Salir corriendo rápido", "Quedarte y ocupar tu espacio físico", "Ignorar a todo el mundo"], correct: 1 }
];

const ActionButton = ({ onClick, children, className, variant = 'primary' }) => {
    const variants = {
        primary: "bg-[#6b1d2f] text-white hover:bg-[#521321]",
        secondary: "bg-slate-700 text-white hover:bg-slate-800",
        outline: "bg-white border-2 border-slate-200 text-slate-400 hover:text-slate-900",
        ghost: "text-slate-400 hover:text-[#6b1d2f]",
        accent: "bg-[#fdf2f8] border-[#fbcfe8] text-[#be185d]"
    };
    return (
        <button onClick={onClick} className={cn("p-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl", variants[variant], className)}>
            {children}
        </button>
    );
};

const InfoCard = ({ icon: Icon, title, content, colorClass = "text-[#6b1d2f]", bgClass = "bg-white" }) => (
    <div className={cn("p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4", bgClass)}>
        <div className={cn("flex items-center gap-3 font-black uppercase text-xs tracking-widest", colorClass)}>
            {Icon && <Icon size={20}/>}{title}
        </div>
        <p className={cn("leading-relaxed font-medium", bgClass.includes('6b1d2f') ? 'text-rose-100' : 'text-slate-600')}>{content}</p>
    </div>
);

const ProtocolStep = ({ icon: Icon, stepNum, title, desc }) => (
    <li className="flex gap-6 group">
        <div className="w-12 h-12 rounded-2xl bg-[#6b1d2f] text-white flex items-center justify-center font-black shrink-0 group-hover:scale-110 transition-transform shadow-lg">
            <Icon size={20}/>
        </div>
        <div>
            <span className="font-black text-[#fbcfe8] block mb-1 uppercase text-xs tracking-widest">{stepNum}. {title}</span>
            <p className="text-slate-300 leading-relaxed text-sm font-medium">{desc}</p>
        </div>
    </li>
);

const useEgoScan = () => {
    const [view, setView] = useState('home');
    const [scope, setScope] = useState(null);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [results, setResults] = useState(null);
    const [testScore, setTestScore] = useState(0);
    const [testStep, setTestStep] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem('egoscan_v3');
        if (saved) { try { setResults(JSON.parse(saved)); } catch (e) {} }
    }, []);

    const resetSession = () => { setScope(null); setStep(0); setAnswers([]); setTestScore(0); setTestStep(0); setView('home'); };
    const startQuiz = (s) => { setScope(s); setStep(0); setAnswers([]); setView('quiz'); };

    const processAnswer = (wound) => {
        const newAnswers = [...answers, wound];
        if (step < SCENARIOS[scope].length - 1) { setAnswers(newAnswers); setStep(step + 1); }
        else {
            const counts = { rechazo: 0, abandono: 0, humillacion: 0, traicion: 0, injusticia: 0, neutral: 0 };
            newAnswers.forEach(a => counts[a]++);
            const sorted = Object.entries(counts).filter(([k]) => k !== 'neutral').sort((a,b)=>b[1]-a[1]);
            const main = sorted[0]?.[0] || 'rechazo';
            const finalRes = { main, counts, date: new Date().toLocaleDateString(), scope: scope.charAt(0).toUpperCase() + scope.slice(1), allScores: Object.entries(counts).filter(([k]) => k !== 'neutral').map(([k,v])=>({ subject: WOUNDS_CONFIG[k].name, value: v })) };
            setResults(finalRes);
            localStorage.setItem('egoscan_v3', JSON.stringify(finalRes));
            setView('results');
        }
    };

    const handleTest = (idx) => {
        if (idx === TEST_QUESTIONS[testStep].correct) setTestScore(p => p + 1);
        if (testStep < TEST_QUESTIONS.length - 1) setTestStep(p => p + 1);
        else setView('testResults');
    };

    return { view, setView, scope, step, results, testScore, testStep, resetSession, startQuiz, processAnswer, handleTest };
};

export default function App() {
    const ego = useEgoScan();
    const config = WOUNDS_CONFIG[ego.results?.main] || {};

    const radarChart = useMemo(() => {
        if (!ego.results) return null;
        return (
            <div className="h-80 bg-slate-50 rounded-[4rem] p-8 border-2 border-slate-100 flex items-center justify-center shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={ego.results.allScores}>
                        <PolarGrid stroke="#cbd5e1" />
                        <PolarAngleAxis dataKey="subject" tick={{fontSize: 12, fontWeight: 900, fill: '#64748b'}} />
                        <Radar dataKey="value" stroke={WOUNDS_CONFIG[ego.results.main]?.color} fill={WOUNDS_CONFIG[ego.results.main]?.color} fillOpacity={0.65} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        );
    }, [ego.results]);

    const renderView = () => {
        switch(ego.view) {
            case 'home': return (
                <div className="space-y-12 animate-fade-in">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black text-slate-900 leading-none tracking-tight">Tu Mapa <span className="text-[#6b1d2f]">Emocional</span>.</h1>
                        <p className="text-slate-500 text-xl font-medium leading-relaxed">Detectá tu Herida y tu Mecanismo de Supervivencia biológico en 30 escenarios reales de vida.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {[{ id: 'personal', label: 'Personal', icon: User, color: 'bg-slate-50 border-slate-200 text-slate-700' }, { id: 'pareja', label: 'Pareja', icon: Heart, color: 'bg-[#fdf2f8] border-[#fbcfe8] text-[#be185d]' }, { id: 'laboral', label: 'Laboral', icon: Briefcase, color: 'bg-[#fcf8f9] border-[#f3e8eb] text-[#6b1d2f]' }].map((item) => (
                            <button key={item.id} onClick={()=>ego.startQuiz(item.id)} className={cn("p-8 border-2 rounded-[2.5rem] flex items-center justify-between transition-all group shadow-sm", item.color)}>
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:rotate-6 transition-transform"><item.icon size={32}/></div>
                                    <div className="font-black text-2xl tracking-tight">{item.label}</div>
                                </div>
                                <ChevronRight size={24}/>
                            </button>
                        ))}
                    </div>
                    {ego.results && (
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3"><History size={20} className="text-slate-400"/>
                                <div><div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Último Análisis</div><div className="font-bold text-[#6b1d2f] uppercase italic">Herida de {ego.results.main}</div></div>
                            </div>
                            <button onClick={()=>ego.setView('results')} className="text-[#6b1d2f] font-bold text-sm underline">Ver de nuevo</button>
                        </div>
                    )}
                </div>
            );

            case 'quiz': {
                const scenario = SCENARIOS[ego.scope][ego.step];
                return (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"><span>{ego.scope}</span><span>{ego.step+1} / 10</span></div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#6b1d2f] transition-all duration-700" style={{width:`${((ego.step+1)/10)*100}%`}}></div></div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 leading-tight">{scenario.q}</h2>
                        <div className="space-y-3">
                            {scenario.options.map((opt, i) => (
                                <button key={i} onClick={()=>ego.processAnswer(opt.w)} className="w-full text-left p-6 rounded-3xl border-2 border-slate-50 bg-slate-50/30 hover:border-[#6b1d2f] hover:bg-white transition-all text-base font-bold text-slate-700 flex gap-5 items-center group shadow-sm">
                                    <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xs font-black text-slate-300 group-hover:bg-[#6b1d2f] group-hover:text-white transition-all shadow-inner shrink-0">{String.fromCharCode(65+i)}</span>
                                    {opt.t}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            }

            case 'results': return (
                <div className="space-y-10 animate-fade-in text-center">
                    <div className="space-y-3">
                        <h2 className="text-6xl font-black uppercase italic tracking-tighter text-[#6b1d2f] leading-none">HERIDA DE {config.name}</h2>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                            <span className="px-4 py-1.5 bg-slate-100 text-slate-900 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-slate-200"><Shield size={14}/> Máscara: {config.mask}</span>
                            <span className={cn("px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 border", config.survivalResponse === 'Huir' ? "bg-rose-50 text-[#be185d] border-rose-200" : config.survivalResponse === 'Paralizarse' ? "bg-slate-100 text-slate-700 border-slate-300" : "bg-pink-50 text-[#db2777] border-pink-200")}>
                                {config.survivalResponse === 'Huir' ? <ZapOff size={14}/> : config.survivalResponse === 'Paralizarse' ? <Snowflake size={14}/> : <Flame size={14}/>}
                                {config.survivalResponse}
                            </span>
                        </div>
                    </div>
                    {radarChart}
                    <div className="grid grid-cols-1 gap-4 pb-12">
                        <ActionButton onClick={() => ego.setView('longExplanation')} variant="secondary"><BookOpen size={24}/> Análisis Profundo</ActionButton>
                        <ActionButton onClick={() => ego.setView('awareness')}><Zap size={24}/> Método de las 2A</ActionButton>
                    </div>
                </div>
            );

            case 'longExplanation': return (
                <div className="space-y-10 animate-fade-in pb-16">
                    <button onClick={()=>ego.setView('results')} className="text-slate-400 hover:text-slate-900 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors"><ArrowLeft size={18}/> Volver</button>
                    <h2 className="text-5xl font-black text-slate-900 uppercase italic leading-none">Anatomía de la {config.name}</h2>
                    <div className="h-2 w-32 bg-[#6b1d2f] rounded-full shadow-lg"></div>
                    <div className="p-10 bg-slate-50 rounded-[4rem] border-2 border-slate-100 space-y-8 shadow-sm">
                        <div className="flex gap-6"><Quote size={64} className="text-[#fbcfe8] shrink-0 opacity-50"/><p className="text-slate-700 text-xl leading-relaxed italic font-bold">"{config.longDesc}"</p></div>
                        <InfoCard icon={Baby} title="Génesis de la Herida" content={config.genesis} colorClass="text-[#6b1d2f]" />
                        <InfoCard icon={Compass} title="Toma de Consciencia" content={config.awareness} colorClass="text-[#fbcfe8]" bgClass="bg-[#6b1d2f]" />
                        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm border-l-8 border-l-[#be185d]">
                            <h4 className="text-sm font-black text-[#be185d] uppercase mb-2 flex items-center gap-2"><Activity size={16}/> Respuesta Biológica: {config.survivalResponse}</h4>
                            <p className="text-slate-600 font-medium italic">{config.survivalDesc}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 pt-6 text-center">
                            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3"><div className="flex items-center justify-center gap-2 text-red-500 font-black uppercase text-xs tracking-widest"><AlertCircle size={16}/> Temor</div><div className="text-xl font-black text-slate-800 leading-tight">{config.fear}</div></div>
                            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3"><div className="flex items-center justify-center gap-2 text-emerald-500 font-black uppercase text-xs tracking-widest"><CheckCircle size={16}/> Sanación</div><div className="text-xl font-black text-slate-800 leading-tight">{config.healingKey}</div></div>
                        </div>
                    </div>
                    <ActionButton onClick={()=>ego.setView('awareness')} className="w-full">Ir al Método 2A</ActionButton>
                </div>
            );

            case 'awareness': return (
                <div className="space-y-12 animate-fade-in pb-16">
                    <div className="space-y-4 text-center">
                        <h2 className="text-5xl font-black text-slate-900 leading-tight uppercase italic">Método 2A</h2>
                        <p className="text-slate-500 text-xl font-medium italic">"Etiquetado Cognitivo y Acción Alternativa"</p>
                    </div>
                    <section className="p-10 border-2 border-[#fbcfe8] rounded-[4rem] bg-[#fdf2f8] space-y-6 border-l-8 border-l-[#be185d]">
                        <div className="flex items-center gap-3 text-[#be185d] font-black text-sm uppercase tracking-widest"><Eye size={24}/> A de Autoconciencia</div>
                        <h4 className="font-black text-3xl text-slate-900 leading-none">Detectar y Etiquetar</h4>
                        <p className="text-slate-600 text-lg font-medium leading-relaxed">Cuando sientas la activación biológica, detente y etiqueta:
                            <span className="font-black text-[#be185d] block mt-4 text-2xl italic bg-white p-6 rounded-3xl shadow-inner border border-[#fbcfe8] text-center">"Mi herida de {config.name} está hablando".</span>
                        </p>
                    </section>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"><div className="flex items-center gap-2 text-amber-600 font-black text-xs mb-2"><Zap size={14}/> Emoción (Biología)</div><p className="text-sm text-slate-500 italic">Respuesta física inmediata (90 segundos).</p></div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"><div className="flex items-center gap-2 text-[#be185d] font-black text-xs mb-2"><Brain size={14}/> Sentimiento (Mente)</div><p className="text-sm text-slate-500 italic">Emoción + Pensamiento alimentado.</p></div>
                    </div>
                    <section className="p-10 bg-slate-900 text-white rounded-[4rem] space-y-10 shadow-2xl relative overflow-hidden">
                        <Anchor className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 -rotate-12" />
                        <div className="relative"><h4 className="font-black text-[#fbcfe8] flex items-center gap-3 tracking-[0.2em] uppercase text-sm mb-4"><Target size={24}/> A de Acción Alternativa</h4><p className="text-rose-100 text-lg font-medium">Reprogramación en 8 pasos:</p></div>
                        <ul className="space-y-6 relative">
                            <ProtocolStep icon={Clock} stepNum={1} title="Pausa de los 90s" desc="Esperá a que el 'disparo' químico se disipe." />
                            <ProtocolStep icon={Wind} stepNum={2} title="Respiración Coherente" desc="Señal biológica de seguridad al corazón (4s)." />
                            <ProtocolStep icon={Brain} stepNum={3} title="Etiquetado Cognitivo" desc="Activá tu Corteza Prefrontal." />
                            <ProtocolStep icon={Info} stepNum={4} title="Validación Interna" desc="Tu niña tiene miedo y es natural." />
                            <ProtocolStep icon={Activity} stepNum={5} title="Desafío al Pensamiento" desc="¿Es un hecho real o proyección?" />
                            <ProtocolStep icon={Zap} stepNum={6} title="El Acto Opuesto" desc={`Acción: ${config.oppositeAction}`} />
                            <ProtocolStep icon={UserCheck} stepNum={7} title="Sostén de la Sensación" desc="Tolerá la incomodidad de lo nuevo." />
                            <ProtocolStep icon={Award} stepNum={8} title="Anclaje de Victoria" desc="Celebrá tu consciencia." />
                        </ul>
                    </section>
                    <ActionButton onClick={() => ego.setView('test')} variant="secondary">Test de Integración <ChevronRight size={24}/></ActionButton>
                </div>
            );

            case 'test': {
                const tq = TEST_QUESTIONS[ego.testStep];
                return (
                    <div className="space-y-12 animate-fade-in pb-16">
                        <div className="space-y-4 text-center">
                            <h2 className="text-4xl font-black text-slate-900 uppercase italic">Test de Integración</h2>
                            <p className="text-slate-500 font-medium text-lg italic">¿Sabés desarmar tu mecanismo de {config.survivalResponse}?</p>
                        </div>
                        <div className="p-10 border-4 border-slate-50 rounded-[4rem] bg-slate-50/20 space-y-10 shadow-inner">
                            <h3 className="text-3xl font-black text-slate-800 leading-none">{tq.q}</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {tq.options.map((opt, i) => (<button key={i} onClick={()=>ego.handleTest(i)} className="p-6 bg-white border-2 border-slate-100 rounded-3xl text-left text-lg font-bold text-slate-600 hover:border-[#6b1d2f] hover:text-[#6b1d2f] transition-all shadow-sm hover:shadow-md">{opt}</button>))}
                            </div>
                        </div>
                    </div>
                );
            }

            case 'testResults': return (
                <div className="space-y-10 animate-fade-in text-center pb-20">
                    <div className="w-40 h-40 bg-[#6b1d2f] rounded-full mx-auto flex items-center justify-center text-white shadow-2xl"><Award size={80} /></div>
                    <h2 className="text-5xl font-black text-slate-900 uppercase italic leading-none">¡Maestría Integrada!</h2>
                    <p className="text-2xl text-slate-500 font-bold">Dominaste {ego.testScore} de {TEST_QUESTIONS.length} conceptos.</p>
                    <div className="p-10 bg-slate-900 text-white rounded-[4rem] shadow-2xl relative overflow-hidden">
                        <Sparkles className="absolute -top-10 -right-10 text-white/10 w-48 h-48 rotate-45" />
                        <p className="relative text-2xl font-bold italic text-rose-100 leading-relaxed">"La emoción es la brújula que apunta hacia tu herida, pero el registro es el mapa que te guía hacia tu libertad."</p>
                    </div>
                    <div className="p-8 bg-[#fdf2f8] border border-[#fbcfe8] rounded-3xl text-[#be185d] font-bold text-lg italic shadow-sm">Recordá: No registramos para controlar, sino para no ser controladas por lo desconocido.</div>
                    <ActionButton onClick={ego.resetSession} className="w-full" variant="secondary">Cerrar Sesión Terapéutica</ActionButton>
                </div>
            );

            default: return null;
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto min-h-screen bg-white flex flex-col font-sans border-x border-slate-50 shadow-2xl overflow-x-hidden">
            <main className="flex-1 p-6">{renderView()}</main>
            <footer className="p-10 text-center border-t border-slate-50 bg-slate-50/30">
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.5em]">EgoScan Mastery · Bio-Consciencia · 2026</p>
            </footer>
        </div>
    );
}
