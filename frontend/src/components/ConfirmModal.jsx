import { useEffect } from 'react';

export default function ConfirmModal({
  title = 'Confirmation',
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmVariant = 'danger',
  onConfirm,
  onCancel
}) {
  useEffect(() => {
    // Empêcher le scroll du body quand le modal est ouvert
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fermer avec la touche Escape
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') {
        onCancel();
      }
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onCancel} aria-label="Fermer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="confirm-icon">
            {confirmVariant === 'danger' && (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="#ef4444" strokeWidth="3"/>
                <path d="M24 14V26M24 30V34" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            )}
            {confirmVariant === 'warning' && (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M4 40L24 8L44 40H4Z" stroke="#f59e0b" strokeWidth="3" strokeLinejoin="round"/>
                <path d="M24 20V28M24 32V36" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <p className="confirm-message">{message}</p>
        </div>

        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`btn-primary btn-${confirmVariant}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
