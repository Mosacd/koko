import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./layout"
import HomePage from "./pages/homePage"
import LanguageCatalog from "./pages/catalog"
import LangyageExercises from "./pages/languagePage"
import ExercisePage from "./pages/exercisePage"
import HandGestureRecognizer from "./pages/test"

import AboutUs from "./pages/aboutUsPage"


function App() {


  return (
    
    <Routes>
    <Route  element = {<Layout/>}>
    <Route  index element = {<Navigate to={'/home'}/>} />
    <Route  path='/home' element = {<HomePage/>} />
    <Route path='/catalog' element= {<LanguageCatalog/>} />
    <Route path='/catalog/:lang' element= {<LangyageExercises/>} />
    <Route path='/catalog/:lang/:ex' element= {<ExercisePage/>} />
    <Route path="/whatever" element={<HandGestureRecognizer/>}/>
    <Route path="/aboutUs" element={<AboutUs/>}/>
    
   </Route>
   <Route path='*' element = {<div className='flex w-screen h-screen justify-center items-center'><h1 className='text-8xl text-center'>404 Page Not Found</h1></div>} />
  </Routes>


  )
}

export default App
