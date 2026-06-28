/**
 * STREAX – Complete Application Logic
 * Vanilla JavaScript, ES6+, Local Storage persistence
 */

// ============================================================
//  STATE
// ============================================================

let streaks = [];
let currentView = 'dashboard'; // 'dashboard' | 'detail'
let currentStreakId = null;
let deleteTargetId = null;
let resetTargetId = null;
let currentTheme = 'light';

// DOM refs (cached)
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
    app: $('#app'),
    grid: $('#streakGrid'),
    emptyState: $('#emptyState'),
    streakCount: $('#streakCount'),
    searchInput: $('#searchInput'),
    sortSelect: $('#sortSelect'),
    createBtn: $('#createStreakBtn'),
    emptyCreateBtn: $('#emptyCreateBtn'),
    themeToggle: $('#themeToggle'),

    // Detail
    detailView: $('#detailView'),
    detailCard: $('#detailCard'),
    backBtn: $('#backToDashboard'),

    // Modal
    modal: $('#streakModal'),
    modalTitle: $('#modalTitle'),
    modalClose: $('#modalCloseBtn'),
    modalCancel: $('#modalCancelBtn'),
    modalSubmit: $('#modalSubmitBtn'),
    editId: $('#editId'),
    streakName: $('#streakName'),
    selectedEmoji: $('#selectedEmoji'),
    selectedColor: $('#selectedColor'),
    streakDescription: $('#streakDescription'),
    emojiGrid: $('#emojiGrid'),
    colorGrid: $('#colorGrid'),
    streakForm: $('#streakForm'),

    // Delete modal
    deleteModal: $('#deleteModal'),
    deleteClose: $('#deleteModalCloseBtn'),
    deleteCancel: $('#deleteCancelBtn'),
    deleteConfirm: $('#deleteConfirmBtn'),

    // Reset modal
    resetModal: $('#resetModal'),
    resetClose: $('#resetModalCloseBtn'),
    resetCancel: $('#resetCancelBtn'),
    resetConfirm: $('#resetConfirmBtn'),

    // Milestone
    milestoneOverlay: $('#milestoneOverlay'),
    milestoneTitle: $('#milestoneTitle'),
    milestoneMessage: $('#milestoneMessage'),
    milestoneClose: $('#milestoneCloseBtn'),

    // Confetti
    confettiCanvas: $('#confettiCanvas'),
};

// ============================================================
//  LOCAL STORAGE
// ============================================================

const STORAGE_KEY = 'streax_data';
const THEME_KEY = 'streax_theme';

function loadStreaks() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            streaks = JSON.parse(data);
        } else {
            streaks = [];
        }
    } catch (e) {
        streaks = [];
    }
    // Ensure each streak has all required fields
    streaks = streaks.map(s => ({
        id: s.id || crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        name: s.name || 'Untitled',
        emoji: s.emoji || '📌',
        color: s.color || 'blue',
        description: s.description || '',
        current: typeof s.current === 'number' ? s.current : 0,
        longest: typeof s.longest === 'number' ? s.longest : 0,
        created: s.created || new Date().toISOString(),
        lastUpdated: s.lastUpdated || new Date().toISOString(),
        totalAdded: typeof s.totalAdded === 'number' ? s.totalAdded : 0,
        totalResets: typeof s.totalResets === 'number' ? s.totalResets : 0,
        consecutiveMinus: typeof s.consecutiveMinus === 'number' ? s.consecutiveMinus : 0,
        history: Array.isArray(s.history) ? s.history : [],
    }));
    saveStreaks();
}

function saveStreaks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(streaks));
}

function loadTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark') {
        currentTheme = 'dark';
        DOM.app.dataset.theme = 'dark';
    } else {
        currentTheme = 'light';
        DOM.app.dataset.theme = 'light';
    }
}

function saveTheme() {
    localStorage.setItem(THEME_KEY, currentTheme);
}

// ============================================================
//  HELPERS
// ============================================================

