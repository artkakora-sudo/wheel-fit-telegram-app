import { useEffect, useMemo } from "react";
import { WebApp } from "../lib/telegram";

export function useTelegram() {
  const user = WebApp.initDataUnsafe.user;

  const theme = useMemo(
    () => ({
      bg: WebApp.themeParams.bg_color ?? "#0f1419",
      text: WebApp.themeParams.text_color ?? "#e7ecf3",
      hint: WebApp.themeParams.hint_color ?? "#8b95a5",
      button: WebApp.themeParams.button_color ?? "#2aabee",
      buttonText: WebApp.themeParams.button_text_color ?? "#ffffff",
    }),
    [],
  );

  useEffect(() => {
    const onTheme = () => {
      document.documentElement.style.setProperty(
        "--tg-bg",
        WebApp.themeParams.bg_color ?? "#0f1419",
      );
    };
    WebApp.onEvent("themeChanged", onTheme);
    onTheme();
    return () => WebApp.offEvent("themeChanged", onTheme);
  }, []);

  return {
    user,
    theme,
    isTelegram: Boolean(WebApp.initData),
    haptic: WebApp.HapticFeedback,
    mainButton: WebApp.MainButton,
  };
}
