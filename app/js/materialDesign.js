/**
 * Material Design Module
 * Initializes and manages Material Design components
 */

/**
 * Initialize Material Design components
 * This function should be called after the DOM is loaded
 */
export function initMaterialComponents() {
  if (typeof window !== 'undefined') {
    // Initialize all textfields
    document.querySelectorAll('.mdc-text-field').forEach(element => {
      element.classList.add('mdc-text-field--initialized');
    });
    
    // Initialize all selects
    document.querySelectorAll('.mdc-select').forEach(element => {
      element.classList.add('mdc-select--initialized');
    });
    
    // Initialize all buttons
    document.querySelectorAll('.mdc-button').forEach(element => {
      element.classList.add('mdc-button--initialized');
    });
    
    // Initialize all sliders
    document.querySelectorAll('.mdc-slider').forEach(element => {
      element.classList.add('mdc-slider--initialized');
    });
    
    // Initialize all switches
    document.querySelectorAll('.mdc-switch').forEach(element => {
      element.classList.add('mdc-switch--initialized');
    });
  }
}

/**
 * Create a Material Design snackbar notification
 * @param {string} message - The message to display
 * @param {number} duration - Duration in milliseconds
 */
export function showSnackbar(message, duration = 4000) {
  if (typeof window !== 'undefined') {
    // Create snackbar container if it doesn't exist
    let snackbarContainer = document.getElementById('mdc-snackbar-container');
    
    if (!snackbarContainer) {
      snackbarContainer = document.createElement('div');
      snackbarContainer.id = 'mdc-snackbar-container';
      snackbarContainer.className = 'mdc-snackbar';
      snackbarContainer.setAttribute('aria-live', 'assertive');
      snackbarContainer.setAttribute('aria-atomic', 'true');
      snackbarContainer.setAttribute('aria-hidden', 'true');
      
      const snackbarSurface = document.createElement('div');
      snackbarSurface.className = 'mdc-snackbar__surface';
      
      const snackbarLabel = document.createElement('div');
      snackbarLabel.className = 'mdc-snackbar__label';
      snackbarLabel.setAttribute('role', 'status');
      snackbarLabel.setAttribute('aria-live', 'polite');
      
      snackbarSurface.appendChild(snackbarLabel);
      snackbarContainer.appendChild(snackbarSurface);
      document.body.appendChild(snackbarContainer);
    }
    
    // Update snackbar message
    const snackbarLabel = snackbarContainer.querySelector('.mdc-snackbar__label');
    snackbarLabel.textContent = message;
    
    // Show snackbar
    snackbarContainer.setAttribute('aria-hidden', 'false');
    snackbarContainer.classList.add('mdc-snackbar--open');
    
    // Hide snackbar after duration
    setTimeout(() => {
      snackbarContainer.setAttribute('aria-hidden', 'true');
      snackbarContainer.classList.remove('mdc-snackbar--open');
    }, duration);
  }
}

/**
 * Create a Material Design dialog
 * @param {Object} options - Dialog options
 * @returns {Object} - Dialog control object
 */
export function createDialog(options) {
  const {
    title = '',
    content = '',
    confirmText = 'OK',
    cancelText = 'Cancel',
    onConfirm = () => {},
    onCancel = () => {},
    hideCancel = false
  } = options;
  
  // Create dialog elements
  const dialogContainer = document.createElement('div');
  dialogContainer.className = 'mdc-dialog';
  dialogContainer.setAttribute('role', 'dialog');
  dialogContainer.setAttribute('aria-modal', 'true');
  
  const dialogScrim = document.createElement('div');
  dialogScrim.className = 'mdc-dialog__scrim';
  
  const dialogSurface = document.createElement('div');
  dialogSurface.className = 'mdc-dialog__surface';
  
  // Dialog title
  const dialogTitle = document.createElement('h2');
  dialogTitle.className = 'mdc-dialog__title';
  dialogTitle.textContent = title;
  
  // Dialog content
  const dialogContent = document.createElement('div');
  dialogContent.className = 'mdc-dialog__content';
  
  if (typeof content === 'string') {
    dialogContent.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    dialogContent.appendChild(content);
  }
  
  // Dialog actions
  const dialogActions = document.createElement('div');
  dialogActions.className = 'mdc-dialog__actions';
  
  // Cancel button
  if (!hideCancel) {
    const cancelButton = document.createElement('button');
    cancelButton.className = 'mdc-button mdc-dialog__button';
    cancelButton.setAttribute('type', 'button');
    cancelButton.setAttribute('data-mdc-dialog-action', 'cancel');
    cancelButton.textContent = cancelText;
    
    cancelButton.addEventListener('click', () => {
      onCancel();
      closeDialog();
    });
    
    dialogActions.appendChild(cancelButton);
  }
  
  // Confirm button
  const confirmButton = document.createElement('button');
  confirmButton.className = 'mdc-button mdc-dialog__button';
  confirmButton.setAttribute('type', 'button');
  confirmButton.setAttribute('data-mdc-dialog-action', 'confirm');
  confirmButton.textContent = confirmText;
  
  confirmButton.addEventListener('click', () => {
    onConfirm();
    closeDialog();
  });
  
  dialogActions.appendChild(confirmButton);
  
  // Assemble dialog
  dialogSurface.appendChild(dialogTitle);
  dialogSurface.appendChild(dialogContent);
  dialogSurface.appendChild(dialogActions);
  
  dialogContainer.appendChild(dialogScrim);
  dialogContainer.appendChild(dialogSurface);
  
  // Add dialog to document
  document.body.appendChild(dialogContainer);
  
  // Open dialog
  dialogContainer.classList.add('mdc-dialog--open');
  
  // Close dialog function
  function closeDialog() {
    dialogContainer.classList.remove('mdc-dialog--open');
    
    // Remove dialog from DOM after animation
    setTimeout(() => {
      document.body.removeChild(dialogContainer);
    }, 150);
  }
  
  // Return dialog control object
  return {
    close: closeDialog,
    element: dialogContainer
  };
}