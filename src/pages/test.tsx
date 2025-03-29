import { useState, useEffect, useRef } from 'react';
import { GestureRecognizer, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

type GestureResult = {
  gestures: Array<Array<{ categoryName: string; score: number }>>;
  handednesses: Array<Array<{ displayName: string }>>;
  landmarks: Array<Array<{ x: number; y: number; z: number }>>;
};

export default function HandGestureRecognizer() {
  const [videoRecognizer, setVideoRecognizer] = useState<GestureRecognizer>();
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [videoResults, setVideoResults] = useState<GestureResult | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<number>();

  useEffect(() => {
    const initializeRecognizer = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );

        const vidRecognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "./sign_language_recognizer_25-04-2023.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO"
        });

        setVideoRecognizer(vidRecognizer);
        setLoading(false);
      } catch (error) {
        console.error('Initialization error:', error);
        setLoading(false);
      }
    };

    initializeRecognizer();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleWebcam = async () => {
    if (!videoRecognizer) return;

    try {
      if (webcamRunning) {
        setWebcamRunning(false);
        clearInterval(intervalRef.current);
        if (videoRef.current?.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
      } else {
        const constraints = { video: { width: 1280, height: 720 } };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
            setWebcamRunning(true);
            intervalRef.current = window.setInterval(predictWebcam, 1000); // Changed to 1 second
          };
        }
      }
    } catch (error) {
      console.error('Webcam error:', error);
      setWebcamRunning(false);
    }
  };

  const predictWebcam = async () => {
    if (!videoRef.current || !canvasRef.current || !videoRecognizer) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    try {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      const nowInMs = Date.now();
      const results = videoRecognizer.recognizeForVideo(videoRef.current, nowInMs);
      setVideoResults(results as GestureResult);

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      const drawingUtils = new DrawingUtils(canvasCtx);
      if (results.landmarks) {
        for (const landmarks of results.landmarks) {
          drawingUtils.drawConnectors(
            landmarks,
            GestureRecognizer.HAND_CONNECTIONS,
            { color: '#00FF00', lineWidth: 5 }
          );
          drawingUtils.drawLandmarks(landmarks, {
            color: '#FF0000',
            lineWidth: 2
          });
        }
      }
      canvasCtx.restore();
    } catch (error) {
      console.error('Recognition error:', error);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading model...</div>;
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        color: '#007f8b', 
        marginBottom: '30px',
        textAlign: 'center',
        fontSize: '2.5rem'
      }}>
        Hand Gesture Recognition
      </h1>

      <section>
        <div style={{ 
          position: 'relative',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <button
            onClick={toggleWebcam}
            style={{
              padding: '12px 24px',
              backgroundColor: webcamRunning ? '#dc3545' : '#007f8b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              margin: '20px',
              fontSize: '16px',
              transition: 'background-color 0.2s',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            {webcamRunning ? 'Stop Webcam' : 'Start Webcam'}
          </button>

          <div style={{ 
            position: 'relative', 
            width: '100%',
            paddingTop: '56.25%'
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            />
            
            {videoResults?.gestures?.length > 0 && (
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                maxWidth: '300px',
                backdropFilter: 'blur(4px)'
              }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>Results:</h3>
                <p style={{ margin: '8px 0' }}>
                  Gesture: {videoResults.gestures[0][0].categoryName}
                </p>
                <p style={{ margin: '8px 0' }}>
                  Confidence: {(videoResults.gestures[0][0].score * 100).toFixed(1)}%
                </p>
                <p style={{ margin: '8px 0' }}>
                  Hand: {videoResults.handednesses[0][0].displayName}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}