import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Webcam from "react-webcam"; // Import the webcam component
import { signLanguages } from "../catalog/dummyData";

const ExercisePage = () => {
    const { lang, ex } = useParams();
    
    // Get the exercise data
    const exercise = signLanguages
        .find((item) => item.name === lang)
        ?.exercises.find((item) => item.id === Number(ex));

    const word = exercise?.word || "";
    const [correctLetters, setCorrectLetters] = useState(new Array(word.length).fill(false));

    // Function to handle detected signs (replace with real detection)
    const handleSignDetection = (detectedLetter) => {
        setCorrectLetters((prev) => {
            const newCorrect = [...prev];
            if (!newCorrect.includes(false)) return newCorrect; // Stop if already completed
            const nextIndex = newCorrect.indexOf(false);
            if (word[nextIndex] === detectedLetter) {
                newCorrect[nextIndex] = true;
            }
            return newCorrect;
        });
    };

    // Example: Simulate correct letter detection every 2 seconds (Replace with actual AI detection)
    useEffect(() => {
        const exampleLetters = word.split(""); // Example detection order
        let index = 0;
        const interval = setInterval(() => {
            if (index < exampleLetters.length) {
                handleSignDetection(exampleLetters[index]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [word]);

    return (
        <div className="full max-w-6xl items-center m-auto flex flex-col gap-10">
            {/* Exercise Title */}
            <h1 className="text-2xl font-semibold">Exercise {exercise?.id}</h1>
            
            {/* Word Display with Dashes */}
            <div className="flex text-3xl font-semibold gap-2">
                {word.split("").map((letter, index) => (
                    <span key={index} className={`transition-colors duration-500 ${correctLetters[index] ? "text-green-500" : "text-black"}`}>
                        {letter}
                        {index !== word.length - 1 && <span className="mx-1">-</span>}
                    </span>
                ))}
            </div>

            {/* Webcam Section */}
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-xl font-semibold">Sign the Letters</h2>
                <div className="border-2 border-gray-500 rounded-lg overflow-hidden w-[400px] h-[300px]">
                    <Webcam
                        className="w-full h-full"
                        mirrored={true} // Mirror the camera for easier signing
                    />
                </div>
            </div>
        </div>
    );
};

export default ExercisePage;
