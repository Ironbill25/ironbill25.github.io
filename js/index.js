function $1(args) {
  return document.querySelector(args[0]);
}

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = themeToggle?.querySelector(".sun-icon");
  const moonIcon = themeToggle?.querySelector(".moon-icon");

  const currentTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  localStorage.setItem("theme", currentTheme);

  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (sunIcon && moonIcon) {
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    }
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    if (sunIcon && moonIcon) {
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");

      const newTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      if (sunIcon && moonIcon) {
        if (newTheme === "dark") {
          sunIcon.style.display = "none";
          moonIcon.style.display = "block";
        } else {
          sunIcon.style.display = "block";
          moonIcon.style.display = "none";
        }
      }
    });
  }
});

const navToggle = document.querySelector(".nav-toggle");
const navbar = document.querySelector(".navbar");

if (navToggle && navbar) {
  navToggle.addEventListener("click", () => {
    navbar.classList.toggle("active");
    navToggle.setAttribute(
      "aria-expanded",
      navToggle.getAttribute("aria-expanded") === "true" ? "false" : "true",
    );
  });

  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target) && !e.target.matches(".nav-toggle")) {
      navbar.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    if (navbar.classList.contains("active")) {
      navbar.classList.remove("active");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });
});

document
  .querySelector(".announcement-banner .closebtn")
  ?.addEventListener("click", () => {
    document.querySelector(".announcement-banner")?.classList.add("hidden");
  });

let lastScroll = 0;
const header = document.querySelector("header");
const navHeight = navbar?.offsetHeight || 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 10) {
    navbar?.classList.add("scrolled");
  } else {
    navbar?.classList.remove("scrolled");
  }

  if (header) {
    const scrollValue = currentScroll * 0.5;
    header.style.backgroundPositionY = `calc(50% + ${scrollValue * 0.5}px)`;
  }

  lastScroll = currentScroll;
});

window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  if (hash) {
    const element = $1(hash);
    if (element) {
      const headerOffset = navHeight + 20;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: "smooth",
      });
    }
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log("ServiceWorker unregistered:", registration.scope);
      }
    } catch (error) {
      console.error("Error unregistering service workers:", error);
    }
  });
}

function updateTime() {
  const time = document.getElementById("time-text");
  if (time) {
    time.textContent = new Date().toLocaleString();
  }
}

setInterval(updateTime, 1000);
updateTime();

const lastUpdated = document.getElementById("last-updated");
if (lastUpdated) {
  lastUpdated.textContent = new Date().toLocaleString();
}

function generateRandomMessage() {
  const randomMessage = document.getElementById("randommessage-text");
  if (randomMessage) {
    const messages = [
      "aughaughaugh",
      "So what's up? Or down. Whatever.",
      "To be or not to be, that isn't the answer.",
      "Who NEEDS planning? Me. And probably you.",
      "Guess what's depressing?.... buttons.",
      "Questions are the key to success and sometimes failure too.",
      "Is it just me or is it super windy outsi-- AAAAAA",
      "Raise your hand if you think this site is still boring",
      "Badges are the key to a good website, maybe.",
      "Key or lock, or door, or window... or potato, or nitrus hyperoxide. Hmm.",
      "It's a a, aa, a,,, aaAAaaAaaAAAAaaAAAAAAA!",
      "Am I the only person that plays CelLua?",
      "I wonder if anyone reads these messages...",
      "Haxe sounds like a cool programming language.",
      "VOTE: Chrome, Firefox, Edge, or Safari?",
      "Radio is cool and annoying at the same time.",
      "Websites, what about sitewebs?",
      "Why are our pages titled 'index', that would infer a table of contents...",
      "A contact page, what... contacting the basketball to get it in the hoop?",
      "Blender mixer shover puller smasher whirrer crasher splasher randomer... wait what?",
      "Who's getting bored?",
      "Here's your free exclamation mark: !",
      "No splashing, no diving, no running, no jumping, no submerging, no swimming, no water...",
      "Chicken or egg, or both...?! Who knows, maybe both a chicken and an egg existed first.",
      "Why can't we just walk through walls? That would SURE be convenient.",
      "Are these splash text, random text, array text, or what?",
      "There's this cool coding website called CodeTorch, but this isn't sponsored, so...",
      "You should click that \"increment\" button with the up arrow.",
      "AI is cool, just don't let it sloppify your website...",
      "I STILL wonder if anybody reads these.",
      "Tornadoes and hurricanes... what's the diff?",
      "*throws a cucumber at you*",
      "Watermelons are like 90% water, why aren't there psuedowatermelons with 50% water?"
    ];
    messages.push("This text has a 1 in " + messages.length + " chance of appearing");
    randomMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
  }
}

window.generateRandomMessage = generateRandomMessage;
generateRandomMessage(); // augh this is so long