function generateId() {
    return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getColorHex(colorName) {
    const map = {
        blue: '#3b82f6',
        purple: '#8b5cf6',
        green: '#22c55e',
        orange: '#f97316',
        red: '#ef4444',
        pink: '#ec4899',
        yellow: '#eab308',
        teal: '#14b8a6',
        indigo: '#6366f1',
        dark: '#1e293b',
    };
    return map[colorName] || '#3b82f6';
}

function getColorLight(colorName) {
    const map = {
        blue: 'rgba(59,130,246,0.12)',
        purple: 'rgba(139,92,246,0.12)',
        green: 'rgba(34,197,94,0.12)',
        orange: 'rgba(249,115,22,0.12)',
        red: 'rgba(239,68,68,0.12)',
        pink: 'rgba(236,72,153,0.12)',
        yellow: 'rgba(234,179,8,0.12)',
        teal: 'rgba(20,184,166,0.12)',
        indigo: 'rgba(99,102,241,0.12)',
        dark: 'rgba(30,41,59,0.12)',
    };
    return map[colorName] || 'rgba(59,130,246,0.12)';
}

// ============================================================
//  CONFETTI
// ============================================================

let confettiPieces = [];
let confettiAnimId = null;

function fireConfetti() {
    const canvas = DOM.confettiCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];
    confettiPieces = [];

    for (let i = 0; i < 120; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: 6 + Math.random() * 8,
            h: 4 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 4,
            vy: 2 + Math.random() * 5,
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 8,
            opacity: 1,
        });
    }

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
    drawConfetti(ctx);
}

function drawConfetti(ctx) {
    const canvas = DOM.confettiCanvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let alive = false;
    for (const p of confettiPieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.rot += p.rotSpeed;
        p.opacity -= 0.003;

        if (p.opacity <= 0) continue;
        alive = true;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
    }

    if (alive) {
        confettiAnimId = requestAnimationFrame(() => drawConfetti(ctx));
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiAnimId = null;
    }
}

// ============================================================
//  MILESTONE
// ============================================================

const MILESTONES = [7, 30, 50, 100, 365];

function checkMilestone(streak, oldValue, newValue) {
    for (const m of MILESTONES) {
        if (oldValue < m && newValue >= m) {
            showMilestone(m, streak);
            return;
        }
    }
}

function showMilestone(days, streak) {
    DOM.milestoneTitle.textContent = '🎉 Congratulations!';
    DOM.milestoneMessage.textContent = `You reached a ${days}-day streak on "${streak.name}"!`;
    DOM.milestoneOverlay.style.display = 'flex';
    fireConfetti();

    // Auto-dismiss after 5s
    setTimeout(() => {
        DOM.milestoneOverlay.style.display = 'none';
    }, 6000);
}

// ============================================================
//  RENDER: DASHBOARD
// ============================================================

