import {Link, useParams} from "react-router-dom";
import {signLanguages} from "../catalog/dummyData";
import {Button} from "@/components/ui/button";

const LanguageExercises = () => {
    const {
        lang
    } = useParams();

    return (
        <div className="w-full p-4 max-w-6xl flex-col flex gap-10 items-center m-auto  justify-center font-semibold tracking-widest">
            <h1 className='text-3xl text-center'>{lang} Exercises</h1>
            <div className="flex flex-col gap-5 w-full max-w-lg md:max-w-2xl">{
                signLanguages.find((item) => item.name === lang)?.exercises.map((exercise, index) => {
                        return (
                            <Link to={`/catalog/${lang}/level${exercise.id}/${exercise.id}`} className="w-full">
                                <Button className="w-full flex justify-between p-6 text-lg italic tracking-widest" key={index}>
                                    <div>Level {exercise.id}</div>
                                    <div>{exercise.level}</div>
                                </Button>
                            </Link>
                        )
                    }
                )
            }
            </div>
        </div>
    )
}

export default LanguageExercises;