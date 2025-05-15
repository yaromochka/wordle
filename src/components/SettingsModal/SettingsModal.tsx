import React, { useState, useEffect } from 'react';
import './SettingsModal.css';
import Cookies from 'js-cookie';

interface SettingsModalProps {
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const [hintsEnabled, setHintsEnabled] = useState(false);

    // Загружаем значение из cookies при монтировании
    useEffect(() => {
        const savedHints = Cookies.get('hintsEnabled');
        if (savedHints) {
            setHintsEnabled(savedHints === 'true');
        }
    }, []);

    const toggleHints = () => {
        const newValue = !hintsEnabled;
        setHintsEnabled(newValue);
        Cookies.set('hintsEnabled', String(newValue), { expires: 365 });
    };

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
                                onChange={toggleHints}
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
