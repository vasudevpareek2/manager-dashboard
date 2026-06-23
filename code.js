const CONFIG = {
  SPREADSHEET_ID: '1ApwJ3F3y8O8st6dzH_d-_4tSYlmn3qKZUz7_cosEqPs',
  LEADS_GID: 0,
  SELLERS_GID: 1048610416,
  STAGES: [
    'yet to act',
    'yet to establish contact',
    'information gathering',
    'template shared',
    'ready for opportunity',
    'itenary prepration',
    'preveiw link shared',
    'under fesiability',
    'qb need rework',
    'qb in rework',
    'payment link shared',
    'won'
  ],
  STATES: ['open', 'lost', 'won']
};

const STAGE_ALIASES = {
  'yet to act': 'yet to act',
  'yettoact': 'yet to act',
  'yet to establish contact': 'yet to establish contact',
  'yettoestablishcontact': 'yet to establish contact',
  'information gathering': 'information gathering',
  'informationgathering': 'information gathering',
  'template shared': 'template shared',
  'templateshared': 'template shared',
  'ready for opportunity': 'ready for opportunity',
  'readyforopportunity': 'ready for opportunity',
  'itenary prepration': 'itenary prepration',
  'itenaryprepration': 'itenary prepration',
  'itinerary preparation': 'itenary prepration',
  'itinerarypreparation': 'itenary prepration',
  'itenary preparation': 'itenary prepration',
  'itenarypreparation': 'itenary prepration',
  'preveiw link shared': 'preveiw link shared',
  'preveiwlinkshared': 'preveiw link shared',
  'preview link shared': 'preveiw link shared',
  'previewlinkshared': 'preveiw link shared',
  'under fesiability': 'under fesiability',
  'underfesiability': 'under fesiability',
  'under feasibility': 'under fesiability',
  'underfeasibility': 'under fesiability',
  'qb need rework': 'qb need rework',
  'qbneedrework': 'qb need rework',
  'qb in rework': 'qb in rework',
  'qbinrework': 'qb in rework',
  'payment link shared': 'payment link shared',
  'paymentlinkshared': 'payment link shared',
  'won': 'won'
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('html')
    .setTitle('Thrillophilia Manager Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getDashboardData(request) {
  request = request || {};
  const view = normalizeView_(request.view);
  const filters = Object.assign({}, request);
  delete filters.view;
  const sellers = getSellers_();
  const profile = getLeadProfile_(view, filters);
  const leads = getLeads_(sellers, profile).filter(function (lead) {
    return passesDashboardFilters_(lead, filters);
  });

  return buildDashboard_(leads, sellers, filters, view);
}

function getLeadDetails(request) {
  request = request || {};
  const filters = request.filters || {};
  const sellerEmail = cleanEmail_(request.sellerEmail);
  const stage = normalizeStage_(request.stage);
  const state = normalizeState_(request.state);
  const sellers = getSellers_();
  const leads = getLeads_(sellers, { details: true, dateFilter: true }).filter(function (lead) {
    if (!passesDashboardFilters_(lead, filters)) return false;
    if (sellerEmail && lead.salesEmail !== sellerEmail) return false;
    if (stage && lead.stageKey !== stage) return false;
    if (state && lead.stateKey !== state) return false;
    return true;
  });

  return {
    rows: leads.map(leadDetailRow_),
    total: leads.length,
    generatedAt: formatDateTime_(new Date())
  };
}

function normalizeView_(view) {
  const allowed = {
    overview: true,
    stage: true,
    manager: true,
    activity: true,
    aging: true,
    quality: true
  };
  return allowed[view] ? view : 'overview';
}

function getViewFlags_(view) {
  return {
    overview: view === 'overview',
    stage: view === 'stage',
    manager: view === 'manager',
    activity: view === 'activity',
    aging: view === 'aging',
    quality: view === 'quality'
  };
}

function getLeadProfile_(view, filters) {
  const flags = getViewFlags_(view);
  return {
    summary: flags.overview,
    stage: flags.overview || flags.stage,
    manager: flags.manager,
    activity: flags.overview || flags.activity,
    aging: flags.aging,
    quality: flags.quality,
    dateFilter: Boolean(filters.startDate || filters.endDate)
  };
}

function buildDashboard_(leads, sellers, filters, view) {
  const flags = getViewFlags_(view);
  const sellerRows = {};
  const managerMap = {};
  const activityRows = {};
  const agingRows = {};
  const qualityRows = {};
  const unmappedStages = {};
  const unmappedSellers = {};
  const today = startOfDay_(new Date());

  leads.forEach(function (lead) {
    const email = lead.salesEmail || 'unassigned';
    const seller = lead.seller || makeFallbackSeller_(email);
    if (flags.stage || flags.overview) {
      if (!sellerRows[email]) sellerRows[email] = makeSellerStageRow_(seller);
      addLeadToSellerStageRow_(sellerRows[email], lead);
    }
    if (flags.manager) {
      addLeadToManagerRows_(managerMap, lead);
    }
    if (flags.activity || flags.overview) {
      if (!activityRows[email]) activityRows[email] = makeActivityRow_(seller);
      addLeadToActivityRow_(activityRows[email], lead);
    }
    if (flags.aging) {
      if (!agingRows[email]) agingRows[email] = makeAgingRow_(seller);
      addLeadToAgingRow_(agingRows[email], lead, today);
    }
    if (flags.quality) {
      if (!qualityRows[email]) qualityRows[email] = makeQualityRow_(seller);
      addLeadToQualityRow_(qualityRows[email], lead);
    }

    if (!lead.stageKey) {
      const raw = lead.currentLeadStage || 'blank';
      unmappedStages[raw] = (unmappedStages[raw] || 0) + 1;
    }
    if (!lead.sellerMapped) {
      const email = lead.salesEmail || 'blank';
      unmappedSellers[email] = (unmappedSellers[email] || 0) + 1;
    }
  });

  const sellerList = Object.keys(sellerRows).map(function (email) {
    return finalizeSellerStageRow_(sellerRows[email]);
  }).sort(sortByOpenThenName_);

  const dashboard = {
    meta: {
      generatedAt: formatDateTime_(new Date()),
      view: view,
      stages: CONFIG.STAGES,
      states: CONFIG.STATES,
      filters: getFilterOptions_(sellers),
      selectedFilters: filters,
      unmappedStages: Object.keys(unmappedStages).map(function (stage) {
        return { stage: stage, count: unmappedStages[stage] };
      }).sort(function (a, b) { return b.count - a.count; }),
      unmappedSellers: Object.keys(unmappedSellers).map(function (email) {
        return { email: email, count: unmappedSellers[email] };
      }).sort(function (a, b) { return b.count - a.count; })
    }
  };

  if (flags.overview) {
    dashboard.summary = makeSummary_(leads, sellerList);
  }
  if (flags.stage || flags.overview) {
    dashboard.stageWise = sellerList;
  }
  if (flags.manager) {
    dashboard.managerOverview = Object.keys(managerMap).map(function (key) {
      return finalizeManagerRow_(managerMap[key]);
    }).sort(function (a, b) { return b.open - a.open; });
  }
  if (flags.activity || flags.overview) {
    dashboard.activity = Object.keys(activityRows).map(function (email) {
      return finalizeActivityRow_(activityRows[email]);
    }).sort(function (a, b) { return b.followUps - a.followUps; });
  }
  if (flags.aging) {
    dashboard.aging = Object.keys(agingRows).map(function (email) {
      return finalizeAgingRow_(agingRows[email]);
    }).sort(function (a, b) { return b.totalOpen - a.totalOpen; });
  }
  if (flags.quality) {
    dashboard.quality = Object.keys(qualityRows).map(function (email) {
      return finalizeQualityRow_(qualityRows[email]);
    }).sort(function (a, b) { return b.priority - a.priority; });
  }

  return dashboard;
}

function getSellers_() {
  const values = getSheetValuesByGid_(CONFIG.SELLERS_GID);
  if (values.length < 2) return {};

  const header = makeHeaderIndex_(values[0]);
  const sellers = {};
  values.slice(1).forEach(function (row) {
    const email = cleanEmail_(readByHeader_(row, header, ['selleremail', 'salesemailid', 'email']));
    if (!email) return;
    sellers[email] = {
      email: email,
      name: stringValue_(readByHeader_(row, header, ['sellername', 'name'])) || email,
      l1Manager: stringValue_(readByHeader_(row, header, ['l1manager'])),
      l2Manager: stringValue_(readByHeader_(row, header, ['l2manager'])),
      region: stringValue_(readByHeader_(row, header, ['region'])),
      status: stringValue_(readByHeader_(row, header, ['currentstatus', 'status'])) || 'Unknown'
    };
  });
  return sellers;
}

function getLeads_(sellers, profile) {
  profile = profile || {};
  const values = getLeadSheetValues_(profile);
  if (values.length < 2) return [];

  const header = makeHeaderIndex_(values[0]);
  return values.slice(1).map(function (row) {
    const email = cleanEmail_(readByHeader_(row, header, ['salesemailid']));
    const sellerMapped = Boolean(sellers[email]);
    const seller = sellers[email] || makeFallbackSeller_(email);
    const stageRaw = stringValue_(readByHeader_(row, header, ['currentleadstage']));
    const stateRaw = stringValue_(readByHeader_(row, header, ['currentleadstate']));
    const lead = {
      enquiryCode: stringValue_(readByHeader_(row, header, ['enquirycode'])),
      currentLeadStage: stageRaw,
      stageKey: normalizeStage_(stageRaw),
      currentLeadState: stateRaw,
      stateKey: normalizeState_(stateRaw),
      leadQualityLevel: '',
      salesEmail: email,
      seller: seller,
      sellerMapped: sellerMapped,
      leadCreationTime: null,
      leadAssignmentTime: null,
      region: stringValue_(readByHeader_(row, header, ['region'])) || seller.region,
      firstCallTime: null,
      totalCalls: 0,
      answeredMinutes: 0,
      outgoingAnsweredCalls: 0,
      outgoingMissedCalls: 0,
      incomingAnsweredCalls: 0,
      incomingMissedCalls: 0,
      totalOutgoingCalls: 0,
      totalIncomingCalls: 0,
      dialledCallsToday: 0,
      answeredCallsToday: 0,
      lastMissedCall: null,
      lastOutgoingCall: null,
      callbackFlag: false,
      firstConnectedCallTime: null,
      firstConnectedCallDuration: 0,
      firstConnectedCallRecording: '',
      firstQuotationCreateTime: null,
      lastQuotationCreateTime: null,
      noOfQuotesSent: 0,
      noOfQuotesCreated: 0,
      feasibilitySent: false,
      feasibilitySentCount: 0,
      quotationsPassed: 0,
      priorityLead: false
    };

    if (profile.dateFilter || profile.details || profile.aging) {
      lead.leadCreationTime = parseSheetDate_(readByHeader_(row, header, ['leadcreationtime']));
    }
    if (profile.details || profile.aging) {
      lead.leadAssignmentTime = parseSheetDate_(readByHeader_(row, header, ['leadassignmenttime']));
    }
    if (profile.summary || profile.manager || profile.activity || profile.details) {
      lead.totalCalls = numberValue_(readByHeader_(row, header, ['totalcalls']));
      lead.answeredMinutes = numberValue_(readByHeader_(row, header, ['answeredminutes']));
    }
    if (profile.summary || profile.activity || profile.details) {
      lead.outgoingMissedCalls = numberValue_(readByHeader_(row, header, ['outgoingmissedcalls']));
      lead.incomingMissedCalls = numberValue_(readByHeader_(row, header, ['incomingmissedcalls']));
      lead.dialledCallsToday = numberValue_(readByHeader_(row, header, ['dialledcallstoday']));
      lead.answeredCallsToday = numberValue_(readByHeader_(row, header, ['answeredcallstoday']));
      lead.callbackFlag = boolLike_(readByHeader_(row, header, ['callbackflag']));
      lead.firstConnectedCallTime = parseSheetDate_(readByHeader_(row, header, ['firstconnectedcalltime']));
      lead.noOfQuotesSent = numberValue_(readByHeader_(row, header, ['noofquotessent']));
    }
    if (profile.manager || profile.summary || profile.quality || profile.details) {
      lead.priorityLead = boolLike_(readByHeader_(row, header, ['ifprioritylead']));
    }
    if (profile.aging) {
      lead.callbackFlag = boolLike_(readByHeader_(row, header, ['callbackflag']));
      lead.lastMissedCall = parseSheetDate_(readByHeader_(row, header, ['lastmissedcall']));
    }
    if (profile.quality || profile.details) {
      lead.leadQualityLevel = stringValue_(readByHeader_(row, header, ['leadqualitylevel']));
      lead.noOfQuotesSent = numberValue_(readByHeader_(row, header, ['noofquotessent']));
    }
    if (profile.summary || profile.quality || profile.details) {
      lead.noOfQuotesCreated = countValue_(readByHeader_(row, header, ['noofquotescreated']));
      lead.feasibilitySent = boolLike_(readByHeader_(row, header, ['iffeasibilitysent']));
      lead.feasibilitySentCount = countValue_(readByHeader_(row, header, ['feasibilitysentcount']));
      lead.quotationsPassed = countValue_(readByHeader_(row, header, ['quotationspassed']));
      if (lead.feasibilitySentCount > 0) lead.feasibilitySent = true;
    }
    if (profile.details) {
      lead.firstCallTime = parseSheetDate_(readByHeader_(row, header, ['firstcalltime']));
      lead.outgoingAnsweredCalls = numberValue_(readByHeader_(row, header, ['outgoingansweredcalls']));
      lead.incomingAnsweredCalls = numberValue_(readByHeader_(row, header, ['incomingansweredcalls']));
      lead.totalOutgoingCalls = numberValue_(readByHeader_(row, header, ['totaloutgoingcalls']));
      lead.totalIncomingCalls = numberValue_(readByHeader_(row, header, ['totalincomingcalls']));
      lead.lastOutgoingCall = parseSheetDate_(readByHeader_(row, header, ['lastoutgoingcall']));
      lead.firstConnectedCallDuration = numberValue_(readByHeader_(row, header, ['firstconnectedcallduration']));
      lead.firstConnectedCallRecording = stringValue_(readByHeader_(row, header, ['firstconnectedcallrecording']));
      lead.firstQuotationCreateTime = parseSheetDate_(readByHeader_(row, header, ['firstquotationscreatetime']));
      lead.lastQuotationCreateTime = parseSheetDate_(readByHeader_(row, header, ['lastquotationscreatetime']));
    }
    return lead;
  }).filter(function (lead) {
    return lead.enquiryCode || lead.salesEmail || lead.currentLeadStage || lead.currentLeadState;
  });
}

function makeSellerStageRow_(seller) {
  const stages = {};
  CONFIG.STAGES.forEach(function (stage) {
    stages[stage] = { open: 0, lost: 0, won: 0, total: 0 };
  });
  return {
    sellerEmail: seller.email,
    sellerName: seller.name,
    l1Manager: seller.l1Manager,
    l2Manager: seller.l2Manager,
    region: seller.region,
    status: seller.status,
    total: 0,
    open: 0,
    lost: 0,
    won: 0,
    priority: 0,
    stages: stages
  };
}

function addLeadToSellerStageRow_(row, lead) {
  row.total += 1;
  if (lead.stateKey) row[lead.stateKey] += 1;
  if (lead.priorityLead) row.priority += 1;
  if (lead.stageKey && row.stages[lead.stageKey]) {
    row.stages[lead.stageKey].total += 1;
    if (lead.stateKey) row.stages[lead.stageKey][lead.stateKey] += 1;
  }
}

function finalizeSellerStageRow_(row) {
  row.conversionRate = pct_(row.won, row.total);
  return row;
}

function addLeadToManagerRows_(managerMap, lead) {
  const seller = lead.seller || {};
  const key = seller.l1Manager || 'Unassigned';
  if (!managerMap[key]) {
    managerMap[key] = {
      manager: key,
      l2Managers: {},
      total: 0,
      open: 0,
      lost: 0,
      won: 0,
      priority: 0,
      sellers: {},
      totalCalls: 0,
      answeredMinutes: 0
    };
  }
  const row = managerMap[key];
  row.total += 1;
  if (lead.stateKey) row[lead.stateKey] += 1;
  if (lead.priorityLead) row.priority += 1;
  row.totalCalls += lead.totalCalls;
  row.answeredMinutes += lead.answeredMinutes;
  if (seller.email) row.sellers[seller.email] = true;
  if (seller.l2Manager) row.l2Managers[seller.l2Manager] = true;
}

function finalizeManagerRow_(row) {
  return {
    manager: row.manager,
    l2Managers: Object.keys(row.l2Managers).join(', '),
    sellers: Object.keys(row.sellers).length,
    total: row.total,
    open: row.open,
    lost: row.lost,
    won: row.won,
    priority: row.priority,
    conversionRate: pct_(row.won, row.total),
    callsPerLead: round_(safeDivide_(row.totalCalls, row.total), 1),
    answeredMinutes: round_(row.answeredMinutes, 1)
  };
}

function makeActivityRow_(seller) {
  return {
    sellerEmail: seller.email,
    sellerName: seller.name,
    l1Manager: seller.l1Manager,
    region: seller.region,
    total: 0,
    open: 0,
    totalCalls: 0,
    dialledToday: 0,
    answeredToday: 0,
    missedCalls: 0,
    answeredMinutes: 0,
    callbacks: 0,
    noConnectedCall: 0,
    noQuote: 0
  };
}

function addLeadToActivityRow_(row, lead) {
  row.total += 1;
  if (lead.stateKey === 'open') row.open += 1;
  row.totalCalls += lead.totalCalls;
  row.dialledToday += lead.dialledCallsToday;
  row.answeredToday += lead.answeredCallsToday;
  row.missedCalls += lead.outgoingMissedCalls + lead.incomingMissedCalls;
  row.answeredMinutes += lead.answeredMinutes;
  if (lead.callbackFlag) row.callbacks += 1;
  if (lead.stateKey === 'open' && !lead.firstConnectedCallTime) row.noConnectedCall += 1;
  if (lead.stateKey === 'open' && !lead.noOfQuotesSent) row.noQuote += 1;
}

function finalizeActivityRow_(row) {
  row.followUps = row.callbacks + row.noConnectedCall + row.noQuote;
  row.connectRate = pct_(row.answeredToday, row.dialledToday);
  row.callsPerLead = round_(safeDivide_(row.totalCalls, row.total), 1);
  row.answeredMinutes = round_(row.answeredMinutes, 1);
  return row;
}

function makeAgingRow_(seller) {
  return {
    sellerEmail: seller.email,
    sellerName: seller.name,
    l1Manager: seller.l1Manager,
    region: seller.region,
    totalOpen: 0,
    b0_1: 0,
    b2_3: 0,
    b4_7: 0,
    b8Plus: 0,
    callback: 0,
    missedRecently: 0
  };
}

function addLeadToAgingRow_(row, lead, today) {
  if (lead.stateKey !== 'open') return;
  row.totalOpen += 1;
  const baseDate = lead.leadAssignmentTime || lead.leadCreationTime;
  const age = baseDate ? Math.max(0, Math.floor((today.getTime() - startOfDay_(baseDate).getTime()) / 86400000)) : 999;
  if (age <= 1) row.b0_1 += 1;
  else if (age <= 3) row.b2_3 += 1;
  else if (age <= 7) row.b4_7 += 1;
  else row.b8Plus += 1;
  if (lead.callbackFlag) row.callback += 1;
  if (lead.lastMissedCall) row.missedRecently += 1;
}

function finalizeAgingRow_(row) {
  row.risk = row.b4_7 + row.b8Plus + row.callback + row.missedRecently;
  return row;
}

function makeQualityRow_(seller) {
  return {
    sellerEmail: seller.email,
    sellerName: seller.name,
    l1Manager: seller.l1Manager,
    region: seller.region,
    total: 0,
    priority: 0,
    quoted: 0,
    quotesCreated: 0,
    feasibilitySent: 0,
    feasibilitySentCount: 0,
    quotationsPassed: 0,
    quality: {}
  };
}

function addLeadToQualityRow_(row, lead) {
  row.total += 1;
  if (lead.priorityLead) row.priority += 1;
  if (lead.noOfQuotesSent > 0) row.quoted += 1;
  row.quotesCreated += lead.noOfQuotesCreated;
  if (lead.feasibilitySent) row.feasibilitySent += 1;
  row.feasibilitySentCount += lead.feasibilitySentCount;
  row.quotationsPassed += lead.quotationsPassed;
  const key = lead.leadQualityLevel || 'Blank';
  row.quality[key] = (row.quality[key] || 0) + 1;
}

function finalizeQualityRow_(row) {
  row.priorityRate = pct_(row.priority, row.total);
  row.quoteRate = pct_(row.quoted, row.total);
  row.feasibilityRate = pct_(row.feasibilitySent, row.total);
  row.passRate = pct_(row.quotationsPassed, row.quotesCreated);
  return row;
}

function makeSummary_(leads, sellerRows) {
  const summary = {
    totalLeads: leads.length,
    open: 0,
    lost: 0,
    won: 0,
    priority: 0,
    activeSellers: sellerRows.filter(function (row) { return row.status.toLowerCase() === 'active'; }).length,
    sellersWithLeads: sellerRows.length,
    dialledToday: 0,
    answeredToday: 0,
    callbacks: 0,
    noConnectedCall: 0,
    quoted: 0,
    quotesCreated: 0,
    feasibilitySent: 0,
    feasibilitySentCount: 0,
    quotationsPassed: 0
  };
  leads.forEach(function (lead) {
    if (lead.stateKey) summary[lead.stateKey] += 1;
    if (lead.priorityLead) summary.priority += 1;
    summary.dialledToday += lead.dialledCallsToday;
    summary.answeredToday += lead.answeredCallsToday;
    if (lead.callbackFlag) summary.callbacks += 1;
    if (lead.stateKey === 'open' && !lead.firstConnectedCallTime) summary.noConnectedCall += 1;
    if (lead.noOfQuotesSent > 0) summary.quoted += 1;
    summary.quotesCreated += lead.noOfQuotesCreated;
    if (lead.feasibilitySent) summary.feasibilitySent += 1;
    summary.feasibilitySentCount += lead.feasibilitySentCount;
    summary.quotationsPassed += lead.quotationsPassed;
  });
  summary.conversionRate = pct_(summary.won, summary.totalLeads);
  summary.todayConnectRate = pct_(summary.answeredToday, summary.dialledToday);
  summary.quoteRate = pct_(summary.quoted, summary.totalLeads);
  summary.feasibilityRate = pct_(summary.feasibilitySent, summary.totalLeads);
  summary.passRate = pct_(summary.quotationsPassed, summary.quotesCreated);
  return summary;
}

function getFilterOptions_(sellers) {
  const arrays = {
    l1Managers: [],
    l2Managers: [],
    regions: [],
    statuses: [],
    sellers: []
  };
  const seen = {};
  Object.keys(sellers).forEach(function (email) {
    const seller = sellers[email];
    pushUnique_(arrays.l1Managers, seen, 'l1:' + seller.l1Manager, seller.l1Manager);
    pushUnique_(arrays.l2Managers, seen, 'l2:' + seller.l2Manager, seller.l2Manager);
    pushUnique_(arrays.regions, seen, 'r:' + seller.region, seller.region);
    pushUnique_(arrays.statuses, seen, 's:' + seller.status, seller.status);
    arrays.sellers.push({ email: seller.email, name: seller.name });
  });
  arrays.l1Managers.sort();
  arrays.l2Managers.sort();
  arrays.regions.sort();
  arrays.statuses.sort();
  arrays.sellers.sort(function (a, b) { return a.name.localeCompare(b.name); });
  return arrays;
}

function passesDashboardFilters_(lead, filters) {
  const seller = lead.seller || {};
  if (filters.l1Manager && seller.l1Manager !== filters.l1Manager) return false;
  if (filters.l2Manager && seller.l2Manager !== filters.l2Manager) return false;
  if (filters.region && seller.region !== filters.region && lead.region !== filters.region) return false;
  if (filters.sellerStatus && seller.status !== filters.sellerStatus) return false;
  if (filters.sellerEmail && lead.salesEmail !== cleanEmail_(filters.sellerEmail)) return false;
  if (filters.state && lead.stateKey !== normalizeState_(filters.state)) return false;
  if (filters.startDate || filters.endDate) {
    const date = lead.leadCreationTime;
    if (!date) return false;
    if (filters.startDate && date < parseFilterDate_(filters.startDate, false)) return false;
    if (filters.endDate && date > parseFilterDate_(filters.endDate, true)) return false;
  }
  return true;
}

function leadDetailRow_(lead) {
  return {
    enquiry_code: lead.enquiryCode,
    seller_name: lead.seller.name,
    seller_email: lead.salesEmail,
    l1_manager: lead.seller.l1Manager,
    l2_manager: lead.seller.l2Manager,
    seller_status: lead.seller.status,
    current_lead_stage: lead.currentLeadStage,
    current_lead_state: lead.currentLeadState,
    lead_quality_level: lead.leadQualityLevel,
    lead_creation_time: formatDateTime_(lead.leadCreationTime),
    lead_assignment_time: formatDateTime_(lead.leadAssignmentTime),
    region: lead.region,
    first_call_time: formatDateTime_(lead.firstCallTime),
    total_calls: lead.totalCalls,
    answered_minutes: lead.answeredMinutes,
    outgoing_answered_calls: lead.outgoingAnsweredCalls,
    outgoing_missed_calls: lead.outgoingMissedCalls,
    incoming_answered_calls: lead.incomingAnsweredCalls,
    incoming_missed_calls: lead.incomingMissedCalls,
    total_outgoing_calls: lead.totalOutgoingCalls,
    total_incoming_calls: lead.totalIncomingCalls,
    dialled_calls_today: lead.dialledCallsToday,
    answered_calls_today: lead.answeredCallsToday,
    last_missed_call: formatDateTime_(lead.lastMissedCall),
    last_outgoing_call: formatDateTime_(lead.lastOutgoingCall),
    callback_flag: lead.callbackFlag ? 'Yes' : 'No',
    first_connected_call_time: formatDateTime_(lead.firstConnectedCallTime),
    first_connected_call_duration: lead.firstConnectedCallDuration,
    first_connected_call_recording: lead.firstConnectedCallRecording,
    first_quotations_create_time: formatDateTime_(lead.firstQuotationCreateTime),
    last_quotations_create_time: formatDateTime_(lead.lastQuotationCreateTime),
    no_of_quotes_sent: lead.noOfQuotesSent,
    no_of_quotes_created: lead.noOfQuotesCreated,
    if_feasibility_sent: lead.feasibilitySent ? 'Yes' : 'No',
    feasibility_sent_count: lead.feasibilitySentCount,
    quotations_passed: lead.quotationsPassed,
    if_priority_lead: lead.priorityLead ? 'Yes' : 'No'
  };
}

function getSheetValuesByGid_(gid) {
  const sheet = getSheetByGid_(gid);
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  if (!lastRow || !lastColumn) return [];
  return sheet.getRange(1, 1, lastRow, lastColumn).getValues();
}

function getLeadSheetValues_(profile) {
  const sheet = getSheetByGid_(CONFIG.LEADS_GID);
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  if (!lastRow || !lastColumn) return [];

  const fullHeader = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const fullHeaderIndex = makeHeaderIndex_(fullHeader);
  const selectedColumns = getRequiredLeadHeaders_(profile).reduce(function (columns, key) {
    const normalized = normalizeHeader_(key);
    const columnIndex = fullHeaderIndex[normalized];
    if (columnIndex === undefined) return columns;
    if (columns.some(function (column) { return column.index === columnIndex; })) return columns;
    columns.push({
      index: columnIndex,
      column: columnIndex + 1,
      header: fullHeader[columnIndex]
    });
    return columns;
  }, []).sort(function (a, b) {
    return a.column - b.column;
  });

  if (!selectedColumns.length) return [[]];
  const header = selectedColumns.map(function (column) {
    return column.header;
  });
  if (lastRow < 2) return [header];

  const rows = [];
  const rowCount = lastRow - 1;
  for (let i = 0; i < rowCount; i += 1) rows.push([]);

  groupSelectedColumns_(selectedColumns).forEach(function (group) {
    const values = sheet.getRange(2, group.startColumn, rowCount, group.width).getValues();
    values.forEach(function (sourceRow, rowIndex) {
      for (let colOffset = 0; colOffset < group.width; colOffset += 1) {
        rows[rowIndex].push(sourceRow[colOffset]);
      }
    });
  });

  return [header].concat(rows);
}

function getRequiredLeadHeaders_(profile) {
  const headers = [];
  addRequiredHeader_(headers, 'sales_email_id');
  addRequiredHeader_(headers, 'current_lead_stage');
  addRequiredHeader_(headers, 'current_lead_state');
  addRequiredHeader_(headers, 'region');

  if (profile.dateFilter || profile.details || profile.aging) {
    addRequiredHeader_(headers, 'lead_creation_time');
  }
  if (profile.details || profile.aging) {
    addRequiredHeader_(headers, 'lead_assignment_time');
  }
  if (profile.summary || profile.manager || profile.activity || profile.details) {
    addRequiredHeader_(headers, 'total_calls');
    addRequiredHeader_(headers, 'answered_minutes');
  }
  if (profile.summary || profile.activity || profile.details) {
    addRequiredHeader_(headers, 'outgoing_missed_calls');
    addRequiredHeader_(headers, 'incoming_missed_calls');
    addRequiredHeader_(headers, 'dialled_calls_today');
    addRequiredHeader_(headers, 'answered_calls_today');
    addRequiredHeader_(headers, 'callback_flag');
    addRequiredHeader_(headers, 'first_connected_call_time');
    addRequiredHeader_(headers, 'no_of_quotes_sent');
  }
  if (profile.manager || profile.summary || profile.quality || profile.details) {
    addRequiredHeader_(headers, 'IF Priority lead');
  }
  if (profile.aging) {
    addRequiredHeader_(headers, 'last_missed_call');
  }
  if (profile.quality || profile.details) {
    addRequiredHeader_(headers, 'lead_quality_level');
    addRequiredHeader_(headers, 'no_of_quotes_sent');
  }
  if (profile.summary || profile.quality || profile.details) {
    addRequiredHeader_(headers, 'no_of_quotes_created');
    addRequiredHeader_(headers, 'if_feasibility_sent');
    addRequiredHeader_(headers, 'feasibility_sent_count');
    addRequiredHeader_(headers, 'quotations_passed');
  }
  if (profile.details) {
    addRequiredHeader_(headers, 'enquiry_code');
    addRequiredHeader_(headers, 'first_call_time');
    addRequiredHeader_(headers, 'outgoing_answered_calls');
    addRequiredHeader_(headers, 'incoming_answered_calls');
    addRequiredHeader_(headers, 'total_outgoing_calls');
    addRequiredHeader_(headers, 'total_incoming_calls');
    addRequiredHeader_(headers, 'last_outgoing_call');
    addRequiredHeader_(headers, 'first_connected_call_duration');
    addRequiredHeader_(headers, 'first_connected_call_recording');
    addRequiredHeader_(headers, 'first_quotations_create_time');
    addRequiredHeader_(headers, 'last_quotations_create_time');
  }

  return headers;
}

function addRequiredHeader_(headers, key) {
  const normalized = normalizeHeader_(key);
  if (headers.some(function (existing) { return normalizeHeader_(existing) === normalized; })) return;
  headers.push(key);
}

function groupSelectedColumns_(selectedColumns) {
  const groups = [];
  selectedColumns.forEach(function (selected) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && selected.column === lastGroup.startColumn + lastGroup.width) {
      lastGroup.width += 1;
      return;
    }
    groups.push({
      startColumn: selected.column,
      width: 1
    });
  });
  return groups;
}

