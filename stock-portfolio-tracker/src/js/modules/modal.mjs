let modalRoot = null;
let modalOverlay = null;
let modalPanel = null;
let isInitialized = false;
let handleEscape = null;
let onCloseCallback = null;

// -----------------------------
// INIT
// -----------------------------
function initModal() {
  if (isInitialized) return;

  modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  modalRoot.className = "modal hidden";

  modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  modalPanel = document.createElement("div");
  modalPanel.className = "modal-panel";

  modalRoot.appendChild(modalOverlay);
  modalRoot.appendChild(modalPanel);
  document.body.appendChild(modalRoot);

  isInitialized = true;
}

// -----------------------------
// OPEN
// -----------------------------
export function openModal(renderFn, options = {}) {
  initModal();
  onCloseCallback = options.onClose || null;

  // clear content
  modalPanel.innerHTML = "";

  // render content
  renderFn(modalPanel, closeModal);

  // show modal
  modalRoot.classList.remove("hidden");

  requestAnimationFrame(() => {
    modalRoot.classList.add("modal-open");
    modalRoot.classList.remove("modal-closing");

    // attach overlay click AFTER open (prevents instant close)
    modalOverlay.addEventListener("click", handleOverlayClick);
  });

  // Escape key
  handleEscape = (e) => {
    if (e.key === "Escape") closeModal();
  };

  document.addEventListener("keydown", handleEscape);
}

// -----------------------------
// CLOSE
// -----------------------------
export function closeModal() {
  if (!isInitialized) return;

  if (onCloseCallback) {
    onCloseCallback();
    onCloseCallback = null;
  }

  modalRoot.classList.remove("modal-open");
  modalRoot.classList.add("modal-closing");

  document.removeEventListener("keydown", handleEscape);
  modalOverlay.removeEventListener("click", handleOverlayClick);

  const handleTransitionEnd = (e) => {
    if (e.target !== modalRoot) return;

    modalRoot.classList.add("hidden");
    modalRoot.classList.remove("modal-closing");
    modalPanel.innerHTML = "";

    modalRoot.removeEventListener("transitionend", handleTransitionEnd);
  };

  modalRoot.addEventListener("transitionend", handleTransitionEnd);
}

// -----------------------------
// OVERLAY CLICK HANDLER
// -----------------------------
function handleOverlayClick(e) {
  if (e.target === modalOverlay) {
    closeModal();
  }
}