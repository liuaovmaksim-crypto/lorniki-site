"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function DiscordLoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button className="w-full rounded-full border border-white/10 bg-white/[0.03] px-6 py-4 font-bold text-white/60">
        Проверка Discord...
      </button>
    );
  }

  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className="w-full rounded-full border border-emerald-400/30 bg-emerald-500/10 px-6 py-4 font-bold text-emerald-100 transition hover:bg-emerald-500/20"
      >
        Discord подключён
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("discord")}
      className="w-full rounded-full border border-white/10 bg-white/[0.03] px-6 py-4 font-bold transition hover:bg-white/10"
    >
      Подключить Discord
    </button>
  );
}