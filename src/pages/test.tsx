import { useState, useEffect, useRef } from 'react';
import { GestureRecognizer, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

type GestureResult = {
  gestures: Array<Array<{ categoryName: string; score: number }>>;
  handednesses: Array<Array<{ displayName: string }>>;
  landmarks: Array<Array<{ x: number; y: number; z: number }>>;
};

export default function HandGestureRecognizer() {
  const [imageRecognizer, setImageRecognizer] = useState<GestureRecognizer>();
  const [videoRecognizer, setVideoRecognizer] = useState<GestureRecognizer>();
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [imageResults, setImageResults] = useState<{ [key: string]: GestureResult }>({});
  const [videoResults, setVideoResults] = useState<GestureResult | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<number>();

  const images = [
    { id: '1', url: 'https://assets.codepen.io/9177687/idea-gcbe74dc69_1920.jpg' },
    { id: '2', url: 'https://assets.codepen.io/9177687/thumbs-up-ga409ddbd6_1.png' }
  ];

  useEffect(() => {
    const initializeRecognizers = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );

        const imgRecognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
          },
          runningMode: "IMAGE"
        });

        const vidRecognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO"
        });

        setImageRecognizer(imgRecognizer);
        setVideoRecognizer(vidRecognizer);
        setLoading(false);
      } catch (error) {
        console.error('Initialization error:', error);
        setLoading(false);
      }
    };

    initializeRecognizers();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleImageClick = async (imageId: string, imageUrl: string) => {
    if (!imageRecognizer) return;

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      
      img.onload = async () => {
        const results = imageRecognizer.recognize(img);
        setImageResults(prev => ({
          ...prev,
          [imageId]: results as GestureResult
        }));
      };
    } catch (error) {
      console.error('Image recognition error:', error);
    }
  };

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
            intervalRef.current = window.setInterval(predictWebcam, 3000);
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

      // Draw without flipping
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
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading models...</div>;
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

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          color: '#333', 
          marginBottom: '20px',
          fontSize: '1.8rem'
        }}>
          Static Image Recognition
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          justifyContent: 'center'
        }}>
          {images.map((img) => (
            <div
              key={img.id}
              style={{
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                aspectRatio: '1'
              }}
              onClick={() => handleImageClick(img.id, img.url)}
            >
              <img
                src={img.url}
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
                alt={`Gesture example ${img.id}`}
              />
              {imageResults[img.id]?.gestures?.length > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '12px',
                  backdropFilter: 'blur(4px)'
                }}>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    Gesture: {imageResults[img.id].gestures[0][0].categoryName}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    Confidence: {(imageResults[img.id].gestures[0][0].score * 100).toFixed(1)}%
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    Hand: {imageResults[img.id].handednesses[0][0].displayName}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ 
          color: '#333', 
          marginBottom: '20px',
          fontSize: '1.8rem'
        }}>
          Live Webcam (3-Second Checks)
        </h2>
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