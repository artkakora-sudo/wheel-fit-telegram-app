import WebApp from "@twa-dev/sdk";

export function initTelegramApp(): void {
  WebApp.ready();
  WebApp.expand();
  WebApp.setHeaderColor("#0f1419");
  WebApp.setBackgroundColor("#0f1419");
}

export { WebApp };
