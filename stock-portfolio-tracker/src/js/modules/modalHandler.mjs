import { openModal } from "./modal.mjs";

export function openFormModal(templateFn, onSubmit, options = {}) {
  const { onInit } = options;

  openModal((modalEl, closeModal) => {
    // Inject template
    modalEl.innerHTML = templateFn();

    // Handle close buttons
    const closeButtons = modalEl.querySelectorAll(
      ".modal-close, .modal-cancel",
    );
    closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));

    // Handle form submission
    const form = modalEl.querySelector("form");
    if (form) {
      if (typeof onInit === "function") {
        onInit(form.elements);
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        onSubmit(form.elements, closeModal);
      });
    }
  }, options);
}
