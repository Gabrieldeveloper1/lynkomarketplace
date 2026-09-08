/**
 * Avisos no aparelho (celular e computador).
 * Usa o Service Worker quando o site está instalado como aplicativo,
 * e a notificação do navegador quando o site está aberto.
 */

export function pushSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function pushPermission(): NotificationPermission | "unsupported" {
  if (!pushSupported()) return "unsupported";
  return Notification.permission;
}

export async function registerServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register("/sw.js");
  } catch {
    return null;
  }
}

export async function requestPushPermission() {
  if (!pushSupported()) return "unsupported" as const;
  if (Notification.permission === "granted") {
    await registerServiceWorker();
    return "granted" as const;
  }
  const result = await Notification.requestPermission();
  if (result === "granted") await registerServiceWorker();
  return result;
}

export async function showDeviceNotification(opts: {
  title: string;
  body: string;
  link?: string;
  tag?: string;
}) {
  if (!pushSupported() || Notification.permission !== "granted") return false;
  const payload: NotificationOptions & { data?: unknown } = {
    body: opts.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: opts.tag,
    data: { link: opts.link ?? "/" },
  };
  try {
    if ("serviceWorker" in navigator) {
      const reg = (await navigator.serviceWorker.getRegistration()) ?? (await registerServiceWorker());
      if (reg) {
        await reg.showNotification(opts.title, payload);
        return true;
      }
    }
    new Notification(opts.title, payload);
    return true;
  } catch {
    return false;
  }
}
