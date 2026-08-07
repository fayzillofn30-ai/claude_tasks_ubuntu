import React, { useEffect } from 'react'
import { userDataStore } from '../store/User-store'
import { List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Avatar, Divider, MenuItem, TextField, Button } from '@mui/material'
import { DarkMode, Dashboard, Email, LightMode, Person3 } from '@mui/icons-material'
import MenuProfile from '../features/Profile.modal'
import { Link, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import FieldBox from '../utils/SIgn-utils/Field'
import profile_bg from "../assets/profile_bg.jpg"
import { isDarkStore } from '../store/Them.store'
import ProfileMain from '../utils/profile-utils/Profile-main'

function DashboardPage({propertyViewId, setView}) {
    const { userData, setUserData } = userDataStore()
    const { firstName, lastName, email, avatar } = userData

    const url = useLocation()


    const handleKeyDown = () => {

    }

    return (
        <main className="w-full h-screen flex max-md:flex-col-reverse">
            <div className="flex w-1/5">
                <div className="flex flex-col w-full  h-screen border-r-2 max-md:h-max">
                    <List className='max-md:flex max-md:gap-10'>
                        <ListItem>
                            <MenuProfile  le navLink={<Link to="/">Home</Link>} />
                        </ListItem>

                        <Divider />
                        <ListItem
                            component={NavLink}
                            to="my"
                        >
                            <ListItemIcon>
                                <Person3 />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItem>
                        <ListItem
                            component={NavLink}
                            to="properties"
                        >
                            <ListItemIcon>
                                <Dashboard />
                            </ListItemIcon>
                            <ListItemText primary="Properties" />
                        </ListItem>
                    </List>
                </div>
            </div>
            <div className="w-full min-h-screen " style={{
                backgroundImage: `url(${profile_bg})`
            }}>
                <Outlet />
            </div>
        </main>
    )
}

export default DashboardPage
