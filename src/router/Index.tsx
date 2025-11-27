import { Route, Routes } from 'react-router-dom'
import LogIn from '../pages/LogIn'

function Index() {
  return (
    <Routes>

      <Route path='/LogIn' element={
        <LogIn/>
      }/>
      
    </Routes>
  )
}

export default Index