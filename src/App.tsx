import {lazy, Suspense, useEffect} from "react"
import {Navigate, Route, Routes, useLocation, useParams} from "react-router-dom"
import Layout from "./layout"
import ExerciseLayout from "./layout/exerciseLayout"
import Loader from "./components/ui/loader"
import {signLanguages} from "./pages/catalog/dummyData"
import {preloadHandSigns} from "./DummyDataHands"

const HomePage = lazy(() => import("./pages/homePage"))
const LanguageCatalog = lazy(() => import("./pages/catalog"))
const LanguageExercises = lazy(() => import("./pages/languagePage"))
const ExerciseOnePage = lazy(() => import("./pages/exerciseOnePage"))
const ExerciseTwoPage = lazy(() => import("./pages/exerciseTwoPage"))
const ExerciseFourPage = lazy(() => import("./pages/exerciseFourPage"))
const ExerciseFivePage = lazy(() => import("./pages/exerciseFivePage"))
const ManualPage = lazy(() => import("./pages/manualPage"))
const AboutUs = lazy(() => import("./pages/aboutUsPage"))

const ExerciseRouter = () => {
    const { lang, id } = useParams();
    const exercise = signLanguages
        .find(l => l.name === lang)
        ?.exercises.find(e => e.id === Number(id));

    if (!exercise) return <div className="flex justify-center items-center h-screen text-2xl">Exercise not found</div>;

    switch (exercise.exerciseType) {
        case "sign":          return <ExerciseOnePage />;
        case "watch":         return <ExerciseTwoPage />;
        case "read-word":     return <ExerciseFourPage />;
        case "read-sentence": return <ExerciseFivePage />;
    }
};

function App() {
    const location = useLocation();

    // Warm the hand-sign image cache ahead of the pages that need it, but
    // skip the home page so it stays free of the extra network work.
    useEffect(() => {
        if (location.pathname === "/" || location.pathname === "/home") return;
        preloadHandSigns();
    }, [location.pathname]);

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <Loader/>
            </div>
        }>
        <Routes>
            <Route element={<Layout/>}>
                <Route index element={<Navigate to={'/home'}/>}/>
                <Route path='/home' element={<HomePage/>}/>
                <Route path='/catalog' element={<LanguageCatalog/>}/>
                <Route path="/aboutUs" element={<AboutUs/>}/>
            </Route>

            <Route path='/catalog/:lang' element={<LanguageExercises/>}/>
            <Route path='/catalog/:lang/manual' element={<ManualPage/>}/>

            <Route element={<ExerciseLayout/>}>
                <Route path='/catalog/:lang/exercise/:id' element={<ExerciseRouter/>}/>
            </Route>

            <Route path='*' element={
                <div className='flex w-screen h-screen justify-center items-center'>
                    <h1 className='text-8xl text-center'>404 Page Not Found</h1>
                </div>
            }/>
        </Routes>
        </Suspense>
    )
}

export default App;
