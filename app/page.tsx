"use client";

import Notifications from "./components/Notifications";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "./components/Sidebar";
import LivingBackground from "./components/LivingBackground";

import {
  AdminPage,
  FeedPage,
  HomePage,
  InfoPage,
  PlayersPage,
  ProfilePage,
  QuotaPage,
  ReglamentPage,
  RulesPage,
  SettingsPage,
  SuggestionsPage,
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
  const { data: session } = useSession();

  const [open, setOpen] = useState(true);
  const [page, setPage] = useState("Главная");
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultUser);
  const [users, setUsers] = useState<UserProfile[]>([defaultUser]);
  const [viewedUser, setViewedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem("kamiko-settings");
    const savedUser = localStorage.getItem("kamiko-user");
    const savedUsers = localStorage.getItem("kamiko-users");

    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }

    if (savedUser) {
      setCurrentUser({ ...defaultUser, ...JSON.parse(savedUser) });
    }

    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      setUsers(parsedUsers.length > 0 ? parsedUsers : [defaultUser]);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    const sessionUser = session.user as {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };

    const discordId =
      sessionUser.id || sessionUser.email || sessionUser.name || null;

    if (!discordId) return;

    setUsers((current) => {
      const existing = current.find((user) => user.discordId === discordId);

      if (existing) {
        const updatedUser: UserProfile = {
          ...existing,
          discordId,
          discordName: sessionUser.name || existing.discordName,
          discordAvatar: sessionUser.image || existing.discordAvatar,
        };

        setCurrentUser(updatedUser);

        return current.map((user) =>
          user.id === existing.id ? updatedUser : user
        );
      }

      const newUser: UserProfile = {
        ...defaultUser,
        id: Date.now(),
        nickname: sessionUser.name || "Новый игрок",
        discordId,
        discordName: sessionUser.name || "Discord User",
        discordAvatar: sessionUser.image || null,
        role: "Гость",
        faction: "Скитальцы",
        status: "Ожидает регистрации",
        isOwner: false,
        isModerator: false,
        warnings: 0,
        reprimands: 0,
        timeoutUntil: null,
        badges: ["Новичок"],
        bio: "",
        reputation: 0,
        profileComments: [],
        punishmentHistory: [],
      };

      setCurrentUser(newUser);

      return [...current, newUser];
    });
  }, [session]);

  useEffect(() => {
    localStorage.setItem("kamiko-settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("kamiko-user", JSON.stringify(currentUser));

    if (!canAccessPage(currentUser, page)) {
      setPage("Главная");
    }
  }, [currentUser, page]);

  useEffect(() => {
    localStorage.setItem("kamiko-users", JSON.stringify(users));
  }, [users]);

  function updateUser(userId: number, patch: Partial<UserProfile>) {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId ? { ...user, ...patch } : user
      )
    );

    if (currentUser.id === userId) {
      setCurrentUser((user) => ({ ...user, ...patch }));
    }
  }

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
              onClick={() => {
                setViewedUser(null);
                setPage("Профиль");
              }}
              className="rounded-full bg-white px-7 py-4 font-black text-black shadow-[0_0_var(--glow)_var(--accent)] transition hover:scale-105 active:scale-95"
            >
              Мой профиль
            </button>
          </header>

          <section className="relative mt-10 max-w-6xl pl-12 pt-16">
            {page === "Главная" && <HomePage setPage={setPage} />}

            {page === "Живая лента" && <FeedPage currentUser={currentUser} />}

            {page === "Игроки" && (
              <PlayersPage
                users={users}
                currentUser={currentUser}
                setPage={setPage}
                setViewedUser={setViewedUser}
                updateUser={updateUser}
              />
            )}

            {page === "Информация" && <InfoPage />}

            {page === "Квоты" && <QuotaPage currentUser={currentUser} />}

            {page === "Правила" && <RulesPage />}

            {page === "Регламент" && <ReglamentPage />}

            {page === "Предложения" && (
              <SuggestionsPage currentUser={currentUser} />
            )}

            {page === "Профиль" && (
              <ProfilePage currentUser={currentUser} viewedUser={viewedUser} />
            )}

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