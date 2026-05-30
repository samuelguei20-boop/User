‎const navItems = document.querySelectorAll(".nav-item");
‎const pages = document.querySelectorAll(".page");
‎
‎const balanceText = document.getElementById("balanceText");
‎const cfaText = document.getElementById("cfaText");
‎const rewardBalance = document.getElementById("rewardBalance");
‎
‎let mainBalance = 0;
‎let rewardAmount = 0;
‎let visible = true;
‎
‎/* HISTORIQUE (préparé pour transactions) */
‎let transactions = [];
‎
‎/* NAVIGATION */
‎navItems.forEach(btn => {
‎btn.addEventListener("click", () => {
‎
‎pages.forEach(page => {
‎page.classList.remove("active-page");
‎});
‎
‎navItems.forEach(nav => {
‎nav.classList.remove("active-nav");
‎});
‎
‎const pageId = btn.getAttribute("data-page");
‎
‎document.getElementById(pageId).classList.add("active-page");
‎
‎btn.classList.add("active-nav");
‎
‎});
‎});
‎
‎/* UPDATE BALANCE */
‎function updateBalance() {
‎
‎if (visible) {
‎
‎balanceText.innerText = mainBalance;
‎cfaText.innerText = `≈ ${mainBalance} FCFA`;
‎
‎} else {
‎
‎balanceText.innerText = "••••";
‎cfaText.innerText = "≈ ••••";
‎
‎}
‎
‎}
‎
‎/* TOGGLE BALANCE */
‎const toggleBalance = document.getElementById("toggleBalance");
‎
‎toggleBalance.addEventListener("click", () => {
‎
‎visible = !visible;
‎
‎if (visible) {
‎toggleBalance.innerHTML = '<i class="fa-regular fa-eye"></i>';
‎} else {
‎toggleBalance.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
‎}
‎
‎updateBalance();
‎
‎});
‎
‎/* DARK MODE */
‎const themeToggle = document.getElementById("themeToggle");
‎
‎themeToggle.addEventListener("click", () => {
‎
‎document.body.classList.toggle("dark");
‎
‎if (document.body.classList.contains("dark")) {
‎themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
‎} else {
‎themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
‎}
‎
‎});
‎
‎/* XP INIT */
‎let xp = 0;
‎
‎document.getElementById("xpFill").style.width = xp + "%";
‎document.getElementById("levelPercent").innerText = xp + "%";
‎
‎/* MODAL SYSTEM */
‎const modal = document.getElementById("mainModal");
‎const modalContent = document.getElementById("modalContent");
‎
‎function openModal(content) {
‎modal.style.display = "flex";
‎modalContent.innerHTML = content;
‎}
‎
‎function closeModal() {
‎modal.style.display = "none";
‎}
‎
‎window.closeModal = closeModal;
‎
‎window.addEventListener("click", (e) => {
‎if (e.target === modal) {
‎closeModal();
‎}
‎});
‎
‎/* COPY REFERRAL */
‎const copyBtn = document.getElementById("copyReferral");
‎
‎copyBtn.addEventListener("click", () => {
‎
‎const input = document.querySelector(".referral-box input");
‎
‎navigator.clipboard.writeText(input.value);
‎
‎copyBtn.innerText = "Lien copié ✓";
‎
‎setTimeout(() => {
‎copyBtn.innerText = "Copier le lien";
‎}, 2000);
‎
‎});
‎
‎/* COPY REFERRAL SETTINGS */
‎document.getElementById("copyReferral2").addEventListener("click", () => {
‎
‎navigator.clipboard.writeText("https://bccfuture.com/ref/BCC20458");
‎
‎openModal(`
‎<h2>✅ Lien copié</h2>
‎<p style="margin-top:15px">
‎Votre lien de parrainage a été copié.
‎</p>
‎<button class="close-btn" onclick="closeModal()">Fermer</button>
‎`);
‎
‎});
‎
‎/* INIT */
‎updateBalance();
‎/* =========================
‎   ENVOYER BCC + HISTORIQUE
‎========================= */
‎
‎document.getElementById("sendBtn").addEventListener("click", () => {
‎
‎openModal(`
‎<h2>📤 Envoyer BCC</h2>
‎
‎<input id="sendName" placeholder="Nom complet du destinataire">
‎<input id="sendAmount" type="number" placeholder="Montant BCC">
‎
‎<p style="margin-top:15px">
‎Frais : 1%
‎</p>
‎
‎<button class="main-btn"
‎id="confirmSendBtn"
‎style="width:100%;margin-top:20px">
‎Confirmer
‎</button>
‎
‎<button class="close-btn" onclick="closeModal()">
‎Fermer
‎</button>
‎`);
‎
‎setTimeout(() => {
‎
‎document.getElementById("confirmSendBtn").addEventListener("click", () => {
‎
‎const name = document.getElementById("sendName").value;
‎const amount = parseFloat(document.getElementById("sendAmount").value);
‎
‎if (!name || !amount || amount <= 0) {
‎alert("Données invalides");
‎return;
‎}
‎
‎if (amount > mainBalance) {
‎alert("Solde insuffisant");
‎return;
‎}
‎
‎const fees = amount * 0.01;
‎mainBalance = mainBalance - amount - fees;
‎
‎if (mainBalance < 0) mainBalance = 0;
‎
‎updateBalance();
‎
‎/* HEURE */
‎const time = new Date().toLocaleTimeString();
‎
‎/* AJOUT HISTORIQUE */
‎transactions.unshift({
‎type: "send",
‎name: name,
‎amount: amount,
‎time: time
‎});
‎
‎renderHistory();
‎
‎/* MODAL CONFIRM */
‎openModal(`
‎<h2>✅ Transfert effectué</h2>
‎
‎<p style="margin-top:15px">
‎Envoyé à : ${name}
‎</p>
‎
‎<p style="margin-top:10px">
‎Montant : ${amount} BCC
‎</p>
‎
‎<p style="margin-top:10px">
‎Heure : ${time}
‎</p>
‎
‎<button class="close-btn" onclick="closeModal()">
‎Fermer
‎</button>
‎`);
‎
‎});
‎
‎}, 100);
‎
‎});
‎
‎/* =========================
‎   AFFICHAGE HISTORIQUE
‎========================= */
‎
‎function renderHistory() {
‎
‎const box = document.querySelector(".history-box");
‎
‎if (transactions.length === 0) {
‎box.innerHTML = `
‎<div class="history-icon">🕓</div>
‎<h3>Aucune transaction</h3>
‎<p>Les activités apparaîtront ici</p>
‎`;
‎return;
‎}
‎
‎box.innerHTML = "";
‎
‎transactions.forEach(tx => {
‎
‎box.innerHTML += `
‎<div style="
‎background:var(--card);
‎padding:12px;
‎margin-top:10px;
‎border-radius:15px;
‎text-align:left;
‎">
‎
‎<strong>${tx.type === "send" ? "📤 Envoyé à" : "📥 Reçu de"} ${tx.name}</strong>
‎
‎<p>Montant : ${tx.amount} BCC</p>
‎<p>Heure : ${tx.time}</p>
‎
‎</div>
‎`;
‎
‎});
‎
‎}
‎
‎/* =========================
‎   RÉCOMPENSES
‎========================= */
‎
‎document.getElementById("transferRewardBtn").addEventListener("click", () => {
‎
‎if (rewardAmount <= 0) {
‎alert("Aucune récompense");
‎return;
‎}
‎
‎mainBalance += rewardAmount;
‎rewardAmount = 0;
‎
‎rewardBalance.innerText = "0 BCC";
‎
‎updateBalance();
‎
‎openModal(`
‎<h2>✅ Récompenses transférées</h2>
‎<p style="margin-top:15px">
‎Ajouté au solde principal
‎</p>
‎<button class="close-btn" onclick="closeModal()">Fermer</button>
‎`);
‎
‎});
‎
‎/* =========================
‎   CARTE À GRATTER 24H
‎========================= */
‎
‎let scratchCooldown = 0;
‎
‎function updateScratchTimer() {
‎
‎const timerBox = document.getElementById("scratchTimer");
‎
‎if (!timerBox) return;
‎
‎if (scratchCooldown > 0) {
‎
‎scratchCooldown--;
‎
‎const hours = Math.floor(scratchCooldown / 3600);
‎const minutes = Math.floor((scratchCooldown % 3600) / 60);
‎const seconds = scratchCooldown % 60;
‎
‎timerBox.innerText =
‎`Disponible dans ${hours}h ${minutes}m ${seconds}s`;
‎
‎} else {
‎
‎timerBox.innerText = "Disponible maintenant";
‎
‎}
‎
‎}
‎
‎setInterval(updateScratchTimer, 1000);
‎
‎document.getElementById("scratchCard").addEventListener("click", () => {
‎
‎if (scratchCooldown > 0) {
‎alert("Carte déjà utilisée. Attends 24h.");
‎return;
‎}
‎
‎const gains = [10, 25, 50, 100];
‎const gain = gains[Math.floor(Math.random() * gains.length)];
‎
‎rewardAmount += gain;
‎
‎rewardBalance.innerText = rewardAmount + " BCC";
‎
‎document.getElementById("scratchCard").innerHTML =
‎`🎉 ${gain} BCC GAGNÉS`;
‎
‎/* 24H = 86400 secondes */
‎scratchCooldown = 86400;
‎
‎});
‎/* =========================
‎   SUPPORT (GMAIL)
‎========================= */
‎
‎document.getElementById("contactSupportBtn").addEventListener("click", () => {
‎
‎const email = "bccciservice@gmail.com";
‎const subject = encodeURIComponent("Support BCC - Demande utilisateur");
‎const body = encodeURIComponent("Bonjour, je souhaite contacter le support BCC.");
‎
‎window.location.href =
‎`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
‎
‎});
‎
‎/* =========================
‎   DÉCONNEXION
‎========================= */
‎
‎document.getElementById("logoutBtn").addEventListener("click", () => {
‎
‎openModal(`
‎<h2>🚪 Déconnexion</h2>
‎
‎<p style="margin-top:15px">
‎Voulez-vous vraiment vous déconnecter ?
‎</p>
‎
‎<button class="main-btn"
‎id="confirmLogout"
‎style="width:100%;margin-top:20px">
‎Oui
‎</button>
‎
‎<button class="close-btn"
‎onclick="closeModal()">
‎Non
‎</button>
‎`);
‎
‎setTimeout(() => {
‎
‎document.getElementById("confirmLogout").addEventListener("click", () => {
‎
‎/* RESET SIMPLE (préparation futur Supabase) */
‎mainBalance = 0;
‎rewardAmount = 0;
‎transactions = [];
‎
‎updateBalance();
‎renderHistory();
‎
‎/* REDIRECTION ou reload */
‎location.reload();
‎
‎});
‎
‎}, 100);
‎
‎});
‎
‎/* =========================
‎   BOUTON INFOS BCC (CENTRE)
‎========================= */
‎
‎document.querySelector(".center-btn").addEventListener("click", () => {
‎
‎openModal(`
‎<h2>ℹ️ INFOS BCC</h2>
‎
‎<p style="margin-top:15px">
‎Bienvenue sur BABY CASH COIN (BCC).
‎</p>
‎
‎<p style="margin-top:10px">
‎Système en développement - version utilisateur.
‎</p>
‎
‎<p style="margin-top:10px">
‎Les fonctionnalités admin seront bientôt activées.
‎</p>
‎
‎<button class="close-btn" onclick="closeModal()">
‎Fermer
‎</button>
‎`);
‎
‎});
‎
‎/* =========================
‎   INITIALISATION HISTORIQUE
‎========================= */
‎
‎renderHistory();
‎
‎/* =========================
‎   FIN SCRIPT USER DASHBOARD
‎========================= */
‎
