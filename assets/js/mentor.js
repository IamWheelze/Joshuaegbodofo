// Mentor Dashboard JavaScript

const STORAGE_KEYS = {
    GOALS: 'wc_goals',
    PROGRESS: 'wc_progress',
    REPORTS: 'wc_reports',
    USER: 'wc_user'
};

// ===== Initialize Mentor Dashboard =====
document.addEventListener('DOMContentLoaded', function() {
    // Check mentor authentication
    checkMentorAuth();

    // Initialize navigation
    initNavigation();

    // Load mentor dashboard data
    loadMentorDashboard();

    // Initialize report form
    initReportForm();
});

// ===== Authentication =====
function checkMentorAuth() {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
    if (!user || user.role !== 'mentor') {
        window.location.href = 'login.html';
    }
}

// ===== Navigation =====
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item a');
    const sections = document.querySelectorAll('.dashboard-section');

    navItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            this.parentElement.classList.add('active');

            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });

            // Update page title
            updatePageTitle(sectionId);
        });
    });
}

function updatePageTitle(sectionId) {
    const titles = {
        overview: 'Mentor Dashboard',
        members: 'Program Members',
        goals: 'Member Goals',
        progress: 'Progress Updates',
        reports: 'Write Reports'
    };
    document.getElementById('sectionTitle').textContent = titles[sectionId] || 'Dashboard';
}

// ===== Data Loading =====
function loadMentorDashboard() {
    updateMentorStats();
    loadAllGoals();
    loadAllProgress();
    loadSentReports();
}

function updateMentorStats() {
    const goals = getGoals();
    const progress = getProgress();
    const reports = getReports();

    document.getElementById('totalMembersCount').textContent = '1'; // Demo: 1 member
    document.getElementById('totalGoalsCount').textContent = goals.filter(g => g.status === 'active').length;
    document.getElementById('totalProgressCount').textContent = progress.length;
    document.getElementById('totalReportsCount').textContent = reports.length;
}

function loadAllGoals() {
    const goals = getGoals();
    const goalsList = document.getElementById('allGoalsList');

    if (goals.length === 0) {
        goalsList.innerHTML = '<p class="empty-state">No member goals to display</p>';
        return;
    }

    goalsList.innerHTML = goals.map(goal => `
        <div class="goal-card">
            <div class="goal-card-header">
                <div class="goal-card-title">
                    <p style="color: var(--accent-gold); font-weight: 600; margin-bottom: 0.5rem;">Demo Member</p>
                    <h3>${goal.title}</h3>
                </div>
                <span class="goal-status ${goal.status}">${goal.status.toUpperCase()}</span>
            </div>

            <div class="goal-section">
                <h4>How they will do it</h4>
                <p>${goal.how}</p>
            </div>

            <div class="goal-section">
                <h4>Current Progress</h4>
                <p>${goal.current}</p>
            </div>

            ${goal.deadline ? `
                <div class="goal-deadline">
                    <span>📅</span>
                    <span>Deadline: ${formatDate(goal.deadline)}</span>
                </div>
            ` : ''}

            <div style="margin-top: 1.5rem;">
                <button class="btn btn-primary" onclick="createReportForGoal('${goal.id}')">Create Report</button>
            </div>
        </div>
    `).join('');
}

function loadAllProgress() {
    const progressList = getProgress();
    const progressFeed = document.getElementById('allProgressList');

    if (progressList.length === 0) {
        progressFeed.innerHTML = '<p class="empty-state">No progress updates yet</p>';
        return;
    }

    progressFeed.innerHTML = progressList.map(post => `
        <div class="progress-post">
            <div class="progress-post-header">
                <div class="post-author">
                    <div class="post-avatar">${post.author[0].toUpperCase()}</div>
                    <div class="post-info">
                        <h4>${post.author}</h4>
                        <p>${formatTimeAgo(post.createdAt)}</p>
                    </div>
                </div>
            </div>

            <div class="progress-post-content">
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                ${post.image ? `<img src="${post.image}" alt="${post.title}" class="progress-post-image">` : ''}
            </div>

            <div class="progress-post-actions">
                <span style="color: var(--dark-gray); font-size: 0.875rem;">
                    👍 ${post.valueAdded || 0} Value Added
                </span>
            </div>
        </div>
    `).join('');
}

function loadSentReports() {
    const reports = getReports();
    const reportsList = document.getElementById('sentReportsList');

    if (reports.length === 0) {
        reportsList.innerHTML = '<p class="empty-state">No reports sent yet</p>';
        return;
    }

    reportsList.innerHTML = reports.map(report => `
        <div class="report-summary">
            <h4>${report.title}</h4>
            <p>Sent to: Demo Member</p>
            <p class="report-date">${formatDate(report.date)}</p>
        </div>
    `).join('');
}

// ===== Report Form =====
function initReportForm() {
    const reportForm = document.getElementById('reportForm');

    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const report = {
            id: Date.now(),
            memberId: document.getElementById('reportMember').value,
            title: document.getElementById('reportTitle').value,
            content: document.getElementById('reportContent').value,
            strengths: parseListInput(document.getElementById('reportStrengths').value),
            improvements: parseListInput(document.getElementById('reportImprovements').value),
            nextSteps: parseListInput(document.getElementById('reportNextSteps').value),
            date: new Date().toISOString()
        };

        // Save report
        const reports = getReports();
        reports.unshift(report);
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

        // Show success message
        alert('Report sent successfully! The member will be notified via email.');

        // Reset form
        e.target.reset();

        // Reload reports
        loadSentReports();
        updateMentorStats();
    });
}

function parseListInput(text) {
    if (!text || !text.trim()) return [];
    return text.split('\n').map(item => item.trim()).filter(item => item.length > 0);
}

function createReportForGoal(goalId) {
    // Switch to reports section
    document.querySelector('[data-section="reports"]').click();

    // Scroll to form
    setTimeout(() => {
        document.getElementById('reportForm').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function viewMember(memberId) {
    alert('Member profile view would open here in a full implementation.');
}

// ===== Data Helpers =====
function getGoals() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || '[]');
}

function getProgress() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '[]');
}

function getReports() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
}

// ===== Utilities =====
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }

    return 'Just now';
}
