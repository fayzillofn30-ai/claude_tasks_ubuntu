import { isDarkStore } from "../store/Them.store"
import logo from "../assets/Vector.png"
import { Button, List, ListItem } from "@mui/material"
import { DarkMode, LightMode, Person, Person2 } from "@mui/icons-material"
import { isAuthStore } from "../store/IsAuth-store"
import { Link, NavLink, useLocation } from "react-router-dom"
import MenuProfile from "../features/Profile.modal"

function Header() {

    const { isDark, setIsDark } = isDarkStore()
    const {isAuth,setIsAuth} = isAuthStore()

    const location = useLocation()

    return (
        <header id="head" className={`${!isDark ? "bg-gray-400" : "bg-gray-800"} ${location.pathname !== "/sign" ? "" : "hidden"} w-full shadow-2xl`}>
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-x-2.5">
                    <img src={logo} alt="" />
                    <h2>Logo</h2>
                </div>
                <List className="flex justify-between">
                    <ListItem>
                        <NavLink to="/"> Home</NavLink>
                    </ListItem>
                    <ListItem>
                       <NavLink to={"/properties"}> Properties</NavLink>
                    </ListItem>
                    <ListItem>
                        Contact
                    </ListItem>
                </List>
                <div>

                    <Button onClick={() => setIsDark(!isDark)} sx={{position : "fixed" ,right : 25, top : 100,zIndex : 2000}}> 
                        {
                            !isDark ? <DarkMode></DarkMode> : <LightMode></LightMode> 
                        }
                    </Button>
                    {
                        isAuth ? <MenuProfile navLink={<Link to="/dashboard">Dashboard</Link>}/>: <NavLink to="/sign">Sign</NavLink>
                    }
                </div>
            </div>
        </header>
    )
}

export default Header