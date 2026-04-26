import { canAccessPage, menu, UserProfile } from "./config";

export default function Sidebar({
  open,
  setOpen,
  page,
  setPage,
  currentUser,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  page: string;
  setPage: (value: string) => void;
  currentUser: UserProfile;
}) {
  const visibleMenu = menu.filter((item) => canAccessPage(currentUser, item));

  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 overflow-hidden transition-all duration-500 ${
        open ? "w-72" : "w-24"
      }`}
    >
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent opacity-50" />

      <div className="flex h-full flex-col overflow-hidden px-5 py-5">
        <button
          onClick={() => setOpen(!open)}
          className="mb-5 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 bg-black/40 text-white shadow-[0_0_var(--softGlow)_var(--accent)] transition hover:scale-110 active:scale-95"
        >
          ☰
        </button>

        {open && (
          <div className="mb-5 shrink-0">
            <p className="text-[10px] tracking-[0.55em] opacity-50">
              KAMIKO.MI
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight">
              Архив лорников
            </h1>
            <p className="mt-2 text-xs text-white/35">
              Роль: {currentUser.role}
              {currentUser.isModerator && currentUser.role !== "Владелец"
                ? " · Модерация"
                : ""}
            </p>
          </div>
        )}

        <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-4 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-1.5">
            {visibleMenu.map((item, i) => (
              <button
                key={item}
                onClick={() => setPage(item)}
                className={`group flex min-w-0 items-center gap-4 text-left transition duration-300 hover:translate-x-2 active:scale-95 ${
                  page === item ? "translate-x-2" : ""
                }`}
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border bg-black/45 text-white duration-300 ${
                    page === item
                      ? "border-white/40 shadow-[0_0_var(--softGlow)_var(--accent)]"
                      : "border-white/10"
                  }`}
                >
                  {i + 1}
                </span>

                {open && (
                  <span className="relative truncate font-bold opacity-80 duration-300 group-hover:opacity-100">
                    {item}
                    <span
                      className={`absolute -bottom-2 left-0 h-px bg-[var(--accent)] duration-300 ${
                        page === item ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {open && (
          <div className="shrink-0 pt-5">
            <button
              onClick={() => setPage("Профиль")}
              className={`w-full rounded-full border px-4 py-3 text-left backdrop-blur-xl transition hover:scale-[1.02] active:scale-95 ${
                page === "Профиль"
                  ? "border-[var(--second)]/50 bg-[var(--second)]/10 shadow-[0_0_var(--softGlow)_var(--second)]"
                  : "border-white/10 bg-black/35 hover:border-[var(--second)]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--second)]/30 bg-[var(--second)]/10 text-white">
                  {currentUser.nickname[0] || "?"}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-black text-white">
                    {currentUser.nickname}
                  </p>
                  <p className="truncate text-xs text-white/35">
                    {currentUser.role} · {currentUser.faction}
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}