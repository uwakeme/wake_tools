/* Wake Tools · icon library
 * Each icon is a Heroicons-style 24x24 outline SVG.
 * Exposed as window.WT.ICONS; window.WT.IC() is the factory.
 */
(function () {
  const NS = (window.WT = window.WT || {});

  NS.IC = (paths) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

  NS.ICONS = {
    base64: NS.IC('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>'),
    url: NS.IC('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
    hex: NS.IC('<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>'),
    unicode: NS.IC('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
    timestamp: NS.IC('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
    json: NS.IC('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'),
    sql: NS.IC('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>'),
    xml: NS.IC('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>'),
    case: NS.IC('<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>'),
    textutil: NS.IC('<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>'),
    diff: NS.IC('<path d="M16 3h5v5"/><path d="M21 3 14 10"/><path d="M8 21H3v-5"/><path d="M3 21l7-7"/>'),
    regex: NS.IC('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6"/><path d="M12 9v6"/>'),
    uuid: NS.IC('<path d="M12 2a10 10 0 1 0 10 10"/><circle cx="12" cy="12" r="2"/><path d="M12 2v10"/><path d="M12 12 7 7"/>'),
    password: NS.IC('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
    lorem: NS.IC('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>'),
    color: NS.IC('<circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="13" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="10" cy="20" r="2.5"/><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.397-.144-.78-.4-1.083a1.5 1.5 0 0 1-.097-1.92c.34-.51.057-1.197-.555-1.197H10c-1.105 0-2-.895-2-2 0-3.314 2.686-6 6-6 1.105 0 2 .895 2 2v.5c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5V12z"/>'),
    radix: NS.IC('<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="13" y1="10" x2="15" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="13" y1="14" x2="15" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="13" y1="18" x2="15" y2="18"/>'),
    cron: NS.IC('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/>'),
    ascii: NS.IC('<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>'),
    jwt: NS.IC('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><line x1="12" y1="15" x2="12" y2="17"/>'),
    hash: NS.IC('<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>'),
    html: NS.IC('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'),
    urlparse: NS.IC('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
    header: NS.IC('<path d="M4 6h16M4 12h16M4 18h10"/>'),
    duration: NS.IC('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
    bytes: NS.IC('<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>'),
    markdown: NS.IC('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 16V8l3 4 3-4v8"/><path d="M16 8v8M16 16l-2-2M16 16l2-2"/>'),
    yaml: NS.IC('<path d="M4 4h6v16H4z"/><path d="M14 4h6v16h-6z"/><line x1="10" y1="12" x2="14" y2="12"/>'),
    fakedata: NS.IC('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    string: NS.IC('<path d="M3 6h18M3 12h12M3 18h6"/>'),
    arrowRight: NS.IC('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'),
    copy: NS.IC('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),
    check: NS.IC('<polyline points="20 6 9 17 4 12"/>'),
    sun: NS.IC('<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/>'),
    moon: NS.IC('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'),
    search: NS.IC('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>'),
    menu: NS.IC('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>'),
    github: NS.IC('<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>'),
  };
})();