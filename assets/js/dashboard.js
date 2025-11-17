// World Changers Dashboard - Main JavaScript
// Handles: Goal-setting Hub, Progress Stream, Mentor Reports

// ===== Data Storage =====
const STORAGE_KEYS = {
    GOALS: 'wc_goals',
    PROGRESS: 'wc_progress',
    REPORTS: 'wc_reports',
    USER: 'wc_user'
};

// ===== Initialize Dashboard =====
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();

    // Initialize navigation
    initNavigation();

    // Initialize modals
    initModals();

    // Load dashboard data
    loadDashboardData();

    // Initialize forms
    initForms();

    // Load user info
    loadUserInfo();
});

// ===== Authentication =====
function checkAuth() {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
    if (!user) {
        window.location.href = 'login.html';
    }
}

function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    document.getElementById('userName').textContent = `Welcome, ${user.name || 'Member'}`;
    document.querySelector('.user-avatar').textContent = (user.name || 'M')[0].toUpperCase();
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
        overview: 'Dashboard Overview',
        goals: 'Goal-Setting Hub',
        progress: 'Progress Stream',
        mentor: 'Mentor Reports',
        profile: 'Your Profile'
    };
    document.getElementById('sectionTitle').textContent = titles[sectionId] || 'Dashboard';
}

// ===== Modals =====
function initModals() {
    // Goal Modal
    const goalModal = document.getElementById('goalModal');
    const addGoalBtn = document.getElementById('addGoalBtn');
    const closeGoalModal = document.getElementById('closeGoalModal');
    const cancelGoalBtn = document.getElementById('cancelGoalBtn');

    addGoalBtn.addEventListener('click', () => openModal(goalModal));
    closeGoalModal.addEventListener('click', () => closeModal(goalModal));
    cancelGoalBtn.addEventListener('click', () => closeModal(goalModal));

    // Progress Modal
    const progressModal = document.getElementById('progressModal');
    const addProgressBtn = document.getElementById('addProgressBtn');
    const closeProgressModal = document.getElementById('closeProgressModal');
    const cancelProgressBtn = document.getElementById('cancelProgressBtn');

    addProgressBtn.addEventListener('click', () => openModal(progressModal));
    closeProgressModal.addEventListener('click', () => closeModal(progressModal));
    cancelProgressBtn.addEventListener('click', () => closeModal(progressModal));

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Image preview
    const progressImage = document.getElementById('progressImage');
    progressImage.addEventListener('change', handleImagePreview);
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function handleImagePreview(e) {
    const preview = document.getElementById('imagePreview');
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            preview.classList.add('active');
        };
        reader.readAsDataURL(file);
    } else {
        preview.classList.remove('active');
        preview.innerHTML = '';
    }
}

// ===== Forms =====
function initForms() {
    // Goal Form
    const goalForm = document.getElementById('goalForm');
    goalForm.addEventListener('submit', handleGoalSubmit);

    // Progress Form
    const progressForm = document.getElementById('progressForm');
    progressForm.addEventListener('submit', handleProgressSubmit);

    // Profile Form
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', handleProfileSubmit);
}

function handleGoalSubmit(e) {
    e.preventDefault();

    const goal = {
        id: Date.now(),
        title: document.getElementById('goalTitle').value,
        how: document.getElementById('goalHow').value,
        current: document.getElementById('goalCurrent').value,
        deadline: document.getElementById('goalDeadline').value,
        status: 'active',
        createdAt: new Date().toISOString()
    };

    // Save goal
    const goals = getGoals();
    goals.unshift(goal);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));

    // Close modal and reset form
    closeModal(document.getElementById('goalModal'));
    e.target.reset();

    // Reload goals
    loadGoals();
    updateStats();

    // Send email reminder (simulation)
    scheduleGoalReminder(goal);

    // Show success message
    showNotification('Goal added successfully! Email reminder scheduled.');
}

function handleProgressSubmit(e) {
    e.preventDefault();

    const imageFile = document.getElementById('progressImage').files[0];
    let imageData = null;

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imageData = event.target.result;
            saveProgress(imageData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveProgress(null);
    }

    function saveProgress(image) {
        const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');

        const progress = {
            id: Date.now(),
            title: document.getElementById('progressTitle').value,
            description: document.getElementById('progressDescription').value,
            image: image,
            author: user.name || 'Member',
            authorId: user.id || 1,
            valueAdded: 0,
            createdAt: new Date().toISOString()
        };

        // Save progress
        const progressList = getProgress();
        progressList.unshift(progress);
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressList));

        // Close modal and reset form
        closeModal(document.getElementById('progressModal'));
        document.getElementById('progressForm').reset();
        document.getElementById('imagePreview').classList.remove('active');
        document.getElementById('imagePreview').innerHTML = '';

        // Reload progress
        loadProgressFeed();
        updateStats();

        // Show success message
        showNotification('Progress update shared successfully!');
    }
}

function handleProfileSubmit(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    user.name = document.getElementById('profileName').value;
    user.bio = document.getElementById('profileBio').value;

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    showNotification('Profile updated successfully!');
    loadUserInfo();
}

// ===== Data Loading =====
function loadDashboardData() {
    updateStats();
    loadGoals();
    loadProgressFeed();
    loadMentorReports();
    loadRecentItems();
}

function updateStats() {
    const goals = getGoals();
    const progress = getProgress();
    const reports = getReports();

    document.getElementById('activeGoalsCount').textContent = goals.filter(g => g.status === 'active').length;
    document.getElementById('completedGoalsCount').textContent = goals.filter(g => g.status === 'completed').length;
    document.getElementById('progressUpdatesCount').textContent = progress.length;
    document.getElementById('mentorReportsCount').textContent = reports.length;
}

