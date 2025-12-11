import { Route, Routes } from 'react-router-dom'
import LogIn from '../pages/LogInPage'
import SignUp from '../pages/SingUpPage'
import Home from '../pages/HomePage'
import PostPage from '../pages/PostPage'
import CreateNewPost from '../pages/CreateNewPost'
import SearchPage from '../pages/SearchPage'
import UserPage from '../pages/UserPage'
import TopicPage from '../pages/TopicPage'
import ProfilePage from '../pages/ProfilePage'
import NotFound from '../pages/NotFound'
import MainLayout from '../layouts/MainLayout'
import ProtectedRouter from './ProtectedRouter'

function Index() {
  return (
    <Routes>
      <Route element={<MainLayout/>}> 
        <Route element={<ProtectedRouter/>}>
          <Route path='/' element={
              <Home/>
          }/>
          <Route path='/post/:id' element={
              <PostPage/>
          }/>
          <Route path='/create' element={
            <CreateNewPost/>
          }/>
          <Route path='/search' element={
            <SearchPage/>
          }/>
          <Route path='/user/:userName' element={
            <UserPage/>
          }/>
          <Route path='/profile' element={
            <ProfilePage/>
          }/>
          <Route path='/topic/:topicId' element={
            <TopicPage/>
          }/>
        </Route>
      </Route>

      <Route path='/singUp' element={
        <SignUp/>
      }/>
      <Route path='login' element={
        <LogIn/>
      }/>
      <Route path='*' element={
        <NotFound/>
      }/>
    </Routes>
    
  )
}

export default Index