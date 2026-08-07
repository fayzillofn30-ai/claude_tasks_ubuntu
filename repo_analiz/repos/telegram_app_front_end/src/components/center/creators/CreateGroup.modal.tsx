"use client";

import { Button, Dialog, DialogContent, DialogTitle, Input, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect } from "react";
import * as UIState from "@/store/ui_store/store"
import { Groupes } from "@/features";

export const CreateGroupModal: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isOpenGroupModal: open, toggleGroupCreateModal } = UIState.useUIStore()
  
  const onClose = () => {
    setTitle("");
    setDescription("");
    setLogo(null);
    setLogoPreview(null);
    toggleGroupCreateModal();
  };

  // Logo fayl o'zgarganda preview yaratish
  useEffect(() => {
    if (!logo) {
      setLogoPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(logo);
    setLogoPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [logo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title bo‘sh bo‘lmasligi kerak");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (logo) formData.append("logo", logo);

      // Agar Groupes.createGroup FormData ni qabul qilmasa, uni moslashtiring
      const res = await Groupes.createGroup(formData);
      console.log(res)
      onClose();
    } catch (err) {
      console.error("❌ Guruh yaratishda xato:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="flex justify-between items-center">
          Yangi Guruh yaratish
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            placeholder="Group nomi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            placeholder="Tavsif (ixtiyoriy)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Logo upload input */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setLogo(e.target.files[0]);
              }
            }}
          />

          {/* Logo preview */}
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo preview"
              className="w-24 h-24 rounded-md object-cover mt-2 border"
            />
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Yaratilmoqda..." : "Yaratish"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
