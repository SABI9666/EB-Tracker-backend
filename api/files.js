<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#0d47a1">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EBTracker - EDANBROOK Project Management</title>
    <style>
     * { margin: 0; padding: 0; box-sizing: border-box; }

:root {
    /* Professional Light Color Palette */
    --primary-blue: #1e40af;
    --dark-blue: #1e3a8a;
    --light-blue: #dbeafe;
    --accent-blue: #3b82f6;
    --text-dark: #1f2937;
    --text-light: #6b7280;
    --background: #f0f4f8;
    --success: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;
    --border: #e5e7eb;
    --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --card-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
       
/* Filter Button Styles */
.filter-buttons-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    padding: 1rem;
    background: white;
    border-radius: 12px;
    box-shadow: var(--card-shadow);
}

.filter-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 180px;
    justify-content: center;
}

.filter-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.filter-btn.active {
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transform: scale(1.05);
}

/* All Proposals - Blue */
.filter-btn-all {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
}

.filter-btn-all.active {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-color: #1e40af;
}

/* Estimation Completed - Green */
.filter-btn-estimation {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
}

.filter-btn-estimation.active {
    background: linear-gradient(135deg, #059669, #047857);
    border-color: #065f46;
}

/* Pricing Pending - Orange */
.filter-btn-pricing {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
}

.filter-btn-pricing.active {
    background: linear-gradient(135deg, #d97706, #b45309);
    border-color: #92400e;
}

/* Project Pending Allocation - Purple */
.filter-btn-pending {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
}

.filter-btn-pending.active {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    border-color: #5b21b6;
}

.filter-count {
    background: rgba(255,255,255,0.3);
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 700;
}


body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    background: linear-gradient(135deg, #f0f4f8 0%, #e6eef5 100%);
    color: var(--text-dark);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Prevent scroll when modal is open */
body.modal-open {
    overflow: hidden;
}

/* ============================== */
/* LOGIN PAGE STYLES */
/* ============================== */
.login-page { 
    min-height: 100vh; 
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex; 
    align-items: center; 
    justify-content: center; 
    padding: 2rem; 
}

.login-container { 
    background: white; 
    border-radius: 20px; 
    box-shadow: 0 20px 40px rgba(0,0,0,0.3); 
    overflow: hidden; 
    display: flex; 
    min-width: 1000px; 
    min-height: 600px; 
}

.login-left { 
    flex: 1; 
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    color: white; 
    padding: 3rem; 
    text-align: center; 
}

.logo-circle { 
    width: 100px; 
    height: 100px; 
    background: white; 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-weight: bold; 
    color: #667eea; 
    font-size: 40px; 
    margin-bottom: 1rem; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.company-title { 
    font-size: 3rem; 
    font-weight: bold; 
    margin-bottom: 0.5rem; 
}

.company-subtitle { 
    font-size: 1.2rem; 
    opacity: 0.9; 
    margin-bottom: 2rem; 
}

.login-right { 
    flex: 1.2; 
    padding: 3rem; 
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
}

.auth-tabs { 
    display: flex; 
    margin-bottom: 2rem; 
    border-bottom: 2px solid var(--border); 
}

.auth-tab { 
    flex: 1; 
    padding: 1rem; 
    background: none; 
    border: none; 
    cursor: pointer; 
    font-size: 1.1rem; 
    font-weight: 600; 
    color: var(--text-light); 
    border-bottom: 2px solid transparent; 
    transition: all 0.3s ease; 
}

.auth-tab.active { 
    color: var(--primary-blue); 
    border-bottom-color: var(--primary-blue); 
}

.auth-content { 
    display: none; 
}

.auth-content.active { 
    display: block; 
}

.form-group { 
    margin-bottom: 1.5rem; 
}

.form-group label { 
    display: block; 
    font-weight: 600; 
    margin-bottom: 0.5rem; 
    color: var(--text-dark); 
}

.form-control { 
    width: 100%; 
    padding: 0.875rem 1rem; 
    border: 2px solid var(--border); 
    border-radius: 10px; 
    font-size: 0.95rem; 
    transition: all 0.3s ease; 
    background: white;
}

.form-control:focus { 
    outline: none; 
    border-color: var(--primary-blue); 
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1); 
}

/* ============================== */
/* BUTTON STYLES */
/* ============================== */
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.btn:active {
    transform: translateY(0);
}

.btn-primary { 
    background: linear-gradient(135deg, var(--primary-blue), var(--accent-blue));
    color: white;
}

.btn-primary:hover { 
    background: linear-gradient(135deg, var(--dark-blue), var(--primary-blue));
}

.btn-success { 
    background: var(--success);
    color: white;
}

.btn-success:hover {
    background: #059669;
}

.btn-warning { 
    background: var(--warning);
    color: white;
}

.btn-warning:hover { 
    background: #d97706;
}

.btn-danger {
    background: var(--danger);
    color: white;
}

.btn-danger:hover {
    background: #dc2626;
}

.btn-outline { 
    background: transparent;
    color: var(--primary-blue);
    border: 2px solid var(--primary-blue);
    box-shadow: none;
}

.btn-outline:hover {
    background: var(--primary-blue);
    color: white;
}

.btn-sm { 
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    width: auto;
}

.btn-disabled { 
    background: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.6;
}

.btn-disabled:hover {
    transform: none;
    box-shadow: none;
}

.role-selector { 
    margin-bottom: 1.5rem; 
}

.role-buttons { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
    gap: 0.5rem; 
}

.role-btn { 
    padding: 1rem; 
    background: var(--light-blue); 
    border: 2px solid var(--primary-blue); 
    border-radius: 8px; 
    cursor: pointer; 
    text-align: center; 
    transition: all 0.3s ease; 
    color: var(--primary-blue); 
    font-weight: 600; 
}

.role-btn.active { 
    background: var(--primary-blue); 
    color: white; 
}

.info-box { 
    background: var(--light-blue); 
    padding: 1.5rem; 
    border-radius: 8px; 
    margin-top: 2rem; 
    text-align: left; 
    color: var(--text-dark); 
}

.info-box h4 { 
    color: var(--primary-blue); 
    margin-bottom: 1rem; 
}

.info-box ul { 
    list-style-position: inside; 
    padding-left: 0.5rem; 
}

.info-box li { 
    margin-bottom: 0.5rem; 
}

.error-message, .success-message, .info-message, .warning-message { 
    padding: 1rem; 
    border-radius: 8px; 
    margin-bottom: 1rem; 
    font-weight: 600; 
}

.error-message { 
    background: #fee2e2; 
    color: #991b1b;
    border-left: 4px solid #dc2626;
}

.success-message { 
    background: #d1fae5; 
    color: #065f46;
    border-left: 4px solid #10b981;
}

.info-message { 
    background: #dbeafe; 
    color: #1e40af;
    border-left: 4px solid #3b82f6;
}

.warning-message { 
    background: #fef3c7; 
    color: #92400e;
    border-left: 4px solid #f59e0b;
}

/* ============================== */
/* APP CONTAINER & LAYOUT */
/* ============================== */
.app-container { 
    display: none; 
    min-height: 100vh; 
    background: linear-gradient(135deg, #f0f4f8 0%, #e6eef5 100%);
}

/* ============================== */
/* PROFESSIONAL HEADER */
/* ============================== */
.header { 
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white; 
    padding: 1.25rem 2rem; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-content { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    max-width: 1400px; 
    margin: 0 auto; 
}

.logo { 
    display: flex; 
    align-items: center; 
    gap: 1rem; 
}

.logo .logo-circle { 
    width: 50px; 
    height: 50px; 
    font-size: 20px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #667eea;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.company-info h1 { 
    font-size: 1.75rem; 
    font-weight: 700;
    letter-spacing: -0.025em;
}

.company-info .subtitle { 
    font-size: 0.875rem; 
    opacity: 0.9; 
    margin-top: 0.25rem;
    font-weight: 400;
}

.user-info { 
    text-align: right; 
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-info .user-name {
    font-weight: 600;
    font-size: 0.95rem;
}

.user-info .user-role {
    font-size: 0.8rem;
    opacity: 0.9;
    background: rgba(255,255,255,0.15);
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-weight: 500;
}

.btn-logout { 
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    color: white; 
    padding: 0.6rem 1.25rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.btn-logout:hover {
    background: rgba(255,255,255,0.25);
    transform: translateY(-1px);
}

/* ============================== */
/* NOTIFICATION BELL IN HEADER */
/* ============================== */
.notification-bell {
    position: relative;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.15);
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.notification-bell:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
}

.notification-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ef4444;
    color: white;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}


/* ============================== */
/* 🔔 FINAL FIXED NOTIFICATION CSS (ROBUST SCROLL) */
/* ============================== */
.notification-panel {
    position: fixed;
    top: 70px;
    right: 20px;
    width: 380px;
    max-height: 80vh !important; /* Force max height so it can overflow */
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.4);
    z-index: 1100;
    display: none; 
    flex-direction: column !important; /* CRITICAL for scrolling to work */
    border: 1px solid #e5e7eb;
    overflow: hidden; 
    animation: slideInPanel 0.3s ease forwards;
}

/* MUST use flex to enable the inner scrolling area */
.notification-panel.active {
    display: flex !important; 
}

.notification-header {
    padding: 1rem 1.25rem;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-bottom: 1px solid #dee2e6;
    flex-shrink: 0; /* Never let the header shrink */
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.notification-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-dark);
}

.notification-list {
    flex: 1 1 auto;              /* Grow and shrink as needed */
    overflow-y: auto !important; /* FORCE vertical scrolling */
    overflow-x: hidden;          /* Prevent horizontal scrollbars */
    min-height: 0;               /* Crucial fix for flex scrolling */
    padding: 0;
    overscroll-behavior: contain; /* Prevents scrolling the page behind it */
}

.notification-item {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f1f3f5;
    cursor: pointer;
    display: flex;
    gap: 1rem;
    transition: all 0.2s ease;
    background: white;
    text-align: left;
    align-items: flex-start; /* Ensures icon stays at top if message is long */
}

.notification-item:hover {
    background: #f8fafc;
}

.notification-item.unread {
    background: #eff6ff;
    border-left: 4px solid var(--primary-blue);
}

.notification-icon {
    font-size: 1.4rem;
    flex-shrink: 0;
    padding-top: 0.2rem;
}

.notification-content {
    flex: 1; /* Ensures text takes up remaining width */
    min-width: 0; /* fix for text truncation in flex items */
}

.notification-message {
    font-size: 0.95rem;
    color: var(--text-dark);
    line-height: 1.4;
    margin-bottom: 0.25rem;
    word-wrap: break-word; /* Prevents long text from breaking layout */
}

.notification-meta {
    font-size: 0.75rem;
    color: var(--text-light);
    display: block;
}

/* Custom scrollbar for a pro look */
.notification-list::-webkit-scrollbar {
    width: 6px;
}
.notification-list::-webkit-scrollbar-track {
    background: #f1f5f9;
}
.notification-list::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

/* ============================== */
/* MAIN LAYOUT */
/* ============================== */
.main-layout { 
    display: flex; 
    max-width: 1400px; 
    margin: 0 auto;
    min-height: calc(100vh - 85px);
}

/* ============================== */
/* PROFESSIONAL SIDEBAR */
/* ============================== */
.sidebar { 
    width: 280px; 
    background: white;
    box-shadow: 2px 0 12px rgba(0,0,0,0.08);
    padding: 0;
    min-height: calc(100vh - 85px);
    border-right: 1px solid var(--border);
}

.nav-menu { 
    list-style: none; 
    margin: 0; 
    padding: 1rem 0;
}

.nav-menu li { 
    margin: 0.25rem 0.75rem;
}

.nav-menu a {
    display: flex;
    align-items: center;
    padding: 1rem 1.25rem;
    color: var(--text-dark);
    text-decoration: none;
    transition: all 0.2s ease;
    font-weight: 500;
    border-radius: 10px;
    font-size: 0.95rem;
}

.nav-menu a:hover {
    background: var(--light-blue);
    color: var(--primary-blue);
    transform: translateX(4px);
}

.nav-menu a.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    box-shadow: var(--card-shadow);
}

.nav-menu .nav-icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
    opacity: 0.7;
}

.nav-menu a.active .nav-icon {
    opacity: 1;
}

/* ============================== */
/* MAIN CONTENT AREA */
/* ============================== */
.main-content {
    flex: 1;
    padding: 2.5rem;
    overflow-y: auto;
    max-height: calc(100vh - 85px);
    background: transparent;
}

/* ============================== */
/* PROFESSIONAL PAGE HEADER */
/* ============================== */
.page-header {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--border);
}

.page-header h2 {
    font-size: 2.25rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-weight: 700;
    letter-spacing: -0.025em;
}

.page-header .subtitle {
    color: var(--text-light);
    font-size: 1.05rem;
    font-weight: 400;
}

/* ============================== */
/* ENHANCED DASHBOARD STATS */
/* ============================== */
.dashboard-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.stat-card {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: var(--card-shadow);
    text-align: center;
    border-left: 4px solid var(--primary-blue);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: var(--light-blue);
    border-radius: 50%;
    transform: translate(40%, -40%);
    opacity: 0.3;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-shadow-hover);
}

.stat-number {
    font-size: 3rem;
    font-weight: 700;
    color: var(--primary-blue);
    margin-bottom: 0.5rem;
    position: relative;
    z-index: 1;
}

.stat-label {
    color: var(--text-light);
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    z-index: 1;
}

/* ============================== */
/* PROFESSIONAL ACTION SECTION */
/* ============================== */
.action-section {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: var(--card-shadow);
    border: 1px solid var(--border);
}

.action-section h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--light-blue);
}

.action-item {
    background: #f9fafb;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 1rem;
    border-left: 4px solid var(--primary-blue);
    transition: all 0.3s ease;
}

.action-item:hover {
    background: white;
    box-shadow: var(--card-shadow);
    transform: translateX(4px);
}

/* ============================== */
/* ENHANCED PROJECT CARDS */
/* ============================== */
.project-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.project-card {
    background: white;
    border-radius: 16px;
    padding: 1.75rem;
    box-shadow: var(--card-shadow);
    transition: all 0.3s ease;
    border: 1px solid var(--border);
    position: relative;
    overflow: hidden;
}

.project-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
}

.project-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--card-shadow-hover);
    border-color: var(--primary-blue);
}

.project-card h4 {
    font-size: 1.25rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-weight: 700;
    line-height: 1.4;
}

.project-card .project-info {
    margin-bottom: 1.25rem;
}
 /* PROFESSIONAL PROPOSAL CARDS */
.proposals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 1.75rem;
    margin-top: 1.5rem;
}

.proposal-card {
    background: white;
    border-radius: 16px;
    padding: 1.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
    position: relative;
    overflow: hidden;
}

.proposal-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
}

.proposal-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
}

.proposal-status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-won {
    background: #d1fae5;
    color: #065f46;
    border: 2px solid #10b981;
}

.status-approved {
    background: #d1fae5;
    color: #065f46;
}

.status-submitted {
    background: #ddd6fe;
    color: #5b21b6;
}       

.project-card .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f3f4f6;
    font-size: 0.9rem;
}

.project-card .info-row:last-child {
    border-bottom: none;
}

.project-card .info-label {
    color: var(--text-light);
    font-weight: 500;
}

.project-card .info-value {
    color: var(--text-dark);
    font-weight: 600;
}

/* ============================== */
/* STATUS BADGES */
/* ============================== */
.status-badge {
    display: inline-block;
    padding: 0.375rem 0.875rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-badge.pending {
    background: #fef3c7;
    color: #92400e;
}

.status-badge.in-progress, .status-badge.active {
    background: #dbeafe;
    color: #1e40af;
}

.status-badge.completed {
    background: #d1fae5;
    color: #065f46;
}

.status-badge.rejected {
    background: #fee2e2;
    color: #991b1b;
}

.status-badge.allocated {
    background: #e0e7ff;
    color: #3730a3;
}

.status-badge.approved {
    background: #d1fae5;
    color: #065f46;
}

/* ============================== */
/* ENHANCED TABLES */
/* ============================== */
.data-table {
    width: 100%;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--card-shadow);
    border: 1px solid var(--border);
}

.data-table thead {
    background: linear-gradient(135deg, #f9fafb, #f3f4f6);
}

.data-table th {
    padding: 1.25rem 1.5rem;
    text-align: left;
    font-weight: 700;
    color: var(--text-dark);
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid var(--border);
}

.data-table td {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f3f4f6;
    color: var(--text-dark);
    font-size: 0.95rem;
}

.data-table tbody tr {
    transition: all 0.2s ease;
}

.data-table tbody tr:hover {
    background: #f9fafb;
}

.data-table tbody tr:last-child td {
    border-bottom: none;
}
 /* ADD THIS NEW CSS CLASS */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.65);
    z-index: 9999;
    backdrop-filter: blur(4px);
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}       

/* ============================== */
/* PROFESSIONAL MODALS - PROPERLY CENTERED */
/* ============================== */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.65);
    z-index: 9999;
    backdrop-filter: blur(4px);
    overflow-y: auto;
    padding: 2rem 0;
    /* CRITICAL CHANGES: */
    align-items: center;
    justify-content: center;
}

.modal.show {
    display: flex !important; /* Changed from display: block */
}

.modal-content {
    background: white;
    margin: auto; /* Added auto margin */
    padding: 0;
    border-radius: 20px;
    max-width: 900px;
    width: 90%;
    max-height: 85vh;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    animation: modalSlideIn 0.3s ease;
    position: relative;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    align-self: center; /* Added for centering */
}

.modal.show {
    display: flex !important;
}

.modal-content {
    background: white;
    margin: 2rem auto;
    padding: 0;
    border-radius: 20px;
    max-width: 900px;
    width: 90%;
    max-height: 90vh;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    animation: modalSlideIn 0.3s ease;
    position: relative;
    z-index: 10000;
    display: flex;
    flex-direction: column;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-30px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes modalSlideOut {
    from {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    to {
        opacity: 0;
        transform: translateY(-30px) scale(0.95);
    }
}

.modal-header {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 1.75rem 2rem;
    border-radius: 20px 20px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
}

.close {
    color: white;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    background: rgba(255,255,255,0.2);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.close:hover {
    background: rgba(255,255,255,0.3);
    transform: rotate(90deg);
}

.modal-body {
    padding: 2rem;
    overflow-y: auto;
    flex: 1;
    max-height: calc(90vh - 200px);
}

.modal-body::-webkit-scrollbar {
    width: 8px;
}

.modal-body::-webkit-scrollbar-track {
    background: #f1f3f5;
    border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.modal-footer {
    padding: 1.5rem 2rem;
    background: #f9fafb;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    border-radius: 0 0 20px 20px;
    flex-wrap: wrap;
    flex-shrink: 0;
}

/* ============================== */
/* PROFESSIONAL FILTERS */
/* ============================== */
.filters-bar {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: var(--card-shadow);
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
    border: 1px solid var(--border);
}

.filter-group {
    flex: 1;
    min-width: 200px;
}

.filter-group label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-light);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.filter-group select,
.filter-group input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid var(--border);
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
}

.filter-group select:focus,
.filter-group input:focus {
    outline: none;
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

/* ============================== */
/* LOADING STATES */
/* ============================== */
#loadingSpinner {
    position: fixed;      /* Keeps it floating on top, doesn't push content down */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    z-index: 10001;       /* High z-index to sit on top of everything */
    display: none;        /* Hidden by default */
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
}

/* Use generic .spinner class so it can be re-used if needed */
.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid var(--light-blue);
    border-top: 5px solid var(--primary-blue);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* ============================== */
/* EMPTY STATES */
/* ============================== */
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-light);
}

.empty-state h3 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.empty-state p {
    font-size: 1rem;
    margin-bottom: 1.5rem;
}

/* ============================== */
/* CARDS */
/* ============================== */
.card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: var(--card-shadow);
    border: 1px solid var(--border);
    margin-bottom: 1.5rem;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--light-blue);
}

.card-header h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-dark);
}
        /* ============================== */
/* PROJECTS SUMMARY & FILTERS */
/* ============================== */
.projects-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
}

.summary-card {
    background: white;
    padding: 1.5rem;
    border-radius: 16px;
    box-shadow: var(--card-shadow);
    border: 1px solid var(--border);
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.summary-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-shadow-hover);
}

.summary-card h4 {
    color: var(--text-light);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
}

.summary-card .number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-dark);
    line-height: 1.2;
}

/* Specific colors for summary cards */
.summary-card.won { border-top: 4px solid var(--success); }
.summary-card.won .number { color: var(--success); }

.summary-card.loss { border-top: 4px solid var(--danger); }
.summary-card.loss .number { color: var(--danger); }

.summary-card.pending { border-top: 4px solid var(--warning); }
.summary-card.pending .number { color: var(--warning); }

.summary-card.allocated { border-top: 4px solid var(--primary-blue); }
.summary-card.allocated .number { color: var(--primary-blue); }

/* Filter Tabs Styling */
.project-filter-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem; /* Space for scrollbar if needed */
}

.filter-tab {
    padding: 0.75rem 1.5rem;
    background: white;
    border: 2px solid var(--border);
    border-radius: 50px; /* Pill shape */
    font-weight: 600;
    color: var(--text-light);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filter-tab:hover {
    border-color: var(--primary-blue);
    color: var(--primary-blue);
    background: var(--light-blue);
}

.filter-tab.active {
    background: var(--primary-blue);
    color: white;
    border-color: var(--primary-blue);
    box-shadow: 0 4px 6px rgba(30, 64, 175, 0.25);
}

.filter-tab .count {
    background: rgba(0, 0, 0, 0.1);
    padding: 0.15rem 0.6rem;
    border-radius: 20px;
    font-size: 0.8rem;
}

.filter-tab.active .count {
    background: rgba(255, 255, 255, 0.3);
    color: white;
}

/* ============================== */
/* RESPONSIVE DESIGN */
/* ============================== */
@media (max-width: 1024px) {
    .sidebar {
        width: 240px;
    }
    
    .main-content {
        padding: 1.5rem;
    }
    
    .dashboard-stats {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }
    
    .project-cards {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
}

@media (max-width: 768px) {
    .login-container {
        min-width: auto;
        flex-direction: column;
    }
    
    .login-left,
    .login-right {
        flex: 1;
        padding: 2rem;
    }
    
    .company-title {
        font-size: 2rem;
    }
    
    .main-layout {
        flex-direction: column;
    }
    
    .sidebar {
        width: 100%;
        box-shadow: none;
        border-right: none;
        border-bottom: 1px solid var(--border);
        min-height: auto;
    }
    
    .nav-menu {
        display: flex;
        overflow-x: auto;
        padding: 0.5rem;
    }
    
    .nav-menu li {
        margin: 0 0.25rem;
    }
    
    .nav-menu a {
        padding: 0.75rem 1rem;
        white-space: nowrap;
    }
    
    .page-header h2 {
        font-size: 1.75rem;
    }
    
    .stat-card {
        padding: 1.5rem;
    }
    
    .stat-number {
        font-size: 2.5rem;
    }
    
    .project-cards {
        grid-template-columns: 1fr;
    }
    
    .notification-panel {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        width: 100%;
        max-height: 100vh;
        border-radius: 0;
    }
    
    .modal {
        padding: 1rem;
        align-items: flex-start;
    }
    
    .modal-content {
        margin: 1rem auto;
        width: 95%;
        max-height: 95vh;
    }
    
    .modal-body {
        max-height: calc(95vh - 180px);
        padding: 1.5rem;
    }
    
    .modal-header,
    .modal-footer {
        padding: 1.25rem 1.5rem;
    }
    
    .filters-bar {
        flex-direction: column;
    }
    
    .filter-group {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .user-info {
        flex-direction: column;
        width: 100%;
    }
    
    .btn-logout {
        width: 100%;
    }
    
    .page-header h2 {
        font-size: 1.5rem;
    }
    
    .stat-number {
        font-size: 2rem;
    }
    
    .modal {
        padding: 0.5rem;
    }
    
    .modal-content {
        margin: 0.5rem auto;
        width: 98%;
        max-height: 98vh;
        border-radius: 12px;
    }
    
    .modal-header {
        border-radius: 12px 12px 0 0;
        padding: 1rem 1.25rem;
    }
    
    .modal-header h3 {
        font-size: 1.25rem;
    }
    
    .modal-body {
        padding: 1.25rem;
        max-height: calc(98vh - 160px);
    }
    
    .modal-footer {
        padding: 1rem 1.25rem;
        border-radius: 0 0 12px 12px;
        flex-direction: column;
    }
    
    .modal-footer .btn {
        width: 100%;
    }
}

/* ============================== */
/* PRINT STYLES */
/* ============================== */
@media print {
    .sidebar,
    .header,
    .btn,
    .modal,
    .loading-overlay,
    .notification-panel {
        display: none !important;
    }
    
    .main-content {
        max-height: none;
        overflow: visible;
    }
    
    .project-card,
    .stat-card,
    .action-section {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #ccc;
    }
}

/* ============================== */
/* UTILITY CLASSES */
/* ============================== */
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-left { text-align: left; }

.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-normal { font-weight: 400; }

.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }

.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }

.hidden { display: none; }
.block { display: block; }


/* ============================================ */
/* DIRECTOR FILTER BUTTONS STYLES */
/* ============================================ */
.filter-buttons-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.875rem 1.5rem;
    border: 2px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.filter-btn.active {
    border-color: currentColor;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.filter-btn-all {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
}

.filter-btn-approval {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
}

.filter-btn-pricing {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
}

.filter-btn-estimation {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
}

.filter-count {
    background: rgba(255,255,255,0.3);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: bold;
}
        /* ============================================================================ */
/* COO MULTI-DESIGNER ALLOCATION STYLES */
/* ============================================================================ */

.designer-allocation-row {
    background: white;
    border: 2px solid var(--border);
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    position: relative;
    transition: all 0.3s ease;
}

.designer-allocation-row:hover {
    border-color: var(--primary-blue);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.designer-allocation-row.error {
    border-color: var(--danger);
    background: #fff5f5;
}

.designer-row-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
}

.designer-row-number {
    background: var(--primary-blue);
    color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
}

.remove-designer-btn {
    background: var(--danger);
    color: white;
    border: none;
    padding: 0.4rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.remove-designer-btn:hover {
    background: #c53030;
    transform: scale(1.05);
}

.hours-badge {
    display: inline-block;
    background: linear-gradient(135deg, var(--success), #059669);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 700;
    font-size: 1.1rem;
}

.allocation-summary {
    background: linear-gradient(135deg, #f0f4f8, #e6eef5);
    padding: 1.5rem;
    border-radius: 10px;
    margin-top: 1rem;
    border-left: 4px solid var(--primary-blue);
}

.allocation-summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 1rem;
}

.allocation-summary-item {
    text-align: center;
}

.allocation-summary-item label {
    display: block;
    font-size: 0.85rem;
    color: var(--text-light);
    margin-bottom: 0.3rem;
}

.allocation-summary-item .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-dark);
}

    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js">
        function switchDesignerTab(tabName) {
            // Update tab buttons
            document.querySelectorAll('.doc-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Update content visibility
            document.getElementById('designer-drawings-content').style.display = 'none';
            document.getElementById('designer-specs-content').style.display = 'none';
            
            if (tabName === 'drawings') {
                document.getElementById('designer-drawings-content').style.display = 'block';
            } else {
                document.getElementById('designer-specs-content').style.display = 'block';
            }
        }

    </script>
    <script src="analytics.js">
        function switchDesignerTab(tabName) {
            // Update tab buttons
            document.querySelectorAll('.doc-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Update content visibility
            document.getElementById('designer-drawings-content').style.display = 'none';
            document.getElementById('designer-specs-content').style.display = 'none';
            
            if (tabName === 'drawings') {
                document.getElementById('designer-drawings-content').style.display = 'block';
            } else {
                document.getElementById('designer-specs-content').style.display = 'block';
            }
        }

    </script>
</head>
<body>
    <div id="loginPage" class="login-page">
        <div class="login-container">
            <div class="login-left">
                <div class="logo-circle">EB</div>
                <h1 class="company-title">EDANBROOK</h1>
                <p class="company-subtitle">Project Management System</p>
                <div class="info-box">
                    <h4>✅ Updated Workflow Process</h4>
                    <ul>
                        <li><strong>Step 1:</strong> BDM creates proposal (DRAFT) & uploads files</li>
                        <li><strong>Step 2:</strong> Estimator adds manhours (ESTIMATED) & BOQ</li>
                        <li><strong>Step 3:</strong> COO sets pricing (PRICED)</li>
                        <li><strong>Step 4:</strong> Director approves (APPROVED) or rejects (REJECTED)</li>
                        <li><strong>Step 5:</strong> BDM submits to client (SUBMITTED)</li>
                        <li><strong>Step 6:</strong> BDM marks as WON/LOST → Project created</li>
                        <li><strong>Step 7:</strong> COO allocates → Design Lead assigns tasks</li>
                        <li><strong>Step 8:</strong> Designer uploads → Design sent to client</li>
                        <li><strong>Step 9:</strong> Accounts prepares invoice → Payment tracking</li>
                    </ul>
                </div>
            </div>
            <div class="login-right">
                <div class="auth-tabs">
                    <button class="auth-tab active" onclick="showTab('login')">Login</button>
                    <button class="auth-tab" onclick="showTab('register')">Register</button>
                </div>
                <div id="authMessages"></div>
                <div id="loginContent" class="auth-content active">
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Login</button>
                    </form>
                </div>
                <div id="registerContent" class="auth-content">
                    <form id="registerForm">
                        <div class="role-selector">
                            <label>Select Role:</label>
                            <div class="role-buttons">
                                <div class="role-btn active" data-role="bdm">BDM</div>
                                <div class="role-btn" data-role="estimator">Estimator</div>
                                <div class="role-btn" data-role="coo">COO</div>
                                <div class="role-btn" data-role="director">Director</div>
                                <div class="role-btn" data-role="designer">Designer</div>
                                <div class="role-btn" data-role="accounts">Accounts</div>
                            </div>
                            <input type="hidden" id="selectedRole" value="bdm">
                        </div>
                        <div class="form-group">
                            <label for="registerName">Full Name</label>
                            <input type="text" id="registerName" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="registerEmail">Email</label>
                            <input type="email" id="registerEmail" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">Password</label>
                            <input type="password" id="registerPassword" class="form-control" required minlength="6">
                        </div>
                        <button type="submit" class="btn btn-success">Register</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

   <div id="loadingSpinner" style="display: none;">
    <div class="spinner"></div>
    <p>Loading...</p>
</div>
<div id="appContainer" class="app-container">

        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <div class="logo-circle">EB</div>
                    <div class="company-info">
                        <h1>EDANBROOK</h1>
                        <div class="subtitle">EBTrack - Enhanced Project Management</div>
                    </div>
                </div>
             <div class="user-info">
                    <div id="userWelcome"></div>
                    <div id="userRole"></div>

                    <div class="notification-bell" onclick="toggleNotificationPanel()">
                        🔔
                        <span class="notification-count" id="notificationCount">0</span>
                    </div>
                    <button onclick="logout()" class="btn-logout">Logout</button>
                </div>
            </div>

            <div class="notification-panel" id="notificationPanel">
                <div class="notification-header">
                    <h3>Notifications</h3>
                </div>
                <div class="notification-list" id="notificationList">
                    <div class="notification-item">Loading...</div>
                </div>
            </div>
           




        </header>

        <div class="main-layout">
            <nav class="sidebar">
            <ul class="nav-menu">
                
                
              
                
                <li id="newProposalNavItem" style="display: none;">
                    <a href="#" onclick="showCreateProposalModal()">
                    <span class="nav-icon">➕</span>New Proposal</a></li>

                <li id="analyticsNavItem" style="display: none;">
                    <a href="#" onclick="showAnalyticsDashboard()" id="nav-analytics">
                    <span class="nav-icon">📈</span>Analytics</a>
                </li>

                <li id="proposalsNavItem"><a href="#" onclick="showProposals()" id="nav-proposals">
                    <span class="nav-icon">📋</span>All Proposals</a></li>

                <li id="designerAllocationsNavItem" style="display: none;">
                    <a href="#" onclick="showDesignerAllocations()" id="nav-designer-alloc">
                    <span class="nav-icon">⏳</span>Project Allocations</a>
                </li>
                <li id="filesNavItem"><a href="#" onclick="showFileUpload()" id="nav-files">
                    <span class="nav-icon">📁</span>File Manager</a></li>
                <li id="workflowNavItem" style="display: none;">
                    <a href="#" onclick="showWorkflow()" id="nav-workflow">
                    <span class="nav-icon">🔄</span>Workflow</a></li>
                <li id="reportsNavItem" style="display: none;">
                    <a href="#" onclick="showReports()" id="nav-reports">
                    <span class="nav-icon">📊</span>Reports</a></li>
                <li id="projectsNavItem" style="display: none;">
                    <a href="#" onclick="showProjects()" id="nav-projects">
                    <span class="nav-icon">🏗️</span>Projects</a></li>
                <li id="tasksNavItem" style="display: none;">
                    <a href="#" onclick="showTasks()" id="nav-tasks">
                    <span class="nav-icon">✅</span>My Tasks</a></li>
                <li id="paymentsNavItem" style="display: none;">
                    <a href="#" onclick="showPayments()" id="nav-payments">
                    <span class="nav-icon">💰</span>Payments</a></li>
                <li><a href="#" onclick="showActivities()" id="nav-activities">
                    <span class="nav-icon">📝</span>Activities</a></li>
                <li id="settingsNavItem" style="display: none;">
                <a href="#" onclick="showSettings()" id="nav-settings">
                <span class="nav-icon">⚙️</span>Settings</a></li>
                <li id="executiveMonitoringNavItem" style="display: none;">
                 <a href="#" onclick="showExecutiveDashboard()">
                    <span class="nav-icon">📊</span>Executive Dashboard</a>
                </li>
                
                <li id="timeRequestsNavItem" style="display: none;">
                    <a href="#" onclick="showCOOTimeRequests()" id="nav-time-requests">
                        <span class="nav-icon">⏰</span>Time Requests
                        <span class="notification-count" id="pendingRequestsBadge" style="display: none; margin-left: 10px; background: var(--warning); color: #856404; width: auto; height: auto; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; border: none;">0</span>
                    </a>
                </li>
                <li id="timesheetNavItem" style="display: none;">
                    <a href="#" onclick="showTimesheet()" id="nav-timesheet">
                        <span class="nav-icon">⏱️</span>My Timesheet
                    </a>
                </li>
            </ul>
        </nav>

            <main class="main-content" id="mainContent"></main>
        </div>
    </div>
    <div id="projectFilesModal" class="modal">
    <div class="modal-content large">
        <span class="close-button" onclick="closeModal('projectFilesModal')">&times;</span>
        <h3 id="projectFilesModalTitle">Project Files</h3>
        <p class="text-muted" id="projectFilesModalSubtitle">Files attached to this project.</p>
        <hr>

        <div id="projectFilesContent">
            <div class="loading-spinner"></div>
        </div>

        <div class="modal-actions" style="margin-top: 20px;">
            <button class="btn btn-secondary" onclick="closeModal('projectFilesModal')">Close</button>
        </div>
    </div>
</div>

    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js">
        function switchDesignerTab(tabName) {
            // Update tab buttons
            document.querySelectorAll('.doc-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Update content visibility
            document.getElementById('designer-drawings-content').style.display = 'none';
            document.getElementById('designer-specs-content').style.display = 'none';
            
            if (tabName === 'drawings') {
                document.getElementById('designer-drawings-content').style.display = 'block';
            } else {
                document.getElementById('designer-specs-content').style.display = 'block';
            }
        }

    </script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth-compat.js">
        function switchDesignerTab(tabName) {
            // Update tab buttons
            document.querySelectorAll('.doc-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Update content visibility
            document.getElementById('designer-drawings-content').style.display = 'none';
            document.getElementById('designer-specs-content').style.display = 'none';
            
            if (tabName === 'drawings') {
                document.getElementById('designer-drawings-content').style.display = 'block';
            } else {
                document.getElementById('designer-specs-content').style.display = 'block';
            }
        }

    </script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js">
        function switchDesignerTab(tabName) {
            // Update tab buttons
            document.querySelectorAll('.doc-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Update content visibility
            document.getElementById('designer-drawings-content').style.display = 'none';
            document.getElementById('designer-specs-content').style.display = 'none';
            
            if (tabName === 'drawings') {
                document.getElementById('designer-drawings-content').style.display = 'block';
            } else {
                document.getElementById('designer-specs-content').style.display = 'block';
            }
        }

    </script>
    <script>
      // ============================================
      // CACHE BUSTER - Version 1.0.3-final-20251125
      // ============================================
      console.log('🚀 EBTracker v1.0.3-final loaded at:', new Date().toISOString());
      console.log('💾 Script timestamp: 2025-11-25T18:40:00Z');
      
      const firebaseConfig = {
            apiKey: "AIzaSyAoRjQqAP-3QO9rjoQK7SSZ788lyMmhXmU",
            authDomain: "eb-tracker-42881.firebaseapp.com",
            projectId: "eb-tracker-42881",
            storageBucket: "eb-tracker-42881.firebasestorage.app",
            messagingSenderId: "922340749018",
            appId: "1:922340749018:web:68296d8775a79e71b2bfe3"
        };

        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const db = firebase.firestore();

        // ============================================
        // API & AUTH CONFIGURATION
        // ============================================

        // FIXED: Direct backend URL configuration
        const API_BASE = 'https://eb-tracker-backend.onrender.com';

        console.log('🔧 Backend URL configured:', API_BASE);

        const authorizedUsers = {
            estimator: ["estimator@edanbrook.com", "max@edanbrook.com"],
            coo: ["coo@edanbrook.com", "coo2@edanbrook.com"],
            director: ["director@edanbrook.com", "ajit@edanbrook.com"],
            design_lead: ["aravindhan.tech@edanbrook.in"],
            designer: [],
            accounts: ["accounts@edanbrook.com", "finance@edanbrook.com"],
            bdm: []
        };
        let currentUser = null;
        let currentUserRole = '';
        let authToken = '';

        // ============================================
        // DIRECT FUNCTION DEFINITIONS - NO WRAPPERS
        // ============================================
        // Define these functions DIRECTLY here so onclick can find them
        
        // Store references that will be set later
        let _assignDesignersFunc = null;
        let _viewBDMFilesFunc = null;
        let _viewProjectDetailsFunc = null;
        
        // Direct global functions - these MUST work
        window.assignDesigners = function(projectId) {
            console.log('👥 assignDesigners called with ID:', projectId);
            
            // Try to call the implementation
            if (_assignDesignersFunc) {
                return _assignDesignersFunc(projectId);
            }
            
            // Implementation not set yet, define it inline
            const modal = document.getElementById('designerAssignmentModal');
            if (!modal) {
                alert('Designer assignment modal not found. Please refresh the page.');
                return;
            }
            
            // Open the modal
            modal.style.display = 'flex';
            
            // Load designers
            apiCall('users?role=designer').then(response => {
                if (!response.success) {
                    alert('Failed to load designers');
                    return;
                }
                
                const designers = response.data || [];
                const designersList = document.getElementById('designersList');
                if (!designersList) return;
                
                designersList.innerHTML = '';
                designers.forEach(designer => {
                    const row = document.createElement('div');
                    row.className = 'designer-row';
                    row.style.cssText = 'display: grid; grid-template-columns: auto 1fr auto; gap: 1rem; align-items: center; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 8px; margin-bottom: 0.8rem; background: white;';
                    row.innerHTML = `
                        <div style="display: flex; align-items: center;">
                            <input type="checkbox" 
                                   id="designer-${designer.uid}" 
                                   value="${designer.uid}" 
                                   data-name="${designer.name}" 
                                   data-email="${designer.email}"
                                   onchange="window.toggleDesignerHoursInput(this)"
                                   style="width: 20px; height: 20px; cursor: pointer;">
                        </div>
                        <div>
                            <label for="designer-${designer.uid}" style="font-weight: 600; margin: 0; cursor: pointer;">
                                ${designer.name}
                            </label>
                            <div style="font-size: 0.85rem; color: #666;">
                                ${designer.email}
                            </div>
                        </div>
                        <div style="min-width: 150px;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <input type="number" 
                                       id="hours-${designer.uid}"
                                       class="form-control hours-input" 
                                       step="0.5" 
                                       min="0.5"
                                       value="0"
                                       placeholder="Hours"
                                       disabled
                                       onchange="window.updateTotalAllocated()"
                                       style="width: 80px; padding: 0.5rem; text-align: center;">
                                <span style="font-size: 0.9rem; color: #666;">hrs</span>
                            </div>
                        </div>
                    `;
                    designersList.appendChild(row);
                });
                
                document.getElementById('assignProjectId').value = projectId;
                
                // Initialize total
                window.updateTotalAllocated();
            }).catch(error => {
                console.error('Error loading designers:', error);
                alert('Failed to load designers: ' + error.message);
            });
        };
        
        // Helper function to toggle hours input
        window.toggleDesignerHoursInput = function(checkbox) {
            const designerId = checkbox.value;
            const hoursInput = document.getElementById(`hours-${designerId}`);
            
            if (checkbox.checked) {
                hoursInput.disabled = false;
                if (!hoursInput.value || hoursInput.value === '0') {
                    hoursInput.value = '1'; // Default to 1 hour
                }
            } else {
                hoursInput.disabled = true;
                hoursInput.value = '0';
            }
            
            window.updateTotalAllocated();
        };
        
        // Helper function to update total allocated hours
        window.updateTotalAllocated = function() {
            let total = 0;
            const hoursInputs = document.querySelectorAll('.hours-input:not([disabled])');
            hoursInputs.forEach(input => {
                const value = parseFloat(input.value) || 0;
                total += value;
            });
            
            const totalDisplay = document.getElementById('totalAllocatedHours');
            if (totalDisplay) {
                totalDisplay.textContent = total.toFixed(1);
            }
        };
        
        // Function to submit designer assignment
        window.submitDesignerAssignment = function() {
            console.log('📝 Submitting designer assignment');
            
            const projectId = document.getElementById('assignProjectId').value;
            const checkboxes = document.querySelectorAll('#designersList input[type="checkbox"]:checked');
            
            if (checkboxes.length === 0) {
                alert('Please select at least one designer');
                return;
            }
            
            const designerUids = [];
            const designerNames = [];
            const designerEmails = [];
            const designerHours = {};
            
            checkboxes.forEach(checkbox => {
                const uid = checkbox.value;
                const hoursInput = document.getElementById(`hours-${uid}`);
                const hours = parseFloat(hoursInput.value) || 0;
                
                if (hours < 0.5) {
                    alert(`Please allocate at least 0.5 hours for ${checkbox.dataset.name}`);
                    return;
                }
                
                designerUids.push(uid);
                designerNames.push(checkbox.dataset.name);
                designerEmails.push(checkbox.dataset.email);
                designerHours[uid] = hours;
            });
            
            // Submit to backend
            const payload = {
                projectId: projectId,
                designerUids: designerUids,
                designerNames: designerNames,
                designerEmails: designerEmails,
                designerHours: designerHours,
                action: 'assign_designers'
            };
            
            console.log('📤 Sending designer assignment:', payload);
            
            apiCall('projects', {
                method: 'POST',
                body: JSON.stringify(payload)
            }).then(response => {
                if (response.success) {
                    alert('Designers assigned successfully!');
                    window.closeDesignerAssignmentModal();
                    // Reload the page to show updated data
                    if (typeof showProjects === 'function') {
                        showProjects();
                    } else {
                        location.reload();
                    }
                } else {
                    alert('Failed to assign designers: ' + (response.message || 'Unknown error'));
                }
            }).catch(error => {
                console.error('Error assigning designers:', error);
                alert('Failed to assign designers: ' + error.message);
            });
        };
        
        // Function to close designer assignment modal
        window.closeDesignerAssignmentModal = function() {
            console.log('❌ Closing designer assignment modal');
            const modal = document.getElementById('designerAssignmentModal');
            if (modal) {
                modal.style.display = 'none';
            }
        };
        
        window.viewBDMFiles = function(projectId, proposalId) {
            console.log('📁 viewBDMFiles called with:', projectId, proposalId);
            
            if (_viewBDMFilesFunc) {
                return _viewBDMFilesFunc(projectId, proposalId);
            }
            
            // Inline implementation
            if (!proposalId) {
                // Try to get proposalId from project
                apiCall(`projects?id=${projectId}`).then(projResp => {
                    if (projResp.success && projResp.data && projResp.data.proposalId) {
                        window.viewBDMFiles(projectId, projResp.data.proposalId);
                    } else {
                        alert('Could not find proposal for this project');
                    }
                });
                return;
            }
            
            apiCall(`files?proposalId=${proposalId}`).then(response => {
                const files = response.success ? response.data : [];
                const bdmFiles = files.filter(f => f.fileType === 'project' || !f.fileType);
                
                const modal = document.getElementById('bdmFilesModal');
                if (!modal) {
                    alert('Files modal not found');
                    return;
                }
                
                const filesList = document.getElementById('bdmFilesList');
                if (filesList) {
                    filesList.innerHTML = '';
                    if (bdmFiles.length > 0) {
                        bdmFiles.forEach(file => {
                            const div = document.createElement('div');
                            div.style.cssText = 'padding: 10px; border: 1px solid #ddd; margin: 5px 0;';
                            div.innerHTML = `
                                <strong>${file.fileName || file.originalName}</strong><br>
                                <small>Uploaded: ${new Date(file.uploadedAt).toLocaleDateString()}</small><br>
                                <a href="${file.url || file.fileUrl}" target="_blank" class="btn btn-primary btn-sm">Download</a>
                            `;
                            filesList.appendChild(div);
                        });
                    } else {
                        filesList.innerHTML = '<p>No files uploaded by BDM</p>';
                    }
                }
                
                modal.style.display = 'flex';
            }).catch(error => {
                console.error('Error loading files:', error);
                alert('Failed to load files: ' + error.message);
            });
        };
        
        window.viewProject = function(projectId) {
            console.log('🔍 viewProject called with ID:', projectId);
            
            if (_viewProjectDetailsFunc) {
                return _viewProjectDetailsFunc(projectId);
            }
            
            // Inline implementation
            apiCall(`projects?id=${projectId}`).then(response => {
                if (!response.success || !response.data) {
                    alert('Failed to load project details');
                    return;
                }
                
                const project = response.data;
                
                // Create simple modal
                const existingModal = document.getElementById('projectDetailsModal');
                if (existingModal) existingModal.remove();
                
                const modal = document.createElement('div');
                modal.id = 'projectDetailsModal';
                modal.className = 'modal';
                modal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 10000;';
                modal.innerHTML = `
                    <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                        <h2>📋 Project Details</h2>
                        <p><strong>Project Name:</strong> ${project.projectName || 'N/A'}</p>
                        <p><strong>Client:</strong> ${project.clientCompany || 'N/A'}</p>
                        <p><strong>Project Code:</strong> ${project.projectCode || project.projectNumber || 'N/A'}</p>
                        <p><strong>Status:</strong> ${project.status || 'N/A'}</p>
                        <p><strong>Design Manager:</strong> ${project.designLeadName || 'N/A'}</p>
                        <p><strong>Target Date:</strong> ${project.targetCompletionDate || 'Not set'}</p>
                        <p><strong>Description:</strong> ${project.description || 'No description provided'}</p>
                        <p><strong>Special Instructions:</strong> ${project.specialInstructions || 'None'}</p>
                        <button onclick="document.getElementById('projectDetailsModal').remove()" class="btn btn-primary" style="margin-top: 20px;">Close</button>
                    </div>
                `;
                modal.onclick = (e) => {
                    if (e.target === modal) modal.remove();
                };
                document.body.appendChild(modal);
            }).catch(error => {
                console.error('Error loading project:', error);
                alert('Failed to load project details: ' + error.message);
            });
        };
        
        // Function to close BDM files modal
        window.closeBDMFilesModal = function() {
            console.log('❌ Closing BDM files modal');
            const modal = document.getElementById('bdmFilesModal');
            if (modal) {
                modal.style.display = 'none';
            }
        };
        
        console.log('✅ Direct function definitions loaded');

        // ============================================
        // UTILITY FUNCTIONS - SUCCESS/ERROR MODALS
        // ============================================
        
        function closeSuccessModal() {
            const modal = document.getElementById('successModal');
            if (modal) modal.style.display = 'none';
        }
        
        function showSuccessModal(message, details) {
            const modal = document.getElementById('successModal');
            if (modal) {
                document.getElementById('successMessage').textContent = message;
                document.getElementById('successDetails').textContent = details || '';
                modal.style.display = 'flex';
            }
        }

        // ============================================
        // CORE API & AUTH FUNCTIONS
        // ============================================

        async function apiCall(endpoint, options = {}, retryCount = 0) {
            const MAX_RETRIES = 2;
            const RETRY_DELAY = 2000;
            const url = `${API_BASE}/api/${endpoint}`;

            if (!authToken && currentUser && !endpoint.includes('health')) {
                try {
                    authToken = await currentUser.getIdToken(true);
                    console.log('🔑 Token refreshed for API call');
                } catch (error) {
                    console.error('❌ Failed to refresh token:', error);
                    throw new Error('Authentication token expired. Please log in again.');
                }
            }

            const defaultHeaders = {};
            if (authToken) {
                defaultHeaders['Authorization'] = `Bearer ${authToken}`;
            }
            if (!(options.body instanceof FormData)) {
                defaultHeaders['Content-Type'] = 'application/json';
            }

            const finalOptions = {
                method: options.method || 'GET',
                ...options,
                headers: { ...defaultHeaders, ...(options.headers || {}) },
                mode: 'cors',
                credentials: 'omit' // FIXED: Don't send credentials with origin: '*'
            };

            try {
                console.log(`📤 API Call [${finalOptions.method}]: ${url}`);
                const response = await fetch(url, finalOptions);
                console.log(`📥 Response: ${response.status} ${response.statusText}`);

                const contentType = response.headers.get('content-type');
                let responseData;

                if (contentType && contentType.includes('application/json')) {
                    const responseText = await response.text();
                    try {
                        responseData = responseText ? JSON.parse(responseText) : {};
                    } catch (parseError) {
                        console.error('❌ JSON parse error:', parseError);
                        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
                    }
                } else {
                    responseData = await response.text();
                }

                if (!response.ok) {
                    if (response.status === 401) {
                        console.error('❌ 401 Unauthorized - Token may be invalid');
                        if (currentUser && retryCount === 0) {
                            console.log('🔄 Attempting token refresh...');
                            try {
                                authToken = await currentUser.getIdToken(true);
                                console.log('✅ Token refreshed, retrying request...');
                                return await apiCall(endpoint, options, retryCount + 1);
                            } catch (refreshError) {
                                console.error('❌ Token refresh failed:', refreshError);
                                await auth.signOut();
                                throw new Error('Session expired. Please log in again.');
                            }
                        }
                        throw new Error('Authentication failed. Please log in again.');
                    }
                    const errorMessage = responseData.message || responseData.error || `Request failed with status ${response.status}`;
                    throw new Error(errorMessage);
                }

                console.log('✅ API call successful');
                
                // Handle different response formats
                // If backend returns { success: true, data: {...} }, use it directly
                // If backend returns data directly, wrap it
                if (responseData && typeof responseData === 'object') {
                    // If it has success/data structure, return as is
                    if ('success' in responseData && 'data' in responseData) {
                        return responseData;
                    }
                    // If it's raw data, wrap it
                    return { success: true, data: responseData };
                }
                
                // For non-object responses
                return { success: true, data: responseData };

            } catch (error) {
                console.error(`❌ API call to ${endpoint} failed:`, error);
                if ((error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) && retryCount < MAX_RETRIES) {
                    console.warn(`⚠️  Network error, retrying...`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                    return await apiCall(endpoint, options, retryCount + 1);
                }
                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    throw new Error(
                        `Cannot connect to backend at:\n${API_BASE}\n\n` +
                        `Please check backend URL, CORS, and network.`
                    );
                }
                throw error;
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 Application starting...');
            console.log('Backend URL:', API_BASE);
            setupEventListeners();
            testBackendConnection().then(connected => {
                if (!connected) {
                    console.error('⚠️ WARNING: Cannot connect to backend!');
                } else {
                    console.log('✅ Backend connection successful');
                }
            });

            auth.onAuthStateChanged(async (user) => {
                console.log('Auth state changed:', user ? 'User logged in' : 'No user');

                if (user) {
                    currentUser = user;
                    try {
                        console.log('Getting fresh auth token...');
                        authToken = await user.getIdToken(true);
                        console.log('Auth token obtained successfully');

                        console.log('Fetching user document from Firestore...');
                        const userDoc = await db.collection('users').doc(user.uid).get();

                        if (userDoc.exists) {
                            currentUserRole = userDoc.data().role;
                            console.log('User role:', currentUserRole);
                            showApp();
                        } else {
                            console.error('User document not found in Firestore');
                            await auth.signOut();
                            showMessage('Your user account was not found.', 'error');
                        }
                    } catch (error) {
                        console.error('Auth initialization error:', error);
                        showMessage('Failed to initialize session: ' + error.message, 'error');
                        await auth.signOut();
                    }
                } else {
                    currentUser = null;
                    currentUserRole = '';
                    authToken = '';
                    console.log('User logged out');
                    showLogin();
                }
            });
        });

        // Refresh token every 50 minutes
        setInterval(async () => {
            if (currentUser) {
                try {
                    authToken = await currentUser.getIdToken(true);
                    console.log('Auth token auto-refreshed');
                } catch (error) {
                    console.error('Token refresh failed:', error);
                }
            }
        }, 50 * 60 * 1000);

        function setupEventListeners() {
            document.querySelectorAll('.role-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    document.getElementById('selectedRole').value = this.dataset.role;
                });
            });
            document.getElementById('loginForm').addEventListener('submit', handleLogin);
            document.getElementById('registerForm').addEventListener('submit', handleRegister);
        }

        async function handleLogin(e) {
            e.preventDefault();
            try {
                clearMessages();
                showMessage('Logging in...', 'info');
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                console.log('Attempting login for:', email);
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                console.log('Login successful, user:', userCredential.user.uid);
                authToken = await userCredential.user.getIdToken(true);
                console.log('Fresh token obtained');
            } catch (error) {
                console.error('Login error:', error);
                showMessage(
                    error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
                        ? 'Invalid email or password.'
                        : 'Login failed: ' + error.message,
                    'error'
                );
            }
        }

        async function handleRegister(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value.toLowerCase();
            const password = document.getElementById('registerPassword').value;
            const role = document.getElementById('selectedRole').value;

            try {
                clearMessages();
                if (authorizedUsers[role] && authorizedUsers[role].length > 0 && !authorizedUsers[role].includes(email)) {
                    return showMessage(`Your email is not authorized for the ${role.replace('_', ' ').toUpperCase()} role.`, 'error');
                }
                showMessage('Creating account...', 'info');
                const cred = await auth.createUserWithEmailAndPassword(email, password);
                await cred.user.updateProfile({ displayName: name });
                await db.collection('users').doc(cred.user.uid).set({
                    name, email, role, status: 'active',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                showMessage('Account created! Please log in.', 'success');
                showTab('login');
            } catch (error) {
                showMessage(error.code.includes('in-use') ? 'An account with this email already exists.' : 'Registration failed.', 'error');
            }
        }

        async function logout() {
            await auth.signOut();
        }

       function showApp() {
    // Use a small timeout to ensure DOM elements are ready
    setTimeout(() => {
        console.log('--- showApp() EXECUTING ---');
        try {
            const loginPage = document.getElementById('loginPage');
            const appContainer = document.getElementById('appContainer');
            const userWelcome = document.getElementById('userWelcome');
            const userRoleDisplay = document.getElementById('userRole');

            if (!loginPage || !appContainer || !userWelcome || !userRoleDisplay) {
                console.error("Core UI elements missing! Retrying...");
                // Simple retry mechanism
                if (!showApp.retried) {
                    showApp.retried = true;
                    setTimeout(showApp, 100);
                    return;
                }
                throw new Error("Critical UI elements not found after retry.");
            }

            // 1. Update User Info
            const roleForCheck = (currentUserRole || '').trim().toLowerCase();
            userWelcome.textContent = `Welcome back, ${currentUser.displayName || currentUser.email}`;
            userRoleDisplay.textContent = roleForCheck.replace('_', ' ').toUpperCase();

            // 2. Switch Views
            loginPage.style.display = 'none';
            appContainer.style.display = 'block';

            // 3. Set Nav Visibility based on Role
            const setDisplay = (id, visible) => {
                const el = document.getElementById(id);
                if (el) el.style.display = visible ? 'block' : 'none';
            };

            // --- Role Checks ---
            const isDesigner = roleForCheck === 'designer';
            const isManagement = ['coo', 'director'].includes(roleForCheck);
            const isBDM = roleForCheck === 'bdm';

            // --- Menu Visibility ---
            setDisplay('newProposalNavItem', isBDM);
            setDisplay('analyticsNavItem', isBDM || isManagement);
            setDisplay('workflowNavItem', ['estimator', 'coo'].includes(roleForCheck));
            setDisplay('settingsNavItem', roleForCheck === 'director');
            
            // Designer Specifics: Hide Dashboard & Proposals, Show specific tools
            setDisplay('dashboardNavItem', false); // Dashboard hidden for all users // Hide for Designer & Mgmt (Mgmt has Executive Dash)
            setDisplay('proposalsNavItem', !isDesigner); // HIDE All Proposals for Designer
            setDisplay('filesNavItem', !isDesigner && !isManagement);
            
            // Designer specific menus
            setDisplay('projectsNavItem', isManagement); // Designers use "My Tasks" or "Allocations"
            setDisplay('tasksNavItem', isDesigner);
            setDisplay('timesheetNavItem', isDesigner);
            setDisplay('designerAllocationsNavItem', isDesigner); // SHOW New Menu

            setDisplay('paymentsNavItem', ['accounts', 'coo', 'director', 'bdm'].includes(roleForCheck));
            setDisplay('executiveMonitoringNavItem', isManagement); // Executive Dashboard ENABLED for COO & Director
            setDisplay('timeRequestsNavItem', isManagement);

            

            // 4. Update Badges (if applicable)
            if (['coo', 'director'].includes(roleForCheck)) {
                updatePendingRequestsBadge();
            }

            // 5. Route to Initial View
            if (isDesigner) {
                showDesignerAllocations(); // Redirect Designer to new view immediately
            } else if (isBDM || isManagement) {
                showProposals();
            } else {
                showProposals();
            }

            // 6. Load Notifications
            loadNotifications();

        } catch (error) {
            console.error("Error in showApp:", error);
            alert("An error occurred while loading the application. Please refresh.");
        } finally {
            // ALWAYS hide loading spinner at the end
            hideLoading();
        }
    }, 50);
}
// Initialize retry flag
showApp.retried = false;

           
        function showLogin() {
            document.getElementById('appContainer').style.display = 'none';
            document.getElementById('loginPage').style.display = 'flex';
            clearMessages();
        }

        function showTab(tab) {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelector(`[onclick="showTab('${tab}')"]`).classList.add('active');
            document.querySelectorAll('.auth-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${tab}Content`).classList.add('active');
            clearMessages();
        }

        function setActiveNav(navId) {
            document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
            document.getElementById(navId)?.classList.add('active');
        }

        // ============================================
        // HELPER FUNCTIONS
        // ============================================

        function showLoading() { document.getElementById('loadingSpinner').style.display = 'flex'; }
        function hideLoading() { document.getElementById('loadingSpinner').style.display = 'none'; }
        function showMessage(message, type = 'info') {
            const c = document.getElementById('authMessages');
            if(c) c.innerHTML = `<div class="${type}-message">${message}</div>`;
        }
        function clearMessages() {
            const c = document.getElementById('authMessages');
            if(c) c.innerHTML = '';
        }
        // ================================================================
// UNIFIED MODAL HANDLING (Replaces existing openModal/closeModal)
// ================================================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error('Modal not found:', modalId);
        return;
    }
    // Support both old .modal and new .modal-overlay styles
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

// Robust close function that handles specific IDs OR closes all if no ID provided
function closeModal(modalId) {
    if (modalId) {
        // Case 1: Close specific modal by ID
        const modal = document.getElementById(modalId);
        if (modal) closeSingleModal(modal);
    } else {
        // Case 2: No ID provided (common in dynamic forms), close EVERYTHING currently open
        document.querySelectorAll('.modal.show, .modal-overlay, .modal[style*="display: flex"], .modal[style*="display: block"]').forEach(modal => {
             closeSingleModal(modal);
        });
    }
    // Ensure body scroll is restored
    if (document.querySelectorAll('.modal.show, .modal-overlay').length === 0) {
        document.body.classList.remove('modal-open');
    }
}

// Helper to safely close and optionally remove dynamic modals
function closeSingleModal(modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    
    // IMPORTANT: If it's a dynamic overlay (added via JS), remove it from DOM to prevent duplicates
    if (modal.classList.contains('modal-overlay') || modal.parentElement === document.body) {
        // Wait a tiny bit for any animations to finish if you have them, otherwise remove immediately
        setTimeout(() => modal.remove(), 100);
    }
}

// Global ESC key handler
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal(); // Close everything on Escape
    }
});

// Global outside click handler for ALL modal types
window.addEventListener('click', function(event) {
    // Check if clicked element IS the overlay/background itself
    if (event.target.classList.contains('modal') || event.target.classList.contains('modal-overlay')) {
        closeSingleModal(event.target);
    }
});
        function formatDate(ts) {
            // Handles Firebase timestamp objects OR ISO strings
            if (!ts) return 'N/A';
            let date;

            // --- FIX: Check for _seconds OR seconds ---
            if (ts.seconds || ts._seconds) { // Firebase Timestamp
                 const seconds = ts.seconds || ts._seconds;
                 date = new Date(seconds * 1000);
             } else if (typeof ts === 'string' && ts.includes('-')) { // ISO String check
                 date = new Date(ts);
             } else {
                 return 'Invalid Date'; // Handle other cases or return N/A
             }
            
            if (isNaN(date.getTime())) {
                return 'Invalid Date'; // Check if date is valid
            }

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        function formatFileSize(bytes) {
            if (!bytes) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i), 2) + ' ' + sizes[i];
        }

        // ADDED FROM PROMPT
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type} show`;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
   // ENSURE THIS FUNCTION IS PRESENT (Fixes Email Triggering)
// ================================================================
async function triggerEmailNotification(eventName, data = {}) {
    console.log(`📧 Triggering email for: ${eventName}`, data);
    try {
        // Safety check for createdBy if missing
        if (!data.createdBy && currentUser) {
             data.createdBy = currentUser.displayName || currentUser.email || 'System User';
        }

        const response = await apiCall('email/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: eventName,
                data: data
            })
        });

        if (response.success) {
            console.log(`✅ Email for [${eventName}] queued successfully.`);
        } else {
            console.warn(`⚠️ Email queue failed for [${eventName}]:`, response.error);
        }
    } catch (error) {
        // Just log it, don't stop the app flow
        console.error(`❌ Failed to send email for [${eventName}]:`, error.message);
    }
}

        // ============================================
        // DASHBOARD
        // ============================================

        async function showProposals() {
            setActiveNav('nav-dashboard');
            const main = document.getElementById('mainContent');
            main.style.display = 'block';
            showLoading();
            try {
                console.log('📊 Loading dashboard...');
                const response = await apiCall('dashboard');
                console.log('📊 Dashboard response:', response);
                console.log('📊 Response.data:', response.data);
                console.log('📊 Response.success:', response.success);
                
                // Handle different response formats
                let dashboardData = null;
                if (response.success && response.data) {
                    dashboardData = response.data;
                } else if (response.data) {
                    // Backend might return data without success wrapper
                    dashboardData = response.data;
                } else if (response.success) {
                    // Data might be in root level
                    dashboardData = response;
                } else {
                    // Fallback - use response itself
                    dashboardData = response;
                }
                
                console.log('📊 Final dashboard data:', dashboardData);
                
                if (dashboardData && Object.keys(dashboardData).length > 0) {
                    renderDashboard(dashboardData);
                } else {
                    throw new Error('No dashboard data received. Response: ' + JSON.stringify(response));
                }
            } catch (error) {
                console.error('❌ Dashboard error:', error);
                main.innerHTML = `
                    <div class="error-message">
                        <h3>⚠️ Dashboard Error</h3>
                        <p>${error.message}</p>
                        <button onclick="showProposals()" class="btn btn-primary">Retry</button>
                        <button onclick="runDiagnostics()" class="btn btn-outline">Run Diagnostics</button>
                    </div>
                `;
            } finally {
                hideLoading();
            }
        }

        function renderDashboard(data) {
            console.log('🎨 Rendering dashboard with data:', data);
            
            // Handle different data formats
            let stats = data.stats || data; // Backend might return stats directly or wrapped
            
            // Convert stats object to display format
            const statsHtml = stats ? Object.entries(stats)
                .filter(([k, v]) => typeof v === 'number') // Only show numeric values
                .map(([k, v]) => `
                    <div class="stat-card">
                        <div class="stat-number">${v}</div>
                        <div class="stat-label">${k.charAt(0).toUpperCase() + k.slice(1)}</div>
                    </div>
                `).join('') : '<div class="stat-card"><div class="stat-number">0</div><div class="stat-label">No Data</div></div>';

            let actionsHtml = '';
            if (data.actionItems?.length) {
                const badges = currentUserRole === 'estimator' ? ['Upload BOQ', 'Enter Manhours'] :
                                 currentUserRole === 'coo' ? ['Full Edit Access', 'Download Reports'] :
                                 currentUserRole === 'director' ? ['Override Access', 'Strategic Reports'] :
                                 currentUserRole === 'bdm' ? ['Upload Files'] : [];

                const badgesHtml = badges.map(badge => `<span class="action-badge">${badge}</span>`).join('');

                actionsHtml = `
                    <h3>Your Action Items</h3>
                    <div class="action-badges">${badgesHtml}</div>
                    ${data.actionItems.map(item => `
                        <div class="action-item">
                            <div class="action-content">
                                <strong>${item.projectName}</strong>
                                <div class="action-meta">Client: ${item.clientCompany} | Status: ${item.status.replace(/_/g, ' ')}</div>
                            </div>
                            <div class="action-buttons">
                                ${getActionButtons(item, currentUserRole)}
                            </div>
                        </div>
                    `).join('')}
                `;
            } else {
                actionsHtml = `
                    <h3>Action Items</h3>
                    <p>No pending action items. All caught up! 🎉</p>
                `;
            }

            let executiveHtml = '';
            if (currentUserRole === 'director' && data.executiveOverview) {
                executiveHtml = `
                    <div class="executive-overview">
                        <h3>Executive Overview - Project Status Summary</h3>
                        <div class="executive-stats">
                            ${Object.entries(data.executiveOverview).map(([k, v]) => `
                                <div class="exec-stat-card">
                                    <div class="exec-stat-number">${v}</div>
                                    <div class="exec-stat-label">${k}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            const activitiesHtml = data.recentActivities?.length ? `
                <div class="action-section">
                    <h3>Recent Activities</h3>
                    ${data.recentActivities.map(act => `
                        <div class="action-item">
                            <div class="action-content">
                                <strong>${act.details}</strong>
                                <div class="action-meta">By ${act.performedByName} (${act.performedByRole}) - ${formatDate(act.timestamp)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '';

            document.getElementById('mainContent').innerHTML = `
                <div class="page-header">
                    <h2>Dashboard</h2>
                    <div class="subtitle">✅ Workflow: DRAFT → ESTIMATED → PRICED → APPROVED/REJECTED → SUBMITTED → WON/LOST</div>
                </div>
                <div class="dashboard-stats">${statsHtml}</div>
                ${executiveHtml}
                <div class="action-section">${actionsHtml}</div>
                ${activitiesHtml}
            `;
        }

        function getActionButtons(item, role) {
            let actionBtn = '';
            switch(item.type) {
                case 'estimation_required':
                    if (role === 'estimator')
                        actionBtn = `<button class="btn btn-primary btn-sm" onclick="showEstimationModal('${item.proposalId}')">ENTER MANHOURS</button>`;
                    break;
                case 'pricing_required':
                    if (role === 'coo')
                        // MODIFIED: Use new pricing form
                        actionBtn = `<button class="btn btn-primary btn-sm" onclick="showCOOPricingForm('${item.proposalId}')">SET PRICING</button>`;
                    break;
                case 'approval_required':
                    if (role === 'director')
                        actionBtn = `<button class="btn btn-primary btn-sm" onclick="viewProposal('${item.proposalId}')">EXECUTIVE REVIEW</button>`;
                    break;
                case 'ready_for_client':
                     if (role === 'bdm')
                        actionBtn = `<button class="btn btn-success btn-sm" onclick="submitToClient('${item.proposalId}')">SUBMIT TO CLIENT</button>`;
                     break;
                case 'client_decision_pending':
                     if (role === 'bdm')
                        actionBtn = `
                            <button class="btn btn-success btn-sm" onclick="markProposalWon('${item.proposalId}')">✅ WON</button>
                            <button class="btn btn-danger btn-sm" onclick="markProposalLost('${item.proposalId}')">❌ LOST</button>
                        `;
                     break;
                case 'project_allocation':
                    // ** UPDATED to use new function name **
                    if (role === 'coo' || role === 'director')
                        // MODIFIED: Use new allocation modal
                        actionBtn = `<button class="btn btn-primary btn-sm" onclick="showProjectAllocationModal('${item.proposalId}')">ALLOCATE PROJECT</button>`;
                    break;
                case 'task_assignment':
                    // This is for DESIGN LEAD to assign DESIGNERS
                    if (role === 'design_lead')
                        actionBtn = `<button class="btn btn-primary btn-sm" onclick="assignDesigners('${item.projectId}')">ASSIGN DESIGNERS</button>`;
                    break;
                case 'invoice_required':
                    if (role === 'accounts')
                        actionBtn = `<button class="btn btn-primary btn-sm" onclick="showCreateInvoiceModal('${item.projectId}')">CREATE INVOICE</button>`;
                    break;
                case 'follow_up_required':
                    if (role === 'bdm' || role === 'accounts')
                        actionBtn = `<button class="btn btn-warning btn-sm" onclick="viewPayment('${item.paymentId}')">FOLLOW UP</button>`;
                    break;
            }
            const viewId = item.proposalId || item.projectId;
            // Use viewProposal for proposal items, viewProject for project items
            const viewFn = item.proposalId ? 'viewProposal' : 'viewProject';
            const viewButton = viewId ? `<button class="btn btn-outline btn-sm" onclick="${viewFn}('${viewId}')">VIEW</button>` : '';
            return `${actionBtn} ${viewButton}`;
        }

        // ============================================
        // PROPOSALS (BDM, Estimator, COO, Director)
        // ============================================

        async function showProposals() {
            setActiveNav('nav-proposals');
            const main = document.getElementById('mainContent');
            main.style.display = 'block';
            showLoading();
            main.innerHTML = '';

            try {
                console.log('🔄 Fetching proposals...');
                const response = await apiCall('proposals');
                console.log('📋 Proposals response:', response);
                console.log('📋 Proposals data:', response.data);
                console.log('📋 Response.success:', response.success);
                console.log('📋 Number of proposals:', response.data?.length);
                
                // Handle different response formats
                let proposalsData = null;
                if (response.success && response.data) {
                    proposalsData = response.data;
                } else if (Array.isArray(response.data)) {
                    proposalsData = response.data;
                } else if (Array.isArray(response)) {
                    proposalsData = response;
                } else {
                    proposalsData = [];
                }
                
                console.log('📋 Final proposals data:', proposalsData, 'Length:', proposalsData.length);
                
                if (proposalsData && Array.isArray(proposalsData)) {
                    renderProposals(proposalsData);
                } else {
                    throw new Error('Invalid proposals response format. Response: ' + JSON.stringify(response));
                }
            } catch (error) {
                console.error('❌ Error fetching proposals:', error);
                main.innerHTML = `<div class="error-message"><h3>Error Loading Proposals</h3><p>${error.message}</p></div>`;
            } finally {
                hideLoading();
            }
        }

        let currentProposalFilter = 'all'; // Add this global variable at the top of your script

function renderProposals(proposals) {
    const createButton = currentUserRole === 'bdm' ? `
        <button onclick="showCreateProposalModal()" class="btn btn-primary" style="margin-bottom: 2rem; width: auto;">
            Create New Proposal
        </button>
    ` : '';

    // Calculate counts for Director filters
    const pendingApprovalCount = proposals.filter(p => {
        const statusLower = (p.status || '').toLowerCase().replace(/\s+/g, '_');
        return statusLower === 'pending_approval' || 
               statusLower === 'pricing_complete' || 
               (p.pricing && p.pricing.projectNumber && statusLower !== 'approved' && statusLower !== 'rejected' && statusLower !== 'won' && statusLower !== 'lost');
    }).length;

    const pendingPricingCount = proposals.filter(p => {
        const statusLower = (p.status || '').toLowerCase().replace(/\s+/g, '_');
        return (statusLower === 'estimated' || p.estimation) && (!p.pricing || !p.pricing.projectNumber);
    }).length;

    const pendingEstimationCount = proposals.filter(p => {
        const statusLower = (p.status || '').toLowerCase().replace(/\s+/g, '_');
        return (statusLower === 'draft' || statusLower === 'pending_estimation' || !p.estimation) && 
               statusLower !== 'approved' && 
               statusLower !== 'rejected' && 
               statusLower !== 'won' && 
               statusLower !== 'lost';
    }).length;

    // Filter Buttons for Director AND COO
    let directorFilterButtons = '';
    if (currentUserRole === 'director' || currentUserRole === 'coo') {
        // Calculate pending allocation count for COO - ONLY unallocated projects
        const pendingAllocationCount = proposals.filter(p => 
            p.status === 'won' && 
            p.pricing && 
            p.pricing.projectNumber && 
            !p.projectCreated  // Not allocated at all
        ).length;
        
        // Calculate partially allocated count - projects that exist but need more hours allocated
        const partiallyAllocatedCount = proposals.filter(p => {
            if (p.status !== 'won' || !p.projectCreated) return false;
            const maxHours = parseFloat(p.maxAllocatedHours) || 0;
            const totalAllocated = parseFloat(p.totalAllocatedHours) || 0;
            return maxHours > 0 && totalAllocated > 0 && totalAllocated < maxHours;
        }).length;
        
        directorFilterButtons = `
            <div class="filter-buttons-container">
                <button class="filter-btn filter-btn-all ${currentProposalFilter === 'all' ? 'active' : ''}" 
                        onclick="filterProposals('all')">
                    📋 All Proposals
                    <span class="filter-count">${proposals.length}</span>
                </button>
                <button class="filter-btn filter-btn-approval ${currentProposalFilter === 'pending_approval' ? 'active' : ''}" 
                        onclick="filterProposals('pending_approval')">
                    ⏰ Pending Approval
                    <span class="filter-count">${pendingApprovalCount}</span>
                </button>
                <button class="filter-btn filter-btn-pricing ${currentProposalFilter === 'pending_pricing' ? 'active' : ''}" 
                        onclick="filterProposals('pending_pricing')">
                    💰 Pending Pricing
                    <span class="filter-count">${pendingPricingCount}</span>
                </button>
                <button class="filter-btn filter-btn-estimation ${currentProposalFilter === 'pending_estimation' ? 'active' : ''}" 
                        onclick="filterProposals('pending_estimation')">
                    📊 Pending Estimation
                    <span class="filter-count">${pendingEstimationCount}</span>
                </button>
                ${currentUserRole === 'coo' ? `
                <button class="filter-btn filter-btn-pending ${currentProposalFilter === 'pending_allocation' ? 'active' : ''}" 
                        onclick="filterProposals('pending_allocation')">
                    🎯 Pending Allocation
                    <span class="filter-count">${pendingAllocationCount}</span>
                </button>
                ${partiallyAllocatedCount > 0 ? `
                <button class="filter-btn filter-btn-warning ${currentProposalFilter === 'partially_allocated' ? 'active' : ''}" 
                        onclick="filterProposals('partially_allocated')"
                        style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                    ⏳ Partially Allocated
                    <span class="filter-count">${partiallyAllocatedCount}</span>
                </button>
                ` : ''}
                ` : ''}
            </div>
        `;
    }

    // Filter proposals based on current filter (WORKS FOR BOTH DIRECTOR AND COO NOW)
    let filteredProposals = proposals;
    if ((currentUserRole === 'director' || currentUserRole === 'coo') && currentProposalFilter !== 'all') {
        console.log('🔍 Applying filter:', currentProposalFilter);
        console.log('📊 Total proposals before filter:', proposals.length);
        
        if (currentProposalFilter === 'pending_approval') {
            filteredProposals = proposals.filter(p => {
                const statusLower = (p.status || '').toLowerCase().replace(/\s+/g, '_');
                return statusLower === 'pending_approval' || 
                       statusLower === 'pricing_complete' || 
                       (p.pricing && p.pricing.projectNumber && statusLower !== 'approved' && statusLower !== 'rejected' && statusLower !== 'won' && statusLower !== 'lost');
            });
        } else if (currentProposalFilter === 'pending_pricing') {
            filteredProposals = proposals.filter(p => {
                const statusLower = (p.status || '').toLowerCase().replace(/\s+/g, '_');
                return (statusLower === 'estimated' || p.estimation) && (!p.pricing || !p.pricing.projectNumber);
            });
        } else if (currentProposalFilter === 'pending_estimation') {
            filteredProposals = proposals.filter(p => {
                const statusLower = (p.status || '').toLowerCase().replace(/\s+/g, '_');
                return (statusLower === 'draft' || statusLower === 'pending_estimation' || !p.estimation) && 
                       statusLower !== 'approved' && 
                       statusLower !== 'rejected' && 
                       statusLower !== 'won' && 
                       statusLower !== 'lost';
            });
        } else if (currentProposalFilter === 'pending_allocation') {
            // COO-specific filter for won proposals needing INITIAL allocation (not created yet)
            filteredProposals = proposals.filter(p => 
                p.status === 'won' && 
                p.pricing && 
                p.pricing.projectNumber && 
                !p.projectCreated  // Project not created = needs initial allocation
            );
        } else if (currentProposalFilter === 'partially_allocated') {
            // COO-specific filter for projects that are partially allocated
            filteredProposals = proposals.filter(p => {
                if (p.status !== 'won' || !p.projectCreated) return false;
                const maxHours = parseFloat(p.maxAllocatedHours) || 0;
                const totalAllocated = parseFloat(p.totalAllocatedHours) || 0;
                return maxHours > 0 && totalAllocated > 0 && totalAllocated < maxHours;
            });
        }
        
        console.log('📊 Filtered proposals:', filteredProposals.length);
    }

    const approvedProposals = filteredProposals.filter(p => p.status === 'approved');
    const submittedProposals = filteredProposals.filter(p => p.status === 'submitted_to_client');
    const wonProposals = filteredProposals.filter(p => p.status === 'won');
    const otherProposals = filteredProposals.filter(p => !['approved', 'submitted_to_client', 'won'].includes(p.status));

    let approvedSection = '';
    if (currentUserRole === 'bdm' && approvedProposals.length > 0) {
        approvedSection = `
            <div class="action-section" style="margin-bottom: 2rem; background: #E8F5E9;">
                <h3>✅ APPROVED Proposals - Ready for Client Submission</h3>
                ${approvedProposals.map(p => `
                    <div class="action-item" style="background: white;">
                        <div class="action-content">
                            <strong>${p.projectName}</strong>
                            <div class="action-meta">Client: ${p.clientCompany} | Approved: ${formatDate(p.directorApproval?.approvedAt || p.createdAt)}</div>
                        </div>
                        <span class="proposal-status status-approved">APPROVED</span>
                        <div class="action-buttons">
                            <button onclick="submitToClient('${p.id}')" class="btn btn-primary btn-sm">📧 SUBMIT</button>
                            <button onclick="markProposalWon('${p.id}')" class="btn btn-success btn-sm">✅ WON</button>
                            <button onclick="markProposalLost('${p.id}')" class="btn btn-danger btn-sm">❌ LOST</button>
                            <button onclick="viewProposal('${p.id}')" class="btn btn-outline btn-sm">View</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    let submittedSection = '';
    if (currentUserRole === 'bdm' && submittedProposals.length > 0) {
        submittedSection = `
            <div class="action-section" style="margin-bottom: 2rem; background: #E3F2FD;">
                <h3>📧 SUBMITTED Proposals - Awaiting Client Decision</h3>
                ${submittedProposals.map(p => `
                    <div class="action-item" style="background: white;">
                        <div class="action-content">
                            <strong>${p.projectName}</strong>
                            <div class="action-meta">Client: ${p.clientCompany} | Submitted: ${formatDate(p.updatedAt)}</div>
                        </div>
                        <span class="proposal-status status-submitted">SUBMITTED</span>
                        <div class="action-buttons">
                            <button onclick="markProposalWon('${p.id}')" class="btn btn-success btn-sm">✅ WON</button>
                            <button onclick="markProposalLost('${p.id}')" class="btn btn-danger btn-sm">❌ LOST</button>
                            <button onclick="viewProposal('${p.id}')" class="btn btn-outline btn-sm">View</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    let wonSection = '';
    if (wonProposals.length > 0) {
        wonSection = `
            <div class="action-section" style="margin-bottom: 2rem; background: #D5F4E6;">
                <h3>🏆 WON Proposals</h3>
                ${wonProposals.map(p => {
                    let allocationInfo = '';
                    let allocationButton = '';
                    
                    // Calculate allocation status
                    const maxHours = parseFloat(p.maxAllocatedHours) || 0;
                    const totalAllocated = parseFloat(p.totalAllocatedHours) || 0;
                    const remainingToAllocate = maxHours - totalAllocated;
                    
                    // Determine status
                    // 1. Fully Allocated
                    const isFullyAllocated = p.projectCreated && maxHours > 0 && totalAllocated >= maxHours;
                    // 2. Partially Allocated
                    const isPartiallyAllocated = p.projectCreated && maxHours > 0 && totalAllocated > 0 && totalAllocated < maxHours;
                    // 3. Pending (New Won)
                    const isPendingAllocation = !p.projectCreated || (maxHours === 0 && totalAllocated === 0);

                    if (isFullyAllocated) {
                        // GREEN: Fully Allocated
                        allocationInfo = '<span class="proposal-status status-allocated" style="background: #a7f3d0; color: #064e3b;">✅ Fully Allocated</span>';
                        if (currentUserRole === 'coo' || currentUserRole === 'director') {
                            // Show "View Project" in outline/green, no allocate button
                            allocationButton = `<button onclick="viewProject('${p.projectId}')" class="btn btn-outline btn-sm" style="border-color: #059669; color: #059669;">📂 View Project</button>`;
                        }
                    } 
                    else if (isPartiallyAllocated) {
                        // YELLOW/ORANGE: Partially Allocated
                        allocationInfo = `<span class="proposal-status" style="background: #fef3c7; color: #b45309; border: 1px solid #f59e0b;">⏳ Partial (${totalAllocated}/${maxHours}h)</span>`;
                        if (currentUserRole === 'coo' || currentUserRole === 'director') {
                            // Show "Continue Allocation" in Orange/Yellow
                            allocationButton = `
                                <button onclick="showProjectAllocationModal('${p.id}')" class="btn btn-warning btn-sm" style="color: white; font-weight:600;">
                                    ⚠️ Continue Alloc. (${remainingToAllocate}h left)
                                </button>
                            `;
                        }
                    } 
                    else if (p.pricing && p.pricing.projectNumber) {
                        // BLUE: Pending Allocation
                        allocationInfo = '<span class="proposal-status status-pending" style="background: #dbeafe; color: #1e40af;">🎯 Pending Allocation</span>';
                        if (currentUserRole === 'coo') {
                            // Show "Allocate" in Primary Blue
                            allocationButton = `<button onclick="showProjectAllocationModal('${p.id}')" class="btn btn-primary btn-sm">🎯 Allocate Project</button>`;
                        }
                    } else {
                        allocationInfo = '<span class="proposal-status status-pending" style="background: #fecaca; color: #991b1b;">⏳ Pending Pricing</span>';
                    }
                    
                    return `
                    <div class="action-item" style="background: white;">
                        <div class="action-content">
                            <strong>${p.projectName}</strong>
                            <div class="action-meta">
                                Client: ${p.clientCompany} |
                                Won: ${formatDate(p.wonDate)} |
                                ${p.pricing && p.pricing.projectNumber ? `Project #: ${p.pricing.projectNumber}` : 'No Project Number'}
                                ${maxHours > 0 ? ` | Budget: ${maxHours}h` : ''}
                            </div>
                        </div>
                        <div style="text-align:right;">
                            ${allocationInfo}
                        </div>
                        <div class="action-buttons" style="margin-left: 1rem;">
                            ${allocationButton}
                            <button onclick="viewProposal('${p.id}')" class="btn btn-outline btn-sm">View</button>
                        </div>
                    </div>
                `}).join('')}
            </div>
        `;
    }

    const proposalsHtml = otherProposals?.length ? otherProposals.map(p => {
        let statusDisplay = p.status.toUpperCase().replace(/_/g, ' ');
        let statusClass = p.status.toLowerCase().replace(/_/g, '-');
        
        if (p.pricing && p.pricing.projectNumber && p.status === 'pricing_complete') {
            statusDisplay = 'PRICING COMPLETE';
            statusClass = 'pricing-complete';
        } else if (p.status === 'estimated' && p.pricing && p.pricing.projectNumber) {
            statusDisplay = 'PRICING COMPLETE';
            statusClass = 'pricing-complete';
        }
        
        let actionButtons = '';
        const statusLower = (p.status || '').toLowerCase().replace(/\s+/g, '_');
        
        if (currentUserRole === 'estimator' && (statusLower === 'draft' || statusLower === 'pending_estimation' || !p.estimation)) {
            actionButtons += `<button class="btn btn-primary btn-sm" onclick="showEstimationModal('${p.id}')">Add Estimation</button> `;
        }
        
        if (currentUserRole === 'coo' && (statusLower === 'estimated' || p.estimation) && (!p.pricing || !p.pricing.projectNumber)) {
            actionButtons += `<button class="btn btn-success btn-sm" onclick="showCOOPricingForm('${p.id}')">Set Pricing</button> `;
        }
        
        if (currentUserRole === 'director' && (statusLower === 'pending_approval' || statusLower === 'pricing_complete' || (p.pricing && p.pricing.projectNumber && statusLower !== 'approved' && statusLower !== 'rejected'))) {
            actionButtons += `
                <button class="btn btn-success btn-sm" onclick="showApproveModal('${p.id}')">✅ Approve</button>
                <button class="btn btn-danger btn-sm" onclick="showRejectModal('${p.id}')">❌ Reject</button>
            `;
        }
        
        if ((currentUserRole === 'coo' || currentUserRole === 'director') && p.pricing && p.pricing.projectNumber) {
            actionButtons += getProposalAllocationButton(p);
        }
        
        return `
        <div class="action-item">
            <div class="action-content">
                <strong>${p.projectName}</strong>
                <div class="action-meta">Client: ${p.clientCompany} | Created: ${formatDate(p.createdAt)}</div>
            </div>
            <span class="proposal-status status-${statusClass}">${statusDisplay}</span>
            <div class="action-buttons">
                ${actionButtons}
                <button onclick="viewProposal('${p.id}')" class="btn btn-outline btn-sm">View Details</button>
            </div>
        </div>
    `}).join('') : '<p>No proposals found for this filter.</p>';

    const filterInfo = currentUserRole === 'director' && currentProposalFilter !== 'all' ? 
        `<div class="subtitle" style="color: var(--primary-blue); font-weight: 600;">Filtered: ${currentProposalFilter.replace(/_/g, ' ').toUpperCase()}</div>` : 
        `<div class="subtitle">Workflow: DRAFT → ESTIMATED → PRICED → APPROVED/REJECTED → SUBMITTED → WON/LOST</div>`;

    document.getElementById('mainContent').innerHTML = `
        <div class="page-header">
            <h2>All Proposals</h2>
            ${filterInfo}
        </div>
        ${createButton}
        ${directorFilterButtons}
        ${approvedSection}
        ${submittedSection}
        ${wonSection}
        <div class="action-section">
            <h3>${currentUserRole === 'director' && currentProposalFilter !== 'all' ? 'Filtered Results' : 'All Other Proposals'}</h3>
            ${proposalsHtml}
        </div>
    `;
}

// ============================================
// FILTER PROPOSALS FUNCTION
// ============================================
function filterProposals(filterType) {
    console.log('🔍 Filtering proposals by:', filterType);
    currentProposalFilter = filterType;
    showProposals(); // This will re-render with the new filter
}
        let currentFilter = 'all';  // For COO filter buttons
         let currentProjectFilter = 'all';
        let allProjectsData = [];
        let allVariationsData = []; // <-- NEW: Add this line

/**
 * Renders the proposals table for COO dashboard (Global scope)
 */
function renderProposalsTable(proposals) {
    if (!proposals || proposals.length === 0) {
        return '<div class="card" style="padding: 2rem; text-align: center; color: var(--text-light);">No proposals found for this filter.</div>';
    }

    const proposalsHtml = proposals.map(p => {
        const statusDisplay = (p.status || 'DRAFT').toUpperCase().replace(/_/g, ' ');
        const statusClass = (p.status || 'draft').toLowerCase().replace(/_/g, '-');
        
        // Calculate allocation status for won proposals
        const maxHours = parseFloat(p.maxAllocatedHours) || 0;
        const totalAllocated = parseFloat(p.totalAllocatedHours) || 0;
        const remainingHours = maxHours - totalAllocated;
        
        // Logic: Project is fully allocated if it exists and Remaining is <= 0 (or very close to 0)
        const isFullyAllocated = p.projectCreated && maxHours > 0 && remainingHours <= 0.1;
        const isPartiallyAllocated = p.projectCreated && maxHours > 0 && remainingHours > 0.1;
        const isPendingAllocation = p.status === 'won' && p.pricing && p.pricing.projectNumber && !p.projectCreated;
        
        // Action buttons based on proposal status
        let actionButtons = '';
        
        // COO can set pricing for estimated proposals
        if (p.status === 'estimated' && (!p.pricing || !p.pricing.projectNumber)) {
            actionButtons += `<button class="btn btn-success btn-sm" onclick="showCOOPricingForm('${p.id}')">Set Pricing</button> `;
        }
        
        // COO can allocate won proposals with pricing
        if (p.status === 'won' && p.pricing && p.pricing.projectNumber) {
            if (isPendingAllocation) {
                // Case 1: Not allocated at all - show Allocate button
                actionButtons += `<button class="btn btn-primary btn-sm" onclick="showProjectAllocationModal('${p.id}')">🎯 Allocate Project</button> `;
            } else if (isPartiallyAllocated) {
                // Case 2: Partially allocated - show Continue Allocation with remaining hours
                actionButtons += `<button class="btn btn-warning btn-sm" onclick="showProjectAllocationModal('${p.id}')">🎯 Allocate Remaining ${remainingHours.toFixed(1)}h</button> `;
            }
            // Case 3: Fully Allocated - DO NOT show allocate button
        }
        
        // Allocation status indicator
        let allocationStatus = '';
        if (p.status === 'won' && p.pricing && p.pricing.projectNumber) {
            if (isFullyAllocated) {
                allocationStatus = '<span class="badge badge-success" style="font-size: 0.7rem;">✅ Fully Allocated</span>';
            } else if (isPartiallyAllocated) {
                allocationStatus = `<span class="badge badge-warning" style="font-size: 0.7rem; background: #f59e0b; color: white;">⏳ Partial: ${totalAllocated.toFixed(1)}/${maxHours}h (${remainingHours.toFixed(1)}h left)</span>`;
            } else if (isPendingAllocation) {
                allocationStatus = '<span class="badge badge-info" style="font-size: 0.7rem;">🎯 Needs Allocation</span>';
            }
        }
        
        return `
            <tr>
                <td>
                    <strong>${p.projectName}</strong><br>
                    <small style="color: var(--text-light);">${p.clientCompany}</small>
                    ${allocationStatus ? `<br>${allocationStatus}` : ''}
                </td>
                <td>
                    <span class="proposal-status status-${statusClass}">${statusDisplay}</span>
                </td>
                <td>
                    ${p.estimation ? `<strong>${p.estimation.totalHours || 0}h</strong>` : '-'}
                </td>
                <td>
                    ${p.pricing && p.pricing.projectNumber ? 
                        `<strong>${p.pricing.quoteValue || 0} ${p.pricing.currency || ''}</strong><br>
                         <small>Project #: ${p.pricing.projectNumber}</small>
                         ${maxHours > 0 ? `<br><small>Budget: ${maxHours}h</small>` : ''}` : 
                        '-'}
                </td>
                <td>${formatDate(p.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        ${actionButtons}
                        <button onclick="viewProposal('${p.id}')" class="btn btn-outline btn-sm">View Details</button>
                        ${p.projectCreated && p.projectId ? `<button onclick="viewProject('${p.projectId}')" class="btn btn-outline btn-sm">View Project</button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="card">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Status</th>
                        <th>Estimated Hours</th>
                        <th>Pricing / Budget</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${proposalsHtml}
                </tbody>
            </table>
        </div>
    `;
}

async function showAllProjects() {
    try {
        showLoading();
        
        const response = await apiCall('proposals');
        
        if (!response.success) {
            throw new Error(response.error || 'Failed to load proposals.');
        }
        
        let allProposals = response.data || [];
        
        // Separate proposals and variations
        const proposals = allProposals.filter(p => !p.isVariation);
        const variations = allProposals.filter(p => p.isVariation);
        
        // Count proposals by CORRECT status values for COO
        const statusCounts = {
            all: proposals.length,
            // Estimation Completed = proposals with estimation data
            estimation: proposals.filter(p => 
                p.status === 'estimated' || 
                (p.estimation && p.estimation.totalHours)
            ).length,
            // Pricing Pending = estimated but no pricing yet
            pricing: proposals.filter(p => 
                (p.status === 'estimated' || p.estimation) && 
                (!p.pricing || !p.pricing.projectNumber)
            ).length,
            // Pending Allocation = won proposals with pricing but NOT allocated at all
            pending: proposals.filter(p => 
                p.status === 'won' && 
                p.pricing && 
                p.pricing.projectNumber && 
                !p.projectCreated  // Not created = not allocated
            ).length,
            // Partially Allocated = project created but totalAllocatedHours < maxAllocatedHours
            partial: proposals.filter(p => {
                if (p.status !== 'won' || !p.projectCreated) return false;
                const maxHours = parseFloat(p.maxAllocatedHours) || 0;
                const totalAllocated = parseFloat(p.totalAllocatedHours) || 0;
                return maxHours > 0 && totalAllocated > 0 && totalAllocated < maxHours;
            }).length
        };
        
        // Filter proposals based on current filter
        let filteredProposals = proposals;
        if (currentFilter === 'estimation') {
            // Show all proposals with estimation
            filteredProposals = proposals.filter(p => 
                p.status === 'estimated' || 
                (p.estimation && p.estimation.totalHours)
            );
        } else if (currentFilter === 'pricing') {
            // Show estimated proposals waiting for pricing
            filteredProposals = proposals.filter(p => 
                (p.status === 'estimated' || p.estimation) && 
                (!p.pricing || !p.pricing.projectNumber)
            );
        } else if (currentFilter === 'pending') {
            // Show won proposals waiting for INITIAL allocation only
            filteredProposals = proposals.filter(p => 
                p.status === 'won' && 
                p.pricing && 
                p.pricing.projectNumber && 
                !p.projectCreated
            );
        } else if (currentFilter === 'partial') {
            // Show partially allocated projects
            filteredProposals = proposals.filter(p => {
                if (p.status !== 'won' || !p.projectCreated) return false;
                const maxHours = parseFloat(p.maxAllocatedHours) || 0;
                const totalAllocated = parseFloat(p.totalAllocatedHours) || 0;
                return maxHours > 0 && totalAllocated > 0 && totalAllocated < maxHours;
            });
        }
        
        const main = document.getElementById('mainContent');
        
        main.innerHTML = `
            <h1>COO Dashboard</h1>
            
            <!-- Filter Buttons -->
            <div class="filter-buttons-container">
                <button class="filter-btn filter-btn-all ${currentFilter === 'all' ? 'active' : ''}" 
                        onclick="filterCOOProposals('all')">
                    📊 All Proposals
                    <span class="filter-count">${statusCounts.all}</span>
                </button>
                
                <button class="filter-btn filter-btn-estimation ${currentFilter === 'estimation' ? 'active' : ''}" 
                        onclick="filterCOOProposals('estimation')">
                    ✅ Estimation Completed
                    <span class="filter-count">${statusCounts.estimation}</span>
                </button>
                
                <button class="filter-btn filter-btn-pricing ${currentFilter === 'pricing' ? 'active' : ''}" 
                        onclick="filterCOOProposals('pricing')">
                    💰 Pricing Pending
                    <span class="filter-count">${statusCounts.pricing}</span>
                </button>
                
                <button class="filter-btn filter-btn-pending ${currentFilter === 'pending' ? 'active' : ''}" 
                        onclick="filterCOOProposals('pending')">
                    🎯 Pending Allocation
                    <span class="filter-count">${statusCounts.pending}</span>
                </button>
                
                ${statusCounts.partial > 0 ? `
                <button class="filter-btn ${currentFilter === 'partial' ? 'active' : ''}" 
                        onclick="filterCOOProposals('partial')"
                        style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white;">
                    ⏳ Partially Allocated
                    <span class="filter-count">${statusCounts.partial}</span>
                </button>
                ` : ''}
            </div>
            
            <!-- Tabs for Proposals and Variations -->
            <div class="tabs">
                <button class="tab-btn active" onclick="switchTab(this, 'proposals-section')">
                    Active Proposals (${filteredProposals.length})
                </button>
                <button class="tab-btn" onclick="switchTab(this, 'variations-section')">
                    Pending Variations (${variations.filter(v => v.status === 'pending').length})
                </button>
            </div>
            
            <!-- Proposals Section -->
            <div id="proposals-section" class="tab-content active">
                ${renderProposalsTable(filteredProposals)}
            </div>
            
            <!-- Variations Section -->
            <div id="variations-section" class="tab-content">
                ${renderPendingVariationsTable(variations.filter(v => v.status === 'pending'))}
            </div>
        `;
        
    } catch (error) {
        console.error('COO Dashboard error:', error);
        document.getElementById('mainContent').innerHTML = `
            <div class="error-message">
                <h2>⚠️ Error Loading Dashboard</h2>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="showAllProjects()">Retry</button>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

/**
 * Renders the table for pending variations (Global scope for COO Dashboard)
 */
function renderPendingVariationsTable(variations) {
    if (!variations || variations.length === 0) {
        return '<div class="card" style="padding: 2rem; text-align: center; color: var(--text-light);">No pending variations found.</div>';
    }

    const variationsHtml = variations.map(v => `
        <tr>
            <td><strong>${v.parentProjectName || 'Unknown'}</strong><br><small>${v.clientCompany || ''}</small></td>
            <td><span class="project-number-badge" style="background: var(--warning); color: #856404;">${v.variationCode || 'N/A'}</span></td>
            <td><strong>${v.estimatedHours || 0}h</strong></td>
            <td>${v.createdByName || 'Unknown'} <br><small>(${(v.createdByRole || '').replace('_', ' ')})</small></td>
            <td>${formatDate(v.createdAt)}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="showVariationApprovalModal('${v.id}')">
                    Review
                </button>
            </td>
        </tr>
    `).join('');

    return `
        <div class="card">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Parent Project</th>
                        <th>Variation Code</th>
                        <th>Requested Hours</th>
                        <th>Submitted By</th>
                        <th>Date Submitted</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${variationsHtml}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Filter COO Proposals by type
 */
function filterCOOProposals(filterType) {
    currentFilter = filterType;
    showAllProjects(); // Reload with new filter
}


        
// EXECUTIVE TIMESHEET MONITORING DASHBOARD
// Add these functions to your index.html <script> section
// ============================================

/**
 * Show Executive Timesheet Dashboard (COO/Director only)
 */
async function showExecutiveDashboard() {
    try {
        showLoading();
        
        // Fetch executive dashboard data
        const response = await apiCall('timesheets?action=executive_dashboard');
        
        if (!response.success) {
            throw new Error(response.error || 'Failed to load executive dashboard');
        }
        
        const { metrics, projects, designers, analytics } = response.data;
        
        // Build the dashboard HTML
        const dashboardHtml = `
            <div class="page-header">
                <h2>📊 Executive Timesheet Monitoring</h2>
                <p class="subtitle">Comprehensive overview of project timelines and resource utilization</p>
            </div>
            
            <!-- Main Metrics -->
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-number">${metrics.totalProjects}</div>
                    <div class="stat-label">Total Projects</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${metrics.projectsWithTimeline}</div>
                    <div class="stat-label">Projects with Timeline</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${metrics.averageHoursPerProject}h</div>
                    <div class="stat-label">Average Hours per Project</div>
                </div>
                <div class="stat-card" style="border-top-color: var(--danger);">
                    <div class="stat-number" style="color: var(--danger);">${metrics.projectsAboveTimeline}</div>
                    <div class="stat-label">Projects Above Timeline</div>
                </div>
                <div class="stat-card" style="border-top-color: var(--warning);">
                    <div class="stat-number" style="color: var(--warning);">${metrics.totalExceededHours}h</div>
                    <div class="stat-label">Time Spent (Exceeded Projects)</div>
                </div>
            </div>
            
            <!-- Section Tabs -->
            <div class="card" style="margin-bottom: 2rem;">
                <div class="auth-tabs">
                    <button class="auth-tab active" onclick="showExecutiveSection('projects')">Active Projects</button>
                    <button class="auth-tab" onclick="showExecutiveSection('designers')">Total Designers</button>
                    <button class="auth-tab" onclick="showExecutiveSection('analytics')">Analytics</button>
                </div>
            </div>
            
            <!-- Section: Active Projects -->
            <div id="executive-section-projects" class="executive-section">
                ${renderExecutiveProjectsTable(projects)}
            </div>
            
            <!-- Section: Designers -->
            <div id="executive-section-designers" class="executive-section" style="display: none;">
                ${renderExecutiveDesignersTable(designers)}
            </div>
            
            <!-- Section: Analytics -->
            <div id="executive-section-analytics" class="executive-section" style="display: none;">
                ${renderExecutiveAnalytics(analytics)}
            </div>
        `;
        
        document.getElementById('mainContent').innerHTML = dashboardHtml;
        
        // Initialize charts if analytics section is visible
        setTimeout(() => {
            if (document.getElementById('executive-section-analytics').style.display !== 'none') {
                renderExecutiveCharts(analytics);
            }
        }, 100);
        
    } catch (error) {
        console.error('Error loading executive dashboard:', error);
        alert(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Render Active Projects Table
 */
function renderExecutiveProjectsTable(projects) {
    if (projects.length === 0) {
        return '<div class="card" style="padding: 2rem; text-align: center; color: var(--text-light);">No active projects found.</div>';
    }
    
    const projectsHtml = projects.map(p => {
        const statusClass = p.isExceeded ? 'danger' : (p.percentageUsed > 80 ? 'warning' : 'success');
        const statusBadge = p.isExceeded 
            ? `<span class="badge badge-danger">Exceeded by ${p.exceededBy.toFixed(1)}h</span>`
            : (p.allocatedHours > 0 
                ? `<span class="badge badge-${statusClass}">${p.percentageUsed}% Used</span>`
                : '<span class="badge badge-secondary">No Timeline</span>');
        
        return `
            <tr>
                <td>
                    <strong>${p.projectName}</strong><br>
                    <small>${p.projectCode} • ${p.clientCompany}</small>
                </td>
                <td><strong>${p.hoursLogged.toFixed(1)}h</strong> / ${p.allocatedHours}h</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill progress-${statusClass}" 
                             style="width: ${Math.min(p.percentageUsed, 100)}%"></div>
                    </div>
                </td>
                <td>${statusBadge}</td>
                <td>${p.designLeadName || 'Not Assigned'}</td>
                <td><span class="badge badge-info">${p.status.replace('_', ' ')}</span></td>
            </tr>
        `;
    }).join('');
    
    return `
        <div class="card">
            <h3 style="margin-bottom: 1.5rem;">Active Projects Overview</h3>
            <div style="overflow-x: auto;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Hours</th>
                            <th>Progress</th>
                            <th>Status</th>
                            <th>Design Lead</th>
                            <th>Project Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${projectsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * Render Designers Table
 */
function renderExecutiveDesignersTable(designers) {
    if (designers.length === 0) {
        return '<div class="card" style="padding: 2rem; text-align: center; color: var(--text-light);">No designers found.</div>';
    }
    
    const designersHtml = designers.map(d => `
        <tr>
            <td><strong>${d.name}</strong><br><small>${d.email}</small></td>
            <td><strong>${d.totalHours.toFixed(1)}h</strong></td>
            <td>${d.projectsWorkedOn}</td>
            <td>${(d.totalHours / d.projectsWorkedOn).toFixed(1)}h</td>
        </tr>
    `).join('');
    
    return `
        <div class="card">
            <h3 style="margin-bottom: 1.5rem;">Designer Performance</h3>
            <div style="overflow-x: auto;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Designer</th>
                            <th>Total Hours</th>
                            <th>Projects Worked On</th>
                            <th>Avg Hours/Project</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${designersHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * Render Analytics Section with Charts
 */
function renderExecutiveAnalytics(analytics) {
    return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
            <!-- Exceeded Projects -->
            <div class="card">
                <h3 style="margin-bottom: 1rem; color: var(--danger);">⚠️ Exceeded Projects (${analytics.exceededProjects.length})</h3>
                ${renderExceededProjectsList(analytics.exceededProjects)}
            </div>
            
            <!-- Within Timeline -->
            <div class="card">
                <h3 style="margin-bottom: 1rem; color: var(--success);">✓ Projects Within Timeline (${analytics.withinTimelineProjects.length})</h3>
                ${renderWithinTimelineList(analytics.withinTimelineProjects)}
            </div>
        </div>
        
        <!-- Charts -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div class="card">
                <h3 style="margin-bottom: 1.5rem;">Project Status Distribution</h3>
                <canvas id="projectStatusPieChart" width="400" height="400"></canvas>
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 1.5rem;">Designer Workload</h3>
                <canvas id="designerWorkloadBarChart" width="400" height="400"></canvas>
            </div>
        </div>
    `;
}

function renderExceededProjectsList(projects) {
    if (projects.length === 0) {
        return '<p style="color: var(--text-light); text-align: center; padding: 2rem;">No projects have exceeded their timeline. Great work!</p>';
    }
    
    return `
        <div style="max-height: 400px; overflow-y: auto;">
            ${projects.map(p => `
                <div style="padding: 1rem; border-bottom: 1px solid var(--border);">
                    <strong>${p.projectName}</strong>
                    <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                        <span style="color: var(--text-light);">${p.hoursLogged.toFixed(1)}h / ${p.allocatedHours}h</span>
                        <span style="color: var(--danger); font-weight: 600;">+${p.exceededBy.toFixed(1)}h over</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderWithinTimelineList(projects) {
    if (projects.length === 0) {
        return '<p style="color: var(--text-light); text-align: center; padding: 2rem;">No projects within timeline currently.</p>';
    }
    
    return `
        <div style="max-height: 400px; overflow-y: auto;">
            ${projects.map(p => `
                <div style="padding: 1rem; border-bottom: 1px solid var(--border);">
                    <strong>${p.projectName}</strong>
                    <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                        <span style="color: var(--text-light);">${p.hoursLogged.toFixed(1)}h / ${p.allocatedHours}h</span>
                        <span style="color: var(--success); font-weight: 600;">${p.percentageUsed}% used</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Switch between executive dashboard sections
 */
function showExecutiveSection(section) {
    // Update tab active states
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Hide all sections
    document.querySelectorAll('.executive-section').forEach(sec => sec.style.display = 'none');
    
    // Show selected section
    const selectedSection = document.getElementById(`executive-section-${section}`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        
        // Render charts when analytics section is shown
        if (section === 'analytics') {
            // Re-fetch data to render charts
            apiCall('timesheets?action=executive_dashboard').then(response => {
                if (response.success) {
                    renderExecutiveCharts(response.data.analytics);
                }
            });
        }
    }
}

/**
 * Render Charts using Chart.js (make sure Chart.js is included in your HTML)
 */
function renderExecutiveCharts(analytics) {
    // Pie Chart - Project Status Distribution
    const pieCtx = document.getElementById('projectStatusPieChart');
    if (pieCtx) {
        const statusData = analytics.projectStatusDistribution || {};
        const labels = Object.keys(statusData);
        const data = Object.values(statusData);
        
        // Define colors for statuses
        const statusColors = {
            'assigned': '#ddd6fe',
            'in_progress': '#bfdbfe',
            'completed': '#bbf7d0',
            'pending_setup': '#fef3c7',
            'unknown': '#f3f4f6'
        };

        // --- FIX 1: The 'new Chart' constructor was added here ---
        new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: labels.map(l => l.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())),
                datasets: [{
                    data: data,
                    backgroundColor: labels.map(l => statusColors[l] || '#' + Math.floor(Math.random()*16777215).toString(16)), // Random fallback
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Bar Chart - Designer Workload
    const barCtx = document.getElementById('designerWorkloadBarChart');
    if (barCtx) {
        const designerData = analytics.designerDuration.slice(0, 10); // Top 10 designers
        
        // --- FIX 2: This section is now a 'bar' chart using 'barCtx' and 'designerData' ---
        new Chart(barCtx, {
            type: 'bar', // Changed from 'doughnut'
            data: {
                labels: designerData.map(d => d.name), // Uses designerData
                datasets: [{
                    label: 'Total Hours', // Added a label
                    data: designerData.map(d => d.totalHours), // Uses designerData
                    backgroundColor: '#00BFFF', // Bar color
                    borderColor: '#0099CC',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // No legend needed for a single-dataset bar chart
                    }
                }
            }
        });
    }
}

// ============================================
// ADDITIONAL TIME REQUEST FUNCTIONALITY
// ============================================

/**
 * Show timesheet form with allocation check (Designer)
 */
async function showTimesheetForm(projectId = null) {
    try {
        showLoading();
        
        // Fetch projects for dropdown
        const projectsResponse = await apiCall('projects?assignedToMe=true');
        
        if (!projectsResponse.success) {
            throw new Error('Failed to load projects');
        }
        
        const projects = projectsResponse.data || [];
        
        const formHtml = `
            <div class="page-header">
                <h2>⏱️ Log Time</h2>
                <p class="subtitle">Record your work hours for projects</p>
            </div>
            
            <div class="card" style="max-width: 600px;">
                <form id="timesheetForm" onsubmit="submitTimesheet(event)">
                    <div class="form-group">
                        <label>Project *</label>
                        <select class="form-control" id="timesheetProjectId" onchange="checkProjectAllocation()" required>
                            <option value="">Select a project</option>
                            ${projects.map(p => `
                                <option value="${p.id}" ${projectId === p.id ? 'selected' : ''}>
                                    ${p.projectName} (${p.projectCode})
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div id="allocationInfo" style="display: none; margin-bottom: 1.5rem;"></div>
                    
                    <div class="form-group">
                        <label>Date *</label>
                        <input type="date" class="form-control" id="timesheetDate" 
                               max="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Activity/Description *</label>
                        <textarea class="form-control" id="timesheetDescription" rows="3" 
                                  placeholder="Describe what you worked on..." required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Hours Worked * <span id="allocatedHoursLabel" style="color: var(--text-light);"></span></label>
                        <input type="number" class="form-control" id="timesheetHours" 
                               step="0.5" min="0.5" max="24" placeholder="e.g., 4.5" 
                               oninput="checkHoursAllocation()" required>
                        <small id="hoursWarning" style="display: none; color: var(--danger); margin-top: 0.5rem;"></small>
                    </div>
                    
                    <div class="form-group">
                        <label>Notes (Optional)</label>
                        <input type="text" class="form-control" id="timesheetNotes" 
                               placeholder="Additional notes...">
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button type="submit" class="btn btn-primary" id="submitTimesheetBtn">
                            Submit Timesheet
                        </button>
                        <button type="button" class="btn btn-outline" onclick="showTasks()">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            
            <!-- Request Additional Time Modal -->
            <div id="requestTimeModal" class="modal">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3>Request Additional Time</h3>
                        <button class="modal-close" onclick="closeRequestTimeModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p style="margin-bottom: 1.5rem; color: var(--text-dark);">
                            The hours you're trying to log exceed the project's allocated time. 
                            Please request additional time from your manager.
                        </p>
                        
                        <form id="requestTimeForm" onsubmit="submitTimeRequest(event)">
                            <div class="form-group">
                                <label>Requested Additional Hours *</label>
                                <input type="number" class="form-control" id="requestedHours" 
                                       step="0.5" min="0.5" required>
                                <small style="color: var(--text-light);">Pre-filled with exceeded amount, but you can adjust</small>
                            </div>
                            
                            <div class="form-group">
                                <label>Reason *</label>
                                <textarea class="form-control" id="requestReason" rows="4" 
                                          placeholder="Explain why additional time is needed..." required></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>Attachment (Optional)</label>
                                <input type="file" class="form-control" id="requestAttachment" 
                                       accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
                                <small style="color: var(--text-light);">Upload supporting documents if needed</small>
                            </div>
                            
                            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                                <button type="submit" class="btn btn-primary">
                                    Submit Request
                                </button>
                                <button type="button" class="btn btn-outline" onclick="closeRequestTimeModal()">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('mainContent').innerHTML = formHtml;
        
        // Set default date to today
        document.getElementById('timesheetDate').valueAsDate = new Date();
        
        // If projectId provided, check allocation
        if (projectId) {
            await checkProjectAllocation();
        }
        
    } catch (error) {
        console.error('Error showing timesheet form:', error);
        alert(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Check project allocation and display info
 */
async function checkProjectAllocation() {
    const projectId = document.getElementById('timesheetProjectId').value;
    const allocationInfo = document.getElementById('allocationInfo');
    const allocatedHoursLabel = document.getElementById('allocatedHoursLabel');
    
    if (!projectId) {
        allocationInfo.style.display = 'none';
        allocatedHoursLabel.textContent = '';
        return;
    }
    
    try {
        // Fetch project details
        const projectResponse = await apiCall(`projects?id=${projectId}`);
        
        if (!projectResponse.success) {
            throw new Error('Failed to load project details');
        }
        
        const project = projectResponse.data;
        
        // Fetch designer's timesheets for this project
        const timesheetsResponse = await apiCall(`timesheets?projectId=${projectId}`);
        const timesheets = timesheetsResponse.data || [];
        
        const hoursLogged = timesheets.reduce((sum, t) => sum + (t.hours || 0), 0);
        const allocatedHours = project.allocatedHours || 0;
        const remainingHours = allocatedHours - hoursLogged;
        const percentUsed = allocatedHours > 0 ? (hoursLogged / allocatedHours * 100).toFixed(1) : 0;
        
        // Store for later use
        window.currentProjectAllocation = {
            allocatedHours,
            hoursLogged,
            remainingHours,
            projectId,
            projectName: project.projectName
        };
        
        // Display allocation info
        const statusClass = remainingHours < 0 ? 'danger' : (remainingHours < allocatedHours * 0.2 ? 'warning' : 'success');
        
        allocationInfo.innerHTML = `
            <div class="info-message" style="background: var(--light-blue); border-left: 4px solid var(--${statusClass});">
                <strong>Project Allocation:</strong><br>
                Allocated: ${allocatedHours}h | Used: ${hoursLogged.toFixed(1)}h | 
                Remaining: ${remainingHours.toFixed(1)}h (${percentUsed}% used)
            </div>
        `;
        allocationInfo.style.display = 'block';
        
        allocatedHoursLabel.textContent = `(Remaining: ${remainingHours.toFixed(1)}h)`;
        
    } catch (error) {
        console.error('Error checking allocation:', error);
    }
}

/**
 * Check if entered hours exceed allocation
 */
function checkHoursAllocation() {
    const hours = parseFloat(document.getElementById('timesheetHours').value);
    const hoursWarning = document.getElementById('hoursWarning');
    
    if (!hours || !window.currentProjectAllocation) {
        hoursWarning.style.display = 'none';
        return;
    }
    
    const { remainingHours } = window.currentProjectAllocation;
    
    if (hours > remainingHours && remainingHours >= 0) {
        hoursWarning.textContent = `⚠️ Entered hours exceed project allocation by ${(hours - remainingHours).toFixed(1)}h. You'll need to request additional time.`;
        hoursWarning.style.display = 'block';
    } else {
        hoursWarning.style.display = 'none';
    }
}

/**
 * Submit timesheet (LEGACY - use window.submitTimesheet instead)
 */
async function submitTimesheetLegacy(event) {
    if (event) event.preventDefault();
    
    // Redirect to the main submitTimesheet function
    window.submitTimesheet();
}

/**
 * Show request additional time modal
 */
function showRequestTimeModal(allocationData) {
    const modal = document.getElementById('requestTimeModal');
    const requestedHours = document.getElementById('requestedHours');
    
// Pre-fill with exceeded amount
    if (allocationData && allocationData.exceededBy) {
        requestedHours.value = Math.ceil(allocationData.exceededBy * 2) / 2; // Round up to nearest 0.5
    }
// --- ADD THIS ---
// Store pending timesheet data in the form for submission
const form = document.getElementById('requestTimeForm');
const timesheetData = {
    date: document.getElementById('timesheetDate').value,
    hours: parseFloat(document.getElementById('timesheetHours').value),
    description: document.getElementById('timesheetDescription').value,
};
form.dataset.pendingTimesheet = JSON.stringify(timesheetData);
// --- END ADD ---
modal.style.display = 'flex';


}

/**
 * Close request time modal
 */
function closeRequestTimeModal() {
    document.getElementById('requestTimeModal').style.display = 'none';
    document.getElementById('requestTimeForm').reset();
}

/**
 * Submit time request
 */
async function submitTimeRequest(event) {
    event.preventDefault();
    
    const projectId = document.getElementById('timesheetProjectId').value;
    const requestedHours = parseFloat(document.getElementById('requestedHours').value);
    const reason = document.getElementById('requestReason').value;
    const attachmentFile = document.getElementById('requestAttachment').files[0];
    // --- ADD THIS ---
    const form = document.getElementById('requestTimeForm');
    const pendingTimesheetData = JSON.parse(form.dataset.pendingTimesheet || 'null');
    // --- END ADD ---
    
    try {
        showLoading();
        
        let attachmentUrl = null;
        
        // Upload attachment if provided
        if (attachmentFile) {
            // TODO: Implement file upload to Firebase Storage
            // For now, we'll skip this or you can add your storage logic
            console.log('Attachment upload not implemented yet');
        }
        
        const response = await apiCall('time-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId,
                requestedHours,
                reason,
                attachmentUrl,
                pendingTimesheetData // <-- ADD THIS
            })
        });
        
        if (response.success) {
            closeRequestTimeModal();
            showSuccessModal(
                'Request Submitted',
                `Your request for ${requestedHours}h additional time has been sent for approval.`
            );
            await showTasks();
        } else {
            throw new Error(response.error || 'Failed to submit request');
        }
        
    } catch (error) {
        console.error('Error submitting time request:', error);
        alert(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Show pending time requests (COO Portal)
 */
async function showPendingTimeRequests() {
    try {
        showLoading();
        
        const response = await apiCall('time-requests?status=pending');
        
        if (!response.success) {
            throw new Error(response.error || 'Failed to load time requests');
        }
        
        const requests = response.data || [];
        
        const requestsHtml = `
            <div class="page-header">
                <h2>⏰ Pending Time Requests</h2>
                <p class="subtitle">Review and approve additional time requests from designers</p>
                <span class="badge badge-warning" style="font-size: 1.2rem; padding: 0.5rem 1rem;">
                    ${requests.length} Pending
                </span>
            </div>
            
            ${requests.length === 0 ? `
                <div class="card" style="padding: 3rem; text-align: center;">
                    <p style="color: var(--text-light); font-size: 1.2rem;">
                        No pending time requests at the moment.
                    </p>
                </div>
            ` : `
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Designer</th>
                                <th>Current Allocation</th>
                                <th>Requested Hours</th>
                                <th>Reason</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${requests.map(r => `
                                <tr>
                                    <td>
                                        <strong>${r.projectName}</strong><br>
                                        <small>${r.projectCode} • ${r.clientCompany}</small>
                                    </td>
                                    <td>
                                        ${r.designerName}<br>
                                        <small>${r.designerEmail}</small>
                                    </td>
                                    <td>
                                        ${r.currentHoursLogged.toFixed(1)}h / ${r.currentAllocatedHours}h<br>
                                        <small style="color: var(--text-light);">
                                            ${((r.currentHoursLogged / r.currentAllocatedHours) * 100).toFixed(0)}% used
                                        </small>
                                    </td>
                                    <td><strong style="color: var(--warning);">+${r.requestedHours}h</strong></td>
                                    <td>
                                        <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">
                                            ${r.reason}
                                        </div>
                                    </td>
                                    <td>${formatDate(r.createdAt)}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm" 
                                                onclick="showTimeRequestReviewModal('${r.id}')">
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        `;
        
        document.getElementById('mainContent').innerHTML = requestsHtml;
        
    } catch (error) {
        console.error('Error loading time requests:', error);
        alert(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Show time request review modal (COO)
 */
async function showTimeRequestReviewModal(requestId) {
    try {
        showLoading();
        
        const response = await apiCall(`time-requests?id=${requestId}`);
        
        if (!response.success) {
            throw new Error('Failed to load request details');
        }
        
        const request = response.data;
        
        const modalHtml = `
            <div id="timeRequestReviewModal" class="modal" style="display: flex;">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h3>Review Time Request</h3>
                        <button class="modal-close" onclick="closeModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <!-- Project Info -->
                        <div class="info-message" style="margin-bottom: 1.5rem;">
                            <strong>Project:</strong> ${request.projectName} (${request.projectCode})<br>
                            <strong>Client:</strong> ${request.clientCompany}<br>
                            <strong>Design Lead:</strong> ${request.designLeadName || 'Not Assigned'}
                        </div>
                        
                        <!-- Designer Info -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                            <div>
                                <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Designer</label>
                                <p>${request.designerName}<br><small>${request.designerEmail}</small></p>
                            </div>
                            <div>
                                <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Requested</label>
                                <p style="font-size: 1.5rem; color: var(--warning); font-weight: 700;">
                                    +${request.requestedHours}h
                                </p>
                            </div>
                        </div>
                        
                        <!-- Current Allocation -->
                        <div style="background: var(--background); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                            <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Current Status</label>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Allocated: ${request.currentAllocatedHours}h</span>
                                <span>Used: ${request.currentHoursLogged.toFixed(1)}h</span>
                                <span style="color: var(--danger);">Remaining: ${(request.currentAllocatedHours - request.currentHoursLogged).toFixed(1)}h</span>
                            </div>
                            <div class="progress-bar" style="margin-top: 0.5rem;">
                                <div class="progress-fill progress-danger" 
                                     style="width: ${Math.min((request.currentHoursLogged / request.currentAllocatedHours) * 100, 100)}%"></div>
                            </div>
                        </div>
                        
                        <!-- Reason -->
                        <div class="form-group">
                            <label style="font-weight: 600;">Reason for Request</label>
                            <div style="background: var(--background); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--primary-blue);">
                                ${request.reason}
                            </div>
                        </div>
                        
                        ${request.attachmentUrl ? `
                            <div class="form-group">
                                <label style="font-weight: 600;">Attachment</label>
                                <a href="${request.attachmentUrl}" target="_blank" class="btn btn-outline btn-sm">
                                    View Attachment
                                </a>
                            </div>
                        ` : ''}
                        
                        <!-- Review Form -->
                        <form onsubmit="submitTimeRequestReview(event, '${requestId}')">
                            <div class="form-group">
                                <label>Approved Hours</label>
                                <input type="number" class="form-control" id="approvedHours" 
                                       step="0.5" min="0.5" value="${request.requestedHours}" required>
                                <small style="color: var(--text-light);">You can adjust the approved amount</small>
                            </div>
                            
                            <div class="form-group">
                                <label>Comment</label>
                                <textarea class="form-control" id="reviewComment" rows="3" 
                                          placeholder="Add notes or feedback..."></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="applyToTimesheet" checked>
                                    Apply approved hours to current timesheet
                                </label>
                            </div>
                            
                            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                                <button type="button" class="btn btn-success" 
                                        onclick="reviewTimeRequest('${requestId}', 'approve')">
                                    Approve
                                </button>
                                <button type="button" class="btn btn-danger" 
                                        onclick="reviewTimeRequest('${requestId}', 'reject')">
                                    Reject
                                </button>
                                <button type="button" class="btn btn-warning" 
                                        onclick="reviewTimeRequest('${requestId}', 'request_info')">
                                    Request More Info
                                </button>
                                <button type="button" class="btn btn-outline" onclick="closeModal()">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        const existingModal = document.getElementById('timeRequestReviewModal');
        if (existingModal) {
            existingModal.remove();
        }
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
    } catch (error) {
        console.error('Error showing review modal:', error);
        alert(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Review time request (approve/reject/request info)
 */
async function reviewTimeRequest(requestId, action) {
    const approvedHours = parseFloat(document.getElementById('approvedHours').value);
    const comment = document.getElementById('reviewComment').value;
    const applyToTimesheet = document.getElementById('applyToTimesheet').checked;
    
    // Validation
    if (action === 'approve' && (!approvedHours || approvedHours <= 0)) {
        alert('Please enter valid approved hours');
        return;
    }
    
    if (action === 'reject' && !comment.trim()) {
        alert('Please provide a reason for rejection');
        return;
    }
    
    const confirmMsg = action === 'approve' 
        ? `Approve ${approvedHours}h additional time for this project?`
        : action === 'reject'
        ? 'Reject this time request?'
        : 'Request more information from the designer?';
    
    if (!confirm(confirmMsg)) {
        return;
    }
    
    try {
        showLoading();
        
        const response = await apiCall(`time-requests?id=${requestId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action,
                approvedHours: action === 'approve' ? approvedHours : undefined,
                comment: comment.trim(),
                applyToTimesheet: action === 'approve' ? applyToTimesheet : undefined
            })
        });
        
        if (response.success) {
            closeModal();
            showSuccessModal(
                `Request ${action.charAt(0).toUpperCase() + action.slice(1)}ed`,
                `The time request has been processed successfully.`
            );
            await showPendingTimeRequests(); // Refresh the list
        } else {
            throw new Error(response.error || 'Failed to process request');
        }
        
    } catch (error) {
        console.error('Error reviewing time request:', error);
        alert(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}
// ============================================
// HELPER FUNCTIONS
// ============================================



/**
 * Add required CSS for new features (add to <style> section)
 */
/*
.progress-bar {
    width: 100%;
    height: 8px;
    background: #E1E8ED;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    transition: width 0.3s ease;
}

.progress-success {
    background: var(--success);
}

.progress-warning {
    background: var(--warning);
}

.progress-danger {
    background: var(--danger);
}

.badge {
    padding: 0.4rem 0.8rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    display: inline-block;
}

.badge-success {
    background: #d4edda;
    color: #155724;
}

.badge-warning {
    background: #fff3cd;
    color: #856404;
}

.badge-danger {
    background: #f8d7da;
    color: #721c24;
}

.badge-info {
    background: #d1ecf1;
    color: #0c5460;
}

.badge-secondary {
    background: #e2e3e5;
    color: #383d41;
}

.executive-section {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
*/

// ============================================
// UPDATE NAVIGATION MENU
// Add these menu items to the appropriate role sections:
// ============================================

/*
For COO/Director role navigation:
<li><a href="#" onclick="showExecutiveDashboard()">📊 Executive Dashboard</a></li>
<li><a href="#" onclick="showPendingTimeRequests()">⏰ Time Requests <span class="badge badge-warning" id="pendingRequestsBadge"></span></a></li>

For Designer role navigation:
<li><a href="#" onclick="showTimesheetForm()">⏱️ Log Time</a></li>
<li><a href="#" onclick="showMyTimeRequests()">📋 My Time Requests</a></li>
*/

/**
 * Show designer's own time requests
 */
async function showMyTimeRequests() {
    try {
        showLoading();
        
        const response = await apiCall('time-requests');
        
        if (!response.success) {
            throw new Error(response.error || 'Failed to load time requests');
        }
        
        const requests = response.data || [];
        
        const requestsHtml = `
            <div class="page-header">
                <h2>📋 My Time Requests</h2>
                <p class="subtitle">Track your additional time requests</p>
            </div>
            
            ${requests.length === 0 ? `
                <div class="card" style="padding: 3rem; text-align: center;">
                    <p style="color: var(--text-light); font-size: 1.2rem;">
                        You haven't submitted any time requests yet.
                    </p>
                </div>
            ` : `
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Requested Hours</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th>Response</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${requests.map(r => {
                                const statusBadge = r.status === 'approved' 
                                    ? `<span class="badge badge-success">Approved (${r.approvedHours}h)</span>`
                                    : r.status === 'rejected'
                                    ? '<span class="badge badge-danger">Rejected</span>'
                                    : r.status === 'info_requested'
                                    ? '<span class="badge badge-warning">Info Requested</span>'
                                    : '<span class="badge badge-info">Pending</span>';
                                
                                return `
                                    <tr>
                                        <td>
                                            <strong>${r.projectName}</strong><br>
                                            <small>${r.projectCode}</small>
                                        </td>
                                        <td><strong>+${r.requestedHours}h</strong></td>
                                        <td>${statusBadge}</td>
                                        <td>${formatDate(r.createdAt)}</td>
                                        <td>
                                            ${r.reviewComment ? `
                                                <small>${r.reviewComment}</small><br>
                                                <small style="color: var(--text-light);">
                                                    by ${r.reviewedBy} on ${formatDate(r.reviewedAt)}
                                                </small>
                                            ` : '-'}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        `;
        
        document.getElementById('mainContent').innerHTML = requestsHtml;
        
    } catch (error) {
        console.error('Error loading time requests:', error);
        alert(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// ============================================
// INITIALIZE - Update pending requests badge
// ============================================
           async function updatePendingRequestsBadge() {
            // FIX: Use the correct global variable 'currentUserRole'
            const userRole = currentUserRole ? currentUserRole.trim().toLowerCase() : '';
            if (!['coo', 'director'].includes(userRole)) {
                return;
            }
            try {
                const response = await apiCall('time-requests?status=pending');
                
                // FIX: Your API returns { success: true, data: [...] }
                // We need the .length of the 'data' array, not a 'count' property.
                const count = (response.success && Array.isArray(response.data)) ? response.data.length : 0;
                
                const badge = document.getElementById('pendingRequestsBadge');
                if (badge) {
                    if (count > 0) {
                        badge.textContent = count;
                        // FIX: Use 'inline-block' for proper flow in the nav item
                        badge.style.display = 'inline-block';
                    } else {
                        badge.style.display = 'none';
                    }
                }
            } catch (error) {
                console.error('Error updating badge:', error);
            }
        }

// Call this periodically or on page load
setInterval(updatePendingRequestsBadge, 60000); // Update every minute
       function renderAllProjects() {
            // --- MODIFIED: Add variation counts ---
            const wonProjects = allProjectsData.filter(p => p.status === 'won');
            const lostProjects = allProjectsData.filter(p => p.status === 'lost');
            const pendingProjects = allProjectsData.filter(p => p.status === 'pending' || p.status === 'draft');
            const approvedProjects = allProjectsData.filter(p => p.status === 'approved');
            const allocatedProjects = wonProjects.filter(p => p.projectCreated && p.designLeadAssigned);
            const toBeAllocatedProjects = wonProjects.filter(p => !p.designLeadAssigned);
            
            const pendingVariations = allVariationsData; // <-- NEW
            // --- END OF MODIFICATION ---

            // Filter projects based on current filter
            let filteredProjects = allProjectsData;
            let contentHtml = ''; // <-- NEW: Use a variable for content

            switch(currentProjectFilter) {
                case 'won': filteredProjects = wonProjects; break;
                case 'loss': filteredProjects = lostProjects; break;
                case 'pending': filteredProjects = pendingProjects; break;
                case 'approved': filteredProjects = approvedProjects; break;
                case 'toBeAllocated': filteredProjects = toBeAllocatedProjects; break;
                case 'allocated': filteredProjects = allocatedProjects; break;
                // <-- NEW: Add case for variations -->
                case 'pendingVariations':
                    contentHtml = renderPendingVariationsTable(pendingVariations);
                    break;
                default:
                    filteredProjects = allProjectsData;
            }

            // --- MODIFIED: Build project table only if not showing variations ---
            if (currentProjectFilter !== 'pendingVariations') {
                const projectsHtml = filteredProjects.map(p => {
                    // 1. Robust Allocation Check: Check multiple flags to ensure accuracy
                    const isAllocated = p.allocationStatus === 'allocated' || p.projectCreated || p.designLeadAssigned;
                    const isManagement = ['coo', 'director'].includes(currentUserRole);

                    // 2. Define clear allocation status indicators based on the robust check
                    const allocationStatusDisplay = isAllocated ? 
                        '<span class="proposal-status status-approved">✅ Allocated</span>' : 
                        (p.status === 'won' ? '<span class="proposal-status status-warning">⏳ To Be Allocated</span>' : 
                        '<span class="proposal-status status-pending">-</span>');
                    
                    // 3. Default action button
                    let actionButtons = `<button onclick="viewProposal('${p.id}')" class="btn btn-outline btn-sm">View Details</button>`;
                    
                    // 4. Management Actions
                    if (isManagement) {
                        // ONLY show "Allocate" if it's WON, needs a number, and is NOT yet allocated
                        if (p.status === 'won' && !isAllocated && p.pricing?.projectNumber) {
                            actionButtons = `
                                <button onclick="showProjectAllocationModal('${p.id}')" class="btn btn-success btn-sm">🎯 Allocate</button>
                                ${actionButtons}
                            `;
                        } 
                        // Optional: If it IS allocated and has a project ID, show a button to jump to the project view
                        else if (isAllocated && p.projectId) {
                             // actionButtons = `<button onclick="viewProject('${p.projectId}')" class="btn btn-outline btn-sm">📂 Open Project</button> ` + actionButtons;
                        }
                    }
                    
                    return `
                        <tr>
                            <td><strong>${p.projectName}</strong></td>
                            <td>${p.clientCompany}</td>
                            <td>${p.createdByName || 'N/A'}</td>
                            <td>${p.pricing?.currency || ''} ${p.pricing?.quoteValue || 'N/A'}</td>
                            <td>${p.pricing?.projectNumber ? 
                                `<span class="project-number-badge" style="font-size: 0.9rem;">${p.pricing.projectNumber}</span>` : 
                                '<span class="proposal-status status-pending">Not Assigned</span>'}</td>
                            <td><span class="proposal-status status-${p.status}">${p.status.toUpperCase()}</span></td>
                            <td>${allocationStatusDisplay}</td>
                            <td><div class="action-buttons">${actionButtons}</div></td>
                        </tr>
                    `;
                }).join('');

                contentHtml = `
                    <div class="card">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Project Name</th>
                                    <th>Client</th>
                                    <th>BDM</th>
                                    <th>Value</th>
                                    <th>Project Number</th>
                                    <th>Status</th>
                                    <th>Allocation Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${projectsHtml || '<tr><td colspan="8" class="text-center">No projects found</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                `;
            }
            // --- END OF MODIFICATION ---

            document.getElementById('mainContent').innerHTML = `
                <div class="page-header">
                    <h2>All Projects Overview</h2>
                    <div class="subtitle">Complete view of all projects across all statuses</div>
                </div>
                
                <div class="projects-summary">
                    <div class="summary-card won">
                        <h4>Won Projects</h4>
                        <div class="number">${wonProjects.length}</div>
                    </div>
                    <div class="summary-card loss">
                        <h4>Lost Projects</h4>
                        <div class="number">${lostProjects.length}</div>
                    </div>
                    <div class="summary-card pending">
                        <h4>Pending Approval</h4>
                        <div class="number">${pendingProjects.length}</div>
                    </div>
                    <div class="summary-card allocated">
                        <h4>Allocated</h4>
                        <div class="number">${allocatedProjects.length}</div>
                    </div>
                    <div class="summary-card pending" style="border-top-color: var(--warning);">
                        <h4>Pending Variations</h4>
                        <div class="number">${pendingVariations.length}</div>
                    </div>
                </div>
                
                <div class="project-filter-tabs">
                    <div class="filter-tab ${currentProjectFilter === 'all' ? 'active' : ''}" onclick="filterAllProjects('all')">
                        All Projects <span class="count">${allProjectsData.length}</span>
                    </div>
                    <div class="filter-tab ${currentProjectFilter === 'won' ? 'active' : ''}" onclick="filterAllProjects('won')">
                        Won <span class="count">${wonProjects.length}</span>
                    </div>
                    <div class="filter-tab ${currentProjectFilter === 'loss' ? 'active' : ''}" onclick="filterAllProjects('loss')">
                        Loss <span class="count">${lostProjects.length}</span>
                    </div>
                    <div class="filter-tab ${currentProjectFilter === 'pending' ? 'active' : ''}" onclick="filterAllProjects('pending')">
                        Pending <span class="count">${pendingProjects.length}</span>
                    </div>
                    <div class="filter-tab ${currentProjectFilter === 'approved' ? 'active' : ''}" onclick="filterAllProjects('approved')">
                        Approved <span class="count">${approvedProjects.length}</span>
                    </div>
                    <div class="filter-tab ${currentProjectFilter === 'toBeAllocated' ? 'active' : ''}" onclick="filterAllProjects('toBeAllocated')">
                        To Be Allocated <span class="count">${toBeAllocatedProjects.length}</span>
                    </div>
                    <div class="filter-tab ${currentProjectFilter === 'allocated' ? 'active' : ''}" onclick="filterAllProjects('allocated')">
                        Allocated <span class="count">${allocatedProjects.length}</span>
                    </div>
                    <div class="filter-tab ${currentProjectFilter === 'pendingVariations' ? 'active' : ''}" 
                         style="${pendingVariations.length > 0 ? 'background: var(--warning); color: #856404; border-color: var(--warning);' : ''}"
                         onclick="filterAllProjects('pendingVariations')">
                        Pending Variations <span class="count">${pendingVariations.length}</span>
                    </div>
                </div>
                
                ${contentHtml}
            `;
        }
        function filterAllProjects(filterType) {
            currentProjectFilter = filterType;
            renderAllProjects();
        }
  // ================================================================
// FIXED: showCreateProposalModal (Unified layout with fixed footer)
// ================================================================
function showCreateProposalModal() {
    closeModal();
    window.currentStagedFiles = []; // Reset staged files

    // Constants for limits
    const MAX_SINGLE_FILE_SIZE = 3 * 1024 * 1024 * 1024; // 3GB
    const MAX_TOTAL_UPLOAD_SIZE = 10 * 1024 * 1024 * 1024; // 10GB

    const projectTypes = [
        'Steel Detailing', 'Miscellaneous Steel', 'Connection Design', 'PE Stamping',
        'Joist Detailing', 'As-built Drawings'
    ];

    const modalHtml = `
        <div class="modal-overlay" id="createProposalOverlay">
            <div class="modal-content" style="max-width: 900px; max-height: 90vh; display: flex; flex-direction: column; padding: 0;">
                <div class="modal-header" style="padding: 1.5rem; flex-shrink: 0;">
                    <div>
                        <h2 style="margin: 0;">Create New Proposal</h2>
                        <div class="subtitle">Start a new project</div>
                    </div>
                    <span class="close-modal" onclick="closeModal()">&times;</span>
                </div>

                <div class="modal-body" style="flex: 1; overflow-y: auto; padding: 2rem;">
                    <form id="createProposalForm">
                        <div class="form-section">
                            <h4 style="margin-top: 0;">Project Details</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Project Name <span class="required">*</span></label>
                                    <input type="text" id="projectName" class="form-control" placeholder="Enter project name" required>
                                </div>
                                <div class="form-group">
                                    <label>Client Company <span class="required">*</span></label>
                                    <input type="text" id="clientCompany" class="form-control" placeholder="Enter client company" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Project Type <span class="required">*</span></label>
                                    <div class="checkbox-list" style="max-height: 150px; overflow-y: auto;">
                                        ${projectTypes.map(type => `
                                            <label class="designer-checkbox">
                                                <input type="checkbox" name="projectType" value="${type}">
                                                ${type}
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div style="margin-bottom: 1rem;">
                                        <label>Timeline (Days)</label>
                                        <input type="text" id="timeline" class="form-control" placeholder="e.g., 15">
                                    </div>
                                    <div>
                                        <label>Country</label>
                                        <select id="country" class="form-control">
                                            <option value="">Select Country</option>
                                            <option value="Australia">Australia</option>
                                            <option value="USA">USA</option>
                                            <option value="Canada">Canada</option>
                                            <option value="UK">UK</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Priority</label>
                                <select id="priority" class="form-control">
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Scope of Work <span class="required">*</span></label>
                                <textarea id="scopeOfWork" class="form-control" rows="4" placeholder="Describe the project scope..." required></textarea>
                            </div>
                            <div class="form-group">
                                <label>Comments (Optional)</label>
                                <textarea id="projectComments" class="form-control" rows="3" placeholder="Internal notes..."></textarea>
                            </div>
                        </div>

                        <div class="form-section">
                            <h4>Upload Project Files (PDF, DWG, ZIP)</h4>
                            <div class="upload-area" id="proposalUploadArea" style="padding: 2rem; border: 2px dashed var(--primary-blue);">
                                <div style="font-size: 2.5rem; margin-bottom: 1rem;">📁</div>
                                <p>Click or Drag & Drop files here</p>
                                <div style="color: var(--text-light); font-size: 0.9rem; margin-top: 0.5rem;">
                                    Max 3GB per file • Supports PDF, DOCX, DWG, ZIP, JPG, PNG
                                </div>
                                <input type="file" id="proposalFileInput" multiple style="display: none;" accept=".pdf,.docx,.doc,.dwg,.zip,.jpg,.jpeg,.png">
                            </div>
                            <div id="proposalFileUploadError" style="color: var(--danger); font-weight: 600; margin-top: 1rem;"></div>
                            
                            <div id="proposalStagedFilesContainer" style="margin-top: 1.5rem; display: none;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <strong>Selected Files:</strong>
                                    <span id="totalSizeIndicator" style="color: var(--text-light);">0 MB / 10 GB</span>
                                </div>
                                <div id="proposalStagedFilesList" style="max-height: 300px; overflow-y: auto;"></div>
                            </div>
                            <div id="status" style="margin-top: 1rem; color: var(--primary-blue); font-weight: 600;"></div>
                        </div>

                        <div class="form-section">
                            <h4>Project Links</h4>
                            <div id="linksContainer">
                                <div class="link-input-group" style="margin-bottom: 1rem;">
                                    <input type="url" class="form-control" placeholder="https://" style="margin-bottom: 0.5rem;">
                                    <input type="text" class="form-control" placeholder="Link Title (e.g., Dropbox Folder)">
                                </div>
                            </div>
                            <button type="button" onclick="addLinkField()" class="btn btn-outline btn-sm" style="width: auto;">+ Add Another Link</button>
                        </div>
                    </form>
                </div>

                <div class="modal-footer" style="padding: 1.5rem; flex-shrink: 0; background: white; border-top: 1px solid var(--border);">
                    <button type="button" onclick="closeModal()" class="btn btn-outline">Cancel</button>
                    <button type="submit" form="createProposalForm" class="btn btn-primary">Create Proposal</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // --- File Handling ---
    const uploadArea = document.getElementById('proposalUploadArea');
    const fileInput = document.getElementById('proposalFileInput');
    const errorDiv = document.getElementById('proposalFileUploadError');

    uploadArea.onclick = () => fileInput.click();

    // Drag and drop support
    uploadArea.ondragover = (e) => { e.preventDefault(); uploadArea.style.background = 'var(--light-blue)'; };
    uploadArea.ondragleave = () => { uploadArea.style.background = ''; };
    uploadArea.ondrop = (e) => {
        e.preventDefault();
        uploadArea.style.background = '';
        handleFiles(e.dataTransfer.files);
    };

    fileInput.onchange = () => handleFiles(fileInput.files);

    function handleFiles(files) {
        errorDiv.textContent = '';
        let currentTotalSize = window.currentStagedFiles.reduce((sum, f) => sum + f.size, 0);

        Array.from(files).forEach(file => {
            if (file.size > MAX_SINGLE_FILE_SIZE) {
                errorDiv.innerHTML += `<div style="margin-bottom: 0.25rem;">⚠️ Skipped <strong>${file.name}</strong>: Exceeds 3GB limit.</div>`;
                return;
            }
            if (currentTotalSize + file.size > MAX_TOTAL_UPLOAD_SIZE) {
                errorDiv.innerHTML += `<div style="margin-bottom: 0.25rem; color: var(--danger);">⛔ Skipped <strong>${file.name}</strong>: Would exceed 10GB total limit.</div>`;
                return;
            }
            // Check for duplicates
            if (!window.currentStagedFiles.some(f => f.name === file.name && f.size === file.size)) {
                window.currentStagedFiles.push(file);
                currentTotalSize += file.size;
            }
        });

        fileInput.value = ''; // Reset input
        renderStagedFiles();
    }

    window.renderStagedFiles = function() {
        const container = document.getElementById('proposalStagedFilesList');
        const mainContainer = document.getElementById('proposalStagedFilesContainer');
        const totalIndicator = document.getElementById('totalSizeIndicator');
        
        if (window.currentStagedFiles.length === 0) {
            mainContainer.style.display = 'none';
            return;
        }

        mainContainer.style.display = 'block';
        let totalSize = 0;

        container.innerHTML = window.currentStagedFiles.map((file, index) => {
            totalSize += file.size;
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f8fafc; margin-bottom: 8px; border-radius: 6px; border: 1px solid var(--border);">
                    <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        📄 <span style="font-weight: 500;">${file.name}</span> 
                        <span style="color: var(--text-light); font-size: 0.85rem; margin-left: 8px;">(${formatFileSize(file.size)})</span>
                    </div>
                    <button type="button" onclick="removeStagedFile(${index})" 
                            style="background: #fee2e2; border: none; color: var(--danger); cursor: pointer; padding: 4px 8px; border-radius: 4px;">
                        ✕
                    </button>
                </div>
            `;
        }).join('');

        // Update total size indicator
        const totalMB = (totalSize / (1024 * 1024)).toFixed(0);
        const percent = Math.min((totalSize / MAX_TOTAL_UPLOAD_SIZE) * 100, 100).toFixed(0);
        totalIndicator.textContent = `${totalMB} MB / 10 GB (${percent}%)`;
        totalIndicator.style.color = percent > 90 ? 'var(--danger)' : 'var(--text-light)';
    };

    window.removeStagedFile = function(index) {
        window.currentStagedFiles.splice(index, 1);
        renderStagedFiles();
    };

    // --- Form Submission ---
    document.getElementById('createProposalForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const selectedTypes = Array.from(document.querySelectorAll('input[name="projectType"]:checked')).map(cb => cb.value);
        if (selectedTypes.length === 0) {
            alert('Please select at least one Project Type.');
            return;
        }

        const projectLinks = [];
        document.querySelectorAll('#linksContainer .link-input-group').forEach(group => {
            const url = group.querySelector('input[type="url"]').value;
            const title = group.querySelector('input[type="text"]').value;
            if (url) projectLinks.push({ url, title: title || url, description: title });
        });

        const formData = {
            projectName: document.getElementById('projectName').value,
            clientCompany: document.getElementById('clientCompany').value,
            projectType: selectedTypes,
            country: document.getElementById('country').value,
            timeline: document.getElementById('timeline').value,
            priority: document.getElementById('priority').value,
            scopeOfWork: document.getElementById('scopeOfWork').value,
            projectComments: document.getElementById('projectComments').value,
            projectLinks: projectLinks
        };

        // DISABLE SUBMIT BUTTON
        const submitBtn = document.querySelector('#createProposalForm button[type="submit"]');
        if (submitBtn) {
             submitBtn.disabled = true;
             submitBtn.textContent = 'Creating...';
        }

        try {
            // 1. Create Proposal
            const response = await apiCall('proposals', { method: 'POST', body: JSON.stringify(formData) });
            if (!response.success || !response.data) throw new Error('Invalid response from server');
            const proposalId = response.data.id;

            // 2. Upload Files (using new direct method with visual status)
            if (window.currentStagedFiles.length > 0) {
                const statusDiv = document.getElementById('status');
                if (statusDiv) statusDiv.style.display = 'block';
                
                let uploadCount = 0;
                for (const file of window.currentStagedFiles) {
                    uploadCount++;
                    if (statusDiv) statusDiv.innerHTML = `⏳ Uploading file ${uploadCount} of ${window.currentStagedFiles.length}: <strong>${file.name}</strong>...`;
                    
                    try {
                        await uploadFileDirectly(file, proposalId, 'project');
                        console.log(`✅ Uploaded: ${file.name}`);
                    } catch (uploadError) {
                        console.error(`❌ Failed to upload ${file.name}:`, uploadError);
                        alert(`Failed to upload ${file.name}: ${uploadError.message}\n\nYou can try uploading it again later from the proposal details.`);
                    }
                }
                 if (statusDiv) statusDiv.innerHTML = '✅ All files processed.';
            }

            // 3. Save Links (if added via files endpoint for consistency)
            if (projectLinks.length > 0) {
                await apiCall('files', {
                    method: 'POST',
                    body: JSON.stringify({ links: projectLinks, proposalId: proposalId, fileType: 'link' })
                });
            }

            // 4. Notifications
             try {
                 const userName = (currentUser && (currentUser.displayName || currentUser.email)) ? 
                                  (currentUser.displayName || currentUser.email) : 'System User';
                 const userEmail = (currentUser && currentUser.email) ? currentUser.email : '';

                 await triggerEmailNotification('project.submitted', {
                    projectName: formData.projectName,
                    createdBy: userName,
                    bdmName: userName,
                    bdmEmail: userEmail,
                    clientName: formData.clientCompany,
                    projectId: proposalId
                });
            } catch (err) { console.warn("Email notification non-fatal error:", err); }

            alert('✅ Proposal created successfully!');
            closeModal();
            showProposals();
        } catch (error) {
            console.error('Creation failed:', error);
            alert(`Creation failed: ${error.message}`);
             // Re-enable button on error
            if (submitBtn) {
                 submitBtn.disabled = false;
                 submitBtn.textContent = 'Create Proposal';
            }
        }
    });
}
      

      function addLinkField() {
    const container = document.getElementById('linksContainer');
    const newLinkGroup = document.createElement('div');
    newLinkGroup.className = 'link-input-group';
    newLinkGroup.style.marginBottom = '1rem';
    newLinkGroup.innerHTML = `
        <input type="url" class="form-control" placeholder="Enter URL" style="margin-bottom: 0.5rem;">
        <input type="text" class="form-control" placeholder="Link title/description (optional)">
        <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()" style="margin-top: 0.5rem;">Remove</button>
    `;
    container.appendChild(newLinkGroup);
}

        async function viewProposal(proposalId) {
            // ... (This function remains unchanged)
            try {
                showLoading();
                const { success, data } = await apiCall(`proposals?id=${proposalId}`);
                if (success && data) {
                    const filesResponse = await apiCall(`files?proposalId=${proposalId}`);
                    const files = filesResponse.success ? filesResponse.data : [];
                    renderProposalDetailModal(data, files);
                } else {
                    throw new Error('Failed to load proposal');
                }
            } catch (error) {
                alert(`Error fetching proposal: ${error.message}`);
            } finally {
                hideLoading();
            }
        }

        function renderProposalDetailModal(p, files = []) {
             console.log('Rendering proposal modal. User Role:', currentUserRole, 'Proposal Status:', p.status); // DEBUG Line
            const projectFiles = files.filter(f => !f.fileType || f.fileType === 'project');
            const estimationFiles = files.filter(f => f.fileType === 'estimation');
            const linkFiles = files.filter(f => f.fileType === 'link');
            let actionsHtml = '';

            // Role-based actions - normalize status to lowercase for comparison
            const statusLower = (p.status || '').toLowerCase().replace(/\s+/g, '_');
            
            // ESTIMATOR: Show Add Estimation button
            if (currentUserRole === 'estimator' && (statusLower === 'draft' || statusLower === 'pending_estimation' || !p.estimation)) {
                actionsHtml = `<button class="btn btn-primary" onclick="showEstimationModal('${p.id}')">Add Estimation</button>`;
            
            // COO: Show pricing form when estimation is done
            } else if (currentUserRole === 'coo' && (statusLower === 'estimated' || statusLower === 'won' || statusLower === 'pricing_complete' || statusLower === 'pending_approval' || statusLower === 'pending_pricing' || p.estimation)) {
                // If no pricing yet, show pricing button
                if (!p.pricing || !p.pricing.projectNumber) {
                    actionsHtml = `<button class="btn btn-success" onclick="showCOOPricingForm('${p.id}')">Set Pricing</button>`;
                } else {
                    actionsHtml = getProposalAllocationButton(p);
                }
            
            // MODIFIED: Director can approve/reject proposals with pending_approval status or after pricing
            } else if (currentUserRole === 'director') { 
                if (statusLower === 'pending_approval' || statusLower === 'pending_director_approval' || statusLower === 'pricing_complete' || (p.pricing && p.pricing.projectNumber && statusLower !== 'approved' && statusLower !== 'rejected' && statusLower !== 'won' && statusLower !== 'lost')) {
                    actionsHtml = `
                        <button class="btn btn-danger" onclick="showRejectModal('${p.id}')">❌ Reject</button>
                        <button class="btn btn-success" onclick="showApproveModal('${p.id}')">✅ Approve</button>
                    `;
                } else if (statusLower === 'won') {
                    // Get allocation/view buttons if status is 'won'
                    actionsHtml = getProposalAllocationButton(p);
                } else if (statusLower === 'approved') {
                    actionsHtml = '<span style="color: var(--success); font-weight: 600;">✅ Already Approved</span>';
                } else if (statusLower === 'rejected') {
                    actionsHtml = '<span style="color: var(--danger); font-weight: 600;">❌ Already Rejected</span>';
                }
            
            } else if (currentUserRole === 'bdm' && statusLower === 'approved') {
                actionsHtml = `<button class="btn btn-success" onclick="submitToClient('${p.id}')">Submit to Client</button>`;
                 // BDM can also directly mark as WON/LOST if approved
                 actionsHtml += ` <button class="btn btn-success btn-sm" onclick="markProposalWon('${p.id}')" style="margin-left: 10px;">✅ WON</button>`;
                 actionsHtml += ` <button class="btn btn-danger btn-sm" onclick="markProposalLost('${p.id}')" style="margin-left: 10px;">❌ LOST</button>`;
            } else if (currentUserRole === 'bdm' && statusLower === 'submitted_to_client') {
                 actionsHtml = `
                    <button class="btn btn-success btn-sm" onclick="markProposalWon('${p.id}')">✅ WON</button>
                    <button class="btn btn-danger btn-sm" onclick="markProposalLost('${p.id}')" style="margin-left: 10px;">❌ LOST</button>
                 `;
            }


            // BDM delete button - only for own proposals and if not too far in workflow
      // BDM edit and delete buttons - only for own proposals and if not allocated
        if (currentUserRole === 'bdm' && p.createdByUid === currentUser.uid) {
            // Only prevent edit/delete if proposal is allocated to a Design Manager
            if (!p.allocationStatus || p.allocationStatus !== 'allocated') {
                actionsHtml += ` 
                    <button class="btn btn-primary btn-sm" 
                            onclick="editProposal('${p.id}')" 
                            style="margin-left: 10px;">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-danger btn-sm" 
                            onclick="deleteProposal('${p.id}')" 
                            style="margin-left: 10px;">
                        🗑️ Delete
                    </button>
                `;
            }
        }

        // COO and Director can also edit proposals
        if (['coo', 'director'].includes(currentUserRole) && (!p.allocationStatus || p.allocationStatus !== 'allocated')) {
            actionsHtml += ` 
                <button class="btn btn-primary btn-sm" 
                        onclick="editProposal('${p.id}')" 
                        style="margin-left: 10px;">
                    ✏️ Edit
                </button>
            `;
        }
            // Build links section
            let linksHtml = '';
            if (linkFiles.length > 0 || (p.projectLinks && p.projectLinks.length > 0)) {
                const allLinks = [
                    ...linkFiles,
                    ...(p.projectLinks || []).map(link => ({
                        id: link.url, // Use URL as temporary ID if not a file entity
                        url: link.url,
                        originalName: link.title || link.url,
                        linkDescription: link.description || '',
                        canDelete: false // Cannot delete proposalLinks directly here
                    }))
                ];
                linksHtml = `
                    <div class="form-section">
                        <h4>Project Links 🔗</h4>
                        ${allLinks.map(link => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: #fff; border-radius: 5px; margin-bottom: 0.5rem; border: 1px solid var(--border);">
                                <div style="flex: 1;">
                                    <span>🔗 ${link.originalName || link.url}</span>
                                    ${link.linkDescription ? `<div style="font-size: 0.85rem; color: var(--text-light);">${link.linkDescription}</div>` : ''}
                                </div>
                                <div>
                                    <button class="btn btn-outline btn-sm" onclick="window.open('${link.url}', '_blank')">Open Link</button>
                                    ${link.canDelete ? `
                                        <button class="btn btn-warning btn-sm" onclick="editLink('${link.id}', '${p.id}')">✏️ Edit</button>
                                        <button class="btn btn-danger btn-sm" onclick="deleteLink('${link.id}', '${p.id}')">🗑️ Delete</button>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            // Build estimation files section with access control
            let estimationFilesHtml = '';
            if (estimationFiles.length > 0) {
                if (canAccessEstimationFile(p.status)) {
                    estimationFilesHtml = `
                        <div class="form-section">
                            <h4>Estimation Files ${getFileAccessIndicator({ fileType: 'estimation' }, p.status)}</h4>
                            ${estimationFiles.map(file => `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: #fff; border-radius: 5px; margin-bottom: 0.5rem; border: 1px solid var(--border);">
                                    <span>📊 ${file.originalName}</span>
                                    <div>
                                        <button class="btn btn-outline btn-sm" onclick="window.open('${file.url}', '_blank')">View</button>
                                        <button class="btn btn-primary btn-sm" onclick="downloadFile('${file.url}', '${file.originalName}')">Download</button>
                                        ${file.canDelete ? `
                                            <button class="btn btn-danger btn-sm" onclick="deleteFile('${file.id}'); closeModal(); viewProposal('${p.id}');">🗑️ Delete</button>
                                        ` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                } else {
                    estimationFilesHtml = `
                        <div class="form-section">
                            <h4>Estimation Files ${getFileAccessIndicator({ fileType: 'estimation' }, p.status)}</h4>
                            <div class="warning-message">
                                <strong>Access Restricted:</strong> Estimation files available after Director approval.
                            </div>
                        </div>
                    `;
                }
            }

           const modalHtml = `
                <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
                    <div class="modal-content" style="max-width: 1000px; max-height: 90vh; display: flex; flex-direction: column;">
                        
                        <div class="modal-header" style="text-align: left; flex-shrink: 0;"> 
                            <div> 
                                <h2 style="color: white; margin-bottom: 0;">${p.projectName}</h2> 
                                <div class="subtitle" style="color: rgba(255,255,255,0.9); text-align: left;">${p.clientCompany}</div> 
                            </div>
                            <span class="close-modal" onclick="closeModal()">&times;</span> 
                        </div>

                        <div class="modal-body" style="overflow-y: auto; flex: 1; padding: 2rem 3rem;">
                            <div style="margin-bottom: 2rem;"> 
                                <strong>Status:</strong>
                                <span class="proposal-status status-${p.status.toLowerCase().replace(/_/g, '-')}">
                                    ${p.status.replace(/_/g, ' ').toUpperCase()}
                                </span>
                            </div>

                            <div style="display: grid; gap: 2rem;"> 
                                <div class="form-section">
                                    <h4>Project Details</h4>
                                    <p><strong>Scope:</strong> ${p.scopeOfWork || 'N/A'}</p>
                                    <p><strong>Timeline:</strong> ${p.timeline || 'N/A'}</p>
                                    <p><strong>Country:</strong> ${p.country || 'N/A'}</p>
                                    <p><strong>Created by:</strong> ${p.createdByName || 'N/A'} on ${formatDate(p.createdAt)}</p>
                                </div>

                                ${linksHtml}

                                <div class="form-section">
                                    <h4>Project Files ${getFileAccessIndicator({ fileType: 'project' }, p.status)}</h4>
                                    ${projectFiles.length ? projectFiles.map(file => `
                                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: #fff; border-radius: 5px; margin-bottom: 0.5rem; border: 1px solid var(--border);">
                                            <span>📄 ${file.originalName}</span>
                                            <div>
                                                <button class="btn btn-outline btn-sm" onclick="window.open('${file.url}', '_blank')">View</button>
                                                <button class="btn btn-primary btn-sm" onclick="downloadFile('${file.url}', '${file.originalName}')">Download</button>
                                                ${file.canDelete ? `
                                                    <button class="btn btn-danger btn-sm" onclick="deleteFile('${file.id}'); closeModal(); viewProposal('${p.id}');">🗑️ Delete</button>
                                                ` : ''}
                                            </div>
                                        </div>
                                    `).join('') : '<p>No project files uploaded.</p>'}
                                </div>

                              ${p.estimation ? `
                                    <div class="form-section">
                                        <h4>Estimation Details</h4>
                                        
                                        <p><strong>Total Hours:</strong> ${p.estimation.manhours || p.estimation.totalHours || 'N/A'}</p>
                                        
                                        <p><strong>Tonnage:</strong> ${p.estimation.tonnage || 'N/A'}</p>
                                        
                                        <p><strong>Services:</strong> ${p.estimation.services?.join(', ') || 'N/A'}</p>
                                        
                                        <p><strong>Estimated By:</strong> ${p.estimation.estimatorName || p.estimation.estimatedByName || p.estimation.estimatedBy || 'N/A'}</p>
                                        
                                        ${p.estimation.notes ? `<p><strong>Notes:</strong> ${p.estimation.notes}</p>` : ''}
                                    </div>
                                ` : ''}

                                ${estimationFilesHtml}

                              ${p.pricing ? `
    <div class="form-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4>Pricing Information 💰</h4>
            ${['coo', 'director'].includes(currentUserRole) && p.status !== 'won' && p.status !== 'lost' ? `
                <button class="btn btn-warning btn-sm" onclick="event.stopPropagation(); showEditPricingModal('${p.id}')">
                    ✏️ Edit Pricing
                </button>
            ` : ''}
        </div>
        <p><strong>Project Number:</strong> ${p.pricing.projectNumber || 'N/A'}</p>
        <p><strong>Quote Value:</strong> ${p.pricing.currency || ''} ${p.pricing.quoteValue || 'N/A'}</p>
        <p><strong>Profit Margin:</strong> ${p.pricing.profitMargin || 'N/A'}%</p>
        <p><strong>Hourly Rate:</strong> ${p.pricing.hourlyRate || 'N/A'}</p>
        <p><strong>Priced By:</strong> ${p.pricing.pricedBy || 'N/A'}</p>
        ${p.pricing.costBreakdown ? `
            <div style="margin-top: 1rem; padding: 1rem; background: var(--light-blue); border-radius: 8px;">
                <strong>Cost Breakdown:</strong>
                <div style="margin-top: 0.5rem;">
                    <span>Material: ${p.pricing.currency || ''} ${p.pricing.costBreakdown.material || 0}</span> |
                    <span>Labor: ${p.pricing.currency || ''} ${p.pricing.costBreakdown.labor || 0}</span> |
                    <span>Overhead: ${p.pricing.currency || ''} ${p.pricing.costBreakdown.overhead || 0}</span> |
                    <span>Other: ${p.pricing.currency || ''} ${p.pricing.costBreakdown.other || 0}</span>
                </div>
            </div>
        ` : ''}
        ${p.pricing.notes ? `
            <div style="margin-top: 0.5rem;">
                <strong>Notes:</strong> 
                <p style="white-space: pre-wrap; background: #f9fafb; padding: 0.75rem; border-radius: 4px; margin-top: 0.25rem;">${p.pricing.notes}</p>
            </div>
        ` : ''}
    </div>
` : ''}

                                ${p.directorApproval ? `
                                    <div class="form-section">
                                        <h4>Director Approval</h4>
                                        <p><strong>Status:</strong> ${p.directorApproval.approved ? 'Approved' : 'Rejected'}</p>
                                        ${p.directorApproval.comments ? `<p><strong>Comments:</strong> ${p.directorApproval.comments}</p>` : ''}
                                        <p><strong>By:</strong> ${p.directorApproval.approvedBy || p.directorApproval.rejectedBy || 'N/A'}</p>
                                        <p><strong>Date:</strong> ${formatDate(p.directorApproval.approvedAt || p.directorApproval.rejectedAt)}</p>
                                    </div>
                                ` : ''}
                            </div>
                        </div>

                        <div class="modal-footer" style="flex-shrink: 0; padding: 1.5rem 3rem; background: #f9fafb; border-top: 1px solid var(--border);"> 
                            <button onclick="closeModal()" class="btn btn-outline">Close</button>
                            ${actionsHtml}
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }


        function getFileAccessIndicator(file, proposalStatus) {
            // ... (This function remains unchanged)
            if (!file.fileType || file.fileType === 'project') {
                return '<span class="file-access-indicator access-full">📁 Project File</span>';
            }
            if (file.fileType === 'estimation') {
                if (currentUserRole === 'bdm') {
                    if (proposalStatus === 'approved' || proposalStatus === 'submitted_to_client') {
                        return '<span class="file-access-indicator access-full">📊 Estimation (Approved)</span>';
                    } else {
                        return '<span class="file-access-indicator access-pending">📊 Estimation (Pending Approval)</span>';
                    }
                } else {
                    return '<span class="file-access-indicator access-full">📊 Estimation File</span>';
                }
            }
            return '';
        }
        function canAccessEstimationFile(proposalStatus) {
            // ... (This function remains unchanged)
            if (['estimator', 'coo', 'director'].includes(currentUserRole)) {
                return true;
            }
            if (currentUserRole === 'bdm') {
                return proposalStatus === 'approved' || proposalStatus === 'submitted_to_client';
            }
            return false;
        }
      function showEstimationModal(id, projectName = 'N/A') {
    closeModal();
    const modalHtml = `
        <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
            <div class="modal-content" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2>Manhour Entry & Estimation</h2>
                    <span class="close-modal" onclick="closeModal()">&times;</span>
                </div>
                <form id="estimationForm" class="modal-form">
                    <input type="hidden" id="estProjectName" value="${projectName}">
                    
                    <div class="form-section">
                        <h4>View Project Files</h4>
                        <div id="projectFilesView">Loading...</div>
                    </div>

                    <div class="form-section">
                        <h4>Manhour Breakdown</h4>
                        <div class="input-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group" style="flex: 1;">
                                <label for="tonnageInput">Tonnage (Optional)</label>
                                <input type="number" id="tonnageInput" class="form-control" value="0" min="0" step="0.01" oninput="handleTonnageInput()">
                            </div>
                            <div class="form-group" style="flex: 1; display: flex; align-items: center; padding-top: 25px;">
                                <label style="cursor: pointer; display: flex; align-items: center;">
                                    <input type="checkbox" id="useTonnageForDesign" onchange="toggleDesignHours()" style="width: 20px; height: 20px; margin-right: 10px;">
                                    Use Tonnage to calculate Design Hours
                                </label>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                            <div class="form-group"><label>Design Hours</label><input type="number" id="designHours" class="form-control" value="0" min="0" step="0.5" oninput="calculateTotalHours()" required></div>
                            <div class="form-group"><label>Detailing Hours</label><input type="number" id="detailingHours" class="form-control" value="0" min="0" step="0.5" oninput="calculateTotalHours()" required></div>
                            <div class="form-group"><label>Checking Hours</label><input type="number" id="checkingHours" class="form-control" value="0" min="0" step="0.5" oninput="calculateTotalHours()" required></div>
                            <div class="form-group"><label>Revision Hours</label><input type="number" id="revisionHours" class="form-control" value="0" min="0" step="0.5" oninput="calculateTotalHours()"></div>
                            <div class="form-group"><label>Project Management</label><input type="number" id="pmHours" class="form-control" value="0" min="0" step="0.5" oninput="calculateTotalHours()"></div>
                            <div class="form-group"><label>Total Hours</label><input type="number" id="totalHours" class="form-control" style="background: #ffffff; font-weight: bold;" value="0" oninput="calculateTotalHours()"></div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h4>Select Services</h4>
                        <div class="service-grid">
                            <label class="service-item"><input type="checkbox" name="services" value="Steel Detailing"><span>Steel Detailing</span></label>
                            <label class="service-item"><input type="checkbox" name="services" value="Miscellaneous Steel"><span>Miscellaneous Steel</span></label>
                            <label class="service-item"><input type="checkbox" name="services" value="Connection Design"><span>Connection Design</span></label>
                            <label class="service-item"><input type="checkbox" name="services" value="PE Stamping"><span>PE Stamping</span></label>
                            <label class="service-item"><input type="checkbox" name="services" value="Joist Detailing"><span>Joist Detailing</span></label>
                            <label class="service-item"><input type="checkbox" name="services" value="As-built Drawings"><span>As-built Drawings</span></label>
                            <label class="service-item"><input type="checkbox" name="services" value="Engineering Services"><span>Engineering Services</span></label>
                        </div>
                    </div>

                    <div class="form-section">
                        <h4>Attachments</h4>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <label style="font-weight: 600; margin-bottom: 0.5rem; display: block;">Upload BOQ & Calculation Files</label>
                            <div class="upload-area" id="boqUploadArea" onclick="document.getElementById('boqFileInput').click()" style="padding: 1.5rem;">
                                <div style="font-size: 2rem;">📊</div>
                                <p>Click to upload BOQ, MTO, Excel files</p>
                                <input type="file" id="boqFileInput" multiple style="display: none;" 
                                       accept=".xlsx,.xls,.csv,.pdf,.doc,.docx">
                            </div>
                            <div id="boqFilePreview" style="margin-top: 0.5rem;"></div>
                        </div>

                        <div>
                            <label style="font-weight: 600; margin-bottom: 0.5rem; display: block;">Upload Images (Drawings, Sketches)</label>
                            <div class="upload-area" id="imageUploadArea" onclick="document.getElementById('imageFileInput').click()" style="padding: 1.5rem; border-color: var(--success);">
                                <div style="font-size: 2rem;">🖼️</div>
                                <p>Click to upload Images</p>
                                <input type="file" id="imageFileInput" multiple style="display: none;" 
                                       accept="image/png, image/jpeg, image/jpg, .pdf">
                            </div>
                            <div id="imageFilePreview" style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 1rem;"></div>
                        </div>
                    </div>

                    <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                        <button type="button" onclick="closeModal()" class="btn btn-outline">Cancel</button>
                        <button type="button" onclick="saveEstimation('${id}')" class="btn btn-success">Save Estimation</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    loadProjectFiles(id);

    // BOQ File Listener
    document.getElementById('boqFileInput').addEventListener('change', function() {
        const files = this.files;
        const preview = document.getElementById('boqFilePreview');
        if (files.length > 0) {
            preview.innerHTML = Array.from(files).map(f => 
                `<div style="padding: 5px; background: #f8f9fa; border: 1px solid #dee2e6; margin-top: 5px; border-radius: 4px;">
                    📊 ${f.name} (${(f.size/1024).toFixed(0)} KB)
                 </div>`
            ).join('');
        } else {
            preview.innerHTML = '';
        }
    });

    // NEW: Image File Listener with Thumbnail Preview
    document.getElementById('imageFileInput').addEventListener('change', function() {
        const files = Array.from(this.files);
        const previewContainer = document.getElementById('imageFilePreview');
        previewContainer.innerHTML = ''; // Clear previous previews

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const isImage = file.type.startsWith('image/');
                const div = document.createElement('div');
                div.style.cssText = 'width: 80px; height: 80px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; position: relative;';
                
                if (isImage) {
                    div.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;" title="${file.name}">`;
                } else {
                    // Fallback for non-images (like PDFs if allowed in standard input)
                    div.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f8f9fa; font-size: 2rem;">📄</div>`;
                }
                previewContainer.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    });

    // Service selection toggling
    document.querySelectorAll('.service-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
            }
            this.classList.toggle('checked', this.querySelector('input[type="checkbox"]').checked);
        });
    });
    
    // ✅ FIX: Initialize calculation and unlock all fields
    setTimeout(() => {
        calculateTotalHours();
    }, 100);
}

      async function saveEstimation(proposalId) {
    const services = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value);
    
    // Get both values
    const totalHours = parseFloat(document.getElementById('totalHours').value) || 0;
    const tonnage = parseFloat(document.getElementById('tonnageInput').value) || 0;
    
    // ✅ CRITICAL: Check if tonnage checkbox is checked
    const useTonnageCheckbox = document.getElementById('useTonnageForDesign');
    const usedTonnageForDesign = useTonnageCheckbox ? useTonnageCheckbox.checked : false;

    // MODIFIED VALIDATION: Allow if EITHER Total Hours OR Tonnage is greater than 0
    if (totalHours === 0 && tonnage === 0) {
        return alert('Please enter either Manhours OR Tonnage to proceed.');
    }
    if (services.length === 0) return alert('Please select at least one service.');

    const estimationData = {
        tonnage: tonnage,
        
        // ✅ CRITICAL NEW FIELDS FOR ALLOCATION LOGIC
        usedTonnageForDesign: usedTonnageForDesign,
        tonnageValue: usedTonnageForDesign ? tonnage : null,
        
        designHours: document.getElementById('designHours').value || 0,
        detailingHours: document.getElementById('detailingHours').value || 0,
        checkingHours: document.getElementById('checkingHours').value || 0,
        revisionHours: document.getElementById('revisionHours').value || 0,
        pmHours: document.getElementById('pmHours').value || 0,
        totalHours: totalHours,
        manhours: totalHours, // <-- ✅ THIS IS THE FIX
        services: services,
        notes: 'Estimation completed'
    };

    try {
        showLoading();
        
        // 1. Collect ALL files from BOTH inputs (BOQ and Images)
        const boqFiles = Array.from(document.getElementById('boqFileInput').files);
        const imageFiles = Array.from(document.getElementById('imageFileInput').files);
        const allFiles = [...boqFiles, ...imageFiles];

        // 2. Upload if any files exist
        if (allFiles.length > 0) {
            const formData = new FormData();
            allFiles.forEach(file => formData.append('files', file));
            formData.append('proposalId', proposalId);
            formData.append('fileType', 'estimation');
            await apiCall('files', { method: 'POST', body: formData });
        }

        // 3. Save Estimation Data
        const response = await apiCall(`proposals?id=${proposalId}`, {
            method: 'PUT',
            body: JSON.stringify({ action: 'add_estimation', data: estimationData })
        });

        if (response.success) {
            alert('Estimation saved successfully!');
            const projectName = document.getElementById('estProjectName')?.value || 'Unknown Project';
            // Ensure triggerEmailNotification exists before calling
            if (typeof triggerEmailNotification === 'function') {
                 triggerEmailNotification('estimation.complete', { projectName: projectName });
            }
            closeModal();
            showProposals();
        } else {
             throw new Error(response.error || 'Failed to save estimation');
        }
    } catch (error) {
        alert('Error saving estimation: ' + error.message);
    } finally {
        hideLoading();
    }
}

        async function loadProjectFiles(proposalId) {
            // ... (This function remains unchanged)
            try {
                const { success, data } = await apiCall(`files?proposalId=${proposalId}`);
                const projectFilesView = document.getElementById('projectFilesView');
                if (success && data) {
                    const projectFiles = data.filter(f => !f.fileType || f.fileType === 'project');
                    const filesHtml = projectFiles.length ? projectFiles.map(file => `
                        <div class="action-item" style="margin-bottom: 1rem; padding: 1rem;">
                            <div class="action-content"><strong>📄 ${file.originalName}</strong></div>
                            <div class="action-buttons">
                                <button class="btn btn-outline btn-sm" onclick="window.open('${file.url}', '_blank')">VIEW</button>
                                <button class="btn btn-primary btn-sm" onclick="downloadFile('${file.url}', '${file.originalName}')">DOWNLOAD</button>
                            </div>
                        </div>
                    `).join('') : '<p>No project files available.</p>';
                    if (projectFilesView) projectFilesView.innerHTML = filesHtml;
                }
            } catch (error) {
                const projectFilesView = document.getElementById('projectFilesView');
                if (projectFilesView) projectFilesView.innerHTML = `<p class="error-message">Error loading files: ${error.message}</p>`;
            }
        }

        function downloadFile(url, filename) {
            // ... (This function remains unchanged)
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function showPricingModal(id) {
            // ... (This function remains unchanged, though it is no longer called by the modal)
            closeModal();
            apiCall(`proposals?id=${id}`).then(response => {
                const proposal = response.data;
                const estimation = proposal.estimation || {};
                const modalHtml = `
                    <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
                        <div class="modal-content" style="max-width: 1200px;">
                            <div class="modal-header"><h2>Project Editor - COO Full Access</h2></div>
                            <form id="pricingForm" class="modal-form">
                                <div class="form-section">
                                    <h4>Current Estimation Summary</h4>
                                    <p><strong>Total Hours:</strong> ${estimation.totalHours || 'N/A'}</p>
                                    <p><strong>Services:</strong> ${estimation.services?.join(', ') || 'N/A'}</p>
                                </div>
                                <div class="form-section">
                                    <h4>Edit Services</h4>
                                    <div class="service-grid">
                                        ${['Steel Detailing', 'Miscellaneous Steel Detailing', 'Connection Design', 'PE Stamping', 'Joist Detailing', 'As-built Drawings'].map(service => `
                                            <label class="service-item ${estimation.services?.includes(service) ? 'checked' : ''}">
                                                <input type="checkbox" name="editServices" value="${service}" ${estimation.services?.includes(service) ? 'checked' : ''}>
                                                <span>${service}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                                <div class="form-section">
                                    <h4>Pricing Details</h4>
                                    <div class="form-row">
                                        <div class="form-group"><label>Hourly Rate ($)</label><input type="number" id="hourlyRate" class="form-control" placeholder="85.00" step="0.01" required></div>
                                        <div class="form-group"><label>Profit Margin (%)</label><input type="number" id="profitMargin" class="form-control" placeholder="25.0" step="0.1" required></div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group"><label>Final Quote Value ($)</label><input type="number" id="quoteValue" class="form-control" placeholder="0.00" step="0.01" required></div>
                                        <div class="form-group"><label>Currency</label><select id="currency" class="form-control"><option value="USD">USD</option><option value="AUD">AUD</option></select></div>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                                    <button type="button" onclick="closeModal()" class="btn btn-outline">Cancel</button>
                                    <button type="button" onclick="savePricing('${id}')" class="btn btn-primary">Save & Send to Director</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', modalHtml);

                document.getElementById('hourlyRate')?.addEventListener('input', calculateQuote);
                document.getElementById('profitMargin')?.addEventListener('input', calculateQuote);
                function calculateQuote() {
                    const rate = parseFloat(document.getElementById('hourlyRate').value) || 0;
                    const margin = parseFloat(document.getElementById('profitMargin').value) || 0;
                    const hours = estimation.totalHours || 0;
                    const baseValue = rate * hours;
                    const quoteValue = baseValue * (1 + margin / 100);
                    document.getElementById('quoteValue').value = quoteValue.toFixed(2);
                }

                document.querySelectorAll('.service-item').forEach(item => {
                    item.addEventListener('click', function(e) {
                        if (e.target.tagName !== 'INPUT') {
                            const checkbox = this.querySelector('input[type="checkbox"]');
                            checkbox.checked = !checkbox.checked;
                        }
                        this.classList.toggle('checked', this.querySelector('input[type="checkbox"]').checked);
                    });
                });
            });
        }

        async function savePricing(id) {
            // ... (This function remains unchanged, though it is no longer called by the modal)
            const services = Array.from(document.querySelectorAll('input[name="editServices"]:checked')).map(cb => cb.value);
            const data = {
                hourlyRate: document.getElementById('hourlyRate').value,
                profitMargin: document.getElementById('profitMargin').value,
                quoteValue: document.getElementById('quoteValue').value,
                currency: document.getElementById('currency').value,
                updatedServices: services
            };
            try {
                showLoading();
                await handleProposalAction(id, 'set_pricing', data, 'Pricing updated and sent to Director!');
            } catch (error) {
                alert('Error saving pricing: ' + error.message);
            } finally {
                hideLoading();
            }
        }

        async function handleProposalAction(id, action, data = {}, msg) {
            // ... (This function remains unchanged)
            try {
                showLoading();
                const { success } = await apiCall(`proposals?id=${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ action, data })
                });
                if (success) {
                    closeModal();
                    showProposals();
                    alert(msg);
                }
            } catch(err) {
                alert(`Error: ${err.message}`);
            } finally {
                hideLoading();
            }
        }

        // Show Approve Modal with proper dialog
        function showApproveModal(proposalId) {
            closeModal(); // Close proposal detail modal first
            
            const modalHtml = `
                <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
                    <div class="modal-content" style="max-width: 600px;">
                        <div class="modal-header" style="background: var(--success); color: white;">
                            <h2>✅ Approve Proposal</h2>
                        </div>
                        <div class="modal-body" style="padding: 2rem;">
                            <div class="success-message" style="margin-bottom: 1.5rem;">
                                <strong>Approve this proposal?</strong>
                                <p style="margin-top: 0.5rem;">The proposal will be marked as approved and the BDM will be notified to submit it to the client.</p>
                            </div>
                            
                            <div class="form-group">
                                <label for="approveComments">Comments (Optional)</label>
                                <textarea id="approveComments" class="form-control" rows="4" 
                                    placeholder="Add any approval comments or special instructions..."></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button onclick="closeModal(); viewProposal('${proposalId}')" class="btn btn-outline">Cancel</button>
                            <button onclick="confirmApproveProposal('${proposalId}')" class="btn btn-success">
                                ✅ Confirm Approval
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }

        // Confirm and execute approval
        async function confirmApproveProposal(id) {
            const comments = document.getElementById('approveComments').value;
            
            try {
                showLoading();
           const response = await apiCall(`proposals?id=${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'approve_proposal', // <-- CORRECT
                        data: { comments: comments || 'Approved by Director' }
                    })
                });
                
                if (response.success) {
                    closeModal();
                    showNotification('✅ Proposal approved successfully!', 'success');
                    // Refresh the view
                    if (typeof showProposals === 'function') {
                        showProposals();
                    } else if (typeof showDashboard === 'function') {
                        showProposals();
                    }
                } else {
                    throw new Error(response.error || 'Failed to approve proposal');
                }
            } catch (error) {
                console.error('Error approving proposal:', error);
                alert('Error approving proposal: ' + error.message);
            } finally {
                hideLoading();
            }
        }

        // Show Reject Modal with proper dialog
        function showRejectModal(proposalId) {
            closeModal(); // Close proposal detail modal first
            
            const modalHtml = `
                <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
                    <div class="modal-content" style="max-width: 600px;">
                        <div class="modal-header" style="background: var(--danger); color: white;">
                            <h2>❌ Reject Proposal</h2>
                        </div>
                        <div class="modal-body" style="padding: 2rem;">
                        <input type="hidden" id="approveProjectName" value="${projectName}">
                            <div class="error-message" style="margin-bottom: 1.5rem;">
                                <strong>Reject this proposal?</strong>
                                <p style="margin-top: 0.5rem;">The proposal will be marked as rejected and sent back for revision. Please provide a reason.</p>
                            </div>
                            
                            <div class="form-group">
                                <label for="rejectReason">Reason for Rejection <span class="required">*</span></label>
                                <textarea id="rejectReason" class="form-control" rows="4" 
                                    placeholder="Please explain why this proposal is being rejected..." required></textarea>
                                <small class="form-text">This information will be sent to the team for revision.</small>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button onclick="closeModal(); viewProposal('${proposalId}')" class="btn btn-outline">Cancel</button>
                            <button onclick="confirmRejectProposal('${proposalId}')" class="btn btn-danger">
                                ❌ Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }

        // Confirm and execute rejection
        async function confirmRejectProposal(id) {
            const reason = document.getElementById('rejectReason').value.trim();
            
            if (!reason) {
                alert('Please provide a reason for rejection');
                return;
            }
            
            try {
                showLoading();
                const response = await apiCall(`proposals?id=${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'reject_proposal', // <-- CORRECT
                        data: { reason: reason } // Also fix the data key from 'comments' to 'reason'
                    })
                });
                
                if (response.success) {
                    closeModal();
                    showNotification('Proposal rejected and sent for revision', 'warning');
                    // Refresh the view
                    if (typeof showProposals === 'function') {
                        showProposals();
                    } else if (typeof showDashboard === 'function') {
                        showProposals();
                    }
                } else {
                    throw new Error(response.error || 'Failed to reject proposal');
                }
            } catch (error) {
                console.error('Error rejecting proposal:', error);
                alert('Error rejecting proposal: ' + error.message);
            } finally {
                hideLoading();
            }
        }

        // Keep old functions for backward compatibility but use new modals
        async function approveProposal(id) {
            showApproveModal(id);
        }
        
        async function rejectProposal(id) {
            showRejectModal(id);
        }
        async function submitToClient(id) {
            // ... (This function remains unchanged)
            const method = prompt("Submission method:", "email");
            if (!method) return;
            try {
                showLoading();
                const response = await apiCall(`proposals?id=${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ action: 'submit_to_client', data: { method } })
                });
                if (response.success) {
                    alert('✅ Proposal submitted to client!');
                    closeModal();
                    showProposals();
                } else {
                    throw new Error(response.error || 'Submit failed');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                hideLoading();
            }
        }
        async function markProposalWon(proposalId) {
            // ... (This function remains unchanged)
            if (!confirm('Mark this proposal as WON? COO will create the project.')) return;
            try {
                showLoading();
                const response = await apiCall(`proposals?id=${proposalId}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        action: 'mark_won',
                        data: { wonDate: new Date().toISOString() }
                    })
                });
                if (response.success) {
                    alert('✅ Proposal marked as WON!\n\nCOO will be notified.');
                    // --- ADD THIS LINE ---
                    // Note: You might need to pass clientName/projectName to this function or fetch it
                     triggerEmailNotification('project.won', { proposalId: proposalId }); 
                     // --------------------
                    closeModal();
                    showProposals();
                } else {
                    throw new Error(response.error || 'Failed to mark as WON');
                }
            } catch (error) {
                alert('❌ Error: ' + error.message);
            } finally {
                hideLoading();
            }
        }
        async function markProposalLost(proposalId) {
            // ... (This function remains unchanged)
            const reason = prompt('Reason for losing this proposal:');
            if (!reason) return;
            try {
                showLoading();
                const response = await apiCall(`proposals?id=${proposalId}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        action: 'mark_lost',
                        data: { lostDate: new Date().toISOString(), reason }
                    })
                });
                if (response.success) {
                    alert('Proposal marked as LOST.');
                    // --- ADD THIS LINE ---
                    triggerEmailNotification('project.lost', { proposalId: proposalId, reason: reason });
                    // --------------------
                    closeModal();
                    showProposals();
                } else {
                    throw new Error(response.error || 'Failed to mark as LOST');
                }
            } catch (error) {
                alert('❌ Error: ' + error.message);
            } finally {
                hideLoading();
            }
        }
     // ================================================================
// UPDATED: editProposal (2GB Total Limit / 100MB Per File)
// ================================================================
async function editProposal(proposalId) {
    try {
        showLoading();
        window.currentEditStagedFiles = [];
        // Constants for limits
        const MAX_SINGLE_FILE_SIZE = 3 * 1024 * 1024 * 1024; // 3GB
        const MAX_TOTAL_UPLOAD_SIZE = 10 * 1024 * 1024 * 1024; // 10GB Total

        const [proposalResponse, filesResponse] = await Promise.all([
            apiCall(`proposals?id=${proposalId}`),
            apiCall(`files?proposalId=${proposalId}`)
        ]);

        if (!proposalResponse.success || !proposalResponse.data) throw new Error('Failed to load proposal details');

        const p = proposalResponse.data;
        const allFiles = filesResponse.success ? filesResponse.data : [];
        const existingProjectFiles = allFiles.filter(f => !f.fileType || f.fileType === 'project');
        const existingLinks = allFiles.filter(f => f.fileType === 'link');

        closeModal();

        const projectTypes = [
            'Steel Detailing', 'Miscellaneous Steel', 'Connection Design', 'PE Stamping',
            'Joist Detailing', 'As-built Drawings'
        ];

        const modalHtml = `
            <div class="modal-overlay" id="editProposalOverlay">
                <div class="modal-content" style="max-width: 900px; max-height: 95vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h2>Edit Proposal</h2>
                        <div class="subtitle">${p.projectName || 'Untitled Project'}</div>
                        <span class="close-modal" onclick="closeModal()">&times;</span>
                    </div>

                    <form id="editProposalForm" class="modal-form">
                        <div class="auth-tabs" style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border);">
                            <button type="button" class="auth-tab active" onclick="switchEditTab(event, 'edit-details')">Details</button>
                            <button type="button" class="auth-tab" onclick="switchEditTab(event, 'edit-files')">Files & Links</button>
                        </div>

                        <div id="edit-details" class="edit-tab-content active">
                             <div class="form-row">
                                <div class="form-group">
                                    <label>Project Name *</label>
                                    <input type="text" id="editProjectName" class="form-control" value="${p.projectName || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label>Client Company *</label>
                                    <input type="text" id="editClientCompany" class="form-control" value="${p.clientCompany || ''}" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Project Type *</label>
                                    <div class="checkbox-list" style="max-height: 150px; overflow-y: auto; padding: 10px; border: 1px solid var(--border); border-radius: 8px; background: white;">
                                        ${projectTypes.map(type => {
                                            const isChecked = Array.isArray(p.projectType) && p.projectType.includes(type) ? 'checked' : '';
                                            return `<label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                                                        <input type="checkbox" name="editProjectType" value="${type}" ${isChecked} style="margin-right: 10px;"> ${type}
                                                    </label>`;
                                        }).join('')}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div style="margin-bottom: 1rem;">
                                        <label>Timeline (Days)</label>
                                        <input type="text" id="editTimeline" class="form-control" value="${p.timeline || ''}">
                                    </div>
                                     <div>
                                        <label>Country</label>
                                        <select id="editCountry" class="form-control">
                                            <option value="">Select Country</option>
                                            <option value="Australia" ${p.country === 'Australia' ? 'selected' : ''}>Australia</option>
                                            <option value="USA" ${p.country === 'USA' ? 'selected' : ''}>USA</option>
                                            <option value="Canada" ${p.country === 'Canada' ? 'selected' : ''}>Canada</option>
                                            <option value="UK" ${p.country === 'UK' ? 'selected' : ''}>UK</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Priority</label>
                                <select id="editPriority" class="form-control">
                                    <option value="Medium" ${p.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                                    <option value="High" ${p.priority === 'High' ? 'selected' : ''}>High</option>
                                    <option value="Low" ${p.priority === 'Low' ? 'selected' : ''}>Low</option>
                                </select>
                            </div>
                             <div class="form-group">
                                <label>Scope of Work *</label>
                                <textarea id="editScopeOfWork" class="form-control" rows="6" required>${p.scopeOfWork || ''}</textarea>
                            </div>
                        </div>

                        <div id="edit-files" class="edit-tab-content" style="display: none;">
                            <div class="form-section">
                                <h4>Current Files</h4>
                                <div id="existingFilesList">
                                    ${existingProjectFiles.length > 0 ? existingProjectFiles.map(f => `
                                        <div class="file-item" id="file-${f.id}">
                                            <div class="file-info"><span class="file-name">📄 ${f.originalName}</span><span class="file-size">${formatFileSize(f.fileSize)}</span></div>
                                            <button type="button" class="btn btn-danger btn-sm" style="width: auto;" onclick="deleteFileImmediate('${f.id}', 'file-${f.id}')">Delete</button>
                                        </div>
                                    `).join('') : '<p class="text-muted">No files currently attached.</p>'}
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>Upload New Files</h4>
                                <div class="upload-area" id="editUploadArea" style="padding: 1.5rem; border: 2px dashed var(--primary-blue);">
                                    <p>📁 Click to add more files</p>
                                     <div style="color: var(--text-light); font-size: 0.9rem;">Max 3GB per file</div>
                                    <input type="file" id="editFileInput" multiple style="display: none;">
                                </div>
                                <div id="editFileUploadError" style="color: var(--danger); font-weight: 600; margin-top: 1rem;"></div>
                                
                                <div id="editStagedFilesContainer" style="margin-top: 1rem; display: none;">
                                     <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                        <strong>New Files to Upload:</strong>
                                        <span id="editTotalSizeIndicator" style="color: var(--text-light);">0 MB / 2048 MB</span>
                                    </div>
                                    <div id="editStagedFilesList"></div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>Current Links</h4>
                                <div id="existingLinksList">
                                     ${existingLinks.length > 0 ? existingLinks.map(l => `
                                        <div class="file-item" id="link-${l.id}">
                                            <div class="file-info"><span class="file-name">🔗 ${l.originalName || l.url}</span><a href="${l.url}" target="_blank" style="font-size: 0.85rem;">${l.url}</a></div>
                                            <button type="button" class="btn btn-danger btn-sm" style="width: auto;" onclick="deleteFileImmediate('${l.id}', 'link-${l.id}')">Delete</button>
                                        </div>
                                    `).join('') : '<p class="text-muted">No links attached.</p>'}
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>Add New Links</h4>
                                <div id="editLinksContainer">
                                    <div class="link-input-group" style="margin-bottom: 1rem;">
                                        <input type="url" class="form-control" placeholder="Enter URL" style="margin-bottom: 0.5rem;">
                                        <input type="text" class="form-control" placeholder="Link title (optional)">
                                    </div>
                                </div>
                                <button type="button" onclick="addEditLinkField()" class="btn btn-outline btn-sm" style="width: auto;">+ Add Another Link</button>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" onclick="closeModal()" class="btn btn-outline">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save All Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // --- Event Handlers ---
        window.switchEditTab = function(e, tabId) {
            document.querySelectorAll('.edit-tab-content').forEach(el => el.style.display = 'none');
            document.getElementById(tabId).style.display = 'block';
            document.querySelectorAll('#editProposalForm .auth-tab').forEach(el => el.classList.remove('active'));
            e.target.classList.add('active');
        };

        const editUploadArea = document.getElementById('editUploadArea');
        const editFileInput = document.getElementById('editFileInput');
        const editErrorDiv = document.getElementById('editFileUploadError');

        if (editUploadArea && editFileInput) {
            editUploadArea.onclick = () => editFileInput.click();
            editFileInput.onchange = () => handleEditFiles(editFileInput.files);

             // Drag and drop support for edit
            editUploadArea.ondragover = (e) => { e.preventDefault(); editUploadArea.style.background = 'var(--light-blue)'; };
            editUploadArea.ondragleave = () => { editUploadArea.style.background = ''; };
            editUploadArea.ondrop = (e) => {
                e.preventDefault();
                editUploadArea.style.background = '';
                handleEditFiles(e.dataTransfer.files);
            };
        }

        function handleEditFiles(files) {
            editErrorDiv.textContent = '';
            let currentTotalSize = window.currentEditStagedFiles.reduce((sum, f) => sum + f.size, 0);

            Array.from(files).forEach(file => {
                if (file.size > MAX_SINGLE_FILE_SIZE) {
                    editErrorDiv.innerHTML += `<div style="margin-bottom: 0.25rem;">⚠️ Skipped <strong>${file.name}</strong>: Exceeds 100MB limit.</div>`;
                    return;
                }
                if (currentTotalSize + file.size > MAX_TOTAL_UPLOAD_SIZE) {
                    editErrorDiv.innerHTML += `<div style="margin-bottom: 0.25rem; color: var(--danger);">⛔ Skipped <strong>${file.name}</strong>: Would exceed 2GB total limit.</div>`;
                    return;
                }
                if (!window.currentEditStagedFiles.some(f => f.name === file.name && f.size === file.size)) {
                    window.currentEditStagedFiles.push(file);
                    currentTotalSize += file.size;
                }
            });
            if(editFileInput) editFileInput.value = '';
            renderEditStagedFiles();
        }

        window.renderEditStagedFiles = function() {
            const container = document.getElementById('editStagedFilesList');
            const mainContainer = document.getElementById('editStagedFilesContainer');
            const totalIndicator = document.getElementById('editTotalSizeIndicator');

            if (window.currentEditStagedFiles.length === 0) {
                mainContainer.style.display = 'none';
                return;
            }

            mainContainer.style.display = 'block';
            let totalSize = 0;
            container.innerHTML = window.currentEditStagedFiles.map((file, index) => {
                 totalSize += file.size;
                 return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #E8F5E9; margin-bottom: 8px; border-radius: 6px;">
                        <span>🆕 ${file.name} (${formatFileSize(file.size)})</span>
                        <button type="button" onclick="window.currentEditStagedFiles.splice(${index}, 1); renderEditStagedFiles();" 
                                style="background: none; border: none; cursor: pointer; color: var(--danger);">✕</button>
                    </div>
                `;
            }).join('');

             // Update total size indicator
            const totalMB = (totalSize / (1024 * 1024)).toFixed(0);
            const percent = Math.min((totalSize / MAX_TOTAL_UPLOAD_SIZE) * 100, 100).toFixed(0);
            totalIndicator.textContent = `${totalMB} MB / 2048 MB (${percent}%)`;
            totalIndicator.style.color = percent > 90 ? 'var(--danger)' : 'var(--text-light)';
        };

        window.deleteFileImmediate = async function(fileId, elementId) {
            if(!confirm('Are you sure you want to delete this permanently?')) return;
            try {
                const el = document.getElementById(elementId);
                if(el) el.style.opacity = '0.5'; 
                const res = await apiCall(`files?id=${fileId}`, { method: 'DELETE' });
                if (res.success) { if(el) el.remove(); } 
                else { alert('Failed to delete file.'); if(el) el.style.opacity = '1'; }
            } catch(e) { alert('Error deleting file: ' + e.message); }
        };

        window.addEditLinkField = function() {
             const container = document.getElementById('editLinksContainer');
             const div = document.createElement('div');
             div.className = 'link-input-group';
             div.style.marginBottom = '1rem';
             div.innerHTML = '<input type="url" class="form-control" placeholder="Enter URL" style="margin-bottom: 0.5rem;"><input type="text" class="form-control" placeholder="Link title (optional)">';
             container.appendChild(div);
        }

        document.getElementById('editProposalForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();
            try {
                const selectedTypes = Array.from(document.querySelectorAll('input[name="editProjectType"]:checked')).map(cb => cb.value);
                if (selectedTypes.length === 0) throw new Error('Please select at least one Project Type.');

                // Update details
                await apiCall(`proposals?id=${proposalId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ 
                        action: 'update_details', 
                        data: {
                            projectName: document.getElementById('editProjectName').value || '',
                            clientCompany: document.getElementById('editClientCompany').value || '',
                            projectType: selectedTypes,
                            timeline: document.getElementById('editTimeline').value || '',
                            country: document.getElementById('editCountry').value || '',
                            priority: document.getElementById('editPriority').value || 'Medium',
                            scopeOfWork: document.getElementById('editScopeOfWork').value || ''
                        } 
                    })
                });

               // Upload new files (using new direct method)
if (window.currentEditStagedFiles.length > 0) {
    console.log("Starting edit file uploads...");
    for (const file of window.currentEditStagedFiles) {
        try {
            await uploadFileDirectly(file, proposalId, 'project');
            console.log(`✅ Uploaded: ${file.name}`);
        } catch (uploadError) {
            console.error(`❌ Failed to upload ${file.name}:`, uploadError);
            alert(`Failed to upload ${file.name}: ${uploadError.message}`);
        }
    }
}

                // Save new links
                const newLinks = [];
                document.querySelectorAll('#editLinksContainer .link-input-group').forEach(group => {
                    const url = group.querySelector('input[type="url"]').value;
                    const title = group.querySelector('input[type="text"]').value;
                    if (url) newLinks.push({ url, title: title || url, description: title });
                });
                if (newLinks.length > 0) {
                    await apiCall('proposals?id=' + proposalId, { // Use proposal endpoint for adding links to array
                         method: 'PUT',
                         body: JSON.stringify({ action: 'add_links', data: { links: newLinks } })
                    });
                }

                alert('✅ Proposal updated successfully!');
                closeModal();
                if (document.getElementById('nav-proposals').classList.contains('active')) {
                    showProposals();
                } else {
                    viewProposal(proposalId);
                }
            } catch (err) {
                alert('Error updating: ' + err.message);
            } finally {
                hideLoading();
            }
        });

    } catch (error) {
        console.error('Edit error:', error);
        alert('Error loading edit form: ' + error.message);
    } finally {
        hideLoading();
    }
}

// REPLACE YOUR EXISTING deleteProposal FUNCTION WITH THIS:
    async function deleteProposal(proposalId) {
    if (!confirm('Are you VERY SURE you want to delete this proposal? This action cannot be undone.')) return;
    
    try {
        showLoading();
        const response = await apiCall(`proposals?id=${proposalId}`, { 
            method: 'DELETE' 
        });
        
        if (response.success) {
            alert('Proposal deleted successfully!');
            closeModal(); // Close details modal if open
            // Force a slight delay to ensure backend processes before re-fetching
            setTimeout(() => {
                showProposals(); 
            }, 500);
        } else {
            throw new Error(response.error || 'Failed to delete proposal');
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting proposal: ' + error.message);
    } finally {
        hideLoading();
    }
}
    
// ============================================
        // COO PRICING FORM WITH PROJECT NUMBER CREATION
        // ============================================
        async function showCOOPricingForm(proposalId) {
            try {
                showLoading();
                const response = await apiCall(`proposals?id=${proposalId}`);
                        
                if (!response.success || !response.data) {
                    throw new Error('Failed to load proposal');
                }
                        
                const proposal = response.data;
                        
                // Check if proposal has estimation
                if (!proposal.estimation) {
                    alert('Please complete estimation before adding pricing');
                    hideLoading();
                    return;
                }
           // ====================== MODIFICATION START ======================
          // Logic to prepare display values
          const estimation = proposal.estimation || {};
          const totalHours = estimation.manhours || estimation.totalHours || 0;
          const tonnage = estimation.tonnage || 0;

         // Prepare HTML for Hours
        // If hours are 0 but tonnage exists, display N/A for hours
         const displayHours = (totalHours == 0 && tonnage > 0) ? 'N/A' : totalHours;
        const hoursHtml = `<div><strong>Total Hours:</strong> ${displayHours}</div>`;

         // Prepare HTML for Tonnage
       // Only show tonnage if it's greater than 0
       const tonnageHtml = tonnage > 0 
    ? `<div><strong>Tonnage:</strong> ${tonnage}</div>` 
    : '';
// ======================= MODIFICATION END =======================
                        
                const modalHtml = `
                    <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
                        <div class="modal-content" style="max-width: 800px;">
                            <div class="modal-header">
                                <div>
                                    <h2>COO Pricing Form</h2>
                                    <div class="subtitle">${proposal.projectName} - ${proposal.clientCompany}</div>
                                </div>
                                <span class="close-modal" onclick="closeModal()">&times;</span>
                            </div>
                                                
                            <div class="modal-body">
                                <div class="form-section" style="background: var(--light-blue); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                                    <h4>Estimation Summary</h4>
                                    
                                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                                  ${hoursHtml}
                                  ${tonnageHtml}  
                                  <div><strong>Estimated By:</strong> ${estimation.estimatorName || estimation.estimatedBy || 'N/A'}</div>
                                  <div><strong>Services:</strong> ${estimation.services?.join(', ') || 'N/A'}</div>
                                 </div>
                                    
                                </div>
                                                        
                                <form id="cooPricingForm">
                                    <div class="form-section">
                                        <h4>Project Number</h4>
                                        <div class="form-group">
                                            <label>Project Number <span class="required">*</span></label>
                                            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                                                <input type="text" id="projectNumber" class="form-control"
                                                       placeholder="Enter manually or click Generate" 
                                                       value="${proposal.pricing?.projectNumber || ''}"
                                                       required>
                                                <button type="button" onclick="generateProjectNumber('${proposal.clientCompany}')"
                                                        class="btn btn-outline" style="width: auto; white-space: nowrap;">
                                                    🔢 Auto Generate
                                                </button>
                                            </div>
                                            <small class="form-text">You can enter a project number manually or auto-generate one based on client name and year</small>
                                        </div>
                                    </div>
                                                                
                                    <div class="form-section">
                                        <h4>Pricing Information</h4>
                                                                        
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Quote Value <span class="required">*</span></label>
                                                <input type="number" id="quoteValue" class="form-control"
                                                     placeholder="Enter quote value" step="0.01" 
                                                     value="${proposal.pricing?.quoteValue || ''}" required>
                                            </div>
                                            <div class="form-group">
                                                <label>Currency <span class="required">*</span></label>
                                                <select id="currency" class="form-control" required>
                                                    <option value="USD" ${proposal.pricing?.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                                                    <option value="AUD" ${proposal.pricing?.currency === 'AUD' ? 'selected' : ''}>AUD (A$)</option>
                                                    <option value="CAD" ${proposal.pricing?.currency === 'CAD' ? 'selected' : ''}>CAD (C$)</option>
                                                    <option value="GBP" ${proposal.pricing?.currency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                                                    <option value="EUR" ${proposal.pricing?.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                                                </select>
                                            </div>
                                        </div>
                                                                        
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Hourly Rate</label>
                                                <input type="number" id="hourlyRate" class="form-control"
                                                     placeholder="Enter hourly rate" step="0.01"
                                                     value="${proposal.pricing?.hourlyRate || ''}">
                                            </div>
                                            <div class="form-group">
                                                <label>Profit Margin (%)</label>
                                                <input type="number" id="profitMargin" class="form-control"
                                                     placeholder="Enter profit margin" step="0.01" min="0" max="100"
                                                     value="${proposal.pricing?.profitMargin || ''}">
                                            </div>
                                        </div>
                                                                        
                                        <div class="form-group">
                                            <label>Pricing Notes</label>
                                            <textarea id="pricingNotes" class="form-control" rows="3"
                                                 placeholder="Add any pricing notes or special conditions...">${proposal.pricing?.notes || ''}</textarea>
                                        </div>
                                    </div>
                                                                
                                    <div class="form-section">
                                        <h4>Cost Breakdown (Optional)</h4>
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Material Costs</label>
                                                <input type="number" id="materialCosts" class="form-control"
                                                     placeholder="0.00" step="0.01"
                                                     value="${proposal.pricing?.costBreakdown?.material || ''}">
                                            </div>
                                            <div class="form-group">
                                                <label>Labor Costs</label>
                                                <input type="number" id="laborCosts" class="form-control"
                                                     placeholder="0.00" step="0.01"
                                                     value="${proposal.pricing?.costBreakdown?.labor || ''}">
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Overhead Costs</label>
                                                <input type="number" id="overheadCosts" class="form-control"
                                                     placeholder="0.00" step="0.01"
                                                     value="${proposal.pricing?.costBreakdown?.overhead || ''}">
                                            </div>
                                            <div class="form-group">
                                                <label>Other Costs</label>
                                                <input type="number" id="otherCosts" class="form-control"
                                                     placeholder="0.00" step="0.01"
                                                     value="${proposal.pricing?.costBreakdown?.other || ''}">
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                                                
                            <div class="modal-footer">
                                <button type="button" onclick="closeModal()" class="btn btn-outline">Cancel</button>
                                <button type="button" onclick="submitCOOPricing('${proposalId}')" class="btn btn-primary">
                                    Save Pricing
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                        
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                hideLoading();
            
            } catch (error) {
                console.error('Error loading pricing form:', error);
                alert('Error loading pricing form: ' + error.message);
                hideLoading();
            }
        }

        // Generate Project Number
        async function generateProjectNumber(clientCompany) {
            try {
                showLoading();
                        
                // Call backend to generate project number
                const response = await apiCall('projects/generate-number', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ clientCompany })
                });
                        
                if (response.success && response.data.projectNumber) {
                    document.getElementById('projectNumber').value = response.data.projectNumber;
                    showNotification('Project number generated successfully!', 'success');
                } else {
                    throw new Error(response.error || 'Failed to generate project number');
                }
                    
            } catch (error) {
                console.error('Error generating project number:', error);
                        
                // Fallback: Generate locally if backend fails
                const year = new Date().getFullYear().toString().slice(-2);
                const clientPrefix = (clientCompany || 'GEN').substring(0, 3).toUpperCase();
                const random = Math.floor(Math.random() * 900) + 100;
                const projectNumber = `${clientPrefix}${year}-${random}`;
                        
                document.getElementById('projectNumber').value = projectNumber;
                showNotification('Project number generated (local)', 'warning');
            } finally {
                hideLoading();
            }
        }

        // Submit COO Pricing
        async function submitCOOPricing(proposalId) {
            const projectNumber = document.getElementById('projectNumber').value;
            const quoteValue = document.getElementById('quoteValue').value;
            const currency = document.getElementById('currency').value;
            const hourlyRate = document.getElementById('hourlyRate').value;
            const profitMargin = document.getElementById('profitMargin').value;
            const pricingNotes = document.getElementById('pricingNotes').value;
                
            // Optional cost breakdown
            const materialCosts = document.getElementById('materialCosts').value || 0;
            const laborCosts = document.getElementById('laborCosts').value || 0;
            const overheadCosts = document.getElementById('overheadCosts').value || 0;
            const otherCosts = document.getElementById('otherCosts').value || 0;
                
            // Validation
            if (!projectNumber) {
                alert('Please generate a project number');
                return;
            }
                
            if (!quoteValue || parseFloat(quoteValue) <= 0) {
                alert('Please enter a valid quote value');
                return;
            }
                
            try {
                showLoading();
                        
                const pricingData = {
                    projectNumber: projectNumber,
                    quoteValue: parseFloat(quoteValue),
                    currency: currency,
                    hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
                    profitMargin: profitMargin ? parseFloat(profitMargin) : null,
                    notes: pricingNotes,
                    costBreakdown: {
                        material: parseFloat(materialCosts),
                        labor: parseFloat(laborCosts),
                        overhead: parseFloat(overheadCosts),
                        other: parseFloat(otherCosts),
                        total: parseFloat(materialCosts) + parseFloat(laborCosts) +
                                parseFloat(overheadCosts) + parseFloat(otherCosts)
                    }
                };
                        
                const response = await apiCall(`proposals?id=${proposalId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'add_pricing',
                        data: pricingData
                    })
                });
                        
                if (response.success) {
                    closeModal();
                    showNotification('Pricing added successfully!', 'success');
                    // --- ADD THIS LINE ---
                    triggerEmailNotification('pricing.complete', { 
                     proposalId: proposalId,
                     // You might need to fetch these values from the DOM if not already available
                     quoteValue: document.getElementById('currency').value + ' ' + document.getElementById('quoteValue').value,
                    projectName: document.querySelector('.modal.show .subtitle')?.textContent || 'Project'
                    });
                                
                    // Refresh proposals list or show allocation option
                    showProposals();
                } else {
                    throw new Error(response.error || 'Failed to add pricing');
                }
                    
            } catch (error) {
                console.error('Error submitting pricing:', error);
                alert('Error submitting pricing: ' + error.message);
            } finally {
                hideLoading();
            }
        }
    /**
 * Shows modal to edit existing pricing information (COO/Director only)
 */
async function showEditPricingModal(proposalId) {
    try {
        showLoading();
        const response = await apiCall(`proposals?id=${proposalId}`);
        
        if (!response.success || !response.data) {
            throw new Error('Failed to load proposal');
        }
        
        const proposal = response.data;
        
        // Check if proposal has pricing
        if (!proposal.pricing) {
            alert('No pricing information found for this proposal');
            hideLoading();
            return;
        }
        
        // Get existing pricing data
        const pricing = proposal.pricing;
        const estimation = proposal.estimation || {};
        const totalHours = estimation.manhours || estimation.totalHours || 0;
        const tonnage = estimation.tonnage || 0;
        
        // Prepare HTML for Hours
        const displayHours = (totalHours == 0 && tonnage > 0) ? 'N/A' : totalHours;
        const hoursHtml = `<div><strong>Total Hours:</strong> ${displayHours}</div>`;
        
        // Prepare HTML for Tonnage
        const tonnageHtml = tonnage > 0 
            ? `<div><strong>Tonnage:</strong> ${tonnage}</div>` 
            : '';
        
        const modalHtml = `
            <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <div>
                            <h2>Edit Pricing Information</h2>
                            <div class="subtitle">${proposal.projectName} - ${proposal.clientCompany}</div>
                        </div>
                        <span class="close-modal" onclick="closeModal()">&times;</span>
                    </div>
                    
                    <div class="modal-body">
                        <div class="form-section" style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                            <p style="margin: 0; color: #856404;">
                                ⚠️ <strong>Warning:</strong> Editing pricing information will update the proposal. 
                                Make sure to review all changes carefully before saving.
                            </p>
                        </div>
                        
                        <div class="form-section" style="background: var(--light-blue); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                            <h4>Estimation Summary</h4>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                                ${hoursHtml}
                                ${tonnageHtml}  
                                <div><strong>Estimated By:</strong> ${estimation.estimatorName || estimation.estimatedBy || 'N/A'}</div>
                                <div><strong>Services:</strong> ${estimation.services?.join(', ') || 'N/A'}</div>
                            </div>
                        </div>
                        
                        <form id="editPricingForm">
                            <input type="hidden" id="editProposalId" value="${proposalId}">
                            
                            <div class="form-section">
                                <h4>Project Number</h4>
                                <div class="form-group">
                                    <label>Project Number <span class="required">*</span></label>
                                    <input type="text" id="editProjectNumber" class="form-control"
                                           placeholder="Project number" 
                                           value="${pricing.projectNumber || ''}"
                                           required>
                                    <small class="form-text">Changing the project number may affect project tracking</small>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Pricing Information</h4>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Quote Value <span class="required">*</span></label>
                                        <input type="number" id="editQuoteValue" class="form-control"
                                             placeholder="Enter quote value" step="0.01" 
                                             value="${pricing.quoteValue || ''}" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Currency <span class="required">*</span></label>
                                        <select id="editCurrency" class="form-control" required>
                                            <option value="USD" ${pricing.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                                            <option value="AUD" ${pricing.currency === 'AUD' ? 'selected' : ''}>AUD (A$)</option>
                                            <option value="CAD" ${pricing.currency === 'CAD' ? 'selected' : ''}>CAD (C$)</option>
                                            <option value="GBP" ${pricing.currency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                                            <option value="EUR" ${pricing.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Hourly Rate</label>
                                        <input type="number" id="editHourlyRate" class="form-control"
                                             placeholder="Enter hourly rate" step="0.01"
                                             value="${pricing.hourlyRate || ''}">
                                    </div>
                                    <div class="form-group">
                                        <label>Profit Margin (%)</label>
                                        <input type="number" id="editProfitMargin" class="form-control"
                                             placeholder="Enter profit margin" step="0.01" min="0" max="100"
                                             value="${pricing.profitMargin || ''}">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label>Pricing Notes</label>
                                    <textarea id="editPricingNotes" class="form-control" rows="3"
                                         placeholder="Add any pricing notes or special conditions...">${pricing.notes || ''}</textarea>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Cost Breakdown (Optional)</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Material Costs</label>
                                        <input type="number" id="editMaterialCosts" class="form-control"
                                             placeholder="0.00" step="0.01"
                                             value="${pricing.costBreakdown?.material || ''}">
                                    </div>
                                    <div class="form-group">
                                        <label>Labor Costs</label>
                                        <input type="number" id="editLaborCosts" class="form-control"
                                             placeholder="0.00" step="0.01"
                                             value="${pricing.costBreakdown?.labor || ''}">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Overhead Costs</label>
                                        <input type="number" id="editOverheadCosts" class="form-control"
                                             placeholder="0.00" step="0.01"
                                             value="${pricing.costBreakdown?.overhead || ''}">
                                    </div>
                                    <div class="form-group">
                                        <label>Other Costs</label>
                                        <input type="number" id="editOtherCosts" class="form-control"
                                             placeholder="0.00" step="0.01"
                                             value="${pricing.costBreakdown?.other || ''}">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" onclick="closeModal()" class="btn btn-outline">Cancel</button>
                        <button type="button" onclick="submitEditedPricing()" class="btn btn-warning">
                            💾 Update Pricing
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        hideLoading();
        
    } catch (error) {
        console.error('Error loading edit pricing form:', error);
        alert('Error loading pricing form: ' + error.message);
        hideLoading();
    }
}
    /**
 * Submits the edited pricing information to the backend
 */
async function submitEditedPricing() {
    const proposalId = document.getElementById('editProposalId').value;
    const projectNumber = document.getElementById('editProjectNumber').value;
    const quoteValue = document.getElementById('editQuoteValue').value;
    const currency = document.getElementById('editCurrency').value;
    const hourlyRate = document.getElementById('editHourlyRate').value;
    const profitMargin = document.getElementById('editProfitMargin').value;
    const pricingNotes = document.getElementById('editPricingNotes').value;
    
    // Optional cost breakdown
    const materialCosts = document.getElementById('editMaterialCosts').value || 0;
    const laborCosts = document.getElementById('editLaborCosts').value || 0;
    const overheadCosts = document.getElementById('editOverheadCosts').value || 0;
    const otherCosts = document.getElementById('editOtherCosts').value || 0;
    
    // Validation
    if (!projectNumber) {
        alert('Project number is required');
        document.getElementById('editProjectNumber').focus();
        return;
    }
    
    if (!quoteValue || parseFloat(quoteValue) <= 0) {
        alert('Please enter a valid quote value');
        document.getElementById('editQuoteValue').focus();
        return;
    }
    
    // Confirmation dialog
    if (!confirm('Are you sure you want to update the pricing information? This action will modify the existing pricing data.')) {
        return;
    }
    
    try {
        showLoading();
        
        const pricingData = {
            projectNumber: projectNumber,
            quoteValue: parseFloat(quoteValue),
            currency: currency,
            hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
            profitMargin: profitMargin ? parseFloat(profitMargin) : null,
            notes: pricingNotes,
            costBreakdown: {
                material: parseFloat(materialCosts),
                labor: parseFloat(laborCosts),
                overhead: parseFloat(overheadCosts),
                other: parseFloat(otherCosts),
                total: parseFloat(materialCosts) + parseFloat(laborCosts) +
                       parseFloat(overheadCosts) + parseFloat(otherCosts)
            },
            lastEditedBy: currentUser.name,
            lastEditedAt: new Date().toISOString()
        };
        
        const response = await apiCall(`proposals?id=${proposalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'update_pricing',
                data: pricingData
            })
        });
        
        if (response.success) {
            closeModal();
            showSuccessModal('Pricing Updated!', 'The pricing information has been successfully updated.');
            
            // Trigger email notification
            await triggerEmailNotification('pricing.updated', { 
                proposalId: proposalId,
                quoteValue: currency + ' ' + quoteValue,
                projectNumber: projectNumber
            });
            
            // Refresh the proposals view
            setTimeout(() => {
                showProposals();
            }, 1500);
            
        } else {
            throw new Error(response.error || 'Failed to update pricing');
        }
        
    } catch (error) {
        console.error('Error updating pricing:', error);
        alert('Error updating pricing: ' + error.message);
    } finally {
        hideLoading();
    }
}

        // ============================================
        // PROJECT ALLOCATION TO DESIGN MANAGER
        // ============================================
        async function showProjectAllocationModal(proposalId) {
            try {
                showLoading();
                        
                // Load proposal details
                const proposalResponse = await apiCall(`proposals?id=${proposalId}`);
                if (!proposalResponse.success || !proposalResponse.data) {
                    throw new Error('Failed to load proposal');
                }
                const proposal = proposalResponse.data;
                console.log('📋 Proposal loaded:', proposal);
                        
                // Check if proposal is WON
                if (proposal.status !== 'won') {
                    alert('Only WON proposals can be allocated to designers');
                    hideLoading();
                    return;
                }
                
                // Check if project already exists in proposal
                if (proposal.projectId) {
                    console.log('✅ Project already exists:', proposal.projectId);
                    hideLoading();
                    await showCooMultiDesignerAllocationModal(proposal.projectId);
                    return;
                }
                
                // Create the project if not already created
                console.log('🔨 Creating project from proposal:', proposalId);
                const createProjectResponse = await apiCall('projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'create_from_proposal',
                        proposalId: proposalId
                    })
                });
                
                console.log('📦 Create project response:', createProjectResponse);
                
                let projectId;
                
                // Backend returns projectId directly in response (not nested in data)
                if (createProjectResponse.success && createProjectResponse.projectId) {
                    projectId = createProjectResponse.projectId;
                    console.log('✅ Got project ID from response.projectId:', projectId);
                }
                // Fallback: Check if it's in data object
                else if (createProjectResponse.success && createProjectResponse.data) {
                    if (createProjectResponse.data.id) {
                        projectId = createProjectResponse.data.id;
                        console.log('✅ Got project ID from response.data.id:', projectId);
                    }
                    else if (typeof createProjectResponse.data === 'string') {
                        projectId = createProjectResponse.data;
                        console.log('✅ Got project ID from response.data (string):', projectId);
                    }
                    else if (createProjectResponse.data.projectId) {
                        projectId = createProjectResponse.data.projectId;
                        console.log('✅ Got project ID from response.data.projectId:', projectId);
                    }
                }
                
                // If still no project ID, try to fetch updated proposal
                if (!projectId) {
                    console.log('⚠️ Project ID not in response, fetching updated proposal...');
                    const proposalRefresh = await apiCall(`proposals?id=${proposalId}`);
                    if (proposalRefresh.success && proposalRefresh.data && proposalRefresh.data.projectId) {
                        projectId = proposalRefresh.data.projectId;
                        console.log('✅ Got project ID from refreshed proposal:', projectId);
                    }
                }
                
                // Final check
                if (!projectId) {
                    console.error('❌ Could not find project ID anywhere');
                    console.error('Create response:', createProjectResponse);
                    throw new Error('Project created but ID not found in response. Please refresh the page and try again.');
                }
                
                console.log('🎯 Opening allocation modal for project:', projectId);
                hideLoading();
                
                // Now open the multi-designer allocation modal
                await showCooMultiDesignerAllocationModal(projectId);
                
            } catch (error) {
                console.error('❌ Error opening allocation modal:', error);
                alert('Error: ' + error.message);
                hideLoading();
            }
        }

        // ============================================
        // HELPER: Update Proposal View to Show Allocation Button
        // ============================================
        // Add this to your viewProposal function or proposals rendering
        // Insert this button for WON proposals when COO is viewing
        function getProposalAllocationButton(proposal) {
            if (currentUserRole !== 'coo' && currentUserRole !== 'director') {
                return '';
            }
                
            // For won proposals - show allocation button or allocated project link
            if (proposal.status === 'won') {
                if (proposal.projectCreated && proposal.projectId) {
                    return `
                        <button onclick="viewProject('${proposal.projectId}')" class="btn btn-outline">
                            View Allocated Project
                        </button>
                    `;
                } else if (proposal.pricing && proposal.pricing.projectNumber) {
                    // Only show allocate button if pricing is complete (has project number)
                    return `
                        <button onclick="showProjectAllocationModal('${proposal.id}')" class="btn btn-success">
                            🎯 Allocate to Design Manager
                        </button>
                    `;
                }
                return ''; // No button if pricing not complete yet
            }
                
            // Show pricing button for COO only (not Director)
            // Only show if pricing hasn't been added yet and status requires pricing
            if (currentUserRole === 'coo') {
                if ((proposal.status === 'estimated' || proposal.status === 'pricing_complete') && 
                    (!proposal.pricing || !proposal.pricing.projectNumber)) {
                    return `
                        <button onclick="showCOOPricingForm('${proposal.id}')" class="btn btn-primary">
                            💰 Add Pricing & Project Number
                        </button>
                    `;
                }
            }
                
            return '';
        }
        
        // ============================================
        // FILE MANAGER
        // ============================================

        // REPLACED IMPLEMENTATION
        function showFileUpload() {
            setActiveNav('nav-files');
            const main = document.getElementById('mainContent');
            main.innerHTML = `
                <div class="page-header">
                    <h2>File Manager</h2>
                    <div class="subtitle">Upload, view, and manage all project files.</div>
                </div>

                <div class="auth-tabs" style="margin-bottom: 2rem;">
                    <button class="auth-tab active" onclick="showFileUploadTab('upload')">Upload Files</button>
                    <button class="auth-tab" onclick="showFileUploadTab('links')">Add Links</button>
                </div>

                <div id="uploadContent" class="auth-content active">
                    <div class="action-section">
                        <h3>Upload New Files</h3>
                        <form id="fileManagerUploadForm">
                            <div class="form-group">
                                <label>File(s)</label>
                                <div class="upload-area" id="fileMgrUploadArea" onclick="document.getElementById('fileMgrFileInput').click()">
                                    <div class="upload-icon">📁</div>
                                    <p>Click to upload or drag and drop</p>
                                    <input type="file" id="fileMgrFileInput" multiple style="display: none;">
                                </div>
                                <div id="fileMgrFilePreview" style="margin-top: 1rem;"></div>
                            </div>
                            <div class="form-group">
                                <label>File Type (Optional)</label>
                                <input type="text" id="fileMgrFileType" class="form-control" placeholder="e.g., 'general', 'drawing', 'report'">
                                <small class="form-text">Helps categorize the file. Leave blank if unsure.</small>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: auto;">Upload Files</button>
                        </form>
                    </div>
                </div>

                <div id="linksContent" class="auth-content">
                    <div class="action-section">
                        <h3>Add New Links</h3>
                        <form id="fileManagerLinkForm">
                            <div id="fileMgrLinksContainer">
                                <div class="link-input-group" style="margin-bottom: 1rem;">
                                    <input type="url" class="form-control" placeholder="Enter URL" style="margin-bottom: 0.5rem;" required>
                                    <input type="text" class="form-control" placeholder="Link title/description (optional)">
                                </div>
                            </div>
                            <button type="button" onclick="addUploadLinkField()" class="btn btn-outline btn-sm" style="width: auto;">+ Add Another Link</button>
                            <button type="submit" class="btn btn-primary" style="width: auto; margin-left: 1rem;">Save Links</button>
                        </form>
                    </div>
                </div>

                <div class="action-section" style="margin-top: 2rem;">
                    <h3>All Uploaded Files</h3>
                    <div id="allFilesListContainer">Loading files...</div>
                </div>
            `;

            // Add event listeners for new forms
            document.getElementById('fileManagerUploadForm').addEventListener('submit', handleFileUpload);
            document.getElementById('fileManagerLinkForm').addEventListener('submit', handleLinkUpload);
            document.getElementById('fileMgrFileInput').addEventListener('change', function() {
                const files = this.files;
                if (files.length > 0) {
                    document.getElementById('fileMgrFilePreview').innerHTML =
                        '<h5>Files to Upload:</h5>' +
                        Array.from(files).map(f => `<p>📄 ${f.name}</p>`).join('');
                }
            });

            // Load all files
            showFiles();
        }

        // REPLACED IMPLEMENTATION
        async function handleFileUpload(e) {
            e.preventDefault();
            const fileInput = document.getElementById('fileMgrFileInput');
            const fileType = document.getElementById('fileMgrFileType').value || 'general';
            
            if (fileInput.files.length === 0) {
                showNotification('Please select at least one file to upload.', 'warning');
                return;
            }

            try {
                showLoading();
                const formData = new FormData();
                Array.from(fileInput.files).forEach(file => formData.append('files', file));
                formData.append('fileType', fileType);
                // Note: These files are not associated with a proposal/project
                // The backend API at POST /api/files should handle this case.
                
                const response = await apiCall('files', { 
                    method: 'POST', 
                    body: formData 
                });

                if (response.success) {
                    showNotification('Files uploaded successfully!', 'success');
                    document.getElementById('fileManagerUploadForm').reset();
                    document.getElementById('fileMgrFilePreview').innerHTML = '';
                    showFiles(); // Refresh file list
                } else {
                    throw new Error(response.error || 'File upload failed');
                }
            } catch (error) {
                showNotification(`Upload Error: ${error.message}`, 'error');
            } finally {
                hideLoading();
            }
        }

        // REPLACED IMPLEMENTATION
        async function showFiles() {
            try {
                // Fetch all files. This might need backend pagination eventually.
                const response = await apiCall('files');
                if (response.success && response.data) {
                    renderFiles(response.data);
                } else {
                    throw new Error(response.error || 'Failed to fetch files');
                }
            } catch (error) {
                document.getElementById('allFilesListContainer').innerHTML = 
                    `<div class="error-message">${error.message}</div>`;
            }
        }

        // REPLACED IMPLEMENTATION
        function showFileUploadTab(tab) {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelector(`[onclick="showFileUploadTab('${tab}')"]`).classList.add('active');
            
            if (tab === 'upload') {
                document.getElementById('uploadContent').classList.add('active');
                document.getElementById('linksContent').classList.remove('active');
            } else {
                document.getElementById('uploadContent').classList.remove('active');
                document.getElementById('linksContent').classList.add('active');
            }
        }

        // REPLACED IMPLEMENTATION
        function addUploadLinkField() {
            const container = document.getElementById('fileMgrLinksContainer');
            const newLinkGroup = document.createElement('div');
            newLinkGroup.className = 'link-input-group';
            newLinkGroup.style.marginBottom = '1rem';
            newLinkGroup.innerHTML = `
                <input type="url" class="form-control" placeholder="Enter URL" style="margin-bottom: 0.5rem;" required>
                <input type="text" class="form-control" placeholder="Link title/description (optional)">
            `;
            container.appendChild(newLinkGroup);
        }

        // REPLACED IMPLEMENTATION
        async function handleLinkUpload(e) {
            e.preventDefault();
            const linkInputs = document.querySelectorAll('#fileMgrLinksContainer .link-input-group');
            const links = [];
            linkInputs.forEach(group => {
                const url = group.querySelector('input[type="url"]').value;
                const title = group.querySelector('input[type="text"]').value;
                if (url) { 
                    links.push({ url, title: title || url, description: title }); 
                }
            });

            if (links.length === 0) {
                showNotification('Please enter at least one valid URL.', 'warning');
                return;
            }

            try {
                showLoading();
                const response = await apiCall('files', {
                    method: 'POST',
                    body: JSON.stringify({ links: links, fileType: 'link' })
                });

                if (response.success) {
                    showNotification('Links saved successfully!', 'success');
                    document.getElementById('fileManagerLinkForm').reset();
                    // Reset to one field
                    document.getElementById('fileMgrLinksContainer').innerHTML = `
                        <div class="link-input-group" style="margin-bottom: 1rem;">
                            <input type="url" class="form-control" placeholder="Enter URL" style="margin-bottom: 0.5rem;" required>
                            <input type="text" class="form-control" placeholder="Link title/description (optional)">
                        </div>
                    `;
                    showFiles(); // Refresh file list
                } else {
                    throw new Error(response.error || 'Failed to save links');
                }
            } catch (error) {
                showNotification(`Error saving links: ${error.message}`, 'error');
            } finally {
                hideLoading();
            }
        }
        
        // REPLACED IMPLEMENTATION
        function renderFiles(files) {
            const container = document.getElementById('allFilesListContainer');
            if (!files || files.length === 0) {
                container.innerHTML = '<p>No files found.</p>';
                return;
            }

            const filesHtml = files.map(file => `
                <div class="action-item" style="padding: 1rem;">
                    <div class="action-content">
                        <strong>
                            ${file.fileType === 'link' ? '🔗' : '📄'} 
                            ${file.originalName || file.url}
                        </strong>
                        <div class="action-meta">
                            Type: ${file.fileType || 'file'} | 
                            Size: ${formatFileSize(file.fileSize)} | 
                            Uploaded: ${formatDate(file.uploadedAt)}
                            ${file.proposalId ? `| Proposal: ${file.proposalId}` : ''}
                            ${file.projectId ? `| Project: ${file.projectId}` : ''}
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-sm" onclick="window.open('${file.url}', '_blank')">View</button>
                        ${file.canDelete ? `<button class="btn btn-danger btn-sm" onclick="deleteFile('${file.id}')">Delete</button>` : ''}
                    </div>
                </div>
            `).join('');
            
            container.innerHTML = filesHtml;
        }

        // REPLACED IMPLEMENTATION
        async function deleteFile(fileId) {
            if (!confirm('Are you sure you want to delete this file? This cannot be undone.')) {
                return;
            }

            try {
                showLoading();
                const response = await apiCall(`files?id=${fileId}`, { 
                    method: 'DELETE' 
                });
                
                if (response.success) {
                    showNotification('File deleted successfully!', 'success');
                    showFiles(); // Refresh file list
                } else {
                    throw new Error(response.error || 'Failed to delete file');
                }
            } catch (error) {
                showNotification(`Error: ${error.message}`, 'error');
            } finally {
                hideLoading();
            }
        }
function createProjectCard(project) {
    const allocDate = project.allocationDate ? formatDate(project.allocationDate) : 'Not set';
    const targetDate = project.targetCompletionDate ? formatDate(project.targetCompletionDate) : 'Not set';
    
    // Calculate allocation status
    const maxHours = parseFloat(project.maxAllocatedHours) || 0;
    const totalAllocated = parseFloat(project.totalAllocatedHours) || 0;
    const hoursLogged = parseFloat(project.hoursLogged) || 0;
    const remainingBudget = maxHours - hoursLogged;
    const remainingToAllocate = maxHours - totalAllocated;
    
    const isFullyAllocated = maxHours > 0 && totalAllocated >= maxHours;
    const isPartiallyAllocated = maxHours > 0 && totalAllocated > 0 && totalAllocated < maxHours;
    const needsDesigners = !project.assignedDesignerUids || project.assignedDesignerUids.length === 0;
    
    // Allocation status badge
    let allocationBadge = '';
    if (isFullyAllocated) {
        allocationBadge = `<span class="badge" style="background: #10b981; color: white; font-size: 0.75rem;">✅ Fully Allocated (${totalAllocated}h)</span>`;
    } else if (isPartiallyAllocated) {
        allocationBadge = `<span class="badge" style="background: #f59e0b; color: white; font-size: 0.75rem;">⏳ Partial: ${totalAllocated}/${maxHours}h (${remainingToAllocate.toFixed(1)}h remaining)</span>`;
    } else if (maxHours > 0) {
        allocationBadge = `<span class="badge" style="background: #3b82f6; color: white; font-size: 0.75rem;">🎯 Budget: ${maxHours}h - Not Allocated</span>`;
    }

    return `
        <div class="project-card">
            <div class="project-header">
                <h3>${project.projectName}</h3>
                <span class="project-status ${project.status.replace(/_/g, '-')}">${project.status.replace(/_/g, ' ')}</span>
            </div>
            <div class="project-details">
                <p><strong>Client:</strong> ${project.clientCompany || 'N/A'}</p>
                <p><strong>Code:</strong> ${project.projectCode || 'N/A'}</p>
                <p><strong>Allocated:</strong> ${allocDate}</p>
                <p><strong>Target:</strong> ${targetDate}</p>
                <p><strong>Status:</strong> ${project.designStatus || 'N/A'}</p>
                <p><strong>Designers:</strong> ${project.assignedDesignerNames?.join(', ') || 'None assigned'}</p>
                ${maxHours > 0 ? `
                    <p><strong>Hours Budget:</strong> ${maxHours}h | <strong>Logged:</strong> ${hoursLogged.toFixed(1)}h | <strong>Remaining:</strong> ${remainingBudget.toFixed(1)}h</p>
                ` : ''}
                ${allocationBadge ? `<p>${allocationBadge}</p>` : ''}
            </div>
            <div class="project-actions">
                <button onclick="viewProject('${project.id}')">View Details</button>
                
                ${(() => {
                    // Only show allocation button if not fully allocated
                    if (isFullyAllocated) {
                        return `<button disabled style="background-color: #9ca3af; color: white; cursor: not-allowed;" title="Project fully allocated">
                            ✅ Fully Allocated
                        </button>`;
                    } else if (isPartiallyAllocated) {
                        return `<button onclick="assignDesigners('${project.id}')" style="background-color: #f59e0b; color: white;">
                            ⏳ Allocate Remaining ${remainingToAllocate.toFixed(1)}h
                        </button>`;
                    } else if (needsDesigners) {
                        return `<button onclick="assignDesigners('${project.id}')" style="background-color: var(--primary-blue); color: white;">
                            ➕ Assign Designers
                        </button>`;
                    } else {
                        return `<button onclick="assignDesigners('${project.id}')" style="background-color: var(--primary-blue); color: white;">
                            ✏️ Manage Allocation
                        </button>`;
                    }
                })()}
                
                <button onclick="viewBDMFiles('${project.id}', '${project.proposalId}')">View BDM Files</button>
                
                ${(currentUserRole === 'design_lead' || currentUserRole === 'coo' || currentUserRole === 'director') ? `
                    <button onclick="showAddVariationModal('${project.id}', '${project.projectCode}', '${project.projectName}')" 
                            style="background-color: var(--warning); color: white; border-color: var(--warning);">
                        ➕ Add Variation
                    </button>
                ` : ''}

                ${((currentUserRole === 'design_lead' || currentUserRole === 'coo' || currentUserRole === 'director') && project.status !== 'completed') ? `
                    <button onclick="markProjectComplete('${project.id}')" 
                            style="background-color: var(--success); color: white; border-color: var(--success);">
                        ✅ Mark Complete
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}
        // ============================================
        // PROJECTS (COO, Design Lead, Designer)
        // ============================================

        // REPLACED IMPLEMENTATION
        async function showProjects() {
            setActiveNav('nav-projects');
            const main = document.getElementById('mainContent');
            showLoading();
            main.innerHTML = '';

            try {
                console.log('🔄 Fetching all projects...');
                const response = await apiCall('projects');
                console.log('🏗️ Projects response:', response);
                console.log('🏗️ Projects data:', response.data);
                console.log('🏗️ Number of projects:', response.data?.length);
                
                if (response.success && response.data) {
                    renderProjectsList(response.data);
                } else {
                    throw new Error(response.error || 'Invalid projects response');
                }
            } catch (error) {
                console.error('❌ Error fetching projects:', error);
                main.innerHTML = `<div class="error-message"><h3>Error Loading Projects</h3><p>${error.message}</p></div>`;
            } finally {
                hideLoading();
            }
        }

        // REPLACED IMPLEMENTATION WITH FILTER BUTTONS
        function renderProjectsList(projects) {
            const main = document.getElementById('mainContent');
            
            // Logic for COO to create projects from WON proposals
            let createProjectBtn = '';
            if (currentUserRole === 'coo' || currentUserRole === 'director') {
                createProjectBtn = `
                    <button onclick="showCreateProjectFromWonProposal()" class="btn btn-success" style="margin-bottom: 1rem; width: auto;">
                        ➕ Create Project from WON Proposal
                    </button>
                `;
            }

            // Filter projects based on role
            let allProjects = projects;
            if (currentUserRole === 'design_lead') {
                allProjects = projects.filter(p => p.designLeadUid === currentUser.uid);
           } else if (currentUserRole === 'designer') {
              // FIX: Check both assignedDesigners AND assignedDesignerUids
              allProjects = projects.filter(p => 
                  (p.assignedDesigners && p.assignedDesigners.includes(currentUser.uid)) ||
                  (p.assignedDesignerUids && p.assignedDesignerUids.includes(currentUser.uid))
              );
            }
            
            // Count projects by status for filter buttons (for COO/Director)
            let filterButtons = '';
            if (currentUserRole === 'coo' || currentUserRole === 'director') {
                const statusCounts = {
                    all: allProjects.length,
                    active: allProjects.filter(p => 
                        p.status !== 'completed' && 
                        p.status !== 'on_hold' && 
                        p.status !== 'cancelled'
                    ).length,
                    // Pending Allocation = projects that need designers assigned
                    pending: allProjects.filter(p => {
                        // No designers assigned yet
                        if (!p.assignedDesignerUids || p.assignedDesignerUids.length === 0) {
                            return p.status !== 'completed';
                        }
                        return false;
                    }).length,
                    // Partially Allocated = has some allocation but not fully allocated
                    partial: allProjects.filter(p => {
                        const maxHours = parseFloat(p.maxAllocatedHours) || 0;
                        const totalAllocated = parseFloat(p.totalAllocatedHours) || 0;
                        return maxHours > 0 && totalAllocated > 0 && totalAllocated < maxHours;
                    }).length,
                    completed: allProjects.filter(p => 
                        p.status === 'completed'
                    ).length
                };
                
                filterButtons = `
                    <div class="filter-buttons-container" style="margin-bottom: 1.5rem;">
                        <button class="filter-btn filter-btn-all ${currentProjectFilter === 'all' ? 'active' : ''}" 
                                onclick="filterProjects('all')">
                            📊 All Projects
                            <span class="filter-count">${statusCounts.all}</span>
                        </button>
                        
                        <button class="filter-btn filter-btn-estimation ${currentProjectFilter === 'active' ? 'active' : ''}" 
                                onclick="filterProjects('active')">
                            ✅ Active Projects
                            <span class="filter-count">${statusCounts.active}</span>
                        </button>
                        
                        <button class="filter-btn filter-btn-pending ${currentProjectFilter === 'pending' ? 'active' : ''}" 
                                onclick="filterProjects('pending')">
                            🎯 Needs Designers
                            <span class="filter-count">${statusCounts.pending}</span>
                        </button>
                        
                        ${statusCounts.partial > 0 ? `
                        <button class="filter-btn ${currentProjectFilter === 'partial' ? 'active' : ''}" 
                                onclick="filterProjects('partial')"
                                style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white;">
                            ⏳ Partially Allocated
                            <span class="filter-count">${statusCounts.partial}</span>
                        </button>
                        ` : ''}
                        
                        <button class="filter-btn filter-btn-pricing ${currentProjectFilter === 'completed' ? 'active' : ''}" 
                                onclick="filterProjects('completed')">
                            🎉 Completed
                            <span class="filter-count">${statusCounts.completed}</span>
                        </button>
                    </div>
                `;
            }
            
            // Apply current filter
            let filteredProjects = allProjects;
            if (currentUserRole === 'coo' || currentUserRole === 'director') {
                if (currentProjectFilter === 'active') {
                    filteredProjects = allProjects.filter(p => 
                        p.status !== 'completed' && 
                        p.status !== 'on_hold' && 
                        p.status !== 'cancelled'
                    );
                } else if (currentProjectFilter === 'pending') {
                    // Projects that need designers assigned
                    filteredProjects = allProjects.filter(p => {
                        if (!p.assignedDesignerUids || p.assignedDesignerUids.length === 0) {
                            return p.status !== 'completed';
                        }
                        return false;
                    });
                } else if (currentProjectFilter === 'partial') {
                    // Partially allocated projects
                    filteredProjects = allProjects.filter(p => {
                        const maxHours = parseFloat(p.maxAllocatedHours) || 0;
                        const totalAllocated = parseFloat(p.totalAllocatedHours) || 0;
                        return maxHours > 0 && totalAllocated > 0 && totalAllocated < maxHours;
                    });
                } else if (currentProjectFilter === 'completed') {
                    filteredProjects = allProjects.filter(p => 
                        p.status === 'completed'
                    );
                }
            }

            const projectsHtml = filteredProjects.length ? filteredProjects.map(p => 
                createProjectCard(p)
            ).join('') : '<p>No projects found matching your criteria.</p>';

            main.innerHTML = `
                <div class="page-header">
                    <h2>All Projects</h2>
                    <div class="subtitle">Manage all active and pending projects.</div>
                </div>
                ${createProjectBtn}
                ${filterButtons}
                <div class="action-section">
                    <h3>Project List (${filteredProjects.length})</h3>
                    ${projectsHtml}
                </div>
            `;
        }
        
        // Filter function for All Projects menu
        function filterProjects(filterType) {
            currentProjectFilter = filterType;
            showProjects(); // Reload projects with new filter
        }

        // REPLACED IMPLEMENTATION
        async function showCreateProjectFromWonProposal() {
            try {
                showLoading();
                // Fetch proposals that are 'won' but not yet 'projectCreated'
                const response = await apiCall('proposals?status=won&projectCreated=false');
                if (!response.success || !response.data) {
                    throw new Error(response.error || 'Failed to fetch WON proposals');
                }
                const proposals = response.data;
                
                if (proposals.length === 0) {
                    hideLoading();
                    alert('No proposals are marked as "WON" and awaiting project creation.');
                    return;
                }

                const optionsHtml = proposals.map(p => 
                    `<option value="${p.id}" data-name="${p.projectName}" data-client="${p.clientCompany}">
                        ${p.projectName} (${p.clientCompany}) - ${p.pricing?.quoteValue || 'N/A'} ${p.pricing?.currency || ''}
                    </option>`
                ).join('');

                const modalHtml = `
                    <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
                        <div class="modal-content" style="max-width: 800px;">
                            <div class="modal-header"><h2>Create Project from Proposal</h2></div>
                            <form id="createProjectForm" class="modal-form">
                                <div class="form-section">
                                    <h4>Select WON Proposal</h4>
                                    <div class="form-group">
                                        <label>Proposal *</label>
                                        <select id="wonProposalSelect" class="form-control" required>
                                            <option value="">Select a proposal...</option>
                                            ${optionsHtml}
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Project Code *</label>
                                        <input type="text" id="projectCode" class="form-control" placeholder="e.g., EB-2025-001" required>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                                    <button type="button" onclick="closeModal()" class="btn btn-outline">Cancel</button>
                                    <button type="submit" class="btn btn-primary">Create Project</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                hideLoading();

                document.getElementById('createProjectForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const proposalSelect = document.getElementById('wonProposalSelect');
                    const proposalId = proposalSelect.value;
                    const projectCode = document.getElementById('projectCode').value;
                    if (!proposalId || !projectCode) {
                        alert('Please select a proposal and enter a project code.');
                        return;
                    }
                    
                    // MODIFIED: Call function with no parameters
                    createProjectFromProposal();
                });

            } catch (error) {
                hideLoading();
                alert(`Error: ${error.message}`);
            }
        }

        // REPLACED IMPLEMENTATION (FIXED AS PER YOUR REQUEST)
        async function createProjectFromProposal() {
            // Get values from the form, as per the new 0-argument function structure
            const proposalSelect = document.getElementById('wonProposalSelect');
            const proposalId = proposalSelect.value;
            const projectCode = document.getElementById('projectCode').value;

            if (!proposalId) {
                alert('Please select a proposal');
                return;
            }
            if (!projectCode) {
                alert('Please enter a project code');
                return;
            }
            
            // Get other data from the selected option
            const selectedOption = proposalSelect.options[proposalSelect.selectedIndex];
            const proposalName = selectedOption.dataset.name;
            const clientName = selectedOption.dataset.client;

            try {
                showLoading();
                
                // FIXED: Send action in the request body, as per user's instruction
                const response = await apiCall('projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        action: 'create_from_proposal', // User's key change
                        proposalId: proposalId,
                        projectCode: projectCode,       // Retained from old logic
                        projectName: proposalName,    // Retained from old logic
                        clientCompany: clientName     // Retained from old logic
                    })
                });

                if (response.success) {
                    closeModal();
                    showNotification('Project created successfully!', 'success');
                    showProjects();
                } else {
                    throw new Error(response.error || 'Failed to create project');
                }
            } catch (error) {
                console.error('Create project error:', error);
                alert('Error creating project: ' + error.message);
            } finally {
                hideLoading();
            }
        }
       // ============================================
// DESIGNER ALLOCATIONS VIEW (Fixed Filtering)
// ============================================
async function showDesignerAllocations() {
    setActiveNav('nav-designer-alloc');
    const main = document.getElementById('mainContent');
    main.style.display = 'block';
    showLoading();

    try {
        // 1. Fetch projects
        const response = await apiCall('projects'); 

        if (!response.success) {
            throw new Error('Failed to load projects');
        }

        const allProjects = response.data || [];

        console.log("All Projects fetched:", allProjects.length);
        console.log("Current User ID:", currentUser.uid);

        // 2. Filter: Check BOTH 'assignedDesignerUids' (New) and 'assignedDesigners' (Legacy)
        const myProjects = allProjects.filter(p => {
            // Note: If p.assignedDesigners contains the designer's NAME instead of UID, 
            // you must adjust the `hasLegacy` check to compare names.
            const hasNew = p.assignedDesignerUids && Array.isArray(p.assignedDesignerUids) && p.assignedDesignerUids.includes(currentUser.uid);
            const hasLegacy = p.assignedDesigners && Array.isArray(p.assignedDesigners) && p.assignedDesigners.includes(currentUser.uid);

            // Debug log to help identify why a project matches or fails
            // console.log(`Project ${p.projectCode}: New=${hasNew}, Legacy=${hasLegacy}`);

            return hasNew || hasLegacy;
        });

        console.log("My Projects found:", myProjects.length);

        if (myProjects.length === 0) {
            main.innerHTML = `
                <div class="page-header">
                    <h2>⏳ Project Allocations</h2>
                    <p class="subtitle">Time budget details for your assigned projects.</p>
                </div>
                <div class="empty-state">
                    <h3>No Projects Allocated</h3>
                    <p>You have not been assigned to any active projects with time allocations yet.</p>
                </div>
            `;
            hideLoading();
            return;
        }

        // 3. Build the Table
        const rows = myProjects.map(p => {
            // Handle numeric conversions safely
            const maxHours = parseFloat(p.maxAllocatedHours) || 0;
            const addHours = parseFloat(p.additionalHours) || 0;
            const totalProjectBudget = maxHours + addHours;

            // Get designer-specific allocated hours from designerHours object
            let myAllocatedHours = 0;
            if (p.designerHours && p.designerHours[currentUser.uid]) {
                myAllocatedHours = parseFloat(p.designerHours[currentUser.uid]) || 0;
            } else if (totalProjectBudget > 0) {
                // Fallback: if no specific allocation, show total budget
                myAllocatedHours = totalProjectBudget;
            }

            const usedHours = parseFloat(p.hoursLogged) || 0;
            
            // Calculate remaining based on designer's personal allocation
            const myRemaining = myAllocatedHours - usedHours;
            
            // Also track project-level budget for context
            const projectRemaining = totalProjectBudget - usedHours;

            // Calculate percentage for progress bar (based on designer's allocation)
            const percentUsed = myAllocatedHours > 0 ? (usedHours / myAllocatedHours) * 100 : 0;

            // Status Logic
            let statusColor = 'var(--success)'; // Green
            let statusText = 'On Track';

            if (myRemaining < 0) {
                statusColor = 'var(--danger)'; // Red
                statusText = 'Over Budget';
            } else if (myAllocatedHours > 0 && myRemaining < (myAllocatedHours * 0.2)) {
                statusColor = 'var(--warning)'; // Orange
                statusText = 'Low Budget';
            }

            // Date formatting helper (assumes formatDate is available)
            const targetDate = p.targetCompletionDate ? formatDate(p.targetCompletionDate) : 'N/A';

            return `
                <tr>
                    <td>
                        <strong>${p.projectName || 'Unknown Project'}</strong><br>
                        <small style="color: var(--text-light);">${p.projectCode || 'No Code'}</small>
                    </td>
                    <td>${p.clientCompany || 'N/A'}</td>
                    <td>${targetDate}</td>

                    <td style="text-align: center;">
                        <span style="font-weight: bold; font-size: 1.1em; color: var(--primary-blue);">${myAllocatedHours.toFixed(1)}h</span>
                        <br><small class="text-muted" style="font-size:0.75em;">Your Allocation</small>
                        ${totalProjectBudget !== myAllocatedHours ? `<br><small style="font-size:0.7em; color: #888;">(Project: ${totalProjectBudget.toFixed(1)}h)</small>` : ''}
                        ${addHours > 0 ? `<br><small class="text-muted" style="font-size:0.7em;">(+${addHours}h buffer)</small>` : ''}
                    </td>
                    <td style="text-align: center;">
                         <div>${usedHours.toFixed(1)}h</div>
                         <div style="width: 100%; background: #eee; height: 6px; border-radius: 3px; margin-top: 5px;">
                            <div style="width: ${Math.min(percentUsed, 100)}%; background: ${statusColor}; height: 100%; border-radius: 3px;"></div>
                         </div>
                         <small style="font-size: 0.7em; color: #888;">${percentUsed.toFixed(0)}% used</small>
                    </td>
                    <td style="text-align: center;">
                        <span style="font-weight: bold; color: ${statusColor}; font-size: 1.1em;">${myRemaining.toFixed(1)}h</span>
                        <br><small style="font-size: 0.75rem; color: ${statusColor}">${statusText}</small>
                        ${myRemaining <= 0 ? `<br><small style="color: var(--danger); font-size: 0.7em;">Request more time</small>` : ''}
                    </td>

                    <td class="action-column"> 
                        <button class="btn btn-secondary btn-sm" 
                                onclick="showProjectFilesModal('${p.id}', '${p.projectName.replace(/'/g, "\\'")}')">
                            📂 View Files
                        </button>
                        <button class="btn btn-primary btn-sm" 
                                onclick="showTimesheetModal('${p.id}')"
                                data-allocated="${myAllocatedHours}"
                                data-remaining="${myRemaining}">
                            ⏱️ Log Time
                        </button>
                        ${myRemaining <= 5 ? `
                            <button class="btn btn-warning btn-sm" 
                                    onclick="showRequestTimeModalDirect('${p.id}', '${p.projectName.replace(/'/g, "\\'")}', ${myAllocatedHours}, ${usedHours})">
                                ⏰ Request Time
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');

        main.innerHTML = `
            <div class="page-header">
                <h2>⏳ Project Allocations</h2>
                <p class="subtitle">Monitor time budgets for your assigned projects. Hours shown are your personal allocation.</p>
            </div>

            <div class="card">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Client</th>
                            <th>Target Date</th>
                            <th style="text-align: center;">My Allocated Hours</th>
                            <th style="text-align: center;">Hours Used</th>
                            <th style="text-align: center;">Remaining</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;

    } catch (error) {
        console.error(error);
        main.innerHTML = `<div class="error-message">Error loading allocations: ${error.message}</div>`;
    } finally {
        hideLoading();
    }
}

// ✅ Make showDesignerAllocations globally accessible
window.showDesignerAllocations = showDesignerAllocations;

     async function showProjectFilesModal(projectId, projectName) {
    console.log('📂 Opening files for project:', projectId, projectName);

    // -----------------------------------------------------------------------------------
    // --- FIX: Dynamically create the modal structure if it doesn't exist.
    // --- This prevents the "TypeError: Cannot set properties of null" error
    // --- because the elements like 'projectFilesModalTitle' are guaranteed to be in the DOM.
    // -----------------------------------------------------------------------------------
    // FIXED: Remove existing modal first to prevent stale data
    let existingModal = document.getElementById('projectFilesModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Define the full HTML structure for the project files modal
    const modalHtml = `
        <div class="modal-overlay" id="projectFilesModal" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center;" onclick="handleModalOverlayClick(event, 'projectFilesModal')">
            <div class="modal-content" style="max-width: 900px; background: white; border-radius: 12px; max-height: 90vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <div class="modal-header" style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                    <h2 id="projectFilesModalTitle" style="margin: 0;"></h2>
                    <span class="close-modal" onclick="closeProjectFilesModal()" style="cursor: pointer; font-size: 2rem; color: #666; line-height: 1;">&times;</span>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto; padding: 1.5rem;">
                    <p id="projectFilesModalSubtitle" style="color: var(--text-light); margin-bottom: 1.5rem;"></p>
                    <div id="projectFilesContent">
                    </div>
                </div>
                <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end;">
                    <button class="btn btn-outline" onclick="closeProjectFilesModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.classList.add('modal-open');
    // -----------------------------------------------------------------------------------

    // 1. Get DOM elements (These are now guaranteed to exist)
    const title = document.getElementById('projectFilesModalTitle');
    const subtitle = document.getElementById('projectFilesModalSubtitle');
    const content = document.getElementById('projectFilesContent');

    // 2. Set initial state (Title and Loading spinner)
    title.textContent = `📂 Project Files: ${projectName}`;
    subtitle.textContent = `Loading files for project...`;
    content.innerHTML = '<div class="loading-spinner" style="text-align: center; padding: 2rem;"><div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid var(--primary-blue); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div><p style="margin-top: 1rem; color: var(--text-light);">Loading files...</p></div>';

    // 3. Modal is already visible (display: flex set inline) 

    try {
        // 4. First, get the project details to find the proposalId
        const projectResponse = await apiCall(`projects?id=${projectId}`);
        
        if (!projectResponse.success) {
            throw new Error(projectResponse.error || 'Failed to fetch project details.');
        }
        
        const project = projectResponse.data;
        console.log('📦 Project details:', project);
        
        // 5. Fetch files using BOTH projectId AND proposalId
        let files = [];
        
        // Approach 1: Try fetching by projectId
        try {
            const response1 = await apiCall(`files?projectId=${projectId}`);
            if (response1.success && response1.data && response1.data.length > 0) {
                files = response1.data;
                console.log('✅ Files found using projectId:', files.length);
            }
        } catch (err) {
            console.log('⚠️ Could not fetch files by projectId:', err.message);
        }
        
        // Approach 2: If no files found and we have a proposalId, try that
        if (files.length === 0 && project.proposalId) {
            try {
                const response2 = await apiCall(`files/list?proposalId=${project.proposalId}`);
                if (response2.success && response2.data && response2.data.length > 0) {
                    files = response2.data;
                    console.log('✅ Files found using proposalId:', files.length);
                }
            } catch (err) {
                console.log('⚠️ Could not fetch files by proposalId:', err.message);
            }
        }
        
        // Approach 3: Try the legacy endpoint as a fallback
        if (files.length === 0 && project.proposalId) {
            try {
                const response3 = await apiCall(`files?proposalId=${project.proposalId}`);
                if (response3.success && response3.data && response3.data.length > 0) {
                    files = response3.data;
                    console.log('✅ Files found using legacy endpoint:', files.length);
                }
            } catch (err) {
                console.log('⚠️ Could not fetch files using legacy endpoint:', err.message);
            }
        }
        
        console.log('📊 Total files retrieved:', files.length);
        
        if (files.length === 0) {
            content.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 3rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">📭</div>
                    <h3>No Files Available</h3>
                    <p style="color: var(--text-light); margin-top: 0.5rem;">
                        No files have been uploaded for this project yet.
                    </p>
                    ${project.proposalId ? `<small style="color: var(--text-light);">Project Code: ${project.projectCode || 'N/A'} | Proposal ID: ${project.proposalId}</small>` : ''}
                </div>
            `;
            return;
        }

        // 6. Log files for debugging
        console.log('📂 Files to display:', files);
        files.forEach((f, i) => console.log(`  File ${i}:`, f));

        // 6. Group files by type for better organization
        const filesByType = {
            drawing: [],
            specification: [],
            estimate: [],
            project: [],
            other: []
        };
        
        files.forEach(file => {
            // Skip null/undefined files
            if (!file) return;
            
            const type = file.fileType || 'other';
            if (filesByType[type]) {
                filesByType[type].push(file);
            } else {
                filesByType.other.push(file);
            }
        });

        // 7. Build the file list HTML with grouping
        let fileListHtml = '';
        
        const typeLabels = {
            drawing: { icon: '📐', label: 'Drawings & Plans', color: '#3b82f6' },
            specification: { icon: '📋', label: 'Specifications', color: '#10b981' },
            estimate: { icon: '💰', label: 'Estimates', color: '#f59e0b' },
            project: { icon: '📁', label: 'Project Documents', color: '#8b5cf6' },
            other: { icon: '📄', label: 'Other Files', color: '#6b7280' }
        };
        
        Object.keys(filesByType).forEach(type => {
            const typeFiles = filesByType[type];
            if (typeFiles.length === 0) return;
            
            const typeInfo = typeLabels[type];
            
            fileListHtml += `
                <div class="file-type-section" style="margin-bottom: 2rem;">
                    <h3 style="color: ${typeInfo.color}; font-size: 1.1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">${typeInfo.icon}</span>
                        ${typeInfo.label} (${typeFiles.length})
                    </h3>
                    <div class="files-grid">
                        ${typeFiles.map(file => {
                            // Defensive checks for file properties
                            if (!file) return '';
                            
                            const uploadDate = file.uploadedAt ? formatDate(file.uploadedAt) : 'N/A';
                            const uploadedBy = file.uploadedByName || file.uploadedBy || 'Unknown User';
                            const fileSize = file.fileSize ? formatFileSize(file.fileSize) : '';
                            const fileName = file.fileName || file.originalName || file.name || 'Unknown File';
                            const fileUrl = file.fileUrl || file.url || file.downloadUrl || '';
                            
                            // Skip files without URL
                            if (!fileUrl) {
                                console.warn('File without URL:', file);
                                return '';
                            }
                            
                            // Safely escape filename for onclick
                            const safeFileName = (fileName || 'download').replace(/'/g, "\\'").replace(/"/g, '\\"');
                            const safeUrl = (fileUrl || '').replace(/'/g, "\\'");
                            
                            return `
                                <div class="file-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 10px; margin-bottom: 0.75rem; transition: all 0.3s ease;">
                                    <div style="flex: 1; min-width: 0;">
                                        <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-dark); margin-bottom: 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                            📄 ${fileName}
                                        </div>
                                        <div style="font-size: 0.85rem; color: var(--text-light);">
                                            Uploaded by <strong>${uploadedBy}</strong> on ${uploadDate}
                                            ${fileSize ? ` • ${fileSize}` : ''}
                                        </div>
                                    </div>
                                    <div style="display: flex; gap: 0.5rem; flex-shrink: 0; margin-left: 1rem;">
                                        <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" 
                                           style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid #ddd; background: white; color: #333; cursor: pointer; font-size: 0.9rem;">
                                            👁️ View
                                        </a>
                                        <button onclick="downloadFile('${safeUrl}', '${safeFileName}')" 
                                           style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.5rem 1rem; border-radius: 6px; border: none; background: #1e40af; color: white; cursor: pointer; font-size: 0.9rem;">
                                            ⬇️ Download
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).filter(html => html).join('')}
                    </div>
                </div>
            `;
        });

        // 8. Inject the list with enhanced styling
        content.innerHTML = `
            <style>
                .file-type-section { }
                .files-grid { }
                .file-item:hover {
                    background: white !important;
                    border-color: var(--primary-blue) !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }
            </style>
            ${fileListHtml}
        `;

    } catch (error) {
        console.error("❌ Error loading project files:", error);
        content.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem; color: var(--danger);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h3>Error Loading Files</h3>
                <p style="margin-top: 0.5rem;">${error.message}</p>
                <button onclick="showProjectFilesModal('${projectId}', '${projectName}')" class="btn btn-primary" style="margin-top: 1rem;">
                    🔄 Retry
                </button>
            </div>
        `;
    }
}

// ✅ FIXED: Dedicated close function for project files modal
function closeProjectFilesModal() {
    const modal = document.getElementById('projectFilesModal');
    if (modal) {
        modal.remove();
    }
    document.body.classList.remove('modal-open');
}

// Make it globally accessible
window.closeProjectFilesModal = closeProjectFilesModal;
window.showProjectFilesModal = showProjectFilesModal;
                                
// Helper function to format file size
function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
        // ============================================
        // TASKS (Designer)
        // ============================================

        // showTasks is defined later in the file (line ~14580)
        // showDesignerDashboard calls showDesignerAllocations
        function renderTasksList(tasks) { /* ... (Unchanged) ... */ }

        // ============================================
        // DELIVERABLES (Designer)
        // ============================================

        async function showDesignerDashboard() {
            // Designer dashboard shows the Project Allocations view
            await showDesignerAllocations();
        }
                async function viewDesignerProject(projectId) {
            console.log('👀 Opening project:', projectId);
            setActiveNav('');
            
            try {
                showLoading();
                
                // Fetch project details
                const projectResponse = await apiCall(`projects?id=${projectId}`);
                if (!projectResponse.success) {
                    throw new Error(projectResponse.error || 'Failed to fetch project');
                }
                
                const project = projectResponse.data;
                console.log('📦 Project data:', project);
                
                // Fetch proposal to get project files
                const proposalResponse = await apiCall(`proposals?id=${project.proposalId}`);
                const proposal = proposalResponse.success ? proposalResponse.data : null;
                
                // Fetch files for this project/proposal
                const filesResponse = await apiCall(`files/list?proposalId=${project.proposalId || project.id}`);
                const files = filesResponse.success ? filesResponse.data : [];
                
                console.log('📁 Files found:', files);
                
                // Separate files by type
                const drawings = files.filter(f => 
                    f.fileType === 'drawing' || 
                    f.fileType === 'project' || 
                    f.fileName.match(/\.(dwg|dxf|pdf)$/i)
                );
                const specifications = files.filter(f => 
                    f.fileType === 'specification' || 
                    f.fileName.match(/\.(doc|docx|pdf|txt)$/i)
                );
                
                const drawingsHtml = drawings.length > 0 
                    ? drawings.map(file => `
                        <div class="file-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
                            <div>
                                <span style="font-weight: 500;">📄 ${file.fileName}</span>
                                <br>
                                <small style="color: #6b7280;">Uploaded: ${new Date(file.uploadedAt).toLocaleDateString()}</small>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <a href="${file.fileUrl}" target="_blank" class="btn btn-primary btn-sm" 
                                   style="text-decoration: none; display: inline-block;">
                                    👁️ View
                                </a>
                                <a href="${file.fileUrl}" download="${file.fileName}" class="btn btn-success btn-sm"
                                   style="text-decoration: none; display: inline-block;">
                                    ⬇️ Download
                                </a>
                            </div>
                        </div>
                    `).join('')
                    : '<p style="color: #6b7280; text-align: center; padding: 20px;">No drawings available for this project</p>';
                
                const specsHtml = specifications.length > 0
                    ? specifications.map(file => `
                        <div class="file-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
                            <div>
                                <span style="font-weight: 500;">📄 ${file.fileName}</span>
                                <br>
                                <small style="color: #6b7280;">Uploaded: ${new Date(file.uploadedAt).toLocaleDateString()}</small>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <a href="${file.fileUrl}" target="_blank" class="btn btn-primary btn-sm"
                                   style="text-decoration: none; display: inline-block;">
                                    👁️ View
                                </a>
                                <a href="${file.fileUrl}" download="${file.fileName}" class="btn btn-success btn-sm"
                                   style="text-decoration: none; display: inline-block;">
                                    ⬇️ Download
                                </a>
                            </div>
                        </div>
                    `).join('')
                    : '<p style="color: #6b7280; text-align: center; padding: 20px;">No specifications available for this project</p>';
                
                // Display the project details modal
                document.getElementById('mainContent').innerHTML = `
                    <div class="page-header">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h1 class="page-title">${project.projectName}</h1>
                                <p class="page-subtitle">Project Number: ${project.projectNumber || 'N/A'}</p>
                            </div>
                            <button class="btn btn-secondary" onclick="showDesignerDashboard()">
                                ← Back to Projects
                            </button>
                        </div>
                    </div>
                    
                    <div class="content-section" style="margin-bottom: 20px;">
                        <h3 style="color: var(--primary-blue); margin-bottom: 15px;">Project Information</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">Client Name</div>
                                <div class="info-value">${project.clientName || 'N/A'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Allocated Hours</div>
                                <div class="info-value">${project.allocatedHours || 0}h</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Designer</div>
                                <div class="info-value">${project.assignedDesignerName || 'Not assigned'}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Status</div>
                                <div class="info-value">
                                    <span class="status-badge ${getStatusBadgeClass(project.status)}">${getStatusText(project.status)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <div class="document-tabs">
                            <button class="doc-tab active" onclick="switchDesignerTab('drawings')">
                                📐 Drawings (${drawings.length})
                            </button>
                            <button class="doc-tab" onclick="switchDesignerTab('specifications')">
                                📋 Specifications (${specifications.length})
                            </button>
                        </div>
                        
                        <div id="designer-drawings-content" class="doc-content active" style="margin-top: 20px;">
                            ${drawingsHtml}
                        </div>
                        
                        <div id="designer-specs-content" class="doc-content" style="margin-top: 20px; display: none;">
                            ${specsHtml}
                        </div>
                    </div>
                `;
                
            } catch (error) {
                console.error('❌ Error loading project:', error);
                alert(`Error: ${error.message}`);
            } finally {
                hideLoading();
            }
        }
        function showUploadDeliverablesModal(projectId) { /* ... (Unchanged) ... */ }
        function switchUploadTab(tab) { /* ... (Unchanged) ... */ }
        function addDeliverableLinkField() { /* ... (Unchanged) ... */ }
        async function uploadDeliverables(projectId) { /* ... (Unchanged) ... */ }
        async function deleteDeliverable(deliverableId) { /* ... (Unchanged) ... */ }
         // ============================================
// PAYMENTS (Accounts, BDM, COO, Director)
// ============================================

/**
 * Main entry point for the "Accounts" page.
 * Fetches all payments and routes to the correct view based on user role.
 */
async function showPayments() {
    setActiveNav('nav-payments');
    const main = document.getElementById('mainContent');
    showLoading();
    main.innerHTML = ''; // Clear content

    try {
        // All roles need to fetch payments/invoices
        const response = await apiCall('payments'); // Assumes this hits your invoices.js logic
        if (!response.success) {
            throw new Error(response.error || 'Failed to load payments/invoices');
        }
        const allInvoices = response.data || [];

        if (currentUserRole === 'accounts') {
            // --- START MODIFICATION ---
            // ACCOUNTANT VIEW: Show projects SUBMITTED BY DESIGN MANAGER (e.g., status 'completed')
            
            // 1. Fetch completed projects
            // We assume a 'completed' status is set by the Design Manager/Designer
            const projectsResponse = await apiCall('projects?status=completed');
            const projects = projectsResponse.success ? projectsResponse.data : [];
            
            // 2. Filter out projects that already have an invoice
            const invoicedProjectIds = new Set(allInvoices.map(inv => inv.projectId));
            
            // 3. Get the proposals for these completed projects to get financial data
            const proposalIds = projects.map(p => p.proposalId).filter(Boolean);
            let proposalsMap = new Map();
            if (proposalIds.length > 0) {
                // Fetch all 'won' proposals and filter.
                const proposalsResponse = await apiCall('proposals?status=won');
                if (proposalsResponse.success) {
                    proposalsResponse.data.forEach(p => proposalsMap.set(p.id, p));
                }
            }

            // 4. Create the 'projectsToInvoice' list
            const projectsToInvoice = projects
               .filter(p => !invoicedProjectIds.has(p.id)) // <-- CORRECTED LINE
                .map(p => {
                    // Try to find the matching proposal data
                    const proposal = proposalsMap.get(p.proposalId);
                    if (proposal) {
                        // Combine project and proposal data
                        return {
                            ...proposal, // Gets wonDate, clientCompany, projectName, pricing
                            projectId: p.id, // Ensure we use the project ID
                            id: proposal.id, // Use proposal ID for invoice creation
                            status: p.status, // Use the project's 'completed' status
                            completedDate: p.completedAt || p.updatedAt // Use project completion date
                        };
                    }
                    // Fallback if proposal not found
                    return {
                        ...p,
                        id: p.proposalId, // Fallback to proposalId
                        wonDate: p.createdAt, // Fallback
                        completedDate: p.updatedAt
                    };
                });
            
            // --- END MODIFICATION ---

            // TODO: Add logic to fetch approved variations that need invoicing

            renderPaymentsList(allInvoices, projectsToInvoice);
        } else {
            // BDM, COO, DIRECTOR VIEW: Show an overview of existing invoices
            let invoicesToShow = allInvoices;

            if (currentUserRole === 'bdm') {
                // BDM: Filter to show only their projects
                // This filtering is done on the frontend
                const proposalsResponse = await apiCall('proposals');
                if (!proposalsResponse.success) {
                    throw new Error('Failed to load proposals for filtering');
                }
                // Get all proposal IDs AND project IDs associated with this BDM
                const myProposalIds = new Set();
                const myProjectIds = new Set();
                proposalsResponse.data.forEach(p => {
                    if (p.createdByUid === currentUser.uid) {
                        myProposalIds.add(p.id);
                        if (p.projectId) {
                            myProjectIds.add(p.projectId);
                        }
                    }
                });
                
                invoicesToShow = allInvoices.filter(inv => 
                    myProposalIds.has(inv.proposalId) || myProjectIds.has(inv.projectId)
                );
            }
            
            // COO/Director see all, so `invoicesToShow` is already correct for them
            renderAccountsOverview(invoicesToShow);
        }

    } catch (error) {
        console.error('Error in showPayments:', error);
        main.innerHTML = `<div class="error-message"><h3>Error Loading Payments</h3><p>${error.message}</p></div>`;
    } finally {
        hideLoading();
    }
}

/**
 * Renders the view for the ACCOUNTANT role.
 * Shows projects ready to be invoiced and a list of existing invoices.
 */
function renderPaymentsList(invoices, projectsToInvoice) {
    const main = document.getElementById('mainContent');

    // --- START MODIFICATION ---
    // This code is inside your renderPaymentsList function (line 4305)

const projectsToInvoiceHtml = projectsToInvoice.length > 0 ? projectsToInvoice.map(p => `
    <div class="action-item">
        <div class="action-content">
            <strong>${p.projectName}</strong>
            <div class="action-meta">
                Client: ${p.clientCompany} | Project #: ${p.pricing?.projectNumber || 'N/A'} | Completed: ${formatDate(p.completedDate)}
            </div>
        </div>
        <div class="action-buttons">
            <button class="btn btn-success btn-sm" onclick="showCreateInvoiceModal('${p.projectId}', '${p.id}')">
                Create Invoice
            </button>
        </div>
    </div>
`).join('') : '<p>No new completed projects ready for invoicing.</p>'; // <-- Your current empty state

    // Section for existing invoices
    const invoicesHtml = invoices.length > 0 ? invoices.map(p => {
        const statusClass = (p.status || 'draft').toLowerCase().replace(/ /g, '-');
        return `
        <div class="action-item">
            <div class="action-content">
                <strong>Invoice #${p.invoiceNumber} (Project: ${p.projectName || 'N/A'})</strong>
                <div class="action-meta">
                    Client: ${p.clientCompany} | Amount: ${p.currency} ${p.amount} | Due: ${formatDate(p.dueDate)}
                </div>
            </div>
            <span class="proposal-status status-${statusClass}">${p.status}</span>
            <div class="action-buttons">
                <button class="btn btn-outline btn-sm" onclick="viewPayment('${p.id}')">View</button>
                <button class="btn btn-primary btn-sm" onclick="showUpdatePaymentModal('${p.id}')">Update Status</button>
            </div>
        </div>
        `}).join('') : '<p>No invoices created yet.</p>';

    main.innerHTML = `
        <div class="page-header">
            <h2>Accounts & Payments</h2>
            <div class="subtitle">Manage project invoices and payment status.</div>
        </div>
        
        <div class="action-section">
            <h3>Projects Ready for Invoicing</h3>
            ${projectsToInvoiceHtml}
        </div>

        <div class="action-section">
            <h3>Existing Invoices</h3>
            ${invoicesHtml}
        </div>
    `;
}

/**
 * Renders the overview table for BDM, COO, and DIRECTOR roles.
 */
function renderAccountsOverview(invoices) {
            const main = document.getElementById('mainContent');

            const invoicesHtml = invoices.length > 0 ? invoices.map(inv => {
                // --- FIX: Use backend field names 'paymentStatus', 'invoiceNo', 'paymentDueDate', 'invoiceAmount' ---
                const statusClass = (inv.paymentStatus || 'draft').toLowerCase().replace(/ /g, '-');
                const isVariation = inv.variationId ? '<span class="proposal-status status-pending" style="margin-left: 8px;">VARIATION</span>' : '';
                
                return `
                <tr>
                    <td><strong>${inv.invoiceNo || 'undefined'}</strong> ${isVariation}</td>
                    <td>${inv.projectName || 'N/A'}</td>
                    <td>${inv.clientCompany || 'N/A'}</td>
                    <td>${formatDate(inv.createdAt)}</td>
                    <td>${formatDate(inv.paymentDueDate)}</td>
                    <td>${inv.currency} ${inv.invoiceAmount || 'undefined'}</td>
                    <td><span class->"proposal-status status-${statusClass}">${inv.paymentStatus || 'undefined'}</span></td>
                    <td><button class="btn btn-outline btn-sm" onclick="viewPayment('${inv.id}')">View</A></td>
                </tr>
                `;
            }).join('') : '<tr><td colspan="8" class="text-center">No invoices found.</td></tr>';

    main.innerHTML = `
        <div class="page-header">
            <h2>Invoice Overview</h2>
            <div class="subtitle">View all created project and variation invoices.</div>
        </div>
        
        <div class="card">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Invoice #</th>
                        <th>Project</th>
                        <th>Client</th>
                        <th>Submission Date</th>
                        <th>Due Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoicesHtml}
                </tbody>
            </table>
        </div>
    `;
}

// This is your existing function from index (53).html (line 4426)
async function showCreateInvoiceModal(projectId, proposalId) {
    if (!projectId || !proposalId) {
        alert('Error: Missing Project ID or Proposal ID.');
        return;
    }

    try {
        showLoading();
        // Fetches proposal data to autofill project name, client, and amount
        const { success, data: proposal } = await apiCall(`proposals?id=${proposalId}`);
        if (!success || !proposal) {
            throw new Error('Failed to load proposal data for autofill');
        }
        
        hideLoading();
        
        const clientCompany = proposal.clientCompany || '';
        const projectName = proposal.projectName || '';
        const quoteValue = proposal.pricing?.quoteValue || '0.00';
        const currency = proposal.pricing?.currency || 'USD';

        const modalHtml = `
            <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h2>Create New Invoice</h2>
                        <div class="subtitle">For project: ${projectName}</div>
                    </div>
                    
                    <form id="createInvoiceForm" class="modal-form">
                        <input type="hidden" id="inv_projectId" value="${projectId}">
                        <input type="hidden" id="inv_proposalId" value="${proposalId}">

                        <input type="hidden" id="inv_projectName" value="${projectName}">
                        <input type="hidden" id="inv_clientCompany" value="${clientCompany}">
                        <input type="hidden" id="inv_currency" value="${currency}">

                        <div class="info-section">
                            <h4>Autofilled Details</h4>
                            <p><strong>Project:</strong> ${projectName}</p>
                            <p><strong>Client:</strong> ${clientCompany}</p>
                            <p><strong>Quoted Value:</strong> ${currency} ${quoteValue}</p>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Invoice Number *</label>
                                <input type="text" id="inv_invoiceNo" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label>Invoice Amount *</label>
                                <input type="number" id="inv_amount" class="form-control" value="${quoteValue}" step="0.01" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Invoice Date *</label>
                                <input type="date" id="inv_invoiceDate" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                            </div>
                            <div class="form-group">
                                <label>Payment Due Date *</label>
                                <input type="date" id="inv_paymentDueDate" class="form-control" required>
                            </div>
                        </div>
                            <div class="form-group">
                                <label>Payment Terms</label>
                                <input type="text" id="inv_paymentTerms" class="form-control" placeholder="e.g., Net 30">
                            </div>
                        <div class="form-group">
                            <label>Milestone / Description</label>
                            <textarea id="inv_milestoneDescription" class="form-control" rows="3" placeholder="e.g., Final payment for project completion"></textarea>
                        </div>

                        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                            <button type="button" onclick="closeModal()" class="btn btn-outline">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save & Send Notifications</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Add submit listener
        document.getElementById('createInvoiceForm').addEventListener('submit', createInvoiceAction);

    } catch (error) {
        hideLoading();
        alert(`Error loading invoice form: ${error.message}`);
    }
}

/**
 * Handles the submission of the new invoice form.
 * Saves the invoice and triggers notifications to BDM, COO, and Director.
 */
async function createInvoiceAction(event) {
    event.preventDefault();
    showLoading();
    
    // ***FIX***: Read all data from the form, including new hidden fields
    const invoiceData = {
        projectId: document.getElementById('inv_projectId').value,
        proposalId: document.getElementById('inv_proposalId').value,
        invoiceNo: document.getElementById('inv_invoiceNo').value,
        invoiceDate: document.getElementById('inv_invoiceDate').value,
        amount: parseFloat(document.getElementById('inv_amount').value),
        paymentDueDate: document.getElementById('inv_paymentDueDate').value,
        paymentTerms: document.getElementById('inv_paymentTerms').value,
        milestoneDescription: document.getElementById('inv_milestoneDescription').value,

        // Data from hidden fields for notifications
        projectName: document.getElementById('inv_projectName').value,
        clientCompany: document.getElementById('inv_clientCompany').value,
        currency: document.getElementById('inv_currency').value
    };

    // Validation
    if (!invoiceData.projectId || !invoiceData.invoiceNo || !invoiceData.invoiceDate || !invoiceData.amount || !invoiceData.paymentDueDate) {
            alert('Please fill out all required fields (*)');
            hideLoading();
            return;
    }

    try {
        // 1. Save the invoice
        // This POST request is handled by payments (2).js
        // We send the core data to be saved to the DB
        const apiPayload = {
            projectId: invoiceData.projectId,
            proposalId: invoiceData.proposalId,
            invoiceNo: invoiceData.invoiceNo,
            invoiceDate: invoiceData.invoiceDate,
            amount: invoiceData.amount,
            paymentDueDate: invoiceData.paymentDueDate,
            paymentTerms: invoiceData.paymentTerms,
            milestoneDescription: invoiceData.milestoneDescription,
            // Pass notification data in case backend needs it
            projectName: invoiceData.projectName,
            clientCompany: invoiceData.clientCompany,
            currency: invoiceData.currency
        };
        
        const response = await apiCall('payments', { 
            method: 'POST',
            body: JSON.stringify(apiPayload)
        });

        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to save invoice');
        }
        
        // ***FIX***: The notification logic is now INSIDE the async function
        
        // ============================================================
        // 🟢 PASTE YOUR NEW CODE HERE
        // ============================================================
        await triggerEmailNotification('invoice.saved', {
            projectId: invoiceData.projectId,
            invoiceNumber: invoiceData.invoiceNo,
            amount: invoiceData.currency + ' ' + invoiceData.amount,
            // Add these two lines so the email template has the data it needs:
            projectName: invoiceData.projectName,
            clientName: invoiceData.clientCompany 
        });
        // ============================================================

        // 3. Trigger Internal Notifications (Bell Icon)
        // We need to find the BDM's UID from the proposal.
        // ***FIX***: This await call is now correctly inside the async function
        const proposalResponse = await apiCall(`proposals?id=${invoiceData.proposalId}`);
        const bdmUid = proposalResponse.data?.createdByUid;
        
        // ***FIX***: Corrected variable name
        const notificationMessage = `Invoice ${invoiceData.invoiceNo} created for ${invoiceData.projectName}.`;
        
        // Create notifications for COO and Director (role-based)
        const rolesToNotify = ['coo', 'director'];
        const notificationPromises = rolesToNotify.map(role => 
            apiCall('notifications', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'invoice.created',
                    recipientRole: role,
                    message: notificationMessage,
                    projectId: invoiceData.projectId,
                    proposalId: invoiceData.proposalId
                })
            })
        );

        // Send a specific notification to the BDM (UID-based)
        if (bdmUid) {
            notificationPromises.push(
                apiCall('notifications', {
                    method: 'POST',
                    body: JSON.stringify({
                        type: 'invoice.created',
                        recipientUid: bdmUid, // Specific user
                        recipientRole: 'bdm', // Role for context
                        message: `Invoice ${invoiceData.invoiceNo} was created for your project: ${invoiceData.projectName}.`,
                        projectId: invoiceData.projectId,
                        proposalId: invoiceData.proposalId
                    })
                })
            );
        }
        
        // ***FIX***: This await call is now correctly inside the async function
        await Promise.all(notificationPromises);
        console.log('Internal notifications created for BDM, COO, Director.');
        showNotification('Invoice created and notifications sent!', 'success');

        closeModal();
        showPayments(); // Refresh the payments page

    // ***FIX***: These catch/finally blocks now correctly close the function
    } catch (error) {
        alert(`Error creating invoice: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Shows a read-only modal with invoice details.
 */
async function viewPayment(paymentId) {
    try {
        showLoading();
        const { success, data: invoice } = await apiCall(`payments?id=${paymentId}`); // Use 'payments' endpoint
        if (!success || !invoice) {
            throw new Error('Failed to load invoice details');
        }
        hideLoading();
        
        const statusClass = (invoice.status || 'draft').toLowerCase().replace(/ /g, '-');

        const modalHtml = `
            <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <div>
                            <h2>Invoice #${invoice.invoiceNumber}</h2>
                            <div class="subtitle">Project: ${invoice.projectName}</div>
                        </div>
                        <span class="close-modal" onclick="closeModal()">&times;</span>
                    </div>
                    <div class="modal-body" style="padding: 2rem;">
                        <div style="margin-bottom: 2rem;">
                            <strong>Status:</strong>
                            <span class="proposal-status status-${statusClass}">
                                ${invoice.status}
                            </span>
                        </div>
                        
                        <div class="allocation-details-section">
                            <h3>Invoice Details</h3>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <label>Client:</label>
                                    <span class="detail-value">${invoice.clientCompany}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Amount:</label>
                                    <span class="detail-value">${invoice.currency} ${invoice.amount}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Submitted Date:</label>
                                    <span class="detail-value">${formatDate(invoice.createdAt)}</span>
                                </div>
                                <div class="detail-item">
                                    <label>Due Date:</label>
                                    <span class="detail-value">${formatDate(invoice.dueDate)}</span>
                                </div>
                                <div class="detail-item highlight" style="grid-column: span 2;">
                                    <label>Notes:</label>
                                    <p class="detail-value" style="white-space: pre-wrap;">${invoice.notes || 'No notes'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" onclick="closeModal()" class="btn btn-outline">Close</button>
                        ${currentUserRole === 'accounts' ? `
                            <button type="button" onclick="closeModal(); showUpdatePaymentModal('${invoice.id}');" class="btn btn-primary">Update Status</button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

    } catch (error) {
        hideLoading();
        alert(`Error viewing invoice: ${error.message}`);
    }
}

/**
 * Shows the modal for an Accountant to update the status of an existing invoice.
 */
async function showUpdatePaymentModal(paymentId) {
    try {
        showLoading();
        const { success, data: invoice } = await apiCall(`payments?id=${paymentId}`);
        if (!success || !invoice) throw new Error('Failed to load invoice');
        hideLoading();
        
        closeModal(); // Close the view modal if open

        const modalHtml = `
           <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h2>Update Payment Status</h2>
                        <div class="subtitle">Invoice #${invoice.invoiceNumber}</div>
                    </div>
                    <form id="updatePaymentForm" class="modal-form">
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Status</label>
                                <select id="paymentStatus" class="form-control">
                                    <option value="Submitted" ${invoice.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
                                    <option value="Paid" ${invoice.status === 'Paid' ? 'selected' : ''}>Paid</option>
                                    <option value="Partially Paid" ${invoice.status === 'Partially Paid' ? 'selected' : ''}>Partially Paid</option>
                                    <option value="Overdue" ${invoice.status === 'Overdue' ? 'selected' : ''}>Overdue</option>
                                    <option value="Cancelled" ${invoice.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Update Notes</label>
                                <textarea id="paymentNotes" class="form-control" rows="3" placeholder="Add a note about this update..."></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" onclick="closeModal()" class="btn btn-outline">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Update</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('updatePaymentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            updatePaymentAction(paymentId);
        });

    } catch (error) {
        hideLoading();
        alert(`Error: ${error.message}`);
    }
}

/**
 * Handles the submission of the payment status update.
 */
async function updatePaymentAction(paymentId) {
    const newStatus = document.getElementById('paymentStatus').value;
    const notes = document.getElementById('paymentNotes').value;

    try {
        showLoading();
        // We are PUT-ing to the /api/payments?id=... endpoint
        // This assumes your backend has a PUT handler at this endpoint.
        const response = await apiCall(`payments?id=${paymentId}`, {
            method: 'PUT',
            body: JSON.stringify({
                status: newStatus,
                notes: notes // This should append notes, not overwrite
            })
        });

        if (!response.success) {
            console.warn('Payment update API call failed. This requires a PUT handler on your backend /api/payments endpoint.');
            throw new Error(response.error || 'Failed to update payment. (Check backend PUT handler)');
        }
        
        showNotification('Payment status updated!', 'success');
        closeModal();
        showPayments(); // Refresh view
        
        // TODO: Add notifications for 'Paid' status to BDM/COO/Director

    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}
/**
 * Called by Design Manager to mark a project as completed.
 */
async function markProjectComplete(projectId) {
    if (!confirm('Are you sure you want to mark this project as complete? This will notify the accounts team to begin invoicing.')) {
        return;
    }

    try {
        showLoading();
        const response = await apiCall(`projects?id=${projectId}`, {
            method: 'PUT',
            body: JSON.stringify({
                action: 'mark_complete'
            })
        });

        if (response.success) {
            showSuccessModal('Project Marked Complete!', 'The accounts team has been notified and will prepare the invoice.');
            // Refresh the view
            if (typeof showDesignLeadDashboard === 'function') {
                showDesignLeadDashboard();
            } else if (typeof showProjects === 'function') {
                showProjects();
            }
        } else {
            throw new Error(response.error || 'Failed to mark project complete');
        }

    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}
                         

        // ============================================
        // OTHER PAGES (Activities, Settings, etc.)
        // ============================================

        function showWorkflow() { /* ... (Unchanged) ... */ }
        function showReports() { /* ... (Unchanged) ... */ }
        function showSettings() { /* ... (Unchanged) ... */ }
        
        // REPLACED IMPLEMENTATION
        async function showActivities() {
            setActiveNav('nav-activities');
            const main = document.getElementById('mainContent');
            main.style.display = 'block'; // Ensure main content is visible
            showLoading();

            try {
                const response = await apiCall('activities');
                if (!response.success || !response.data) {
                    throw new Error(response.error || 'Failed to load activities');
                }
                
                const activities = response.data;
                const activitiesHtml = activities.length ? activities.map(act => `
                    <div class="action-item">
                        <div class="action-content">
                            <strong>${act.details}</strong>
                            <div class="action-meta">
                                By ${act.performedByName || 'System'} (${act.performedByRole || 'N/A'}) - ${formatDate(act.timestamp)}
                                ${act.proposalId ? ` | Proposal: ${act.proposalId}` : ''}
                                ${act.projectId ? ` | Project: ${act.projectId}` : ''}
                            </div>
                        </div>
                    </div>
                `).join('') : '<p>No recent activities found.</p>';

                main.innerHTML = `
                    <div class="page-header">
                        <h2>📝 All Activities</h2>
                        <div class="subtitle">A log of all actions taken in the system.</div>
                    </div>
                    <div class="action-section">
                        <h3>Activity Log</h3>
                        ${activitiesHtml}
                    </div>
                `;

            } catch (error) {
                console.error('❌ Error fetching activities:', error);
                main.innerHTML = `<div class="error-message"><h3>Error Loading Activities</h3><p>${error.message}</p></div>`;
            } finally {
                hideLoading();
            }
        }
        
        // ✅ Make showActivities globally accessible
        window.showActivities = showActivities;

        // ============================================
        // DIAGNOSTICS
        // ============================================

        async function testBackendConnection() { /* ... (Unchanged) ... */ }
        async function runDiagnostics() { /* ... (Unchanged) ... */ }

let designerAllocationCounter = 0;
let availableDesigners = [];

/**
 * Load all available designers for allocation
 */
async function loadAvailableDesigners() {
    try {
        const [designersResponse, designLeadsResponse] = await Promise.all([
            apiCall('users?role=designer'),
            apiCall('users?role=design_lead')
        ]);
        
        availableDesigners = [];
        
        if (designersResponse.success && designersResponse.data) {
            availableDesigners.push(...designersResponse.data.map(d => ({...d, roleType: 'designer'})));
        }
        
        if (designLeadsResponse.success && designLeadsResponse.data) {
            availableDesigners.push(...designLeadsResponse.data.map(d => ({...d, roleType: 'design_lead'})));
        }
        
        console.log('Available designers loaded:', availableDesigners.length);
        
    } catch (error) {
        console.error('Error loading designers:', error);
        availableDesigners = [];
    }
}

/**
 * ✅ FIXED: Show COO Multi-Designer Allocation Modal
 * Handles both scenarios: Hours from Estimation OR Manual COO Entry (Tonnage case)
 */
async function showCooMultiDesignerAllocationModal(projectId) {
    try {
        showLoading();
        
        // 1. Load project details
        const projectResponse = await apiCall(`projects?id=${projectId}`);
        if (!projectResponse.success || !projectResponse.data) {
            throw new Error('Failed to load project details');
        }
        
        const project = projectResponse.data;
        
        // 2. Load available designers
        await loadAvailableDesigners();
        
        if (availableDesigners.length === 0) {
            alert('No designers found in the system. Please create designer accounts first.');
            hideLoading();
            return;
        }
        
        // 3. Populate project info
        document.getElementById('cooAllocProjectId').value = projectId;
        document.getElementById('cooAllocProjectNumber').textContent = project.projectNumber || 'N/A';
        document.getElementById('cooAllocProjectName').textContent = project.projectName || 'N/A';
        document.getElementById('cooAllocClientName').textContent = project.clientCompany || 'N/A';
        
        // ============================================
        // ✅ CRITICAL FIX: TWO SCENARIOS LOGIC
        // ============================================
        
        const totalHoursInput = document.getElementById('cooTotalProjectHours');
        
        // SCENARIO A: Estimator entered HOURS (not tonnage)
        const estimationHours = parseFloat(project.estimation?.totalHours || 0);
        const estimationUsedTonnage = project.estimation?.usedTonnageForDesign || false;
        
        // SCENARIO B: Previously saved Max Hours (from manual COO entry)
        const savedMaxHours = parseFloat(project.maxAllocatedHours || 0);
        
        // Already allocated hours in the system
        const previouslyAllocated = parseFloat(project.totalAllocatedHours || 0);
        
        let totalBudget = 0;
        let isLocked = false;
        let hoursSource = '';
        
        // LOGIC FLOW:
        if (estimationHours > 0 && !estimationUsedTonnage) {
            // ✅ SCENARIO A: Estimator entered HOURS directly
            totalBudget = estimationHours;
            isLocked = true;
            hoursSource = 'from_estimation_hours';
            console.log('✅ Scenario A: Using estimation hours (not tonnage)');
            
        } else if (estimationUsedTonnage && savedMaxHours > 0) {
            // ✅ SCENARIO B: Estimator used TONNAGE, COO manually entered hours
            totalBudget = savedMaxHours;
            isLocked = true;
            hoursSource = 'from_coo_manual_tonnage';
            console.log('✅ Scenario B: Using COO manual hours (tonnage case)');
            
        } else if (estimationUsedTonnage && savedMaxHours === 0) {
            // ⚠️ SCENARIO B (Not Yet Completed): Tonnage entered, COO needs to enter hours
            totalBudget = 0;
            isLocked = false;
            hoursSource = 'awaiting_coo_manual_entry';
            console.log('⚠️ Scenario B (Incomplete): Tonnage entered, awaiting COO manual entry');
            
        } else if (savedMaxHours > 0) {
            // Fallback: Previously saved hours exist
            totalBudget = savedMaxHours;
            isLocked = true;
            hoursSource = 'from_previous_entry';
            console.log('✅ Fallback: Using previously saved hours');
        }
        
        // Calculate remaining budget
        const remainingBudget = Math.max(0, totalBudget - previouslyAllocated);
        
        // ============================================
        // Set UI State based on scenario
        // ============================================
        
        totalHoursInput.value = totalBudget > 0 ? totalBudget : '';
        totalHoursInput.readOnly = isLocked;
        
        if (isLocked) {
            // Locked state - budget is set
            totalHoursInput.style.backgroundColor = '#e9ecef';
            totalHoursInput.style.border = '2px solid #10b981';
            totalHoursInput.style.fontWeight = '700';
            
            if (hoursSource === 'from_estimation_hours') {
                totalHoursInput.title = "🔒 Locked: Hours from Estimator (not tonnage)";
            } else if (hoursSource === 'from_coo_manual_tonnage') {
                totalHoursInput.title = "🔒 Locked: Hours manually entered by COO (tonnage case)";
            } else {
                totalHoursInput.title = "🔒 Locked: Budget previously set";
            }
            
        } else {
            // Unlocked state - COO needs to enter hours
            totalHoursInput.style.backgroundColor = '#fff8dc';
            totalHoursInput.style.border = '2px solid #f59e0b';
            totalHoursInput.style.fontWeight = '600';
            totalHoursInput.placeholder = "⚠️ Enter Total Hours (Tonnage was used in estimation)";
            totalHoursInput.title = "Manual entry required: Estimator used tonnage";
        }
        
        // Store metadata for calculations
        totalHoursInput.dataset.alreadyAllocated = previouslyAllocated;
        totalHoursInput.dataset.hoursSource = hoursSource;
        
        // ============================================
        // Designer Allocation Section State
        // ============================================
        
        const designerContainer = document.getElementById('designerAllocationsContainer');
        const addDesignerBtn = document.querySelector('#cooMultiDesignerAllocationModal .btn-outline');
        const submitBtn = document.querySelector('#cooMultiDesignerAllocationModal .btn-success');
        
        // Reset form
        designerAllocationCounter = 0;
        designerContainer.innerHTML = '';
        document.getElementById('cooAllocationNotes').value = '';
        document.getElementById('cooTargetCompletionDate').value = '';
        document.getElementById('cooProjectPriority').value = 'Normal';
        
        // ============================================
        // LOGIC: When to enable/disable Designer Allocation
        // ============================================
        
        if (totalBudget === 0) {
            // ⚠️ CASE 1: No budget set yet (awaiting COO manual entry)
            designerContainer.innerHTML = `
                <div class="alert alert-info" style="padding: 1.5rem; background: #e3f2fd; color: #0d47a1; border: 2px solid #2196f3; border-radius: 8px; text-align: center;">
                    <h4 style="margin: 0 0 0.5rem 0;">ℹ️ Total Hours Required</h4>
                    <p style="margin: 0;">Please enter the <strong>Total Allocated Hours</strong> above before allocating to designers.</p>
                </div>
            `;
            
            if (addDesignerBtn) addDesignerBtn.style.display = 'none';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Enter Hours First";
                submitBtn.style.opacity = "0.5";
            }
            
            // Add event listener to enable designer section when hours are entered
            totalHoursInput.addEventListener('input', function() {
                const enteredHours = parseFloat(this.value) || 0;
                if (enteredHours > 0) {
                    // Enable designer allocation section
                    designerContainer.innerHTML = '';
                    addDesignerAllocation();
                    
                    if (addDesignerBtn) addDesignerBtn.style.display = 'inline-block';
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = "Allocate Project";
                        submitBtn.style.opacity = "1";
                    }
                    
                    updateRemainingHours();
                }
            });
            
        } else if (remainingBudget <= 0.1) {
            // ✅ CASE 2: Fully Allocated (LOCK)
            designerContainer.innerHTML = `
                <div class="alert alert-success" style="padding: 1.5rem; background: #d1fae5; color: #065f46; border: 2px solid #10b981; border-radius: 8px; text-align: center;">
                    <h4 style="margin: 0 0 0.5rem 0;">✅ Allocation Complete</h4>
                    <p style="margin: 0;">
                        This project is <strong>fully allocated</strong><br>
                        <span style="font-size: 1.2rem; font-weight: 700;">${previouslyAllocated.toFixed(1)} / ${totalBudget.toFixed(1)} hours</span>
                    </p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; opacity: 0.8;">No further hours can be added.</p>
                </div>
            `;
            
            if (addDesignerBtn) addDesignerBtn.style.display = 'none';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "✅ Fully Allocated";
                submitBtn.style.opacity = "0.6";
            }
            
        } else {
            // ✅ CASE 3: Partial or New Allocation (ENABLED)
            if (addDesignerBtn) addDesignerBtn.style.display = 'inline-block';
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "Allocate Project";
                submitBtn.style.opacity = "1";
            }
            
            addDesignerAllocation(); // Add first row
        }
        
        // Show modal
        document.getElementById('cooMultiDesignerAllocationModal').style.display = 'flex';
        
        // Update visual display
        updateRemainingHours();
        
    } catch (error) {
        console.error('Error showing allocation modal:', error);
        alert('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

/**
 * Add a new designer allocation row
 */
function addDesignerAllocation() {
    designerAllocationCounter++;
    const container = document.getElementById('designerAllocationsContainer');
    
    const rowHtml = `
        <div class="designer-allocation-row" id="designerRow${designerAllocationCounter}">
            <div class="designer-row-header">
                <div class="designer-row-number">${designerAllocationCounter}</div>
                ${designerAllocationCounter > 1 ? `
                    <button type="button" class="remove-designer-btn" onclick="removeDesignerAllocation(${designerAllocationCounter})">
                        ✕ Remove
                    </button>
                ` : ''}
            </div>
            
            <div class="form-row">
                <div class="form-group" style="flex: 2;">
                    <label>Select Designer <span class="required">*</span></label>
                    <select class="form-control designer-select" id="designer${designerAllocationCounter}" 
                            onchange="validateDesignerSelection()" required>
                        <option value="">-- Select Designer --</option>
                        ${availableDesigners.map(d => `
                            <option value="${d.uid}" 
                                    data-name="${d.name}" 
                                    data-email="${d.email}"
                                    data-role="${d.roleType}">
                                ${d.roleType === 'design_lead' ? '👔' : '👨‍💼'} ${d.name}
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-group" style="flex: 1;">
                    <label>Allocated Hours <span class="required">*</span></label>
                    <input type="number" class="form-control hours-input" 
                           id="hours${designerAllocationCounter}"
                           placeholder="0" min="0.5" step="0.5"
                           oninput="updateRemainingHours()" required>
                </div>
            </div>
            
            <div class="form-group">
                <label>Specific Instructions (Optional)</label>
                <textarea class="form-control" id="notes${designerAllocationCounter}" 
                          rows="2" placeholder="Any specific tasks or focus areas for this designer..."></textarea>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', rowHtml);
    updateRemainingHours();
}

/**
 * Remove a designer allocation row
 */
function removeDesignerAllocation(rowNumber) {
    const row = document.getElementById(`designerRow${rowNumber}`);
    if (row) {
        row.remove();
        updateRemainingHours();
        validateDesignerSelection();
    }
}

/**
 * ✅ FIXED: Update Remaining Hours Display - Shows allocation budget
 */
function updateRemainingHours() {
    const totalHoursInput = document.getElementById('cooTotalProjectHours');
    const totalBudget = parseFloat(totalHoursInput.value) || 0;
    
    // Get previously allocated hours (from database)
    const previouslyAllocated = parseFloat(totalHoursInput.dataset.alreadyAllocated) || 0;
    
    // Get current session allocation (being typed in modal)
    const hoursInputs = document.querySelectorAll('.hours-input');
    let currentSessionAllocation = 0;
    hoursInputs.forEach(input => {
        currentSessionAllocation += parseFloat(input.value) || 0;
    });
    
    // Calculate totals
    const totalAllocated = previouslyAllocated + currentSessionAllocation;
    const remaining = totalBudget - totalAllocated;
    
    const remainingDisplay = document.getElementById('cooRemainingHours');
    
    // Build display HTML
    let displayHtml = '';
    
    if (totalBudget === 0) {
        displayHtml = `
            <div style="font-size: 1.2rem; font-weight: 600; color: #f59e0b;">
                ⚠️ Enter Total Hours First
            </div>
        `;
    } else {
        displayHtml = `
            <div style="font-size: 1.8rem; font-weight: 700; color: ${remaining < 0 ? 'var(--danger)' : remaining === 0 ? 'var(--success)' : 'var(--warning)'}">
                ${remaining >= 0 ? remaining.toFixed(1) : '(' + Math.abs(remaining).toFixed(1) + ')'} hrs
            </div>
        `;
        
        if (previouslyAllocated > 0 || currentSessionAllocation > 0) {
            displayHtml += `
                <div style="font-size: 0.75rem; margin-top: 0.5rem; opacity: 0.8; line-height: 1.3;">
                    <div><strong>Total Budget:</strong> ${totalBudget.toFixed(1)} hrs</div>
                    ${previouslyAllocated > 0 ? `<div><strong>Previously Allocated:</strong> ${previouslyAllocated.toFixed(1)} hrs</div>` : ''}
                    ${currentSessionAllocation > 0 ? `<div><strong>Current Session:</strong> ${currentSessionAllocation.toFixed(1)} hrs</div>` : ''}
                    <div style="border-top: 1px solid rgba(0,0,0,0.1); margin-top: 0.3rem; padding-top: 0.3rem;">
                        <strong>Total Allocated:</strong> ${totalAllocated.toFixed(1)} hrs
                    </div>
                </div>
            `;
        }
    }
    
    remainingDisplay.innerHTML = displayHtml;
    
    // ============================================
    // Submit Button Logic
    // ============================================
    
    const submitBtn = document.querySelector('#cooMultiDesignerAllocationModal .btn-success');
    
    if (remaining < -0.1) {
        // Over budget - BLOCK submission
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.5";
            submitBtn.innerHTML = `⚠️ Reduce Hours (${Math.abs(remaining).toFixed(1)} over)`;
        }
    } else if (totalBudget === 0) {
        // No budget set - BLOCK submission
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.5";
            submitBtn.innerText = "Enter Hours First";
        }
    } else {
        // Valid state - ENABLE submission
        if (submitBtn && submitBtn.innerText !== "✅ Fully Allocated") {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            submitBtn.innerHTML = '<span class="btn-icon">✓</span> Allocate Project';
        }
    }
}

/**
 * Validate that no designer is selected twice
 */
function validateDesignerSelection() {
    const selects = document.querySelectorAll('.designer-select');
    const selectedUids = [];
    let hasDuplicate = false;
    
    selects.forEach(select => {
        const row = select.closest('.designer-allocation-row');
        row.classList.remove('error');
        
        if (select.value && selectedUids.includes(select.value)) {
            row.classList.add('error');
            hasDuplicate = true;
        } else if (select.value) {
            selectedUids.push(select.value);
        }
    });
    
    return !hasDuplicate;
}

/**
 * ✅ FIXED: Submit COO Multi-Designer Allocation
 * Handles both scenarios: estimation hours OR manual COO entry
 */
async function submitCooMultiDesignerAllocation() {
    const projectId = document.getElementById('cooAllocProjectId').value;
    const totalHoursInput = document.getElementById('cooTotalProjectHours');
    const totalBudget = parseFloat(totalHoursInput.value);
    const previouslyAllocated = parseFloat(totalHoursInput.dataset.alreadyAllocated) || 0;
    const hoursSource = totalHoursInput.dataset.hoursSource || 'unknown';
    
    // Validation: Budget must be set
    if (!totalBudget || totalBudget <= 0) {
        alert('⚠️ Please enter the Total Allocated Hours before proceeding.');
        return;
    }
    
    // Project Details inputs
    const targetDate = document.getElementById('cooTargetCompletionDate').value;
    const priority = document.getElementById('cooProjectPriority').value;
    const generalNotes = document.getElementById('cooAllocationNotes').value;

    // Collect designer allocations
    const selects = document.querySelectorAll('.designer-select');
    if (selects.length === 0) {
        alert('⚠️ Please add at least one designer allocation.');
        return;
    }

    const designerAllocations = [];
    let currentSessionTotal = 0;
    
    for (let i = 0; i < selects.length; i++) {
        const select = selects[i];
        const rowNum = select.id.replace('designer', '');
        const hoursInput = document.getElementById(`hours${rowNum}`);
        const notesTextarea = document.getElementById(`notes${rowNum}`);
        
        if (!select.value) {
            alert(`⚠️ Please select a designer for allocation #${i + 1}`);
            return;
        }
        
        const hours = parseFloat(hoursInput.value);
        if (!hours || hours <= 0) {
            alert(`⚠️ Please enter valid hours for allocation #${i + 1}`);
            return;
        }
        
        currentSessionTotal += hours;
        
        const selectedOption = select.options[select.selectedIndex];
        designerAllocations.push({
            designerUid: select.value,
            designerName: selectedOption.dataset.name,
            designerEmail: selectedOption.dataset.email,
            designerRole: selectedOption.dataset.role,
            allocatedHours: hours,
            specificNotes: notesTextarea.value.trim()
        });
    }
    
    // ============================================
    // ✅ CRITICAL: STRICT VALIDATION - Prevent over-allocation
    // ============================================
    
    const newTotalAllocated = previouslyAllocated + currentSessionTotal;
    
    if (newTotalAllocated > totalBudget + 0.1) { // Allow 0.1 float tolerance
        const overage = (newTotalAllocated - totalBudget).toFixed(1);
        alert(`⛔ ALLOCATION BLOCKED: Exceeding budget by ${overage} hours\n\n` +
              `Total Budget: ${totalBudget} hrs\n` +
              `Previously Allocated: ${previouslyAllocated} hrs\n` +
              `Trying to Add: ${currentSessionTotal} hrs\n` +
              `Would Result In: ${newTotalAllocated} hrs\n\n` +
              `Please reduce the allocation to proceed.`);
        return; // ⛔ STOP EXECUTION
    }

    // Validate no duplicate designers
    if (!validateDesignerSelection()) {
        alert('⚠️ You cannot assign the same designer twice. Please select different designers.');
        return;
    }
    
    // Confirmation
    const confirmText = `
📊 Allocation Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Budget: ${totalBudget} hrs
${previouslyAllocated > 0 ? `Previously Allocated: ${previouslyAllocated} hrs\n` : ''}Current Allocation: ${currentSessionTotal} hrs
New Total: ${newTotalAllocated} hrs
Remaining: ${(totalBudget - newTotalAllocated).toFixed(1)} hrs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Designers: ${designerAllocations.length}
${designerAllocations.map((d, i) => `\n${i+1}. ${d.designerName}: ${d.allocatedHours} hrs`).join('')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Proceed with allocation?`.trim();
    
    if (!confirm(confirmText)) {
        return;
    }
    
    try {
        showLoading();
        
        // ============================================
        // ✅ CRITICAL: Prepare Payload for Backend
        // ============================================
        
        const allocationData = {
            action: 'allocate_to_multiple_designers',
            data: {
                projectId: projectId,
                
                // ✅ CRITICAL: Set the budget and source
                maxAllocatedHours: totalBudget, // Lock the budget
                maxHoursSource: hoursSource, // Track source
                
                // Total allocated after this operation
                totalAllocatedHours: newTotalAllocated,
                
                // Designer allocations
                designerAllocations: designerAllocations,
                
                // Project details
                targetCompletionDate: targetDate || null,
                priority: priority,
                allocationNotes: generalNotes,
                
                // Legacy fields for backend compatibility
                assignedDesignerUids: designerAllocations.map(d => d.designerUid),
                assignedDesignerNames: designerAllocations.map(d => d.designerName),
                assignedDesignerEmails: designerAllocations.map(d => d.designerEmail),
                designerHours: designerAllocations.reduce((acc, d) => {
                    acc[d.designerUid] = d.allocatedHours;
                    return acc;
                }, {}),
                
                // Incremental flag
                isIncremental: true
            }
        };
        
        // Send to backend
        const response = await apiCall(`projects?id=${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(allocationData)
        });
        
        if (response.success) {
            showSuccessModal(
                '✅ Project Allocated Successfully!',
                `Designers have been notified and can now start working on the project.`
            );
            closeCooMultiDesignerModal();
            
            // Refresh the projects view
            if (typeof showAllProjects === 'function') {
                await showAllProjects();
            }
        } else {
            throw new Error(response.error || 'Allocation failed');
        }
        
    } catch (error) {
        console.error('Error allocating project:', error);
        alert('❌ Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

/**
 * Close the COO multi-designer allocation modal
 */
function closeCooMultiDesignerModal() {
    document.getElementById('cooMultiDesignerAllocationModal').style.display = 'none';
    document.getElementById('designerAllocationsContainer').innerHTML = '';
    designerAllocationCounter = 0;
}

/**
 * Show Continue Allocation Modal for partially allocated projects
 * Allows COO to allocate remaining hours to additional designers
 */
async function showContinueAllocationModal(projectId, proposalId) {
    try {
        showLoading();
        
        // Fetch project details
        const projectResponse = await apiCall(`projects?id=${projectId}`);
        if (!projectResponse.success) {
            throw new Error('Failed to load project details');
        }
        
        const project = projectResponse.data;
        
        // Calculate allocation status
        const maxHours = parseFloat(project.maxAllocatedHours) || 0;
        const totalAllocated = parseFloat(project.totalAllocatedHours) || 0;
        const remainingToAllocate = maxHours - totalAllocated;
        const existingAllocations = project.designerAllocations || [];
        
        // Fetch available designers
        const usersResponse = await apiCall('users?role=designer,design_lead');
        if (!usersResponse.success) {
            throw new Error('Failed to load designers');
        }
        
        const designers = usersResponse.data || [];
        
        // Get already assigned designer UIDs
        const assignedUids = (project.assignedDesignerUids || []);
        
        // Create designer options (exclude already fully assigned designers)
        const designerOptions = designers.map(d => `
            <option value="${d.uid}" 
                    data-name="${d.name}" 
                    data-email="${d.email}"
                    data-role="${d.role}"
                    ${assignedUids.includes(d.uid) ? 'data-assigned="true"' : ''}>
                ${d.name} (${d.role.replace('_', ' ')}) ${assignedUids.includes(d.uid) ? '- Already Assigned' : ''}
            </option>
        `).join('');
        
        // Create existing allocations display
        const existingAllocationsHtml = existingAllocations.length > 0 ? `
            <div style="margin-bottom: 1.5rem; padding: 1rem; background: #e8f5e9; border-radius: 8px;">
                <h4 style="margin: 0 0 0.5rem 0; color: #2e7d32;">✅ Existing Allocations</h4>
                <table style="width: 100%; font-size: 0.9rem;">
                    <tr style="border-bottom: 1px solid #c8e6c9;">
                        <th style="text-align: left; padding: 0.5rem;">Designer</th>
                        <th style="text-align: center; padding: 0.5rem;">Hours</th>
                    </tr>
                    ${existingAllocations.map(a => `
                        <tr>
                            <td style="padding: 0.5rem;">${a.designerName}</td>
                            <td style="text-align: center; padding: 0.5rem;"><strong>${a.allocatedHours}h</strong></td>
                        </tr>
                    `).join('')}
                    <tr style="background: #c8e6c9; font-weight: bold;">
                        <td style="padding: 0.5rem;">Total Allocated</td>
                        <td style="text-align: center; padding: 0.5rem;">${totalAllocated}h</td>
                    </tr>
                </table>
            </div>
        ` : '';
        
        const modalHtml = `
            <div class="modal-overlay" id="continueAllocationModal" onclick="if(event.target === this) closeContinueAllocationModal()">
                <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
                    <div class="modal-header" style="background: linear-gradient(135deg, #ff9800, #f57c00); color: white;">
                        <h2>🎯 Continue Allocation - ${project.projectName}</h2>
                        <span class="close-modal" onclick="closeContinueAllocationModal()">&times;</span>
                    </div>
                    
                    <div class="modal-body" style="padding: 1.5rem;">
                        <!-- Project Info -->
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                            <div style="text-align: center; padding: 1rem; background: #e3f2fd; border-radius: 8px;">
                                <div style="font-size: 1.5rem; font-weight: bold; color: #1976d2;">${maxHours}h</div>
                                <small>Total Budget</small>
                            </div>
                            <div style="text-align: center; padding: 1rem; background: #e8f5e9; border-radius: 8px;">
                                <div style="font-size: 1.5rem; font-weight: bold; color: #388e3c;">${totalAllocated}h</div>
                                <small>Already Allocated</small>
                            </div>
                            <div style="text-align: center; padding: 1rem; background: #fff3e0; border-radius: 8px;">
                                <div style="font-size: 1.5rem; font-weight: bold; color: #f57c00;">${remainingToAllocate.toFixed(1)}h</div>
                                <small>Remaining to Allocate</small>
                            </div>
                        </div>
                        
                        ${existingAllocationsHtml}
                        
                        <!-- New Allocation Form -->
                        <div style="padding: 1rem; background: #fff8e1; border-radius: 8px; border-left: 4px solid #ff9800;">
                            <h4 style="margin: 0 0 1rem 0;">➕ Add New Allocation</h4>
                            
                            <input type="hidden" id="continueAllocProjectId" value="${projectId}">
                            <input type="hidden" id="continueAllocMaxHours" value="${maxHours}">
                            <input type="hidden" id="continueAllocCurrentTotal" value="${totalAllocated}">
                            
                            <div id="newAllocationsContainer">
                                <!-- Dynamic allocation rows will be added here -->
                            </div>
                            
                            <button type="button" onclick="addContinueAllocationRow('${designerOptions.replace(/'/g, "\\'").replace(/\n/g, '')}')" 
                                    class="btn btn-outline" style="margin-top: 1rem;">
                                ➕ Add Designer
                            </button>
                        </div>
                        
                        <!-- Allocation Summary -->
                        <div style="margin-top: 1.5rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span><strong>New Allocation Total:</strong></span>
                                <span id="newAllocationTotal" style="font-size: 1.2rem; font-weight: bold; color: var(--primary-blue);">0h</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                                <span><strong>Remaining After:</strong></span>
                                <span id="remainingAfterAllocation" style="font-size: 1.2rem; font-weight: bold; color: var(--warning);">${remainingToAllocate.toFixed(1)}h</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" onclick="closeContinueAllocationModal()" class="btn btn-outline">Cancel</button>
                        <button type="button" onclick="submitContinueAllocation()" class="btn btn-warning">
                            🎯 Allocate Remaining Hours
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Add first allocation row automatically
        addContinueAllocationRow(designerOptions.replace(/'/g, "\\'").replace(/\n/g, ''));
        
    } catch (error) {
        console.error('Error showing continue allocation modal:', error);
        alert('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

let continueAllocationCounter = 0;

function addContinueAllocationRow(designerOptionsStr) {
    const container = document.getElementById('newAllocationsContainer');
    const rowNum = ++continueAllocationCounter;
    
    const rowHtml = `
        <div class="designer-allocation-row" id="continueAllocRow${rowNum}" style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 1rem; margin-bottom: 1rem; padding: 1rem; background: white; border-radius: 8px; border: 1px solid #ddd;">
            <div>
                <label style="font-weight: 600; margin-bottom: 0.25rem; display: block;">Designer</label>
                <select id="continueDesigner${rowNum}" class="form-control continue-designer-select" onchange="updateContinueAllocationTotals()">
                    <option value="">Select Designer...</option>
                    ${designerOptionsStr}
                </select>
            </div>
            <div>
                <label style="font-weight: 600; margin-bottom: 0.25rem; display: block;">Hours</label>
                <input type="number" id="continueHours${rowNum}" class="form-control continue-hours-input" 
                       min="0.5" step="0.5" placeholder="Hours" onchange="updateContinueAllocationTotals()" oninput="updateContinueAllocationTotals()">
            </div>
            <div style="display: flex; align-items: flex-end;">
                <button type="button" onclick="removeContinueAllocationRow(${rowNum})" class="btn btn-danger btn-sm" style="padding: 0.5rem;">✕</button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', rowHtml);
}

function removeContinueAllocationRow(rowNum) {
    const row = document.getElementById(`continueAllocRow${rowNum}`);
    if (row) {
        row.remove();
        updateContinueAllocationTotals();
    }
}

function updateContinueAllocationTotals() {
    const hoursInputs = document.querySelectorAll('.continue-hours-input');
    let newTotal = 0;
    
    hoursInputs.forEach(input => {
        newTotal += parseFloat(input.value) || 0;
    });
    
    const currentTotal = parseFloat(document.getElementById('continueAllocCurrentTotal').value) || 0;
    const maxHours = parseFloat(document.getElementById('continueAllocMaxHours').value) || 0;
    const remainingAfter = maxHours - currentTotal - newTotal;
    
    document.getElementById('newAllocationTotal').textContent = `${newTotal.toFixed(1)}h`;
    
    const remainingEl = document.getElementById('remainingAfterAllocation');
    remainingEl.textContent = `${remainingAfter.toFixed(1)}h`;
    
    if (remainingAfter < 0) {
        remainingEl.style.color = 'var(--danger)';
    } else if (remainingAfter === 0) {
        remainingEl.style.color = 'var(--success)';
    } else {
        remainingEl.style.color = 'var(--warning)';
    }
}

async function submitContinueAllocation() {
    const projectId = document.getElementById('continueAllocProjectId').value;
    const maxHours = parseFloat(document.getElementById('continueAllocMaxHours').value);
    const currentTotal = parseFloat(document.getElementById('continueAllocCurrentTotal').value);
    
    // Collect new allocations
    const newAllocations = [];
    const selects = document.querySelectorAll('.continue-designer-select');
    
    for (const select of selects) {
        if (!select.value) continue;
        
        const rowNum = select.id.replace('continueDesigner', '');
        const hoursInput = document.getElementById(`continueHours${rowNum}`);
        const hours = parseFloat(hoursInput.value);
        
        if (!hours || hours <= 0) {
            alert('Please enter valid hours for all selected designers');
            return;
        }
        
        const selectedOption = select.options[select.selectedIndex];
        
        newAllocations.push({
            designerUid: select.value,
            designerName: selectedOption.dataset.name,
            designerEmail: selectedOption.dataset.email,
            designerRole: selectedOption.dataset.role,
            allocatedHours: hours
        });
    }
    
    if (newAllocations.length === 0) {
        alert('Please add at least one designer allocation');
        return;
    }
    
    // Calculate new total
    const newAllocationTotal = newAllocations.reduce((sum, a) => sum + a.allocatedHours, 0);
    const grandTotal = currentTotal + newAllocationTotal;
    
    if (grandTotal > maxHours) {
        if (!confirm(`Total allocation (${grandTotal}h) exceeds budget (${maxHours}h). Continue anyway?`)) {
            return;
        }
    }
    
    try {
        showLoading();
        
        const response = await apiCall(`projects?id=${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'continue_allocation',
                data: {
                    newAllocations: newAllocations,
                    additionalHours: newAllocationTotal
                }
            })
        });
        
        if (response.success) {
            closeContinueAllocationModal();
            alert(`✅ Successfully allocated ${newAllocationTotal}h to ${newAllocations.length} designer(s)!`);
            
            // Refresh views
            if (typeof showAllProjects === 'function') {
                await showAllProjects();
            } else if (typeof showProjects === 'function') {
                await showProjects();
            }
        } else {
            throw new Error(response.error || 'Allocation failed');
        }
        
    } catch (error) {
        console.error('Error continuing allocation:', error);
        alert('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

function closeContinueAllocationModal() {
    const modal = document.getElementById('continueAllocationModal');
    if (modal) {
        modal.remove();
    }
    continueAllocationCounter = 0;
}

// ============================================================================
// REPLACE THE EXISTING showAllocateProjectModal FUNCTION WITH THIS:
// Find the function around line 9137 and replace it with this version
// ============================================================================

// Comment out or remove the old showAllocateProjectModal function 
// and use this new one instead:

/*
async function showAllocateProjectModal(projectId) {
    // Use the new multi-designer modal
    await showCooMultiDesignerAllocationModal(projectId);
}

      

        // ============================================
        // DESIGN LEAD VIEW UPDATES (REPLACED)
        // ============================================

        // REPLACED old showDesignLeadDashboard with this new logic
        async function showDesignLeadDashboard() {
            setActiveNav('nav-dashboard');
            const main = document.getElementById('mainContent');
            main.innerHTML = ''; // Clear content
            showLoading();

            try {
                const response = await apiCall('projects');
                if (!response.success) throw new Error('Failed to fetch projects');

                const allProjects = response.data;
                // Filter projects where the current user is the design lead
                const myProjects = allProjects.filter(p => p.designLeadUid === currentUser.uid);

                // Fetch deliverables needing review (assuming an endpoint exists)
                const reviewResponse = await apiCall('deliverables?status=pending'); // Example endpoint
                const pendingReview = reviewResponse.success ? reviewResponse.data.filter(d => myProjects.some(p => p.id === d.projectId)) : []; // Filter reviews for my projects

                const stats = {
                    myProjects: myProjects.length,
                    inProgress: myProjects.filter(p => p.status === 'active').length, // Assuming 'active' means in progress
                    pendingReview: pendingReview.length
                };


                let projectsHtml = '';
                if (myProjects.length === 0) {
                    projectsHtml = '<p>No projects allocated to you yet.</p>';
                } else {
                    projectsHtml = myProjects.map(project => createProjectCard(project)).join('');
                }

                 let reviewHtml = '';
                 if (pendingReview.length > 0) {
                     reviewHtml = `
                        <div class="action-section" style="background: #FFF3CD;">
                            <h3>⚠️ Deliverables Pending Review</h3>
                            ${pendingReview.map(d => `
                                <div class="action-item" style="background: white;">
                                    <div class="action-content">
                                        <strong>${d.originalName}</strong>
                                        <div class="action-meta">
                                            Project: ${d.projectName} | Designer: ${d.designerName} | V: ${d.versionNumber}
                                        </div>
                                    </div>
                                    <div class="action-buttons">
                                        <button onclick="window.open('${d.url}', '_blank')" class="btn btn-outline btn-sm">View</button>
                                        <button onclick="showReviewDeliverableModal('${d.id}')" class="btn btn-primary btn-sm">Review</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                     `;
                 }


                main.innerHTML = `
                    <div class="page-header">
                        <h2>Design Lead Dashboard</h2>
                        <div class="subtitle">Manage your assigned projects and team</div>
                    </div>
                    <div class="dashboard-stats">
                        <div class="stat-card"><div class="stat-number">${stats.myProjects}</div><div class="stat-label">My Projects</div></div>
                        <div class="stat-card"><div class="stat-number">${stats.inProgress}</div><div class="stat-label">In Progress</div></div>
                        <div class="stat-card"><div class="stat-number">${stats.pendingReview}</div><div class="stat-label">Pending Review</div></div>
                    </div>
                    ${reviewHtml}
                    <div class="action-section">
                         <h3>My Projects</h3>
                         ${projectsHtml}
                    </div>
                `;

            } catch (error) {
                console.error('Error loading Design Lead dashboard:', error);
                main.innerHTML = `<div class="error-message">Failed to load dashboard: ${error.message}</div>`;
            } finally {
                hideLoading();
            }
        }

  


        // Function for Design Lead to assign designers
        async function assignDesigners(projectId) {
            const modal = document.getElementById('designerAssignmentModal');

            try {
                showLoading();
                
                // Fetch designers
                const response = await apiCall('users?role=designer');
                if (!response.success) throw new Error('Failed to fetch designers');
                const designers = response.data;

                // Fetch project details to get max hours and currently assigned designers
                const projectResponse = await apiCall(`projects?id=${projectId}`);
                const currentProject = projectResponse.success ? projectResponse.data : {};
                const assignedUids = currentProject.assignedDesignerUids || [];
                const assignedHours = currentProject.assignedDesignerHours || currentProject.designerHours || {};
                
                // Get max hours from project (set by COO/Director)
                const maxHours = parseFloat(currentProject.maxAllocatedHours || 0);
                const additionalHours = parseFloat(currentProject.additionalHours || 0);
                const totalAvailable = maxHours + additionalHours;
                
                // Calculate already allocated hours
                const alreadyAllocated = parseFloat(currentProject.totalAllocatedHours || 0);
                const remainingToAllocate = totalAvailable - alreadyAllocated;
                const hoursLogged = parseFloat(currentProject.hoursLogged || 0);
                
                // Check if fully allocated
                const isFullyAllocated = totalAvailable > 0 && alreadyAllocated >= totalAvailable;
                
                if (isFullyAllocated) {
                    hideLoading();
                    alert(`⚠️ This project is fully allocated!\n\nBudget: ${totalAvailable}h\nAllocated: ${alreadyAllocated}h\nLogged: ${hoursLogged}h\n\nNo more hours available for allocation.`);
                    return;
                }
                
                // Show hours summary if max hours are set
                const summaryDiv = document.getElementById('projectHoursSummary');
                if (maxHours > 0) {
                    summaryDiv.style.display = 'block';
                    summaryDiv.innerHTML = `
                        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; text-align: center;">
                            <div>
                                <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.3rem;">Project Budget</div>
                                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-blue);">${maxHours.toFixed(1)}h</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.3rem;">Additional Buffer</div>
                                <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning);">${additionalHours.toFixed(1)}h</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.3rem;">Total Available</div>
                                <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">${totalAvailable.toFixed(1)}h</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.3rem;">Already Allocated</div>
                                <div style="font-size: 1.5rem; font-weight: 700; color: ${alreadyAllocated > 0 ? '#f59e0b' : 'var(--text-light)'};">${alreadyAllocated.toFixed(1)}h</div>
                            </div>
                            <div>
                                <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.3rem;">Remaining to Allocate</div>
                                <div style="font-size: 1.5rem; font-weight: 700; color: ${remainingToAllocate > 0 ? 'var(--success)' : 'var(--danger)'};" id="displayRemainingHours">${remainingToAllocate.toFixed(1)}h</div>
                            </div>
                        </div>
                        ${alreadyAllocated > 0 ? `
                        <div style="margin-top: 1rem; padding: 0.75rem; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
                            <strong>⏳ Partial Allocation:</strong> This project already has ${alreadyAllocated.toFixed(1)}h allocated. You can allocate the remaining ${remainingToAllocate.toFixed(1)}h to additional designers.
                        </div>
                        ` : ''}
                    `;
                } else {
                    summaryDiv.style.display = 'none';
                }
                
                // Populate designers list with hour input
                const designersList = document.getElementById('designersList');
                designersList.innerHTML = '';
                
                designers.forEach(designer => {
                    const isAssigned = assignedUids.includes(designer.uid);
                    const currentHours = assignedHours[designer.uid] || 0;
                    
                    const designerRow = document.createElement('div');
                    designerRow.className = 'designer-row';
                    designerRow.style.cssText = 'display: grid; grid-template-columns: auto 1fr auto; gap: 1rem; align-items: center; padding: 1rem; border: 2px solid var(--border); border-radius: 8px; margin-bottom: 0.8rem; background: white;';
                    
                    // If already assigned, show different styling
                    if (isAssigned && currentHours > 0) {
                        designerRow.style.borderColor = '#10b981';
                        designerRow.style.background = '#f0fdf4';
                    }
                    
                    designerRow.innerHTML = `
                        <div style="display: flex; align-items: center;">
                            <input type="checkbox" 
                                    id="designer-${designer.uid}" 
                                    value="${designer.uid}"
                                    data-name="${designer.name}" 
                                    data-email="${designer.email}"
                                    data-current-hours="${currentHours}"
                                    ${isAssigned ? 'checked' : ''}
                                    onchange="toggleDesignerHoursInput(this)"
                                    style="width: 20px; height: 20px; cursor: pointer;">
                        </div>
                        <div>
                            <label for="designer-${designer.uid}" style="font-weight: 600; margin: 0; cursor: pointer;">
                                ${designer.name}
                                ${isAssigned && currentHours > 0 ? `<span style="color: #10b981; font-size: 0.85rem;">(Already: ${currentHours}h)</span>` : ''}
                            </label>
                            <div style="font-size: 0.85rem; color: var(--text-light);">
                                ${designer.email} • ${designer.assignedProjects || 0} active projects
                            </div>
                        </div>
                        <div style="min-width: 150px;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <input type="number" 
                                        id="hours-${designer.uid}"
                                        class="form-control hours-input" 
                                        step="0.5" 
                                        min="0"
                                        value="${currentHours}"
                                        placeholder="Hours"
                                        ${!isAssigned ? 'disabled' : ''}
                                        onchange="updateTotalAllocated()"
                                        style="width: 80px; padding: 0.5rem; text-align: center;">
                                <span style="font-size: 0.9rem; color: var(--text-light);">hrs</span>
                            </div>
                        </div>
                    `;
                    
                    designersList.appendChild(designerRow);
                });

                // Store project info for validation
                document.getElementById('assignProjectId').value = projectId;
                modal.dataset.maxHours = totalAvailable;
                modal.dataset.alreadyAllocated = alreadyAllocated;
                
                // Calculate and display initial totals
                updateTotalAllocated();
                
                // Show modal
                modal.style.display = 'flex';

            } catch (error) {
                console.error('Error loading designers:', error);
                alert('Failed to load designers: ' + error.message);
            } finally {
                hideLoading();
            }
        }
        
        // Register implementation with wrapper
        window._assignDesignersImpl = assignDesigners;
        console.log('✅ assignDesigners implementation registered');
        
        // Toggle hours input when checkbox is changed
        function toggleDesignerHoursInput(checkbox) {
            const designerId = checkbox.value;
            const hoursInput = document.getElementById(`hours-${designerId}`);
            const currentHours = parseFloat(checkbox.dataset.currentHours || 0);
            
            if (checkbox.checked) {
                hoursInput.disabled = false;
                // If no hours set, default to 1 hour when checked
                // If they had previous hours, keep them
                if (!hoursInput.value || hoursInput.value === '0') {
                    hoursInput.value = currentHours > 0 ? currentHours : '1';
                }
            } else {
                hoursInput.disabled = true;
                hoursInput.value = '0';
            }
            
            updateTotalAllocated();
        }
        
        // Update total allocated hours display
        function updateTotalAllocated() {
            let total = 0;
            const hoursInputs = document.querySelectorAll('.hours-input:not([disabled])');
            hoursInputs.forEach(input => {
                const value = parseFloat(input.value) || 0;
                total += value;
            });
            
            const totalDisplay = document.getElementById('totalAllocatedHours');
            if (totalDisplay) {
                totalDisplay.textContent = total.toFixed(1);
            }
            
            // Update remaining hours if max hours are set
            const modal = document.getElementById('designerAssignmentModal');
            const maxHours = parseFloat(modal.dataset.maxHours || 0);
            
            if (maxHours > 0) {
                // Calculate remaining based on new total allocation
                const remaining = maxHours - total;
                const remainingDisplay = document.getElementById('displayRemainingHours');
                if (remainingDisplay) {
                    remainingDisplay.textContent = remaining.toFixed(1) + 'h';
                    // Change color based on remaining hours
                    if (remaining < 0) {
                        remainingDisplay.style.color = 'var(--danger)';
                        remainingDisplay.textContent = `${remaining.toFixed(1)}h (OVER!)`;
                    } else if (remaining === 0) {
                        remainingDisplay.style.color = 'var(--success)';
                        remainingDisplay.textContent = '0h (Fully Allocated)';
                    } else if (remaining < maxHours * 0.2) {
                        remainingDisplay.style.color = '#f59e0b';
                    } else {
                        remainingDisplay.style.color = 'var(--success)';
                    }
                }
                
                // Also update total display color
                if (totalDisplay) {
                    if (total > maxHours) {
                        totalDisplay.style.color = 'var(--danger)';
                    } else if (total === maxHours) {
                        totalDisplay.style.color = 'var(--success)';
                    } else {
                        totalDisplay.style.color = 'var(--primary-blue)';
                    }
                }
            }
        }

        // Function to submit designer assignment
        async function submitDesignerAssignment() {
            const projectId = document.getElementById('assignProjectId').value;
            const checkboxes = document.querySelectorAll('#designersList input[type="checkbox"]:checked');
            const modal = document.getElementById('designerAssignmentModal');
            const maxHours = parseFloat(modal.dataset.maxHours || 0);

            const designerUids = [];
            const designerNames = [];
            const designerEmails = [];
            const designerHours = {};
            let totalAllocated = 0;

            // Collect selected designers and their hours
            let hasError = false; // Flag to stop execution
            checkboxes.forEach(checkbox => {
                if (hasError) return; // Don't process more if error found
                
                const uid = checkbox.value;
                const hoursInput = document.getElementById(`hours-${uid}`);
                const hours = parseFloat(hoursInput.value) || 0;
                
                // Validate hours
                if (hours < 0.5) {
                    alert(`Please allocate at least 0.5 hours for ${checkbox.dataset.name}`);
                    hasError = true; // Set flag
                    return; // Exit forEach loop
                }
                
                designerUids.push(uid);
                designerNames.push(checkbox.dataset.name);
                designerEmails.push(checkbox.dataset.email);
                designerHours[uid] = hours;
                totalAllocated += hours;
            });

            if (hasError) return; // Stop submission if invalid hours
            
            // Validate total hours against max hours
            if (maxHours > 0 && totalAllocated > maxHours) {
                alert(`⚠️ Total allocated hours (${totalAllocated.toFixed(1)}) exceeds available hours (${maxHours.toFixed(1)}). Please adjust the allocation.`);
                return;
            }
            
            // Prepare assignment data
            const assignmentData = {
                action: 'assign_designers',
                data: {
                    designerUids: designerUids,
                    designerNames: designerNames,
                    designerEmails: designerEmails,
                    designerHours: designerHours,
                    totalAllocatedHours: totalAllocated
                }
            };

            try {
                showLoading();
                const result = await apiCall(`projects?id=${projectId}`, {
                    method: 'PUT',
                    body: JSON.stringify(assignmentData)
                });

                if (result.success) {
                    const summary = designerUids.length > 0 
                        ? `${designerUids.length} designer(s) assigned with total ${totalAllocated.toFixed(1)} hours allocated.`
                        : 'All designers unassigned from project.';
                    showSuccessModal(`Designers assigned successfully!`, summary);
                    closeDesignerAssignmentModal();
                    
                    // Reload appropriate view based on user role
                    if (currentUserRole === 'coo' || currentUserRole === 'director') {
                        if (typeof showProjects === 'function') {
                            showProjects();
                        }
                    } else if (currentUserRole === 'design_lead') {
                        if (typeof showDesignLeadDashboard === 'function') {
                            showDesignLeadDashboard();
                        } else if (typeof showProjects === 'function') {
                            showProjects();
                        }
                    } else {
                        if (typeof showProjects === 'function') {
                            showProjects();
                        }
                    }
                } else {
                    throw new Error(result.error || 'Assignment failed');
                }

            } catch (error) {
                console.error('Error assigning designers:', error);
                alert('Failed to assign designers: ' + error.message);
            } finally {
                hideLoading();
            }
        }

        // Function to view BDM uploaded files
            async function viewBDMFiles(projectId, proposalId) { // <-- Added proposalId
            try {
                showLoading();
                // Use apiCall to get files related to the original proposal
                const filesResponse = await apiCall(`files?proposalId=${proposalId}`); // <-- Use passed-in proposalId
                const allFiles = filesResponse.success ? filesResponse.data : [];
                // Filter for original project/BDM files (type 'project' or null/undefined)
                const bdmFiles = allFiles.filter(f => f.fileType === 'project' || !f.fileType);

                if (bdmFiles && bdmFiles.length > 0) {
                    displayBDMFiles(bdmFiles);
                } else {
                        showSuccessModal('No files uploaded by BDM for this project.', ''); // Use success modal for info
                }

            } catch (error) {
                console.error('Error loading BDM files:', error);
                alert('Failed to load BDM files: ' + error.message);
            } finally {
                hideLoading();
            }
        }
        
        // Register implementation with wrapper
        window._viewBDMFilesImpl = viewBDMFiles;
        console.log('✅ viewBDMFiles implementation registered');

        // Explicitly ensure functions are in global scope
        window.assignDesigners = assignDesigners;
        window.toggleDesignerHoursInput = toggleDesignerHoursInput;
        window.updateTotalAllocated = updateTotalAllocated;
        window.submitDesignerAssignment = submitDesignerAssignment;
        window.viewBDMFiles = viewBDMFiles;
        
        // Create alias for viewProject (it's actually called viewProjectDetails in some places)
        window.viewProject = function(projectId) {
            // Check which function exists and call it
            if (typeof viewProjectDetails === 'function') {
                viewProjectDetails(projectId);
            } else if (typeof showProjectDetails === 'function') {
                showProjectDetails(projectId);
            } else {
                console.error('No project view function found');
                alert('Unable to view project details. Please refresh the page.');
            }
        };

        // Function to display BDM files
        function displayBDMFiles(files) {
            const modal = document.getElementById('bdmFilesModal');
            const filesList = document.getElementById('bdmFilesList');

            filesList.innerHTML = '';

            files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <div class="file-info">
                        <span class="file-name">${file.originalName}</span>
                        <span class="file-size">${formatFileSize(file.fileSize)}</span>
                        <span class="file-date">${formatDate(file.uploadedAt)}</span>
                    </div>
                    <div class="file-actions">
                        <a href="${file.url}" target="_blank" class="btn-download">Download</a>
                    </div>
                `;
                filesList.appendChild(fileItem);
            });

            modal.style.display = 'flex';
        }
    
    

        // ============================================
        // MODAL HELPER FUNCTIONS (From new script)
        // ============================================

        function closeDesignerAssignmentModal() {
            const modal = document.getElementById('designerAssignmentModal');
            modal.style.display = 'none';
            document.getElementById('designersList').innerHTML = '';
        }
        function closeBDMFilesModal() {
            const modal = document.getElementById('bdmFilesModal');
            modal.style.display = 'none';
        }
        // ============================================
        // NEW: NOTIFICATION FUNCTIONS
        // ============================================

        let notifications = []; // Cache for notifications

        /**
         * Toggles the notification panel visibility.
         */
        function toggleNotificationPanel() {
            const panel = document.getElementById('notificationPanel');
            if (panel.style.display === 'block') {
                panel.style.display = 'none';
            } else {
                panel.style.display = 'block';
                loadNotifications(); // Refresh when opening
            }
        }

        /**
         * Fetches unread and recent notifications for the current user.
         */
        async function loadNotifications() {
            try {
                // This assumes your /api/notifications endpoint fetches notifications for the logged-in user
                const response = await apiCall('notifications');
                if (!response.success) {
                    throw new Error(response.error || 'Failed to load notifications');
                }

                notifications = response.data || [];
                renderNotifications(notifications);

            } catch (error) {
                console.error('Error loading notifications:', error);
                document.getElementById('notificationList').innerHTML = 
                    `<div class="notification-item">${error.message}</div>`;
            }
        }

        /**
         * Renders the fetched notifications into the panel.
         */
        function renderNotifications(data) {
    const list = document.getElementById('notificationList');
    const countBadge = document.getElementById('notificationCount');
    
    // Safely handle data if it's null/undefined
    const safeData = Array.isArray(data) ? data : [];
    const unreadCount = safeData.filter(n => !n.isRead).length;

    if (countBadge) {
        countBadge.textContent = unreadCount;
        countBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    if (safeData.length === 0) {
        list.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--text-light);">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔕</div>
                No notifications yet.
            </div>`;
        return;
    }

    list.innerHTML = safeData.map(n => {
        // Determine icon based on type
        let icon = '🔔';
        if (n.type === 'variation_approved' || n.type?.includes('approved')) icon = '✅';
        else if (n.type === 'variation_rejected' || n.type?.includes('rejected')) icon = '❌';
        else if (n.type === 'project_allocated') icon = '🎯';
        else if (n.type === 'project_assigned') icon = '👤';
        else if (n.type === 'invoice.created') icon = '💰';
        else if (n.type?.includes('submitted')) icon = '📤';

        // Ensure message exists, fallback if missing
        const message = n.message || 'New activity on your project.';

        return `
            <div class="notification-item ${!n.isRead ? 'unread' : ''}" 
                 onclick="handleNotificationClick('${n.id}', '${n.projectId || ''}', '${n.variationId || ''}', ${n.isRead})">
                <div class="notification-icon">${icon}</div>
                <div class="notification-content">
                    <div class="notification-message">${message}</div>
                    ${n.notes ? `<div style="font-size: 0.85rem; background: rgba(0,0,0,0.05); padding: 0.5rem; margin: 0.5rem 0; border-radius: 4px;">${n.notes}</div>` : ''}
                    <span class="notification-meta">${formatDate(n.createdAt)}</span>
                </div>
            </div>
        `;
    }).join('');
}

        /**
         * Handles clicking on a notification.
         */
        async function handleNotificationClick(notificationId, projectId, variationId, isRead) {
            try {
                // Mark as read only if it's unread
                if (!isRead) {
                    await apiCall(`notifications?id=${notificationId}`, {
                        method: 'PUT',
                        body: JSON.stringify({ isRead: true })
                    });
                    
                    // Update UI immediately
                    const notif = notifications.find(n => n.id === notificationId);
                    if (notif) notif.isRead = true;
                    renderNotifications(notifications);
                }

                // Close the panel
                toggleNotificationPanel();

                // --- Navigate to the relevant item ---
                // This is where you would add navigation
                if (variationId && (currentUserRole === 'design_lead')) {
                    // If you have a modal to view variation details, open it
                    // For now, just navigate to the project
                    alert('Variation status updated. Navigating to project...');
                    viewProject(projectId); // Assuming viewProject exists
                }
                else if (projectId) {
                    // Navigate to the project
                    if (typeof viewProject === 'function') {
                        viewProject(projectId);
                    } else if (typeof viewProposal === 'function') {
                        viewProposal(projectId); // Fallback
                    }
                }

            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        }

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                // Check if the click is directly on the modal overlay itself
                if (event.target === modal) {
                    // Check if it's one of the NEW modals before hiding
                    if (modal.id === 'allocationModal' || modal.id === 'designerAssignmentModal' || modal.id === 'bdmFilesModal' || modal.id === 'successModal') {
                       modal.style.display = 'none';
                    }
                    // For original modals, use the existing closeModal logic if needed
                    else if (event.target.classList.contains('modal-overlay')){
                       closeModal(); // Call your original close function if it exists
                    }
                }
            });
        });

    

// ==================== DIRECTOR APPROVAL & ALLOCATION FUNCTIONS ====================

function generateProposalActionButtons(proposal) {
    const actions = [];
    
    // ===== DIRECTOR APPROVE/REJECT BUTTONS =====
    if (currentUserRole === 'director') {
        const needsApprovalStatuses = ['pricing_complete', 'pending_approval', 'estimation_complete'];
        if (needsApprovalStatuses.includes(proposal.status) && 
            proposal.status !== 'approved' && proposal.status !== 'rejected') {
            actions.push(`
                <button onclick="showDirectorApprovalModal('${proposal.id}', 'approve')" class="btn btn-success btn-sm">
                    ✅ Approve
                </button>
            `);
            actions.push(`
                <button onclick="showDirectorApprovalModal('${proposal.id}', 'reject')" class="btn btn-danger btn-sm">
                    ❌ Reject
                </button>
            `);
        }
    }
    
    // ===== COO & DIRECTOR ALLOCATION BUTTON =====
    if (['coo', 'director'].includes(currentUserRole)) {
        if (proposal.status === 'won' && 
            proposal.pricing?.projectNumber && 
            !proposal.projectCreated && 
            proposal.allocationStatus !== 'allocated') {
            actions.push(`
                <button onclick="showAllocationModal('${proposal.id}')" class="btn btn-primary btn-sm">
                    🎯 Allocate to Design Manager
                </button>
            `);
        }
        
        if (proposal.allocationStatus === 'allocated' && proposal.designLeadName) {
            actions.push(`
                <span class="allocation-status" style="color: var(--success); font-weight: 600;">
                    ✅ Allocated to: ${proposal.designLeadName}
                </span>
            `);
        }
    }
    
    actions.push(`
        <button onclick="viewProposal('${proposal.id}')" class="btn btn-outline btn-sm">
            👁️ View Details
        </button>
    `);
    
    return `<div class="action-buttons">${actions.join('')}</div>`;
}

function showDirectorApprovalModal(proposalId, actionType) {
    const isApprove = actionType === 'approve';
    const title = isApprove ? 'Approve Proposal' : 'Reject Proposal';
    const buttonClass = isApprove ? 'btn-success' : 'btn-danger';
    const buttonText = isApprove ? '✅ Approve' : '❌ Reject';
    
    const modalHtml = `
        <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <span class="close-modal" onclick="closeModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-section" style="background: ${isApprove ? 'var(--light-blue)' : '#fff3cd'}; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                        <h4 style="color: ${isApprove ? 'var(--primary-blue)' : 'var(--warning)'};">
                            ${isApprove ? '✅ Approve this proposal?' : '⚠️ Reject this proposal?'}
                        </h4>
                        <p style="margin-top: 0.5rem;">
                            ${isApprove 
                                ? 'Approving will allow the BDM to submit this proposal to the client.' 
                                : 'Rejecting will send this proposal back with your feedback.'}
                        </p>
                    </div>
                    <form id="directorApprovalForm">
                        <input type="hidden" id="approvalProposalId" value="${proposalId}">
                        <input type="hidden" id="approvalAction" value="${actionType}">
                        ${!isApprove ? `
                            <div class="form-group">
                                <label for="rejectionReason">Rejection Reason <span class="required">*</span></label>
                                <textarea id="rejectionReason" class="form-control" rows="3" 
                                    placeholder="Please provide a clear reason for rejection..." required></textarea>
                                <small class="form-text">This will be sent to the BDM and COO</small>
                            </div>
                        ` : ''}
                        <div class="form-group">
                            <label for="approvalComments">Additional Comments ${!isApprove ? '(Optional)' : ''}</label>
                            <textarea id="approvalComments" class="form-control" rows="3" 
                                placeholder="Add any additional notes or instructions..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" onclick="closeModal()" class="btn btn-outline">Cancel</button>
                    <button type="button" onclick="submitDirectorApproval()" class="btn ${buttonClass}">
                        ${buttonText}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

async function submitDirectorApproval() {
    const proposalId = document.getElementById('approvalProposalId').value;
    const actionType = document.getElementById('approvalAction').value;
    const comments = document.getElementById('approvalComments').value;
    const isApprove = actionType === 'approve';
    
    if (!isApprove) {
        const reason = document.getElementById('rejectionReason').value.trim();
        if (!reason) {
            alert('Please provide a reason for rejection');
            return;
        }
    }
    
    try {
        showLoading();
        const requestData = {
            action: isApprove ? 'approve_proposal' : 'reject_proposal',
            data: { comments: comments }
        };
        
        if (!isApprove) {
            requestData.data.reason = document.getElementById('rejectionReason').value.trim();
        }
        
        const response = await apiCall(`proposals?id=${proposalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });
        
        if (response.success) {
            closeModal();
            showSuccessModal(
                isApprove ? 'Proposal Approved!' : 'Proposal Rejected',
                isApprove 
                    ? 'The proposal has been approved and BDM has been notified.' 
                    : 'The proposal has been rejected and BDM has been notified with your feedback.'
            );
            setTimeout(() => { showProposals(); }, 1500);
        } else {
            throw new Error(response.error || 'Failed to process approval/rejection');
        }
    } catch (error) {
        console.error('Error processing approval/rejection:', error);
        alert('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

async function showAllocationModal(proposalId) {
    try {
        showLoading();
        const proposalResponse = await apiCall(`proposals?id=${proposalId}`);
        if (!proposalResponse.success || !proposalResponse.data) {
            throw new Error('Failed to load proposal');
        }
        const proposal = proposalResponse.data;
        
        if (proposal.status !== 'won') {
            alert('Only WON proposals can be allocated to Design Managers');
            hideLoading();
            return;
        }
        
        if (!proposal.pricing?.projectNumber) {
            alert('This proposal does not have a project number yet. Please assign a project number first.');
            hideLoading();
            return;
        }
        
        const usersResponse = await apiCall('users?role=design_lead');
        let designManagers = [];
        if (usersResponse.success && usersResponse.data) {
            designManagers = usersResponse.data;
        }
        
        if (designManagers.length === 0) {
            alert('No Design Managers found in the system. Please create Design Manager users first.');
            hideLoading();
            return;
        }
        
        const modalHtml = `
           <div class="modal-overlay" onclick="if(event.target === this) closeModal()">
                <div class="modal-content allocation-modal-large" style="max-width: 800px;">
                    <div class="modal-header">
                        <div>
                            <h2>🎯 Allocate Project to Design Manager</h2>
                            <div class="subtitle">${proposal.projectName} - ${proposal.clientCompany}</div>
                        </div>
                        <span class="close-modal" onclick="closeModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="allocation-details-section">
                            <h3>📋 Project Information</h3>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
                                <div style="grid-column: 1 / -1; background: white; padding: 1rem; border-radius: 8px; border-left: 4px solid var(--success);">
                                    <label style="font-weight: 600; color: var(--text-light); font-size: 0.85rem; margin-bottom: 0.3rem; display: block;">
                                        🔢 Project Number:
                                    </label>
                                    <span class="project-number-badge" style="font-size: 1.3rem; padding: 0.7rem 1.2rem;">
                                        ${proposal.pricing.projectNumber}
                                    </span>
                                </div>
                                <div>
                                    <label style="font-weight: 600; color: var(--text-light); font-size: 0.85rem; display: block;">Quote Value:</label>
                                    <span style="font-weight: 600; color: var(--text-dark); font-size: 1.1rem;">
                                        ${proposal.pricing.currency} ${proposal.pricing.quoteValue?.toLocaleString()}
                                    </span>
                                </div>
                                <div>
                                    <label style="font-weight: 600; color: var(--text-light); font-size: 0.85rem; display: block;">Status:</label>
                                    <span class="proposal-status status-won">WON</span>
                                </div>
                                <div>
                                    <label style="font-weight: 600; color: var(--text-light); font-size: 0.85rem; display: block;">BDM:</label>
                                    <span style="font-weight: 600; color: var(--text-dark); font-size: 1.1rem;">
                                        ${proposal.createdByName || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <label style="font-weight: 600; color: var(--text-light); font-size: 0.85rem; display: block;">Client:</label>
                                    <span style="font-weight: 600; color: var(--text-dark); font-size: 1.1rem;">
                                        ${proposal.clientCompany}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top: 2rem;">
                            <h3 style="color: var(--text-dark); margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid var(--border);">
                                👤 Allocation Details
                            </h3>
                            <form id="allocationForm">
                                <input type="hidden" id="allocationProposalId" value="${proposalId}">
                                <input type="hidden" id="allocationProjectName" value="${projectName}">
                                <div class="form-group">
                                    <label for="designManagerSelect">Select Design Manager <span class="required">*</span></label>
                                    <select id="designManagerSelect" class="form-control" required>
                                        <option value="">Choose a Design Manager...</option>
                                        ${designManagers.map(dm => `
                                            <option value="${dm.uid}" data-name="${dm.name}" data-email="${dm.email}">
                                                ${dm.name} (${dm.email})
                                            </option>
                                        `).join('')}
                                    </select>
                                    <small class="form-text">Select the Design Manager who will oversee this project</small>
                                </div>
                                <div class="form-group">
                                    <label for="maxAllocatedHours">Max Allocated Hours <span class="required">*</span></label>
                                    <input type="number" id="maxAllocatedHours" class="form-control" 
                                           step="0.5" min="1" placeholder="Enter maximum hours allocated for this project" required>
                                    <small class="form-text">Total hours budget allocated by COO/Director for this project</small>
                                </div>
                                <div class="form-group">
                                    <label for="additionalHours">Additional Hours Provision</label>
                                    <input type="number" id="additionalHours" class="form-control" 
                                           step="0.5" min="0" value="0" placeholder="Enter buffer hours (optional)">
                                    <small class="form-text">Extra hours that can be allocated if needed (buffer)</small>
                                </div>
                                <div class="form-group">
                                    <label for="targetCompletionDate">Target Completion Date</label>
                                    <input type="date" id="targetCompletionDate" class="form-control"
                                         min="${new Date().toISOString().split('T')[0]}">
                                    <small class="form-text">Expected project completion date</small>
                                </div>
                                <div class="form-group">
                                    <label for="projectPriority">Project Priority</label>
                                    <select id="projectPriority" class="form-control">
                                        <option value="Normal">Normal</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="allocationComments2">Allocation Comments <span class="required">*</span></label>
                                    <textarea id="allocationComments2" class="form-control" rows="4"
                                         placeholder="Add instructions, notes, or special requirements for the Design Manager..." required></textarea>
                                    <small class="form-text">Provide clear guidance and expectations for this project</small>
                                </div>
                                <div class="form-group">
                                    <label for="specialInstructions2">Special Instructions</label>
                                    <textarea id="specialInstructions2" class="form-control" rows="3"
                                         placeholder="Add any special client requirements, constraints, or important notes..."></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" onclick="closeModal()" class="btn btn-outline">Cancel</button>
                        <button type="button" onclick="submitProjectAllocation()" class="btn btn-success btn-large">
                            <span class="btn-icon">✓</span> Allocate Project
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        hideLoading();
    } catch (error) {
        console.error('Error showing allocation modal:', error);
        alert('Error loading allocation form: ' + error.message);
        hideLoading();
    }
}

// Submit Allocation - FIXED VERSION
async function submitProposalAllocation() {
    const proposalId = document.getElementById('allocationProposalId').value;
    const designManagerSelect = document.getElementById('designManagerSelect');
    const designManagerUid = designManagerSelect.value;
    const targetCompletionDate = document.getElementById('targetCompletionDate').value;
    const projectPriority = document.getElementById('projectPriority').value;
    const allocationComments = document.getElementById('allocationComments2').value.trim();
    const specialInstructions = document.getElementById('specialInstructions2').value.trim();
    const maxAllocatedHours = document.getElementById('maxAllocatedHours').value;
    const additionalHours = document.getElementById('additionalHours').value || 0;
    
    // FIXED: Proper validation
    if (!designManagerUid) {
        alert('⚠️ Please select a Design Manager');
        document.getElementById('designManagerSelect').focus();
        return;
    }
    
    // Validate max hours
    if (!maxAllocatedHours || parseFloat(maxAllocatedHours) < 1) {
        alert('⚠️ Please enter max allocated hours (minimum 1 hour)');
        document.getElementById('maxAllocatedHours').focus();
        return;
    }
    
    // FIXED: Better validation message with minimum character requirement
    if (!allocationComments || allocationComments.length < 10) {
        alert('⚠️ Please add allocation comments (at least 10 characters)');
        document.getElementById('allocationComments2').focus();
        return;
    }
    
    try {
        showLoading();
        const selectedOption = designManagerSelect.options[designManagerSelect.selectedIndex];
        const designManagerName = selectedOption.getAttribute('data-name');
        const designManagerEmail = selectedOption.getAttribute('data-email');
        
        // Create project from proposal
        const createProjectResponse = await apiCall('projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'create_from_proposal',
                proposalId: proposalId
            })
        });
        
        if (!createProjectResponse.success) {
            const proposalResponse = await apiCall(`proposals?id=${proposalId}`);
            if (!proposalResponse.data.projectId) {
                throw new Error('Failed to create project: ' + (createProjectResponse.error || 'Unknown error'));
            }
        }
        
        // Get the project ID
        const proposalResponse = await apiCall(`proposals?id=${proposalId}`);
        const projectId = proposalResponse.data.projectId;
        
        if (!projectId) {
            throw new Error('Project ID not found');
        }
        
        // Allocate to design lead
        const allocationData = {
            designLeadUid: designManagerUid,
            targetCompletionDate: targetCompletionDate || null,
            priority: projectPriority,
            allocationNotes: allocationComments,
            specialInstructions: specialInstructions,
            maxAllocatedHours: parseFloat(maxAllocatedHours),
            additionalHours: parseFloat(additionalHours)
        };
        
        const response = await apiCall(`projects?id=${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'allocate_to_design_lead',
                data: allocationData
            })
        });
        
        if (response.success) {
            // Update proposal allocation status
            await apiCall(`proposals?id=${proposalId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_allocation_status',
                    data: {
                        allocationStatus: 'allocated',
                        designLeadName: designManagerName,
                        designLeadUid: designManagerUid,
                        allocatedAt: new Date().toISOString()
                    }
                })
            });
            
            closeModal();
            alert(`✅ Project Allocated Successfully!\n\nProject has been allocated to ${designManagerName} with ${maxAllocatedHours} hours (+${additionalHours} buffer). They will be notified immediately.`);
            const projectName = document.getElementById('allocationProjectName')?.value || 'Unknown Project'; // <-- ADD THIS
                triggerEmailNotification('project.allotment_', { projectName: projectName, designerEmail: designManagerEmail }); // <-- ADD THIS
            
            setTimeout(() => {
                showProposals();
            }, 1000);
        } else {
            throw new Error(response.error || 'Failed to allocate project');
        }
    } catch (error) {
        console.error('Error allocating project:', error);
        alert('❌ Error allocating project: ' + error.message);
    } finally {
        hideLoading();
    }
}


    
        function switchDesignerTab(tabName) {
            // Update tab buttons
            document.querySelectorAll('.doc-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Update content visibility
            document.getElementById('designer-drawings-content').style.display = 'none';
            document.getElementById('designer-specs-content').style.display = 'none';
            
            if (tabName === 'drawings') {
                document.getElementById('designer-drawings-content').style.display = 'block';
            } else {
                document.getElementById('designer-specs-content').style.display = 'block';
            }
        }


        // ============================================
        // GLOBAL FUNCTION ASSIGNMENTS FOR ONCLICK HANDLERS
        // ============================================
        // Ensure all functions called via onclick are in global scope
        
        // Modal functions
        window.closeModal = closeModal;
        if (typeof closeProjectDetailsModal !== 'undefined') window.closeProjectDetailsModal = closeProjectDetailsModal;
        if (typeof closeDesignerAssignmentModal !== 'undefined') window.closeDesignerAssignmentModal = closeDesignerAssignmentModal;
        if (typeof closeBDMFilesModal !== 'undefined') window.closeBDMFilesModal = closeBDMFilesModal;
        if (typeof closeCooMultiDesignerModal !== 'undefined') window.closeCooMultiDesignerModal = closeCooMultiDesignerModal;
        
        // Proposal functions
        if (typeof viewProposal !== 'undefined') window.viewProposal = viewProposal;
        if (typeof showEstimationModal !== 'undefined') window.showEstimationModal = showEstimationModal;
        if (typeof submitEstimation !== 'undefined') window.submitEstimation = submitEstimation;
        if (typeof showCOOPricingForm !== 'undefined') window.showCOOPricingForm = showCOOPricingForm;
        if (typeof submitCOOPricing !== 'undefined') window.submitCOOPricing = submitCOOPricing;
        if (typeof markProposalWon !== 'undefined') window.markProposalWon = markProposalWon;
        if (typeof markProposalLost !== 'undefined') window.markProposalLost = markProposalLost;
        if (typeof filterProposals !== 'undefined') window.filterProposals = filterProposals;
        
        // Project functions  
        if (typeof showProjectAllocationModal !== 'undefined') window.showProjectAllocationModal = showProjectAllocationModal;
        if (typeof showProposals !== 'undefined') window.showProposals = showProposals;
        if (typeof showProjects !== 'undefined') window.showProjects = showProjects;
        if (typeof filterProjects !== 'undefined') window.filterProjects = filterProjects;
        
        // File functions
        if (typeof downloadFile !== 'undefined') window.downloadFile = downloadFile;
        if (typeof deleteFile !== 'undefined') window.deleteFile = deleteFile;
        
        // Tab/Navigation functions
        if (typeof showTab !== 'undefined') window.showTab = showTab;
        if (typeof setActiveNav !== 'undefined') window.setActiveNav = setActiveNav;
        if (typeof switchTab !== 'undefined') window.switchTab = switchTab;
        if (typeof switchDesignerTab !== 'undefined') window.switchDesignerTab = switchDesignerTab;
        
        // Dashboard functions
        if (typeof showExecutiveDashboard !== 'undefined') window.showExecutiveDashboard = showExecutiveDashboard;
        if (typeof showExecutiveSection !== 'undefined') window.showExecutiveSection = showExecutiveSection;
        if (typeof switchExecutiveTab !== 'undefined') window.switchExecutiveTab = switchExecutiveTab;
        
        // Time request functions
        if (typeof reviewTimeRequest !== 'undefined') window.reviewTimeRequest = reviewTimeRequest;
        if (typeof closeRequestTimeModal !== 'undefined') window.closeRequestTimeModal = closeRequestTimeModal;
        
        // Payment functions
        if (typeof viewPayment !== 'undefined') window.viewPayment = viewPayment;
        
        // ============================================
        // ✅ MODAL HELPER FUNCTIONS - Must be defined before designer functions
        // ============================================
        
        window.closeAllModals = function() {
            const modals = document.querySelectorAll('.modal-overlay');
            modals.forEach(modal => modal.remove());
            document.body.classList.remove('modal-open');
        };
        
        window.handleModalOverlayClick = function(event, modalId) {
            if (event.target.id === modalId) {
                document.getElementById(modalId).remove();
                document.body.classList.remove('modal-open');
            }
        };
        
        window.closeTimesheetModal = function() {
            const modal = document.getElementById('timesheetModalOverlay');
            if (modal) modal.remove();
            document.body.classList.remove('modal-open');
        };
        
        window.closeProjectFilesModal = function() {
            const modal = document.getElementById('projectFilesModal');
            if (modal) modal.remove();
            document.body.classList.remove('modal-open');
        };
        
        window.closeProjectDetailsModal = function() {
            const modal = document.getElementById('projectDetailsModal');
            if (modal) modal.remove();
            document.body.classList.remove('modal-open');
        };
        
        window.closeDesignerUploadModal = function() {
            const modal = document.getElementById('designerUploadModal');
            if (modal) modal.remove();
            document.body.classList.remove('modal-open');
        };
        
        console.log('✅ Modal helper functions registered');
        
        // ============================================
        // ✅ SUBMIT TIMESHEET FUNCTION - MUST BE DEFINED EARLY
        // ============================================
        window.submitTimesheet = async function() {
            console.log('📝 submitTimesheet called');
            
            const projectId = document.getElementById('timesheetProjectId')?.value;
            const date = document.getElementById('timesheetDate')?.value;
            const hours = parseFloat(document.getElementById('timesheetHours')?.value);
            const description = document.getElementById('timesheetDescription')?.value?.trim();
            
            console.log('📝 Form data:', { projectId, date, hours, description });
            
            // Validation
            if (!projectId || !date || !hours || !description) {
                alert('Please fill all required fields');
                return;
            }
            
            if (hours <= 0 || hours > 24) {
                alert('Hours must be between 0.25 and 24');
                return;
            }

            // Frontend allocation check
            const projectSelect = document.getElementById('timesheetProjectId');
            if (projectSelect) {
                const selectedOption = projectSelect.options[projectSelect.selectedIndex];
                const allocated = parseFloat(selectedOption?.dataset?.allocated) || 0;
                const logged = parseFloat(selectedOption?.dataset?.logged) || 0;
                const newTotal = logged + hours;

                if (newTotal > allocated && allocated > 0) {
                    console.warn(`Allocation exceeded: ${newTotal} > ${allocated}`);
                    
                    const allocationData = {
                        totalHours: logged,
                        allocatedHours: allocated,
                        exceededBy: newTotal - allocated
                    };
                    const timesheetData = { projectId, date, hours, description };

                    closeTimesheetModal();
                    if (typeof showRequestAdditionalTimeModal === 'function') {
                        showRequestAdditionalTimeModal(allocationData, timesheetData);
                    } else {
                        alert('You have exceeded your allocated hours (' + allocated + 'h). Please contact COO for additional time.');
                    }
                    return;
                }
            }
            
            try {
                showLoading();
                console.log('📤 Submitting timesheet to API...');
                
                const response = await apiCall('timesheets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId, date, hours, description })
                });
                
                console.log('📥 API Response:', response);
                
                if (response.success) {
                    closeTimesheetModal();
                    alert(`✅ ${hours} hours logged successfully for ${date}!`);
                    
                    // Refresh the designer allocations view
                    if (typeof showDesignerAllocations === 'function') {
                        showDesignerAllocations();
                    }
                    
                } else if (response.exceedsAllocation) {
                    hideLoading();
                    closeTimesheetModal();
                    if (typeof showRequestAdditionalTimeModal === 'function') {
                        showRequestAdditionalTimeModal(response, { projectId, date, hours, description });
                    } else {
                        alert('You have exceeded your allocated hours. Please contact COO for additional time.');
                    }
                    
                } else {
                    throw new Error(response.error || 'Failed to log hours');
                }
                
            } catch (error) {
                console.error('❌ Error submitting timesheet:', error);
                alert('Error logging hours: ' + error.message);
            } finally {
                hideLoading();
            }
        };
        
        console.log('✅ submitTimesheet function registered');
        
        // ============================================
        // ✅ FILE DOWNLOAD FUNCTION
        // ============================================
        window.downloadFile = async function(fileUrl, fileName) {
            console.log('⬇️ Downloading file:', fileName, 'from:', fileUrl);
            try {
                // Show loading indicator
                const btn = event.target;
                const originalText = btn.innerHTML;
                btn.innerHTML = '⏳ Downloading...';
                btn.disabled = true;
                
                // Fetch the file
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch file');
                }
                
                // Get the blob
                const blob = await response.blob();
                
                // Create download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName || 'download';
                document.body.appendChild(a);
                a.click();
                
                // Cleanup
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                // Restore button
                btn.innerHTML = originalText;
                btn.disabled = false;
                
                console.log('✅ Download completed:', fileName);
            } catch (error) {
                console.error('❌ Download failed:', error);
                // Fallback: Open in new tab
                window.open(fileUrl, '_blank');
                
                // Restore button if available
                if (event && event.target) {
                    event.target.innerHTML = '⬇️ Download';
                    event.target.disabled = false;
                }
            }
        };
        
        console.log('✅ Download function registered');
        
        // ✅ FIX: Forward declarations for designer functions defined in second script block
        // These functions are fully implemented later in the file but need to be accessible from HTML
        // FIXED: Implementing functions directly here instead of waiting for later definitions
        
        window.showTasks = async function() {
            console.log('🔄 showTasks called');
            setActiveNav('nav-tasks');
            const main = document.getElementById('mainContent');
            main.style.display = 'block';
            showLoading();
            
            try {
                // Fetch projects assigned to this designer
                const response = await apiCall('projects?assignedToMe=true');
                
                if (!response.success) {
                    throw new Error('Failed to load projects');
                }
                
                let rawProjects = response.data || [];
                
                // Ensure specific client-side filtering just in case backend returns all
                const projects = rawProjects.filter(p => 
                    (p.assignedDesigners && p.assignedDesigners.includes(currentUser.uid)) ||
                    (p.assignedDesignerUids && p.assignedDesignerUids.includes(currentUser.uid))
                );
                
                const projectsHtml = projects.length > 0 ? projects.map(project => `
                    <div class="project-card" style="background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid var(--border);">
                        <div class="project-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3 style="margin: 0; color: var(--text-dark);">${project.projectName || 'Untitled Project'}</h3>
                            <span class="project-status" style="padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; background: var(--light-blue); color: var(--primary-blue);">${project.status || 'N/A'}</span>
                        </div>
                        <div class="project-details" style="margin-bottom: 1rem; color: var(--text-light);">
                            <p style="margin: 0.5rem 0;"><strong>Client:</strong> ${project.clientCompany || 'N/A'}</p>
                            <p style="margin: 0.5rem 0;"><strong>Project Code:</strong> ${project.projectCode || 'N/A'}</p>
                            <p style="margin: 0.5rem 0;"><strong>Target Date:</strong> ${project.targetCompletionDate ? formatDate(project.targetCompletionDate) : 'Not set'}</p>
                            <p style="margin: 0.5rem 0;"><strong>Status:</strong> ${project.designStatus || 'N/A'}</p>
                            <p style="margin: 0.5rem 0;"><strong>Design Manager:</strong> ${project.designLeadName || 'N/A'}</p>
                        </div>
                        <div class="project-actions" style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-primary" onclick="showDesignerUploadModal('${project.id}')">
                                📤 Upload Files
                            </button>
                            <button class="btn btn-outline" onclick="viewProjectDetails('${project.id}')">
                                👁️ View Details
                            </button>
                        </div>
                    </div>
                `).join('') : '<p style="text-align: center; padding: 2rem; color: var(--text-light);">No projects assigned yet.</p>';
                
                main.innerHTML = `
                    <div class="page-header">
                        <h2>📋 My Tasks</h2>
                        <p class="subtitle">Projects assigned to you</p>
                    </div>
                    
                    <div class="dashboard-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                        <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div class="stat-number" style="font-size: 2.5rem; font-weight: 700; color: var(--primary-blue);">${projects.length}</div>
                            <div class="stat-label" style="color: var(--text-light);">Total Projects</div>
                        </div>
                        <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div class="stat-number" style="font-size: 2.5rem; font-weight: 700; color: var(--success);">${projects.filter(p => p.status === 'active' || p.status === 'in_progress').length}</div>
                            <div class="stat-label" style="color: var(--text-light);">Active Projects</div>
                        </div>
                        <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div class="stat-number" style="font-size: 2.5rem; font-weight: 700; color: var(--accent-blue);">${projects.filter(p => p.status === 'completed').length}</div>
                            <div class="stat-label" style="color: var(--text-light);">Completed</div>
                        </div>
                    </div>
                    
                    <div class="action-section" style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h3 style="margin-bottom: 1.5rem;">Your Projects</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                            ${projectsHtml}
                        </div>
                    </div>
                `;
                
            } catch (error) {
                console.error('Error loading tasks:', error);
                main.innerHTML = `<div class="error-message" style="background: #fee; padding: 2rem; border-radius: 12px; text-align: center;"><h3>⚠️ Error Loading Projects</h3><p>${error.message}</p><button onclick="showTasks()" class="btn btn-primary" style="margin-top: 1rem;">Retry</button></div>`;
            } finally {
                hideLoading();
            }
        };
        
        window.showTimesheet = async function() {
            console.log('🔄 showTimesheet called');
            setActiveNav('nav-timesheet');
            const main = document.getElementById('mainContent');
            main.style.display = 'block';
            showLoading();
            
            try {
                console.log('⏱️ Loading Timesheet...');
                
                // Load designer's projects and timesheet entries
                const projectsResponse = await apiCall('projects?assignedToMe=true');
                const timesheetResponse = await apiCall('timesheets');
                
                let projects = [];
                let entries = [];
                
                if (projectsResponse.success) {
                    const rawProjects = projectsResponse.data || [];
                    projects = rawProjects.filter(p => 
                        (p.assignedDesigners && p.assignedDesigners.includes(currentUser.uid)) ||
                        (p.assignedDesignerUids && p.assignedDesignerUids.includes(currentUser.uid))
                    );
                }
                
                if (timesheetResponse.success) {
                    entries = timesheetResponse.data || [];
                }
                
                // Calculate summary - helper functions
                const isThisWeek = (dateStr) => {
                    if (!dateStr) return false;
                    const date = new Date(dateStr);
                    const now = new Date();
                    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                    weekStart.setHours(0, 0, 0, 0);
                    return date >= weekStart;
                };
                
                const isThisMonth = (dateStr) => {
                    if (!dateStr) return false;
                    const date = new Date(dateStr);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                };
                
                const thisWeekHours = entries
                    .filter(e => isThisWeek(e.date))
                    .reduce((sum, e) => sum + parseFloat(e.hours || 0), 0);
                
                const thisMonthHours = entries
                    .filter(e => isThisMonth(e.date))
                    .reduce((sum, e) => sum + parseFloat(e.hours || 0), 0);
                
                // Build entries table
                const entriesHtml = entries.length > 0 ? entries.slice(0, 20).map(entry => `
                    <tr>
                        <td>${entry.date || 'N/A'}</td>
                        <td>${entry.projectName || 'Unknown Project'}</td>
                        <td><strong>${parseFloat(entry.hours || 0).toFixed(2)}h</strong></td>
                        <td>${entry.description || 'No description'}</td>
                        <td><span style="padding: 0.25rem 0.5rem; border-radius: 4px; background: ${entry.status === 'approved' ? '#d4edda' : '#fff3cd'}; color: ${entry.status === 'approved' ? '#155724' : '#856404'};">${entry.status || 'Pending'}</span></td>
                        <td>-</td>
                    </tr>
                `).join('') : `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-light);">No timesheet entries yet. Click "Log Hours" to add your first entry.</td></tr>`;
                
                main.innerHTML = `
                    <div class="page-header">
                        <h2>⏱️ My Timesheet</h2>
                        <p class="subtitle">Track your hours on assigned projects</p>
                    </div>
                    
                    <div class="card" style="background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                            <h3 style="margin: 0;">Log Hours</h3>
                            <button onclick="showTimesheetModal()" class="btn btn-primary">
                                <span>+</span> Log Hours
                            </button>
                        </div>
                        
                        <!-- Timesheet Summary -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; padding: 1rem;">
                            <div class="stat-card" style="background: white; border: 2px solid var(--border); border-radius: 10px; padding: 1rem; text-align: center;">
                                <div style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 0.5rem;">This Week</div>
                                <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary-blue);">${thisWeekHours.toFixed(1)}h</div>
                            </div>
                            <div class="stat-card" style="background: white; border: 2px solid var(--border); border-radius: 10px; padding: 1rem; text-align: center;">
                                <div style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 0.5rem;">This Month</div>
                                <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary-blue);">${thisMonthHours.toFixed(1)}h</div>
                            </div>
                            <div class="stat-card" style="background: white; border: 2px solid var(--border); border-radius: 10px; padding: 1rem; text-align: center;">
                                <div style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 0.5rem;">Active Projects</div>
                                <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary-blue);">${projects.length}</div>
                            </div>
                        </div>
                        
                        <!-- Timesheet Entries Table -->
                        <table class="data-table" style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--light-blue);">
                                    <th style="padding: 1rem; text-align: left;">Date</th>
                                    <th style="padding: 1rem; text-align: left;">Project</th>
                                    <th style="padding: 1rem; text-align: left;">Hours</th>
                                    <th style="padding: 1rem; text-align: left;">Description</th>
                                    <th style="padding: 1rem; text-align: left;">Status</th>
                                    <th style="padding: 1rem; text-align: left;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${entriesHtml}
                            </tbody>
                        </table>
                    </div>
                `;
                
            } catch (error) {
                console.error('❌ Timesheet error:', error);
                main.innerHTML = `<div class="error-message" style="background: #fee; padding: 2rem; border-radius: 12px; text-align: center;"><h3>⚠️ Error Loading Timesheet</h3><p>${error.message}</p><button onclick="showTimesheet()" class="btn btn-primary" style="margin-top: 1rem;">Retry</button></div>`;
            } finally {
                hideLoading();
            }
        };
        
        window.showTimesheetModal = async function(projectId = null) {
            console.log('🔄 showTimesheetModal called for project:', projectId);
            try {
                showLoading();
                
                // Fetch all projects
                const response = await apiCall('projects');
                if (!response.success) {
                    throw new Error('Failed to load projects');
                }
                
                const projects = response.data || [];
                // Filter for projects assigned to the current designer
                const assignedProjects = projects.filter(p => {
                    const inDesigners = p.assignedDesigners && p.assignedDesigners.includes(currentUser.uid);
                    const inUids = p.assignedDesignerUids && p.assignedDesignerUids.includes(currentUser.uid);
                    return inDesigners || inUids;
                });
                
                if (assignedProjects.length === 0) {
                    alert('You are not assigned to any projects yet.');
                    hideLoading();
                    return;
                }
                
                // Close any existing modals first
                closeAllModals();
                
                const modalHtml = `
                    <div class="modal-overlay" id="timesheetModalOverlay" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center;" onclick="handleModalOverlayClick(event, 'timesheetModalOverlay')">
                        <div class="modal-content" style="max-width: 600px; background: white; border-radius: 12px; max-height: 90vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                            <div class="modal-header" style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                                <h2 style="margin: 0;">📋 Log Hours</h2>
                                <span class="close-modal" onclick="closeTimesheetModal()" style="cursor: pointer; font-size: 2rem; color: #666;">&times;</span>
                            </div>
                            
                            <div class="modal-body" style="padding: 1.5rem; max-height: 60vh; overflow-y: auto;">
                                <form id="timesheetForm" onsubmit="event.preventDefault(); submitTimesheet();">
                                    <div class="form-group" style="margin-bottom: 1rem;">
                                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Project <span style="color: red;">*</span></label>
                                        <select id="timesheetProjectId" class="form-control" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 8px;" required>
                                            <option value="">Select a project...</option>
                                            ${assignedProjects.map(project => `
                                                <option value="${project.id}" 
                                                        data-allocated="${(project.maxAllocatedHours || 0) + (project.additionalHours || 0)}" 
                                                        data-logged="${project.hoursLogged || 0}">
                                                    ${project.projectName} - ${project.clientCompany}
                                                </option>
                                            `).join('')}
                                        </select>
                                    </div>

                                    <div class="form-group" style="margin-bottom: 1rem;">
                                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Date <span style="color: red;">*</span></label>
                                        <input type="date" id="timesheetDate" class="form-control" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 8px;"
                                               max="${new Date().toISOString().split('T')[0]}" required>
                                    </div>

                                    <div class="form-group" style="margin-bottom: 1rem;">
                                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Hours <span style="color: red;">*</span></label>
                                        <input type="number" id="timesheetHours" class="form-control" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 8px;"
                                               min="0.25" max="24" step="0.25" required 
                                               placeholder="e.g., 8 or 2.5">
                                    </div>

                                    <div class="form-group" style="margin-bottom: 1rem;">
                                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Description <span style="color: red;">*</span></label>
                                        <textarea id="timesheetDescription" class="form-control" rows="4" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 8px; resize: vertical;"
                                                  placeholder="Describe what you worked on..." required></textarea>
                                    </div>

                                    <div id="timesheetAllocationInfo" 
                                         style="display: none; padding: 1rem; background: #e3f2fd; 
                                                border-radius: 8px; margin-top: 1rem; border-left: 4px solid #2196F3;">
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                            <span>Hours Logged:</span>
                                            <strong id="timesheetCurrentHours">0h</strong>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                            <span>Hours Allocated:</span>
                                            <strong id="timesheetAllocatedHours">0h</strong>
                                        </div>
                                        <div style="display: flex; justify-content: space-between;">
                                            <span>Hours Remaining:</span>
                                            <strong id="timesheetRemainingHours" style="color: #4CAF50;">0h</strong>
                                        </div>
                                    </div>
                                    
                                    <div id="timesheetWarning" style="display: none; padding: 1rem; background: #fff3cd; 
                                         border-radius: 8px; margin-top: 1rem; border-left: 4px solid #ff9800; color: #856404;">
                                        <strong>⚠️ Warning:</strong> <span id="timesheetWarningText"></span>
                                    </div>
                                </form>
                            </div>
                            
                            <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 0.5rem;">
                                <button type="button" onclick="closeTimesheetModal()" class="btn btn-outline" style="padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">Cancel</button>
                                <button type="button" onclick="console.log('Log Hours clicked'); submitTimesheet();" class="btn btn-success" style="padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; background: #10b981; color: white; border: none; font-weight: 600;">
                                    Log Hours
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                document.body.classList.add('modal-open');
                document.getElementById('timesheetDate').value = new Date().toISOString().split('T')[0];
                
                // Add change listener for project selection
                document.getElementById('timesheetProjectId').addEventListener('change', updateTimesheetAllocationInfo);
                document.getElementById('timesheetHours').addEventListener('input', updateTimesheetAllocationInfo);
                
                if (projectId) {
                    document.getElementById('timesheetProjectId').value = projectId;
                    updateTimesheetAllocationInfo();
                }
                
                hideLoading();
                
            } catch (error) {
                console.error('Error showing timesheet modal:', error);
                alert('Error loading timesheet form: ' + error.message);
                hideLoading();
            }
        };
        
        window.showRequestTimeModalDirect = function(projectId, projectName, allocatedHours, usedHours) {
            console.log('🔄 showRequestTimeModalDirect called', { projectId, projectName, allocatedHours, usedHours });
            
            closeAllModals();
            
            const remaining = allocatedHours - usedHours;
            const suggestedHours = Math.max(10, Math.ceil((allocatedHours * 0.25))); // Suggest 25% more or at least 10h
            
            const modalHtml = `
                <div class="modal-overlay" id="requestTimeDirectModalOverlay" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center;" onclick="handleModalOverlayClick(event, 'requestTimeDirectModalOverlay')">
                    <div class="modal-content" style="max-width: 600px; background: white; border-radius: 12px; max-height: 90vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                        <div class="modal-header" style="padding: 1.5rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px 12px 0 0;">
                            <h2 style="margin: 0;">⏰ Request Additional Time</h2>
                            <span class="close-modal" onclick="closeRequestTimeDirectModal()" style="cursor: pointer; font-size: 2rem;">&times;</span>
                        </div>
                        
                        <div class="modal-body" style="padding: 1.5rem; max-height: 60vh; overflow-y: auto;">
                            <div style="padding: 1rem; background: #e3f2fd; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #2196f3;">
                                <h4 style="margin: 0 0 0.5rem 0; color: #1565c0;">📊 Project: ${projectName}</h4>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
                                    <div style="text-align: center;">
                                        <div style="font-size: 1.5rem; font-weight: bold; color: #1976d2;">${allocatedHours.toFixed(1)}h</div>
                                        <small style="color: #666;">Allocated</small>
                                    </div>
                                    <div style="text-align: center;">
                                        <div style="font-size: 1.5rem; font-weight: bold; color: #ff9800;">${usedHours.toFixed(1)}h</div>
                                        <small style="color: #666;">Used</small>
                                    </div>
                                    <div style="text-align: center;">
                                        <div style="font-size: 1.5rem; font-weight: bold; color: ${remaining < 0 ? '#f44336' : remaining < 5 ? '#ff9800' : '#4caf50'};">${remaining.toFixed(1)}h</div>
                                        <small style="color: #666;">Remaining</small>
                                    </div>
                                </div>
                            </div>
                            
                            ${remaining <= 0 ? `
                                <div style="padding: 1rem; background: #ffebee; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #f44336;">
                                    <p style="margin: 0; color: #c62828;">
                                        ⚠️ <strong>Budget Exceeded!</strong> You've used all your allocated hours. 
                                        Submit a request for additional time to continue working on this project.
                                    </p>
                                </div>
                            ` : remaining < 5 ? `
                                <div style="padding: 1rem; background: #fff3e0; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #ff9800;">
                                    <p style="margin: 0; color: #e65100;">
                                        ⚠️ <strong>Low Budget Warning!</strong> You have only ${remaining.toFixed(1)} hours remaining.
                                        Consider requesting additional time before running out.
                                    </p>
                                </div>
                            ` : ''}
                            
                            <form id="requestTimeDirectForm" onsubmit="event.preventDefault(); submitDirectTimeRequest();">
                                <input type="hidden" id="directReqProjectId" value="${projectId}">
                                <input type="hidden" id="directReqProjectName" value="${projectName}">
                                <input type="hidden" id="directReqAllocatedHours" value="${allocatedHours}">
                                <input type="hidden" id="directReqUsedHours" value="${usedHours}">
                                
                                <div class="form-group" style="margin-bottom: 1rem;">
                                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Additional Hours Needed <span style="color: red;">*</span></label>
                                    <input type="number" id="directRequestedHours" class="form-control" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;"
                                           min="1" step="0.5" 
                                           value="${suggestedHours}" required>
                                    <small style="color: #666;">Suggested: ${suggestedHours}h (25% additional buffer)</small>
                                </div>
                                
                                <div class="form-group" style="margin-bottom: 1rem;">
                                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Reason for Additional Time <span style="color: red;">*</span></label>
                                    <textarea id="directRequestReason" class="form-control" rows="5" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; resize: vertical;"
                                              placeholder="Please explain why additional time is needed...

Examples:
- Design complexity increased
- Client requested revisions
- Scope changes not in original estimate
- Unforeseen technical challenges" required></textarea>
                                    <small style="color: #666;">Be specific: scope changes, unforeseen complexity, design revisions, etc. (min 20 characters)</small>
                                </div>
                            </form>
                        </div>
                        
                        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 0.5rem;">
                            <button type="button" onclick="closeRequestTimeDirectModal()" class="btn btn-outline" style="padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; border: 1px solid #ddd; background: white;">Cancel</button>
                            <button type="button" onclick="submitDirectTimeRequest()" class="btn btn-primary" style="padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; background: #1e40af; color: white; border: none; font-weight: 600;">
                                📤 Submit Request to COO
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            document.body.classList.add('modal-open');
        };
        
        window.closeRequestTimeDirectModal = function() {
            const modal = document.getElementById('requestTimeDirectModalOverlay');
            if (modal) modal.remove();
            document.body.classList.remove('modal-open');
        };
        
        window.submitDirectTimeRequest = async function() {
            console.log('📤 submitDirectTimeRequest called');
            
            const projectId = document.getElementById('directReqProjectId')?.value;
            const projectName = document.getElementById('directReqProjectName')?.value;
            const allocatedHours = parseFloat(document.getElementById('directReqAllocatedHours')?.value);
            const usedHours = parseFloat(document.getElementById('directReqUsedHours')?.value);
            const requestedHours = parseFloat(document.getElementById('directRequestedHours')?.value);
            const reason = document.getElementById('directRequestReason')?.value?.trim();
            
            console.log('📝 Request data:', { projectId, projectName, requestedHours, reason });
            
            if (!requestedHours || requestedHours <= 0) {
                alert('Please enter valid hours');
                return;
            }
            
            if (!reason || reason.length < 20) {
                alert('Please provide a detailed reason (at least 20 characters)');
                document.getElementById('directRequestReason')?.focus();
                return;
            }
            
            try {
                showLoading();
                
                const response = await apiCall('time-requests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        projectId,
                        requestedHours,
                        reason,
                        currentAllocatedHours: allocatedHours,
                        currentHoursLogged: usedHours,
                        requestType: 'proactive'
                    })
                });
                
                console.log('📥 API Response:', response);
                
                if (response.success) {
                    closeRequestTimeDirectModal();
                    alert(`✅ Request Submitted!\n\nYour request for ${requestedHours} additional hours on "${projectName}" has been submitted to the COO for review.`);
                    
                    // Refresh the allocations view
                    if (typeof showDesignerAllocations === 'function') {
                        showDesignerAllocations();
                    }
                } else {
                    throw new Error(response.error || 'Failed to submit request');
                }
                
            } catch (error) {
                console.error('❌ Error submitting time request:', error);
                alert('Error: ' + error.message);
            } finally {
                hideLoading();
            }
        };
        
        console.log('✅ Request Time Modal functions registered');
        
        // ============================================
        // ✅ SHOW REQUEST ADDITIONAL TIME MODAL (for timesheet overflow)
        // ============================================
        window.showRequestAdditionalTimeModal = function(allocationData, timesheetData) {
            console.log('🔄 showRequestAdditionalTimeModal called', { allocationData, timesheetData });
            
            closeAllModals();
            
            const totalHours = allocationData.totalHours || 0;
            const allocatedHours = allocationData.allocatedHours || 0;
            const exceededBy = allocationData.exceededBy || 0;
            const projectId = timesheetData.projectId;
            const date = timesheetData.date;
            const hours = timesheetData.hours;
            const description = timesheetData.description;
            
            const modalHtml = `
                <div class="modal-overlay" id="requestTimeModalOverlay" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center;" onclick="handleModalOverlayClick(event, 'requestTimeModalOverlay')">
                    <div class="modal-content" style="max-width: 600px; background: white; border-radius: 12px; max-height: 90vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                        <div class="modal-header" style="padding: 1.5rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border-radius: 12px 12px 0 0;">
                            <h2 style="margin: 0;">⏱️ Request Additional Time</h2>
                            <span class="close-modal" onclick="closeRequestTimeModal()" style="cursor: pointer; font-size: 2rem;">&times;</span>
                        </div>
                        
                        <div class="modal-body" style="padding: 1.5rem; max-height: 60vh; overflow-y: auto;">
                            <div style="padding: 1rem; background: #fff3cd; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #ff9800;">
                                <h4 style="margin: 0 0 0.5rem 0; color: #856404;">⚠️ Hours Exceed Allocation</h4>
                                <p style="margin: 0; color: #856404;">
                                    <strong>Allocated:</strong> ${allocatedHours}h<br>
                                    <strong>Already Logged:</strong> ${totalHours}h<br>
                                    <strong>Trying to Add:</strong> ${hours}h<br>
                                    <strong>Exceeds by:</strong> ${exceededBy.toFixed(2)}h
                                </p>
                            </div>
                            
                            <form id="requestTimeForm" onsubmit="event.preventDefault(); submitAdditionalTimeRequest();">
                                <input type="hidden" id="reqProjectId" value="${projectId}">
                                <input type="hidden" id="reqDate" value="${date}">
                                <input type="hidden" id="reqHours" value="${hours}">
                                <input type="hidden" id="reqDescription" value="${description}">
                                
                                <div class="form-group" style="margin-bottom: 1rem;">
                                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Additional Hours Requested <span style="color: red;">*</span></label>
                                    <input type="number" id="requestedHours" class="form-control" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;"
                                           min="${exceededBy.toFixed(2)}" step="0.5" 
                                           value="${Math.ceil(exceededBy)}" required>
                                    <small style="color: #666;">Minimum: ${exceededBy.toFixed(2)}h (amount exceeded)</small>
                                </div>
                                
                                <div class="form-group" style="margin-bottom: 1rem;">
                                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Reason for Additional Time <span style="color: red;">*</span></label>
                                    <textarea id="requestReason" class="form-control" rows="5" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; resize: vertical;"
                                              placeholder="Explain why additional time is needed..." required></textarea>
                                    <small style="color: #666;">Be specific: scope changes, unforeseen complexity, design revisions, etc.</small>
                                </div>
                                
                                <div class="form-group" style="margin-bottom: 1rem;">
                                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                        <input type="checkbox" id="requestSaveTimesheet" checked> 
                                        Save my timesheet entry for after approval
                                    </label>
                                    <small style="display: block; margin-top: 0.5rem; color: #666;">
                                        If checked, your ${hours}h entry will be saved once COO approves the additional time.
                                    </small>
                                </div>
                            </form>
                        </div>
                        
                        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 0.5rem;">
                            <button type="button" onclick="closeRequestTimeModal()" class="btn btn-outline" style="padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; border: 1px solid #ddd; background: white;">Cancel</button>
                            <button type="button" onclick="submitAdditionalTimeRequest()" class="btn btn-primary" style="padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; background: #1e40af; color: white; border: none; font-weight: 600;">
                                Submit Request to COO
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            document.body.classList.add('modal-open');
        };
        
        window.closeRequestTimeModal = function() {
            const modal = document.getElementById('requestTimeModalOverlay');
            if (modal) modal.remove();
            document.body.classList.remove('modal-open');
        };
        
        window.submitAdditionalTimeRequest = async function() {
            console.log('📤 submitAdditionalTimeRequest called');
            
            const projectId = document.getElementById('reqProjectId')?.value;
            const requestedHours = parseFloat(document.getElementById('requestedHours')?.value);
            const reason = document.getElementById('requestReason')?.value?.trim();
            const saveTimesheet = document.getElementById('requestSaveTimesheet')?.checked;
            const pendingDate = document.getElementById('reqDate')?.value;
            const pendingHours = parseFloat(document.getElementById('reqHours')?.value);
            const pendingDescription = document.getElementById('reqDescription')?.value;
            
            console.log('📝 Request data:', { projectId, requestedHours, reason, saveTimesheet });
            
            if (!requestedHours || requestedHours <= 0) {
                alert('Please enter valid hours');
                return;
            }
            
            if (!reason || reason.length < 20) {
                alert('Please provide a detailed reason (at least 20 characters)');
                return;
            }
            
            try {
                showLoading();
                
                const response = await apiCall('time-requests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        projectId,
                        requestedHours,
                        reason,
                        saveTimesheet,
                        pendingTimesheet: saveTimesheet ? {
                            date: pendingDate,
                            hours: pendingHours,
                            description: pendingDescription
                        } : null
                    })
                });
                
                console.log('📥 API Response:', response);
                
                if (response.success) {
                    closeRequestTimeModal();
                    alert(`✅ Request Submitted!\n\nYour request for ${requestedHours} additional hours has been submitted to the COO for review.${saveTimesheet ? '\n\nYour timesheet entry will be saved once approved.' : ''}`);
                    
                    // Refresh the allocations view
                    if (typeof showDesignerAllocations === 'function') {
                        showDesignerAllocations();
                    }
                } else {
                    throw new Error(response.error || 'Failed to submit request');
                }
                
            } catch (error) {
                console.error('❌ Error submitting time request:', error);
                alert('Error: ' + error.message);
            } finally {
                hideLoading();
            }
        };
        
        console.log('✅ Additional Time Request functions registered');
        
        // Also make showProjectFilesModal globally available
        window.showProjectFilesModal = window.showProjectFilesModal || async function(projectId, projectName) {
            console.log('🔄 showProjectFilesModal called for:', projectId, projectName);
            // This function is defined earlier in the file, so it should be available
            if (typeof showProjectFilesModal === 'function') {
                showProjectFilesModal(projectId, projectName);
            }
        };
        
        // Helper function for timesheet allocation info
        window.updateTimesheetAllocationInfo = function() {
            const projectSelect = document.getElementById('timesheetProjectId');
            const hoursInput = document.getElementById('timesheetHours');
            const infoDiv = document.getElementById('timesheetAllocationInfo');
            const warningDiv = document.getElementById('timesheetWarning');
            const warningText = document.getElementById('timesheetWarningText');
            
            if (!projectSelect || !projectSelect.value) {
                if (infoDiv) infoDiv.style.display = 'none';
                if (warningDiv) warningDiv.style.display = 'none';
                return;
            }
            
            const selectedOption = projectSelect.options[projectSelect.selectedIndex];
            const allocated = parseFloat(selectedOption.dataset.allocated) || 0;
            const logged = parseFloat(selectedOption.dataset.logged) || 0;
            const remaining = allocated - logged;
            const hoursToAdd = parseFloat(hoursInput.value) || 0;
            const newTotal = logged + hoursToAdd;
            
            document.getElementById('timesheetCurrentHours').textContent = logged.toFixed(2) + 'h';
            document.getElementById('timesheetAllocatedHours').textContent = allocated.toFixed(2) + 'h';
            document.getElementById('timesheetRemainingHours').textContent = remaining.toFixed(2) + 'h';
            document.getElementById('timesheetRemainingHours').style.color = 
                remaining < 5 ? '#f44336' : '#4CAF50';
            
            infoDiv.style.display = 'block';
            
            // Show warning if exceeding allocation
            if (hoursToAdd > 0 && newTotal > allocated && allocated > 0) {
                const exceeded = newTotal - allocated;
                warningText.textContent = `Adding ${hoursToAdd}h will exceed allocation by ${exceeded.toFixed(2)}h. You'll need to request additional time from COO.`;
                warningDiv.style.display = 'block';
            } else {
                warningDiv.style.display = 'none';
            }
        };
        
        console.log('✅ All designer functions implemented directly');
        
        // ============================================
        // ✅ COO TIME REQUEST FUNCTIONS
        // ============================================
        
        window.showCOOTimeRequests = async function() {
            console.log('🔄 showCOOTimeRequests called');
            
            const userRole = (typeof currentUserRole !== 'undefined' && currentUserRole) ? currentUserRole.trim().toLowerCase() : '';
            console.log('User role:', userRole);
            
            if (!['coo', 'director'].includes(userRole)) {
                alert('Access denied. COO/Director only. Your role: ' + userRole);
                return;
            }
            
            try {
                showLoading();
                setActiveNav('nav-time-requests');
                
                const response = await apiCall('time-requests?status=pending');
                console.log('📥 Time requests response:', response);
                
                if (!response.success) {
                    throw new Error('Failed to load time requests');
                }
                
                const requests = response.data || [];
                
                let requestsHtml = '';
                
                if (requests.length === 0) {
                    requestsHtml = `
                        <div style="text-align: center; padding: 3rem; color: #666;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                            <h3>All Caught Up!</h3>
                            <p>No pending time requests to review.</p>
                        </div>
                    `;
                } else {
                    requestsHtml = requests.map(req => `
                        <div class="card" style="margin-bottom: 1.5rem; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <div style="padding: 1.5rem;">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                                    <div>
                                        <h3 style="margin: 0 0 0.25rem 0;">${req.projectName || 'Unknown Project'}</h3>
                                        <small style="color: #666;">${req.projectCode || 'N/A'} - ${req.clientCompany || 'N/A'}</small>
                                    </div>
                                    <span style="background: #ff9800; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem;">Pending Review</span>
                                </div>
                                
                                <div style="margin: 1rem 0; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                                        <div>
                                            <small style="color: #666;">Requested By</small>
                                            <div style="font-weight: 600;">${req.designerName || 'Unknown'}</div>
                                        </div>
                                        <div>
                                            <small style="color: #666;">Additional Hours</small>
                                            <div style="font-weight: 600; color: #2196F3; font-size: 1.2rem;">${req.requestedHours || 0}h</div>
                                        </div>
                                        <div>
                                            <small style="color: #666;">Current Usage</small>
                                            <div style="font-weight: 600;">${req.currentHoursLogged || 0}h / ${req.currentAllocatedHours || 0}h</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="margin: 1rem 0;">
                                    <strong>Reason for Additional Time:</strong>
                                    <p style="margin: 0.5rem 0; padding: 1rem; background: #fff; border-left: 3px solid #2196F3; color: #555;">
                                        ${req.reason || 'No reason provided'}
                                    </p>
                                </div>
                                
                                <div style="margin: 1rem 0;">
                                    <small style="color: #666;">
                                        Submitted: ${req.createdAt ? new Date(req.createdAt.seconds ? req.createdAt.seconds * 1000 : req.createdAt).toLocaleString() : 'N/A'}
                                    </small>
                                </div>
                                
                                <div style="display: flex; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #ddd;">
                                    <button onclick="approveTimeRequest('${req.id}', ${req.requestedHours || 0})" 
                                            style="flex: 1; padding: 0.75rem 1rem; border-radius: 8px; border: none; background: #10b981; color: white; cursor: pointer; font-weight: 600;">
                                        ✅ Approve ${req.requestedHours || 0}h
                                    </button>
                                    <button onclick="showRejectTimeRequestModal('${req.id}')" 
                                            style="flex: 1; padding: 0.75rem 1rem; border-radius: 8px; border: none; background: #ef4444; color: white; cursor: pointer; font-weight: 600;">
                                        ❌ Reject
                                    </button>
                                    <button onclick="showRequestInfoModal('${req.id}')" 
                                            style="padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #ddd; background: white; cursor: pointer;">
                                        💬 Request Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('');
                }
                
                const mainContent = document.getElementById('mainContent');
                mainContent.style.display = 'block';
                mainContent.innerHTML = `
                    <div class="page-header">
                        <h2>⏱️ Additional Time Requests</h2>
                        <p class="subtitle">Review and approve/reject designer requests for additional hours</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                        <div style="background: white; padding: 1.5rem; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <div style="font-size: 2rem; font-weight: 700; color: #ff9800;">${requests.length}</div>
                            <div style="color: #666;">Pending Requests</div>
                        </div>
                    </div>
                    
                    <div class="requests-list">
                        ${requestsHtml}
                    </div>
                `;
                
            } catch (error) {
                console.error('❌ Error loading time requests:', error);
                const mainContent = document.getElementById('mainContent');
                mainContent.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: #ef4444;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                        <h3>Error Loading Time Requests</h3>
                        <p>${error.message}</p>
                        <button onclick="showCOOTimeRequests()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; border-radius: 8px; border: none; background: #1e40af; color: white; cursor: pointer;">
                            🔄 Retry
                        </button>
                    </div>
                `;
            } finally {
                hideLoading();
            }
        };
        
        window.approveTimeRequest = async function(requestId, hours) {
            console.log('✅ approveTimeRequest called', { requestId, hours });
            
            const comment = prompt(`Approve ${hours}h additional time?\n\nOptional comment for designer:`);
            
            if (comment === null) return; // User cancelled
            
            try {
                showLoading();
                
                const response = await apiCall(`time-requests?id=${requestId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'approve',
                        approvedHours: hours,
                        comment: comment || 'Approved',
                        applyToTimesheet: true
                    })
                });
                
                console.log('📥 Approve response:', response);
                
                if (response.success) {
                    alert(`✅ Approved ${hours}h additional time!`);
                    showCOOTimeRequests(); // Refresh list
                } else {
                    throw new Error(response.error || 'Failed to approve');
                }
                
            } catch (error) {
                console.error('❌ Error approving:', error);
                alert('Error: ' + error.message);
            } finally {
                hideLoading();
            }
        };
        
        window.showRejectTimeRequestModal = function(requestId) {
            console.log('🔄 showRejectTimeRequestModal called', requestId);
            closeAllModals();
            
            const modalHtml = `
                <div class="modal-overlay" id="rejectModalOverlay" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center;" onclick="if(event.target.id === 'rejectModalOverlay') { this.remove(); document.body.classList.remove('modal-open'); }">
                    <div class="modal-content" style="max-width: 500px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                        <div class="modal-header" style="padding: 1.5rem; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white;">
                            <h2 style="margin: 0;">❌ Reject Time Request</h2>
                        </div>
                        
                        <div class="modal-body" style="padding: 1.5rem;">
                            <input type="hidden" id="rejectRequestId" value="${requestId}">
                            
                            <div style="margin-bottom: 1rem;">
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Reason for Rejection <span style="color: red;">*</span></label>
                                <textarea id="rejectComment" rows="4" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; resize: vertical; box-sizing: border-box;"
                                          placeholder="Please explain why this request is being rejected..."></textarea>
                                <small style="color: #666;">Minimum 10 characters</small>
                            </div>
                        </div>
                        
                        <div style="padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 0.5rem;">
                            <button type="button" onclick="document.getElementById('rejectModalOverlay').remove(); document.body.classList.remove('modal-open');" style="padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; border: 1px solid #ddd; background: white;">Cancel</button>
                            <button type="button" onclick="submitRejectTimeRequest()" style="padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; background: #dc2626; color: white; border: none; font-weight: 600;">
                                Reject Request
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            document.body.classList.add('modal-open');
        };
        
        window.submitRejectTimeRequest = async function() {
            console.log('📤 submitRejectTimeRequest called');
            
            const requestId = document.getElementById('rejectRequestId')?.value;
            const comment = document.getElementById('rejectComment')?.value?.trim();
            
            if (!comment || comment.length < 10) {
                alert('Please provide a detailed reason for rejection (at least 10 characters)');
                return;
            }
            
            try {
                showLoading();
                
                const response = await apiCall(`time-requests?id=${requestId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'reject',
                        comment: comment
                    })
                });
                
                console.log('📥 Reject response:', response);
                
                if (response.success) {
                    document.getElementById('rejectModalOverlay')?.remove();
                    document.body.classList.remove('modal-open');
                    alert('❌ Request rejected');
                    showCOOTimeRequests(); // Refresh list
                } else {
                    throw new Error(response.error || 'Failed to reject');
                }
                
            } catch (error) {
                console.error('❌ Error rejecting:', error);
                alert('Error: ' + error.message);
            } finally {
                hideLoading();
            }
        };
        
        window.showRequestInfoModal = function(requestId) {
            const info = prompt('Enter message to request more information from designer:');
            if (info && info.trim()) {
                alert('Request for info feature coming soon.\n\nYour message: ' + info);
            }
        };
        
        console.log('✅ COO Time Request functions registered');
    </script>

    <div id="cooProjectNumberSection" style="display: none;">
        <div class="page-header">
            <h2>Pricing & Project Number Management</h2>
            <p class="subtitle">Review pricing and assign project numbers</p>
        </div>
        <div class="filters-bar">
            <select id="projectNumberFilter" class="filter-select" onchange="filterProjectNumberProposals()">
                <option value="all">All Proposals</option>
                <option value="needs_number">Needs Project Number</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>
        <div class="card">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Client</th>
                        <th>BDM</th>
                        <th>Quote Value</th>
                        <th>Project Number</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="projectNumberTableBody">
                    <tr>
                        <td colspan="7" class="text-center">Loading...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div id="projectNumberModal" class="modal" style="display: none;">
        <div class="modal-content new-modal">
            <div class="modal-header">
                <h2>Set Project Number</h2>
                <span class="close-modal" onclick="closeProjectNumberModal()">&times;</span>
            </div>
            <div class="modal-body">
                <input type="hidden" id="pnProposalId" />
                <div class="info-section">
                    <h4 id="pnProjectName"></h4>
                    <p><strong>Client:</strong> <span id="pnClientName"></span></p>
                    <p><strong>BDM:</strong> <span id="pnBdmName"></span></p>
                    <p><strong>Quote Value:</strong> <span id="pnQuoteValue"></span></p>
                </div>
                <div class="form-group">
                    <label for="projectNumberInput">Project Number <span class="required">*</span></label>
                    <input type="text" id="projectNumberInput" class="form-control" placeholder="e.g., ABC25-001"
                        required />
                    <small class="form-text">Enter a unique project number for tracking</small>
                </div>
                <div class="warning-message">
                    <strong>Note:</strong> This project number will be sent to the Director for approval before being
                    finalized.
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" onclick="closeProjectNumberModal()">Cancel</button>
                <button type="button" class="btn btn-primary" onclick="submitProjectNumber()">Save & Submit for
                    Approval</button>
            </div>
        </div>
    </div>
    <div id="directorApprovalSection" style="display: none;">
        <div class="page-header">
            <h2>Project Number Approvals</h2>
            <p class="subtitle">Review and approve project numbers set by COO</p>
        </div>
        <div class="card">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Client</th>
                        <th>Project Number</th>
                        <th>Set By</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="approvalTableBody">
                    <tr>
                        <td colspan="6" class="text-center">Loading...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div id="rejectionReasonModal" class="modal" style="display: none;">
        <div class="modal-content new-modal">
            <div class="modal-header">
                <h2>Reject Project Number</h2>
                <span class="close-modal" onclick="closeRejectionModal()">&times;</span>
            </div>
            <div class="modal-body">
                <input type="hidden" id="rejectProposalId" />
                <input type="hidden" id="rejectProjectNumber" />
                <p>You are about to reject project number: <strong id="rejectProjectNumberDisplay"></strong></p>
                <div class="form-group">
                    <label for="rejectionReason">Reason for Rejection <span class="required">*</span></label>
                    <textarea id="rejectionReason" class="form-control" rows="4"
                        placeholder="Please provide a reason for rejection..." required></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" onclick="closeRejectionModal()">Cancel</button>
                <button type="button" class="btn btn-danger" onclick="confirmRejection()">Reject</button>
            </div>
        </div>
    </div>
    <div id="allocationSection" style="display: none;">
        <div class="page-header">
            <h2>Allocate Won Projects</h2>
            <p class="subtitle">Assign won projects to Design Managers</p>
        </div>
        <div class="card">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Client</th>
                        <th>BDM</th>
                        <th>Value</th>
                        <th>Project Number</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="allocationProposalsTableBody">
                    <tr>
                        <td colspan="7" class="text-center">Loading...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div id="allocationModal" class="modal" style="display: none;">
        <div class="modal-content new-modal allocation-modal-large">
            <div class="modal-header">
                <h2>Allocate Project to Design Manager</h2>
                <span class="close-modal" onclick="closeAllocationModal()">&times;</span>
            </div>
            <div class="modal-body">
                <input type="hidden" id="allocationProposalId" />
                <div class="allocation-details-section">
                    <h3>Project Details</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <label>Project Name:</label>
                            <span id="allocProjectName" class="detail-value"></span>
                        </div>
                        <div class="detail-item">
                            <label>Client:</label>
                            <span id="allocClientName" class="detail-value"></span>
                        </div>
                        <div class="detail-item">
                            <label>BDM:</label>
                            <span id="allocBdmName" class="detail-value"></span>
                        </div>
                        <div class="detail-item">
                            <label>Quote Value:</label>
                            <span id="allocQuoteValue" class="detail-value"></span>
                        </div>
                        <div class="detail-item highlight">
                            <label>Project Number:</label>
                            <span id="allocProjectNumber" class="detail-value project-number-badge"></span>
                        </div>
                        <div class="detail-item">
                            <label>Location:</label>
                            <span id="allocLocation" class="detail-value"></span>
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <h3>Allocation Details</h3>
                    <div class="form-group">
                        <label for="allocDesignLead">Design Manager / Lead <span class="required">*</span></label>
                        <select id="allocDesignLead" class="form-control" required>
                            <option value="">-- Select Design Manager --</option>
                        </select>
                        <small class="form-text">Select the Design Manager who will oversee this project</small>
                    </div>
                    <div class="form-group">
                        <label for="allocationComments3">Allocation Comments</label>
                        <textarea id="allocationComments3" class="form-control" rows="4"
                            placeholder="Add any special instructions, priorities, or notes for the Design Manager..."></textarea>
                        <small class="form-text">These comments will be visible to the Design Manager</small>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" onclick="closeAllocationModal()">Cancel</button>
                <button type="button" class="btn btn-primary btn-large" onclick="submitProposalAllocation()">
                    <span class="btn-icon">✓</span> Allocate Project
                </button>
            </div>
        </div>
    </div>
    <div id="allocatedProjectsSection" style="display: none;">
        <div class="page-header">
            <h2>My Allocated Projects</h2>
            <p class="subtitle">Projects assigned to you by management</p>
        </div>
        <div class="card">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Project #</th>
                        <th>Project Name</th>
                        <th>Client</th>
                        <th>Allocated By</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="allocatedProjectsTableBody">
                    <tr>
                        <td colspan="7" class="text-center">Loading...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    
    <div id="designerAssignmentModal" class="modal" style="display: none;">
        <div class="modal-content new-modal" style="max-width: 800px;">
            <div class="modal-header">
                <h2>👥 Assign Designers to Project</h2>
                <span class="close-modal" onclick="closeDesignerAssignmentModal()">&times;</span>
            </div>
            <div class="modal-body">
                <input type="hidden" id="assignProjectId" />
                
                <!-- Project Hours Summary -->
                <div id="projectHoursSummary" style="background: #E8F5E9; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; display: none;">
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; text-align: center;">
                        <div>
                            <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.3rem;">Max Hours</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-blue);" id="displayMaxHours">0</div>
                        </div>
                        <div>
                            <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.3rem;">Additional</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning);" id="displayAdditionalHours">0</div>
                        </div>
                        <div>
                            <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.3rem;">Total Available</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);" id="displayTotalHours">0</div>
                        </div>
                        <div>
                            <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 0.3rem;">Remaining</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--danger);" id="displayRemainingHours">0</div>
                        </div>
                    </div>
                </div>
                
                <!-- Designer Assignment List -->
                <div class="form-group">
                    <label style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; display: block;">
                        Assign Designers & Hours <span class="required">*</span>
                    </label>
                    <div id="designersList" style="max-height: 400px; overflow-y: auto;">
                        <!-- Will be populated by JavaScript -->
                    </div>
                    <small class="form-text" style="display: block; margin-top: 0.5rem;">
                        💡 Select designers and allocate hours to each. Total allocated hours cannot exceed available hours.
                    </small>
                </div>
                
                <!-- Allocated Hours Summary -->
                <div style="background: #FFF3E0; padding: 1rem; border-radius: 8px; margin-top: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600;">Total Hours Allocated:</span>
                        <span style="font-size: 1.5rem; font-weight: 700; color: var(--primary-blue);" id="totalAllocatedHours">0</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" onclick="closeDesignerAssignmentModal()">Cancel</button>
                <button type="button" class="btn btn-primary" onclick="submitDesignerAssignment()">
                    ✅ Assign Designers
                </button>
            </div>
        </div>
    </div>

    <div id="bdmFilesModal" class="modal" style="display: none;">
        <div class="modal-content new-modal">
            <div class="modal-header">
                <h2>BDM Uploaded Files</h2>
                <span class="close-modal" onclick="closeBDMFilesModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div id="bdmFilesList" class="files-list">
                    </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="closeBDMFilesModal()">Close</button>
            </div>
        </div>
    </div>

    <div id="successModal" class="modal" style="display: none;">
        <div class="modal-content new-modal modal-success">
            <div class="modal-body text-center">
                <div class="success-icon">✓</div>
                <h3 id="successMessage">Operation Successful!</h3>
                <p id="successDetails"></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="closeSuccessModal()">OK</button>
            </div>
        </div>
    </div>


    <div id="addVariationModal" class="modal" style="display: none;">
        <div class="modal-content new-modal" style="max-width: 700px;">
            <div class="modal-header">
                <h2>➕ Add Variation for Approval</h2>
                <span class="close-modal" onclick="closeAddVariationModal()">&times;</span>
            </div>
            <div class="modal-body">
                <input type="hidden" id="variationParentProjectId" />
                
                <div class="info-section" style="background: var(--light-blue); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                    <h4 style="color: var(--primary-blue);">Parent Project</h4>
                    <p style="margin: 0;"><strong>Project:</strong> <span id="variationParentProjectName"></span></p>
                    <p style="margin: 0;"><strong>Code:</strong> <span id="variationParentProjectCode"></span></p>
                </div>
                
                <form id="addVariationForm">
                    <div class="form-group">
                        <label for="variationCode">Variation Code <span class="required">*</span></label>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <input type="text" id="variationCode" class="form-control" placeholder="e.g., STE25-513-V1" required>
                            <button type="button" onclick="generateVariationCode()" class="btn btn-outline" style="width: auto; white-space: nowrap;">
                                Generate
                            </button>
                        </div>
                        <small class="form-text">A unique code for this variation.</small>
                    </div>

                    <div class="form-group">
                        <label for="variationHours">Variation Hours <span class="required">*</span></label>
                        <input type="number" id="variationHours" class="form-control" step="0.5" min="0.5" placeholder="Enter estimated hours for this variation" required>
                        <small class="form-text">Estimated hours required to complete this variation.</small>
                    </div>

                    <div class="form-group">
                        <label for="variationScope">Scope of Work / Description <span class="required">*</span></label>
                        <textarea id="variationScope" class="form-control" rows="5" placeholder="Describe the work required for this variation. This will be sent to the COO for approval." required></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" onclick="closeAddVariationModal()">Cancel</button>
                <button type="button" class="btn btn-success" onclick="submitVariationForApproval()">
                    Submit for COO Approval
                </button>
            </div>
        </div>
    </div>
    <div id="variationApprovalModal" class="modal" style="display: none;">
        <div class="modal-content new-modal" style="max-width: 800px;">
            <div class="modal-header">
                <h2>🔍 Review Variation Request</h2>
                <span class="close-modal" onclick="closeModal()">&times;</span>
            </div>
            <div class="modal-body">
                <input type="hidden" id="approvalVariationId" />
                <input type="hidden" id="approvalParentProjectId" />

                <div class="allocation-details-section">
                    <h3>Variation Details</h3>
                    <div class="details-grid">
                        <div class="detail-item">
                            <label>Parent Project:</label>
                            <span id="app-parentProjectName" class="detail-value"></span>
                        </div>
                        <div class="detail-item">
                            <label>Client:</label>
                            <span id="app-clientCompany" class="detail-value"></span>
                        </div>
                        <div class="detail-item highlight">
                            <label>Variation Code:</label>
                            <span id="app-variationCode" class="detail-value project-number-badge" style="background: var(--warning); color: #856404;"></span>
                        </div>
                        <div class="detail-item highlight">
                            <label>Requested Hours:</label>
                            <span id="app-estimatedHours" class="detail-value" style="font-size: 1.5rem; color: var(--primary-blue);"></span>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <label>Submitted By:</label>
                            <span id="app-submittedBy" class="detail-value"></span>
                        </div>
                        <div class="detail-item" style="grid-column: 1 / -1; background: white; padding: 1rem; border-radius: 8px;">
                            <label>Scope of Work:</label>
                            <p id="app-scopeDescription" class="detail-value" style="line-height: 1.6; white-space: pre-wrap;"></p>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Approval Decision</h3>
                    <div class="form-group">
                        <label for="approvalNotes">Notes (Required for Rejection)</label>
                        <textarea id="approvalNotes" class="form-control" rows="4" placeholder="Add approval notes or a reason for rejection..."></textarea>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="button" class="btn btn-danger" style="margin-right: auto;" onclick="submitVariationApproval('rejected')">
                    ❌ Reject
                </button>
                <button type="button" class="btn btn-success btn-large" onclick="submitVariationApproval('approved')">
                    ✅ Approve Variation
                </button>
            </div>
        </div>
    </div>


<!-- ============================================ -->
<!-- STEP 2: ADD THESE SECTIONS BEFORE </body> -->
<!-- Paste these complete sections -->
<!-- ============================================ -->

<!-- EXECUTIVE MONITORING SECTION -->
<div id="executiveTimesheetMonitoring" style="display: none;">
    <div class="page-header">
        <h2>📊 Executive Timesheet Monitoring</h2>
        <p class="subtitle">Advanced analytics and insights for project hours management</p>
    </div>

    <!-- Top Level Metrics -->
    <div id="executiveMetrics" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <!-- Populated by JavaScript -->
    </div>

    <!-- Date Range Selector -->
    <div class="card" style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                <div>
                    <label style="font-size: 0.85rem; color: var(--text-light); display: block; margin-bottom: 0.25rem;">From Date:</label>
                    <input type="date" id="executiveFromDate" class="form-control" style="width: auto;">
                </div>
                <div>
                    <label style="font-size: 0.85rem; color: var(--text-light); display: block; margin-bottom: 0.25rem;">To Date:</label>
                    <input type="date" id="executiveToDate" class="form-control" style="width: auto;">
                </div>
                <button onclick="applyExecutiveDateFilter()" class="btn btn-primary" style="margin-top: 1.5rem;">
                    Apply Filter
                </button>
                <button onclick="resetExecutiveDateFilter()" class="btn btn-outline" style="margin-top: 1.5rem;">
                    Reset
                </button>
            </div>
            
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="exportExecutiveReport('summary')" class="btn btn-outline">
                    📊 Export Summary
                </button>
                <button onclick="exportExecutiveReport('detailed')" class="btn btn-outline">
                    📋 Export Detailed
                </button>
            </div>
        </div>
    </div>

    <!-- Quick Stats Row -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div class="stat-card">
            <div class="stat-label">Active Projects</div>
            <div class="stat-value" id="execActiveProjects">0</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Total Designers</div>
            <div class="stat-value" id="execTotalDesigners">0</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Timesheet Entries</div>
            <div class="stat-value" id="execTotalEntries">0</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Avg Hours/Project</div>
            <div class="stat-value" id="execAvgHours">0</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Efficiency Rate</div>
            <div class="stat-value" id="execEfficiency">0%</div>
        </div>
    </div>

    <!-- Tabs for Different Views -->
    <div class="tabs-container" style="margin-bottom: 1.5rem;">
        <div class="tabs">
            <div class="tab active" onclick="switchExecutiveTab('overview')">Overview</div>
            <div class="tab" onclick="switchExecutiveTab('projects')">Projects</div>
            <div class="tab" onclick="switchExecutiveTab('designers')">Designers</div>
            <div class="tab" onclick="switchExecutiveTab('analytics')">Analytics</div>
            <div class="tab" onclick="switchExecutiveTab('alerts')">Alerts</div>
        </div>
    </div>

    <!-- Tab Content -->
    <div id="executiveTabContent">
        <!-- Content will be loaded dynamically -->
    </div>
</div>

<!-- TIMESHEET SECTION FOR DESIGNERS -->
<div id="timesheetSection" style="display: none;">
    <div class="page-header">
        <h2>⏱️ My Timesheet</h2>
        <p class="subtitle">Track your hours on assigned projects</p>
    </div>

    <div class="card">
        <div class="card-header">
            <h3>Log Hours</h3>
            <button onclick="showTimesheetModal()" class="btn btn-primary">
                <span class="btn-icon">+</span> Log Hours
            </button>
        </div>

        <!-- Timesheet Summary -->
        <div id="timesheetSummary" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; padding: 1rem;">
            <!-- Will be populated by JavaScript -->
        </div>
                            

        <!-- Timesheet Entries Table -->
        <table class="data-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Project</th>
                    <th>Hours</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="timesheetTableBody">
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem;">
                        No timesheet entries yet
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>


<!-- ============================================ -->
<!-- STEP 3: ADD THESE STYLES -->
<!-- Add to your <style> section -->
<!-- ============================================ -->

<style>
/* Executive Monitoring Styles */
.metric-card {
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    color: white;
}

.metric-icon {
    font-size: 2.5rem;
}

.metric-content {
    flex: 1;
}

.metric-label {
    font-size: 0.9rem;
    opacity: 0.9;
    margin-bottom: 0.5rem;
}

.metric-value {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
}

.metric-subtitle {
    font-size: 0.85rem;
    opacity: 0.8;
    margin-top: 0.5rem;
}

.stat-card {
    background: white;
    border: 2px solid var(--border);
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
}

.stat-label {
    font-size: 0.85rem;
    color: var(--text-light);
    margin-bottom: 0.5rem;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-blue);
}

.tabs-container {
    background: white;
    border-radius: 12px;
    border: 2px solid var(--border);
    overflow: hidden;
}

.tabs {
    display: flex;
    gap: 0;
}

.tab {
    flex: 1;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    font-weight: 600;
    color: var(--text-light);
    transition: all 0.2s;
    border-right: 1px solid var(--border);
}

.tab:last-child {
    border-right: none;
}

.tab:hover {
    background: var(--light-blue);
}

.tab.active {
    background: var(--primary-blue);
    color: white;
}

.project-card {
    transition: all 0.2s;
}

.project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-color: var(--primary-blue);
}

.hour-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: white;
    border-radius: 8px;
    border: 2px solid var(--border);
}

.hour-badge .label {
    color: var(--text-light);
    font-size: 0.85rem;
}

.hour-badge .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-blue);
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
}

.status-submitted {
    background: #fff3cd;
    color: #856404;
}

.status-approved {
    background: #d4edda;
    color: #155724;
}

.status-rejected {
    background: #f8d7da;
    color: #721c24;
}

.progress-bar-container {
    background: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
}
</style>


<!-- ============================================ -->
<!-- STEP 4: ADD THIS COMPLETE JAVASCRIPT -->
<!-- Add before closing </body> tag -->
<!-- ============================================ -->
<script>
    
// ===================================
// EXECUTIVE MONITORING JAVASCRIPT
// ===================================

let executiveData = {
    projects: [],
    timesheets: [],
    designers: [],
    dateRange: { from: null, to: null }
};

// Load executive monitoring dashboard
async function loadExecutiveMonitoring() {
    try {
        showLoading();
        
        const [projectsResponse, timesheetsResponse, usersResponse] = await Promise.all([
            apiCall('projects'),
            apiCall('timesheets'),
            apiCall('users?role=designer')
        ]);
        
        if (!projectsResponse.success || !timesheetsResponse.success || !usersResponse.success) {
            throw new Error('Failed to load monitoring data');
        }
        
        executiveData.projects = (projectsResponse.data || []).filter(p => p.allocatedHours && p.allocatedHours > 0);
        executiveData.timesheets = timesheetsResponse.data || [];
        executiveData.designers = usersResponse.data || [];
        
        calculateExecutiveMetrics();
        switchExecutiveTab('overview');
        
        hideLoading();
    } catch (error) {
        console.error('Error loading executive monitoring:', error);
        alert('Error loading monitoring dashboard: ' + error.message);
        hideLoading();
    }
}

// Calculate executive metrics
function calculateExecutiveMetrics() {
    const projects = executiveData.projects;
    const timesheets = executiveData.timesheets;
    
    const totalAllocated = projects.reduce((sum, p) => sum + (p.allocatedHours || 0), 0);
    const totalLogged = projects.reduce((sum, p) => sum + (p.hoursLogged || 0), 0);
    const totalRemaining = totalAllocated - totalLogged;
    const avgUtilization = totalAllocated > 0 ? (totalLogged / totalAllocated) * 100 : 0;
    
    const onTrack = projects.filter(p => {
        const usage = p.allocatedHours > 0 ? (p.hoursLogged / p.allocatedHours) * 100 : 0;
        return usage < 75;
    }).length;
    
    const atRisk = projects.filter(p => {
        const usage = p.allocatedHours > 0 ? (p.hoursLogged / p.allocatedHours) * 100 : 0;
        return usage >= 75 && usage < 90;
    }).length;
    
    const critical = projects.filter(p => {
        const usage = p.allocatedHours > 0 ? (p.hoursLogged / p.allocatedHours) * 100 : 0;
        return usage >= 90;
    }).length;
    
    const exceeded = projects.filter(p => {
        const usage = p.allocatedHours > 0 ? (p.hoursLogged / p.allocatedHours) * 100 : 0;
        return usage >= 100;
    }).length;
    
    const activeDesigners = new Set(timesheets.map(t => t.designerUid)).size;
    const avgHoursPerProject = projects.length > 0 ? totalLogged / projects.length : 0;
    const efficiency = totalAllocated > 0 ? (totalLogged / totalAllocated) * 100 : 0;
    
    const metricsHtml = `
        <div class="metric-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
                <div class="metric-label">Total Budget (Hours)</div>
                <div class="metric-value">${totalAllocated.toFixed(0)}h</div>
                <div class="metric-subtitle">${projects.length} active projects</div>
            </div>
        </div>
        
        <div class="metric-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <div class="metric-icon">⏱️</div>
            <div class="metric-content">
                <div class="metric-label">Hours Consumed</div>
                <div class="metric-value">${totalLogged.toFixed(0)}h</div>
                <div class="metric-subtitle">${avgUtilization.toFixed(1)}% utilization</div>
            </div>
        </div>
        
        <div class="metric-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            <div class="metric-icon">📊</div>
            <div class="metric-content">
                <div class="metric-label">Budget Remaining</div>
                <div class="metric-value">${totalRemaining.toFixed(0)}h</div>
                <div class="metric-subtitle">${((totalRemaining / totalAllocated) * 100).toFixed(1)}% available</div>
            </div>
        </div>
        
        <div class="metric-card" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
            <div class="metric-icon">⚠️</div>
            <div class="metric-content">
                <div class="metric-label">Project Health</div>
                <div class="metric-value" style="font-size: 1.2rem;">
                    🟢 ${onTrack} | 🟡 ${atRisk} | 🔴 ${critical}
                </div>
                <div class="metric-subtitle">${exceeded} exceeded budget</div>
            </div>
        </div>
    `;
    
    document.getElementById('executiveMetrics').innerHTML = metricsHtml;
    document.getElementById('execActiveProjects').textContent = projects.length;
    document.getElementById('execTotalDesigners').textContent = activeDesigners;
    document.getElementById('execTotalEntries').textContent = timesheets.length;
    document.getElementById('execAvgHours').textContent = avgHoursPerProject.toFixed(1) + 'h';
    document.getElementById('execEfficiency').textContent = efficiency.toFixed(1) + '%';
}

// Switch between tabs
function switchExecutiveTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event?.target?.classList.add('active');
    
    const contentDiv = document.getElementById('executiveTabContent');
    
    switch(tab) {
        case 'overview':
            contentDiv.innerHTML = generateOverviewContent();
            break;
        case 'projects':
            contentDiv.innerHTML = generateProjectsContent();
            break;
        case 'designers':
            contentDiv.innerHTML = generateDesignersContent();
            break;
        case 'analytics':
            contentDiv.innerHTML = generateAnalyticsContent();
            break;
        case 'alerts':
            contentDiv.innerHTML = generateAlertsContent();
            break;
    }
}

// Generate Overview Content
function generateOverviewContent() {
    const projects = executiveData.projects;
    const timesheets = executiveData.timesheets;
    
    const sortedProjects = [...projects].sort((a, b) => {
        const usageA = a.allocatedHours > 0 ? (a.hoursLogged / a.allocatedHours) * 100 : 0;
        const usageB = b.allocatedHours > 0 ? (b.hoursLogged / b.allocatedHours) * 100 : 0;
        return usageB - usageA;
    });
    
    const topProjects = sortedProjects.slice(0, 5);
    const recentTimesheets = [...timesheets].sort((a, b) => b.date.seconds - a.date.seconds).slice(0, 10);
    
    return `
        <div class="card">
            <div class="card-header">
                <h3>🎯 Project Health Matrix</h3>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Design Manager</th>
                        <th>Team Size</th>
                        <th style="text-align: center;">Budget</th>
                        <th style="text-align: center;">Used</th>
                        <th style="text-align: center;">Remaining</th>
                        <th style="text-align: center;">Usage %</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedProjects.map(project => {
                        const usage = project.allocatedHours > 0 ? (project.hoursLogged / project.allocatedHours) * 100 : 0;
                        const remaining = project.allocatedHours - project.hoursLogged;
                        let healthIcon, healthText, healthColor;
                        
                        if (usage >= 100) {
                            healthIcon = '🔴';
                            healthText = 'Exceeded';
                            healthColor = 'var(--danger)';
                        } else if (usage >= 90) {
                            healthIcon = '🔴';
                            healthText = 'Critical';
                            healthColor = 'var(--danger)';
                        } else if (usage >= 75) {
                            healthIcon = '🟡';
                            healthText = 'At Risk';
                            healthColor = 'var(--warning)';
                        } else {
                            healthIcon = '🟢';
                            healthText = 'Healthy';
                            healthColor = 'var(--success)';
                        }
                        
                        return `
                            <tr style="cursor: pointer;" onclick="viewProject('${project.id}')">
                                <td>
                                    <div style="font-weight: 600;">${project.projectName}</div>
                                    <div style="font-size: 0.85rem; color: var(--text-light);">${project.clientCompany}</div>
                                </td>
                                <td>${project.designLeadName || 'Unassigned'}</td>
                                <td>${project.assignedDesignerNames?.length || 0} designer(s)</td>
                                <td style="text-align: center; font-weight: 600;">${project.allocatedHours}h</td>
                                <td style="text-align: center; font-weight: 600; color: var(--primary-blue);">${project.hoursLogged.toFixed(1)}h</td>
                                <td style="text-align: center; font-weight: 600; color: ${remaining >= 0 ? 'var(--success)' : 'var(--danger)'};">${remaining.toFixed(1)}h</td>
                                <td style="text-align: center;">
                                    <strong style="color: ${healthColor};">${usage.toFixed(0)}%</strong>
                                </td>
                                <td>
                                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 600; color: ${healthColor};">
                                        ${healthIcon} ${healthText}
                                    </span>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Generate Projects Content (simplified)
function generateProjectsContent() {
    return generateOverviewContent(); // Reuse the overview table
}

// Generate Designers Content
function generateDesignersContent() {
    const timesheets = executiveData.timesheets;
    const designerStats = {};
    
    timesheets.forEach(entry => {
        if (!designerStats[entry.designerUid]) {
            designerStats[entry.designerUid] = {
                uid: entry.designerUid,
                name: entry.designerName,
                email: entry.designerEmail,
                totalHours: 0,
                projectCount: new Set(),
                entries: []
            };
        }
        
        designerStats[entry.designerUid].totalHours += entry.hours;
        designerStats[entry.designerUid].projectCount.add(entry.projectId);
        designerStats[entry.designerUid].entries.push(entry);
    });
    
    const designersArray = Object.values(designerStats).map(d => ({
        ...d,
        projectCount: d.projectCount.size,
        avgHoursPerProject: d.projectCount.size > 0 ? d.totalHours / d.projectCount.size : 0
    })).sort((a, b) => b.totalHours - a.totalHours);
    
    return `
        <div class="card">
            <div class="card-header">
                <h3>👥 Designer Performance</h3>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Designer</th>
                        <th style="text-align: center;">Total Hours</th>
                        <th style="text-align: center;">Projects</th>
                        <th style="text-align: center;">Avg Hours/Project</th>
                        <th style="text-align: center;">Entries</th>
                    </tr>
                </thead>
                <tbody>
                    ${designersArray.map(designer => `
                        <tr>
                            <td>
                                <div style="font-weight: 600;">${designer.name}</div>
                                <div style="font-size: 0.85rem; color: var(--text-light);">${designer.email}</div>
                            </td>
                            <td style="text-align: center; font-weight: 700; font-size: 1.1rem; color: var(--primary-blue);">${designer.totalHours.toFixed(1)}h</td>
                            <td style="text-align: center; font-weight: 600;">${designer.projectCount}</td>
                            <td style="text-align: center; font-weight: 600;">${designer.avgHoursPerProject.toFixed(1)}h</td>
                            <td style="text-align: center;">${designer.entries.length}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Generate Analytics Content (simplified)
function generateAnalyticsContent() {
    const projects = executiveData.projects;
    const totalAllocated = projects.reduce((sum, p) => sum + (p.allocatedHours || 0), 0);
    const totalLogged = projects.reduce((sum, p) => sum + (p.hoursLogged || 0), 0);
    
    return `
        <div class="card">
            <div class="card-header">
                <h3>📊 Budget Overview</h3>
            </div>
            <div style="padding: 2rem; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">
                    ${((totalLogged / totalAllocated) * 100).toFixed(0)}%
                </div>
                <div style="font-size: 1.2rem; color: var(--text-light); margin-bottom: 2rem;">
                    Budget Utilization
                </div>
                <div style="display: flex; justify-content: space-around; max-width: 600px; margin: 0 auto;">
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-light);">Allocated</div>
                        <div style="font-weight: 700; font-size: 1.5rem;">${totalAllocated.toFixed(0)}h</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-light);">Logged</div>
                        <div style="font-weight: 700; font-size: 1.5rem; color: var(--primary-blue);">${totalLogged.toFixed(0)}h</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85rem; color: var(--text-light);">Remaining</div>
                        <div style="font-weight: 700; font-size: 1.5rem; color: var(--success);">${(totalAllocated - totalLogged).toFixed(0)}h</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate Alerts Content
function generateAlertsContent() {
    const projects = executiveData.projects;
    const alerts = [];
    
    projects.forEach(project => {
        const usage = project.allocatedHours > 0 ? (project.hoursLogged / project.allocatedHours) * 100 : 0;
        const remaining = project.allocatedHours - project.hoursLogged;
        
        if (usage >= 100) {
            alerts.push({
                type: 'critical',
                icon: '🚨',
                title: 'Budget Exceeded',
                message: `Project "${project.projectName}" has exceeded its allocated hours by ${Math.abs(remaining).toFixed(1)} hours`,
                project: project
            });
        } else if (usage >= 90) {
            alerts.push({
                type: 'warning',
                icon: '⚠️',
                title: 'Critical Budget Usage',
                message: `Project "${project.projectName}" is at ${usage.toFixed(0)}% budget utilization with only ${remaining.toFixed(1)} hours remaining`,
                project: project
            });
        } else if (usage >= 75) {
            alerts.push({
                type: 'info',
                icon: '⚡',
                title: 'High Budget Usage',
                message: `Project "${project.projectName}" has used ${usage.toFixed(0)}% of allocated hours`,
                project: project
            });
        }
    });
    
    if (alerts.length === 0) {
        return `
            <div class="card">
                <div style="text-align: center; padding: 4rem; color: var(--text-light);">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
                    <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">All Clear!</div>
                    <div>No critical alerts at this time</div>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="card">
            <div class="card-header">
                <h3>🔔 Active Alerts (${alerts.length})</h3>
            </div>
            <div style="padding: 1rem;">
                ${alerts.map(alert => {
                    const bgColor = alert.type === 'critical' ? '#fee' : alert.type === 'warning' ? '#fff3cd' : '#e7f3ff';
                    const borderColor = alert.type === 'critical' ? 'var(--danger)' : alert.type === 'warning' ? 'var(--warning)' : 'var(--primary-blue)';
                    
                    return `
                        <div style="padding: 1.5rem; background: ${bgColor}; border-left: 4px solid ${borderColor}; border-radius: 8px; margin-bottom: 1rem; cursor: pointer;" onclick="viewProject('${alert.project.id}')">
                            <div style="display: flex; align-items: start; gap: 1rem;">
                                <div style="font-size: 2rem;">${alert.icon}</div>
                                <div style="flex: 1;">
                                    <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">${alert.title}</div>
                                    <div style="color: var(--text-dark); margin-bottom: 1rem;">${alert.message}</div>
                                    <div style="display: flex; gap: 2rem; font-size: 0.9rem;">
                                        <div>
                                            <span style="color: var(--text-light);">Design Manager:</span>
                                            <strong>${alert.project.designLeadName || 'Unassigned'}</strong>
                                        </div>
                                        <div>
                                            <span style="color: var(--text-light);">Client:</span>
                                            <strong>${alert.project.clientCompany}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Export executive reports
async function exportExecutiveReport(type) {
    try {
        showLoading();
        
        const projects = executiveData.projects;
        const timesheets = executiveData.timesheets;
        
        let csv = '';
        let filename = '';
        
        if (type === 'summary') {
            const totalAllocated = projects.reduce((sum, p) => sum + (p.allocatedHours || 0), 0);
            const totalLogged = projects.reduce((sum, p) => sum + (p.hoursLogged || 0), 0);
            
            csv = 'Executive Summary Report\n\n';
            csv += `Generated: ${new Date().toLocaleString()}\n\n`;
            csv += `Total Projects: ${projects.length}\n`;
            csv += `Total Hours Allocated: ${totalAllocated.toFixed(0)}\n`;
            csv += `Total Hours Logged: ${totalLogged.toFixed(0)}\n\n`;
            csv += 'Project,Client,Design Manager,Allocated,Logged,Remaining,Usage %,Status\n';
            
            projects.forEach(project => {
                const usage = project.allocatedHours > 0 ? (project.hoursLogged / project.allocatedHours) * 100 : 0;
                const remaining = project.allocatedHours - project.hoursLogged;
                const status = usage >= 90 ? 'Critical' : usage >= 75 ? 'At Risk' : 'Healthy';
                
                csv += `"${project.projectName}","${project.clientCompany}","${project.designLeadName || 'Unassigned'}",${project.allocatedHours},${project.hoursLogged.toFixed(1)},${remaining.toFixed(1)},${usage.toFixed(1)},${status}\n`;
            });
            
            filename = `Executive_Summary_${new Date().toISOString().split('T')[0]}.csv`;
        } else {
            csv = 'Detailed Hours Report\n\n';
            csv += `Generated: ${new Date().toLocaleString()}\n\n`;
            csv += 'Date,Project,Designer,Hours,Description\n';
            
            timesheets.forEach(entry => {
                const date = new Date(entry.date.seconds * 1000).toLocaleDateString();
                const description = (entry.description || '').replace(/,/g, ';');
                csv += `${date},"${entry.projectName}","${entry.designerName}",${entry.hours},"${description}"\n`;
            });
            
            filename = `Detailed_Report_${new Date().toISOString().split('T')[0]}.csv`;
        }
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        hideLoading();
        alert('Report exported successfully!');
        
    } catch (error) {
        console.error('Error exporting report:', error);
        alert('Error exporting report: ' + error.message);
        hideLoading();
    }
}

function applyExecutiveDateFilter() {
    const from = document.getElementById('executiveFromDate').value;
    const to = document.getElementById('executiveToDate').value;
    executiveData.dateRange = { from, to };
    calculateExecutiveMetrics();
    switchExecutiveTab('overview');
}

function resetExecutiveDateFilter() {
    document.getElementById('executiveFromDate').value = '';
    document.getElementById('executiveToDate').value = '';
    executiveData.dateRange = { from: null, to: null };
    calculateExecutiveMetrics();
    switchExecutiveTab('overview');
}

// ============================================
// COMPLETE TIMESHEET WITH ADDITIONAL TIME REQUEST SYSTEM
// Replace these functions in your index.html
// ============================================

/**
         * Show Timesheet Modal - Designer can log hours for assigned projects
         */
window.showTimesheetModalImpl = async function(projectId = null) {
            try {
                showLoading();
                
                // Fetch all projects
                const response = await apiCall('projects');
                if (!response.success) {
                    throw new Error('Failed to load projects');
                }
                
                const projects = response.data || [];
                // Filter for projects assigned to the current designer
                // FIX: robust check for designer UID in either property
                const assignedProjects = projects.filter(p => {
                    const inDesigners = p.assignedDesigners && p.assignedDesigners.includes(currentUser.uid);
                    const inUids = p.assignedDesignerUids && p.assignedDesignerUids.includes(currentUser.uid);
                    return inDesigners || inUids;
                });
                if (assignedProjects.length === 0) {
                    alert('You are not assigned to any projects yet.');
                    hideLoading();
                    return;
                }
                
                // Close any existing modals first
                closeAllModals();
                
                const modalHtml = `
                    <div class="modal-overlay" id="timesheetModalOverlay" onclick="handleModalOverlayClick(event, 'timesheetModalOverlay')">
                        <div class="modal-content" style="max-width: 600px;">
                            <div class="modal-header">
                                <h2>📋 Log Hours</h2>
                                <span class="close-modal" onclick="closeTimesheetModal()">&times;</span>
                            </div>
                            
                            <div class="modal-body">
                                <form id="timesheetForm" onsubmit="event.preventDefault(); submitTimesheet();">
                                    <div class="form-group">
                                        <label>Project <span class="required">*</span></label>
                                        <select id="timesheetProjectId" class="form-control" required>
                                            <option value="">Select a project...</option>
                                            ${assignedProjects.map(project => `
                                                <option value="${project.id}" 
                                                        data-allocated="${(project.maxAllocatedHours || 0) + (project.additionalHours || 0)}" 
                                                        data-logged="${project.hoursLogged || 0}">
                                                    ${project.projectName} - ${project.clientCompany}
                                                </option>
                                            `).join('')}
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label>Date <span class="required">*</span></label>
                                        <input type="date" id="timesheetDate" class="form-control" 
                                               max="${new Date().toISOString().split('T')[0]}" required>
                                    </div>

                                    <div class="form-group">
                                        <label>Hours <span class="required">*</span></label>
                                        <input type="number" id="timesheetHours" class="form-control" 
                                               min="0.25" max="24" step="0.25" required 
                                               placeholder="e.g., 8 or 2.5">
                                    </div>

                                    <div class="form-group">
                                        <label>Description <span class="required">*</span></label>
                                        <textarea id="timesheetDescription" class="form-control" rows="4" 
                                                  placeholder="Describe what you worked on..." required></textarea>
                                    </div>

                                    <div id="timesheetAllocationInfo" 
                                         style="display: none; padding: 1rem; background: #e3f2fd; 
                                                border-radius: 8px; margin-top: 1rem; border-left: 4px solid #2196F3;">
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                            <span>Hours Logged:</span>
                                            <strong id="timesheetCurrentHours">0h</strong>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                            <span>Hours Allocated:</span>
                                            <strong id="timesheetAllocatedHours">0h</strong>
                                        </div>
                                        <div style="display: flex; justify-content: space-between;">
                                            <span>Hours Remaining:</span>
                                            <strong id="timesheetRemainingHours" style="color: #4CAF50;">0h</strong>
                                        </div>
                                    </div>
                                    
                                    <div id="timesheetWarning" style="display: none; padding: 1rem; background: #fff3cd; 
                                         border-radius: 8px; margin-top: 1rem; border-left: 4px solid #ff9800; color: #856404;">
                                        <strong>⚠️ Warning:</strong> <span id="timesheetWarningText"></span>
                                    </div>
                                </form>
                            </div>
                            
                            <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 0.5rem;">
                                <button type="button" onclick="closeTimesheetModal()" class="btn btn-outline" style="padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; border: 1px solid #ddd; background: white;">Cancel</button>
                                <button type="button" onclick="console.log('Log Hours clicked'); submitTimesheet();" class="btn btn-success" style="padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; background: #10b981; color: white; border: none; font-weight: 600;">
                                    Log Hours
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                document.getElementById('timesheetDate').value = new Date().toISOString().split('T')[0];
                
                // Add change listener for project selection
                document.getElementById('timesheetProjectId').addEventListener('change', updateTimesheetAllocationInfo);
                document.getElementById('timesheetHours').addEventListener('input', updateTimesheetAllocationInfo);
                
                if (projectId) {
                    document.getElementById('timesheetProjectId').value = projectId;
                    updateTimesheetAllocationInfo();
                }
                
                hideLoading();
                
            } catch (error) {
                console.error('Error showing timesheet modal:', error);
                alert('Error loading timesheet form: ' + error.message);
                hideLoading();
            }
        }

/**
 * Update allocation information when project or hours change
 */
function updateTimesheetAllocationInfo() {
    const projectSelect = document.getElementById('timesheetProjectId');
    const hoursInput = document.getElementById('timesheetHours');
    const infoDiv = document.getElementById('timesheetAllocationInfo');
    const warningDiv = document.getElementById('timesheetWarning');
    const warningText = document.getElementById('timesheetWarningText');
    
    if (!projectSelect || !projectSelect.value) {
        infoDiv.style.display = 'none';
        warningDiv.style.display = 'none';
        return;
    }
    
    const selectedOption = projectSelect.options[projectSelect.selectedIndex];
    const allocated = parseFloat(selectedOption.dataset.allocated) || 0;
    const logged = parseFloat(selectedOption.dataset.logged) || 0;
    const remaining = allocated - logged;
    const hoursToAdd = parseFloat(hoursInput.value) || 0;
    const newTotal = logged + hoursToAdd;
    
    document.getElementById('timesheetCurrentHours').textContent = logged.toFixed(2) + 'h';
    document.getElementById('timesheetAllocatedHours').textContent = allocated.toFixed(2) + 'h';
    document.getElementById('timesheetRemainingHours').textContent = remaining.toFixed(2) + 'h';
    document.getElementById('timesheetRemainingHours').style.color = 
        remaining < 5 ? '#f44336' : '#4CAF50';
    
    infoDiv.style.display = 'block';
    
    // Show warning if exceeding allocation
    if (hoursToAdd > 0 && newTotal > allocated && allocated > 0) {
        const exceeded = newTotal - allocated;
        warningText.textContent = `Adding ${hoursToAdd}h will exceed allocation by ${exceeded.toFixed(2)}h. You'll need to request additional time from COO.`;
        warningDiv.style.display = 'block';
    } else {
        warningDiv.style.display = 'none';
    }
}

/**
         * Submit Timesheet Entry
         */
        window.submitTimesheet = async function() {
            const projectId = document.getElementById('timesheetProjectId').value;
            const date = document.getElementById('timesheetDate').value;
            const hours = parseFloat(document.getElementById('timesheetHours').value);
            const description = document.getElementById('timesheetDescription').value.trim();
            
            // Validation
            if (!projectId || !date || !hours || !description) {
                alert('Please fill all required fields');
                return;
            }
            
            if (hours <= 0 || hours > 24) {
                alert('Hours must be between 0.25 and 24');
                return;
            }

            // --- START: NEW FRONTEND ALLOCATION CHECK ---
            const projectSelect = document.getElementById('timesheetProjectId');
            if (projectSelect) {
                const selectedOption = projectSelect.options[projectSelect.selectedIndex];
                // Get allocation data from the dropdown option, which was set when the modal opened
                const allocated = parseFloat(selectedOption.dataset.allocated) || 0;
                const logged = parseFloat(selectedOption.dataset.logged) || 0;
                const newTotal = logged + hours;

                if (newTotal > allocated && allocated > 0) {
                    // Allocation exceeded. Manually trigger the "Request Time" flow without calling the API.
                    console.warn(`Frontend check: Allocation exceeded. ${newTotal} > ${allocated}. Triggering request modal.`);
                    
                    const allocationData = {
                        totalHours: logged, // Current hours logged
                        allocatedHours: allocated, // Total allocated budget
                        exceededBy: newTotal - allocated // How much it's over
                    };
                    const timesheetData = { projectId, date, hours, description };

                    closeTimesheetModal(); // Close the log hours modal
                    if (typeof showRequestAdditionalTimeModal === 'function') {
                        showRequestAdditionalTimeModal(allocationData, timesheetData); // Show the request modal
                    } else {
                        alert('You have exceeded your allocated hours. Please contact COO for additional time.');
                    }
                    
                    return; // Stop before calling the API
                }
            }
            // --- END: NEW FRONTEND ALLOCATION CHECK ---
            
            try {
                showLoading();
                
                const response = await apiCall('timesheets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId, date, hours, description })
                });
                
                if (response.success) {
                    closeTimesheetModal();
                    alert(`✅ ${hours} hours logged successfully for ${date}!`);
                    
                    // Refresh the designer allocations view
                    if (typeof showDesignerAllocations === 'function') {
                        showDesignerAllocations();
                    }
                    
                } else if (response.exceedsAllocation) {
                    // This is now a fallback in case the frontend check fails or data is stale
                    console.warn("Backend check: Allocation exceeded. This should have been caught by the frontend.");
                    hideLoading();
                    closeTimesheetModal();
                    if (typeof showRequestAdditionalTimeModal === 'function') {
                        showRequestAdditionalTimeModal(response, { projectId, date, hours, description });
                    } else {
                        alert('You have exceeded your allocated hours. Please contact COO for additional time.');
                    }
                    
                } else {
                    throw new Error(response.error || 'Failed to log hours');
                }
                
            } catch (error) {
                console.error('Error submitting timesheet:', error);
                alert('Error logging hours: ' + error.message);
            } finally {
                hideLoading();
            }
        };

/**
 * Show Request Additional Time Modal
 */
function showRequestAdditionalTimeModal(allocationData, timesheetData) {
    closeAllModals();
    
    const { totalHours, allocatedHours, exceededBy } = allocationData;
    const { projectId, date, hours, description } = timesheetData;
    
    const modalHtml = `
        <div class="modal-overlay" id="requestTimeModalOverlay" onclick="handleModalOverlayClick(event, 'requestTimeModalOverlay')">
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>⏱️ Request Additional Time</h2>
                    <span class="close-modal" onclick="closeRequestTimeModal()">&times;</span>
                </div>
                
                <div class="modal-body">
                    <div style="padding: 1rem; background: #fff3cd; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #ff9800;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #856404;">⚠️ Hours Exceed Allocation</h4>
                        <p style="margin: 0; color: #856404;">
                            <strong>Allocated:</strong> ${allocatedHours}h<br>
                            <strong>Already Logged:</strong> ${totalHours}h<br>
                            <strong>Trying to Add:</strong> ${hours}h<br>
                            <strong>Exceeds by:</strong> ${exceededBy.toFixed(2)}h
                        </p>
                    </div>
                    
                    <form id="requestTimeForm" onsubmit="event.preventDefault(); submitAdditionalTimeRequest();">
                        <input type="hidden" id="reqProjectId" value="${projectId}">
                        <input type="hidden" id="reqDate" value="${date}">
                        <input type="hidden" id="reqHours" value="${hours}">
                        <input type="hidden" id="reqDescription" value="${description}">
                        
                        <div class="form-group">
                            <label>Additional Hours Requested <span class="required">*</span></label>
                            <input type="number" id="requestedHours" class="form-control" 
                                   min="${exceededBy.toFixed(2)}" step="0.5" 
                                   value="${Math.ceil(exceededBy)}" required>
                            <small>Minimum: ${exceededBy.toFixed(2)}h (amount exceeded)</small>
                        </div>
                        
                        <div class="form-group">
                            <label>Reason for Additional Time <span class="required">*</span></label>
                            <textarea id="requestReason" class="form-control" rows="5" 
                                      placeholder="Explain why additional time is needed..." required></textarea>
                            <small>Be specific: scope changes, unforeseen complexity, design revisions, etc.</small>
                        </div>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="requestSaveTimesheet" checked> 
                                Save my timesheet entry for after approval
                            </label>
                            <small style="display: block; margin-top: 0.5rem;">
                                If checked, your ${hours}h entry will be saved once COO approves the additional time.
                            </small>
                        </div>
                    </form>
                </div>
                
                <div class="modal-footer">
                    <button type="button" onclick="closeRequestTimeModal()" class="btn btn-outline">Cancel</button>
                    <button type="button" onclick="submitAdditionalTimeRequest()" class="btn btn-primary">
                        Submit Request to COO
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * Submit Additional Time Request
 */
async function submitAdditionalTimeRequest() {
    const projectId = document.getElementById('reqProjectId').value;
    const requestedHours = parseFloat(document.getElementById('requestedHours').value);
    const reason = document.getElementById('requestReason').value.trim();
    const saveTimesheet = document.getElementById('requestSaveTimesheet').checked;
    
    if (!requestedHours || requestedHours <= 0) {
        alert('Please enter valid hours');
        return;
    }
    
    if (!reason || reason.length < 20) {
        alert('Please provide a detailed reason (at least 20 characters)');
        return;
    }
    
    try {
        showLoading();
        
        // Submit time request
        const response = await apiCall('time-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId,
                requestedHours,
                reason,
                timesheetId: saveTimesheet ? 'pending' : null,
                pendingTimesheetData: saveTimesheet ? {
                    date: document.getElementById('reqDate').value,
                    hours: parseFloat(document.getElementById('reqHours').value),
                    description: document.getElementById('reqDescription').value
                } : null
            })
        });
        
        if (response.success) {
            closeRequestTimeModal();
            alert(`✅ Request submitted successfully!\n\nRequested: ${requestedHours}h\nCOO will review your request shortly.`);

            // --- ADD THIS LINE ---
          triggerEmailNotification('time_request.created', {
          projectId: projectId,
           hours: requestedHours,
           reason: reason,
           designerName: currentUser.displayName // Assuming currentUser is global
    });
            
            // Show pending requests
            if (typeof showPendingTimeRequests === 'function') {
                showPendingTimeRequests();
            }
        } else {
            throw new Error(response.error || 'Failed to submit request');
        }
        
    } catch (error) {
        console.error('Error submitting time request:', error);
        alert('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

/**
 * Show Pending Time Requests (for designers)
 */
async function showPendingTimeRequests() {

/**
 * Direct Request Additional Time Modal (without exceeding timesheet context)
 * Called from Designer Allocations view when remaining hours are low
 */
window.showRequestTimeModalDirectImpl = function(projectId, projectName, allocatedHours, usedHours) {
    closeAllModals();
    
    const remaining = allocatedHours - usedHours;
    const suggestedHours = Math.max(10, Math.ceil((allocatedHours * 0.25))); // Suggest 25% more or at least 10h
    
    const modalHtml = `
        <div class="modal-overlay" id="requestTimeDirectModalOverlay" onclick="handleModalOverlayClick(event, 'requestTimeDirectModalOverlay')">
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>⏰ Request Additional Time</h2>
                    <span class="close-modal" onclick="closeRequestTimeDirectModal()">&times;</span>
                </div>
                
                <div class="modal-body">
                    <div style="padding: 1rem; background: #e3f2fd; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #2196f3;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #1565c0;">📊 Project: ${projectName}</h4>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: bold; color: #1976d2;">${allocatedHours.toFixed(1)}h</div>
                                <small style="color: #666;">Allocated</small>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: bold; color: #ff9800;">${usedHours.toFixed(1)}h</div>
                                <small style="color: #666;">Used</small>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: bold; color: ${remaining < 0 ? '#f44336' : remaining < 5 ? '#ff9800' : '#4caf50'};">${remaining.toFixed(1)}h</div>
                                <small style="color: #666;">Remaining</small>
                            </div>
                        </div>
                    </div>
                    
                    ${remaining <= 0 ? `
                        <div style="padding: 1rem; background: #ffebee; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #f44336;">
                            <p style="margin: 0; color: #c62828;">
                                ⚠️ <strong>Budget Exceeded!</strong> You've used all your allocated hours. 
                                Submit a request for additional time to continue working on this project.
                            </p>
                        </div>
                    ` : remaining < 5 ? `
                        <div style="padding: 1rem; background: #fff3e0; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #ff9800;">
                            <p style="margin: 0; color: #e65100;">
                                ⚠️ <strong>Low Budget Warning!</strong> You have only ${remaining.toFixed(1)} hours remaining.
                                Consider requesting additional time before running out.
                            </p>
                        </div>
                    ` : ''}
                    
                    <form id="requestTimeDirectForm" onsubmit="event.preventDefault(); submitDirectTimeRequest();">
                        <input type="hidden" id="directReqProjectId" value="${projectId}">
                        <input type="hidden" id="directReqProjectName" value="${projectName}">
                        <input type="hidden" id="directReqAllocatedHours" value="${allocatedHours}">
                        <input type="hidden" id="directReqUsedHours" value="${usedHours}">
                        
                        <div class="form-group">
                            <label>Additional Hours Needed <span class="required">*</span></label>
                            <input type="number" id="directRequestedHours" class="form-control" 
                                   min="1" step="0.5" 
                                   value="${suggestedHours}" required>
                            <small>Suggested: ${suggestedHours}h (25% additional buffer)</small>
                        </div>
                        
                        <div class="form-group">
                            <label>Reason for Additional Time <span class="required">*</span></label>
                            <textarea id="directRequestReason" class="form-control" rows="5" 
                                      placeholder="Please explain why additional time is needed...&#10;&#10;Examples:&#10;- Design complexity increased&#10;- Client requested revisions&#10;- Scope changes not in original estimate&#10;- Unforeseen technical challenges" required></textarea>
                            <small>Be specific: scope changes, unforeseen complexity, design revisions, etc. (min 20 characters)</small>
                        </div>
                    </form>
                </div>
                
                <div class="modal-footer">
                    <button type="button" onclick="closeRequestTimeDirectModal()" class="btn btn-outline">Cancel</button>
                    <button type="button" onclick="submitDirectTimeRequest()" class="btn btn-primary">
                        📤 Submit Request to COO
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * Close Direct Request Time Modal
 */
function closeRequestTimeDirectModal() {
    const modal = document.getElementById('requestTimeDirectModalOverlay');
    if (modal) {
        modal.remove();
    }
}

/**
 * Submit Direct Time Request
 */
async function submitDirectTimeRequest() {
    const projectId = document.getElementById('directReqProjectId').value;
    const projectName = document.getElementById('directReqProjectName').value;
    const allocatedHours = parseFloat(document.getElementById('directReqAllocatedHours').value);
    const usedHours = parseFloat(document.getElementById('directReqUsedHours').value);
    const requestedHours = parseFloat(document.getElementById('directRequestedHours').value);
    const reason = document.getElementById('directRequestReason').value.trim();
    
    if (!requestedHours || requestedHours <= 0) {
        alert('Please enter valid hours');
        return;
    }
    
    if (!reason || reason.length < 20) {
        alert('Please provide a detailed reason (at least 20 characters)');
        document.getElementById('directRequestReason').focus();
        return;
    }
    
    try {
        showLoading();
        
        // Submit time request
        const response = await apiCall('time-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId,
                requestedHours,
                reason,
                currentAllocatedHours: allocatedHours,
                currentHoursLogged: usedHours,
                requestType: 'proactive' // Flag that this is a proactive request, not from timesheet overflow
            })
        });
        
        if (response.success) {
            closeRequestTimeDirectModal();
            showSuccessModal(
                '✅ Request Submitted!',
                `Your request for ${requestedHours} additional hours on "${projectName}" has been submitted to the COO for review.`
            );

            // Trigger email notification
            triggerEmailNotification('time_request.created', {
                projectId: projectId,
                hours: requestedHours,
                reason: reason,
                designerName: currentUser.displayName
            });
            
            // Refresh the allocations view
            if (typeof showDesignerAllocations === 'function') {
                setTimeout(() => {
                    closeSuccessModal();
                    showDesignerAllocations();
                }, 2000);
            }
        } else {
            throw new Error(response.error || 'Failed to submit request');
        }
        
    } catch (error) {
        console.error('Error submitting time request:', error);
        alert('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Original showPendingTimeRequests continues below
async function showPendingTimeRequests() {
    try {
        showLoading();
        
        const response = await apiCall('time-requests');
        
        if (!response.success) {
            throw new Error('Failed to load time requests');
        }
        
        const requests = response.data || [];
        const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'info_requested');
        
        let requestsHtml = '';
        
        if (pendingRequests.length === 0) {
            requestsHtml = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                    <h3>No Pending Requests</h3>
                    <p>You don't have any pending additional time requests.</p>
                </div>
            `;
        } else {
            requestsHtml = pendingRequests.map(req => `
                <div class="card" style="margin-bottom: 1rem; border-left: 4px solid ${req.status === 'info_requested' ? '#ff9800' : '#2196F3'};">
                    <div style="padding: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                            <div>
                                <h4 style="margin: 0;">${req.projectName}</h4>
                                <small style="color: #666;">${req.clientCompany}</small>
                            </div>
                            <span class="badge" style="background: ${req.status === 'info_requested' ? '#ff9800' : '#2196F3'};">
                                ${req.status === 'info_requested' ? 'Info Requested' : 'Pending Review'}
                            </span>
                        </div>
                        
                        <div style="margin: 1rem 0; padding: 0.75rem; background: #f5f5f5; border-radius: 4px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                                <div><strong>Requested:</strong> ${req.requestedHours}h</div>
                                <div><strong>Current:</strong> ${req.currentHoursLogged}h / ${req.currentAllocatedHours}h</div>
                            </div>
                        </div>
                        
                        <div style="margin: 1rem 0;">
                            <strong>Reason:</strong>
                            <p style="margin: 0.5rem 0; color: #555;">${req.reason}</p>
                        </div>
                        
                        ${req.reviewComment ? `
                            <div style="margin: 1rem 0; padding: 0.75rem; background: #fff3cd; border-radius: 4px;">
                                <strong>COO Comment:</strong>
                                <p style="margin: 0.5rem 0; color: #856404;">${req.reviewComment}</p>
                            </div>
                        ` : ''}
                        
                        <small style="color: #666;">
                            Submitted: ${req.createdAt ? new Date(req.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                        </small>
                    </div>
                </div>
            `).join('');
        }
        
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <h2>⏱️ My Time Requests</h2>
                <p class="subtitle">Track your additional time requests</p>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <button onclick="showTimesheet()" class="btn btn-outline">← Back to Timesheet</button>
            </div>
            
            ${requestsHtml}
        `;
        
        hideLoading();
        
    } catch (error) {
        console.error('Error loading time requests:', error);
        alert('Error: ' + error.message);
        hideLoading();
    }
}

/**
         * Show COO Time Request Dashboard
         */
          async function showCOOTimeRequests() {
            // FIX: Use the correct global variable 'currentUserRole'
            const userRole = currentUserRole ? currentUserRole.trim().toLowerCase() : '';
            if (!['coo', 'director'].includes(userRole)) {
                alert('Access denied. COO/Director only.');
                return;
            }
    try {
        showLoading();
        setActiveNav('nav-time-requests');
        
        const response = await apiCall('time-requests?status=pending');
        
        if (!response.success) {
            throw new Error('Failed to load time requests');
        }
        
        const requests = response.data || [];
        
        let requestsHtml = '';
        
        if (requests.length === 0) {
            requestsHtml = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                    <h3>All Caught Up!</h3>
                    <p>No pending time requests to review.</p>
                </div>
            `;
        } else {
            requestsHtml = requests.map(req => `
                <div class="card" style="margin-bottom: 1.5rem;">
                    <div style="padding: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                            <div>
                                <h3 style="margin: 0 0 0.25rem 0;">${req.projectName}</h3>
                                <small style="color: #666;">${req.projectCode} - ${req.clientCompany}</small>
                            </div>
                            <span class="badge" style="background: #ff9800;">Pending Review</span>
                        </div>
                        
                        <div style="margin: 1rem 0; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                                <div>
                                    <small style="color: #666;">Requested By</small>
                                    <div style="font-weight: 600;">${req.designerName}</div>
                                </div>
                                <div>
                                    <small style="color: #666;">Additional Hours</small>
                                    <div style="font-weight: 600; color: #2196F3; font-size: 1.2rem;">${req.requestedHours}h</div>
                                </div>
                                <div>
                                    <small style="color: #666;">Current Usage</small>
                                    <div style="font-weight: 600;">${req.currentHoursLogged}h / ${req.currentAllocatedHours}h</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin: 1rem 0;">
                            <strong>Reason for Additional Time:</strong>
                            <p style="margin: 0.5rem 0; padding: 1rem; background: #fff; border-left: 3px solid #2196F3; color: #555;">
                                ${req.reason}
                            </p>
                        </div>
                        
                        <div style="margin: 1rem 0;">
                            <small style="color: #666;">
                                Submitted: ${req.createdAt ? new Date(req.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                            </small>
                        </div>
                        
                        <div style="display: flex; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #ddd;">
                            <button onclick="approveTimeRequest('${req.id}', ${req.requestedHours})" 
                                    class="btn btn-success" style="flex: 1;">
                                ✅ Approve ${req.requestedHours}h
                            </button>
                            <button onclick="showRejectTimeRequestModal('${req.id}')" 
                                    class="btn btn-danger" style="flex: 1;">
                                ❌ Reject
                            </button>
                            <button onclick="showRequestInfoModal('${req.id}')" 
                                    class="btn btn-outline">
                                💬 Request Info
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <h2>⏱️ Additional Time Requests</h2>
                <p class="subtitle">Review and approve/reject designer requests for additional hours</p>
            </div>
            
            <div class="dashboard-stats" style="margin-bottom: 2rem;">
                <div class="stat-card">
                    <div class="stat-number">${requests.length}</div>
                    <div class="stat-label">Pending Requests</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${requests.reduce((sum, r) => sum + r.requestedHours, 0).toFixed(1)}h</div>
                    <div class="stat-label">Total Hours Requested</div>
                </div>
            </div>
            
            ${requestsHtml}
        `;
        
        hideLoading();
        
    } catch (error) {
        console.error('Error loading COO time requests:', error);
        alert('Error: ' + error.message);
        hideLoading();
    }
}

/**
 * Approve Time Request
 */
async function approveTimeRequest(requestId, hours) {
    const comment = prompt(`Approve ${hours}h additional time?\n\nOptional comment for designer:`);
    
    if (comment === null) return; // Cancelled
    
    try {
        showLoading();
        
        const response = await apiCall(`time-requests?id=${requestId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'approve',
                approvedHours: hours,
                comment: comment || 'Approved',
                applyToTimesheet: true
            })
        });
        
        if (response.success) {
            alert(`✅ Approved ${hours}h additional time!`);
            // --- ADD THIS LINE ---
           // You might need to pass designerEmail to this function or let backend fetch it
           triggerEmailNotification('time_request.approved', { 
           requestId: requestId,
           hours: hours 
    });
    // --------------------
            showCOOTimeRequests(); // Refresh list
        } else {
            throw new Error(response.error || 'Failed to approve');
        }
        
    } catch (error) {
        console.error('Error approving time request:', error);
        alert('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

/**
 * Show Reject Time Request Modal
 */
function showRejectTimeRequestModal(requestId) {
    closeAllModals();
    
    const modalHtml = `
        <div class="modal-overlay" id="rejectModalOverlay" onclick="handleModalOverlayClick(event, 'rejectModalOverlay')">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>❌ Reject Time Request</h2>
                    <span class="close-modal" onclick="closeRejectModal()">&times;</span>
                </div>
                
                <div class="modal-body">
                    <input type="hidden" id="rejectRequestId" value="${requestId}">
                    <div class="form-group">
                        <label>Reason for Rejection <span class="required">*</span></label>
                        <textarea id="rejectComment" class="form-control" rows="4" 
                                  placeholder="Explain why this request is being rejected..." required></textarea>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" onclick="closeRejectModal()" class="btn btn-outline">Cancel</button>
                    <button type="button" onclick="submitRejectTimeRequest()" class="btn btn-danger">
                        Reject Request
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * Submit Rejection
 */
async function submitRejectTimeRequest() {
    const requestId = document.getElementById('rejectRequestId').value;
    const comment = document.getElementById('rejectComment').value.trim();
    
    if (!comment || comment.length < 10) {
        alert('Please provide a detailed reason for rejection (at least 10 characters)');
        return;
    }
    
    try {
        showLoading();
        
        const response = await apiCall(`time-requests?id=${requestId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'reject',
                comment: comment
            })
        });
        
        if (response.success) {
            closeRejectModal();
            alert('❌ Request rejected');
            showCOOTimeRequests(); // Refresh list
        } else {
            throw new Error(response.error || 'Failed to reject');
        }
        
    } catch (error) {
        console.error('Error rejecting time request:', error);
        alert('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

/**
 * Modal Close Functions - Fix for stuck modals
 */
function closeTimesheetModal() {
    const modal = document.getElementById('timesheetModalOverlay');
    if (modal) modal.remove();
    document.body.classList.remove('modal-open');
}

function closeRequestTimeModal() {
    const modal = document.getElementById('requestTimeModalOverlay');
    if (modal) modal.remove();
    document.body.classList.remove('modal-open');
}

function closeRejectModal() {
    const modal = document.getElementById('rejectModalOverlay');
    if (modal) modal.remove();
    document.body.classList.remove('modal-open');
}

function closeAllModals() {
    // Remove all modal overlays
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => modal.remove());
    document.body.classList.remove('modal-open');
}

// ✅ Make modal close functions globally accessible
window.closeTimesheetModal = closeTimesheetModal;
window.closeRequestTimeModal = closeRequestTimeModal;
window.closeRejectModal = closeRejectModal;
window.closeAllModals = closeAllModals;

function handleModalOverlayClick(event, modalId) {
    // Close modal only if clicking directly on overlay (not on modal content)
    if (event.target.id === modalId) {
        document.getElementById(modalId).remove();
        document.body.classList.remove('modal-open');
    }
}

// ✅ Make handleModalOverlayClick globally accessible
window.handleModalOverlayClick = handleModalOverlayClick;

// Add keyboard ESC to close modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAllModals();
    }
});

// ============================================
// INTEGRATION WITH EXECUTIVE DASHBOARD
// ============================================

/**
 * Update Executive Dashboard to show projects exceeding allocation
 * Add this to your renderExecutiveProjectsTable function
 */
function renderExecutiveProjectsTable(projects) {
    if (!projects || projects.length === 0) {
        return '<p style="text-align: center; padding: 2rem; color: #666;">No active projects found.</p>';
    }
    
    // Separate projects by allocation status
    const exceededProjects = projects.filter(p => 
        p.hoursLogged > p.allocatedHours && p.allocatedHours > 0
    );
    const onTrackProjects = projects.filter(p => 
        p.hoursLogged <= p.allocatedHours || p.allocatedHours === 0
    );
    
    let html = '';
    
    // Show exceeded projects first
    if (exceededProjects.length > 0) {
        html += `
            <div class="card" style="margin-bottom: 2rem; border-left: 4px solid #f44336;">
                <div style="padding: 1rem; background: #ffebee;">
                    <h3 style="margin: 0; color: #c62828;">⚠️ Projects Exceeding Allocation (${exceededProjects.length})</h3>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Allocated</th>
                            <th>Logged</th>
                            <th>Exceeded By</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${exceededProjects.map(p => `
                            <tr>
                                <td>
                                    <strong>${p.projectName}</strong><br>
                                    <small>${p.clientCompany}</small>
                                </td>
                                <td>${p.allocatedHours}h</td>
                                <td style="color: #f44336; font-weight: 600;">${p.hoursLogged}h</td>
                                <td style="color: #f44336; font-weight: 600;">
                                    +${(p.hoursLogged - p.allocatedHours).toFixed(2)}h
                                </td>
                                <td>
                                    <span class="badge" style="background: #f44336;">Over Allocated</span>
                                </td>
                                <td>
                                    <button onclick="viewProjectTimesheetDetails('${p.id}')" class="btn btn-sm btn-outline">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Show on-track projects
    html += `
        <div class="card">
            <div style="padding: 1rem; background: #f5f5f5;">
                <h3 style="margin: 0;">✅ On Track Projects (${onTrackProjects.length})</h3>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Allocated</th>
                        <th>Logged</th>
                        <th>Remaining</th>
                        <th>Progress</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${onTrackProjects.map(p => {
                        const remaining = p.allocatedHours - p.hoursLogged;
                        const progress = p.allocatedHours > 0 ? (p.hoursLogged / p.allocatedHours * 100) : 0;
                        const progressColor = progress > 90 ? '#ff9800' : progress > 75 ? '#2196F3' : '#4CAF50';
                        
                        return `
                            <tr>
                                <td>
                                    <strong>${p.projectName}</strong><br>
                                    <small>${p.clientCompany}</small>
                                </td>
                                <td>${p.allocatedHours}h</td>
                                <td>${p.hoursLogged}h</td>
                                <td style="color: ${remaining < 5 ? '#ff9800' : '#4CAF50'};">
                                    ${remaining.toFixed(2)}h
                                </td>
                                <td>
                                    <div style="width: 100px; background: #eee; height: 8px; border-radius: 4px; overflow: hidden;">
                                        <div style="width: ${Math.min(progress, 100)}%; background: ${progressColor}; height: 100%;"></div>
                                    </div>
                                    <small>${progress.toFixed(0)}%</small>
                                </td>
                                <td>
                                    <button onclick="viewProjectTimesheetDetails('${p.id}')" class="btn btn-sm btn-outline">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

/**
 * View Project Timesheet Details
 */
async function viewProjectTimesheetDetails(projectId) {
    try {
        showLoading();
        
        const [projectResponse, timesheetsResponse] = await Promise.all([
            apiCall(`projects?id=${projectId}`),
            apiCall(`timesheets?projectId=${projectId}`)
        ]);
        
        if (!projectResponse.success || !timesheetsResponse.success) {
            throw new Error('Failed to load project details');
        }
        
        const project = projectResponse.data;
        const timesheets = timesheetsResponse.data || [];
        
        // Group by designer
        const byDesigner = {};
        timesheets.forEach(ts => {
            if (!byDesigner[ts.designerUid]) {
                byDesigner[ts.designerUid] = {
                    name: ts.designerName,
                    email: ts.designerEmail,
                    hours: 0,
                    entries: []
                };
            }
            byDesigner[ts.designerUid].hours += ts.hours;
            byDesigner[ts.designerUid].entries.push(ts);
        });
        
        const designerSummary = Object.values(byDesigner).map(d => `
            <tr>
                <td>${d.name}</td>
                <td>${d.email}</td>
                <td><strong>${d.hours}h</strong></td>
                <td>${d.entries.length}</td>
            </tr>
        `).join('');
        
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <h2>📊 Project Timesheet Details</h2>
                <button onclick="showExecutiveDashboard()" class="btn btn-outline">← Back to Dashboard</button>
            </div>
            
            <div class="card" style="margin-bottom: 2rem;">
                <div style="padding: 1.5rem;">
                    <h3>${project.projectName}</h3>
                    <p style="color: #666;">${project.clientCompany}</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
                        <div style="padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                            <small>Allocated Hours</small>
                            <div style="font-size: 1.5rem; font-weight: 600;">${project.allocatedHours}h</div>
                        </div>
                        <div style="padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                            <small>Hours Logged</small>
                            <div style="font-size: 1.5rem; font-weight: 600; color: ${project.hoursLogged > project.allocatedHours ? '#f44336' : '#4CAF50'};">
                                ${project.hoursLogged}h
                            </div>
                        </div>
                        <div style="padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                            <small>${project.hoursLogged > project.allocatedHours ? 'Exceeded By' : 'Remaining'}</small>
                            <div style="font-size: 1.5rem; font-weight: 600; color: ${project.hoursLogged > project.allocatedHours ? '#f44336' : '#4CAF50'};">
                                ${Math.abs(project.allocatedHours - project.hoursLogged).toFixed(2)}h
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div style="padding: 1rem; background: #f5f5f5; border-bottom: 1px solid #ddd;">
                    <h3 style="margin: 0;">Hours by Designer</h3>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Designer</th>
                            <th>Email</th>
                            <th>Total Hours</th>
                            <th>Entries</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${designerSummary}
                    </tbody>
                </table>
            </div>
        `;
        
        hideLoading();
        
    } catch (error) {
        console.error('Error loading project details:', error);
        alert('Error: ' + error.message);
        hideLoading();
    }
}

console.log('✅ Timesheet Additional Hours System Loaded');



// ==========================================
// ADDITIONAL WORKFLOW FUNCTIONS
// ==========================================

// NOTE: Estimator form already exists as showEstimationModal() - available when status='draft'
// Wrapper function for compatibility
function showEstimateForm(proposalId) {
    if (typeof showEstimationModal === 'function') {
        showEstimationModal(proposalId);
    }
}

// Show Pricing Form (for COO role) - Note: showCOOPricingForm already exists, this is an alternate entry point
function showPricingForm(proposalId) {
    // Use the existing showCOOPricingForm function
    if (typeof showCOOPricingForm === 'function') {
        showCOOPricingForm(proposalId);
    }
}

// Show Client Outcome Form (for BDM role)
function showClientOutcomeForm(proposalId) {
    const modalHtml = `
        <div class="modal" id="clientOutcomeModal" style="display: flex;">
            <div class="modal-content new-modal">
                <div class="modal-header">
                    <h3>Submit Client Outcome</h3>
                    <button class="close" onclick="closeClientOutcomeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="clientOutcomeForm">
                        <div class="form-group">
                            <label>Client Response File</label>
                            <div class="upload-area" onclick="document.getElementById('clientResponseFile').click()">
                                <div class="upload-icon">📎</div>
                                <p>Click to choose file</p>
                            </div>
                            <input type="file" id="clientResponseFile" style="display: none;">
                            <div id="clientFileList" style="margin-top: 1rem;"></div>
                        </div>
                        
                        <div class="form-group">
                            <label>Outcome *</label>
                            <select class="form-control" id="clientOutcome" required>
                                <option value="">Select outcome</option>
                                <option value="won">Won</option>
                                <option value="loss">Loss</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Comments</label>
                            <textarea class="form-control" id="clientComments"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeClientOutcomeModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="submitClientOutcome('${proposalId}')">Submit Outcome</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // File input handler
    document.getElementById('clientResponseFile').addEventListener('change', function() {
        const fileList = document.getElementById('clientFileList');
        if (this.files.length > 0) {
            const file = this.files[0];
            fileList.innerHTML = `<div style="padding: 0.5rem; background: var(--light-blue); border-radius: 6px;">📄 ${file.name} (${(file.size / 1024).toFixed(2)} KB)</div>`;
        } else {
            fileList.innerHTML = '';
        }
    });
}

function closeClientOutcomeModal() {
    const modal = document.getElementById('clientOutcomeModal');
    if (modal) modal.remove();
}

// Submit Client Outcome
async function submitClientOutcome(proposalId) {
    const outcome = document.getElementById('clientOutcome').value;
    const comments = document.getElementById('clientComments').value;
    const file = document.getElementById('clientResponseFile').files[0];
    
    if (!outcome) {
        alert('Please select an outcome');
        return;
    }
    
    try {
        showLoading();
        
        const formData = new FormData();
        formData.append('outcome', outcome);
        formData.append('comments', comments);
        if (file) {
            formData.append('client_response_file', file);
        }
        
        const response = await apiCall(`proposals/${proposalId}/client-outcome`, {
            method: 'POST',
            body: formData
        });
        
        if (response.success) {
            closeClientOutcomeModal();
            alert(`Proposal marked as ${outcome}!`);
            if (typeof showProposals === 'function') {
                showProposals();
            } else if (typeof showDashboard === 'function') {
                showProposals();
            }
        } else {
            throw new Error(response.error || 'Failed to submit outcome');
        }
        
    } catch (error) {
        console.error('Error submitting client outcome:', error);
        alert('Error submitting outcome: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Show Allocation Form (for COO/Director) - Note: showProjectAllocationModal already exists
function showAllocationForm(proposalId) {
    // Use the existing showProjectAllocationModal function
    if (typeof showProjectAllocationModal === 'function') {
        showProjectAllocationModal(proposalId);
    }
}

// Show Designer Assignment Form (for Design Manager)
function showDesignerAssignment(projectId) {
    // Use the existing assignDesigners function
    if (typeof assignDesigners === 'function') {
        assignDesigners(projectId);
    }
}

// Show Submit Design Form (for Design Manager)
function showSubmitDesign(projectId) {
    const modalHtml = `
        <div class="modal" id="submitDesignModal" style="display: flex;">
            <div class="modal-content new-modal">
                <div class="modal-header">
                    <h3>Submit Final Design</h3>
                    <button class="close" onclick="closeSubmitDesignModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="submitDesignForm">
                        <div class="form-group">
                            <label>Final Design Files *</label>
                            <div class="upload-area" onclick="document.getElementById('designFiles').click()">
                                <div class="upload-icon">📎</div>
                                <p>Click to choose files</p>
                            </div>
                            <input type="file" id="designFiles" multiple required style="display: none;">
                            <div id="designFileList" style="margin-top: 1rem;"></div>
                        </div>
                        
                        <div class="form-group">
                            <label>Remarks</label>
                            <textarea class="form-control" id="designRemarks"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeSubmitDesignModal()">Cancel</button>
                    <button class="btn btn-success" onclick="submitFinalDesign('${projectId}')">Submit to Client</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // File input handler
    document.getElementById('designFiles').addEventListener('change', function() {
        const fileList = document.getElementById('designFileList');
        if (this.files.length > 0) {
            fileList.innerHTML = Array.from(this.files).map(file => `
                <div style="padding: 0.5rem; background: var(--light-blue); border-radius: 6px; margin-bottom: 0.5rem;">
                    📄 ${file.name} (${(file.size / 1024).toFixed(2)} KB)
                </div>
            `).join('');
        } else {
            fileList.innerHTML = '';
        }
    });
}

function closeSubmitDesignModal() {
    const modal = document.getElementById('submitDesignModal');
    if (modal) modal.remove();
}

// Submit Final Design
async function submitFinalDesign(projectId) {
    const files = document.getElementById('designFiles').files;
    const remarks = document.getElementById('designRemarks').value;
    
    if (files.length === 0) {
        alert('Please attach final design files');
        return;
    }
    
    try {
        showLoading();
        
        const formData = new FormData();
        for (let file of files) {
            formData.append('attachments', file);
        }
        formData.append('remarks', remarks);
        
        const response = await apiCall(`projects/${projectId}/submit-design`, {
            method: 'POST',
            body: formData
        });
        
        if (response.success) {
            closeSubmitDesignModal();
            alert('Design submitted successfully!');
            if (typeof showProjects === 'function') {
                showProjects();
            } else if (typeof showDashboard === 'function') {
                showProposals();
            }
        } else {
            throw new Error(response.error || 'Failed to submit design');
        }
        
    } catch (error) {
        console.error('Error submitting design:', error);
        alert('Error submitting design: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Mark Project Complete (for Design Manager)
async function markComplete(projectId) {
    if (!confirm('Mark this project as complete?')) {
        return;
    }
    
    try {
        showLoading();
        
        const response = await apiCall(`projects/${projectId}/complete`, {
            method: 'POST'
        });
        
        if (response.success) {
            alert('Project marked as complete!');
            if (typeof showProjects === 'function') {
                showProjects();
            } else if (typeof showDashboard === 'function') {
                showProposals();
            }
        } else {
            throw new Error(response.error || 'Failed to mark complete');
        }
        
    } catch (error) {
        console.error('Error marking complete:', error);
        alert('Error marking project complete: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Update Total Assigned Hours (for Designer Assignment)
function updateTotalAssigned() {
    let total = 0;
    const hoursInputs = document.querySelectorAll('.hours-input');
    hoursInputs.forEach(input => {
        total += parseFloat(input.value) || 0;
    });
    const totalElement = document.getElementById('totalAssignedHours');
    if (totalElement) {
        totalElement.textContent = total.toFixed(1);
    }
}

// Add Designer Assignment Row
function addDesignerRow() {
    const container = document.getElementById('designerAssignmentRows');
    if (!container) return;
    
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; margin-bottom: 1rem;';
    row.innerHTML = `
        <div class="form-group">
            <select class="form-control designer-select">
                <option value="">Select Designer</option>
            </select>
        </div>
        <div class="form-group">
            <input type="number" step="0.1" class="form-control hours-input" 
                   placeholder="Hours" onchange="updateTotalAssigned()">
        </div>
        <button type="button" class="btn btn-danger btn-sm" onclick="removeDesignerRow(this)">×</button>
    `;
    container.appendChild(row);
    
    // Load designers for new row
    if (typeof loadDesigners === 'function') {
        loadDesigners();
    }
}

function removeDesignerRow(btn) {
    btn.parentElement.remove();
    updateTotalAssigned();
}

// Load Designers for Assignment
async function loadDesigners() {
    try {
        const response = await apiCall('users?role=designer');
        
        if (response.success && response.data) {
            document.querySelectorAll('.designer-select').forEach(select => {
                // Keep first option
                const firstOption = select.querySelector('option:first-child');
                select.innerHTML = '';
                if (firstOption) {
                    select.appendChild(firstOption);
                }
                
                response.data.forEach(designer => {
                    const option = document.createElement('option');
                    option.value = designer.id;
                    option.textContent = designer.name;
                    select.appendChild(option);
                });
            });
        }
    } catch (error) {
        console.error('Error loading designers:', error);
    }
}

// Load Design Managers for Allocation
async function loadDesignManagers() {
    try {
        const response = await apiCall('users?role=design_manager');
        const select = document.getElementById('designManagerId');
        
        if (response.success && response.data && select) {
            response.data.forEach(manager => {
                const option = document.createElement('option');
                option.value = manager.id;
                option.textContent = manager.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading design managers:', error);
    }
}

// Add Pricing Row (for COO Pricing)
function addPricingRow() {
    const container = document.getElementById('pricingRows');
    if (!container) return;
    
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 1rem; margin-bottom: 1rem;';
    row.innerHTML = `
        <input type="text" class="form-control" placeholder="Description" />
        <input type="number" step="0.01" class="form-control" placeholder="Unit Cost" />
        <input type="number" step="0.1" class="form-control" placeholder="Qty/Hours" />
        <button type="button" class="btn btn-danger btn-sm" onclick="removePricingRow(this)">×</button>
    `;
    container.appendChild(row);
}

function removePricingRow(btn) {
    btn.parentElement.remove();
}


// ============================================
// DESIGNER TASKS/PROJECTS VIEW
// ============================================

// ***** CORRECTED FUNCTION *****
// This function now correctly injects the HTML into 'mainContent'
// instead of hiding 'mainContent'.
window.showTasksImpl = async function() {
    setActiveNav('nav-tasks');
    const main = document.getElementById('mainContent');
    main.style.display = 'block'; // <-- FIX: Ensure main content is visible
    
    showLoading();
    
    try {
       // Fetch projects assigned to this designer
        const response = await apiCall('projects?assignedToMe=true');
        
        if (!response.success) {
            throw new Error('Failed to load projects');
        }
        
        let rawProjects = response.data || [];
        
        // FIX: Ensure specific client-side filtering just in case backend returns all
        const projects = rawProjects.filter(p => 
            (p.assignedDesigners && p.assignedDesigners.includes(currentUser.uid)) ||
            (p.assignedDesignerUids && p.assignedDesignerUids.includes(currentUser.uid))
        );
        
        const projectsHtml = projects.length > 0 ? projects.map(project => `
            <div class="project-card">
                <div class="project-header">
                    <h3>${project.projectName || 'Untitled Project'}</h3>
                    <span class="project-status ${project.status}">${project.status}</span>
                </div>
                <div class="project-details">
                    <p><strong>Client:</strong> ${project.clientCompany || 'N/A'}</p>
                    <p><strong>Project Code:</strong> ${project.projectCode || 'N/A'}</p>
                    <p><strong>Target Date:</strong> ${project.targetCompletionDate ? formatDate(project.targetCompletionDate) : 'Not set'}</p>
                    <p><strong>Status:</strong> ${project.designStatus || 'N/A'}</p>
                    <p><strong>Design Manager:</strong> ${project.designLeadName || 'N/A'}</p>
                </div>
                <div class="project-actions">
                    <button class="btn btn-primary" onclick="showDesignerUploadModal('${project.id}')">
                        📤 Upload Files
                    </button>
                    <button class="btn btn-outline" onclick="viewProjectDetails('${project.id}')">
                        👁️ View Details
                    </button>
                </div>
            </div>
        `).join('') : '<p style="text-align: center; padding: 2rem; color: var(--text-light);">No projects assigned yet.</p>';
        
        // <-- FIX: Inject HTML into main.innerHTML
        main.innerHTML = `
            <div class="page-header">
                <h2>📋 My Projects</h2>
                <p class="subtitle">Projects assigned to you</p>
            </div>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-number">${projects.length}</div>
                    <div class="stat-label">Total Projects</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${projects.filter(p => p.status === 'active').length}</div>
                    <div class="stat-label">Active Projects</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${projects.filter(p => p.status === 'completed').length}</div>
                    <div class="stat-label">Completed</div>
                </div>
            </div>
            
            <div class="action-section">
                <h3>Your Projects</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                    ${projectsHtml}
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading tasks:', error);
        main.innerHTML = `<div class="error-message">Failed to load projects: ${error.message}</div>`;
    } finally {
        hideLoading();
    }
}

function viewProjectDetails(projectId) {
    // Simple project details view
    apiCall(`projects?id=${projectId}`).then(response => {
        if (!response.success || !response.data) {
            alert('Failed to load project details');
            return;
        }
        
        const project = response.data;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'projectDetailsModal';
        // FIXED: Add inline styles to ensure modal displays properly
        modal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center;';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px; background: white; border-radius: 12px; max-height: 90vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <div class="modal-header" style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;">📋 Project Details</h3>
                    <button class="modal-close" onclick="closeProjectDetailsModal()" style="background: none; border: none; font-size: 2rem; cursor: pointer; color: #666;">&times;</button>
                </div>
                <div class="modal-body" style="padding: 1.5rem; max-height: 60vh; overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div><strong>Project Name:</strong><br>${project.projectName || 'N/A'}</div>
                        <div><strong>Client:</strong><br>${project.clientCompany || 'N/A'}</div>
                        <div><strong>Project Code:</strong><br>${project.projectCode || 'N/A'}</div>
                        <div><strong>Status:</strong><br><span class="status-badge">${project.status}</span></div>
                        <div><strong>Design Manager:</strong><br>${project.designLeadName || 'N/A'}</div>
                        <div><strong>Target Date:</strong><br>${project.targetCompletionDate ? formatDate(project.targetCompletionDate) : 'Not set'}</div>
                        <div style="grid-column: 1 / -1;"><strong>Description:</strong><br>${project.projectDescription || 'No description provided'}</div>
                        <div style="grid-column: 1 / -1;"><strong>Special Instructions:</strong><br>${project.specialInstructions || 'None'}</div>
                    </div>
                </div>
                <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 0.5rem;">
                    <button class="btn btn-primary" onclick="showDesignerUploadModal('${projectId}'); closeProjectDetailsModal();">
                        📤 Upload Files
                    </button>
                    <button class="btn btn-outline" onclick="closeProjectDetailsModal()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.classList.add('modal-open');
    });
}

// Ensure project view functions are globally accessible
window.viewProjectDetails = viewProjectDetails;
window._viewProjectImpl = viewProjectDetails; // Register with wrapper
window.closeProjectDetailsModal = closeProjectDetailsModal;
console.log('✅ viewProjectDetails implementation registered');

function closeProjectDetailsModal() {
    const modal = document.getElementById('projectDetailsModal');
    if (modal) modal.remove();
    document.body.classList.remove('modal-open');
}

// ============================================
// SHOW SECTION FUNCTION FOR NAV ITEMS
// ============================================

// ***** CORRECTED FUNCTION *****
// This function now correctly injects the HTML into 'mainContent'
// instead of hiding 'mainContent'.
window.showTimesheetImpl = async function() {
    setActiveNav('nav-timesheet');
    const main = document.getElementById('mainContent');
    main.style.display = 'block'; // <-- FIX
    showLoading();
    
    try {
        console.log('⏱️ Loading Timesheet...');
        const templateContent = document.getElementById('timesheetSection');
        if (!templateContent) {
            throw new Error('Timesheet template not found');
        }
        
        // Clone and insert into main content
        main.innerHTML = templateContent.outerHTML.replace('style="display: none;"', 'style="display: block;"'); // <-- FIX
        
        // Load the data
        await loadDesignerTimesheet(); // Use new function
        
        hideLoading();
    } catch (error) {
        console.error('❌ Timesheet error:', error);
        main.innerHTML = `<div class="error-message"><h3>⚠️ Error Loading Timesheet</h3><p>${error.message}</p></div>`;
        hideLoading();
    }
}

// ***** CORRECTED FUNCTION *****
// This function now correctly injects the HTML into 'mainContent'
// instead of hiding 'mainContent'.
async function showSection(sectionName) {
    const main = document.getElementById('mainContent');
    main.style.display = 'block'; // <-- FIX
    showLoading();

    try {
        if (sectionName === 'timesheet') {
            setActiveNav('nav-timesheet');
            const templateContent = document.getElementById('timesheetSection');
            if (!templateContent) throw new Error('Timesheet template not found');
            main.innerHTML = templateContent.outerHTML.replace('style="display: none;"', 'style="display: block;"');
            await loadDesignerTimesheet(); // Use new function
        } else if (sectionName === 'executiveMonitoring') {
            setActiveNav('nav-executive');
            const templateContent = document.getElementById('executiveTimesheetMonitoring');
            if (!templateContent) throw new Error('Executive Monitoring template not found');
            main.innerHTML = templateContent.outerHTML.replace('style="display: none;"', 'style="display: block;"');
            await loadExecutiveMonitoring(); // Use new function
        }
        hideLoading();
    } catch (error) {
        console.error('❌ Section load error:', error);
        main.innerHTML = `<div class="error-message"><h3>⚠️ Error Loading Section</h3><p>${error.message}</p></div>`;
        hideLoading();
    }
}

// ============================================
// DESIGNER TIMESHEET FUNCTIONS
// ============================================
async function loadDesignerTimesheet() {
    try {
        showLoading();
        
        // Load designer's projects
        const projectsResponse = await apiCall('projects?assignedToMe=true');
        const timesheetResponse = await apiCall('timesheets');
        
        if (!projectsResponse.success || !timesheetResponse.success) {
            throw new Error('Failed to load timesheet data');
        }
        
        const projects = projectsResponse.data || [];
        const entries = timesheetResponse.data || [];
        
        // Calculate summary
        const thisWeekHours = entries
            .filter(e => isThisWeek(e.date))
            .reduce((sum, e) => sum + parseFloat(e.hours || 0), 0);
        
        const thisMonthHours = entries
            .filter(e => isThisMonth(e.date))
            .reduce((sum, e) => sum + parseFloat(e.hours || 0), 0);
        
        // Update summary
        const summaryDiv = document.getElementById('timesheetSummary');
        if (summaryDiv) {
            summaryDiv.innerHTML = `
                <div class="stat-card" style="background: white; border: 2px solid var(--border); border-radius: 10px; padding: 1rem; text-align: center;">
                    <div class="stat-label" style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 0.5rem;">This Week</div>
                    <div class="stat-value" style="font-size: 2.5rem; font-weight: 700; color: var(--primary-blue);">${thisWeekHours.toFixed(1)}h</div>
                </div>
                <div class="stat-card" style="background: white; border: 2px solid var(--border); border-radius: 10px; padding: 1rem; text-align: center;">
                    <div class="stat-label" style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 0.5rem;">This Month</div>
                    <div class="stat-value" style="font-size: 2.5rem; font-weight: 700; color: var(--primary-blue);">${thisMonthHours.toFixed(1)}h</div>
                </div>
                <div class="stat-card" style="background: white; border: 2px solid var(--border); border-radius: 10px; padding: 1rem; text-align: center;">
                    <div class="stat-label" style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 0.5rem;">Active Projects</div>
                    <div class="stat-value" style="font-size: 2.5rem; font-weight: 700; color: var(--primary-blue);">${projects.length}</div>
                </div>
            `;
        }
        
        // Update table
        const tbody = document.getElementById('timesheetTableBody');
        if (tbody) {
            if (entries.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No timesheet entries yet</td></tr>';
            } else {
                tbody.innerHTML = entries.map(entry => `
                    <tr>
                        <td>${formatDate(entry.date)}</td>
                        <td>${entry.projectName || 'N/A'}</td>
                        <td>${entry.hours}h</td>
                        <td>${entry.description || '-'}</td>
                        <td><span class="status-badge status-${entry.status || 'pending'}">${entry.status || 'Pending'}</span></td>
                        <td>
                            ${entry.status === 'pending' ? 
                                `<button onclick="editTimesheetEntry('${entry.id}')" class="btn btn-sm">Edit</button>
                                 <button onclick="deleteTimesheetEntry('${entry.id}')" class="btn btn-sm btn-danger">Delete</button>` 
                                : '-'}
                        </td>
                    </tr>
                `).join('');
            }
        }
        
    } catch (error) {
        console.error('Error loading timesheet:', error);
        alert('Failed to load timesheet: ' + error.message);
    } finally {
        hideLoading();
    }
}


async function deleteTimesheetEntry(entryId) {
    if (!confirm('Delete this timesheet entry?')) return;
    
    try {
        showLoading();
        const response = await apiCall(`timesheets?id=${entryId}`, { method: 'DELETE' });
        
        if (response.success) {
            alert('Entry deleted');
            loadDesignerTimesheet();
        } else {
            throw new Error(response.error || 'Failed to delete');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Helper functions for date filtering
function isThisWeek(dateObj) {
    if (!dateObj || !dateObj.seconds) return false;
    const date = new Date(dateObj.seconds * 1000);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    return date >= weekStart;
}

function isThisMonth(dateObj) {
    if (!dateObj || !dateObj.seconds) return false;
    const date = new Date(dateObj.seconds * 1000);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

// ============================================
// DESIGNER PROJECT UPLOAD FUNCTIONS
// ============================================
function showDesignerUploadModal(projectId) {
    
    // Close existing modal if any
    closeModal();

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'designerUploadModal';
    // FIXED: Add inline styles to ensure modal displays properly
    modal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center;';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; background: white; border-radius: 12px; max-height: 90vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
            <div class="modal-header" style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0;">📤 Upload Project Files</h2>
                <span class="close-modal" onclick="closeDesignerUploadModal()" style="cursor: pointer; font-size: 2rem; color: #666;">&times;</span>
            </div>
            <div class="modal-body" style="padding: 1.5rem; max-height: 60vh; overflow-y: auto;">
                <form id="designerUploadForm" onsubmit="submitDesignerUpload(event, '${projectId}')">
                    <div class="form-group">
                        <label>Upload Files *</label>
                        <div class="upload-area" onclick="document.getElementById('designerFiles').click()" 
                             style="border: 2px dashed var(--border); padding: 2rem; text-align: center; cursor: pointer; border-radius: 8px;">
                            <p>📁 Click to select files or drag and drop</p>
                            <small style="color: var(--text-light);">Supported: PDF, DWG, ZIP, Images (Max 50MB each)</small>
                        </div>
                        <input type="file" id="designerFiles" multiple accept=".pdf,.dwg,.zip,.jpg,.jpeg,.png" 
                               style="display: none;" onchange="updateDesignerFileList()">
                        <div id="designerFileList" style="margin-top: 1rem;"></div>
                    </div>
                    
                    <div class="form-group">
                        <label>File Description</label>
                        <textarea id="designerFileDescription" class="form-control" rows="3" 
                                  placeholder="Describe what you're uploading..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Status Update</label>
                        <select id="designerProjectStatus" class="form-control">
                            <option value="in_progress">Work in Progress</option>
                            <option value="review">Ready for Review</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 0.5rem;">
                <button type="button" class="btn btn-outline" onclick="closeDesignerUploadModal()">Cancel</button>
                <button type="button" class="btn btn-primary" onclick="submitDesignerUpload(event, '${projectId}')">Upload Files</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
}

function closeDesignerUploadModal() {
    const modal = document.getElementById('designerUploadModal');
    if (modal) modal.remove();
    document.body.classList.remove('modal-open');
}

function updateDesignerFileList() {
    const input = document.getElementById('designerFiles');
    const fileList = document.getElementById('designerFileList');
    
    if (input.files.length > 0) {
        fileList.innerHTML = '<strong>Selected files:</strong><ul style="margin-top: 0.5rem;">' +
            Array.from(input.files).map(f => `<li>${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('') +
            '</ul>';
    } else {
        fileList.innerHTML = '';
    }
}

// ✅ Make designer upload functions globally accessible
window.showDesignerUploadModal = showDesignerUploadModal;
window.closeDesignerUploadModal = closeDesignerUploadModal;
window.updateDesignerFileList = updateDesignerFileList;

async function submitDesignerUpload(event, projectId) {
    if(event) event.preventDefault();
    
    const files = document.getElementById('designerFiles').files;
    if (files.length === 0) {
        alert('Please select at least one file');
        return;
    }
    
    try {
        showLoading();
        
        const formData = new FormData();
        for (let file of files) {
            formData.append('files', file);
        }
        formData.append('description', document.getElementById('designerFileDescription').value);
        formData.append('status', document.getElementById('designerProjectStatus').value);
        
        const response = await apiCall(`projects/${projectId}/upload-designer-files`, {
            method: 'POST',
            body: formData
        });
        
        if (response.success) {
            closeDesignerUploadModal();
            alert('Files uploaded successfully!');
            // Reload designer dashboard or project view
            if (typeof showTasks === 'function' && document.getElementById('mainContent').querySelector('h2').innerText.includes('My Projects')) {
                showTasks();
            }
        } else {
            throw new Error(response.error || 'Upload failed');
        }
        
    } catch (error) {
        console.error('Error uploading files:', error);
        alert('Error uploading files: ' + error.message);
    } finally {
        hideLoading();
    }
}
// ============================================
        // NEW: ADD VARIATION FUNCTIONS (DESIGN MANAGER)
        // ============================================

        /**
         * Shows the "Add Variation" modal and populates parent project info.
         */
        function showAddVariationModal(projectId, projectCode, projectName) {
            // Close any other modals
            closeModal();
            
            // Populate the modal fields
            document.getElementById('variationParentProjectId').value = projectId;
            document.getElementById('variationParentProjectName').textContent = projectName;
            document.getElementById('variationParentProjectCode').textContent = projectCode;
            
            // Reset form fields
            document.getElementById('addVariationForm').reset();
            
            // Show the modal
            const modal = document.getElementById('addVariationModal');
            modal.style.display = 'flex';

            // Pre-fill the variation code
            generateVariationCode(true); // Pass true for silent generation
        }

        /**
         * Closes the "Add Variation" modal and resets the form.
         */
        function closeAddVariationModal() {
            const modal = document.getElementById('addVariationModal');
            modal.style.display = 'none';
            document.getElementById('addVariationForm').reset();
        }

       /**
         * Generates a new variation code.
         * Calls the consolidated /api/projects endpoint.
         */
        async function generateVariationCode(silent = false) {
            const parentId = document.getElementById('variationParentProjectId').value;
            const parentCode = document.getElementById('variationParentProjectCode').textContent;
            const variationInput = document.getElementById('variationCode');
            
            if (!silent) showLoading();
            try {
                // ================== THIS IS THE CHANGED LINE ==================
                // Calls /api/projects?action=... instead of /api/projects/generate-variation-code?...
                const response = await apiCall(`projects?action=generate-variation-code&parentId=${parentId}`);
                // =============================================================
                
                if (response.success && response.data.variationCode) {
                    variationInput.value = response.data.variationCode;
                } else {
                    // Fallback: just append -V1 (a real app would check existing)
                    variationInput.value = `${parentCode}-V1`;
                }
            } catch (error) {
                console.warn('Backend variation code generator failed, using fallback:', error.message);
                // Fallback: just append -V1
                variationInput.value = `${parentCode}-V1`;
            } finally {
                if (!silent) hideLoading();
            }
        }

        /**
         * Submits the new variation to the backend for COO approval.
         * Assumes a new backend endpoint: POST /api/variations
         */
        async function submitVariationForApproval() {
            const parentProjectId = document.getElementById('variationParentProjectId').value;
            const variationCode = document.getElementById('variationCode').value;
            const estimatedHours = parseFloat(document.getElementById('variationHours').value);
            const scopeDescription = document.getElementById('variationScope').value;

            // --- Validation ---
            if (!variationCode) {
                alert('Please enter or generate a Variation Code.');
                return;
            }
            if (!estimatedHours || estimatedHours <= 0) {
                alert('Please enter valid Variation Hours (must be > 0).');
                return;
            }
            if (!scopeDescription || scopeDescription.trim().length < 10) {
                alert('Please provide a detailed Scope of Work (at least 10 characters).');
                return;
            }

            // --- Prepare Data ---
            const variationData = {
                parentProjectId: parentProjectId,
                variationCode: variationCode,
                estimatedHours: estimatedHours,
                scopeDescription: scopeDescription,
                status: 'pending_coo_approval' // Set status for COO
            };

            if (!confirm('This will submit the variation to the COO for approval. Continue?')) {
                return;
            }

            try {
                showLoading();
                
                // This assumes a new endpoint '/api/variations' exists on your backend
                // to create variation records.
                const response = await apiCall('variations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(variationData)
                });

                if (response.success) {
                    closeAddVariationModal();
                    // Use the existing success modal
                    showSuccessModal(
                        'Variation Submitted!',
                        `Your request for variation "${variationCode}" has been sent to the COO for approval.`
                    );
                    // --- ADD THIS LINE ---
                   triggerEmailNotification('variation.request', {
                    projectId: parentProjectId,
                    variationCode: variationCode,
                     hours: estimatedHours,
                      // Grab project name from the modal if available
                      projectName: document.getElementById('variationParentProjectName')?.textContent || 'Project'
    });
    // --------------------
                } else {
                    throw new Error(response.error || 'Failed to submit variation. Please check if the variation code is unique.');
                }

            } catch (error) {
                console.error('Error submitting variation:', error);
                alert(`Error: ${error.message}`);
            } finally {
                hideLoading();
            }
        }

    // ============================================
        // NEW: COO VARIATION APPROVAL FUNCTIONS
        // ============================================

        /**
         * Renders the table for pending variations.
         */
        function renderPendingVariationsTable(variations) {
            if (variations.length === 0) {
                return '<div class="card" style="padding: 2rem; text-align: center; color: var(--text-light);">No pending variations found.</div>';
            }

            const variationsHtml = variations.map(v => `
                <tr>
                    <td><strong>${v.parentProjectName}</strong><br><small>${v.clientCompany}</small></td>
                    <td><span class="project-number-badge" style="background: var(--warning); color: #856404;">${v.variationCode}</span></td>
                    <td><strong>${v.estimatedHours}h</strong></td>
                    <td>${v.createdByName} <br><small>(${v.createdByRole.replace('_', ' ')})</small></td>
                    <td>${formatDate(v.createdAt)}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="showVariationApprovalModal('${v.id}')">
                            Review
                        </button>
                    </td>
                </tr>
            `).join('');

            return `
                <div class="card">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Parent Project</th>
                                <th>Variation Code</th>
                                <th>Requested Hours</th>
                                <th>Submitted By</th>
                                <th>Date Submitted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${variationsHtml}
                        </tbody>
                    </table>
                </div>
            `;
        }

        /**
         * Fetches variation details and shows the approval modal.
         */
        async function showVariationApprovalModal(variationId) {
            try {
                showLoading();
                const response = await apiCall(`variations?id=${variationId}`);
                
                if (!response.success || !response.data) {
                    throw new Error(response.error || 'Failed to fetch variation details.');
                }
                
                const v = response.data;
                
                // Populate modal fields
                document.getElementById('approvalVariationId').value = v.id;
                document.getElementById('approvalParentProjectId').value = v.parentProjectId;
                document.getElementById('app-parentProjectName').textContent = v.parentProjectName;
                document.getElementById('app-clientCompany').textContent = v.clientCompany;
                document.getElementById('app-variationCode').textContent = v.variationCode;
                document.getElementById('app-estimatedHours').textContent = `${v.estimatedHours}h`;
                document.getElementById('app-submittedBy').textContent = `${v.createdByName} (${v.createdByRole.replace('_', ' ')})`;
                document.getElementById('app-scopeDescription').textContent = v.scopeDescription;
                document.getElementById('approvalNotes').value = ''; // Clear notes
                
                // Show the modal
                document.getElementById('variationApprovalModal').style.display = 'flex';
                
            } catch (error) {
                alert(`Error: ${error.message}`);
            } finally {
                hideLoading();
            }
        }

        /**
         * Submits the COO's decision (approve/reject) to the backend.
         */
        async function submitVariationApproval(decision) {
            const variationId = document.getElementById('approvalVariationId').value;
            const parentProjectId = document.getElementById('approvalParentProjectId').value;
            const notes = document.getElementById('approvalNotes').value.trim();
            const hours = parseFloat(document.getElementById('app-estimatedHours').textContent) || 0;

            if (decision === 'rejected' && !notes) {
                alert('A reason is required for rejection.');
                document.getElementById('approvalNotes').focus();
                return;
            }

            const confirmMsg = decision === 'approved'
                ? `Approve this variation? This will add ${hours}h to the project's budget.`
                : 'Reject this variation? This will notify the Design Manager.';

            if (!confirm(confirmMsg)) {
                return;
            }

            try {
                showLoading();
                
                const response = await apiCall(`variations?id=${variationId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'review_variation',
                        data: {
                            status: decision, // 'approved' or 'rejected'
                            notes: notes,
                            parentProjectId: parentProjectId,
                            approvedHours: hours
                        }
                    })
                });

                if (response.success) {
                    closeModal();
                    
                    // 1. Show success message
                    const actionText = decision === 'approved' ? 'Approved' : 'Rejected';
                    showSuccessModal(
                        `Variation ${actionText}`, 
                        `The variation request has been successfully ${actionText.toLowerCase()}.`
                    );

                    // 2. Trigger email notifications
                    if (decision === 'approved') {
                        await triggerEmailNotification('variation.approved', { 
                            variationId: variationId,
                            projectId: parentProjectId,
                            hours: hours
                        });
                    } else {
                        await triggerEmailNotification('variation.rejected', { 
                            variationId: variationId, 
                            projectId: parentProjectId,
                            reason: notes 
                        });
                    }

                    // 3. Refresh view
                    await showAllProjects();
                    
                } else {
                    throw new Error(response.error || 'Failed to process variation.');
                }

            } catch (error) {
                console.error('Variation approval error:', error);
                alert(`Error: ${error.message}`);
            } finally {
                hideLoading();
            }
        }
 

function calculateTotalHours() {
    const designHours = parseFloat(document.getElementById('designHours')?.value) || 0;
    const detailingHours = parseFloat(document.getElementById('detailingHours')?.value) || 0;
    const checkingHours = parseFloat(document.getElementById('checkingHours')?.value) || 0;
    const revisionHours = parseFloat(document.getElementById('revisionHours')?.value) || 0;
    const pmHours = parseFloat(document.getElementById('pmHours')?.value) || 0;
    
    const total = designHours + detailingHours + checkingHours + revisionHours + pmHours;
    
    const totalHoursInput = document.getElementById('totalHours');
    if (totalHoursInput) {
        totalHoursInput.value = total.toFixed(1);
        
        // ✅ CRITICAL FIX: Total Hours should NEVER be readonly for estimator
        // Remove any readonly attribute that might have been set
        totalHoursInput.removeAttribute('readonly');
        totalHoursInput.disabled = false;
        
        // Allow manual override of total hours
        totalHoursInput.style.backgroundColor = '#ffffff';
        totalHoursInput.style.cursor = 'text';
    }
    
    // ✅ CRITICAL FIX: Ensure all hour fields are editable
    const hourFields = [
        'designHours', 'detailingHours', 'checkingHours', 
        'revisionHours', 'pmHours'
    ];
    
    hourFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.removeAttribute('readonly');
            field.disabled = false;
            field.style.backgroundColor = '#ffffff';
        }
    });
}

/**
 * ✅ FIXED: Handle Tonnage Input
 */
function handleTonnageInput() {
    // ✅ FIXED: Tonnage is now just a reference value, NO auto-calculation
    // Just store the tonnage value, don't calculate design hours
    // Design hours must be entered manually by estimator
}

/**
 * ✅ NEW: Toggle tonnage checkbox (no auto-calculation)
 */
function toggleDesignHours() {
    const useTonnageCheckbox = document.getElementById('useTonnageForDesign');
    
    // This is just a UI checkbox, doesn't affect calculations
    // Tonnage is stored as reference data only
    // All hours must be entered manually by estimator
    
    if (useTonnageCheckbox && useTonnageCheckbox.checked) {
        console.log('✅ Tonnage checkbox enabled - storing tonnage as reference data');
    } else {
        console.log('✅ Tonnage checkbox disabled');
    }
}
  

// ============================================
    // ✅ GLOBAL FILE UPLOAD FUNCTION (MUST BE HERE)
    // ============================================
    async function uploadFileDirectly(file, proposalId, fileType) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🚀 Uploading: ${file.name}`);
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('proposalId', proposalId || '');
            formData.append('fileType', fileType || 'project');
            
            // console.log('📤 Sending to backend...');
            
            const response = await apiCall('files/upload-file', {
                method: 'POST',
                body: formData
            });
            
            if (!response.success) {
                throw new Error(response.error || 'Upload failed');
            }
            
            console.log('✅ Upload successful!');
            return response.data;
            
        } catch (error) {
            console.error('❌ UPLOAD FAILED:', file.name, error.message);
            throw error;
        }
    }


        function switchDesignerTab(tabName) {
            // Update tab buttons
            document.querySelectorAll('.doc-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Update content visibility
            document.getElementById('designer-drawings-content').style.display = 'none';
            document.getElementById('designer-specs-content').style.display = 'none';
            
            if (tabName === 'drawings') {
                document.getElementById('designer-drawings-content').style.display = 'block';
            } else {
                document.getElementById('designer-specs-content').style.display = 'block';
            }
        }
    </script>
<div id="cooMultiDesignerAllocationModal" class="modal" style="display: none;">
    <div class="modal-content new-modal allocation-modal-large" style="max-width: 900px;">
        <div class="modal-header">
            <div>
                <h2>👥 Allocate Project to Multiple Designers</h2>
                <div class="subtitle">Divide project hours among team members</div>
            </div>
            <span class="close-modal" onclick="closeCooMultiDesignerModal()">&times;</span>
        </div>
        
        <div class="modal-body">
            <input type="hidden" id="cooAllocProjectId" />
            
            <!-- Project Summary -->
            <div class="allocation-details-section" style="margin-bottom: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 12px;">
                <h3 style="color: white; margin-bottom: 1rem;">📋 Project Information</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                    <div>
                        <label style="font-size: 0.85rem; opacity: 0.9;">Project Number:</label>
                        <div id="cooAllocProjectNumber" style="font-size: 1.2rem; font-weight: 700;"></div>
                    </div>
                    <div>
                        <label style="font-size: 0.85rem; opacity: 0.9;">Project Name:</label>
                        <div id="cooAllocProjectName" style="font-size: 1rem; font-weight: 600;"></div>
                    </div>
                    <div>
                        <label style="font-size: 0.85rem; opacity: 0.9;">Client:</label>
                        <div id="cooAllocClientName" style="font-size: 1rem; font-weight: 600;"></div>
                    </div>
                </div>
            </div>
            
            <!-- Total Hours Input -->
            <div class="form-section" style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem;">
                <h3 style="color: var(--text-dark); margin-bottom: 1rem;">⏱️ Total Project Hours</h3>
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label for="cooTotalProjectHours">Total Allocated Hours <span class="required">*</span></label>
                        <input type="number" id="cooTotalProjectHours" class="form-control" 
                               placeholder="e.g., 120" min="1" step="0.5" 
                               oninput="updateRemainingHours()" required>
                        <small class="form-text">Total hours budget for this project</small>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>Remaining Hours to Allocate</label>
                        <div id="cooRemainingHours" style="font-size: 2rem; font-weight: 700; color: var(--success); padding: 0.5rem;">
                            0 hrs
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Designer Allocations -->
            <div class="form-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="color: var(--text-dark); margin: 0;">👨‍💼 Designer Allocations</h3>
                    <button type="button" class="btn btn-outline" onclick="addDesignerAllocation()">
                        <span style="font-size: 1.2rem;">+</span> Add Designer
                    </button>
                </div>
                
                <div id="designerAllocationsContainer">
                    <!-- Designer allocation rows will be added here dynamically -->
                </div>
            </div>
            
            <!-- Project Details -->
            <div class="form-section" style="margin-top: 2rem;">
                <h3 style="color: var(--text-dark); margin-bottom: 1rem;">📝 Project Details</h3>
                
                <div class="form-row">
                    <div class="form-group" style="flex: 1;">
                        <label for="cooTargetCompletionDate">Target Completion Date</label>
                        <input type="date" id="cooTargetCompletionDate" class="form-control">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label for="cooProjectPriority">Project Priority</label>
                        <select id="cooProjectPriority" class="form-control">
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="cooAllocationNotes">Allocation Notes</label>
                    <textarea id="cooAllocationNotes" class="form-control" rows="3"
                              placeholder="Add any special instructions or notes for the design team..."></textarea>
                </div>
            </div>
        </div>
        
        <div class="modal-footer">
            <button type="button" class="btn btn-cancel" onclick="closeCooMultiDesignerModal()">Cancel</button>
            <button type="button" class="btn btn-success btn-large" onclick="submitCooMultiDesignerAllocation()">
                <span class="btn-icon">✓</span> Allocate Project
            </button>
        </div>
    </div>
</div>
</body>
                                
</html>
