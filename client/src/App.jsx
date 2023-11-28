// import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Formulario from './pages/Formulario'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import Inicio from './pages/Inicio'
import InicioAdministrador from './pages/InicioAdministrador'
import InicioAsesor from './pages/InicioAsesor'

function App() {
  // const [count, setCount] = useState(0)

  return (
  <>
  <div className='container'>
  <Navbar/>
      <Routes>
        <Route path='/' element={<Inicio/>}/>
        <Route  path='/nuevo' element={<Formulario/>}/>
        <Route path='/administrador' element={< InicioAdministrador/>}/>
        <Route path='/asesor' element={< InicioAsesor/>}/>
        <Route  path='*' element={<NotFound/>}/>
      </Routes>
      </div>
    </>
  )
}



export default App