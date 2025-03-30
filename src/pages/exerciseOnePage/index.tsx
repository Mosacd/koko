import {Link, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {DrawingUtils, FilesetResolver, GestureRecognizer} from "@mediapipe/tasks-vision";
import {signLanguages} from "../catalog/dummyData";
import {Button} from "@/components/ui/button";
import {handArray} from "@/DummyDataHands"

const ExercisePage = () => {
    const {lang, ex} = useParams();
    const [recognizer, setRecognizer] = useState<GestureRecognizer>();
    const [webcamRunning, setWebcamRunning] = useState(false);
    const [weBcamLoading, setWebCamLoading] = useState(false);
    const [showLandmarks, setShowLandmarks] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>(0);
    const currentLetterIndexRef = useRef<number>(0); // Use ref for current letter index
    const [hintShown, setHintShown] = useState<boolean>(false);
    const [recognizerLoading, setRecognizerLoading] = useState(true);

    // Exercise setup
    const exercise = signLanguages
        .find((item) => item.name === lang)
        ?.exercises.find((item) => item.id === Number(ex));

    const [word, setWord] = useState(getRandomWord())


//   const word = exercise?.word[getRandomIndex()].toUpperCase() || "";
    const [correctLetters, setCorrectLetters] = useState(new Array(word.length).fill(false));


    const wordRef = useRef(word);
    const correctLettersRef = useRef(correctLetters);

    useEffect(() => {
        wordRef.current = word;
        correctLettersRef.current = correctLetters;
    }, [word, correctLetters]);

    function getRandomWord(): string {
        const number = exercise?.word.length || 0;
        return exercise?.word[Math.floor(Math.random() * number)].toUpperCase() || "";
    }


    // Update useEffect for recognizer initialization
useEffect(() => {
    const initializeRecognizer = async () => {
        try {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
            );

            const recognizer = await GestureRecognizer.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "/sign_language_recognizer_25-04-2023.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO"
            });

            setRecognizer(recognizer);
        } catch (error) {
            console.error("Recognizer initialization failed:", error);
        } finally {
            setRecognizerLoading(false);
        }
    };

    // Start loading immediately when component mounts
    initializeRecognizer();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        };
    }, []);


    const handleNewWord = () => {
        // Stop webcam and reset state properly
        if (webcamRunning) {
            toggleWebcam(); // Stop first
            setTimeout(() => { // Restart after cleanup
                const newWord = getRandomWord();
                setWord(newWord);
                setCorrectLetters(new Array(newWord.length).fill(false));
                currentLetterIndexRef.current = 0;
                toggleWebcam(); // Restart with new word
            }, 100);
        } else {
            const newWord = getRandomWord();
            setWord(newWord);
            setCorrectLetters(new Array(newWord.length).fill(false));
            currentLetterIndexRef.current = 0;
        }
    };

    const handleSignDetection = (detectedLetter: string) => {
        setCorrectLetters(prev => {
            const currentWord = wordRef.current;
            const currentIndex = currentLetterIndexRef.current;

            if (currentIndex === -1 || currentIndex >= currentWord.length) return prev;
            const expectedLetter = currentWord[currentIndex];
            if (detectedLetter === expectedLetter) {
                console.log("detectedLetter", detectedLetter)
                const newLetters = [...prev];

                newLetters[currentIndex] = true;
                console.log(newLetters)
                console.log("this index works", newLetters[currentIndex])

                // Find next index immediately
                currentLetterIndexRef.current = newLetters.findIndex(v => !v);
                setHintShown(false);

                return newLetters;
            }
            return prev;
        });
    };

    const predictWebcam = async () => {
        if (!videoRef.current || !canvasRef.current || !recognizer) return;

        const canvasCtx = canvasRef.current.getContext('2d');
        if (!canvasCtx) return;

        try {
            const results = recognizer.recognizeForVideo(videoRef.current, Date.now());

            // Update canvas drawing
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // Flip the canvas context instead of the video element
            canvasCtx.translate(canvasRef.current.width, 0);
            canvasCtx.scale(-1, 1);

            const drawingUtils = new DrawingUtils(canvasCtx);
            if (showLandmarks && results.landmarks) {
                for (const landmarks of results.landmarks) {
                    drawingUtils.drawConnectors(
                        landmarks,
                        GestureRecognizer.HAND_CONNECTIONS,
                        { color: '#00FF00', lineWidth: 2 }
                    );
                    drawingUtils.drawLandmarks(landmarks, {
                        color: '#9e4444',
                        lineWidth: 1,
                        radius: 2
                    });
                }
            }

            canvasCtx.restore();

            // Process gestures
            if (results.gestures.length > 0) {
                const bestGesture = results.gestures[0][0];
                if (bestGesture.score > 0.7) {
                    handleSignDetection(bestGesture.categoryName.toUpperCase());
                }
            }
        } catch (error) {
            console.error('Recognition error:', error);
        }

        animationFrameRef.current = requestAnimationFrame(predictWebcam);
    };

    const toggleWebcam = async () => {
        if (!recognizer) return;

        try {
            if (webcamRunning) {
                // Stop webcam and reset progress only
                setWebcamRunning(false);
                cancelAnimationFrame(animationFrameRef.current);
                if (videoRef.current?.srcObject) {
                    (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                }
                // Reset progress for current word
                setCorrectLetters(new Array(word.length).fill(false));
                currentLetterIndexRef.current = 0;
            } else {
                // Start webcam with current word but reset progress
                setWebCamLoading(true)
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {width: 1280, height: 720}
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadeddata = () => {
                        canvasRef.current!.width = videoRef.current!.videoWidth;
                        canvasRef.current!.height = videoRef.current!.videoHeight;
                        setWebCamLoading(false)
                        setWebcamRunning(true);
                        currentLetterIndexRef.current = 0;
                        setCorrectLetters(new Array(word.length).fill(false));
                        predictWebcam();
                    };
                }
            }
        } catch (error) {
            console.error('Webcam error:', error);
            setWebcamRunning(false);
        }
    };


    const currentLetterIndex = correctLetters.indexOf(false);

    return (
        <div className="full max-w-6xl items-center m-auto flex flex-col gap-5 px-4 md:px-5 lg:px-10">
            <h1 className="text-2xl font-semibold">Level {exercise?.id}</h1>


           

           

            {/* Webcam section */}
            <div className="flex flex-col w-full items-center gap-4">
            <Button
    onClick={toggleWebcam}
    className={`px-6 py-3 w-full max-w-lg md:w-fit rounded-lg text-white ${
        webcamRunning ? "bg-red-500 hover:bg-red-600" : ""
    } transition-colors`}
    disabled={recognizerLoading || weBcamLoading}
>
    {recognizerLoading ? "Loading Resources..." : 
     webcamRunning ? "Stop Webcam" : "Start Webcam"}
</Button>


 {/* Progress indicator */}
 <div className="text-lg text-center my-5 max-w-2xl w-full  text-gray-600">
                {currentLetterIndex === -1 ? (

                    <div className="flex gap-5 flex-col md:flex-row w-full justify-between items-center">

                        <Button className="w-full max-w-lg md:max-w-40" onClick={handleNewWord}>New Word</Button>
                        <span className="text-nowrap  text-3xl font-bold">"Completed! 🎉"</span>
                        <Link className="w-full max-w-lg md:max-w-40" to={`/catalog/${lang}/level${(exercise?.id || 1) + 1}/${((exercise?.id || 1) + 1 )}`}>
                        <Button className="w-full md:max-w-40">next
                            level</Button></Link>
                    </div>

                ) : (
                    `Sign the ${ordinal(currentLetterIndex + 1)} letter: ${word[currentLetterIndex]}`
                )}
            </div>
                   


 {/* Word display */}
 <div className="flex justify-center text-3xl md:text-4xl font-bold gap-4 flex-wrap">
                {word.split("").map((letter, index) => (
                    <div key={index} className="flex items-center">
            <span className={`transition-colors duration-300 ${
                correctLetters[index] ? "text-green-600" : "text-gray-400"
            }`}>
              {letter}
            </span>
                        {index !== word.length - 1 && (
                            <span
                                className={`mx-2 ${index < currentLetterIndex ? "text-green-600" : "text-gray-400"}`}>➔</span>)}
                    </div>
                ))}
            </div>

            {weBcamLoading &&  <span className="text-xl">Loading...</span> }

                    <section className="flex justify-between gap-4 w-full items-center flex-col md:flex-row">
                        
        <div className={`w-full md:w-fit ${webcamRunning ? 'visible' : 'hidden'} `}>

                    <div className="flex justify-center mb-5 relative max-w-lg m-auto md:max-w-fit min-w-[100px] h-[100px]"> {/* Fixed size container */}
                        {/* Hint toggle button */}
                        <Button
                            onClick={() => setHintShown(!hintShown)}
                            className={`w-full h-10 md:h-full text-xl text-white md:rounded-full flex items-center justify-center cursor-pointer transition-all ${
                                !hintShown ? 'visible' : 'hidden'
                            }`}
                        >
                            Hint
                        </Button>

                        {/* Hint content */}
                        <div className={`${hintShown ? 'visible' : 'hidden'}`}>
                            {currentLetterIndex !== -1 &&
                                handArray
                                    .filter(obj => obj.letter === word[currentLetterIndex])
                                    .map(obj => (
                                        <div key={obj.letter}>
                                            <img
                                                src={obj.image}
                                                alt={`Sign for ${obj.letter}`}
                                                className="w-full max-w-20  h-full border-black border-2 rounded-lg p-1"
                                            />

                                        </div>
                                    ))
                            }
                        </div>
                    </div>

                </div>

                

                <div
                    className={`relative max-w-[640px] max-h-[480px] rounded-lg overflow-hidden ${webcamRunning ? 'visible' : 'hidden'} `}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                        style={{transform: 'scaleX(-1)'}} // Mirror the video feed
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    />
                    {/* Toggle Landmark Drawing */}
                    <button
                        onClick={() => setShowLandmarks(prev => !prev)}
                        className="absolute top-3 right-3 bg-white bg-opacity-80 text-black rounded-full px-3 py-1 text-sm shadow-md hover:bg-opacity-100 transition"
                    >
                        {showLandmarks ? "Hide Landmarks" : "Show Landmarks"}
                    </button>
                </div>
                        
                        <div className={`flex text-center flex-col md:max-w-[100px] break-words h-50 relative ${webcamRunning ? 'visible' : 'hidden'} `}>
                            {/* <div className="absolute top-0 left-0"> */}
                          <h1 className="text-lg border-b-2 text-center w-full border-black">Disclaimer</h1>
                            <span>
                                once the cam is opened open your palm and slowely put it into the frame
                            </span>
                            </div>
                        {/* </div> */}

                    </section>
                
        
            </div>
        </div>
    );
};

// Helper function for ordinal numbers (1st, 2nd, etc.)
function ordinal(n: number) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export default ExercisePage;