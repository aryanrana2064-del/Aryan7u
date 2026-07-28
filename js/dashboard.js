/* ============================================
   ARYAN VX7 — Dashboard Logic
   Protected page: auth.js's onAuthStateChanged listener
   redirects to index.html automatically if no user is found.
   ============================================ */

/**
 * Called by auth.js once a signed-in user is confirmed.
 * Populates the welcome card with the user's profile info.
 */
function renderDashboardUser(user) {
  const gate = document.getElementById("auth-gate");
  const content = document.getElementById("dashboard-content");
  if (gate) gate.style.display = "none";
  if (content) content.style.display = "block";

  const avatar = document.getElementById("dash-avatar");
  const name = document.getElementById("dash-name");
  const email = document.getElementById("dash-email");

  if (avatar) avatar.src = user.photoURL || "";
  if (avatar) avatar.alt = user.displayName || "Client avatar";
  if (name) name.textContent = `Welcome back, ${user.displayName || "Client"}`;
  if (email) email.textContent = user.email || "";

  console.log("[dashboard] Rendered profile for", user.email);
}

document.addEventListener("DOMContentLoaded", () => {
  const signOutBtn = document.getElementById("sign-out-btn");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      signOutUser();
    });
  }

  const requestProjectBtn = document.getElementById("request-project-btn");
  if (requestProjectBtn) {
    requestProjectBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const message = encodeURIComponent("Hi ARYAN VX7, I'd like to request a new project.");
      window.open(`https://wa.me/919286928539?text=${message}`, "_blank");
    });
  }

  console.log("[dashboard] Dashboard script ready");
});
