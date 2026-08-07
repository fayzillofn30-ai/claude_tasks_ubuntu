import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { CircularProgress, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { isDarkStore } from './store/Them.store'
import Header from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { isLoadingStore } from './store/isLoading-store'
import SimpleSlider from './pages/Sign'
import Sign from './pages/Sign'
import PropertiyAdd from './pages/PropertiyAdd'
import Footer from './components/Footer'
import Otp from './pages/Otp'
import Properties from './pages/Properties'
import { userDataStore } from './store/User-store'
import { apiStore } from './service/api'
import DashboardPage from './pages/Dashboard'
import ProfileMain from './utils/profile-utils/Profile-main'
import Layout from './layout/Layout'
import View from './pages/View'

function App() {

  const { isDark } = isDarkStore()
  const { isLoadingModal } = isLoadingStore()
  const darkTheme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
    },

  })

  const { resetUserData, userData, setUserData } = userDataStore();
  const { api } = apiStore()

  useEffect(() => {
    !!localStorage.getItem("accessToken") ? api.get("/users/get-my").then((req) => {
      const user = req.data.user
      Object.keys(user).forEach(field => {
        if (field === "fullName") {
          setUserData("firstName", user[field].split(" ")[0])
          setUserData("lastName", user[field].split(" ").at(-1))
          setUserData(field, user[field])
          return
        } else {
          setUserData(field, user[field])
        }
      })
    }) : ""
  }, [])

  const [propertyViewId,setPropertyViewId] = useState(null)

  const setViewId = (id) => {
    CoPresentOutlined.log(id)
  }

  useEffect(() => console.log(propertyViewId),[propertyViewId])

  return (
    <div className='w-full min-h-screen scroll-m-0'>
      <ThemeProvider theme={darkTheme} >
        <div className={`inset-0 bg-[rgba(1,0,0,0.7)] flex items-center justify-center w-screen h-screen fixed z-50 ${isLoadingModal ? "" : "hidden"}`}>
          <CircularProgress size={150}>

          </CircularProgress>
        </div>
        <CssBaseline />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path='/' element={<Home propertyViewId={propertyViewId} setView={setViewId}/>} />
              <Route path='/sign' element={<Sign />} />
              <Route path='/add-property' element={<PropertiyAdd />} />
              <Route path='/otp' element={<Otp />} />
              <Route path='/properties' element={<Properties propertyViewId={propertyViewId} setView={setViewId}/>} />

              <Route path='/dashboard' element={<DashboardPage propertyViewId={propertyViewId} setView={setViewId}/>}>
                <Route index element={<ProfileMain />} />
                <Route path="my" element={<ProfileMain />}/>
                <Route path="properties" element={<Properties propertyViewId={propertyViewId} setView={setViewId}/>}/>
              </Route>
              <Route path='/view' element={<View propertyViewId={propertyViewId} setView={setViewId}/>}/>
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  )
}

export default App
