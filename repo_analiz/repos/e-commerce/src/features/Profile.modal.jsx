import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Person } from '@mui/icons-material';
import { accessTokenStore, isAuthStore, refreshTokenStore } from '../store/IsAuth-store';
import { Link, useNavigate } from 'react-router-dom';
import { userDataStore } from '../store/User-store';

export default function MenuProfile({navLink}) {

    const { setAccessToken } = accessTokenStore()
    const { setRefreshToken } = refreshTokenStore()
    const { resetUserData, userData } = userDataStore();
    const navigate = useNavigate()
    const { setIsAuth } = isAuthStore()

    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <React.Fragment>
                    <Button variant="text" {...bindTrigger(popupState)}>
                        {
                            userData.avatar || userData.fullName ? (
                                <div className='flex space-x-2.5 items-end'>
                                    <img src={userData.avatar ? userData.avatar : "https://www.w3schools.com/howto/img_avatar.png"} alt="" className='block size-[30px] rounded-full' /> <p className='max-md:hidden'>{userData.fullName} </p>
                                </div>
                            ) : <div className='flex space-x-2.5 items-end'>
                                <Person></Person>
                                <p className='max-md:hidden'>{userData.fullName || "Full Name"} </p>
                            </div>
                        }

                    </Button>
                    <Menu {...bindMenu(popupState)}>
                        <MenuItem onClick={popupState.close}>{navLink}</MenuItem>
                        <MenuItem onClick={(e) => {
                            setAccessToken(null)
                            setRefreshToken(null)
                            resetUserData()
                            popupState.close()
                            navigate("/sign")
                            setIsAuth(false)
                        }}>Logout</MenuItem>
                    </Menu>
                </React.Fragment>
            )}
        </PopupState>
    );
}
