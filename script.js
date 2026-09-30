(() => {
  "use strict";

  document.documentElement.classList.add("js");

  // Reveal content as it enters the viewport; the HTML stays visible without JS.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  document.querySelectorAll("#year, [data-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector("#site-nav");
  const setMenuOpen = (open) => {
    menuToggle?.setAttribute("aria-expanded", String(open));
    siteNav?.classList.toggle("is-open", open);
  };
  menuToggle?.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  siteNav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) setMenuOpen(false);
  });
  const desktopQuery = window.matchMedia("(min-width: 961px)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) setMenuOpen(false);
  });

  const thankYou = document.querySelector("#thank-you-modal");
  const syncScrollLock = () => {
    document.body.classList.toggle("modal-open", Boolean(
      document.querySelector(".teacher-dialog[open]") || (thankYou && !thankYou.hidden)
    ));
    document.body.classList.toggle("gallery-modal-open", Boolean(
      document.querySelector(".gallery-viewer[open]")
    ));
  };

  // Native dialogs provide focus containment and Escape-to-close behavior.
  document.querySelectorAll("[data-teacher-dialog]").forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.teacherDialog);
    if (!dialog) return;
    trigger.addEventListener("click", () => {
      dialog.querySelectorAll(".teacher-dialog__layout, .teacher-dialog__content")
        .forEach((panel) => { panel.scrollTop = 0; });
      if (!dialog.open) dialog.showModal();
      syncScrollLock();
      dialog.querySelector(".teacher-dialog__close")?.focus({ preventScroll: true });
    });
    dialog.querySelector(".teacher-dialog__close")?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (
        event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom
      )) dialog.close();
    });
    dialog.addEventListener("close", () => {
      syncScrollLock();
      if (!thankYou || thankYou.hidden) trigger.focus({ preventScroll: true });
    });
  });

  const galleryViewer = document.querySelector(".gallery-viewer");
  const photoStrips = [...document.querySelectorAll(".photo-strip")];
  let galleryReturnFocus = null;

  const resetManualNavigation = (strip) => {
    strip.querySelector(".photo-strip__viewport").scrollLeft = 0;
    strip.classList.remove("is-manual");
  };

  photoStrips.forEach((strip) => {
    const viewport = strip.querySelector(".photo-strip__viewport");
    const group = strip.querySelector(".photo-strip__group");
    if (!viewport || !group) return;

    // Only the first set participates in keyboard/screen-reader navigation.
    const duplicate = group.cloneNode(true);
    duplicate.classList.add("photo-strip__group--duplicate");
    duplicate.setAttribute("aria-hidden", "true");
    duplicate.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    duplicate.querySelectorAll("button").forEach((button) => { button.tabIndex = -1; });
    duplicate.querySelectorAll("img").forEach((image) => {
      image.dataset.galleryAlt = image.alt;
      image.alt = "";
    });
    group.after(duplicate);
    strip.classList.add("is-enhanced");

    viewport.addEventListener("focusin", (event) => {
      if (event.target.matches(":focus-visible")) {
        strip.classList.add("is-manual");
        if (event.target.matches(".photo-strip__photo-button")) {
          event.target.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
        }
      }
    });
    viewport.addEventListener("focusout", (event) => {
      if (!viewport.contains(event.relatedTarget) && !galleryViewer?.open) {
        resetManualNavigation(strip);
      }
    });
    strip.addEventListener("click", (event) => {
      const button = event.target.closest(".photo-strip__photo-button");
      if (!button || !galleryViewer) return;
      const source = button.querySelector("img");
      const photo = galleryViewer.querySelector(".gallery-viewer__photo");
      const title = galleryViewer.querySelector("#gallery-viewer-title");
      photo.src = source.currentSrc || source.src;
      photo.alt = source.dataset.galleryAlt || source.alt;
      title.textContent = button.closest("figure").querySelector("figcaption").textContent;
      galleryReturnFocus = strip.querySelector(".photo-strip__heading h3");
      photoStrips.forEach((item) => item.classList.add("is-viewing"));
      galleryViewer.showModal();
      syncScrollLock();
      galleryViewer.querySelector(".gallery-viewer__close")?.focus({ preventScroll: true });
    });
  });

  galleryViewer?.querySelector(".gallery-viewer__close")?.addEventListener("click", () => galleryViewer.close());
  galleryViewer?.addEventListener("click", (event) => {
    if (event.target === galleryViewer || event.target.matches(".gallery-viewer__stage")) {
      galleryViewer.close();
    }
  });
  galleryViewer?.addEventListener("close", () => {
    // Restoring focus to a photo would leave its strip in keyboard pause mode.
    photoStrips.forEach((strip) => {
      strip.classList.remove("is-viewing");
      resetManualNavigation(strip);
    });
    syncScrollLock();
    if (!thankYou || thankYou.hidden) galleryReturnFocus?.focus({ preventScroll: true });
  });

  const form = document.querySelector("#contact-form");
  const formError = form?.querySelector(".form-error");
  const submitButton = form?.querySelector('[type="submit"]');
  let submitting = false;
  let thankYouReturnFocus = null;
  const inertBeforeThanks = new Map();
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const closeThankYou = () => {
    if (!thankYou || thankYou.hidden) return;
    thankYou.hidden = true;
    inertBeforeThanks.forEach((wasInert, element) => { element.inert = wasInert; });
    inertBeforeThanks.clear();
    syncScrollLock();
    if (thankYouReturnFocus?.isConnected) thankYouReturnFocus.focus({ preventScroll: true });
  };

  const openThankYou = () => {
    if (!thankYou) return;
    thankYouReturnFocus = submitButton || document.activeElement;
    // A message can finish sending while the visitor is browsing another popup.
    document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
    thankYou.hidden = false;
    [...document.body.children].forEach((element) => {
      if (element === thankYou || element.contains(thankYou)) return;
      inertBeforeThanks.set(element, element.inert);
      element.inert = true;
    });
    syncScrollLock();
    thankYou.querySelector(".thank-you-modal__close")?.focus({ preventScroll: true });
  };

  thankYou?.querySelectorAll(".thank-you-modal__close, .thank-you-modal__backdrop, .thank-you-modal__button")
    .forEach((button) => button.addEventListener("click", closeThankYou));

  document.addEventListener("keydown", (event) => {
    if (!thankYou || thankYou.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeThankYou();
    } else if (event.key === "Tab") {
      const targets = [...thankYou.querySelectorAll(focusableSelector)]
        .filter((element) => element.getClientRects().length && !element.closest('[aria-hidden="true"]'));
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (event.shiftKey && (document.activeElement === first || !thankYou.contains(document.activeElement))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !thankYou.contains(document.activeElement))) {
        event.preventDefault();
        first?.focus();
      }
    }
  });

  form?.querySelector(".whatsapp-button")?.addEventListener("click", () => {
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = ["Hi! I'm interested in music lessons at SoundLab Academy.", ""];
    [["Name", "name"], ["Email", "email"], ["Phone", "phone"], ["Message", "message"]].forEach(([label, field]) => {
      const value = String(data.get(field) || "").trim();
      if (value) lines.push(`${label}: ${value}`);
    });
    window.open(`https://wa.me/85295491119?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting || !form.reportValidity() || form.elements._honey?.value) return;

    submitting = true;
    const idleLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    form.setAttribute("aria-busy", "true");
    formError.hidden = true;
    formError.textContent = "";

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || (result.success !== true && result.success !== "true")) {
        throw new Error(result.message || "Your message could not be sent. Please try again.");
      }
      form.reset();
      openThankYou();
    } catch (error) {
      formError.textContent = error.name === "AbortError"
        ? "Sending took too long. Please check your connection and try again."
        : error.message || "Your message could not be sent. Please try again.";
      formError.hidden = false;
    } finally {
      window.clearTimeout(timeout);
      submitting = false;
      submitButton.disabled = false;
      submitButton.textContent = idleLabel;
      form.removeAttribute("aria-busy");
    }
  });
})();