function getSheetByGid_(gid) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheets().filter(function (candidate) {
    return candidate.getSheetId() === gid;
  })[0];
  if (!sheet) throw new Error('Sheet gid not found: ' + gid);
  return sheet;
}

function makeHeaderIndex_(headers) {
  const index = {};
  headers.forEach(function (header, i) {
    index[normalizeHeader_(header)] = i;
  });
  return index;
}

function readByHeader_(row, header, keys) {
  for (let i = 0; i < keys.length; i += 1) {
    const key = normalizeHeader_(keys[i]);
    if (Object.prototype.hasOwnProperty.call(header, key)) return row[header[key]];
  }
  return '';
}

function normalizeHeader_(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function normalizeStage_(value) {
  const compact = normalizeHeader_(value);
  const spaced = String(value || '').toLowerCase().trim().replace(/\s+/g, ' ');
  return STAGE_ALIASES[spaced] || STAGE_ALIASES[compact] || '';
}

function normalizeState_(value) {
  const state = String(value || '').toLowerCase().trim();
  if (state === 'open' || state === 'lost' || state === 'won') return state;
  return '';
}

function makeFallbackSeller_(email) {
  const cleaned = cleanEmail_(email);
  return {
    email: cleaned || 'unassigned',
    name: cleaned || 'Unassigned',
    l1Manager: 'Unassigned',
    l2Manager: 'Unassigned',
    region: 'Unassigned',
    status: 'Unknown'
  };
}

function cleanEmail_(value) {
  return String(value || '').trim().toLowerCase();
}

function stringValue_(value) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return formatDateTime_(value);
  return String(value).trim();
}

