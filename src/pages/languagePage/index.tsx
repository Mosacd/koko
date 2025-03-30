import { Link, useNavigate, useParams } from "react-router-dom";
import { signLanguages } from "../catalog/dummyData";
import { Button } from "@/components/ui/button";

const LangyageExercises = () => {
    const { lang } = useParams();
    // const navigate = useNavigate();

    // function getRandomIndex(length: number): number {
    //     return Math.floor(Math.random() * length);
    //   }

    //   function handleClick(exercise: string[], e: React.MouseEvent<HTMLAnchorElement>) {   
        
    //     const exerciseNumber = getRandomIndex(exercise.length);
    //     navigate(`/catalog/${lang}/${exercise[exerciseNumber]}`);
    //   }
    
    // onClick={(e) => handleClick(exercise.word,e)}

    return (
        <div className="w-full max-w-6xl flex-col flex gap-10 items-center m-auto  justify-center">
        <h1 className='text-3xl text-center'>{lang} Exercises</h1>
        <div className="flex flex-col gap-5 w-full max-w-2xl">
            {signLanguages.find((item) => item.name === lang)?.exercises.map((exercise, index) => {
return (
    <Link  to={`/catalog/${lang}/level${exercise.id}/${exercise.id}`} className="w-full">
    <Button className="w-full flex justify-between p-6 text-lg" key={index}>
        <div>Exercise {exercise.id}</div>
        <div>{exercise.level}</div>
    </Button>
    </Link>
)
            })
            }

        </div>
        </div>
    )
    }


export default LangyageExercises;