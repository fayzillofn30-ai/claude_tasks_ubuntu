"use client";

import { useUserStore } from "@/store/user.store";
import {
  Menu,
  MenuItem,
  Button,
  MenuList,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import * as UIState from "@/store/ui_store/store";
import { useRouter } from "next/navigation";
import CloseIcon from '@mui/icons-material/Close';
import { CreateGroupModal } from "../center/creators/CreateGroup.modal";
import { CreateChannelModal } from "../center/creators/CreateCHannelModal";

function LeftMenu() {
  const { user } = useUserStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    left,
    toggleLeft,
    toggleGroupCreateModal,
    toggleChannelCreateModal,
    isOpenChannelModal,
    isOpenGroupModal,
  } = UIState.useUIStore();
  const router = useRouter();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);
  const isOpen = Boolean(anchorEl);

  // 🔹 Logout handler
  const logoutHandler = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("sessionToken");
      router.push("/sign");
    }
    handleCloseMenu();
  };

  const handleCloseModal = (toggle: () => void) => {
    toggle();
    if (left) toggleLeft();
  };

  return (
    <div
      className={`absolute top-0 w-[410px] bg-amber-50 z-10 border h-screen p-6 transition-all ${
        left ? "left-0" : "-left-[410px]"
      }`}
      onClick={() => {
        if (left && anchorEl) toggleLeft();
      }}
    >
      {/* Header: user info, menu button and close button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h1 className="font-semibold text-lg">
            {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Menu button */}
          <Button onClick={handleOpen} variant="outlined">
            Menu
          </Button>

          {/* Close button */}
          <IconButton
            aria-label="close left menu"
            onClick={() => toggleLeft()}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>

        <Menu anchorEl={anchorEl} open={isOpen} onClose={handleCloseMenu}>
          {user ? (
            <MenuList>
              <MenuItem onClick={handleCloseMenu}>{user.firstName}</MenuItem>
              <MenuItem onClick={logoutHandler}>Chiqish</MenuItem>
            </MenuList>
          ) : (
            <MenuItem
              onClick={() => {
                router.push("/sign");
                handleCloseMenu();
              }}
            >
              Kirish
            </MenuItem>
          )}
        </Menu>
      </div>

      {/* Buttons for modals */}
      <List>
        <ListItem>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleCloseModal(toggleGroupCreateModal)}
          >
            Create group
          </Button>
        </ListItem>
        <ListItem className="mt-3">
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleCloseModal(toggleChannelCreateModal)}
          >
            Create Channel
          </Button>
        </ListItem>
      </List>

      {/* Modals rendered separately */}
      {isOpenGroupModal && <CreateGroupModal />}
      {isOpenChannelModal && <CreateChannelModal />}
    </div>
  );
}

export default LeftMenu;
