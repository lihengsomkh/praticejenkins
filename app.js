/* ==========================================
   Nexus Dashboard Interactive Application Engine
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // App State Manager
  const state = {
    theme: localStorage.getItem('nexus_theme') || 'dark',
    activeTimeframe: '30d',
    statusFilter: 'all',
    searchQuery: '',
    currentPage: 1,
    itemsPerPage: 5,
    notificationsUnread: true,
  };

  // Mock Datasets
  const datasets = {
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      revenue: [12400, 15800, 14200, 18900, 22100, 19400, 26000],
      expenses: [6100, 7200, 6800, 8400, 9200, 8100, 9800]
    },
    '30d': {
      labels: ['Sep 01', 'Sep 04', 'Sep 07', 'Sep 10', 'Sep 13', 'Sep 16', 'Sep 19'],
      revenue: [82000, 94000, 88000, 105000, 112000, 118000, 128430],
      expenses: [41000, 43000, 39000, 48000, 51000, 49000, 54200]
    },
    '90d': {
      labels: ['Month 1', 'Month 2', 'Month 3'],
      revenue: [290000, 340000, 385000],
      expenses: [140000, 155000, 168000]
    },
    '1y': {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      revenue: [850000, 980000, 1120000, 1284300],
      expenses: [420000, 460000, 510000, 560000]
    }
  };

  const categories = [
    { name: 'Electronics', percentage: 45, color: '#6366f1', value: '$57,793' },
    { name: 'Software', percentage: 25, color: '#06b6d4', value: '$32,107' },
    { name: 'Services', percentage: 18, color: '#10b981', value: '$23,117' },
    { name: 'Accessories', percentage: 12, color: '#f43f5e', value: '$15,413' }
  ];

  const orders = [
    { id: '#NX-9821', customer: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', date: 'Sep 20, 2026', amount: '$1,420.00', method: 'Credit Card', status: 'Completed' },
    { id: '#NX-9820', customer: 'Marcus Brody', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', date: 'Sep 20, 2026', amount: '$850.50', method: 'PayPal', status: 'Pending' },
    { id: '#NX-9819', customer: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', date: 'Sep 19, 2026', amount: '$3,100.00', method: 'Bank Transfer', status: 'Completed' },
    { id: '#NX-9818', customer: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', date: 'Sep 19, 2026', amount: '$420.00', method: 'Credit Card', status: 'Processing' },
    { id: '#NX-9817', customer: 'Amara Okafor', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80', date: 'Sep 18, 2026', amount: '$2,840.00', method: 'Apple Pay', status: 'Completed' },
    { id: '#NX-9816', customer: 'Lucas Vance', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80', date: 'Sep 18, 2026', amount: '$190.00', method: 'Credit Card', status: 'Failed' },
    { id: '#NX-9815', customer: 'Chloe Zhang', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80', date: 'Sep 17, 2026', amount: '$990.00', method: 'PayPal', status: 'Completed' },
    { id: '#NX-9814', customer: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80', date: 'Sep 17, 2026', amount: '$4,150.00', method: 'Bank Transfer', status: 'Completed' },
    { id: '#NX-9813', customer: 'Nina Patel', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80', date: 'Sep 16, 2026', amount: '$630.00', method: 'Credit Card', status: 'Pending' },
    { id: '#NX-9812', customer: 'Robert Taylor', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80', date: 'Sep 16, 2026', amount: '$1,800.00', method: 'Apple Pay', status: 'Processing' },
    { id: '#NX-9811', customer: 'Sophia Martinez', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&q=80', date: 'Sep 15, 2026', amount: '$2,400.00', method: 'Credit Card', status: 'Completed' },
    { id: '#NX-9810', customer: 'Ethan Hunt', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&q=80', date: 'Sep 15, 2026', amount: '$750.00', method: 'PayPal', status: 'Completed' },
  ];

  // Initialize Theme
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
  }

  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('nexus_theme', state.theme);
    showToast(`Switched to ${state.theme} mode`, 'info');
    // Redraw charts to update text color styles
    renderMainChart();
    renderSparklines();
  });

  // Sidebar Controls
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  sidebarToggle.addEventListener('click', () => sidebar.classList.add('open'));
  sidebarCloseBtn.addEventListener('click', () => sidebar.classList.remove('open'));

  // Nav Item Switching
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const tabName = item.dataset.tab;
      showToast(`Navigated to ${tabName.toUpperCase()}`, 'info');
    });
  });

  // Notifications Dropdown
  const notifBtn = document.getElementById('notifBtn');
  const notifWrapper = notifBtn.closest('.dropdown-wrapper');
  const clearNotifsBtn = document.getElementById('clearNotifsBtn');
  const pulseDot = notifBtn.querySelector('.pulse-dot');

  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifWrapper.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!notifWrapper.contains(e.target)) {
      notifWrapper.classList.remove('active');
    }
  });

  clearNotifsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.notif-item').forEach(el => el.classList.remove('unread'));
    if (pulseDot) pulseDot.style.display = 'none';
    const badge = notifWrapper.querySelector('.badge');
    if (badge) badge.textContent = '0 New';
    showToast('Notifications marked as read', 'success');
  });

  // Main Canvas Chart Engine (Bezier Line & Gradient Area)
  const canvas = document.getElementById('mainChart');
  const ctx = canvas.getContext('2d');
  const chartTooltip = document.getElementById('chartTooltip');

  let activeDataPoints = [];

  function setupCanvasResolution() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    return { width: rect.width, height: rect.height };
  }

  function renderMainChart() {
    const { width, height } = setupCanvasResolution();
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const data = datasets[state.activeTimeframe];
    const maxVal = Math.max(...data.revenue, ...data.expenses) * 1.15;

    const isDark = state.theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    // Grid lines & Y-axis labels
    const gridRows = 5;
    ctx.font = '11px "Plus Jakarta Sans"';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';

    for (let i = 0; i <= gridRows; i++) {
      const y = padding.top + (chartHeight / gridRows) * i;
      const val = Math.round(maxVal - (maxVal / gridRows) * i);

      // Line
      ctx.beginPath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y Text
      ctx.fillText(`$${(val / 1000).toFixed(0)}k`, padding.left - 10, y + 4);
    }

    // X-axis Labels
    ctx.textAlign = 'center';
    const xStep = chartWidth / (data.labels.length - 1);
    const revPoints = [];
    const expPoints = [];

    data.labels.forEach((label, i) => {
      const x = padding.left + i * xStep;
      ctx.fillText(label, x, height - 10);

      const revY = padding.top + chartHeight - (data.revenue[i] / maxVal) * chartHeight;
      const expY = padding.top + chartHeight - (data.expenses[i] / maxVal) * chartHeight;

      revPoints.push({ x, y: revY, val: data.revenue[i], label });
      expPoints.push({ x, y: expY, val: data.expenses[i], label });
    });

    activeDataPoints = revPoints.map((p, i) => ({
      x: p.x,
      revY: p.y,
      revVal: p.val,
      expY: expPoints[i].y,
      expVal: expPoints[i].val,
      label: p.label
    }));

    // Render Area Fill under Revenue
    const revGrad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    revGrad.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
    revGrad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    drawSmoothPath(ctx, revPoints, true, revGrad, padding.top + chartHeight);
    // Draw Revenue Line
    drawSmoothPath(ctx, revPoints, false, '#6366f1', null, 3);

    // Render Area Fill under Expenses
    const expGrad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    expGrad.addColorStop(0, 'rgba(236, 72, 153, 0.25)');
    expGrad.addColorStop(1, 'rgba(236, 72, 153, 0.0)');

    drawSmoothPath(ctx, expPoints, true, expGrad, padding.top + chartHeight);
    // Draw Expenses Line
    drawSmoothPath(ctx, expPoints, false, '#ec4899', null, 3);

    // Draw Points
    revPoints.forEach(p => drawPoint(ctx, p.x, p.y, '#6366f1'));
    expPoints.forEach(p => drawPoint(ctx, p.x, p.y, '#ec4899'));
  }

  function drawSmoothPath(ctx, points, fill = false, style, bottomY = 0, strokeWidth = 2) {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

    if (fill) {
      ctx.lineTo(points[points.length - 1].x, bottomY);
      ctx.lineTo(points[0].x, bottomY);
      ctx.closePath();
      ctx.fillStyle = style;
      ctx.fill();
    } else {
      ctx.strokeStyle = style;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
  }

  function drawPoint(ctx, x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = state.theme === 'dark' ? '#0f172a' : '#ffffff';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  // Canvas Hover Tooltip Interaction
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    let closest = null;
    let minDistance = Infinity;

    activeDataPoints.forEach(p => {
      const dist = Math.abs(p.x - mouseX);
      if (dist < minDistance && dist < 30) {
        minDistance = dist;
        closest = p;
      }
    });

    if (closest) {
      chartTooltip.style.opacity = '1';
      chartTooltip.style.left = `${closest.x - 40}px`;
      chartTooltip.style.top = `${closest.revY - 50}px`;
      chartTooltip.innerHTML = `
        <div style="font-weight:700; margin-bottom:4px;">${closest.label}</div>
        <div style="color:#6366f1;">Revenue: $${closest.revVal.toLocaleString()}</div>
        <div style="color:#ec4899;">Expenses: $${closest.expVal.toLocaleString()}</div>
      `;
    } else {
      chartTooltip.style.opacity = '0';
    }
  });

  canvas.addEventListener('mouseleave', () => {
    chartTooltip.style.opacity = '0';
  });

  // Timeframe Selector Buttons
  document.getElementById('timeframeSelector').addEventListener('click', (e) => {
    if (e.target.classList.contains('pill-btn')) {
      document.querySelectorAll('#timeframeSelector .pill-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.activeTimeframe = e.target.dataset.range;
      renderMainChart();
      showToast(`Updated chart view to ${state.activeTimeframe.toUpperCase()}`, 'info');
    }
  });

  // Metric Sparklines Renderer
  function renderSparklines() {
    const sparkData = [
      [10, 25, 18, 30, 42, 38, 55],
      [40, 35, 50, 45, 60, 58, 70],
      [15, 20, 28, 32, 45, 60, 78],
      [65, 58, 52, 48, 42, 38, 32]
    ];
    const colors = ['#6366f1', '#10b981', '#06b6d4', '#f43f5e'];

    [1, 2, 3, 4].forEach((id, idx) => {
      const c = document.getElementById(`sparkline${id}`);
      if (!c) return;
      const ctxS = c.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const rect = c.parentElement.getBoundingClientRect();
      c.width = rect.width * dpr;
      c.height = 40 * dpr;
      ctxS.scale(dpr, dpr);

      const points = sparkData[idx];
      const max = Math.max(...points);
      const min = Math.min(...points);
      const step = rect.width / (points.length - 1);

      ctxS.beginPath();
      points.forEach((val, i) => {
        const x = i * step;
        const y = 35 - ((val - min) / (max - min || 1)) * 30;
        if (i === 0) ctxS.moveTo(x, y);
        else ctxS.lineTo(x, y);
      });

      ctxS.strokeStyle = colors[idx];
      ctxS.lineWidth = 2.5;
      ctxS.stroke();
    });
  }

  // SVG Donut Chart Component Engine
  function renderDonutChart() {
    const svg = document.getElementById('donutSvg');
    const legendContainer = document.getElementById('donutLegend');
    svg.innerHTML = '';
    legendContainer.innerHTML = '';

    let accumulatedPercentage = 0;

    categories.forEach((cat) => {
      // Calculate Dash Properties for SVG Circle
      const radius = 40;
      const circumference = 2 * Math.PI * radius; // ~251.32
      const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -((accumulatedPercentage / 100) * circumference);

      accumulatedPercentage += cat.percentage;

      // Circle Segment
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'donut-segment');
      circle.setAttribute('cx', '50');
      circle.setAttribute('cy', '50');
      circle.setAttribute('r', radius.toString());
      circle.setAttribute('stroke', cat.color);
      circle.setAttribute('stroke-dasharray', strokeDasharray);
      circle.setAttribute('stroke-dashoffset', strokeDashoffset.toString());
      svg.appendChild(circle);

      // Legend Item
      const item = document.createElement('div');
      item.className = 'donut-legend-item';
      item.innerHTML = `
        <div class="legend-info">
          <span class="legend-dot" style="background-color: ${cat.color}"></span>
          <span>${cat.name}</span>
        </div>
        <div><strong>${cat.percentage}%</strong> <span style="color:var(--text-subtle)">(${cat.value})</span></div>
      `;
      legendContainer.appendChild(item);
    });
  }

  // Orders Table Rendering Engine
  function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    const tableInfo = document.getElementById('tableInfo');

    // Filter Logic
    let filtered = orders.filter(ord => {
      const matchesStatus = state.statusFilter === 'all' || ord.status === state.statusFilter;
      const matchesSearch = ord.customer.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                            ord.id.toLowerCase().includes(state.searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    const total = filtered.length;
    const startIdx = (state.currentPage - 1) * state.itemsPerPage;
    const paginated = filtered.slice(startIdx, startIdx + state.itemsPerPage);

    tbody.innerHTML = '';

    if (paginated.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--text-subtle);">No matching orders found.</td></tr>`;
      tableInfo.textContent = 'Showing 0 orders';
      return;
    }

    paginated.forEach(order => {
      const tr = document.createElement('tr');
      const statusClass = `status-${order.status.toLowerCase()}`;

      tr.innerHTML = `
        <td><strong>${order.id}</strong></td>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${order.avatar}" alt="" style="width:28px; height:28px; border-radius:50%; object-fit:cover;">
            <span>${order.customer}</span>
          </div>
        </td>
        <td style="color: var(--text-muted);">${order.date}</td>
        <td><strong>${order.amount}</strong></td>
        <td>${order.method}</td>
        <td><span class="status-badge ${statusClass}">${order.status}</span></td>
        <td class="text-right">
          <button class="btn btn-sm btn-outline view-order-btn" data-id="${order.id}">View</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tableInfo.textContent = `Showing ${startIdx + 1} to ${Math.min(startIdx + state.itemsPerPage, total)} of ${total} orders`;

    // Bind Detail Modal Click
    document.querySelectorAll('.view-order-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.dataset.id;
        openModal(orderId);
      });
    });
  }

  // Filter & Search Controls
  document.getElementById('statusFilter').addEventListener('change', (e) => {
    state.statusFilter = e.target.value;
    state.currentPage = 1;
    renderOrdersTable();
  });

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    state.currentPage = 1;
    renderOrdersTable();
  });

  // Global Search Shortcut ⌘K / Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Modal Interaction Engine
  const modalOverlay = document.getElementById('detailModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismiss = document.getElementById('modalDismiss');
  const modalPrint = document.getElementById('modalPrint');

  function openModal(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    modalTitle.textContent = `Invoice Details - ${order.id}`;
    modalBody.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
          <span style="color:var(--text-muted)">Customer Name:</span>
          <strong>${order.customer}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
          <span style="color:var(--text-muted)">Date Processed:</span>
          <span>${order.date}</span>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
          <span style="color:var(--text-muted)">Payment Method:</span>
          <span>${order.method}</span>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
          <span style="color:var(--text-muted)">Fulfillment Status:</span>
          <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:1.1rem; padding-top:4px;">
          <strong>Total Paid:</strong>
          <strong style="color:var(--color-primary)">${order.amount}</strong>
        </div>
      </div>
    `;
    modalOverlay.classList.add('active');
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalDismiss.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  modalPrint.addEventListener('click', () => {
    showToast('Invoice sent to printer', 'success');
    closeModal();
  });

  // Action Buttons Feedback
  document.getElementById('exportBtn').addEventListener('click', () => {
    showToast('Exporting CSV report...', 'success');
  });

  document.getElementById('addReportBtn').addEventListener('click', () => {
    showToast('Custom metric widget added to grid', 'info');
  });

  document.getElementById('upgradeBtn').addEventListener('click', () => {
    showToast('Nexus Pro Plan subscription modal triggered', 'info');
  });

  // Toast Notification System
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';

    toast.innerHTML = `
      <span>${icon}</span>
      <div>${message}</div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Initial Window Resizing Handler
  window.addEventListener('resize', () => {
    renderMainChart();
    renderSparklines();
  });

  // Kickstart Render Execution
  initTheme();
  renderMainChart();
  renderSparklines();
  renderDonutChart();
  renderOrdersTable();
});