function loadGoals() {
    const goals = getGoals();
    const goalsList = document.getElementById('goalsList');

    if (goals.length === 0) {
        goalsList.innerHTML = '<p class="empty-state">No goals yet. Click "Add New Goal" to get started!</p>';
        return;
    }

    goalsList.innerHTML = goals.map(goal => `
        <div class="goal-card">
            <div class="goal-card-header">
                <div class="goal-card-title">
                    <h3>${goal.title}</h3>
                </div>
                <span class="goal-status ${goal.status}">${goal.status.toUpperCase()}</span>
            </div>

            <div class="goal-section">
                <h4>How will you do it?</h4>
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
        </div>
    `).join('');
}

function loadProgressFeed() {
    const progressList = getProgress();
    const progressFeed = document.getElementById('progressFeed');

    if (progressList.length === 0) {
        progressFeed.innerHTML = '<p class="empty-state">No progress updates yet. Share your first update!</p>';
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
                <button class="action-btn ${post.valueAdded > 0 ? 'active' : ''}" onclick="addValue(${post.id})">
                    <span>👍</span>
                    <span>Value Added (${post.valueAdded})</span>
                </button>
            </div>
        </div>
    `).join('');
}

function loadMentorReports() {
    const reports = getReports();
    const reportsList = document.getElementById('mentorReportsList');

    if (reports.length === 0) {
        reportsList.innerHTML = '<p class="empty-state">No reports yet from your mentor.</p>';
        return;
    }

    reportsList.innerHTML = reports.map(report => `
        <div class="report-card">
            <div class="report-header">
                <div class="mentor-avatar">EJ</div>
                <div class="report-header-info">
                    <h3>Report from Egbodofo Joshua</h3>
                    <p class="report-date">${formatDate(report.date)}</p>
                </div>
            </div>

            <div class="report-content">
                <h4>${report.title}</h4>
                <p>${report.content}</p>

                ${report.strengths ? `
                    <h4>Strengths</h4>
                    <ul>
                        ${report.strengths.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                ` : ''}

                ${report.improvements ? `
                    <h4>Areas for Improvement</h4>
                    <ul>
                        ${report.improvements.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                ` : ''}

                ${report.nextSteps ? `
                    <h4>Next Steps</h4>
                    <ul>
                        ${report.nextSteps.map(n => `<li>${n}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function loadRecentItems() {
    const goals = getGoals().slice(0, 3);
    const progress = getProgress().slice(0, 3);

    const recentGoalsList = document.getElementById('recentGoalsList');
    const recentProgressList = document.getElementById('recentProgressList');

    if (goals.length === 0) {
        recentGoalsList.innerHTML = '<p class="empty-state">No goals yet. Create your first goal in the Goal Hub!</p>';
    } else {
        recentGoalsList.innerHTML = goals.map(goal => `
            <div class="recent-item">
                <h4>${goal.title}</h4>
                <p class="recent-item-date">${formatTimeAgo(goal.createdAt)}</p>
            </div>
        `).join('');
    }

    if (progress.length === 0) {
        recentProgressList.innerHTML = '<p class="empty-state">No progress updates yet. Share your progress in the Progress Stream!</p>';
    } else {
        recentProgressList.innerHTML = progress.map(post => `
            <div class="recent-item">
                <h4>${post.title}</h4>
                <p>${post.description.substring(0, 100)}...</p>
                <p class="recent-item-date">${formatTimeAgo(post.createdAt)}</p>
            </div>
        `).join('');
    }
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

// ===== Interactions =====
function addValue(postId) {
    const progressList = getProgress();
    const post = progressList.find(p => p.id === postId);

    if (post) {
        post.valueAdded = (post.valueAdded || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressList));
        loadProgressFeed();
    }
}

function scheduleGoalReminder(goal) {
    // In a real implementation, this would integrate with an email service
    console.log('Email reminder scheduled for goal:', goal.title);
    console.log('Reminder details:', {
        what: goal.title,
        how: goal.how,
        deadline: goal.deadline
    });
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

function showNotification(message) {
    alert(message);
    // In a real implementation, this would be a nice toast notification
}

// ===== Initialize Demo Data =====
function initializeDemoData() {
    // Only initialize if no data exists
    if (getGoals().length === 0) {
        const demoGoals = [
            {
                id: Date.now(),
                title: 'Launch MVP of my SaaS product',
                how: 'I will build a minimal viable product focusing on core features, get early user feedback, and iterate based on insights.',
                current: 'Currently in the design phase, creating wireframes and defining user stories.',
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'active',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(demoGoals));
    }

    if (getReports().length === 0) {
        const demoReports = [
            {
                id: 1,
                title: 'Week 1 Progress Review',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                content: 'You have made excellent progress this week. Your commitment to the program is evident in the quality of work you are producing.',
                strengths: [
                    'Strong goal-setting and clear articulation of objectives',
                    'Consistent engagement with the curriculum',
                    'Demonstrating growth mindset and willingness to learn'
                ],
                improvements: [
                    'Consider breaking down larger goals into smaller milestones',
                    'Increase engagement with the peer community',
                    'Document your learning process more consistently'
                ],
                nextSteps: [
                    'Complete the Week 2 curriculum on Wishes vs. Desires',
                    'Share at least one progress update with the community',
                    'Schedule our next mentorship session for detailed discussion'
                ]
            }
        ];
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(demoReports));
    }
}

// Initialize demo data on first load
initializeDemoData();