function numberValue_(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

function countValue_(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = Number(value);
  if (!isNaN(num)) return num;
  return boolLike_(value) ? 1 : 0;
}

function boolLike_(value) {
  const text = String(value || '').toLowerCase().trim();
  return ['true', 'yes', 'y', '1', 'priority', 'p', 'callback', 'sent', 'passed'].indexOf(text) >= 0;
}

function parseSheetDate_(value) {
  if (!value) return null;
  if (value instanceof Date && !isNaN(value.getTime())) return value;
  if (typeof value === 'number') {
    const serialDate = new Date(Math.round((value - 25569) * 86400000));
    return isNaN(serialDate.getTime()) ? null : serialDate;
  }

  const text = String(value).trim();
  const dayFirst = parseDayFirstDate_(text);
  if (dayFirst) return dayFirst;

  const namedMonth = parseNamedMonthDate_(text);
  if (namedMonth) return namedMonth;

  const date = new Date(text);
  return isNaN(date.getTime()) ? null : date;
}

function parseDayFirstDate_(text) {
  const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,\s*(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(AM|PM)?)?$/i);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  let hour = Number(match[4] || 0);
  const minute = Number(match[5] || 0);
  const second = Number(match[6] || 0);
  const meridiem = String(match[7] || '').toUpperCase();

  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(year, month - 1, day, hour, minute, second);
  return isNaN(date.getTime()) ? null : date;
}

