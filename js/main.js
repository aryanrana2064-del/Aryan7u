/* ============================================
   ARYAN VX7 — Landing Page Logic
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // "GET STARTED" / nav CTA buttons trigger Google login,
  // unless the user is already signed in (auth.js swaps label to
  // "GO TO DASHBOARD" and this click just navigates there instead).
  document.querySelectorAll("[data-auth-trigger]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      if (auth.currentUser) {
        window.location.href = "dashboard.html";
        return;
      }

      btn.setAttribute("disabled", "true");
      const originalText = btn.textContent;
      btn.textContent = "SIGNING IN…";

      signInWithGoogle();

      // Re-enable in case popup was closed / errored quickly
      setTimeout(() => {
        if (!auth.currentUser) {
          btn.removeAttribute("disabled");
          btn.textContent = originalText;
        }
      }, 1500);
    });
  });

  // Smooth-scroll for in-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  console.log("[main] Landing page ready");
});
