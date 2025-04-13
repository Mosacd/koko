import {videoArray} from "@/DummyDataVideos";
import {signLanguages} from "../catalog/dummyData";
import {Link, useParams} from "react-router-dom";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";

const ExercisePage = () => {
    const {lang, ex} = useParams();
    const [videoName, setVideoName] = useState(getRandomVideo());
    const [complete, setComplete] = useState(false);
    const [incorrect, setIncorrect] = useState(false);
    const [inputValue, setInputValue] = useState(""); // Add input state

    // Add input handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleNewVideo = () => {
        setComplete(false);
        setInputValue("");
        setVideoName(getRandomVideo());
    }

    // Fixed submit handler
    const handleSubmit = () => {
        if (inputValue.toUpperCase() === videoName.toUpperCase()) {
            setIncorrect(false);
            setComplete(true);
        } else {
            setIncorrect(true)
        }
    };

    const exercise = signLanguages
        .find((item) => item.name === lang)
        ?.exercises.find((item) => item.id === Number(ex));

    // Fixed video name property access
    function getRandomVideo(): string {
        const number = videoArray.length;
        return number > 0 ? videoArray[Math.floor(Math.random() * number)].name || "" : "";
    }

    return (
        <div className="full max-w-6xl px-5 items-center m-auto flex flex-col gap-5 mb-30">
            <h1 className="text-2xl font-semibold">Level {exercise?.id}</h1>

         

                <div className="flex gap-5 flex-col md:flex-row w-full max-w-2xl my-5 justify-between items-center">

                    <Button className="w-full max-w-lg md:max-w-48" onClick={() => handleNewVideo()}>New Word</Button>
                    {complete && <span className="text-nowrap text-3xl font-bold text-green-700">Completed! 🎉</span>}
                    {incorrect && <span className="text-red-600 text-xl">Incorrect!</span>}
                    <Link className="w-full max-w-lg md:max-w-48" to={`/catalog/${lang}/level${(exercise?.id || 1) + 1}/${((exercise?.id || 1) + 1)}`}>
                    <Button className="w-full">Next
                        level</Button></Link>
                </div>

            

            <div className="w-full bg-black h-[437px] rounded-lg max-w-3xl">
                {videoArray
                    .filter(obj => obj.name === videoName) // Fixed property name
                    .map(obj => (
                        <div key={obj.name} className="relative">
                            <video
                                muted
                                controls
                                width="100%"
                                height="auto"
                                className="border-black bg-black border-2 rounded-lg p-1"
                            >
                                <source src={obj.video} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ))}
            </div>

            <p className="text-xl font-semibold text-center mt-5">
                Write down the word signed in the video
            </p>

            {/* Added controlled input */}
            <input
                className="w-full max-w-xl h-10 p-2 bg-indigo-50 border-2 border-black rounded-lg"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />

            {/* Fixed button click handler */}
            <Button className="w-full max-w-lg md:max-w-49 tracking-widest" onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    )
}
export default ExercisePage;