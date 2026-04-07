let modalRoot = null;
let overlay = null;
let content = null;
let isInitialized = false;
let handleEscape = null;
let onCloseCallback = null;

function initModal() {
  if (isInitialized) return;

  modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  modalRoot.className = "fixed inset-0 hidden z-50";

  overlay = document.createElement("div");
  overlay.className = "absolute inset-0 bg-black bg-opacity-50";

  content = document.createElement("div");
  content.className =
    "relative z-10 mx-auto mt-20 bg-white p-6 rounded shadow-lg w-96";

  modalRoot.appendChild(overlay);
  modalRoot.appendChild(content);
  document.body.appendChild(modalRoot);

  // Overlay click closes modal
  overlay.addEventListener("click", closeModal);

  isInitialized = true;
}

export function openModal(renderFn, options = {}) {
  initModal();
  onCloseCallback = options.onClose || null;

  // Clear previous content to avoid duplication
  content.innerHTML = "";

  // Show modal
  modalRoot.classList.remove("hidden");

  // Inject content and pass control
  renderFn(content, closeModal);

  // Escape key handler
  handleEscape = (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  document.addEventListener("keydown", handleEscape);
}

export function closeModal() {
  if (!isInitialized) return;
  if (onCloseCallback) {
    onCloseCallback();
    onCloseCallback = null; 
  }

  // Hide modal
  modalRoot.classList.add("hidden");

  // Clear content
  content.innerHTML = "";

  // Remove escape listener to prevent stacking
  if (handleEscape) {
    document.removeEventListener("keydown", handleEscape);
    handleEscape = null;
  }
}
