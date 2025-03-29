import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { GestureRecognizer, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";
import { signLanguages } from "../catalog/dummyData";

type GestureResult = {
  gestures: Array<Array<{ categoryName: string; score: number }>>;
  handednesses: Array<Array<{ displayName: string }>>;
  landmarks: Array<Array<{ x: number; y: number; z: number }>>;
};

const ExercisePage = () => {
  const { lang, ex } = useParams();
  const [recognizer, setRecognizer] = useState<GestureRecognizer>();
  const [webcamRunning, setWebcamRunning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // Exercise setup
  const exercise = signLanguages
    .find((item) => item.name === lang)
    ?.exercises.find((item) => item.id === Number(ex));

  const word = exercise?.word.toUpperCase() || "";
  const [correctLetters, setCorrectLetters] = useState(new Array(word.length).fill(false));
  const currentLetterIndex = correctLetters.indexOf(false);

  useEffect(() => {
    const initializeRecognizer = async () => {
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
    };

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

  const handleSignDetection = (detectedLetter: string) => {
    if (currentLetterIndex === -1) return; // All letters completed
    
    const expectedLetter = word[currentLetterIndex].toUpperCase();
    if (detectedLetter === expectedLetter) {
      setCorrectLetters(prev => {
        const newLetters = [...prev];
        newLetters[currentLetterIndex] = true;
        return newLetters;
      });
    }
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
      canvasCtx.translate(canvasRef.current.width, 0);
      canvasCtx.scale(-1, 1);

      const drawingUtils = new DrawingUtils(canvasCtx);
      if (results.landmarks) {
        for (const landmarks of results.landmarks) {
          drawingUtils.drawConnectors(
            landmarks,
            GestureRecognizer.HAND_CONNECTIONS,
            { color: '#00FF00', lineWidth: 2 }
          );
          drawingUtils.drawLandmarks(landmarks, {
            color: '#FF0000',
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
        setWebcamRunning(false);
        cancelAnimationFrame(animationFrameRef.current);
        if (videoRef.current?.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
            canvasRef.current!.width = videoRef.current!.videoWidth;
            canvasRef.current!.height = videoRef.current!.videoHeight;
            setWebcamRunning(true);
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
    <div className="full max-w-6xl items-center m-auto flex flex-col gap-10">
      <h1 className="text-2xl font-semibold">Exercise {exercise?.id}</h1>
      
      {/* Word display */}
      <div className="flex text-4xl font-bold gap-4">
        {word.split("").map((letter, index) => (
          <div key={index} className="flex items-center">
            <span className={`transition-colors duration-300 ${
              correctLetters[index] ? "text-green-600" : "text-gray-400"
            }`}>
              {letter}
            </span>
            {index !== word.length - 1 && (
              <span className={`mx-2 ${index < currentLetterIndex ? "text-green-600" : "text-gray-400"}`}>
                ➔
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="text-lg text-gray-600">
        {currentLetterIndex === -1 ? (
          "Completed! 🎉"
        ) : (
          `Sign the ${ordinal(currentLetterIndex + 1)} letter: ${word[currentLetterIndex]}`
        )}
      </div>

      {/* Webcam section */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={toggleWebcam}
          className={`px-6 py-3 rounded-lg text-white ${
            webcamRunning ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          } transition-colors`}
        >
          {webcamRunning ? "Stop Webcam" : "Start Webcam"}
        </button>

        <div className="relative w-[640px] h-[480px] border-2 border-gray-200 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>
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