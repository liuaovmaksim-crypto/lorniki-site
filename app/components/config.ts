export type Role =
  | "Гость"
  | "Демон"
  | "Истребитель"
  | "Лорник"
  | "Глава фракции"
  | "Владелец";

export type UserProfile = {
  id: number;
  nickname: string;
  role: Role;
  faction: string;
  status: string;
  warnings: number;
  reprimands: number;
  timeoutUntil: string | null;
  isModerator: boolean;
};

export const defaultUser: UserProfile = {
  id: 1,
  nickname: "Yuto",
  role: "Владелец",
  faction: "Система",
  status: "Полный доступ",
  warnings: 0,
  reprimands: 0,
  timeoutUntil: null,
  isModerator: true,
};

export const roles: Role[] = [
  "Гость",
  "Демон",
  "Истребитель",
  "Лорник",
  "Глава фракции",
  "Владелец",
];

export const menu = [
  "Главная",
  "Живая лента",
  "Информация",
  "Квоты",
  "Правила",
  "Регламент",
  "Предложения",
  "Настройки",
  "Админ-панель",
];

export function canAccessPage(user: UserProfile, page: string) {
  if (user.role === "Владелец") return true;
  if (user.isModerator && page === "Админ-панель") return true;

  if (user.role === "Гость") {
    return ["Главная", "Живая лента", "Настройки", "Профиль"].includes(page);
  }

  return page !== "Админ-панель";
}

export const themes = [
  {
    id: "blood",
    name: "Кровавая луна",
    accent: "#fb7185",
    second: "#67e8f9",
  },
  {
    id: "water",
    name: "Водное дыхание",
    accent: "#67e8f9",
    second: "#93c5fd",
  },
  {
    id: "violet",
    name: "Фиолетовая ночь",
    accent: "#a78bfa",
    second: "#fb7185",
  },
];

export type Settings = {
  theme: string;
  accent: string;
  second: string;
  mode: "light" | "auto" | "dark";
  background: "night" | "moon" | "fog" | "clean";
  particleType: "mixed" | "snow" | "butterflies" | "petals";
  glow: number;
  fog: number;
  particles: number;
};

export const defaultSettings: Settings = {
  theme: "blood",
  accent: "#fb7185",
  second: "#67e8f9",
  mode: "dark",
  background: "night",
  particleType: "mixed",
  glow: 55,
  fog: 45,
  particles: 45,
};