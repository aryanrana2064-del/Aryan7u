/* ============================================
   ARYAN VX7 — Authentication
   Google Sign-In via Firebase, session handling,
   protected route logic for dashboard.html
   ============================================ */

/**
 * Trigger Google Sign-In popup.
 * On success: saves/updates the user profile in Realtime Database
 * and redirects to the dashboard.
 */
function signInWithGoogle() {
  console.log("[auth] Starting Google sign-in...");

  auth.signInWithPopup(googleProvider)
    .then((result) => {
      const user = result.user;
      console.log("[auth] Sign-in success:", user.uid);
      return saveUserToDatabase(user);
    })
    .then(() => {
      if (typeof showToast === "function") {
        showToast("Signed in successfully. Welcome!", "success");
      }
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error("[auth] Sign-in error:", error.code, error.message);
      handleAuthError(error);
    });
}

/**
 * Sign the current user out and redirect to the home page.
 */
function signOutUser() {
  console.log("[auth] Signing out...");
  auth.signOut()
    .then(() => {
      if (typeof showToast === "function") {
        showToast("Signed out. See you soon!", "success");
      }
      setTimeout(() => {
        window.location.href = "index.html";
      }, 600);
    })
    .catch((error) => {
      console.error("[auth] Sign-out error:", error.code, error.message);
      handleAuthError(error);
    });
}

/**
 * Persist / update the signed-in user's profile in Realtime Database.
 */
function saveUserToDatabase(user) {
  const userRef = db.ref("users/" + user.uid);
  const payload = {
    uid: user.uid,
    name: user.displayName || "Client",
    email: user.email || "",
    photoURL: user.photoURL || "",
    lastLogin: firebase.database.ServerValue.TIMESTAMP
  };

  return userRef.update(payload)
    .then(() => {
      console.log("[auth] User profile saved to database");
    })
    .catch((error) => {
      // Non-fatal: don't block the login flow if the DB write fails
      console.error("[auth] Failed to save user to database:", error.message);
    });
}

/**
 * Central error handler for auth operations — surfaces a friendly toast.
 */
function handleAuthError(error) {
  let message = "Something went wrong. Please try again.";

  switch (error.code) {
    case "auth/popup-closed-by-user":
      message = "Sign-in cancelled.";
      break;
    case "auth/popup-blocked":
      message = "Popup blocked by browser. Please allow popups and retry.";
      break;
    case "auth/network-request-failed":
      message = "Network error. Check your connection and try again.";
      break;
    case "auth/cancelled-popup-request":
      return; // silent — duplicate popup requests, not a real error
    default:
      message = error.message || message;
  }

  if (typeof showToast === "function") {
    showToast(message, "error");
  } else {
    console.warn("[auth]", message);
  }
}

/**
 * Global auth-state listener.
 * - Updates the navbar user chip on any page where it's present.
 * - Enforces the protected route on dashboard.html.
 */
auth.onAuthStateChanged((user) => {
  const isDashboard = document.body.dataset.page === "dashboard";
  const userChip = document.getElementById("user-chip");
  const userChipImg = document.getElementById("user-chip-avatar");
  const userChipName = document.getElementById("user-chip-name");
  const getStartedBtn = document.getElementById("get-started-btn");

  if (user) {
    console.log("[auth] State: signed in as", user.email);

    if (userChip) {
      userChip.classList.add("visible");
      if (userChipImg) userChipImg.src = user.photoURL || "";
      if (userChipName) userChipName.textContent = user.displayName || "Client";
    }
    if (getStartedBtn && !isDashboard) {
      getStartedBtn.textContent = "GO TO DASHBOARD";
    }

    if (isDashboard && typeof renderDashboardUser === "function") {
      renderDashboardUser(user);
    }
  } else {
    console.log("[auth] State: signed out");

    if (userChip) userChip.classList.remove("visible");

    if (isDashboard) {
      console.log("[auth] No user on protected page — redirecting to home");
      window.location.href = "index.html";
    }
  }
});