function parseNamedMonthDate_(text) {
  const cleaned = text.replace(/^[A-Za-z]+,\s*/, '');
  const match = cleaned.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})(?:,\s*(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(AM|PM)?)?$/i);
  if (!match) return null;

  const months = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11
  };
  const month = months[String(match[1]).toLowerCase()];
  if (month === undefined) return null;

  const day = Number(match[2]);
  const year = Number(match[3]);
  let hour = Number(match[4] || 0);
  const minute = Number(match[5] || 0);
  const second = Number(match[6] || 0);
  const meridiem = String(match[7] || '').toUpperCase();

  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;

  const date = new Date(year, month, day, hour, minute, second);
  return isNaN(date.getTime()) ? null : date;
}

function parseFilterDate_(value, endOfDay) {
  const parts = String(value).split('-').map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  if (endOfDay) date.setHours(23, 59, 59, 999);
  return date;
}

function formatDateTime_(date) {
  if (!date) return '';
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
}

function startOfDay_(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function pct_(part, total) {
  return total ? round_((part / total) * 100, 1) : 0;
}

function safeDivide_(part, total) {
  return total ? part / total : 0;
}

function round_(value, places) {
  const factor = Math.pow(10, places || 0);
  return Math.round((Number(value) || 0) * factor) / factor;
}

function pushUnique_(target, seen, key, value) {
  if (!value || seen[key]) return;
  seen[key] = true;
  target.push(value);
}

function sortByOpenThenName_(a, b) {
  if (b.open !== a.open) return b.open - a.open;
  return a.sellerName.localeCompare(b.sellerName);
}
