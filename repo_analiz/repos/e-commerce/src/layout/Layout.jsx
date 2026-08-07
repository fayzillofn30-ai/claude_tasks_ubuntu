import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Layout({ children }) {
    const location = useLocation()

    const hideHeaderFooter = location.pathname.includes("dashboard")

    return (
        <>
            {!hideHeaderFooter && <Header />}
            {children}
            {!hideHeaderFooter && <Footer />}
        </>
    )
}

export default Layout