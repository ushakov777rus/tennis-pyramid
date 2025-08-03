"use client";

import { useState } from "react";
import "./LoginModal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function LoginModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // чтобы не закрывалась при клике внутрь
      >
        <h2>Вход</h2>
        <form className="login-form">
          <input type="text"/>
          <input type="password" placeholder="Пароль" required />
          <button type="submit">Войти</button>
        </form>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}