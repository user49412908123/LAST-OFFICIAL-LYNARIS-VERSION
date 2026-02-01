// ...existing code...
document.addEventListener("DOMContentLoaded", () => {
  console.log("[acces-anticipe] script loaded");
  const form = document.getElementById("early-access-form");
  let confirmationMessage = document.querySelector(
    ".custom-confirmation-message, .confirmation-message",
  );

  if (!form) {
    console.error("[acces-anticipe] form #early-access-form not found");
    return;
  }

  // create confirmation element if missing
  if (!confirmationMessage) {
    confirmationMessage = document.createElement("p");
    confirmationMessage.className = "confirmation-message";
    confirmationMessage.style.display = "none";
    form.insertAdjacentElement("afterend", confirmationMessage);
    console.log("[acces-anticipe] created .confirmation-message element");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("[acces-anticipe] submit intercepted");

    confirmationMessage.textContent =
      "⏳ Envoi en cours, veuillez patienter...";
    confirmationMessage.style.display = "block";
    confirmationMessage.style.color = "#004085";
    confirmationMessage.style.backgroundColor = "#cce5ff";
    confirmationMessage.style.border = "1px solid #b8daff";
    confirmationMessage.style.padding = "15px";
    confirmationMessage.style.borderRadius = "5px";
    confirmationMessage.style.marginTop = "20px";

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log("[acces-anticipe] payload:", data);

    try {
      const response = await fetch(
        "https://n8n.swayup-artisan.com/webhook/cab9c92d-9be0-4255-8e6f-68cd39938805",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (response.ok) {
        confirmationMessage.textContent =
          "✅ Votre formulaire a bien été envoyé ! Regardez vos messages dans les prochaines heures 😉";
        confirmationMessage.style.color = "#155724";
        confirmationMessage.style.backgroundColor = "#d4edda";
        confirmationMessage.style.border = "1px solid #c3e6cb";
        form.reset();
        console.log("[acces-anticipe] webhook OK");
      } else {
        const text = await response.text();
        throw new Error(
          `HTTP ${response.status} ${response.statusText} - ${text}`,
        );
      }
    } catch (err) {
      console.error("[acces-anticipe] send error:", err);
      confirmationMessage.textContent =
        "❌ Une erreur est survenue. Veuillez réessayer plus tard.";
      confirmationMessage.style.color = "#721c24";
      confirmationMessage.style.backgroundColor = "#f8d7da";
      confirmationMessage.style.border = "1px solid #f5c6cb";
    }
  });
});
