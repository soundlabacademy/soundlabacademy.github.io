document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const contactForm = document.getElementById("contact-form");
const emailButton = document.getElementById("email-button");
const year = document.getElementById("year");
const revealItems = document.querySelectorAll(".reveal");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open", !expanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}

const buildMessage = () => {
  const name = document.getElementById("name")?.value.trim() || "";
  const email = document.getElementById("email")?.value.trim() || "";
  const phone = document.getElementById("phone")?.value.trim() || "";
  const message = document.getElementById("message")?.value.trim() || "";

  const lines = ["Hi! I'm interested in music lessons at SoundLab Academy.", ""];

  if (name) {
    lines.push(`Name: ${name}`);
  }
  if (email) {
    lines.push(`Email: ${email}`);
  }
  if (phone) {
    lines.push(`Phone: ${phone}`);
  }
  if (message) {
    lines.push(`Message: ${message}`);
  }

  return lines.join("\n");
};

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const whatsappUrl = `https://wa.me/85295491119?text=${encodeURIComponent(buildMessage())}`;
    window.open(whatsappUrl, "_blank", "noopener");
  });
}

if (emailButton) {
  emailButton.addEventListener("click", () => {
    const subject = encodeURIComponent("Music lessons inquiry");
    const body = encodeURIComponent(buildMessage());
    window.location.href = `mailto:soundlabacademyhk@gmail.com?subject=${subject}&body=${body}`;
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
