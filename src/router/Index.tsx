import { Route, Routes } from 'react-router-dom'
import LogIn from '../pages/LogIn'
import SignUp from '../pages/SingUp'

function Index() {
  return (
    <Routes>

      <Route path='*' element={
        <LogIn/>
      }/>
      <Route path='/' element={
        <SignUp/>
      }/>
    </Routes>
    
  )
}

export default Index