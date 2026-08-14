import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { signLanguages } from "../catalog/dummyData";
import { handArray } from "@/DummyDataHands";
import { Button } from "@/components/ui/button";
import { useScore, calcOtpScore } from "@/hooks/useScore";

type Phase = "playing" | "input";

const SPEED_OPTIONS = [
    { label: "Slow", ms: 900 },
    { label: "Normal", ms: 550 },
    { label: "Fast", ms: 300 },
] as const;

const defaultSpeedIndex = (level?: string) => {
    if (level === "Beginner") return 0;
    if (level === "Advanced") return 2;
    return 1;
};

const ExercisePage = () => {
    const { lang, id } = useParams();

    const exercise = signLanguages
        .find((item) => item.name === lang)
        ?.exercises.find((item) => item.id === Number(id));

    const displayLevel = (signLanguages.find(l => l.name === lang)?.exercises.filter(e => e.category === exercise?.category) ?? []).findIndex(e => e.id === exercise?.id) + 1;

    const [word, setWord] = useState("");
    const [phase, setPhase] = useState<Phase>("playing");
    const [flashIndex, setFlashIndex] = useState(-1);
    const [speedIndex, setSpeedIndex] = useState(() => defaultSpeedIndex(exercise?.level));
    const [inputs, setInputs] = useState<string[]>([]);
    const [completed, setCompleted] = useState(false);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [gaveUp, setGaveUp] = useState(false);
    const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const scoredRef = useRef(false);
    const playTimeoutRef = useRef<number | null>(null);
    const playTokenRef = useRef(0);

    const { addScore } = useScore(lang ?? "");

    // Only words fully spellable with the available hand-sign images are eligible.
    const validWords = (exercise?.word ?? []).filter(
        w => w && [...w.toUpperCase()].every(ch => handArray.some(h => h.letter === ch))
    );

    function getRandomWord() {
        const pool = validWords.length > 0 ? validWords : (exercise?.word ?? []).filter(Boolean);
        return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)].toUpperCase() : "";
    }

    function stopPlayback() {
        if (playTimeoutRef.current !== null) {
            clearTimeout(playTimeoutRef.current);
            playTimeoutRef.current = null;
        }
    }

    function playSequence(w: string, letterMs: number) {
        stopPlayback();
        const token = ++playTokenRef.current;

        setPhase("playing");
        setFlashIndex(0);

        let i = 0;
        const advance = () => {
            if (playTokenRef.current !== token) return;
            i += 1;
            if (i >= w.length) {
                setFlashIndex(-1);
                setPhase("input");
                return;
            }
            setFlashIndex(i);
            playTimeoutRef.current = window.setTimeout(advance, letterMs);
        };
        playTimeoutRef.current = window.setTimeout(advance, letterMs);
    }

    function initWord() {
        const w = getRandomWord();
        setWord(w);
        setInputs(new Array(w.length).fill(""));
        setCompleted(false);
        setHintsUsed(0);
        setGaveUp(false);
        setEarnedPoints(null);
        scoredRef.current = false;
        inputRefs.current = [];
        playSequence(w, SPEED_OPTIONS[speedIndex].ms);
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }

    useEffect(() => {
        if (!exercise) return;
        initWord();
        return stopPlayback;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exercise]);

    useEffect(() => {
        if (inputs.length > 0 && inputs.every((val, i) => val === word[i])) {
            setCompleted(true);
        }
    }, [inputs, word]);

    useEffect(() => {
        if (completed && !scoredRef.current) {
            scoredRef.current = true;
            const pts = calcOtpScore(hintsUsed, gaveUp);
            if (pts > 0) {
                addScore(pts);
                setEarnedPoints(pts);
            }
        }
    }, [completed]);

    const handleReplay = () => {
        if (completed) return;
        playSequence(word, SPEED_OPTIONS[speedIndex].ms);
    };

    const handleSpeedChange = (idx: number) => {
        setSpeedIndex(idx);
        if (!completed && word) {
            playSequence(word, SPEED_OPTIONS[idx].ms);
        }
    };

    const handleInput = (index: number, value: string) => {
        const char = value.slice(-1).toUpperCase();
        const newInputs = [...inputs];
        newInputs[index] = char;
        setInputs(newInputs);
        if (char && index < word.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (inputs[index]) {
                const newInputs = [...inputs];
                newInputs[index] = "";
                setInputs(newInputs);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
                const newInputs = [...inputs];
                newInputs[index - 1] = "";
                setInputs(newInputs);
            }
            e.preventDefault();
        }
    };

    const letterStatus = (index: number) => {
        if (!inputs[index]) return "empty";
        return inputs[index] === word[index] ? "correct" : "incorrect";
    };

    const handleHintChar = () => {
        const nextIndex = inputs.findIndex((val, i) => val !== word[i]);
        if (nextIndex === -1) return;
        const newInputs = [...inputs];
        newInputs[nextIndex] = word[nextIndex];
        setInputs(newInputs);
        setHintsUsed(h => h + 1);
    };

    const handleGiveUp = () => {
        setGaveUp(true);
        setInputs(word.split(""));
    };

    const currentSign = flashIndex >= 0 ? handArray.find(obj => obj.letter === word[flashIndex]) : undefined;

    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col items-center gap-6 px-4 md:px-8 pt-6 pb-4">
            <h1 className="text-2xl font-semibold">{exercise?.category} — Level {displayLevel}</h1>

            <div className="flex flex-col items-center gap-3">
                <div className="w-48 h-56 md:w-56 md:h-64 border-2 border-black rounded-lg bg-white flex items-center justify-center overflow-hidden">
                    {phase === "playing" ? (
                        currentSign
                            ? <img src={currentSign.image} alt="sign" className="w-full h-full object-contain p-3" />
                            : <span className="text-gray-300 text-2xl">•</span>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400 px-4 text-center">
                            <span className="text-sm">Type the word you just saw</span>
                        </div>
                    )}
                </div>

                {word.length > 0 && (
                    <div className="flex gap-1.5">
                        {word.split("").map((_, i) => (
                            <span
                                key={i}
                                className={`w-2 h-2 rounded-full ${phase === "input" || i <= flashIndex ? "bg-[var(--color-main-color)]" : "bg-gray-200"}`}
                            />
                        ))}
                    </div>
                )}

                <Button onClick={handleReplay} disabled={completed} className="min-w-36">
                    Replay
                </Button>

                    
                    <div className="flex gap-1.5">
                        {SPEED_OPTIONS.map((option, idx) => (
                            <Button
                                key={option.label}
                                onClick={() => handleSpeedChange(idx)}
                                variant={speedIndex === idx ? "default" : "secondary"}
                                size="sm"
                            >
                                {option.label}
                            </Button>
                        ))}
                  
                </div>
            </div>

            <p className="text-xl font-semibold text-center">
                {completed
                    ? <span className="text-green-600">Completed! 🎉{earnedPoints !== null && !gaveUp ? <span className="ml-3" style={{ color: "var(--color-main-color)" }}>+{earnedPoints} pts</span> : gaveUp ? <span className="ml-3 text-gray-400 text-base font-normal">No points awarded</span> : null}</span>
                    : phase === "playing"
                        ? "Type the word as you watch the signs"
                        : "Type the word that was signed"
                }
            </p>

            <div className="flex gap-4 flex-wrap justify-center">
                {word.split("").map((_, i) => {
                    const status = letterStatus(i);
                    return (
                        <input
                            key={i}
                            ref={el => { inputRefs.current[i] = el; }}
                            type="text"
                            value={inputs[i] ?? ""}
                            onChange={e => handleInput(i, e.target.value)}
                            onKeyDown={e => handleKeyDown(i, e)}
                            disabled={completed}
                            className={`w-12 h-12 md:w-14 md:h-14 text-center text-xl font-bold border-2 rounded-lg outline-none transition-colors
                                ${status === "correct"   ? "border-green-500 text-green-600 bg-green-50" :
                                  status === "incorrect" ? "border-red-400 text-red-600 bg-red-50" :
                                  "border-black focus:border-[var(--color-main-color)]"}`}
                        />
                    );
                })}
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
                <Button onClick={handleHintChar} className={`min-w-36 ${completed ? "invisible" : ""}`}>Hint {hintsUsed > 0 && `(${hintsUsed})`}</Button>
                <Button onClick={handleGiveUp} className={`min-w-36 bg-red-500 hover:bg-red-400 text-white ${completed ? "invisible" : ""}`}>Give Up</Button>
                <Button onClick={initWord} className="min-w-36">New Word</Button>
            </div>
        </div>
    );
};

export default ExercisePage;
