import React from "react";
import './SettingsModal.css'

interface SettingsModalProps {
    onClose: () => void;
    hintsEnabled: boolean;         // Передаём текущее состояние
    toggleHints: () => void;       // Передаём функцию переключения
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, hintsEnabled, toggleHints }) => {
    return (
        <div className="modal__overlay">
            <div className="modal__content">
                <div className="modal__header">
                    <h2>Настройки</h2>
                    <button className="modal__close" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal__body">
                    <div className="setting__row">
                        <span>Включить подсказки</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={hintsEnabled}
                                onChange={toggleHints}    // Вызов функции из пропсов
                            />
                            <span className="slider" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;