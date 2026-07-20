import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Keep the branded boot screen visible for at least this long so the loader
// animation actually plays — otherwise a fast (dev) bootstrap dismisses it in a
// few milliseconds and it looks like nothing happened.
const BOOT_MIN_MS = 1100;
const bootStart = performance.now();

/** Fade out and remove the branded boot screen from index.html. */
function dismissBootScreen(): void {
  const boot = document.getElementById('lumina-boot');
  if (!boot) return;
  boot.classList.add('is-hidden');
  const remove = () => boot.remove();
  boot.addEventListener('transitionend', remove, { once: true });
  // Fallback in case the transition never fires (e.g. reduced motion).
  setTimeout(remove, 600);
}

bootstrapApplication(App, appConfig)
  .then(() => {
    const wait = Math.max(0, BOOT_MIN_MS - (performance.now() - bootStart));
    setTimeout(dismissBootScreen, wait);
  })
  .catch((err) => {
    console.error(err);
    dismissBootScreen();
  });
