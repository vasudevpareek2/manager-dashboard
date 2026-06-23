<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root {
      --ink: #14212b;
      --ink-strong: #0d1820;
      --muted: #667789;
      --line: #dce5ec;
      --line-soft: #ebf0f4;
      --soft: #f6f8fa;
      --panel: #ffffff;
      --panel-soft: #fbfcfd;
      --brand: #087c68;
      --brand-dark: #055d50;
      --brand-soft: #e7f6f2;
      --blue: #2f66d8;
      --red: #cf3b3b;
      --amber: #b56a12;
      --green: #158052;
      --shadow-sm: 0 1px 2px rgba(15, 30, 42, 0.06), 0 8px 22px rgba(15, 30, 42, 0.08);
      --shadow: 0 18px 44px rgba(15, 30, 42, 0.18);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      color: var(--ink);
      background:
        linear-gradient(180deg, #edf4f2 0, #f5f7f9 240px, #f3f6f8 100%);
      font: 13px/1.45 Inter, "Segoe UI", Arial, Helvetica, sans-serif;
    }

    button,
    input,
    select {
      font: inherit;
    }

    .app-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 12;
      background:
        linear-gradient(135deg, #10202a 0%, #132b32 52%, #0a4f48 100%);
      color: #fff;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 16px 22px;
      display: grid;
      grid-template-columns: minmax(220px, 1fr) auto;
      gap: 16px;
      align-items: center;
      box-shadow: 0 12px 34px rgba(9, 23, 31, 0.24);
    }

    .brand-block {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-copy {
      min-width: 0;
    }

    .brand-mark {
      width: 42px;
      height: 42px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #062019;
      background: #8de0c8;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.54), 0 10px 24px rgba(0, 0, 0, 0.24);
      font-weight: 800;
      letter-spacing: 0;
      flex: 0 0 auto;
    }

    .brand-title {
      margin: 0;
      font-size: 21px;
      line-height: 1.15;
      letter-spacing: 0;
      font-weight: 750;
    }

    .brand-meta {
      color: rgba(255, 255, 255, 0.72);
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .actions {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: flex-end;
    }

    .icon-btn,
    .primary-btn,
    .ghost-btn {
      min-height: 36px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 8px 12px;
      white-space: nowrap;
      transition: transform 140ms ease, border-color 140ms ease, background 140ms ease, box-shadow 140ms ease;
    }

    .icon-btn {
      width: 36px;
      padding: 0;
      font-size: 18px;
      line-height: 1;
    }

    .primary-btn {
      background: #8de0c8;
      border-color: #8de0c8;
      color: #062019;
      font-weight: 700;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
    }

    .primary-btn:hover {
      background: #a2ead6;
      border-color: #a2ead6;
      transform: translateY(-1px);
    }

    .ghost-btn:hover,
    .icon-btn:hover {
      border-color: rgba(255, 255, 255, 0.35);
      background: rgba(255, 255, 255, 0.14);
      transform: translateY(-1px);
    }

    .filters {
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid rgba(208, 219, 226, 0.86);
      border-radius: 8px;
      padding: 14px;
      margin: 16px 18px 0;
      display: grid;
      grid-template-columns: repeat(6, minmax(132px, 1fr));
      gap: 12px;
      align-items: end;
      box-shadow: var(--shadow-sm);
      backdrop-filter: blur(10px);
    }

    .field {
      min-width: 0;
    }

    .field label {
      display: block;
      color: #536576;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    .field select,
    .field input {
      width: 100%;
      min-height: 38px;
      border: 1px solid #d6e0e7;
      border-radius: 6px;
      background: #fff;
      color: var(--ink);
      padding: 7px 10px;
      outline: none;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
      transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;
    }

    .field select:focus,
    .field input:focus {
      border-color: var(--brand);
      box-shadow: 0 0 0 3px rgba(8, 124, 104, 0.14);
    }

    .tabbar {
      background: rgba(255, 255, 255, 0.76);
      border: 1px solid rgba(214, 224, 231, 0.9);
      border-radius: 8px;
      margin: 12px 18px 0;
      padding: 5px;
      display: flex;
      gap: 4px;
      overflow-x: auto;
      box-shadow: var(--shadow-sm);
      backdrop-filter: blur(8px);
    }

    .tab {
      appearance: none;
      border: 0;
      border-radius: 6px;
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      padding: 9px 12px;
      font-weight: 700;
      white-space: nowrap;
      transition: color 140ms ease, background 140ms ease, box-shadow 140ms ease;
    }

    .tab.active {
      color: #fff;
      background: var(--brand);
      box-shadow: 0 8px 18px rgba(8, 124, 104, 0.24);
    }

    .tab:hover:not(.active) {
      color: var(--ink);
      background: #edf4f2;
    }

    .content {
      padding: 16px 18px 28px;
      flex: 1;
      min-height: 0;
    }

    .status-line {
      color: var(--muted);
      margin: 0 0 12px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-height: 28px;
      border: 1px solid rgba(214, 224, 231, 0.86);
      background: rgba(255, 255, 255, 0.76);
      border-radius: 999px;
      padding: 4px 10px;
      box-shadow: 0 5px 14px rgba(15, 30, 42, 0.05);
    }

    .loading-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #8de0c8;
      display: inline-block;
      animation: pulse 1s infinite ease-in-out;
      box-shadow: 0 0 0 4px rgba(8, 124, 104, 0.1);
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(0.75); }
      50% { opacity: 1; transform: scale(1); }
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(8, minmax(118px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }

    .metric {
      position: relative;
      background:
        linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%);
      border: 1px solid rgba(214, 224, 231, 0.9);
      border-radius: 8px;
      padding: 13px 14px 12px;
      min-height: 92px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .metric::before {
      content: "";
      position: absolute;
      inset: 0 0 auto;
      height: 3px;
      background: linear-gradient(90deg, var(--brand), #d19a2a);
    }

    .metric span {
      color: var(--muted);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .metric strong {
      color: var(--ink-strong);
      font-size: 26px;
      letter-spacing: 0;
      line-height: 1.1;
      margin-top: 8px;
    }

    .metric small {
      color: var(--muted);
      margin-top: 4px;
    }

    .view {
      display: none;
    }

    .view.active {
      display: block;
    }

    .split {
      display: grid;
      grid-template-columns: minmax(320px, 1.1fr) minmax(320px, 0.9fr);
      gap: 16px;
    }

    .section {
      background: var(--panel);
      border: 1px solid rgba(214, 224, 231, 0.9);
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 16px;
      box-shadow: var(--shadow-sm);
    }

    .section-header {
      padding: 13px 14px;
      border-bottom: 1px solid var(--line-soft);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      background:
        linear-gradient(180deg, #ffffff 0%, #f8fbfb 100%);
    }

    .section-title {
      margin: 0;
      font-size: 14.5px;
      letter-spacing: 0;
      color: var(--ink-strong);
    }

    .section-subtitle {
      color: var(--muted);
      font-size: 12px;
    }

    .table-wrap {
      width: 100%;
      overflow: auto;
      max-height: 68vh;
      scrollbar-color: #a9bac5 #eef3f5;
      scrollbar-width: thin;
    }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      min-width: 780px;
      font-variant-numeric: tabular-nums;
    }

    th,
    td {
      border-bottom: 1px solid var(--line-soft);
      border-right: 1px solid #eef3f5;
      padding: 8px 10px;
      text-align: left;
      vertical-align: middle;
      background: var(--panel);
    }

    th {
      position: sticky;
      top: 0;
      z-index: 2;
      background: #f2f7f6;
      color: #40515f;
      font-size: 11px;
      line-height: 1.25;
      text-transform: uppercase;
      box-shadow: inset 0 -1px 0 var(--line);
    }

    th:first-child,
    td:first-child {
      position: sticky;
      left: 0;
      z-index: 3;
      border-left: 0;
      box-shadow: 1px 0 0 var(--line-soft);
    }

    th:first-child {
      z-index: 4;
      background: #e9f3f0;
    }

    tbody tr:hover td {
      background: #f8fcfb;
    }

    .seller-cell {
      min-width: 210px;
    }

    .seller-cell strong {
      display: block;
      max-width: 230px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--ink-strong);
    }

    .seller-cell span,
    .muted {
      color: var(--muted);
    }

    .num {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    .stage-table {
      min-width: 1850px;
    }

    .stage-heading {
      min-width: 126px;
      text-transform: none;
    }

    .stage-counts {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
      min-width: 110px;
    }

    .count-btn {
      appearance: none;
      border: 1px solid var(--line-soft);
      border-radius: 6px;
      background: #fff;
      min-height: 30px;
      padding: 3px 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      box-shadow: 0 1px 0 rgba(15, 30, 42, 0.04);
      transition: transform 120ms ease, border-color 120ms ease, background 120ms ease, box-shadow 120ms ease;
    }

    .count-btn.open { color: var(--blue); border-color: rgba(47, 102, 216, 0.26); background: #f3f7ff; }
    .count-btn.lost { color: var(--red); border-color: rgba(207, 59, 59, 0.24); background: #fff6f6; }
    .count-btn.won { color: var(--green); border-color: rgba(21, 128, 82, 0.24); background: #f0faf5; }
    .count-btn.empty { color: #b6c0ca; cursor: default; background: #f9fafb; }

    .count-btn:not(.empty):hover {
      background: #fff;
      border-color: var(--brand);
      box-shadow: 0 8px 18px rgba(8, 124, 104, 0.14);
      transform: translateY(-1px);
    }

    .mini-labels {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
      color: var(--muted);
      font-size: 10px;
      margin-top: 6px;
      text-align: center;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      border-radius: 999px;
      padding: 3px 8px;
      font-weight: 700;
      font-size: 11px;
      white-space: nowrap;
      border: 1px solid transparent;
    }

    .pill.open { background: #edf4ff; color: var(--blue); border-color: #d6e3ff; }
    .pill.lost { background: #fff2f2; color: var(--red); border-color: #ffdada; }
    .pill.won { background: #edf9f3; color: var(--green); border-color: #d4f0df; }
    .pill.warn { background: #fff6e3; color: var(--amber); border-color: #f2dfb8; }
    .pill.gray { background: #eef2f5; color: #475569; border-color: #dde5eb; }

    .bar-list {
      padding: 12px 14px 14px;
      display: grid;
      gap: 12px;
    }

    .bar-row {
      display: grid;
      grid-template-columns: minmax(130px, 190px) 1fr 56px;
      align-items: center;
      gap: 10px;
      color: #354757;
    }

    .bar-track {
      height: 10px;
      border-radius: 999px;
      background: #e7edf1;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--brand), #d19a2a);
      border-radius: inherit;
    }

    .empty-state {
      padding: 34px 16px;
      text-align: center;
      color: var(--muted);
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(12, 24, 32, 0.52);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 20;
    }

    .modal-backdrop.active {
      display: flex;
    }

    .modal {
      width: min(1180px, 96vw);
      max-height: 88vh;
      background: var(--panel);
      border-radius: 8px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .modal-header {
      padding: 12px 14px;
      border-bottom: 1px solid var(--line-soft);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: #f7fbfa;
    }

    .modal .icon-btn {
      color: var(--ink);
      background: #fff;
      border-color: var(--line);
      box-shadow: 0 1px 0 rgba(15, 30, 42, 0.04);
    }

    .modal .icon-btn:hover {
      color: var(--ink-strong);
      background: #edf4f2;
      border-color: #b9c8d2;
    }

    .modal-title {
      margin: 0;
      font-size: 16px;
      letter-spacing: 0;
    }

    .modal-body {
      padding: 0;
      overflow: auto;
    }

    .detail-table {
      min-width: 1650px;
    }

    .detail-table th:first-child,
    .detail-table td:first-child {
      min-width: 130px;
    }

    .toast {
      position: fixed;
      right: 18px;
      bottom: 18px;
      max-width: min(420px, 92vw);
      background: #10202a;
      color: #fff;
      border-radius: 8px;
      padding: 12px 14px;
      box-shadow: var(--shadow);
      display: none;
      z-index: 30;
    }

    .toast.active {
      display: block;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-top: 1px solid var(--line);
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination span {
      color: var(--muted);
      font-size: 13px;
    }

    body.app-loading {
      pointer-events: none;
    }

    body.app-loading::before {
      content: '';
      position: fixed;
      inset: 0;
      background: rgba(255, 255, 255, 0.7);
      z-index: 999;
    }

    @media (max-width: 1180px) {
      .filters {
        grid-template-columns: repeat(3, minmax(140px, 1fr));
      }

      .metric-grid {
        grid-template-columns: repeat(4, minmax(118px, 1fr));
      }

      .split {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 720px) {
      .topbar {
        grid-template-columns: 1fr;
        padding: 14px;
      }

      .actions {
        justify-content: flex-start;
        flex-wrap: wrap;
      }

      .filters {
        grid-template-columns: 1fr;
        margin: 12px;
      }

      .tabbar {
        margin: 12px 12px 0;
      }

      .metric-grid {
        grid-template-columns: repeat(2, minmax(118px, 1fr));
      }

      .content {
        padding: 12px;
      }
    }
  </style>
</head>
<body>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand-block">
        <div class="brand-mark" aria-hidden="true">TP</div>
        <div class="brand-copy">
          <h1 class="brand-title">Thrillophilia Manager Dashboard</h1>
          <div class="brand-meta" id="generatedAt">Loading sheet data...</div>
        </div>
      </div>
      <div class="actions">
        <button class="ghost-btn" id="resetBtn" type="button" title="Reset filters">Reset</button>
        <button class="primary-btn" id="refreshBtn" type="button" title="Refresh dashboard">Refresh</button>
      </div>
    </header>

    <section class="filters" aria-label="Dashboard filters">
      <div class="field">
        <label for="l1Manager">L1 Manager</label>
        <select id="l1Manager"></select>
      </div>
      <div class="field">
        <label for="l2Manager">L2 Manager</label>
        <select id="l2Manager"></select>
      </div>
      <div class="field">
        <label for="region">Region</label>
        <select id="region"></select>
      </div>
      <div class="field">
        <label for="sellerStatus">Seller Status</label>
        <select id="sellerStatus"></select>
      </div>
      <div class="field">
        <label for="sellerEmail">Seller</label>
        <select id="sellerEmail"></select>
      </div>
      <div class="field">
        <label for="state">Lead State</label>
        <select id="state">
          <option value="">All states</option>
          <option value="open" selected>Open</option>
          <option value="lost">Lost</option>
          <option value="won">Won</option>
        </select>
      </div>
      <div class="field">
        <label for="startDate">Created From</label>
        <input id="startDate" type="date">
      </div>
      <div class="field">
        <label for="endDate">Created To</label>
        <input id="endDate" type="date">
      </div>
    </section>

    <nav class="tabbar" aria-label="Dashboard views">
      <button class="tab" data-view="overview" type="button">Overview</button>
      <button class="tab active" data-view="stage" type="button">Stage Wise View</button>
      <button class="tab" data-view="manager" type="button">Manager View</button>
      <button class="tab" data-view="activity" type="button">Activity</button>
      <button class="tab" data-view="aging" type="button">Aging</button>
      <button class="tab" data-view="quality" type="button">Quality</button>
    </nav>

    <main class="content">
      <p class="status-line" id="statusLine"><span class="loading-dot"></span> Preparing dashboard...</p>

      <section class="view" id="view-overview">
        <div class="metric-grid" id="summaryMetrics"></div>
        <div class="split">
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">Top Open Load</h2>
              <span class="section-subtitle">Sellers with the most open leads</span>
            </div>
            <div id="topOpenList" class="bar-list"></div>
          </section>
          <section class="section">
            <div class="section-header">
              <h2 class="section-title">Stage Distribution</h2>
              <span class="section-subtitle">Across filtered leads</span>
            </div>
            <div id="stageDistribution" class="bar-list"></div>
          </section>
        </div>
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Attention Queue</h2>
            <span class="section-subtitle">Callbacks, missed connects, and unquoted open leads</span>
          </div>
          <div class="table-wrap">
            <table id="overviewAttentionTable"></table>
          </div>
        </section>
      </section>

      <section class="view active" id="view-stage">
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Stage Wise View</h2>
            <span class="section-subtitle">Each stage shows Open, Lost, Won counts; click any count for lead details</span>
          </div>
          <div class="table-wrap">
            <table class="stage-table" id="stageTable"></table>
          </div>
        </section>
      </section>

      <section class="view" id="view-manager">
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Manager View</h2>
            <span class="section-subtitle">L1 manager level ownership and conversion</span>
          </div>
          <div class="table-wrap">
            <table id="managerTable"></table>
          </div>
        </section>
      </section>

      <section class="view" id="view-activity">
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Seller Activity</h2>
            <span class="section-subtitle">Calls, connects, callbacks, and follow-up pressure</span>
          </div>
          <div class="table-wrap">
            <table id="activityTable"></table>
          </div>
        </section>
      </section>

      <section class="view" id="view-aging">
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Open Lead Aging</h2>
            <span class="section-subtitle">Open leads grouped by age from assignment or creation date</span>
          </div>
          <div class="table-wrap">
            <table id="agingTable"></table>
          </div>
        </section>
      </section>

      <section class="view" id="view-quality">
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Quality And Quotes</h2>
            <span class="section-subtitle">Priority mix and quote coverage by seller</span>
          </div>
          <div class="table-wrap">
            <table id="qualityTable"></table>
          </div>
        </section>
      </section>
    </main>
  </div>

  <div class="modal-backdrop" id="leadModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="modal">
      <div class="modal-header">
        <div>
          <h2 class="modal-title" id="modalTitle">Lead Details</h2>
          <div class="section-subtitle" id="modalMeta"></div>
        </div>
        <button class="icon-btn" id="closeModalBtn" type="button" title="Close">x</button>
      </div>
      <div class="modal-body">
        <div class="table-wrap">
          <table class="detail-table" id="leadDetailsTable"></table>
        </div>
        <div class="pagination" id="paginationControls" style="display: none;">
          <button class="ghost-btn" id="prevPageBtn" type="button">Previous</button>
          <span id="pageInfo">Page 1 of 1</span>
          <button class="ghost-btn" id="nextPageBtn" type="button">Next</button>
        </div>
      </div>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    const appState = {
      data: null,
      filtersReady: false,
      activeView: 'stage',
      filters: {},
      viewCache: {},
      pagination: {
        currentPage: 1,
        pageSize: 100,
        totalPages: 1,
        total: 0
      }
    };

    const filterIds = ['l1Manager', 'l2Manager', 'region', 'sellerStatus', 'sellerEmail', 'state', 'startDate', 'endDate'];
    const numberFormatter = new Intl.NumberFormat('en-IN');

    document.addEventListener('DOMContentLoaded', function () {
      bindEvents();
      loadDashboard();
    });

    function bindEvents() {
      document.getElementById('refreshBtn').addEventListener('click', function () {
        loadDashboard(true);
      });
      document.getElementById('resetBtn').addEventListener('click', resetFilters);
      document.getElementById('closeModalBtn').addEventListener('click', closeModal);
      document.getElementById('leadModal').addEventListener('click', function (event) {
        if (event.target.id === 'leadModal') closeModal();
      });
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeModal();
      });
      document.querySelectorAll('.tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          setActiveView(tab.dataset.view);
        });
      });
      filterIds.forEach(function (id) {
        document.getElementById(id).addEventListener('change', function () {
          loadDashboard();
        });
      });
      
      // Pagination event handlers
      document.getElementById('prevPageBtn').addEventListener('click', function () {
        if (appState.pagination.currentPage > 1) {
          appState.pagination.currentPage--;
          loadLeadDetailsPage();
        }
      });
      
      document.getElementById('nextPageBtn').addEventListener('click', function () {
        if (appState.pagination.currentPage < appState.pagination.totalPages) {
          appState.pagination.currentPage++;
          loadLeadDetailsPage();
        }
      });
    }

    function loadDashboard(forceRefresh) {
      if (forceRefresh) {
        appState.viewCache = {};
        appState.filtersReady = false;
      }
      setLoading(true, 'Loading sheet data...');
      appState.filters = readFilters();
      const cacheKey = makeCacheKey();
      
      // Only check cache for the current view (lazy loading)
      if (!forceRefresh && appState.viewCache[cacheKey]) {
        appState.data = appState.viewCache[cacheKey];
        renderDashboard();
        setLoading(false, 'Updated ' + appState.data.meta.generatedAt + ' | cached');
        return;
      }

      const request = Object.assign({}, appState.filters, { view: appState.activeView });
      google.script.run
        .withSuccessHandler(function (data) {
          appState.data = data;
          appState.viewCache[cacheKey] = data;
          if (!appState.filtersReady) {
            populateFilters(data.meta.filters);
            restoreFilters(data.meta.selectedFilters || {});
            appState.filtersReady = true;
          }
          renderDashboard();
          setLoading(false, 'Updated ' + data.meta.generatedAt);
        })
        .withFailureHandler(function (error) {
          setLoading(false, 'Could not load dashboard');
          showToast(error && error.message ? error.message : String(error));
        })
        .getDashboardData(request);
    }

    function renderDashboard() {
      if (!appState.data) return;
      document.getElementById('generatedAt').textContent = 'Updated ' + appState.data.meta.generatedAt;
      renderActiveView();
    }

    function renderActiveView() {
      if (appState.activeView === 'overview') {
        renderSummary();
        renderOverview();
      } else if (appState.activeView === 'stage') {
        renderStageWise();
      } else if (appState.activeView === 'manager') {
        renderManagerView();
      } else if (appState.activeView === 'activity') {
        renderActivityView();
      } else if (appState.activeView === 'aging') {
        renderAgingView();
      } else if (appState.activeView === 'quality') {
        renderQualityView();
      }
    }

    function makeCacheKey() {
      const ordered = {};
      Object.keys(appState.filters).sort().forEach(function (key) {
        ordered[key] = appState.filters[key];
      });
      return appState.activeView + '|' + JSON.stringify(ordered);
    }

    function renderSummary() {
      const summary = appState.data.summary;
      const metrics = [
        ['Total Leads', summary.totalLeads, 'Filtered sheet rows'],
        ['Open', summary.open, summary.totalLeads ? summary.conversionRate + '% won' : 'No leads'],
        ['Lost', summary.lost, 'State count'],
        ['Won', summary.won, summary.conversionRate + '% conversion'],
        ['Priority', summary.priority, 'IF Priority lead'],
        ['Active Sellers', summary.activeSellers, summary.sellersWithLeads + ' with leads'],
        ['Dialled Today', summary.dialledToday, summary.todayConnectRate + '% connect'],
        ['Callbacks', summary.callbacks, summary.noConnectedCall + ' no connect'],
        ['Quotes Created', summary.quotesCreated, summary.quoteRate + '% quote coverage'],
        ['Feasibility Sent', summary.feasibilitySentCount, summary.feasibilityRate + '% of leads'],
        ['Quotes Passed', summary.quotationsPassed, summary.passRate + '% pass rate']
      ];
      document.getElementById('summaryMetrics').innerHTML = metrics.map(function (metric) {
        return '<div class="metric"><span>' + escapeHtml(metric[0]) + '</span><strong>' +
          formatNumber(metric[1]) + '</strong><small>' + escapeHtml(metric[2]) + '</small></div>';
      }).join('');
    }

    function renderOverview() {
      const sellers = appState.data.stageWise || [];
      renderBarList('topOpenList', sellers.slice().sort(function (a, b) {
        return b.open - a.open;
      }).slice(0, 10).map(function (row) {
        return { label: row.sellerName, value: row.open };
      }));

      const stageTotals = appState.data.meta.stages.map(function (stage) {
        const value = sellers.reduce(function (sum, seller) {
          return sum + (seller.stages[stage] ? seller.stages[stage].total : 0);
        }, 0);
        return { label: titleCase(stage), value: value };
      }).filter(function (row) {
        return row.value > 0;
      });
      renderBarList('stageDistribution', stageTotals);

      const attentionRows = (appState.data.activity || []).filter(function (row) {
        return row.followUps > 0 || row.callbacks > 0 || row.noConnectedCall > 0 || row.noQuote > 0;
      }).slice(0, 20);
      renderSimpleTable('overviewAttentionTable', [
        ['Seller', function (row) { return sellerHtml(row); }],
        ['L1 Manager', 'l1Manager'],
        ['Open', 'open', 'num'],
        ['Callbacks', 'callbacks', 'num'],
        ['No Connect', 'noConnectedCall', 'num'],
        ['No Quote', 'noQuote', 'num'],
        ['Follow Ups', 'followUps', 'num']
      ], attentionRows);
    }

    function renderStageWise() {
      const stages = appState.data.meta.stages;
      const rows = appState.data.stageWise || [];
      const visibleStates = getVisibleStageStates();
      let html = '<thead><tr><th class="seller-cell">Seller</th><th>L1 Manager</th><th>Region</th><th>Status</th>';
      stages.forEach(function (stage) {
        html += '<th class="stage-heading">' + escapeHtml(titleCase(stage)) +
          miniStateLabelsHtml(visibleStates) + '</th>';
      });
      html += '<th class="num">Total</th><th class="num">Open</th><th class="num">Lost</th><th class="num">Won</th><th class="num">Won %</th></tr></thead><tbody>';
      if (!rows.length) {
        html += '<tr><td colspan="' + (stages.length + 9) + '"><div class="empty-state">No seller lead data found for these filters.</div></td></tr>';
      } else {
        rows.forEach(function (row) {
          html += '<tr>';
          html += '<td class="seller-cell">' + sellerHtml(row) + '</td>';
          html += '<td>' + escapeHtml(row.l1Manager || '') + '</td>';
          html += '<td>' + escapeHtml(row.region || '') + '</td>';
          html += '<td>' + statusPill(row.status) + '</td>';
          stages.forEach(function (stage) {
            const counts = row.stages[stage] || { open: 0, lost: 0, won: 0 };
            html += '<td>' + stageCountHtml(row, stage, counts, visibleStates) + '</td>';
          });
          html += '<td class="num">' + formatNumber(row.total) + '</td>';
          html += '<td class="num">' + formatNumber(row.open) + '</td>';
          html += '<td class="num">' + formatNumber(row.lost) + '</td>';
          html += '<td class="num">' + formatNumber(row.won) + '</td>';
          html += '<td class="num">' + formatPercent(row.conversionRate) + '</td>';
          html += '</tr>';
        });
      }
      html += '</tbody>';
      document.getElementById('stageTable').innerHTML = html;
      document.querySelectorAll('[data-drilldown="stage"]').forEach(function (button) {
        button.addEventListener('click', function () {
          if (button.classList.contains('empty')) return;
          openLeadDetails({
            sellerEmail: button.dataset.sellerEmail,
            sellerName: button.dataset.sellerName,
            stage: button.dataset.stage,
            state: button.dataset.state
          });
        });
      });
    }

    function getVisibleStageStates() {
      return appState.filters.state ? [appState.filters.state] : ['open', 'lost', 'won'];
    }

    function miniStateLabelsHtml(states) {
      return '<div class="mini-labels" style="grid-template-columns: repeat(' + states.length + ', 1fr)">' +
        states.map(function (state) {
          return '<span>' + escapeHtml(titleCase(state)) + '</span>';
        }).join('') + '</div>';
    }

    function stageCountHtml(row, stage, counts, states) {
      return '<div class="stage-counts" style="grid-template-columns: repeat(' + states.length + ', 1fr)">' +
        states.map(function (state) {
          return stateCountButton(row, stage, state, counts[state] || 0);
        }).join('') +
        '</div>';
    }

    function stateCountButton(row, stage, state, value) {
      const emptyClass = value ? '' : ' empty';
      return '<button class="count-btn ' + state + emptyClass + '" type="button" data-drilldown="stage" ' +
        'data-seller-email="' + escapeAttribute(row.sellerEmail) + '" ' +
        'data-seller-name="' + escapeAttribute(row.sellerName) + '" ' +
        'data-stage="' + escapeAttribute(stage) + '" ' +
        'data-state="' + escapeAttribute(state) + '" ' +
        'title="' + escapeAttribute(titleCase(state) + ' leads in ' + titleCase(stage)) + '">' +
        formatNumber(value) + '</button>';
    }

    function openLeadDetails(params) {
      const title = params.sellerName + ' | ' + titleCase(params.stage) + ' | ' + titleCase(params.state);
      document.getElementById('modalTitle').textContent = title;
      document.getElementById('modalMeta').textContent = 'Loading lead details...';
      document.getElementById('leadDetailsTable').innerHTML = '';
      document.getElementById('leadModal').classList.add('active');
      
      // Store current parameters for pagination
      appState.currentSellerEmail = params.sellerEmail;
      appState.currentStage = params.stage;
      appState.currentState = params.state;
      
      // Reset pagination
      appState.pagination = {
        currentPage: 1,
        pageSize: 100,
        totalPages: 1,
        total: 0
      };
      document.getElementById('paginationControls').style.display = 'none';

      google.script.run
        .withSuccessHandler(function (result) {
          document.getElementById('modalMeta').textContent = formatNumber(result.total) + ' leads | Updated ' + result.generatedAt;
          appState.pagination = {
            currentPage: result.pageNumber,
            pageSize: result.pageSize,
            totalPages: result.totalPages,
            total: result.total
          };
          renderLeadDetails(result.rows || []);
          updatePaginationControls();
        })
        .withFailureHandler(function (error) {
          document.getElementById('modalMeta').textContent = 'Could not load details';
          showToast(error && error.message ? error.message : String(error));
        })
        .getLeadDetails({
          sellerEmail: params.sellerEmail,
          stage: params.stage,
          state: params.state,
          filters: appState.filters,
          pageNumber: appState.pagination.currentPage,
          pageSize: appState.pagination.pageSize
        });
    }

    function renderLeadDetails(rows) {
      const columns = [
        'enquiry_code',
        'current_lead_stage',
        'current_lead_state',
        'seller_name',
        'seller_email',
        'l1_manager',
        'l2_manager',
        'seller_status',
        'lead_quality_level',
        'lead_creation_time',
        'lead_assignment_time',
        'region',
        'first_call_time',
        'total_calls',
        'answered_minutes',
        'outgoing_answered_calls',
        'outgoing_missed_calls',
        'incoming_answered_calls',
        'incoming_missed_calls',
        'total_outgoing_calls',
        'total_incoming_calls',
        'dialled_calls_today',
        'answered_calls_today',
        'last_missed_call',
        'last_outgoing_call',
        'callback_flag',
        'first_connected_call_time',
        'first_connected_call_duration',
        'first_connected_call_recording',
        'first_quotations_create_time',
        'last_quotations_create_time',
        'no_of_quotes_sent',
        'no_of_quotes_created',
        'if_feasibility_sent',
        'feasibility_sent_count',
        'quotations_passed',
        'if_priority_lead'
      ];
      if (!rows.length) {
        document.getElementById('leadDetailsTable').innerHTML = '<tbody><tr><td><div class="empty-state">No leads found for this count.</div></td></tr></tbody>';
        return;
      }
      let html = '<thead><tr>' + columns.map(function (column) {
        return '<th>' + escapeHtml(titleFromKey(column)) + '</th>';
      }).join('') + '</tr></thead><tbody>';
      rows.forEach(function (row) {
        html += '<tr>' + columns.map(function (column) {
          const value = row[column];
          const className = numericDetailColumn(column) ? ' class="num"' : '';
          return '<td' + className + '>' + escapeHtml(value) + '</td>';
        }).join('') + '</tr>';
      });
      html += '</tbody>';
      document.getElementById('leadDetailsTable').innerHTML = html;
    }

    function renderManagerView() {
      renderSimpleTable('managerTable', [
        ['L1 Manager', 'manager'],
        ['L2 Managers', 'l2Managers'],
        ['Sellers', 'sellers', 'num'],
        ['Total Leads', 'total', 'num'],
        ['Open', 'open', 'num'],
        ['Lost', 'lost', 'num'],
        ['Won', 'won', 'num'],
        ['Priority', 'priority', 'num'],
        ['Won %', function (row) { return formatPercent(row.conversionRate); }, 'num'],
        ['Calls / Lead', 'callsPerLead', 'num'],
        ['Answered Mins', 'answeredMinutes', 'num']
      ], appState.data.managerOverview || []);
    }

    function renderActivityView() {
      renderSimpleTable('activityTable', [
        ['Seller', function (row) { return sellerHtml(row); }],
        ['L1 Manager', 'l1Manager'],
        ['Region', 'region'],
        ['Total Leads', 'total', 'num'],
        ['Open', 'open', 'num'],
        ['Total Calls', 'totalCalls', 'num'],
        ['Dialled Today', 'dialledToday', 'num'],
        ['Answered Today', 'answeredToday', 'num'],
        ['Today Connect %', function (row) { return formatPercent(row.connectRate); }, 'num'],
        ['Missed Calls', 'missedCalls', 'num'],
        ['Callbacks', 'callbacks', 'num'],
        ['No Connected Call', 'noConnectedCall', 'num'],
        ['No Quote', 'noQuote', 'num'],
        ['Follow Ups', 'followUps', 'num']
      ], appState.data.activity || []);
    }

    function renderAgingView() {
      renderSimpleTable('agingTable', [
        ['Seller', function (row) { return sellerHtml(row); }],
        ['L1 Manager', 'l1Manager'],
        ['Region', 'region'],
        ['Open Leads', 'totalOpen', 'num'],
        ['0-1 Days', 'b0_1', 'num'],
        ['2-3 Days', 'b2_3', 'num'],
        ['4-7 Days', 'b4_7', 'num'],
        ['8+ Days', 'b8Plus', 'num'],
        ['Callbacks', 'callback', 'num'],
        ['Missed', 'missedRecently', 'num'],
        ['Risk Score', 'risk', 'num']
      ], appState.data.aging || []);
    }

    function renderQualityView() {
      renderSimpleTable('qualityTable', [
        ['Seller', function (row) { return sellerHtml(row); }],
        ['L1 Manager', 'l1Manager'],
        ['Region', 'region'],
        ['Total Leads', 'total', 'num'],
        ['Priority', 'priority', 'num'],
        ['Priority %', function (row) { return formatPercent(row.priorityRate); }, 'num'],
        ['Quoted', 'quoted', 'num'],
        ['Quote %', function (row) { return formatPercent(row.quoteRate); }, 'num'],
        ['Quotes Created', 'quotesCreated', 'num'],
        ['Feasibility Leads', 'feasibilitySent', 'num'],
        ['Feasibility Count', 'feasibilitySentCount', 'num'],
        ['Feasibility %', function (row) { return formatPercent(row.feasibilityRate); }, 'num'],
        ['Quotes Passed', 'quotationsPassed', 'num'],
        ['Pass %', function (row) { return formatPercent(row.passRate); }, 'num'],
        ['Quality Mix', function (row) { return qualityMixHtml(row.quality); }]
      ], appState.data.quality || []);
    }

    function renderSimpleTable(tableId, columns, rows) {
      let html = '<thead><tr>' + columns.map(function (column) {
        return '<th' + (column[2] === 'num' ? ' class="num"' : '') + '>' + escapeHtml(column[0]) + '</th>';
      }).join('') + '</tr></thead><tbody>';
      if (!rows.length) {
        html += '<tr><td colspan="' + columns.length + '"><div class="empty-state">No rows found for these filters.</div></td></tr>';
      } else {
        rows.forEach(function (row) {
          html += '<tr>' + columns.map(function (column) {
            const renderer = column[1];
            const value = typeof renderer === 'function' ? renderer(row) : row[renderer];
            const className = column[2] === 'num' ? ' class="num"' : '';
            const htmlValue = column[1] === 'l1Manager' || column[1] === 'region' || column[1] === 'manager' ||
              column[1] === 'l2Managers' ? escapeHtml(value) : value;
            return '<td' + className + '>' + (htmlValue === undefined || htmlValue === null ? '' : htmlValue) + '</td>';
          }).join('') + '</tr>';
        });
      }
      html += '</tbody>';
      document.getElementById(tableId).innerHTML = html;
    }

    function renderBarList(elementId, rows) {
      const target = document.getElementById(elementId);
      if (!rows.length) {
        target.innerHTML = '<div class="empty-state">No data found.</div>';
        return;
      }
      const max = rows.reduce(function (highest, row) {
        return Math.max(highest, row.value || 0);
      }, 0);
      target.innerHTML = rows.map(function (row) {
        const width = max ? Math.max(3, Math.round((row.value / max) * 100)) : 0;
        return '<div class="bar-row"><div title="' + escapeAttribute(row.label) + '">' + escapeHtml(row.label) +
          '</div><div class="bar-track"><div class="bar-fill" style="width:' + width + '%"></div></div>' +
          '<div class="num">' + formatNumber(row.value) + '</div></div>';
      }).join('');
    }

    function populateFilters(options) {
      fillSelect('l1Manager', 'All L1 managers', options.l1Managers || []);
      fillSelect('l2Manager', 'All L2 managers', options.l2Managers || []);
      fillSelect('region', 'All regions', options.regions || []);
      fillSelect('sellerStatus', 'All statuses', options.statuses || []);
      fillSellerSelect(options.sellers || []);
    }

    function fillSelect(id, placeholder, values) {
      const select = document.getElementById(id);
      select.innerHTML = '<option value="">' + escapeHtml(placeholder) + '</option>' +
        values.map(function (value) {
          return '<option value="' + escapeAttribute(value) + '">' + escapeHtml(value) + '</option>';
        }).join('');
    }

    function fillSellerSelect(sellers) {
      const select = document.getElementById('sellerEmail');
      select.innerHTML = '<option value="">All sellers</option>' + sellers.map(function (seller) {
        return '<option value="' + escapeAttribute(seller.email) + '">' + escapeHtml(seller.name + ' | ' + seller.email) + '</option>';
      }).join('');
    }

    function restoreFilters(filters) {
      Object.keys(filters || {}).forEach(function (key) {
        const element = document.getElementById(key);
        if (element) element.value = filters[key] || '';
      });
    }

    function readFilters() {
      const filters = {};
      filterIds.forEach(function (id) {
        const value = document.getElementById(id).value;
        if (value) filters[id] = value;
      });
      return filters;
    }

    function resetFilters() {
      filterIds.forEach(function (id) {
        document.getElementById(id).value = '';
      });
      document.getElementById('state').value = 'open';
      appState.filters = { state: 'open' };
      appState.viewCache = {};
      loadDashboard();
    }

    function setActiveView(view) {
      if (appState.activeView === view) return;
      appState.activeView = view;
      document.querySelectorAll('.tab').forEach(function (tab) {
        tab.classList.toggle('active', tab.dataset.view === view);
      });
      document.querySelectorAll('.view').forEach(function (section) {
        section.classList.remove('active');
      });
      document.getElementById('view-' + view).classList.add('active');
      loadDashboard();
    }

    function setLoading(isLoading, text) {
      const line = document.getElementById('statusLine');
      line.innerHTML = (isLoading ? '<span class="loading-dot"></span>' : '') + escapeHtml(text || '');
      
      // Add progressive loading indicator for better UX
      if (isLoading) {
        document.body.classList.add('app-loading');
      } else {
        document.body.classList.remove('app-loading');
      }
    }

    function closeModal() {
      document.getElementById('leadModal').classList.remove('active');
    }

    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.classList.add('active');
      window.setTimeout(function () {
        toast.classList.remove('active');
      }, 6000);
    }

    function sellerHtml(row) {
      return '<div class="seller-cell"><strong title="' + escapeAttribute(row.sellerName || '') + '">' +
        escapeHtml(row.sellerName || '') + '</strong><span>' + escapeHtml(row.sellerEmail || '') + '</span></div>';
    }

    function statusPill(status) {
      const text = status || 'Unknown';
      const className = text.toLowerCase() === 'active' ? 'won' : text.toLowerCase() === 'left' ? 'lost' : 'gray';
      return '<span class="pill ' + className + '">' + escapeHtml(text) + '</span>';
    }

    function qualityMixHtml(quality) {
      const entries = Object.keys(quality || {}).sort(function (a, b) {
        return quality[b] - quality[a];
      });
      if (!entries.length) return '<span class="muted">No quality data</span>';
      return entries.map(function (key) {
        return '<span class="pill gray" title="' + escapeAttribute(key) + '">' + escapeHtml(key) + ': ' +
          formatNumber(quality[key]) + '</span>';
      }).join(' ');
    }

    function formatNumber(value) {
      return numberFormatter.format(Number(value) || 0);
    }

    function formatPercent(value) {
      return (Number(value) || 0).toFixed(1).replace(/\.0$/, '') + '%';
    }

    function titleCase(value) {
      return String(value || '').replace(/\w\S*/g, function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
    }

    function titleFromKey(value) {
      return titleCase(String(value || '').replace(/_/g, ' '));
    }

    function numericDetailColumn(column) {
      return [
        'total_calls',
        'answered_minutes',
        'outgoing_answered_calls',
        'outgoing_missed_calls',
        'incoming_answered_calls',
        'incoming_missed_calls',
        'total_outgoing_calls',
        'total_incoming_calls',
        'dialled_calls_today',
        'answered_calls_today',
        'first_connected_call_duration',
        'no_of_quotes_sent',
        'no_of_quotes_created',
        'feasibility_sent_count',
        'quotations_passed'
      ].indexOf(column) >= 0;
    }

    function escapeHtml(value) {
      return String(value === undefined || value === null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function escapeAttribute(value) {
      return escapeHtml(value);
    }
    
    function loadLeadDetailsPage() {
      document.getElementById('modalMeta').textContent = 'Loading page ' + appState.pagination.currentPage + '...';
      
      google.script.run
        .withSuccessHandler(function (result) {
          document.getElementById('modalMeta').textContent = formatNumber(result.total) + ' leads | Updated ' + result.generatedAt;
          appState.pagination = {
            currentPage: result.pageNumber,
            pageSize: result.pageSize,
            totalPages: result.totalPages,
            total: result.total
          };
          renderLeadDetails(result.rows || []);
          updatePaginationControls();
        })
        .withFailureHandler(function (error) {
          document.getElementById('modalMeta').textContent = 'Could not load page';
          showToast(error && error.message ? error.message : String(error));
        })
        .getLeadDetails({
          sellerEmail: appState.currentSellerEmail,
          stage: appState.currentStage,
          state: appState.currentState,
          filters: appState.filters,
          pageNumber: appState.pagination.currentPage,
          pageSize: appState.pagination.pageSize
        });
    }
    
    function updatePaginationControls() {
      const pagination = appState.pagination;
      const controls = document.getElementById('paginationControls');
      
      if (pagination.totalPages <= 1) {
        controls.style.display = 'none';
        return;
      }
      
      controls.style.display = 'flex';
      document.getElementById('pageInfo').textContent = 'Page ' + pagination.currentPage + ' of ' + pagination.totalPages;
      document.getElementById('prevPageBtn').disabled = pagination.currentPage === 1;
      document.getElementById('nextPageBtn').disabled = pagination.currentPage === pagination.totalPages;
    }
  </script>
</body>
</html>
