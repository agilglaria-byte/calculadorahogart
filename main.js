/* =========================================================
   Calculadora Hogar — main.js
   Vanilla JS, sin dependencias externas.
   - Menú móvil accesible
   - Año dinámico en el footer
   - Banner de cookies con preferencia guardada en localStorage
   - Validación básica del formulario de contacto (sin backend)
   ========================================================= */
(function () {
  "use strict";

  /* -----------------------------
     Menú móvil
  ------------------------------ */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
        document.body.style.overflow = "";
      }
    });
  }

  /* -----------------------------
     Año del footer
  ------------------------------ */
  function initYear() {
    var yearEl = document.getElementById("current-year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  /* -----------------------------
     Banner de cookies
  ------------------------------ */
  function initCookieBanner() {
    var banner = document.getElementById("cookie-banner");
    if (!banner) return;

    var STORAGE_KEY = "calculadora-hogar-cookie-consent";

    function getConsent() {
      try {
        return window.localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        return null;
      }
    }

    function setConsent(value) {
      try {
        window.localStorage.setItem(STORAGE_KEY, value);
      } catch (e) {
        /* localStorage no disponible: el banner volverá a mostrarse */
      }
    }

    if (!getConsent()) {
      window.setTimeout(function () {
        banner.classList.add("is-visible");
      }, 400);
    }

    var acceptBtn = document.getElementById("cookie-accept");
    var rejectBtn = document.getElementById("cookie-reject");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        setConsent("accepted");
        banner.classList.remove("is-visible");
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener("click", function () {
        setConsent("rejected");
        banner.classList.remove("is-visible");
      });
    }
  }

  /* -----------------------------
     Formulario de contacto
     (sitio estático: no hay backend; se valida en cliente
     y se muestra un mensaje de confirmación. Para producción,
     conecta el envío a un servicio de formularios o a tu API.)
  ------------------------------ */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var msg = document.getElementById("form-message");

    function showMessage(type, text) {
      if (!msg) return;
      msg.textContent = text;
      msg.className = "form-msg is-visible " + type;
      msg.setAttribute("role", type === "error" ? "alert" : "status");
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.elements["name"];
      var email = form.elements["email"];
      var message = form.elements["message"];
      var consent = form.elements["consent"];

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        showMessage("error", "Por favor, completa todos los campos obligatorios.");
        return;
      }

      if (!isValidEmail(email.value.trim())) {
        showMessage("error", "Introduce un correo electrónico válido.");
        email.focus();
        return;
      }

      if (consent && !consent.checked) {
        showMessage("error", "Debes aceptar la política de privacidad para enviar el mensaje.");
        return;
      }

      /* Simulación de envío correcto en un sitio estático */
      showMessage(
        "success",
        "¡Gracias, " + name.value.trim().split(" ")[0] + "! Hemos recibido tu mensaje y te responderemos lo antes posible."
      );
      form.reset();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initYear();
    initCookieBanner();
    initContactForm();
  });
})();
