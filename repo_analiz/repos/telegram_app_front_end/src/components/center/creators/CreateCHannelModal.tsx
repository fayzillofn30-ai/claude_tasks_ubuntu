"use client";

import { Button, Dialog, DialogContent, DialogTitle, Input } from "@mui/material";
import React, { useState } from "react";
import * as UIState from "@/store/ui_store/store"
import { Channels } from "@/features";


export const CreateChannelModal: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const {isOpenChannelModal : open,toggleChannelCreateModal } = UIState.useUIStore()
  
  const onClose = () => toggleChannelCreateModal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title bo‘sh bo‘lmasligi kerak");

    setLoading(true);
    try {
      const res = await Channels.createChannel({title : title,description : description});
      console.log(res)
      setTitle("");
      setDescription("");
      onClose();
    } catch (err) {
      console.error("❌ Guruh yaratishda xato:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} onClick={toggleChannelCreateModal}>
      <DialogContent className="sm:max-w-md">
          <DialogTitle>Yangi Channel yaratish</DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            placeholder="Channel nomi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            placeholder="Tavsif (ixtiyoriy)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Yaratilmoqda..." : "Yaratish"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
