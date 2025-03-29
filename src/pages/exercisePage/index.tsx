import { useParams } from "react-router-dom";
import { signLanguages } from "../catalog/dummyData";
import { useState } from "react";


const ExercisePage = () => {


    const { lang, ex } = useParams();

    const exercise = signLanguages
    .find((item) => item.name === lang)
    ?.exercises.find((item) => item.id === Number(ex));

    const [correctLetters, setCorrectLetters] = useState(new Array(exercise?.word.length).fill(false));
        
    
    // Format the word with dashes between letters

    const word = exercise?.word || "";


    return (
        <div className="full max-w-6xl items-center m-auto flex flex-col gap-10">
            <h1 className="text-2xl font-semibold">Exercise {exercise?.id}</h1>
            <div className="flex text-3xl font-semibold gap-2">
                {word.split("").map((letter, index) => (
                    <span key={index} className={`transition-colors duration-500 ${correctLetters[index] ? "text-green-500" : "text-black"}`}>
                        {letter}
                        {index !== word.length - 1 && <span className="mx-1">-</span>}
                    </span>
                ))}
            </div>
        </div>
    );

};

export default ExercisePage;