function renderDashboard() {
    currentView = 'dashboard';
    DOM.detailView.style.display = 'none';
    DOM.grid.style.display = 'grid';

    const searchTerm = DOM.searchInput.value.toLowerCase().trim();
    const sortKey = DOM.sortSelect.value;

    let filtered = streaks.filter(s => s.name.toLowerCase().includes(searchTerm));

    // Sort
    switch (sortKey) {
        case 'recent':
            filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
            break;
        case 'highest':
            filtered.sort((a, b) => b.current - a.current);
            break;
        case 'alphabetical':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
            filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
            break;
        case 'oldest':
            filtered.sort((a, b) => new Date(a.created) - new Date(b.created));
            break;
        default:
            filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    }

    DOM.streakCount.textContent = `${filtered.length} streak${filtered.length !== 1 ? 's' : ''}`;

    if (filtered.length === 0 && streaks.length === 0) {
        DOM.grid.innerHTML = '';
        DOM.grid.style.display = 'none';
        DOM.emptyState.style.display = 'flex';
        return;
    } else if (filtered.length === 0 && streaks.length > 0) {
        DOM.grid.innerHTML =
            `<div class="empty-state" style="grid-column:1/-1;padding:40px 20px;"><p style="color:var(--text-tertiary);">No streaks match your search.</p></div>`;
        DOM.grid.style.display = 'grid';
        DOM.emptyState.style.display = 'none';
        return;
    }

    DOM.emptyState.style.display = 'none';
    DOM.grid.style.display = 'grid';

    DOM.grid.innerHTML = filtered.map(s => `
        <div class="streak-card" data-theme-color="${s.color}" data-id="${s.id}">
            <div class="card-emoji">${s.emoji}</div>
            <div class="card-name">${escapeHtml(s.name)}</div>
            <div class="card-count">${s.current} <span>day${s.current !== 1 ? 's' : ''}</span></div>
            <div class="card-description">${escapeHtml(s.description || 'No description')}</div>
            <div class="card-footer">
                <span>Updated ${formatDate(s.lastUpdated)}</span>
                <div class="card-actions">
                    <button class="edit-btn" data-id="${s.id}" title="Edit">✏️</button>
                    <button class="delete-btn" data-id="${s.id}" title="Delete">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');

    // Event listeners on cards
    DOM.grid.querySelectorAll('.streak-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.card-actions')) return;
            const id = card.dataset.id;
            openDetail(id);
        });
    });

    DOM.grid.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            openEditModal(id);
        });
    });

    DOM.grid.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            openDeleteModal(id);
        });
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================
//  RENDER: DETAIL VIEW
// ============================================================

function openDetail(id) {
    const streak = streaks.find(s => s.id === id);
    if (!streak) return;

    currentView = 'detail';
    currentStreakId = id;

    DOM.detailView.style.display = 'block';
    DOM.grid.style.display = 'none';
    DOM.emptyState.style.display = 'none';

    const card = DOM.detailCard;
    card.dataset.themeColor = streak.color;

    // Build history
    let historyHtml = '';
    if (streak.history.length === 0) {
        historyHtml = '<p style="color:var(--text-tertiary);font-size:0.875rem;padding:12px 16px;">No activity yet.</p>';
    } else {
        const items = [...streak.history].reverse().slice(0, 50);
        historyHtml = '<ul class="timeline">' + items.map(h => `
            <li>
                <span class="tl-left">
                    <span class="tl-emoji">${h.action === 'add' ? '✅' : h.action === 'minus' ? '➖' : '🔄'}</span>
                    <span class="tl-action">${h.action === 'add' ? 'Day Added' : h.action === 'minus' ? 'Minus Day' : 'Reset'}</span>
                </span>
                <span class="tl-time">${formatTime(h.timestamp)}</span>
            </li>
        `).join('') + '</ul>';
    }

    card.innerHTML = `
        <div class="detail-header">
            <div class="detail-emoji">${streak.emoji}</div>
            <div class="detail-title-group">
                <h2>${escapeHtml(streak.name)}</h2>
                <div class="detail-description">${escapeHtml(streak.description || 'No description')}</div>
            </div>
            <div class="detail-count-badge">${streak.current} <span>days</span></div>
        </div>

        <div class="detail-actions">
            <button class="btn btn-success" id="detailAddBtn">+ Add Day</button>
            <button class="btn btn-warning" id="detailMinusBtn">− Minus Day</button>
            <button class="btn btn-danger" id="detailResetBtn">↺ Reset</button>
        </div>

        <div class="detail-stats">
            <div class="stat-item"><div class="stat-label">Longest</div><div class="stat-value">${streak.longest}</div></div>
            <div class="stat-item"><div class="stat-label">Created</div><div class="stat-value">${formatDate(streak.created)}</div></div>
            <div class="stat-item"><div class="stat-label">Total Added</div><div class="stat-value">${streak.totalAdded}</div></div>
            <div class="stat-item"><div class="stat-label">Total Resets</div><div class="stat-value">${streak.totalResets}</div></div>
            <div class="stat-item"><div class="stat-label">Consecutive Minus</div><div class="stat-value">${streak.consecutiveMinus}</div></div>
        </div>

        <div class="timeline-title">Activity Timeline</div>
        ${historyHtml}
    `;

    // Detail action buttons
    card.querySelector('#detailAddBtn').addEventListener('click', () => handleAddDay(id));
    card.querySelector('#detailMinusBtn').addEventListener('click', () => handleMinusDay(id));
    card.querySelector('#detailResetBtn').addEventListener('click', () => openResetModal(id));

    // Scroll to top of detail
    DOM.detailView.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
//  STREAK ACTIONS
// ============================================================

function handleAddDay(id) {
    const streak = streaks.find(s => s.id === id);
    if (!streak) return;

    const oldValue = streak.current;
    streak.current += 1;
    streak.lastUpdated = new Date().toISOString();
    streak.totalAdded += 1;
    streak.consecutiveMinus = 0;

    if (streak.current > streak.longest) {
        streak.longest = streak.current;
    }

    streak.history.push({
        action: 'add',
        timestamp: new Date().toISOString(),
    });

    saveStreaks();
    checkMilestone(streak, oldValue, streak.current);
    fireConfetti();

    if (currentView === 'detail' && currentStreakId === id) {
        openDetail(id);
    } else {
        renderDashboard();
    }
}

function handleMinusDay(id) {
    const streak = streaks.find(s => s.id === id);
    if (!streak) return;

    if (streak.current <= 0) {
        // Already 0, do nothing but maybe show a subtle feedback
        return;
    }

    streak.current -= 1;
    streak.lastUpdated = new Date().toISOString();
    streak.consecutiveMinus += 1;
    streak.history.push({
        action: 'minus',
        timestamp: new Date().toISOString(),
    });

    // Check for two consecutive minus days
    if (streak.consecutiveMinus >= 2) {
        streak.current = 0;
        streak.consecutiveMinus = 0;
        streak.totalResets += 1;
        streak.history.push({
            action: 'reset',
            timestamp: new Date().toISOString(),
        });
        saveStreaks();
        if (currentView === 'detail' && currentStreakId === id) {
            openDetail(id);
            // Show message
            showToast('Two consecutive missed days detected. Your streak has been reset.', 'warning');
        } else {
            renderDashboard();
            showToast('Two consecutive missed days detected. Your streak has been reset.', 'warning');
        }
        return;
    }

    saveStreaks();

    if (currentView === 'detail' && currentStreakId === id) {
        openDetail(id);
    } else {
        renderDashboard();
    }
}

function handleResetStreak(id) {
    const streak = streaks.find(s => s.id === id);
    if (!streak) return;

    streak.current = 0;
    streak.lastUpdated = new Date().toISOString();
    streak.totalResets += 1;
    streak.consecutiveMinus = 0;
    streak.history.push({
        action: 'reset',
        timestamp: new Date().toISOString(),
    });

    saveStreaks();

    DOM.resetModal.style.display = 'none';
    resetTargetId = null;

    if (currentView === 'detail' && currentStreakId === id) {
        openDetail(id);
    } else {
        renderDashboard();
    }
    showToast('Streak has been reset.', 'info');
}

// ============================================================
//  TOAST (simple inline feedback)
// ============================================================

let toastTimeout = null;

function showToast(message, type = 'info') {
    const existing = document.querySelector('.streax-toast');
    if (existing) existing.remove();
    if (toastTimeout) clearTimeout(toastTimeout);

    const toast = document.createElement('div');
    toast.className = 'streax-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-secondary);
        color: var(--text-primary);
        padding: 12px 24px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--border-color);
        font-family: var(--font);
        font-size: 0.9rem;
        z-index: 5000;
        max-width: 90%;
        text-align: center;
        animation: fadeSlideUp 0.3s ease;
        border-left: 4px solid ${type === 'warning' ? '#f97316' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(16px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ============================================================
//  MODALS: CREATE / EDIT
// ============================================================

function openCreateModal() {
    DOM.modalTitle.textContent = 'Create Streak';
    DOM.modalSubmit.textContent = 'Create';
    DOM.editId.value = '';
    DOM.streakName.value = '';
    DOM.streakDescription.value = '';
    DOM.selectedEmoji.value = '🏋️';
    DOM.selectedColor.value = 'blue';

    // Reset emoji/color selections
    DOM.emojiGrid.querySelectorAll('.emoji-option').forEach(el => el.classList.remove('active'));
    const defaultEmoji = DOM.emojiGrid.querySelector('[data-emoji="🏋️"]');
    if (defaultEmoji) defaultEmoji.classList.add('active');

    DOM.colorGrid.querySelectorAll('.color-option').forEach(el => el.classList.remove('active'));
    const defaultColor = DOM.colorGrid.querySelector('[data-color="blue"]');
    if (defaultColor) defaultColor.classList.add('active');

    DOM.modal.style.display = 'flex';
    setTimeout(() => DOM.streakName.focus(), 100);
}

function openEditModal(id) {
    const streak = streaks.find(s => s.id === id);
    if (!streak) return;

    DOM.modalTitle.textContent = 'Edit Streak';
    DOM.modalSubmit.textContent = 'Save';
    DOM.editId.value = id;
    DOM.streakName.value = streak.name;
    DOM.streakDescription.value = streak.description || '';
    DOM.selectedEmoji.value = streak.emoji;
    DOM.selectedColor.value = streak.color;

    DOM.emojiGrid.querySelectorAll('.emoji-option').forEach(el => {
        el.classList.toggle('active', el.dataset.emoji === streak.emoji);
    });

    DOM.colorGrid.querySelectorAll('.color-option').forEach(el => {
        el.classList.toggle('active', el.dataset.color === streak.color);
    });

    DOM.modal.style.display = 'flex';
    setTimeout(() => DOM.streakName.focus(), 100);
}

function closeModal() {
    DOM.modal.style.display = 'none';
}

function handleModalSubmit(e) {
    e.preventDefault();

    const name = DOM.streakName.value.trim();
    if (!name) {
        showToast('Please enter a streak name.', 'error');
        DOM.streakName.focus();
        return;
    }

    const emoji = DOM.selectedEmoji.value || '📌';
    const color = DOM.selectedColor.value || 'blue';
    const description = DOM.streakDescription.value.trim();
    const editId = DOM.editId.value;

    if (editId) {
        // Edit existing
        const streak = streaks.find(s => s.id === editId);
        if (streak) {
            streak.name = name;
            streak.emoji = emoji;
            streak.color = color;
            streak.description = description;
            streak.lastUpdated = new Date().toISOString();
            saveStreaks();
            closeModal();
            if (currentView === 'detail' && currentStreakId === editId) {
                openDetail(editId);
            } else {
                renderDashboard();
            }
            showToast('Streak updated!', 'info');
        }
    } else {
        // Create new
        const newStreak = {
            id: generateId(),
            name: name,
            emoji: emoji,
            color: color,
            description: description,
            current: 0,
            longest: 0,
            created: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            totalAdded: 0,
            totalResets: 0,
            consecutiveMinus: 0,
            history: [],
        };
        streaks.push(newStreak);
        saveStreaks();
        closeModal();
        renderDashboard();
        showToast(`"${name}" streak created!`, 'info');
        // Small confetti for new streak
        fireConfetti();
    }
}

// ============================================================
//  MODALS: DELETE
// ============================================================

function openDeleteModal(id) {
    deleteTargetId = id;
    DOM.deleteModal.style.display = 'flex';
}

function closeDeleteModal() {
    DOM.deleteModal.style.display = 'none';
    deleteTargetId = null;
}

function confirmDelete() {
    if (!deleteTargetId) return;
    streaks = streaks.filter(s => s.id !== deleteTargetId);
    saveStreaks();
    closeDeleteModal();

    if (currentView === 'detail' && currentStreakId === deleteTargetId) {
        currentStreakId = null;
        renderDashboard();
    } else {
        renderDashboard();
    }
    showToast('Streak deleted.', 'info');
}

// ============================================================
//  MODALS: RESET
// ============================================================

function openResetModal(id) {
    resetTargetId = id;
    DOM.resetModal.style.display = 'flex';
}

function closeResetModal() {
    DOM.resetModal.style.display = 'none';
    resetTargetId = null;
}

function confirmReset() {
    if (!resetTargetId) return;
    handleResetStreak(resetTargetId);
    closeResetModal();
}

// ============================================================
//  THEME TOGGLE
// ============================================================

function toggleTheme() {
    if (currentTheme === 'light') {
        currentTheme = 'dark';
        DOM.app.dataset.theme = 'dark';
    } else {
        currentTheme = 'light';
        DOM.app.dataset.theme = 'light';
    }
    saveTheme();
}

// ============================================================
//  SEARCH & SORT
// ============================================================

// ============================================================
//  EVENT BINDING
// ============================================================

function initEvents() {
    // Create buttons
    DOM.createBtn.addEventListener('click', openCreateModal);
    DOM.emptyCreateBtn.addEventListener('click', openCreateModal);

    // Theme toggle
    DOM.themeToggle.addEventListener('click', toggleTheme);

    // Search with debounce
    let searchTimeout;
    DOM.searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (currentView === 'dashboard') renderDashboard();
        }, 200);
    });

    // Sort
    DOM.sortSelect.addEventListener('change', () => {
        if (currentView === 'dashboard') renderDashboard();
    });

    // Modal close
    DOM.modalClose.addEventListener('click', closeModal);
    DOM.modalCancel.addEventListener('click', closeModal);
    DOM.modal.addEventListener('click', (e) => {
        if (e.target === DOM.modal) closeModal();
    });

    // Modal form
    DOM.streakForm.addEventListener('submit', handleModalSubmit);

    // Emoji selection
    DOM.emojiGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.emoji-option');
        if (!btn) return;
        DOM.emojiGrid.querySelectorAll('.emoji-option').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        DOM.selectedEmoji.value = btn.dataset.emoji;
    });

    // Color selection
    DOM.colorGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.color-option');
        if (!btn) return;
        DOM.colorGrid.querySelectorAll('.color-option').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        DOM.selectedColor.value = btn.dataset.color;
    });

    // Delete modal
    DOM.deleteClose.addEventListener('click', closeDeleteModal);
    DOM.deleteCancel.addEventListener('click', closeDeleteModal);
    DOM.deleteModal.addEventListener('click', (e) => {
        if (e.target === DOM.deleteModal) closeDeleteModal();
    });
    DOM.deleteConfirm.addEventListener('click', confirmDelete);

    // Reset modal
    DOM.resetClose.addEventListener('click', closeResetModal);
    DOM.resetCancel.addEventListener('click', closeResetModal);
    DOM.resetModal.addEventListener('click', (e) => {
        if (e.target === DOM.resetModal) closeResetModal();
    });
    DOM.resetConfirm.addEventListener('click', confirmReset);

    // Milestone close
    DOM.milestoneClose.addEventListener('click', () => {
        DOM.milestoneOverlay.style.display = 'none';
    });
    DOM.milestoneOverlay.addEventListener('click', (e) => {
        if (e.target === DOM.milestoneOverlay) DOM.milestoneOverlay.style.display = 'none';
    });

    // Back to dashboard
    DOM.backBtn.addEventListener('click', () => {
        renderDashboard();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (DOM.modal.style.display === 'flex') closeModal();
            if (DOM.deleteModal.style.display === 'flex') closeDeleteModal();
            if (DOM.resetModal.style.display === 'flex') closeResetModal();
            if (DOM.milestoneOverlay.style.display === 'flex') DOM.milestoneOverlay.style.display = 'none';
        }
        if (e.key === 'n' && e.ctrlKey) {
            e.preventDefault();
            openCreateModal();
        }
    });

    // Window resize for confetti
    window.addEventListener('resize', () => {
        DOM.confettiCanvas.width = window.innerWidth;
        DOM.confettiCanvas.height = window.innerHeight;
    });
}

// ============================================================
//  INIT
// ============================================================

function init() {
    loadTheme();
    loadStreaks();
    initEvents();
    renderDashboard();

    // Set default emoji/color in modal
    const defaultEmoji = DOM.emojiGrid.querySelector('[data-emoji="🏋️"]');
    if (defaultEmoji) defaultEmoji.classList.add('active');
    const defaultColor = DOM.colorGrid.querySelector('[data-color="blue"]');
    if (defaultColor) defaultColor.classList.add('active');

    console.log('⚡ Streax initialized!');
    console.log(`📊 ${streaks.length} streaks loaded.`);
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}