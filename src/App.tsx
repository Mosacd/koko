import {Navigate, Route, Routes} from "react-router-dom"
import Layout from "./layout"
import HomePage from "./pages/homePage"
import LanguageCatalog from "./pages/catalog"
import LanguageExercises from "./pages/languagePage"
import ExercisePage from "./pages/exercisePage"

import AboutUs from "./pages/aboutUsPage"


function App() {
    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route index element={<Navigate to={'/home'}/>}/>
                <Route path='/home' element={<HomePage/>}/>
                <Route path='/catalog' element={<LanguageCatalog/>}/>
                <Route path='/catalog/:lang' element={<LanguageExercises/>}/>
                <Route path='/catalog/:lang/level1/:ex' element={<ExercisePage/>}/>
                <Route path='/catalog/:lang/level2/:ex' element={<>mawoni</>}/>
                <Route path="/aboutUs" element={<AboutUs/>}/>
            </Route>
            <Route path='*' element={
                <div className='flex w-screen h-screen justify-center items-center'>
                    <h1 className='text-8xl text-center'>404 Page Not Found</h1>
                </div>
            }/>
        </Routes>
    )
}

export default App
