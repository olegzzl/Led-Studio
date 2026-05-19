document.addEventListener('DOMContentLoaded', () => {
    const wakeLockBtn = document.getElementById('wake-lock-btn');

    // Если кнопки нет на странице, скрипт просто остановится
    if (!wakeLockBtn) return;

    let wakeLock = null;

    // Функция для обновления текста с поддержкой переводов
    const updateText = (translateKey) => {
        wakeLockBtn.setAttribute('data-translate', translateKey);
        if (typeof changeLanguage === 'function' && typeof currentLang !== 'undefined') {
            changeLanguage(currentLang);
        }
    };

    // Функция для запроса блокировки экрана (отключения спящего режима)
    const requestWakeLock = async () => {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            updateText('wake-lock-active');
            wakeLockBtn.style.color = '#ffffff'; // Подсветка текста по Pro-Studio
            wakeLockBtn.style.borderColor = '#8e9192'; // Подсветка рамки активного состояния

            // Обработчик системного сброса блокировки
            wakeLock.addEventListener('release', () => {
                updateText('wake-lock-default');
                wakeLockBtn.style.color = '';
                wakeLockBtn.style.borderColor = '';
            });
        } catch (err) {
            console.error(`Ошибка Wake Lock: ${err.name}, ${err.message}`);
            updateText('wake-lock-error');
        }
    };

    // Функция включения спящего режима обратно
    const releaseWakeLock = async () => {
        if (wakeLock !== null) {
            await wakeLock.release();
            wakeLock = null;
        }
    };

    wakeLockBtn.addEventListener('click', async () => {
        if (!('wakeLock' in navigator)) {
            let msg = 'Ваш браузер не поддерживает управление спящим режимом.';
            if (typeof translations !== 'undefined' && typeof currentLang !== 'undefined' && translations[currentLang]['wake-lock-unsupported']) {
                msg = translations[currentLang]['wake-lock-unsupported'];
            }
            alert(msg);
            return;
        }
        if (wakeLock === null) {
            await requestWakeLock();
        } else {
            await releaseWakeLock();
        }
    });

    // Восстановление блокировки после возвращения на вкладку
    document.addEventListener('visibilitychange', async () => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
            await requestWakeLock();
        }
    });
});