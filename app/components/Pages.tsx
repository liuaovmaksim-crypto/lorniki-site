"use client";
import { useSession } from "next-auth/react";
import DiscordLoginButton from "./DiscordLoginButton";
import { addNotification } from "./Notifications";
import { useEffect, useState } from "react";
import {
  defaultSettings,
  Role,
  roles,
  Settings,
  themes,
  UserProfile,
} from "./config";

type CommentItem = {
  id: number;
  author: string;
  text: string;
  time: string;
};

type PostItem = {
  id: number;
  author: string;
  role: string;
  group: string;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
  reposts: number;
  reposted: boolean;
  comments: CommentItem[];
};

type SuggestionItem = {
  id: number;
  author: string;
  title: string;
  text: string;
  likes: number;
  liked: boolean;
  status: string;
  createdAt: string;
};

type ChatMessage = {
  id: number;
  author: string;
  text: string;
  time: string;
};

type AdminLog = {
  id: number;
  type: string;
  actor: string;
  target: string;
  details: string;
  time: string;
};

const factionGroups = ["Истребители", "Демоны", "Скитальцы"];

const startPosts: PostItem[] = [
  {
    id: 1,
    author: "Kamiko System",
    role: "Система",
    group: "Объявления",
    content:
      "Живая лента запущена в тестовом режиме. Теперь посты, комментарии и реакции сохраняются локально.",
    time: "сейчас",
    likes: 12,
    liked: false,
    reposts: 2,
    reposted: false,
    comments: [
      {
        id: 1,
        author: "Yuto",
        text: "Ждём полноценную систему лорников.",
        time: "1 мин назад",
      },
    ],
  },
];

const startSuggestions: SuggestionItem[] = [
  {
    id: 1,
    author: "Kamiko System",
    title: "Раздел предложений открыт",
    text: "Здесь можно оставлять идеи по улучшению сайта, интерфейса, ленты, ролей и будущих систем.",
    likes: 4,
    liked: false,
    status: "На рассмотрении",
    createdAt: "сейчас",
  },
];

const startSuggestionChat: ChatMessage[] = [
  {
    id: 1,
    author: "Kamiko System",
    text: "Чат предложений открыт. Здесь можно обсуждать идеи для сайта.",
    time: "сейчас",
  },
];

