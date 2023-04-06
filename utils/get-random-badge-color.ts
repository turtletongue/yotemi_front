import { getRandomNumber } from "@app/utils/index";

const COLORS = [
  "#94B3FD",
  "#42C2FF",
  "#6BB6FF",
  "#00D7FF",
  "#00A3FF",
  "#7291FF",
  "#c86bfe",
  "#8247E5",
  "#A6A7FD",
  "#A3A9FD",
];

const getRandomBadgeColor = () => {
  return COLORS[Math.round(getRandomNumber(0, COLORS.length - 1))].slice(1);
};

export default getRandomBadgeColor;
