import {Link, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {DrawingUtils, FilesetResolver, GestureRecognizer} from "@mediapipe/tasks-vision";
import {signLanguages} from "../catalog/dummyData";
import {Button} from "@/components/ui/button";
import {handArray} from "@/DummyDataHands"
import Loader from "@/components/ui/loader";
import gorilla from "@/assets/1550536471.svg"

const ExercisePage = () => {

    
    const {lang, ex} = useParams();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>(0);
    const currentLetterIndexRef = useRef<number>(0); // Use ref for current letter index
    const showLandmarksRef = useRef(false);
    const wordRef = useRef<string>("");

    const [recognizer, setRecognizer] = useState<GestureRecognizer>();
    const [webcamRunning, setWebcamRunning] = useState(false);
    const [weBcamLoading, setWebCamLoading] = useState(false);
    const [showLandmarks, setShowLandmarks] = useState(false);
    const [hintShown, setHintShown] = useState<boolean>(false);
    const [recognizerLoading, setRecognizerLoading] = useState(true);
    const [alwaysShow, setAlwaysShow] = useState(false);
    const [word, setWord] = useState("");
    const [correctLetters, setCorrectLetters] = useState(new Array(word.length).fill(false));
    
    // Exercise setup
    const exercise = signLanguages
        .find((item) => item.name === lang)
        ?.exercises.find((item) => item.id === Number(ex));


    useEffect(() => {
        if (!exercise) return;
        
        const newWord = getRandomWord();
        wordRef.current = newWord;
        setWord(newWord);
        setCorrectLetters(new Array(newWord.length).fill(false));
      }, [exercise]);

    const currentLetterIndex = currentLetterIndexRef.current


    useEffect(() => {
        showLandmarksRef.current = showLandmarks;
      }, [showLandmarks]);


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
        const newWord = getRandomWord();
        
        // Update refs FIRST
        wordRef.current = newWord;
        currentLetterIndexRef.current = 0;
        
        // Then update state
        setWord(newWord);
        setCorrectLetters(new Array(newWord.length).fill(false));
      };

    const handleSignDetection = (detectedLetter: string) => {
       
        setCorrectLetters(prev => {
            const currentWord = wordRef.current;
            const currentIndex = currentLetterIndexRef.current;
            
            if (currentIndex === -1 || currentIndex >= currentWord.length) return prev;
            const expectedLetter = currentWord[currentIndex];
            console.log("expectedLetter", expectedLetter)
            
            console.log("detectedLetter", detectedLetter)
            if (detectedLetter === expectedLetter) {
                console.log("finally", expectedLetter)
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
            if (showLandmarksRef.current && results.landmarks) {
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
            // }
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




    return (
        <div className="full max-w-6xl items-center m-auto flex flex-col gap-5 px-4 md:px-5 lg:px-10">
            <h1 className="text-2xl font-semibold">Level {exercise?.id}</h1>


           

           

            {/* Webcam section */}
            <div className="flex flex-col w-full items-center gap-1 sm:gap-2 md:gap-3">
        

<div className="flex gap-5 flex-col md:flex-row w-full justify-center items-center">


<Link className="w-full  max-w-lg md:max-w-48" to={`/catalog/${lang}/level${(exercise?.id || 1) + 1}/${((exercise?.id || 1) + 1 )}`}>
<Button className="w-full md:max-w-48">Next
    Level</Button></Link>
    <Button
    onClick={toggleWebcam}
    className={`w-full max-w-lg md:max-w-48 text-white ${
        webcamRunning ? "bg-red-600 hover:bg-red-500" : ""
    } transition-colors`}
    disabled={recognizerLoading || weBcamLoading}
>
    {recognizerLoading ? "Loading..." : 
     webcamRunning ? "Stop Webcam" : "Start Webcam"}
</Button>
<Button className="w-full max-w-lg md:max-w-48" onClick={handleNewWord}>New Word</Button>
</div>

 {/* Progress indicator */}
 <div className="text-center my-5 max-w-2xl w-full  text-gray-600">
                {currentLetterIndex === -1 ? (

                   
                        <span className="text-nowrap  text-3xl font-bold text-green-700">Completed! 🎉</span>
                        

                ) : (
                    <span className="text-nowrap  text-xl font-bold">Sign the {ordinal(currentLetterIndex + 1)} letter: <span className="text-3xl">{word[currentLetterIndex]}</span></span>
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


                    <section className="flex gap-1 md:gap-5 justify-center  w-full items-center flex-col md:flex-row">
                        
        <div className={`w-full flex justify-center md:max-w-1/5  `}>
        {/* ${webcamRunning ? 'visible' : 'hidden'} */}
                    <div className="flex md:flex-col items-center justify-center w-full min-w-[100px] h-[100px] md:h-[200px]"> {/* Fixed size container */}
                        {/* Hint toggle button */}
                       
                        {currentLetterIndex !== -1 && 
                        <div className="flex items-center gap-3 w-full md:flex-col  *:max-w-1/2 md:*:max-w-full h-full">
                        <Button
                            onClick={() => setAlwaysShow(!alwaysShow)}
                            className={`h-2/3 flex-1 md:w-full tracking-wider min-w-0 md:h-fit text-lg font-bold  text-white  flex items-center justify-center cursor-pointer transition-all
                                
                            }`}
                        >
                          {alwaysShow ? 'always show:on' : 'always show:off'}
                        </Button>

                       <Button
                            onClick={() => setHintShown(!hintShown)}
                            className={`h-2/3 w-full min-w-0 text-3xl md:text-5xl font-bold tracking-widest text-white  flex items-center justify-center cursor-pointer transition-all ${
                                (hintShown || alwaysShow) ? 'hidden' : ''
                            }`}
                        >
                            Hint
                        </Button>


                        <div className={`h-full min-w-0 md:h-2/3 w-full items-center flex justify-center  ${hintShown || alwaysShow ? 'block' : 'hidden'}`}>
                            {currentLetterIndex !== -1 &&
                                handArray
                                    .filter(obj => obj.letter === word[currentLetterIndex])
                                    .map(obj => (
                                        <div className="h-full w-full max-w-2/5 sm:max-w-1/4 md:max-w-1/2 border-black border-2 rounded-lg p-1" key={obj.letter}>
                                            <img
                                                src={obj.image}
                                                alt={`Sign for ${obj.letter}`}
                                                className="w-full h-full"
                                            />

                                        </div>
                                    ))
                            }
                        </div>


                        </div> }
                        
                        {currentLetterIndex === -1 && <div className="flex   md:flex-col justify-center items-center"><img src={gorilla} className="size-25"/> <span className="text-3xl hidden sm:inline">yay</span></div> }


                        {/* Hint content */}
                        
                    </div>

                </div>

               

                <div
                    className={`relative w-full md:max-w-3/5 aspect-[4/3] bg-black  max-h-[480px] rounded-lg overflow-hidden `}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                        style={{transform: 'scaleX(-1)'}} // Mirror the video feed
                    />
                    <canvas
                        ref={canvasRef}
                        className={`absolute top-0 left-0 w-full ${webcamRunning ? '' : 'hidden'} h-full pointer-events-none`}
                    />
                    {weBcamLoading &&  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"><Loader/></div> }
                    {/* Toggle Landmark Drawing */}
                    <button
                        onClick={() => setShowLandmarks(prev => !prev)}
                        className="absolute top-3 right-3 tracking-widest bg-main-color italic border-2 w-full max-w-40  border-black font-semibold cursor-pointer text-white rounded-lg px-3 py-1 text-sm opacity-80  hover:opacity-100"
                    >
                        {showLandmarks ? "Hide Landmarks" : "Show Landmarks"}
                    </button>

                   
                </div>
                        
                        <div className={`flex w-full text-center flex-col md:max-w-1/5 break-words h-50 relative`}>
                        {/* ${webcamRunning ? 'visible' : 'hidden'} */}
                            {/* <div className="absolute top-0 left-0"> */}
                          <h1 className="text-lg border-b-2 text-center w-full border-black">Disclaimer</h1>
                            <span>
                                slowly move your open palm into the frame, in case it's out of the frame before every sign
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