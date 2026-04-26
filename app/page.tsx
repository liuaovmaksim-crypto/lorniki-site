"use client";

import Notifications from "./components/Notifications";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "./components/Sidebar";
import LivingBackground from "./components/LivingBackground";
import { supabase } from "./lib/supabase";

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

function dbToUser(row: any): UserProfile {
  return {
    id: row.id,
    nickname: row.nickname,
    role: row.role,
    faction: row.faction,
    status: row.status,

    warnings: row.warnings ?? 0,
    reprimands: row.reprimands ?? 0,
    timeoutUntil: row.timeout_until ?? null,

    isModerator: row.is_moderator ?? false,
    isOwner: row.is_owner ?? false,

    discordId: row.discord_id ?? null,
    discordName: row.discord_name ?? null,
    discordAvatar: row.discord_avatar ?? null,
    steamId: row.steam_id ?? null,

    bio: row.bio ?? "",
    reputation: row.reputation ?? 0,
    badges: row.badges ?? [],
    profileComments: row.profile_comments ?? [],
    punishmentHistory: row.punishment_history ?? [],
  };
}

function userToDb(user: UserProfile) {
  return {
    id: user.id,
    nickname: user.nickname,
    role: user.role,
    faction: user.faction,
    status: user.status,

    warnings: user.warnings,
    reprimands: user.reprimands,
    timeout_until: user.timeoutUntil,

    is_moderator: user.isModerator,
    is_owner: user.isOwner,

    discord_id: user.discordId,
    discord_name: user.discordName,
    discord_avatar: user.discordAvatar,
    steam_id: user.steamId,

    bio: user.bio,
    reputation: user.reputation,
    badges: user.badges,
    profile_comments: user.profileComments,
    punishment_history: user.punishmentHistory,
  };
}

export default function Home() {
  const { data: session } = useSession();

  const [open, setOpen] = useState(true);
  const [page, setPage] = useState("Главная");
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultUser);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [viewedUser, setViewedUser] = useState<UserProfile | null>(null);

  async function loadUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Ошибка загрузки пользователей:", error);
      setUsers([defaultUser]);
      return;
    }

    const loadedUsers = (data || []).map(dbToUser);

    if (loadedUsers.length === 0) {
      const { error: insertError } = await supabase
        .from("users")
        .insert(userToDb(defaultUser));

      if (insertError) {
        console.error("Ошибка создания defaultUser:", insertError);
      }

      setUsers([defaultUser]);
      setCurrentUser(defaultUser);
      return;
    }

    setUsers(loadedUsers);
  }

  useEffect(() => {
    const savedSettings = localStorage.getItem("kamiko-settings");

    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }

    loadUsers();
  }, []);

  useEffect(() => {
    async function syncDiscordUser() {
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

      const { data: existingRows, error } = await supabase
        .from("users")
        .select("*")
        .eq("discord_id", discordId)
        .limit(1);

      if (error) {
        console.error("Ошибка поиска пользователя:", error);
        return;
      }

      const existing = existingRows?.[0];

      if (existing) {
        const updatedUser: UserProfile = {
          ...dbToUser(existing),
          discordId,
          discordName: sessionUser.name || existing.discord_name,
          discordAvatar: sessionUser.image || existing.discord_avatar,
        };

        await supabase
          .from("users")
          .update(userToDb(updatedUser))
          .eq("id", updatedUser.id);

        setCurrentUser(updatedUser);
        await loadUsers();
        return;
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

      const { error: insertError } = await supabase
        .from("users")
        .insert(userToDb(newUser));

      if (insertError) {
        console.error("Ошибка создания пользователя:", insertError);
        return;
      }

      setCurrentUser(newUser);
      await loadUsers();
    }

    syncDiscordUser();
  }, [session]);

  useEffect(() => {
    localStorage.setItem("kamiko-settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!canAccessPage(currentUser, page)) {
      setPage("Главная");
    }
  }, [currentUser, page]);

  async function updateUser(userId: number, patch: Partial<UserProfile>) {
    const user = users.find((item) => item.id === userId);
    if (!user) return;

    const updatedUser: UserProfile = {
      ...user,
      ...patch,
    };

    setUsers((current) =>
      current.map((item) => (item.id === userId ? updatedUser : item))
    );

    if (currentUser.id === userId) {
      setCurrentUser(updatedUser);
    }

    const { error } = await supabase
      .from("users")
      .update(userToDb(updatedUser))
      .eq("id", userId);

    if (error) {
      console.error("Ошибка обновления пользователя:", error);
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