function nowLabel() {
  return new Date().toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function readLogs(): AdminLog[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("kamiko-admin-logs");
  return saved ? JSON.parse(saved) : [];
}

function writeLog(log: Omit<AdminLog, "id" | "time">) {
  if (typeof window === "undefined") return;

  const logs = readLogs();

  const newLog: AdminLog = {
    id: Date.now(),
    time: nowLabel(),
    ...log,
  };

  localStorage.setItem("kamiko-admin-logs", JSON.stringify([newLog, ...logs]));
}

export function HomePage({ setPage }: { setPage: (page: string) => void }) {
  return (
    <>
      <p className="text-[11px] font-bold tracking-[0.65em] opacity-45">
        DEMON NIGHT ARCHIVE
      </p>

      <h2 className="mt-7 text-7xl font-black leading-[1.03]">
        Kamiko.mi
        <br />
        <span style={{ color: "var(--accent)" }}>центр живого лора.</span>
      </h2>

      <p className="mt-7 max-w-2xl text-lg leading-8 opacity-60">
        Закрытая платформа для лорников: лента, предложения, квоты, правила и
        внутренний регламент.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <button
          onClick={() => setPage("Профиль")}
          className="rounded-full bg-white px-8 py-4 font-black text-black shadow-[0_0_var(--glow)_var(--accent)] transition hover:scale-105 active:scale-95"
        >
          Получить доступ →
        </button>

        <button
          onClick={() => setPage("Информация")}
          className="rounded-full border border-white/15 bg-black/25 px-8 py-4 font-bold text-white backdrop-blur-xl transition hover:scale-105 hover:bg-white/10 active:scale-95"
        >
          Ознакомиться
        </button>
      </div>

      <div className="mt-16 grid gap-8 xl:grid-cols-3">
        <GuideCard
          title="Правила"
          text="Первое, что должен прочитать новый лорник перед работой."
          mark="壱"
          onClick={() => setPage("Правила")}
        />
        <GuideCard
          title="Регламент"
          text="Внутренний порядок, обязанности и структура работы."
          mark="弐"
          onClick={() => setPage("Регламент")}
        />
        <GuideCard
          title="Квоты"
          text="Нормы активности, отчёты и требования для лорников."
          mark="参"
          onClick={() => setPage("Квоты")}
        />
      </div>
    </>
  );
}

export function InfoPage() {
  return (
    <>
      <SectionTitle title="Информация" subtitle="система лорников Kamiko" />

      <div className="mt-10 max-w-5xl rounded-[34px] border border-white/10 bg-black/35 p-6 text-white backdrop-blur-xl">
        <h3 className="text-2xl font-black">Что здесь находится?</h3>
        <p className="mt-4 leading-8 text-white/60">
          Этот раздел предназначен для лорников Kamiko.mi. Здесь собрана полная
          информация по квотам, отчётности, наказаниям, испытательному сроку,
          вторым профам, второстепенным персонажам, AFK, поощрениям и отпускам.
          Каждый раздел можно открыть или закрыть для удобства.
        </p>
      </div>

      <div className="mt-8 max-w-5xl space-y-5">
        <InfoBlock title="📊 Система квоты" color="cyan">
{`Prime-Time для Столпов, Лун, главных героев и второстепенных лорников.

Каждый день, начиная с 15:00 до 00:00, все Столпы, Луны, главные герои и второстепенные лорники обязаны появиться на сервере и находиться на нём на протяжении 90 минут активного времени.

Примечание:
Вы не добавляете в документы отчётов скриншоты онлайна и никуда их не отправляете. РП-состав самостоятельно проверяет ваш онлайн в течение недели.

В конце каждой недели лорники обязаны отправить документ с отчётом о своей деятельности. В отчёте должно быть минимум 5 скриншотов.

Какие скриншоты не будут приняты:
— простое общение Столпов между собой;
— обычный скрин строя;
— чужой скрин, в котором вы не участвуете;
— убийство демона;
— любые похожие скриншоты без смысловой нагрузки.

Ограниченные скриншоты:
Скриншот захвата разрешается только один в отчёте.

Скриншот захвата считается, если:
— на захвате более 4 человек;
— там есть хотя бы кто-то, кроме Столпов.

Примечание:
Вы должны описать, что именно вы делаете на скриншоте.

Также чужое мероприятие, которое проводит Столп или Луна для своей квоты, не будет засчитано, если вы не вписаны в него как проводящий.

Исключение:
Главные герои, так как они являются участниками мероприятия.`}
        </InfoBlock>

        <InfoBlock title="⚖️ Система наказаний и последствия" color="red">
{`Виды наказаний:
— предупреждение;
— выговор;
— перманентный выговор.

Как работают выговоры:
Строгий выговор может быть выдан только один раз за одну ситуацию нарушения.

Максимально за одну ситуацию можно получить один перманентный выговор.

Устный выговор, то есть предупреждение, выдаётся за незначительные нарушения.

Сколько можно получить выговоров и предупреждений:
Система работает по схеме 0/3 и 0/2.

Это значит:
— максимум можно получить 2 предупреждения;
— 2 предупреждения складываются в полноценный выговор;
— при получении 3 выговоров лорник получает снятие и ЧС лорников.

Последствия получения выговоров и предупреждений:
За каждый выговор на лорника накладываются ограничения, которые могут распространяться на разные аспекты игры.

Предупреждения:
1/2 и 2/2 — предупреждения не несут строгого наказания, кроме беседы.

Однако при наборе 2/2 предупреждений они превращаются в выговор.

Выговоры:
1/3 — лорнику запрещается сетаться на вторую профу и играть на ней до снятия выговора.

2/3 — запрещено играть на второй профе, а также увеличивается онлайн-квота на 30 минут.

3/3 — снятие с лорника с выдачей ЧС.

Перманентный выговор:
Это подвыговор, который нельзя отработать или снять обычным способом.

Перманентный выговор может снять только спец-админ или выше.

Снятие по собственному желанию:
При ПСЖ лорник получает ЧС лорников на 5 дней. После этого он снова может подавать заявку на лорников.

Снятие выговоров:
При получении выговора лорник имеет право отработать его у любого представителя РП-персонала.

Между получением выговора и его отработкой должно пройти не менее 48 часов.

Отработка выговора происходит через личные сообщения. Туда нужно отправить доказательства выполненной отработки.

После проверки снимается один выговор, кроме перманентного.`}
        </InfoBlock>

        <InfoBlock title="🎭 Испытательный срок" color="violet">
{`Испытательный срок — это период, во время которого РП-персонал наблюдает за лорником, его работой и игрой на сервере.

Данный период длится ровно 14 дней обязательной игры на сервере.

Лорник будет снят при получении 1 выговора во время испытательного срока.

Продление испытательного срока:
Если во время испытательного срока лорник берёт отпуск, испытательный срок продлевается на то количество дней, на которое был взят отпуск.

Исключения:
— если сервер был закрыт на технические работы;
— если отпуск был выдан от РП-персонала;
— если была иная причина со стороны администрации или вышестоящего состава.`}
        </InfoBlock>

        <InfoBlock title="🧬 Вторые профы Столпов и Лун" color="blue">
{`Истребители:
Столпы могут вступать в любое открытое дыхание.

Также Столпы могут вступать в любое закрытое дыхание с полноценным вступлением в отряд, получением роли и без занятия слота в дыхании.

Демоны:
Луны могут вступать в любой отряд так же, как и Столпы.

Также Луны могут брать профу не выше демона низшей магии крови.

Вторая профа у Столпов и Лун доступна ИСКЛЮЧИТЕЛЬНО после отыгровки своей основной квоты.

Отпуск подразумевает полное отсутствие на сервере.

Если Столп или Луна имеет выговор, он не может переключаться на вторую профу после отыгровки квоты.

Должностные лица могут заниматься второй профой от лорников.

Примеры:
— Цугуко;
— инструкторы;
— другие подобные должности.`}
        </InfoBlock>

        <InfoBlock title="📄 Отчётность и проверка отчётности" color="green">
{`Подача отчёта:
В течение недели лорный персонаж должен заполнить свою отчётность по всем наигранным дням без отпуска.

В отчёте должно быть минимум 5 скриншотов деятельности, не включая онлайн.

Деятельность может включать:
— механику;
— РП;
— участие в мероприятиях сервера;
— мероприятия, устроенные вами;
— тренировки;
— другую полезную активность.

Важно:
В отчёте допускается максимум 1 скриншот механики.

Остальные скриншоты должны быть заполнены иной деятельностью.

Если у вас возникают проблемы с отчётом, вы обязаны оповестить РП-персонал и указать причину.

Если пропали или отсутствуют скриншоты онлайна, вы можете обратиться к РП-персоналу за логами для проверки вашей наигранной квоты.

Проверка отчётности:
Отчётность лорников проверяется каждое воскресенье.

Результаты проверки, включая наказания и другие итоги, публикуются в середине прайм-тайма понедельника.

В случае задержки отчёта лорник может отправить свой отчёт в понедельник до начала прайм-тайма.`}
        </InfoBlock>

        <InfoBlock title="👤 Второстепенные персонажи" color="amber">
{`К второстепенным персонажам относятся лорники с очень маленьким лором, которые не являются донатными.

Их набором занимается лидер фракции, в которой состоит персонаж, либо Столп/Луна, связанный с ним по лору.

При этом второстепенные персонажи также считаются частью системы лорных персонажей.

Однако они меньше курируются РП-персоналом.

Контроль со стороны РП-персонала включает:
— снятия;
— проверку отчётности;
— непосредственное наблюдение.

Кто может набирать второстепенных лорников:
Тенген — его жёны, мыши.

Мудзан — низшие луны, Накиме.

Кагая — семья Убуяшики.

Шинобу — три сестрёнки, Аой.

Руи — семья пауков.`}
        </InfoBlock>

        <InfoBlock title="⏱ AFK на сервере" color="gray">
{`AFK разрешается не более чем на 15 минут.

Перед уходом в AFK нужно оповестить игроков:
— либо в глобальный OOC-чат;
— либо в админ-чат, если есть соответствующая привилегия.

Примечание:
AFK разрешается только в зоне, где отсутствует РП и где вас не увидят другие игроки.

Примеры:
— комната Столпов;
— другие скрытые или безопасные места.

Если встать AFK в другой зоне, где это может повлиять на РП или помешать другим игрокам, может последовать наказание.`}
        </InfoBlock>

        <InfoBlock title="⭐ Система поощрения" color="emerald">
{`За выполнение квоты без ошибок и демонстрацию хорошего РП РП-персонал может выдавать очки поощрения.

Очки поощрения могут позволить:
— уменьшить квоту на неделю;
— снять выговор;
— получить более высокий шанс одобрения отпуска;
— получить другие возможные послабления.

За нарушение правил сервера, отчётности и других требований репутация лорника будет падать.

Также могут накладываться штрафы.

К штрафам относятся:
— увеличение квоты;
— более сложные отработки выговоров;
— отказ в отпуске;
— запрет на вторую профу;
— другие ограничения.`}
        </InfoBlock>

        <InfoBlock title="🌙 Система отпусков" color="purple">
{`Отпуск — это освобождение от выполнения обязанностей лорного персонажа.

Отпуск бывает двух видов:

Кратковременный отпуск:
— до недели.

Примечание:
Подходит для отдыха, временных поломок и похожих причин.

Долгосрочный отпуск:
— до месяца.

Причины:
— серьёзная болезнь;
— серьёзные поломки;
— другие веские причины.

КД отпуска рассчитывается следующим образом:
Количество дней отпуска равно количеству дней КД.

Пример:
Неделя отпуска = 1 неделя КД.

Каждый день отпуска освобождает лорника от 1 скриншота в отчётности.

Пример:
Если вы неделю были в отпуске, вам нужно не 20, а 13 скриншотов.

Примечание:
РП-персонал имеет право отказать в выдаче отпуска без объяснения причин.`}
        </InfoBlock>
      </div>
    </>
  );
}

function InfoBlock({
  title,
  children,
  color,
}: {
  title: string;
  children: string;
  color: string;
}) {
  const [open, setOpen] = useState(false);

  const colors: Record<string, string> = {
    red: "from-red-500/40 to-transparent",
    cyan: "from-cyan-400/40 to-transparent",
    violet: "from-purple-500/40 to-transparent",
    blue: "from-blue-400/40 to-transparent",
    green: "from-green-400/40 to-transparent",
    amber: "from-amber-400/40 to-transparent",
    gray: "from-white/20 to-transparent",
    emerald: "from-emerald-400/40 to-transparent",
    purple: "from-purple-400/40 to-transparent",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 text-white backdrop-blur-xl transition hover:border-white/30">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          colors[color] || colors.gray
        } opacity-0 blur-2xl transition duration-300 group-hover:opacity-100`}
      />

      <button
        onClick={() => setOpen(!open)}
        className="relative z-10 flex w-full items-center justify-between px-6 py-5 text-left text-lg font-black"
      >
        <span>{title}</span>
        <span className={`transition duration-300 ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      <div
        className={`relative z-10 overflow-hidden px-6 transition-all duration-500 ${
          open ? "max-h-[1600px] pb-6 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="whitespace-pre-line leading-8 text-white/70">
          {children}
        </div>
      </div>
    </div>
  );
}

export function PlayersPage({
  users,
  currentUser,
  setPage,
  setViewedUser,
  updateUser,
}: {
  users: UserProfile[];
  currentUser: UserProfile;
  setPage: (page: string) => void;
  setViewedUser: (user: UserProfile | null) => void;
  updateUser: (userId: number, patch: Partial<UserProfile>) => void;
}) {
  const { data: session } = useSession();

  const [search, setSearch] = useState("");
  const [openedTools, setOpenedTools] = useState<number | null>(null);

  const canModerate = currentUser.isOwner || currentUser.isModerator;
  const isOwner = currentUser.isOwner;

  const filteredUsers = users.filter((user) =>
    `${user.nickname} ${user.discordName || ""} ${user.role} ${user.faction}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openUser(user: UserProfile) {
    setViewedUser(user);
    setPage("Профиль");
  }

  function punish(user: UserProfile, type: "warning" | "reprimand" | "timeout") {
    if (!canModerate) return;

    if (type === "warning") {
      const next = Math.min(2, user.warnings + 1);
      updateUser(user.id, {
        warnings: next,
        status: `Получено предупреждение ${next}/2`,
      });
    }

    if (type === "reprimand") {
      const next = Math.min(3, user.reprimands + 1);
      updateUser(user.id, {
        reprimands: next,
        status: next >= 3 ? "Снят с лорника / ЧС" : `Получен выговор ${next}/3`,
      });
    }

    if (type === "timeout") {
      updateUser(user.id, {
        timeoutUntil: "30 минут",
        status: "В тайм-ауте",
      });
    }
  }

  function clearPunishments(user: UserProfile) {
    if (!canModerate) return;

    updateUser(user.id, {
      warnings: 0,
      reprimands: 0,
      timeoutUntil: null,
      status: user.isOwner ? "Полный доступ" : "Активный лорник"
    });
  }

  function setRole(user: UserProfile, role: Role) {
    if (!isOwner) return;

    updateUser(user.id, {
      role,
      status: role === "Гость" ? "Ожидает регистрации" : "Активный лорник",
    });
  }

  function toggleModerator(user: UserProfile) {
    if (!isOwner) return;

    updateUser(user.id, {
      isModerator: !user.isModerator,
      status: !user.isModerator
        ? "Имеет модераторскую привилегию"
        : "Активный лорник",
    });
  }

  return (
    <>
      <SectionTitle title="Игроки" subtitle="зарегистрированные пользователи" />

      <div className="mt-10 max-w-5xl">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Найти игрока..."
          className="w-full rounded-full border border-white/10 bg-black/35 px-6 py-4 text-white outline-none placeholder:text-white/30"
        />

        <div className="mt-6 grid gap-5">
          {filteredUsers.map((user) => {
            const name = user.discordName || user.nickname;
            const avatar =
  user.discordAvatar ||
  (user.id === currentUser.id ? session?.user?.image : null);
            const toolsOpen = openedTools === user.id;

            return (
              <article
                key={user.id}
                className="rounded-[34px] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-xl transition hover:border-[var(--accent)]/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--second)]/30 bg-[var(--second)]/10 text-xl font-black">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt="avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        name?.[0] ?? "?"
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-2xl font-black">{name}</h3>
                      <p className="mt-1 text-sm text-white/40">
                        {user.role} · {user.faction}
                      </p>
                      <p className="mt-2 text-sm text-white/45">
                        {user.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openUser(user)}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold transition hover:bg-white/10"
                    >
                      Профиль
                    </button>

                    {canModerate && (
                      <button
                        onClick={() =>
                          setOpenedTools(toolsOpen ? null : user.id)
                        }
                        className="rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:scale-105 active:scale-95"
                      >
                        Управление
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/45">
                  {user.bio || "Описание профиля пока не заполнено."}
                </p>

                <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
                  <InfoRow label="Преды" value={`${user.warnings}/2`} />
                  <InfoRow label="Выговоры" value={`${user.reprimands}/3`} />
                  <InfoRow label="Тайм-аут" value={user.timeoutUntil || "Нет"} />
                  <InfoRow
                    label="Модерация"
                    value={user.isModerator ? "Да" : "Нет"}
                  />
                </div>

                {toolsOpen && canModerate && (
                  <div className="mt-5 rounded-[28px] border border-white/10 bg-black/40 p-4">
                    <h4 className="font-black">Быстрое управление</h4>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => punish(user, "warning")}
                        className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-4 py-2 text-sm font-bold hover:bg-yellow-500/20"
                      >
                        Выдать предупреждение
                      </button>

                      <button
                        onClick={() => punish(user, "reprimand")}
                        className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold hover:bg-red-500/20"
                      >
                        Выдать выговор
                      </button>

                      <button
                        onClick={() => punish(user, "timeout")}
                        className="rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm font-bold hover:bg-purple-500/20"
                      >
                        Тайм-аут 30 минут
                      </button>

                      <button
                        onClick={() => clearPunishments(user)}
                        className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold hover:bg-emerald-500/20"
                      >
                        Снять наказания
                      </button>
                    </div>

                    {isOwner && (
                      <>
                        <div className="my-4 h-px bg-white/10" />

                        <button
                          onClick={() => toggleModerator(user)}
                          className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-bold hover:bg-cyan-500/20"
                        >
                          {user.isModerator
                            ? "Снять модерацию"
                            : "Выдать модерацию"}
                        </button>

                        <div className="mt-4">
                          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-white/35">
                            Выдать роль
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {roles.map((role) => (
                              <button
                                key={role}
                                onClick={() => setRole(user, role)}
                                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                                  user.role === role
                                    ? "border-white bg-[var(--accent)] text-black"
                                    : "border-white/10 bg-white/[0.03] hover:bg-white/10"
                                }`}
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}

type ProfileLocalData = {
  banner: string | null;
  bio: string;
};

export function ProfilePage({
  currentUser,
  viewedUser,
}: {
  currentUser: UserProfile;
  viewedUser?: UserProfile | null;
}) {

const profileUser = viewedUser || currentUser;

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(profileData));
  }, [profileData, storageKey]);

  function uploadBanner(file: File | undefined) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setProfileData((old) => ({
        ...old,
        banner: String(reader.result),
      }));
    };

    reader.readAsDataURL(file);
  }

  const discordStatus = session?.user ? "Подключён" : "Не подключён";
  const steamStatus = currentUser.steamId ? "Подключён" : "Не подключён";

  return (
    <>
      <SectionTitle title="Профиль" subtitle="личный кабинет" />

      <div className="mt-10 grid max-w-7xl gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[34px] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white/35">
            Аккаунт
          </p>

<div className="mt-5 space-y-2">
  {(["Обзор", "Жалобы", "Уведомления", "Безопасность"] as const).map((tab) => (
    <button
      key={tab}
      onClick={() => setProfileTab(tab)}
      className={`w-full rounded-2xl border px-4 py-4 text-left font-black transition ${
        profileTab === tab
          ? "border-white/40 bg-white/10 text-white"
          : "border-white/10 bg-white/[0.03] text-white/55 hover:bg-white/10"
      }`}
    >
      {tab === "Обзор" && "◇ "}
      {tab === "Жалобы" && "↔ "}
      {tab === "Уведомления" && "↝ "}
      {tab === "Безопасность" && "🛡 "}
      {tab}
    </button>
  ))}
</div>
        </aside>

<section className="space-y-6">
  {profileTab === "Обзор" && (
    <>
          <div className="overflow-hidden rounded-[38px] border border-white/10 bg-black/35 text-white backdrop-blur-xl">
            <div className="relative h-56 overflow-hidden border-b border-white/10 bg-gradient-to-br from-[var(--accent)]/25 via-black to-[var(--second)]/20">
              {profileData.banner && (
                <img
                  src={profileData.banner}
                  alt="profile banner"
                  className="h-full w-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <label className="absolute right-6 top-6 cursor-pointer rounded-full border border-white/15 bg-black/50 px-5 py-3 text-sm font-black backdrop-blur-xl transition hover:bg-white/10">
                Загрузить баннер
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadBanner(e.target.files?.[0])}
                  className="hidden"
                />
              </label>

              {profileData.banner && (
                <button
                  onClick={() =>
                    setProfileData((old) => ({ ...old, banner: null }))
                  }
                  className="absolute right-6 top-20 rounded-full border border-red-400/30 bg-red-500/10 px-5 py-3 text-sm font-black text-red-100 transition hover:bg-red-500/20"
                >
                  Убрать баннер
                </button>
              )}
            </div>

            <div className="relative px-8 pb-8">
              <div className="-mt-16 flex flex-wrap items-end justify-between gap-5">
                <div className="flex items-end gap-5">
                  <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-full border-4 border-black bg-[var(--second)]/10 text-5xl font-black shadow-[0_0_var(--glow)_var(--second)]">
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt="avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      displayName[0] || "?"
                    )}
                  </div>

                  <div className="pb-3">
                    <h3 className="text-4xl font-black">{displayName}</h3>
                    <p className="mt-2 text-white/45">
                      {currentUser.role} · {currentUser.faction}
                    </p>
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  {currentUser.isOwner && (
                    <span className="rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-2 text-xs font-black text-pink-100">
                      Владелец
                    </span>
                  )}

                  {currentUser.isModerator && (
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-black text-cyan-100">
                      Модерация
                    </span>
                  )}
                </div>
              </div>

              <textarea
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData((old) => ({
                    ...old,
                    bio: e.target.value,
                  }))
                }
                placeholder="Расскажи коротко о себе..."
                className="mt-7 min-h-28 w-full resize-none rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4 leading-7 text-white outline-none placeholder:text-white/30"
              />

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-yellow-400/20 bg-yellow-500/10 p-5">
                  <p className="text-sm text-white/45">Предупреждения</p>
                  <p className="mt-2 text-3xl font-black">
                    {currentUser.warnings}/2
                  </p>
                </div>

                <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-5">
                  <p className="text-sm text-white/45">Выговоры</p>
                  <p className="mt-2 text-3xl font-black">
                    {currentUser.reprimands}/3
                  </p>
                </div>

                <div className="rounded-3xl border border-purple-400/20 bg-purple-500/10 p-5">
                  <p className="text-sm text-white/45">Тайм-аут</p>
                  <p className="mt-2 text-2xl font-black">
                    {currentUser.timeoutUntil || "Нет"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="rounded-[34px] border border-white/10 bg-black/35 p-6 text-white backdrop-blur-xl">
              <h4 className="text-2xl font-black">Данные профиля</h4>

              <div className="mt-5 grid gap-3">
                <InfoRow label="Ник" value={displayName} />
                <InfoRow label="Роль" value={currentUser.role} />
                <InfoRow label="Фракция" value={currentUser.faction} />
                <InfoRow label="Статус" value={currentUser.status} />
                <InfoRow label="Discord" value={discordStatus} />
                <InfoRow label="Steam" value={steamStatus} />
                <InfoRow
                  label="Владелец"
                  value={currentUser.isOwner ? "Да" : "Нет"}
                />
                <InfoRow
                  label="Модерация"
                  value={currentUser.isModerator ? "Включена" : "Нет"}
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  alert(
                    "Steam подключение добавим отдельным API-роутом без next-auth-steam."
                  );
                }}
                className="w-full rounded-full bg-white px-6 py-4 font-black text-black shadow-[0_0_var(--glow)_var(--accent)] transition hover:scale-105 active:scale-95"
              >
                {currentUser.steamId ? "Steam подключён" : "Войти через Steam"}
              </button>

              <DiscordLoginButton />

              <div className="rounded-[34px] border border-white/10 bg-black/35 p-6 text-white backdrop-blur-xl">
                <h4 className="text-xl font-black">Значки</h4>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(currentUser.badges?.length
                    ? currentUser.badges
                    : ["Лорник"]
                  ).map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-sm font-bold"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
    </>
  )}
  {profileTab === "Жалобы" && (
  <div className="rounded-[34px] border border-white/10 bg-black/35 p-6 text-white backdrop-blur-xl">
    <h3 className="text-3xl font-black">Жалобы</h3>
    <p className="mt-3 text-white/50">
      Здесь позже будут жалобы, связанные с вашим профилем.
    </p>

    <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <p className="font-black">Активных жалоб нет</p>
      <p className="mt-2 text-sm text-white/45">
        Если на пользователя будет подана жалоба, она появится здесь.
      </p>
    </div>
  </div>
)}

{profileTab === "Уведомления" && (
  <div className="rounded-[34px] border border-white/10 bg-black/35 p-6 text-white backdrop-blur-xl">
    <h3 className="text-3xl font-black">Уведомления</h3>
    <p className="mt-3 text-white/50">
      Системные уведомления профиля.
    </p>

    <div className="mt-6 space-y-3">
      <div className="rounded-3xl border border-[var(--accent)]/20 bg-[var(--accent)]/10 p-5">
        <p className="font-black">Профиль активен</p>
        <p className="mt-2 text-sm text-white/55">
          Ваш личный кабинет успешно загружен.
        </p>
      </div>
    </div>
  </div>
)}

{profileTab === "Безопасность" && (
  <div className="rounded-[34px] border border-white/10 bg-black/35 p-6 text-white backdrop-blur-xl">
    <h3 className="text-3xl font-black">Безопасность</h3>
    <p className="mt-3 text-white/50">
      Подключения и защита аккаунта.
    </p>

    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <InfoRow label="Discord" value={discordStatus} />
      <InfoRow label="Steam" value={steamStatus} />
      <InfoRow label="Модерация" value={currentUser.isModerator ? "Да" : "Нет"} />
      <InfoRow label="Владелец" value={currentUser.isOwner ? "Да" : "Нет"} />
    </div>
  </div>
)}
        </section>
      </div>
    </>
  );
}

export function FeedPage({ currentUser }: { currentUser: UserProfile }) {
  const [posts, setPosts] = useState<PostItem[]>(() => {
    if (typeof window === "undefined") return startPosts;
    const saved = localStorage.getItem("kamiko-feed-posts");
    return saved ? JSON.parse(saved) : startPosts;
  });

  const [text, setText] = useState("");
  const [group, setGroup] = useState(currentUser.faction || "Скитальцы");
  const [activeGroup, setActiveGroup] = useState("Все");
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<Record<number, string>>({});

  const groups = ["Все", ...factionGroups, "Объявления"];
  const hasTimeout = Boolean(currentUser.timeoutUntil);
  const { data: session } = useSession();

const currentAvatar =
  currentUser.discordAvatar || session?.user?.image || null;

const currentName =
  currentUser.discordName || session?.user?.name || currentUser.nickname;

  useEffect(() => {
    localStorage.setItem("kamiko-feed-posts", JSON.stringify(posts));
  }, [posts]);

  function createPost() {
    if (!text.trim() || hasTimeout) return;

    const newPost: PostItem = {
      id: Date.now(),
      author: currentName,
      role: currentUser.role,
      group,
      content: text.trim(),
      time: "только что",
      likes: 0,
      liked: false,
      reposts: 0,
      reposted: false,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setText("");

    writeLog({
      type: "Пост",
      actor: currentUser.nickname,
      target: group,
      details: text.trim(),
    });
  }

function likePost(id: number) {
  const post = posts.find((item) => item.id === id);

  setPosts((current) =>
    current.map((post) =>
      post.id === id
        ? {
            ...post,
            liked: !post.liked,
            likes: post.liked ? Math.max(0, post.likes - 1) : post.likes + 1,
          }
        : post
    )
  );

  if (post && post.author !== currentUser.nickname && !post.liked) {
    addNotification({
      user: post.author,
      type: "Лайк",
      title: "Ваш пост лайкнули",
      text: `${currentUser.nickname} поставил лайк вашему посту: "${post.content.slice(
        0,
        80
      )}${post.content.length > 80 ? "..." : ""}"`,
    });
  }
}

  function repostPost(id: number) {
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? {
              ...post,
              reposted: !post.reposted,
              reposts: post.reposted
                ? Math.max(0, post.reposts - 1)
                : post.reposts + 1,
            }
          : post
      )
    );
  }

function addComment(postId: number) {
  const value = commentText[postId];
  const post = posts.find((item) => item.id === postId);

  if (!value?.trim() || hasTimeout) return;

  const newComment: CommentItem = {
    id: Date.now(),
    author: currentUser.nickname,
    text: value.trim(),
    time: "только что",
  };

  setPosts((current) =>
    current.map((post) =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    )
  );

  setCommentText((current) => ({ ...current, [postId]: "" }));

  writeLog({
    type: "Комментарий",
    actor: currentUser.nickname,
    target: `Пост #${postId}`,
    details: value.trim(),
  });

  if (post && post.author !== currentUser.nickname) {
    addNotification({
      user: post.author,
      type: "Комментарий",
      title: "Новый комментарий",
      text: `${currentUser.nickname} прокомментировал ваш пост: "${value.trim().slice(
        0,
        100
      )}${value.trim().length > 100 ? "..." : ""}"`,
    });
  }
}

  function deletePost(id: number) {
    const post = posts.find((item) => item.id === id);

    setPosts((current) => current.filter((item) => item.id !== id));

    writeLog({
      type: "Удаление поста",
      actor: currentUser.nickname,
      target: post?.author || "Неизвестно",
      details: post?.content || `Пост #${id}`,
    });
  }

  const filteredPosts =
    activeGroup === "Все"
      ? posts
      : posts.filter((post) => post.group === activeGroup);

  return (
    <>
      <SectionTitle title="Живая лента" subtitle="внутренняя хроника лорников" />

      <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="space-y-5">
          <div className="rounded-[34px] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-xl">
            <div className="flex gap-4">
            <Avatar letter={currentName[0] || "?"} image={currentAvatar} size="md" />
              <div className="flex-1">
                {hasTimeout && (
                  <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-950/20 p-4 text-sm text-red-100">
                    Вам временно запрещено писать посты и комментарии до:{" "}
                    {currentUser.timeoutUntil}
                  </div>
                )}

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={hasTimeout}
                  placeholder={
                    hasTimeout
                      ? "Вы не можете писать во время тайм-аута."
                      : "Что нового в лоре?"
                  }
                  className="min-h-28 w-full resize-none bg-transparent text-lg outline-none placeholder:text-white/30 disabled:cursor-not-allowed disabled:opacity-40"
                />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    disabled={hasTimeout}
                    className="rounded-full border border-white/10 bg-black/50 px-4 py-3 text-sm font-bold outline-none disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {factionGroups.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                    <option>Объявления</option>
                  </select>

                  <button
                    onClick={createPost}
                    disabled={hasTimeout}
                    className="rounded-full bg-white px-6 py-3 font-black text-black shadow-[0_0_var(--glow)_var(--accent)] transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Опубликовать
                  </button>
                </div>
              </div>
            </div>
          </div>

          {filteredPosts.map((post) => {
           const canDelete =
  post.author === currentUser.nickname ||
  currentUser.isModerator ||
  currentUser.isOwner;

            return (
              <article
                key={post.id}
                className="rounded-[34px] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-xl transition hover:border-white/25"
              >
                <div className="flex gap-4">
                  <Avatar
  letter={post.author[0] || "?"}
  image={post.author === currentName ? currentAvatar : null}
  size="md"
/>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black">{post.author}</h3>
                        <span className="text-sm text-white/35">· {post.role}</span>
                        <span className="text-sm text-white/35">· {post.time}</span>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => deletePost(post.id)}
                          className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-100 transition hover:bg-red-500/20"
                        >
                          Удалить
                        </button>
                      )}
                    </div>

                    <div className="mt-2 inline-flex rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-bold text-white">
                      {post.group}
                    </div>

                    <p className="mt-4 leading-7 text-white/70">{post.content}</p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => likePost(post.id)}
                        className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                          post.liked
                            ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                            : "border-white/10 bg-white/[0.03] hover:bg-[var(--accent)] hover:text-black"
                        }`}
                      >
                        ♥ {post.likes}
                      </button>

                      <button
                        onClick={() =>
                          setOpenComments(openComments === post.id ? null : post.id)
                        }
                        className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-bold transition hover:bg-white/10"
                      >
                        💬 {post.comments.length}
                      </button>

                      <button
                        onClick={() => repostPost(post.id)}
                        className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                          post.reposted
                            ? "border-[var(--second)] bg-[var(--second)] text-black"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/10"
                        }`}
                      >
                        ↗ {post.reposts}
                      </button>
                    </div>

                    {openComments === post.id && (
                      <div className="mt-5 rounded-3xl border border-white/10 bg-black/25 p-4">
                        <h4 className="font-black">Комментарии</h4>

                        <div className="mt-4 space-y-3">
                          {post.comments.length === 0 && (
                            <p className="text-sm text-white/35">
                              Комментариев пока нет.
                            </p>
                          )}

                          {post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-black">{comment.author}</span>
                                <span className="text-xs text-white/35">
                                  · {comment.time}
                                </span>
                              </div>

                              <p className="mt-2 text-sm leading-6 text-white/65">
                                {comment.text}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex gap-3">
                          <input
                            value={commentText[post.id] || ""}
                            onChange={(e) =>
                              setCommentText((current) => ({
                                ...current,
                                [post.id]: e.target.value,
                              }))
                            }
                            disabled={hasTimeout}
                            placeholder={
                              hasTimeout
                                ? "Тайм-аут запрещает комментировать"
                                : "Написать комментарий..."
                            }
                            className="flex-1 rounded-full border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30 disabled:cursor-not-allowed disabled:opacity-40"
                          />

                          <button
                            onClick={() => addComment(post.id)}
                            disabled={hasTimeout}
                            className="rounded-full bg-white px-5 py-3 font-black text-black transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Отправить
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="space-y-5">
          <div className="rounded-[34px] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-xl">
            <h3 className="text-xl font-black">Группы ленты</h3>

            <div className="mt-4 flex flex-col gap-2">
              {groups.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveGroup(item)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold transition ${
                    activeGroup === item
                      ? "border-white bg-[var(--accent)] text-black"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/10"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <FeedChatBox currentUser={currentUser} />
        </aside>
      </div>
    </>
  );
}

export function SuggestionsPage({ currentUser }: { currentUser: UserProfile }) {
  const [ideas, setIdeas] = useState<SuggestionItem[]>(() => {
    if (typeof window === "undefined") return startSuggestions;
    const saved = localStorage.getItem("kamiko-suggestions");
    return saved ? JSON.parse(saved) : startSuggestions;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return startSuggestionChat;
    const saved = localStorage.getItem("kamiko-suggestions-chat");
    return saved ? JSON.parse(saved) : startSuggestionChat;
  });

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [chatText, setChatText] = useState("");

  const canModerate = currentUser.isOwner || currentUser.isModerator;

  useEffect(() => {
    localStorage.setItem("kamiko-suggestions", JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem("kamiko-suggestions-chat", JSON.stringify(chatMessages));
  }, [chatMessages]);

  function createIdea() {
    if (!title.trim() || !text.trim()) return;

    const newIdea: SuggestionItem = {
      id: Date.now(),
      author: currentUser.nickname,
      title: title.trim(),
      text: text.trim(),
      likes: 0,
      liked: false,
      status: "Новое",
      createdAt: nowLabel(),
    };

    setIdeas([newIdea, ...ideas]);
    setTitle("");
    setText("");

    writeLog({
      type: "Предложение",
      actor: currentUser.nickname,
      target: newIdea.title,
      details: newIdea.text,
    });
  }

  function likeIdea(id: number) {
    setIdeas((current) =>
      current.map((idea) =>
        idea.id === id
          ? {
              ...idea,
              liked: !idea.liked,
              likes: idea.liked ? Math.max(0, idea.likes - 1) : idea.likes + 1,
            }
          : idea
      )
    );
  }

  function deleteIdea(id: number) {
    const idea = ideas.find((item) => item.id === id);

    setIdeas((current) => current.filter((item) => item.id !== id));

    writeLog({
      type: "Удаление предложения",
      actor: currentUser.nickname,
      target: idea?.author || "Неизвестно",
      details: idea?.title || `Предложение #${id}`,
    });
  }

  function sendChatMessage() {
    if (!chatText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      author: currentUser.nickname,
      text: chatText.trim(),
      time: nowLabel(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatText("");

    writeLog({
      type: "Сообщение в предложениях",
      actor: currentUser.nickname,
      target: "Чат предложений",
      details: newMessage.text,
    });
  }

  function deleteChatMessage(id: number) {
    const message = chatMessages.find((item) => item.id === id);

    setChatMessages((current) => current.filter((item) => item.id !== id));

    writeLog({
      type: "Удаление сообщения",
      actor: currentUser.nickname,
      target: message?.author || "Неизвестно",
      details: message?.text || `Сообщение #${id}`,
    });
  }

  return (
    <>
      <SectionTitle title="Предложения" subtitle="идеи по развитию сайта" />

      <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="space-y-5">
          <div className="rounded-[34px] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-xl">
            <h3 className="text-2xl font-black">Предложить улучшение</h3>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Короткий заголовок идеи..."
              className="mt-5 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none placeholder:text-white/30"
            />

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Опиши, что можно улучшить..."
              className="mt-3 min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none placeholder:text-white/30"
            />

            <button
              onClick={createIdea}
              className="mt-4 rounded-full bg-white px-7 py-4 font-black text-black shadow-[0_0_var(--glow)_var(--accent)] transition hover:scale-105 active:scale-95"
            >
              Отправить предложение
            </button>
          </div>

          {ideas.map((idea) => {
            const canDelete =
              canModerate || idea.author === currentUser.nickname;

            return (
              <article
                key={idea.id}
                className="rounded-[34px] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-xl transition hover:border-white/25"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-black">{idea.title}</h3>
                    <p className="mt-1 text-sm text-white/35">
                      {idea.author} · {idea.status} · {idea.createdAt}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => likeIdea(idea.id)}
                      className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                        idea.liked
                          ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/10"
                      }`}
                    >
                      ♥ {idea.likes}
                    </button>

                    {canDelete && (
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100 transition hover:bg-red-500/20"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-4 leading-7 text-white/65">{idea.text}</p>
              </article>
            );
          })}
        </section>

        <aside className="space-y-5">
          <div className="rounded-[34px] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-xl">
            <h3 className="text-xl font-black">Чат предложений</h3>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Здесь можно обсуждать идеи, спорить, дополнять предложения и
              договариваться, что улучшать дальше.
            </p>

            <div className="mt-5 max-h-[420px] space-y-3 overflow-y-auto pr-2">
              {chatMessages.map((message) => {
                const canDeleteMessage =
                  canModerate || message.author === currentUser.nickname;

                return (
                  <div
                    key={message.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-black">{message.author}</span>
                        <span className="text-xs text-white/35">
                          {" "}
                          · {message.time}
                        </span>
                      </div>

                      {canDeleteMessage && (
                        <button
                          onClick={() => deleteChatMessage(message.id)}
                          className="text-xs font-bold text-red-200/80 hover:text-red-100"
                        >
                          удалить
                        </button>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-white/65">
                      {message.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex gap-3">
              <input
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendChatMessage();
                }}
                placeholder="Написать в чат..."
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
              />

              <button
                onClick={sendChatMessage}
                className="rounded-full bg-white px-5 py-3 font-black text-black transition hover:scale-105 active:scale-95"
              >
                ➤
              </button>
            </div>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-xl">
            <h3 className="text-xl font-black">Для чего этот раздел?</h3>
            <p className="mt-3 leading-7 text-white/50">
              Здесь участники смогут предлагать новые функции, правки дизайна,
              идеи для ленты, профиля, админ-панели и будущих систем сайта.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

export function RulesPage() {
  const blocks = [
    {
      title: "Общее",
      color: "red",
      text: `1.1 Лорные персонажи и лидеры фракций обязаны играть/сидеть под никнеймом своего персонажа. | Беседа/Устный выговор

Дискорд также является обязательным местом.

1.2 Лорные персонажи должны действовать в рамках своего образа: это касается речи, характера, мотиваций, действий и соблюдения сюжетной логики.

1.3 Если лидер / Столп / Луна не справляется со своими обязанностями, он получает наказание в виде выговора и заносится в чёрный список лидеров/лорников на 3 месяца.

1.4 Лорные персонажи и лидеры обязаны придерживаться минимального суточного онлайна в 90 минут для лидеров / Столпов / Лун / лорников. | Устный выговор / Строгий выговор / Снятие

1.5 После получения должности лидера/лорного персонажа вы должны просидеть на ней минимум две недели. В ином случае вы получаете чёрный список лорников.

Уточнение:
Вы сможете амнистировать свой чёрный список лорников ровно через месяц после его получения.

1.6 Лорный персонаж не может перейти с одного лорного персонажа на другого. | Снятие

Уточнение:
Нельзя быть на одном лорном персонаже и уходить на другого без снятия.

Исключение:
Лорники без механики: семья Убуяшики / девочки из поместья.

1.7 Если лорный персонаж был снят по каким-либо причинам, он не может подавать заявки на протяжении 5 дней.

1.7.1 Если человек подал заявку на лорного персонажа или не явился на обзвон по неуважительной причине, он не может подавать заявки на протяжении 5 дней.

Примечание:
Для подачи заявки на лорника человек должен отыграть более 14 дней на проекте. В противном случае в его заявке откажут.

Статус: заморожено.

1.8 Лидеры / Столпы / Луны обязаны отвечать на игровые вопросы и предложения в личных сообщениях или официальных Discord-серверах проекта в течение 72 часов. | Устный / Строгий выговор`,
    },
    {
      title: "Дополнительно для лидеров фракции",
      color: "cyan",
      text: `2.1 Лидер фракции / лорный персонаж должен быть примером для других игроков, придерживаться лора и соблюдать правила сервера.

2.2 Лидеры фракций / Столпы / Луны несут ответственность за управление и развитие своей фракции, включая обучение новичков, поддержание порядка и организацию событий.

2.3 Лидеры фракций / Столпы / Луны должны следить за сохранением атмосферы и взаимодействовать с другими игроками в соответствии со своей ролью.

3.1 Лидеры не должны злоупотреблять своей властью и выдавать своим подчинённым или себе преимущества, которые нарушают игровой баланс. | Устный выговор / Строгий выговор / Снятие

3.2 Лидеры должны регулярно, минимум 1 раз в месяц, инициировать игровые события для своей фракции и сервера.

Все ивенты должны согласовываться с Игровым создателем / RolePlay Creator.

Примечание:
Сюжеты ивентов должны соответствовать тематике Demon Slayer и учитывать историю и развитие персонажей.

3.3 Лидеры фракций могут развивать свою организацию, добавляя уникальные элементы, но это не должно противоречить общей концепции мира.`,
    },
    {
      title: "Срок лидера и ответственность",
      color: "violet",
      text: `4.1 Успешный лидерский срок составляет два месяца, то есть 60 дней. За успешное выполнение срока будет выдан подарок.

Дополнение:
Раз в 30 дней будут проверяться отчёты, активность, мероприятия и онлайн лидеров фракций. После этого высшая администрация будет принимать решение о продлении срока действующего лидера фракции.

4.2 Лидер не может занимать лидерский срок снова сразу после снятия. | Снятие с поста

Пояснение:
Как минимум один лидер после него должен отстоять свой срок.

4.3 По окончании срока лидер может дать две рекомендации на своих заместителей, если они заинтересованы в данном посте. Рекомендации будут учтены при общем обзвоне кандидатов.

4.4 Лидер несёт ответственность за нарушения своего состава, если нарушили более трёх человек в одной жалобе. | Устный / Строгий выговор

4.5 Максимальное количество заместителей лидера — 2. | Устный выговор

Примечание:
Заместителями лидера фракции могут являться только Луна / Столп.

4.6 Лидер может кикнуть любого игрока из фракции, имея на это вескую IC-причину. | Откат увольнения + Строгий выговор`,
    },
    {
      title: "Discord, сайт и активность фракции",
      color: "green",
      text: `4.7 Лидер обязан иметь настроенный Discord-сервер для фракции, включающий в себя все дыхания и отряды.

Сервер должен быть настроен внешне и функционально так, чтобы разделы были отсортированы и читаемы. | Устный выговор

4.7.1 Запрещено использовать сторонние Discord-сервера для отчётности, правил, состава и подобной информации, которая как-либо связана с сервером, дыханием или отрядом. | Строгий выговор / Снятие

Пояснение:
Любые другие вещи, не связанные с сервером, например общение или круг интересов, не попадают под это правило.

4.7.2 Лидер обязан иметь оформленный сайт или форум, содержащий основную информацию о своей фракции. | Устный выговор

4.7.3 Лидер обязан поддерживать онлайн и активность своей фракции. | Устный выговор / Строгий выговор / Снятие

4.7.4 Лидер обязан повышать досуг и RP-уровень своей фракции. | Устный выговор / Строгий выговор / Снятие

4.7.5 На усмотрение Куратора сервера / RP-куратора с лидера фракции может быть снято одно устное предупреждение за проведённое глобальное мероприятие, но не чаще чем раз в 3 дня. | Строгий выговор

4.7.7 Запрещено заранее проводить мероприятия для снятия устных выговоров. | Устный выговор

4.8 Лидер обязан быть в курсе всех проблем своей фракции, устранять и пресекать внутрифракционные конфликты. | Устный выговор / Строгий выговор

4.9 Лидерам запрещены грубые, унизительные или оскорбительные высказывания в сторону других игроков/администраторов в официальных Discord-серверах проекта. | Устный выговор / Строгий выговор / Снятие`,
    },
  ];

  return (
    <>
      <SectionTitle title="Правила лорников" subtitle="регламент и наказания" />

      <div className="mt-10 max-w-5xl space-y-7">
        {blocks.map((block, index) => (
          <ScrollRuleBlock
            key={block.title}
            title={block.title}
            text={block.text}
            color={block.color}
            index={index}
          />
        ))}
      </div>
    </>
  );
}

function ScrollRuleBlock({
  title,
  text,
  color,
  index,
}: {
  title: string;
  text: string;
  color: string;
  index: number;
}) {
  const colors: Record<string, string> = {
    red: "from-red-500/25",
    cyan: "from-cyan-400/25",
    violet: "from-purple-500/25",
    green: "from-green-400/25",
  };

  return (
    <section
      className="scroll-card group relative overflow-hidden rounded-[34px] border border-white/10 bg-black/35 p-6 text-white backdrop-blur-xl transition hover:border-white/25"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          colors[color] || colors.red
        } to-transparent opacity-0 blur-2xl transition duration-500 group-hover:opacity-100`}
      />

      <div className="relative z-10">
        <div className="mb-5 h-1 w-24 rounded-full bg-[var(--accent)] transition group-hover:w-40" />
        <h3 className="text-3xl font-black">{title}</h3>
        <div className="mt-5 whitespace-pre-line leading-8 text-white/68">
          {text}
        </div>
      </div>
    </section>
  );
}

export function SettingsPage({
  settings,
  setSettings,
  selectTheme,
}: {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  selectTheme: (themeId: string) => void;
}) {
  return (
    <>
      <SectionTitle title="Настройки" subtitle="темы и внешний вид" />

      <div className="mt-10 max-w-5xl rounded-[34px] border border-white/10 bg-black/35 p-6 text-white backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-[0.25em]">
            Темы
          </h3>
          <button
            onClick={() => setSettings(defaultSettings)}
            className="text-sm font-bold text-[var(--accent)] underline"
          >
            Сбросить
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => selectTheme(theme.id)}
              className="group text-left"
            >
              <div
                className={`relative h-32 overflow-hidden rounded-2xl border bg-[#0d0b12] transition group-hover:scale-[1.03] ${
                  settings.theme === theme.id
                    ? "border-white"
                    : "border-white/10"
                }`}
                style={{
                  boxShadow:
                    settings.theme === theme.id
                      ? `0 0 ${Math.round(settings.glow / 4)}px ${theme.accent}`
                      : "none",
                }}
              >
                <div
                  className="absolute left-4 top-4 h-4 w-4 rounded-sm"
                  style={{ background: theme.accent }}
                />
                <div
                  className="absolute left-4 top-10 h-4 w-4 rounded-sm"
                  style={{ background: theme.second }}
                />
                <div
                  className="absolute left-4 top-16 h-4 w-4 rounded-sm"
                  style={{ background: theme.accent }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold">{theme.name}</span>
                <span
                  className={`h-5 w-5 rounded-full border ${
                    settings.theme === theme.id
                      ? "border-white bg-[var(--accent)]"
                      : "border-white/50"
                  }`}
                />
              </div>
            </button>
          ))}
        </div>

        <OptionGroup title="Режим">
          {(["light", "auto", "dark"] as const).map((mode) => (
            <OptionButton
              key={mode}
              active={settings.mode === mode}
              title={
                mode === "light" ? "Светлая" : mode === "auto" ? "Авто" : "Тёмная"
              }
              onClick={() => setSettings((s) => ({ ...s, mode }))}
            />
          ))}
        </OptionGroup>

        <OptionGroup title="Фон">
          <OptionButton
            active={settings.background === "night"}
            title="Ночь"
            onClick={() => setSettings((s) => ({ ...s, background: "night" }))}
          />
          <OptionButton
            active={settings.background === "moon"}
            title="Луна"
            onClick={() => setSettings((s) => ({ ...s, background: "moon" }))}
          />
          <OptionButton
            active={settings.background === "fog"}
            title="Туман"
            onClick={() => setSettings((s) => ({ ...s, background: "fog" }))}
          />
          <OptionButton
            active={settings.background === "clean"}
            title="Чистый"
            onClick={() => setSettings((s) => ({ ...s, background: "clean" }))}
          />
        </OptionGroup>

        <OptionGroup title="Частицы">
          <OptionButton
            active={settings.particleType === "mixed"}
            title="Смешанные"
            onClick={() => setSettings((s) => ({ ...s, particleType: "mixed" }))}
          />
          <OptionButton
            active={settings.particleType === "snow"}
            title="Снег"
            onClick={() => setSettings((s) => ({ ...s, particleType: "snow" }))}
          />
          <OptionButton
            active={settings.particleType === "butterflies"}
            title="Бабочки"
            onClick={() =>
              setSettings((s) => ({ ...s, particleType: "butterflies" }))
            }
          />
          <OptionButton
            active={settings.particleType === "petals"}
            title="Лепестки"
            onClick={() => setSettings((s) => ({ ...s, particleType: "petals" }))}
          />
        </OptionGroup>

        <div className="mt-8 space-y-5">
          <Slider
            title="Свечение"
            value={settings.glow}
            onChange={(v) => setSettings((s) => ({ ...s, glow: v }))}
          />
          <Slider
            title="Туман"
            value={settings.fog}
            onChange={(v) => setSettings((s) => ({ ...s, fog: v }))}
          />
          <Slider
            title="Частицы"
            value={settings.particles}
            onChange={(v) => setSettings((s) => ({ ...s, particles: v }))}
          />
        </div>
      </div>
    </>
  );
}

export function AdminPage({
  
  currentUser,
  setCurrentUser,
}: {
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}) {
  const [tab, setTab] = useState("Логи");
  const [logs, setLogs] = useState<AdminLog[]>(() => readLogs());
  const [timeoutTime, setTimeoutTime] = useState("30 минут");
  const [punishmentTarget, setPunishmentTarget] = useState(currentUser.nickname);
  const [punishmentReason, setPunishmentReason] = useState("");

  const isAdmin = currentUser.isOwner || currentUser.isModerator;

  useEffect(() => {
    function updateLogs() {
      setLogs(readLogs());
    }

    updateLogs();

    window.addEventListener("kamiko-logs-updated", updateLogs);
    window.addEventListener("storage", updateLogs);

    return () => {
      window.removeEventListener("kamiko-logs-updated", updateLogs);
      window.removeEventListener("storage", updateLogs);
    };
  }, []);

  if (!isAdmin) {
    return (
      <>
        <SectionTitle title="Нет доступа" subtitle="админ-панель" />
        <div className="mt-10 rounded-[34px] border border-red-400/20 bg-red-950/20 p-6 text-white backdrop-blur-xl">
          У вас нет прав для просмотра этой страницы.
        </div>
      </>
    );
  }

const tabs = [
  "Логи",
  "Живая лента",
  "Предложения",
  "Квоты",
];

  const feedLogs = logs.filter(
    (log) =>
      log.type.includes("Пост") ||
      log.type.includes("Комментарий") ||
      log.type.includes("Удаление поста")
  );

  const suggestionLogs = logs.filter(
    (log) =>
      log.type.includes("Предложение") ||
      log.type.includes("предлож") ||
      log.type.includes("Сообщение") ||
      log.type.includes("сообщ") ||
      log.type.includes("Удаление сообщения")
  );

  const quotaLogs = logs.filter(
    (log) =>
      log.type.includes("Отчёт") ||
      log.type.includes("отчёт") ||
      log.type.includes("Квоты")
  );

  function refreshLogs() {
    setLogs(readLogs());
  }

  function clearLogs() {
    localStorage.removeItem("kamiko-admin-logs");
    setLogs([]);
  }

function setUserRole(newRole: Role) {
  const faction =
    newRole === "Демон"
      ? "Демоны"
      : newRole === "Истребитель"
      ? "Истребители"
      : newRole === "Гость"
      ? "Скитальцы"
      : currentUser.faction;

  setCurrentUser((user) => ({
    ...user,
    role: newRole,
    faction,
    status: user.isOwner
      ? "Полный доступ"
      : newRole === "Гость"
      ? "Ожидает регистрации"
      : "Активный лорник",
  }));

    writeLog({
      type: "Выдача роли",
      actor: currentUser.nickname,
      target: currentUser.nickname,
      details: `Новая роль: ${newRole}`,
    });

    refreshLogs();
  }

  function giveWarning() {
    setCurrentUser((user) => {
      const warnings = Math.min(2, user.warnings + 1);

      return {
        ...user,
        warnings,
        status: `Получено предупреждение ${warnings}/2`,
      };
    });

    writeLog({
      type: "Предупреждение",
      actor: currentUser.nickname,
      target: punishmentTarget || currentUser.nickname,
      details: punishmentReason || "Причина не указана",
    });

    setPunishmentReason("");
    refreshLogs();
  }

  function giveReprimand() {
    setCurrentUser((user) => {
      const reprimands = Math.min(3, user.reprimands + 1);

      return {
        ...user,
        reprimands,
        status:
          reprimands >= 3
            ? "Снят с лорника / ЧС"
            : `Получен выговор ${reprimands}/3`,
      };
    });

    writeLog({
      type: "Выговор",
      actor: currentUser.nickname,
      target: punishmentTarget || currentUser.nickname,
      details: punishmentReason || "Причина не указана",
    });

    setPunishmentReason("");
    refreshLogs();
  }

  function clearPunishments() {
    setCurrentUser((user) => ({
      ...user,
      warnings: 0,
      reprimands: 0,
      status: user.isOwner ? "Полный доступ" : "Активный лорник"
    }));

    writeLog({
      type: "Снятие наказаний",
      actor: currentUser.nickname,
      target: punishmentTarget || currentUser.nickname,
      details: "Предупреждения и выговоры очищены",
    });

    refreshLogs();
  }

  return (
    <>
      <SectionTitle title="Админ-панель" subtitle="управление системой" />

      <div className="mt-10 grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="rounded-[34px] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-xl">
          <h3 className="text-xl font-black">Разделы</h3>

          <div className="mt-5 flex flex-col gap-2">
            {tabs.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setTab(item);
                  refreshLogs();
                }}
                className={`rounded-2xl border px-4 py-3 text-left font-bold transition ${
                  tab === item
                    ? "border-white bg-[var(--accent)] text-black"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-[34px] border border-white/10 bg-black/35 p-6 text-white backdrop-blur-xl">
          {tab === "Логи" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-black">Все логи</h3>
                  <p className="mt-2 text-white/45">
                    Общая история действий сайта.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={refreshLogs}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 font-bold transition hover:bg-white/10"
                  >
                    Обновить
                  </button>

                  <button
                    onClick={clearLogs}
                    className="rounded-full border border-red-400/30 bg-red-500/10 px-5 py-3 font-bold text-red-100 transition hover:bg-red-500/20"
                  >
                    Очистить
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {logs.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white/45">
                    Логов пока нет.
                  </div>
                )}

                {logs.map((log) => (
                  <LogRow
                    key={log.id}
                    title={`${log.type} · ${log.actor}`}
                    text={`${log.time} — ${log.details}`}
                  />
                ))}
              </div>
            </>
          )}

          {tab === "Наказания" && (
            <>
              <h3 className="text-2xl font-black">Наказания</h3>
              <p className="mt-2 text-white/45">
                Предупреждения, выговоры и очистка наказаний.
              </p>

              <div className="mt-6 grid gap-4">
                <input
                  value={punishmentTarget}
                  onChange={(e) => setPunishmentTarget(e.target.value)}
                  placeholder="Ник игрока..."
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 outline-none placeholder:text-white/30"
                />

                <textarea
                  value={punishmentReason}
                  onChange={(e) => setPunishmentReason(e.target.value)}
                  placeholder="Причина наказания..."
                  className="min-h-28 resize-none rounded-2xl border border-white/10 bg-black/50 px-4 py-3 outline-none placeholder:text-white/30"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={giveWarning}
                    className="rounded-full bg-white px-6 py-3 font-black text-black transition hover:scale-105 active:scale-95"
                  >
                    Выдать пред
                  </button>

                  <button
                    onClick={giveReprimand}
                    className="rounded-full bg-[var(--accent)] px-6 py-3 font-black text-black transition hover:scale-105 active:scale-95"
                  >
                    Выдать выговор
                  </button>

                  <button
                    onClick={clearPunishments}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 font-bold transition hover:bg-white/10"
                  >
                    Снять наказания
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === "Тайм-ауты" && (
            <>
              <h3 className="text-2xl font-black">Тайм-ауты</h3>

              <select
                value={timeoutTime}
                onChange={(e) => setTimeoutTime(e.target.value)}
                className="mt-6 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 outline-none"
              >
                <option>10 минут</option>
                <option>30 минут</option>
                <option>1 час</option>
                <option>6 часов</option>
                <option>1 день</option>
                <option>7 дней</option>
              </select>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setCurrentUser((user) => ({
                      ...user,
                      timeoutUntil: timeoutTime,
                      status: "В тайм-ауте",
                    }));

                    writeLog({
                      type: "Тайм-аут",
                      actor: currentUser.nickname,
                      target: punishmentTarget || currentUser.nickname,
                      details: `Выдан тайм-аут: ${timeoutTime}`,
                    });

                    refreshLogs();
                  }}
                  className="rounded-full bg-[var(--accent)] px-6 py-3 font-black text-black transition hover:scale-105 active:scale-95"
                >
                  Выдать тайм-аут
                </button>

                <button
                  onClick={() => {
setCurrentUser((user) => ({
  ...user,
  timeoutUntil: null,
  status: user.isOwner ? "Полный доступ" : "Активный лорник",
}));

                    writeLog({
                      type: "Снятие тайм-аута",
                      actor: currentUser.nickname,
                      target: punishmentTarget || currentUser.nickname,
                      details: "Тайм-аут снят",
                    });

                    refreshLogs();
                  }}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 font-bold transition hover:bg-white/10"
                >
                  Снять тайм-аут
                </button>
              </div>
            </>
          )}

          {tab === "Выдача ролей" && (
            <>
              <h3 className="text-2xl font-black">Выдача ролей</h3>

              <select
                value={currentUser.role}
                onChange={(e) => setUserRole(e.target.value as Role)}
                className="mt-6 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 outline-none"
              >
                {roles.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-black">{currentUser.nickname}</p>
                <p className="mt-1 text-white/50">
                  {currentUser.role} · {currentUser.faction} ·{" "}
                  {currentUser.status}
                </p>
              </div>
            </>
          )}

          {tab === "Модерация" && (
            <>
              <h3 className="text-2xl font-black">Модерация</h3>

              {!currentUser.isOwner ? (
                <p className="mt-3 text-white/45">
                  Только владелец может выдавать или снимать модераторскую
                  привилегию.
                </p>
              ) : (
                <>
                  <p className="mt-3 leading-7 text-white/50">
                    Модерация — это привилегия, а не отдельная роль.
                  </p>

                  <button
                    onClick={() => {
                      setCurrentUser((user) => ({
                        ...user,
                        isModerator: !user.isModerator,
                        status: !user.isModerator
                          ? "Имеет модераторскую привилегию"
                          : "Полный доступ",
                      }));

                      writeLog({
                        type: "Модерация",
                        actor: currentUser.nickname,
                        target: currentUser.nickname,
                        details: currentUser.isModerator
                          ? "Модераторская привилегия снята"
                          : "Модераторская привилегия выдана",
                      });

                      refreshLogs();
                    }}
                    className="mt-5 rounded-full bg-white px-6 py-3 font-black text-black transition hover:scale-105 active:scale-95"
                  >
                    {currentUser.isModerator
                      ? "Снять модерацию"
                      : "Выдать модерацию"}
                  </button>
                </>
              )}
            </>
          )}

          {tab === "Живая лента" && (
            <>
              <h3 className="text-2xl font-black">Живая лента</h3>

              <div className="mt-6 space-y-3">
                {feedLogs.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white/45">
                    Логов живой ленты пока нет.
                  </div>
                )}

                {feedLogs.map((log) => (
                  <LogRow
                    key={log.id}
                    title={`${log.type} · ${log.actor}`}
                    text={`${log.time} — ${log.details}`}
                  />
                ))}
              </div>
            </>
          )}

          {tab === "Предложения" && (
            <>
              <h3 className="text-2xl font-black">Предложения</h3>

              <div className="mt-6 space-y-3">
                {suggestionLogs.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white/45">
                    Логов предложений пока нет.
                  </div>
                )}

                {suggestionLogs.map((log) => (
                  <LogRow
                    key={log.id}
                    title={`${log.type} · ${log.actor}`}
                    text={`${log.time} — ${log.details}`}
                  />
                ))}
              </div>
            </>
          )}

          {tab === "Квоты" && (
            <>
              <h3 className="text-2xl font-black">Квоты</h3>

              <div className="mt-6 space-y-3">
                {quotaLogs.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white/45">
                    Логов квот пока нет.
                  </div>
                )}

                {quotaLogs.map((log) => (
                  <LogRow
                    key={log.id}
                    title={`${log.type} · ${log.actor}`}
                    text={`${log.time} — ${log.details}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
       <AdminChat currentUser={currentUser} />
    </>
  );
}

function LogRow({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="font-black">{title}</p>
      <p className="mt-1 text-white/50">{text}</p>
    </div>
  );
}

function GuideCard({
  title,
  text,
  mark,
  onClick,
}: {
  title: string;
  text: string;
  mark: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative min-h-48 overflow-hidden rounded-[36px] border border-white/10 bg-black/30 p-6 text-left text-white backdrop-blur-xl transition hover:-translate-y-2 hover:border-white/25 active:scale-95"
    >
      <div className="absolute -right-4 -top-6 text-8xl font-black text-white/10">
        {mark}
      </div>
      <div className="h-1 w-20 rounded-full bg-[var(--accent)]" />
      <h3 className="mt-6 text-2xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-white/50">{text}</p>
      <p className="mt-5 text-sm font-bold text-[var(--accent)]">Открыть →</p>
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="text-white/45">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function Avatar({
  letter,
  image,
  size = "md",
}: {
  letter: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-10 w-10 text-base",
    md: "h-12 w-12 text-lg",
    lg: "h-16 w-16 text-xl",
  };

  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--second)]/30 bg-[var(--second)]/10 font-black text-white ${sizes[size]}`}
    >
      {image ? (
        <img src={image} alt="avatar" className="h-full w-full object-cover" />
      ) : (
        letter
      )}
    </div>
  );
}

function OptionGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-sm font-black uppercase tracking-[0.25em]">
        {title}
      </h3>
      <div className="grid gap-3 md:grid-cols-4">{children}</div>
    </div>
  );
}

function OptionButton({
  active,
  title,
  onClick,
}: {
  active: boolean;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border px-4 py-4 font-bold transition hover:scale-[1.03] ${
        active
          ? "border-white bg-[var(--accent)] text-black"
          : "border-white/10 bg-black/30 text-white hover:bg-white/10"
      }`}
    >
      {title}
    </button>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <p className="text-[11px] font-bold tracking-[0.65em] opacity-45">
        {subtitle}
      </p>
      <h2 className="mt-6 text-6xl font-black">{title}</h2>
    </>
  );
}

function Post({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-10 max-w-3xl rounded-[36px] border border-white/10 bg-black/30 p-6 text-white backdrop-blur-xl">
      <h3 className="text-2xl font-black">{title}</h3>
      <p className="mt-3 text-white/50">{text}</p>
    </div>
  );
}

function Slider({
  title,
  value,
  onChange,
}: {
  title: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-bold">{title}</span>
        <span className="text-white/45">{value}</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--accent)]"
      />
    </div>
  );
}

export function TextPage({ title }: { title: string }) {
  return (
    <>
      <SectionTitle title={title} subtitle="раздел в разработке" />

      <div className="mt-10 max-w-3xl rounded-[36px] border border-white/10 bg-black/30 p-6 text-white backdrop-blur-xl">
        <h3 className="text-2xl font-black">Контент появится позже</h3>
        <p className="mt-3 text-white/50">
          Этот раздел позже будет редактироваться через базу.
        </p>
      </div>
    </>
  );
}

export function ReglamentPage() {
  const blocks = [
    {
      title: "1. Общие положения",
      text: `[1] Данный регламент обязателен к исполнению всеми наборными персонажами.

Примечание:
Все наборные люди с ролью "старший состав фракции" обязаны исполнять данный регламент наравне с наборными лорными персонажами.

Наказание:
Предупреждение — перманентный выговор.

[1.2] В случае рецидива нарушений мера наказаний увеличивается.

[1.3] Каждый лорный персонаж обязан строго и четко выполнять поставленные РП-составом указания, связанные с проектом.

Наказание:
Выговор — перманентный выговор.

[1.4] Каждый лорный персонаж обязан строго и четко выполнять поставленные лидером фракции обязанности и указания по ней.

Наказание:
Предупреждение — перманентный выговор.

[1.5] Каждый наборный лорный персонаж обязан строго и четко выполнять расписанные обязанности.

Наказание:
Предупреждение / выговор.

[1.6] Каждый лорный персонаж обязан в полной мере отыгрывать свою квоту по онлайну. Категорически запрещено отыгрывать квоту в AFK или выполнением бесполезной деятельности.

Пример:
Молился у могилки полтора часа, сидел караулил озеро 8 часов и т.п.

Наказание:
Выговор / перманентный выговор.

[1.7] Квота лорных персонажей учитывается с 15:00 до 00:00 по МСК.

Наказание:
Игнорирование наигранного времени квоты вне этого периода.

[1.8] Запрещена махинация с правилами внутреннего регламента лорников, а также активный поиск дыр в нём.

Наказание:
Выговор / перманентный выговор.

[1.9] Если вы только встали на лорного персонажа и до следующей отчётности остаётся неделя или меньше, количество скриншотов в вашу отчётность считается так: количество дней на лорнике * 2, при этом первый день не считается.

Пример:
Отчётность у лорников 07.09, я встал на лорника 05.09 — я должен заполнить отчёт на 2 скриншота.

Наказание:
Предупреждение.`,
    },
    {
      title: "2. Правила поведения",
      text: `[2] Запрещено злоупотребление своими полномочиями.

Наказание:
Выговор / перманентный выговор.

[2.1] Каждый наборный персонаж своим поведением, включая вторую профессию, должен подавать пример другим игрокам. Запрещается вне РП грубить, уничижительно общаться или как-либо иначе проявлять неуважение к игрокам проекта, нарушать или подбивать на нарушение правил проекта.

Также лорные персонажи должны показывать пример качественного игрового отыгрыша персонажей.

Наказание:
Предупреждение / выговор.

[2.2] Категорически запрещено использовать свои привилегии для "душки" или "слива" других игроков.

Наказание:
Перманентный выговор.

[2.3] Каждый лорный персонаж должен в полной мере отыгрывать своего персонажа. Любое развитие персонажа с учётом вселенной проекта и его таймлайна должно быть согласовано с РП-составом.

Наказание:
Предупреждение / выговор.

[2.4] Все конфликты между лорными персонажами должны решаться с представителем РП-состава.

Наказание:
Предупреждение / выговор.

[2.5] Лорным персонажам запрещено участие в NonRP процессе.

Исключение:
NonRP Event, зона полного отсутствия RP.

Примечание:
Лорные персонажи также обязаны пресекать любые NonRP ситуации со стороны других игроков.

Наказание:
Предупреждение / выговор.

[2.6] При получении трёх выговоров во фракции человек получает выговор на своего лорного персонажа.

[2.7] За нарушение правил Discord вы также получите наказание:
— активная ссора с человеком + оскорбления = выговор;
— оскорбления / травля = выговор;
— прочие нарушения = предупреждения.

За НПД наказание выдаётся только в том случае, если вас напрямую поймали за руку: РП-персонал + тайм-аут от модераторов.`,
    },
    {
      title: "3. Правила отчётности",
      text: `[3] Каждый наборный лорный персонаж обязан заполнять отчётность строго по установленному концепту.

Наказание:
Предупреждение.

[3.1] Каждый наборный лорный персонаж обязан отправлять отчёты в установленное время.

Примечание:
Если нет возможности отправить отчёт вовремя, необходимо оповестить представителя РП-состава, закреплённого за вашей фракцией.

[3.1.1] Минимальная норма скриншотов составляет 5 скринов.

Наказание:
Выговор.

[3.2] Категорически запрещено фабриковать отчётность.

Наказание:
Перманентный выговор.

[3.3] Запрещено закрывать всю отчётность за 3–4 дня. Отчёт должен равномерно заполняться по мере установленного периода.

Наказание:
Выговор.

[3.4] Запрещено прикладывать обработанные скриншоты. На скриншотах должен быть полностью виден игровой HUD, время и вы.

Наказание:
Скриншоты не засчитываются в отчёт.

[3.5] Запрещено скидывать с одной ситуации более трёх скриншотов.

Исключение:
Требование регламента или распоряжение РП-состава.

Наказание:
Скриншоты не засчитываются в отчёт.

[3.6] Запрещено заполнять отчётность бесполезной, однотипной или спам-деятельностью.

Пояснение:
Запрещено заполнять отчётность кучей однотипных действий.

Пояснение 2:
Запрещено скидывать скрины по типу "стоял на озере" или "убивал демонов".

Наказание:
Скриншоты не засчитываются в отчёт.

[3.7] Максимальное количество скриншотов с деятельностью в Discord — 1.

[3.8] Максимальное количество скриншотов с захватов — 1.

[3.8.1]
Максимально базовое взаимодействие с истребителями / демонами с одной ситуации — 1 скрин.
Максимально базовая тренировка с одной ситуации — 2 скрина.
Максимально событие / фракционная активность с одной ситуации — 3 скрина.

Наказание:
Скриншоты не засчитываются в отчёт.

[3.9] Запрещено скидывать скриншоты, сделанные вне игрового времени квоты: раньше 15:00 или позже 00:00.

Наказание:
Скриншоты не засчитываются в отчёт.

[3.10] Отчёт по обязательным ивентам / событиям сопровождается двумя скриншотами:
— скриншот сбора / организации / инструктажа;
— процесс события / ивента или его завершение.

Наказание:
Скриншоты не засчитываются в отчёт.

[3.11] В отчёте каждого наборного Столпа или Луны должно присутствовать минимум одно событие для состава дыхания / отряда.

[3.11.1] Если не удаётся организовать состав для проведения события дыхания / отряда, вы проводите событие для остальных членов фракции.

Наказание:
Предупреждение / выговор.`,
    },
    {
      title: "4. Вторые профессии",
      text: `[4] Вторые профессии доступны исключительно лидерам, Столпам, Лунам и РП-персонажам.

Примечание:
РП-персонажи — профессии, которые не имеют способностей или возможности сражаться.

Исключение:
У главных героев с личной моделью есть вторая профессия. Донатные лорники также имеют вторую профессию.

[4.1] Разрешённые вторые профессии:

Охотники на демонов:
— охотники на демонов;
— открытые дыхания;
— закрытые дыхания с одобрения Столпов;
— донатные дыхания исключительно с одобрения Столпа этого дыхания.

Демоны:
— демоны;
— архидемон, если на второй профессии есть такие достижения;
— отряды с одобрения смотрящей Луны / владельца.

Профессии пауков под запретом.

Наказание:
Выговор.

[4.2] Запрещено бегать по отрядам / дыханиям.

Наказание:
Запрет на использование второй профессии / предупреждение.

[4.3] Запрещено нарушать правила проекта на второй профессии.

Наказание:
Выговор на лорного персонажа.

[4.4] Запрещено занимать какие-либо должности на вторых профессиях: инструктор, цугуко, командир / зам. командира отрядов.

Исключение:
Донатная модель позволяет пройти набор на должность.

Наказание:
Запрет на использование второй профессии / предупреждение.

[4.5] Переход на вторые профессии / слот в противоположной фракции разрешён после отыгровки основной квоты онлайна или во время отпуска.

Наказание:
Запрет на использование второй профессии / выговор.`,
    },
    {
      title: "5. AFK на лорных персонажах",
      text: `[5] Категорически запрещено уходить в AFK на видных местах.

Наказание:
Предупреждение.`,
    },
    {
      title: "6. Вторичные лорные персонажи",
      text: `[6] К вторичным лорным персонажам относятся все лорные персонажи, которые набираются в Discord фракции согласно регламенту.

Персонажи:
2, 3, 4, 6 низшая Луна, семья Убуяшики.

Наказание за набор без соблюдения регламента:
Строгий выговор.

[6.1] Все вторичные лорные персонажи в течение 24 часов должны получить роль Lore Character в основном DS Yufu, запросив её у Dep.RP / RP Curator.

Наказание:
Снятие с лорного персонажа.

[6.2] В случае получения выговора вторичным лорным персонажем от РП-персонала, Куратора или Зам. куратора, лидер получает предупреждение.

[6.3] Квота:
Квота семьи Убуяшики назначается Кагаей.
Квота 2, 3, 4, 6 низших Лун назначается Мудзаном.

Наказание:
Выговор.

Наказание за халатность со стороны лидера:
Строгий выговор лидеру.

[6.4] Правило иерархии:
2, 3, 4, 6 низшая Луна отталкиваются от своего положения в иерархии.

Семья Убуяшики может руководить членами организации от учеников до Столпов. Подчиняются только лидеру организации. Не могут вносить изменения в структуру организации.

[6.5] Регламент выдачи наказаний:
Выдавать наказания данным лорным персонажам может Dep.RP / RP Curator / Dep. Curator / Curator и лидер фракции.

Наказания выдаются внутри фракционного Discord-канала.

При получении 3/3 во фракции лорник снимается с поста.

[6.6] Регламент отпусков:
Отпуска запрашиваются в Discord-канале фракции.`,
    },
    {
      title: "7. Снятие и ЧС",
      text: `[6.7] Регламент ЧС лорников:
При снятии вторичный лорник получает чёрный список лорников сроком от 5 дней до перманентного чёрного списка.

Срок зависит от причины снятия.

[6.7] Снятие после испытательного срока:
При снятии сразу после испытательного срока вы получаете ЧС сроком на 3 месяца.

При снятии через неделю после испытательного срока вы получите ЧС сроком на 5 дней, если не имеете выговоров.

[6.8] Снятие с выговорами:
При снятии после испытательного срока с выговорами вы получаете ЧС, соответствующий количеству выговоров:

1 выговор = ЧС 1 месяц.
2 выговора = ЧС 2 месяца.
3 выговора = перманентный ЧС.`,
    },
  ];

  return (
    <>
      <SectionTitle title="Регламент лорников" subtitle="внутренний порядок" />

      <div className="mt-10 max-w-5xl space-y-7">
        {blocks.map((block, index) => (
          <section
            key={block.title}
            className="scroll-card group relative overflow-hidden rounded-[34px] border border-white/10 bg-black/35 p-6 text-white backdrop-blur-xl transition hover:border-white/25"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/15 to-transparent opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

            <div className="relative z-10">
              <div className="mb-5 h-1 w-24 rounded-full bg-[var(--accent)] transition group-hover:w-40" />
              <h3 className="text-3xl font-black">{block.title}</h3>
              <div className="mt-5 whitespace-pre-line leading-8 text-white/68">
                {block.text}
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

  type QuotaReport = {
  id: number;
  author: string;
  category: "Лидер фракции" | "Столп" | "Луна";
  link: string;
  comment: string;
  status: "На проверке" | "Принято" | "Отклонено";
  createdAt: string;
  checkedBy: string | null;
  checkedAt: string | null;
  reviewComment: string;
};

export function QuotaPage({ currentUser }: { currentUser: UserProfile }) {
  const [reports, setReports] = useState<QuotaReport[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("kamiko-quota-reports");
    return saved ? JSON.parse(saved) : [];
  });

  const [category, setCategory] = useState<QuotaReport["category"]>("Столп");
  const [link, setLink] = useState("");
  const [comment, setComment] = useState("");
  const [reviewText, setReviewText] = useState<Record<number, string>>({});

  const canModerate = currentUser.isOwner || currentUser.isModerator;

  useEffect(() => {
    localStorage.setItem("kamiko-quota-reports", JSON.stringify(reports));
  }, [reports]);

  function saveReports(next: QuotaReport[]) {
    setReports(next);
    localStorage.setItem("kamiko-quota-reports", JSON.stringify(next));
  }

  function sendReport() {
    if (!link.trim()) return;

    const report: QuotaReport = {
      id: Date.now(),
      author: currentUser.nickname,
      category,
      link: link.trim(),
      comment: comment.trim(),
      status: "На проверке",
      createdAt: nowLabel(),
      checkedBy: null,
      checkedAt: null,
      reviewComment: "",
    };

    saveReports([report, ...reports]);

    writeLog({
      type: "Отчёт отправлен",
      actor: currentUser.nickname,
      target: category,
      details: link.trim(),
    });

    setLink("");
    setComment("");
  }

  function acceptReport(id: number) {
    const report = reports.find((r) => r.id === id);
    if (!report) return;

    saveReports(
      reports.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "Принято",
              checkedBy: currentUser.nickname,
              checkedAt: nowLabel(),
              reviewComment: reviewText[id] || "Отчёт принят.",
            }
          : r
      )
    );

    writeLog({
      type: "Отчёт принят",
      actor: currentUser.nickname,
      target: report.author,
      details: `${report.category}: ${reviewText[id] || "Отчёт принят."}`,
    });

    if (typeof addNotification !== "undefined") {
      addNotification({
        user: report.author,
        type: "Квоты",
        title: "Отчёт принят",
        text: `Ваш отчёт категории "${report.category}" принят. Проверил: ${currentUser.nickname}.`,
      });
    }
  }

  function rejectReport(id: number) {
    const report = reports.find((r) => r.id === id);
    if (!report) return;

    const reason = reviewText[id]?.trim() || "Причина не указана.";

    saveReports(
      reports.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "Отклонено",
              checkedBy: currentUser.nickname,
              checkedAt: nowLabel(),
              reviewComment: reason,
            }
          : r
      )
    );

    writeLog({
      type: "Отчёт отклонён",
      actor: currentUser.nickname,
      target: report.author,
      details: `${report.category}: ${reason}`,
    });

    if (typeof addNotification !== "undefined") {
      addNotification({
        user: report.author,
        type: "Квоты",
        title: "Отчёт отклонён",
        text: `Ваш отчёт категории "${report.category}" отклонён. Причина: ${reason}`,
      });
    }
  }

  function deleteReport(id: number) {
    const report = reports.find((r) => r.id === id);

    saveReports(reports.filter((r) => r.id !== id));

    writeLog({
      type: "Удаление отчёта",
      actor: currentUser.nickname,
      target: report?.author || "Неизвестно",
      details: report?.category || `Отчёт #${id}`,
    });
  }

  const pendingReports = reports.filter((r) => r.status === "На проверке");
  const archiveReports = reports.filter((r) => r.status !== "На проверке");

  return (
    <>
      <SectionTitle title="Квоты" subtitle="отчётность лорников" />

      <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="space-y-6">
          <div className="rounded-[34px] border border-white/10 bg-black/35 p-6 text-white backdrop-blur-xl">
            <h3 className="text-2xl font-black">Отправить отчёт</h3>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as QuotaReport["category"])
              }
              className="mt-5 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-4 outline-none"
            >
              <option>Лидер фракции</option>
              <option>Столп</option>
              <option>Луна</option>
            </select>

            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Ссылка на Google Docs..."
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-4 outline-none placeholder:text-white/30"
            />

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Комментарий к отчёту..."
              className="mt-3 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/50 px-4 py-4 outline-none placeholder:text-white/30"
            />

            <button
              onClick={sendReport}
              className="mt-4 w-full rounded-full bg-white px-6 py-4 font-black text-black shadow-[0_0_var(--glow)_var(--accent)] transition hover:scale-105 active:scale-95"
            >
              Отправить
            </button>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-black/35 p-6 text-white backdrop-blur-xl">
            <h3 className="text-2xl font-black">На проверке</h3>

            <div className="mt-5 space-y-4">
              {pendingReports.length === 0 && (
                <p className="text-white/40">Отчётов на проверке пока нет.</p>
              )}

              {pendingReports.map((report) => (
                <QuotaReportCard
                  key={report.id}
                  report={report}
                  canModerate={canModerate}
                  reviewText={reviewText[report.id] || ""}
                  setReviewText={(value) =>
                    setReviewText((old) => ({ ...old, [report.id]: value }))
                  }
                  onAccept={() => acceptReport(report.id)}
                  onReject={() => rejectReport(report.id)}
                  onDelete={() => deleteReport(report.id)}
                />
              ))}
            </div>
          </div>
        </section>

        <aside className="rounded-[34px] border border-white/10 bg-black/35 p-6 text-white backdrop-blur-xl">
          <h3 className="text-2xl font-black">Архив</h3>

          <div className="mt-5 space-y-4">
            {archiveReports.length === 0 && (
              <p className="text-white/40">Архив пока пуст.</p>
            )}

            {archiveReports.map((report) => (
              <QuotaReportCard
                key={report.id}
                report={report}
                canModerate={canModerate}
                archive
                reviewText=""
                setReviewText={() => {}}
                onAccept={() => {}}
                onReject={() => {}}
                onDelete={() => deleteReport(report.id)}
              />
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

function QuotaReportCard({
  report,
  canModerate,
  archive,
  reviewText,
  setReviewText,
  onAccept,
  onReject,
  onDelete,
}: {
  report: QuotaReport;
  canModerate: boolean;
  archive?: boolean;
  reviewText: string;
  setReviewText: (value: string) => void;
  onAccept: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  const statusClass =
    report.status === "Принято"
      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
      : report.status === "Отклонено"
      ? "border-red-400/30 bg-red-500/10 text-red-100"
      : "border-yellow-400/30 bg-yellow-500/10 text-yellow-100";

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-lg font-black">{report.category}</h4>
          <p className="mt-1 text-sm text-white/40">
            {report.author} · {report.createdAt}
          </p>
        </div>

        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass}`}>
          {report.status}
        </span>
      </div>

      {report.comment && (
        <p className="mt-3 leading-6 text-white/60">{report.comment}</p>
      )}

      <a
        href={report.link}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-bold text-[var(--accent)] transition hover:bg-white/10"
      >
        Открыть отчёт →
      </a>

      {archive && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3">
          <p className="text-sm text-white/45">
            Проверил: {report.checkedBy || "—"}
          </p>
          <p className="text-sm text-white/45">
            Дата: {report.checkedAt || "—"}
          </p>
          {report.reviewComment && (
            <p className="mt-2 text-sm leading-6 text-white/65">
              Комментарий: {report.reviewComment}
            </p>
          )}
        </div>
      )}

      {canModerate && !archive && (
        <div className="mt-4 space-y-3">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Комментарий проверки / причина отклонения..."
            className="min-h-20 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onAccept}
              className="rounded-full bg-emerald-400 px-5 py-2 font-black text-black transition hover:scale-105 active:scale-95"
            >
              Принять
            </button>

            <button
              onClick={onReject}
              className="rounded-full bg-red-400 px-5 py-2 font-black text-black transition hover:scale-105 active:scale-95"
            >
              Отклонить
            </button>

            <button
              onClick={onDelete}
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 font-bold transition hover:bg-white/10"
            >
              Удалить
            </button>
          </div>
        </div>
      )}

      {canModerate && archive && (
        <button
          onClick={onDelete}
          className="mt-4 rounded-full border border-red-400/30 bg-red-500/10 px-5 py-2 text-sm font-bold text-red-100 transition hover:bg-red-500/20"
        >
          Удалить из архива
        </button>
      )}
    </article>
  );
}

function FeedChatBox({ currentUser }: { currentUser: UserProfile }) {
  const [messages, setMessages] = useState<
    { id: number; author: string; text: string; time: string }[]
  >(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("kamiko-feed-chat");
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem("kamiko-feed-chat", JSON.stringify(messages));
  }, [messages]);

  function sendMessage() {
    if (!text.trim()) return;

    const message = {
      id: Date.now(),
      author: currentUser.nickname,
      text: text.trim(),
      time: nowLabel(),
    };

    setMessages([...messages, message]);
    setText("");

    writeLog({
      type: "Сообщение в чате ленты",
      actor: currentUser.nickname,
      target: "Живая лента",
      details: message.text,
    });
  }

  function deleteMessage(id: number) {
    const message = messages.find((item) => item.id === id);

    setMessages(messages.filter((item) => item.id !== id));

    writeLog({
      type: "Удаление сообщения чата ленты",
      actor: currentUser.nickname,
      target: message?.author || "Неизвестно",
      details: message?.text || `Сообщение #${id}`,
    });
  }

 const canDelete = currentUser.isOwner || currentUser.isModerator;

  return (
    <div className="rounded-[34px] border border-white/10 bg-black/35 p-5 text-white backdrop-blur-xl">
      <h3 className="text-xl font-black">Общий чат ленты</h3>

      <p className="mt-2 text-sm leading-6 text-white/45">
        Здесь можно быстро обсуждать посты, события и новости лорников.
      </p>

      <div className="mt-5 max-h-[360px] space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/40">
            Сообщений пока нет.
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="font-black">{message.author}</span>
                <span className="text-xs text-white/35"> · {message.time}</span>
              </div>

              {(canDelete || message.author === currentUser.nickname) && (
                <button
                  onClick={() => deleteMessage(message.id)}
                  className="text-xs font-bold text-red-200/80 hover:text-red-100"
                >
                  удалить
                </button>
              )}
            </div>

            <p className="mt-2 text-sm leading-6 text-white/65">
              {message.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Написать в чат..."
          className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
        />

        <button
          onClick={sendMessage}
          className="rounded-full bg-white px-5 py-3 font-black text-black transition hover:scale-105 active:scale-95"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

function AdminChat({ currentUser }: { currentUser: UserProfile }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("admin_chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  if (!currentUser.isOwner && !currentUser.isModerator) {
    return null;
  }

  const send = () => {
    if (!text.trim()) return;

    const msg = {
      id: Date.now(),
      author: currentUser.nickname,
      text,
      time: new Date().toLocaleTimeString(),
    };

    const updated = [msg, ...messages];
    setMessages(updated);
    localStorage.setItem("admin_chat", JSON.stringify(updated));
    setText("");
  };

  return (
    <div className="mt-8 rounded-[30px] border border-white/10 bg-black/40 p-5 text-white backdrop-blur-sm">
      <h3 className="text-xl font-black">Админ-чат</h3>

      <div className="mt-4 max-h-[250px] space-y-2 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-white/40">Сообщений пока нет</p>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="rounded-xl bg-white/[0.04] p-3 text-sm">
            <p className="font-bold">{msg.author}</p>
            <p>{msg.text}</p>
            <p className="text-xs text-white/30">{msg.time}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написать сообщение..."
          className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
        />

        <button
          onClick={send}
          className="rounded-xl bg-[var(--accent)] px-4 font-bold text-black"
        >
          →
        </button>
      </div>
    </div>
  );
}