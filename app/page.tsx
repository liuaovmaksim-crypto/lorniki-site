"use client";

import Notifications from "./components/Notifications";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import LivingBackground from "./components/LivingBackground";

import {
  AdminPage,
  FeedPage,
  HomePage,
  InfoPage,
  ProfilePage,
  QuotaPage,
  ReglamentPage,
  RulesPage,
  SettingsPage,
  SuggestionsPage,
  TextPage,
} from "./components/Pages";

import {
  canAccessPage,
  defaultSettings,
  defaultUser,
  Settings,
  themes,
  UserProfile,
} from "./components/config";

export default function Home() {
  const [open, setOpen] = useState(true);
  const [page, setPage] = useState("Главная");
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultUser);

  useEffect(() => {
    const savedSettings = localStorage.getItem("kamiko-settings");
    const savedUser = localStorage.getItem("kamiko-user");

    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }

    if (savedUser) {
      setCurrentUser({ ...defaultUser, ...JSON.parse(savedUser) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kamiko-settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("kamiko-user", JSON.stringify(currentUser));

    if (!canAccessPage(currentUser, page)) {
      setPage("Главная");
    }
  }, [currentUser, page]);

  function selectTheme(themeId: string) {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    setSettings((s) => ({
      ...s,
      theme: theme.id,
      accent: theme.accent,
      second: theme.second,
    }));
  }

  const isLight = settings.mode === "light";

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-500 ${
        isLight ? "bg-[#f3ede7] text-[#1b1010]" : "bg-[#030203] text-[#f8efe7]"
      }`}
      style={
        {
          "--accent": settings.accent,
          "--second": settings.second,
          "--glow": `${Math.round(settings.glow / 2)}px`,
          "--softGlow": `${Math.round(settings.glow / 4)}px`,
          "--fog": settings.fog / 100,
          "--particles": settings.particles / 100,
        } as React.CSSProperties
      }
    >
      <LivingBackground isLight={isLight} settings={settings} />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          open={open}
          setOpen={setOpen}
          page={page}
          setPage={setPage}
          currentUser={currentUser}
        />

        <section className="flex-1 px-8 py-6">
          <header className="flex items-center gap-4">
            <Notifications currentUser={currentUser} />
            <div className="flex flex-1 items-center rounded-full border border-white/10 bg-black/30 px-6 py-4 backdrop-blur-xl">
              <span className="text-white/35">⌕</span>
              <input
                placeholder="Поиск по архиву Kamiko.mi..."
                className="ml-3 w-full bg-transparent outline-none placeholder:text-white/25"
              />
            </div>

            <button
              onClick={() => setPage("Профиль")}
              className="rounded-full bg-white px-7 py-4 font-black text-black shadow-[0_0_var(--glow)_var(--accent)] transition hover:scale-105 active:scale-95"
            >
              Войти через Steam
            </button>
          </header>

          <section className="relative mt-10 max-w-6xl pl-12 pt-16">
            {page === "Главная" && <HomePage setPage={setPage} />}
            {page === "Живая лента" && <FeedPage currentUser={currentUser} />}
            {page === "Информация" && <InfoPage />}
            {page === "Квоты" && <QuotaPage currentUser={currentUser} />}
            {page === "Правила" && <RulesPage />}
            {page === "Регламент" && <ReglamentPage />}
            {page === "Предложения" && (
              <SuggestionsPage currentUser={currentUser} />
            )}
            {page === "Профиль" && <ProfilePage currentUser={currentUser} />}
            {page === "Настройки" && (
              <SettingsPage
                settings={settings}
                setSettings={setSettings}
                selectTheme={selectTheme}
              />
            )}
            {page === "Админ-панель" && (
              <AdminPage
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            )}
          </section>
        </section>
      </div>
    </main>
  );
}