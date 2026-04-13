/* v2-app.js — DontPayFullPrice coupon grid v2 */
"use strict";

// ─── State ────────────────────────────────────────────────────
let allCoupons = [];
let debounceTimer = null;

// ─── DOM refs (populated after DOMContentLoaded) ──────────────
let elGrid, elCount, elSearch, elPromoToggle, elCategory, elMerchant;

// ─── Helpers ──────────────────────────────────────────────────
function stripHtml(html) {
  const d = document.createElement("div");
  d.innerHTML = html ?? "";
  return d.textContent || d.innerText || "";
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

function daysLeft(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - Date.now();
  return Math.ceil(diff / 86400000);
}

function fmtDate(dateStr) {
  if (!dateStr) return "No expiry";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function hasRealCode(code) {
  if (!code) return false;
  const lower = code.toLowerCase().trim();
  return lower !== "" && lower !== "not required" && lower !== "none" && lower !== "не требуется";
}

// ─── Card builder ─────────────────────────────────────────────
function buildCard(c) {
  const campaignId = c.campaign?.id ?? "";
  const merchantName = c.campaign?.name ?? "";
  const title = stripHtml(c.short_name ?? c.name ?? "");
  const promoCode = (c.promocode ?? "").trim();
  const discount = c.discount ?? "";
  const category = c.categories?.[0]?.name ?? "";
  const days = daysLeft(c.date_end);
  const gotoHref = c.goto_link
    ? `https://paywithcode.com/gotoshop.php?sale=${encodeURIComponent(c.goto_link)}`
    : "#";

  const withCode = hasRealCode(promoCode);

  let topClass = "v2-card-top";
  if (withCode) topClass += " has-code";
  else if (discount) topClass += " has-discount";

  // Badge: days remaining
  let daysBadge = "";
  if (days !== null) {
    if (days <= 0) {
      daysBadge = `<span class="v2-badge v2-badge-expiring">⏰ Expired</span>`;
    } else if (days <= 3) {
      daysBadge = `<span class="v2-badge v2-badge-expiring">⚡ ${days}d left</span>`;
    } else {
      daysBadge = `<span class="v2-badge v2-badge-days">✓ ${days}d left</span>`;
    }
  }

  const discountBadge = discount
    ? `<span class="v2-badge v2-badge-discount">🏷 ${discount}</span>`
    : "";

  const categoryBadge = category
    ? `<span class="v2-badge v2-badge-category">${category}</span>`
    : "";

  // Promo code block or nothing
  const promoBlock = withCode
    ? `<div class="v2-promo-wrap">
        <span class="v2-promo-code" title="${promoCode}">${promoCode.toUpperCase()}</span>
        <button class="v2-copy-btn" data-code="${promoCode}" aria-label="Copy promo code">Copy</button>
      </div>`
    : "";

  const logoSrc = `logos/${campaignId}.webp`;
  const initial = merchantName.charAt(0) || "?";

  return `
<div class="v2-card">
  <div class="${topClass}"></div>
  <div class="v2-card-logo-wrap">
    <img
      class="v2-card-logo"
      src="${logoSrc}"
      alt="${merchantName} logo"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
    />
    <div class="v2-logo-fallback" style="display:none">${initial}</div>
  </div>
  <div class="v2-card-body">
    <div class="v2-merchant-name">${merchantName}</div>
    <div class="v2-offer-title">${title}</div>
    <div class="v2-badges">
      ${discountBadge}${daysBadge}${categoryBadge}
    </div>
    ${promoBlock}
  </div>
  <div class="v2-card-footer">
    <span class="v2-expiry">Ends ${fmtDate(c.date_end)}</span>
    <a class="v2-cta" href="${gotoHref}" target="_blank" rel="noopener noreferrer">
      Get deal →
    </a>
  </div>
</div>`;
}

// ─── Filter & render ──────────────────────────────────────────
function render() {
  const query = elSearch.value.toLowerCase().trim();
  const promoOnly = elPromoToggle.checked;
  const catVal = elCategory.value;
  const merVal = elMerchant.value;

  let results = allCoupons;

  if (promoOnly) {
    results = results.filter(c => hasRealCode(c.promocode));
  }

  if (catVal && catVal !== "all") {
    results = results.filter(c =>
      c.categories?.some(cat => cat.name === catVal)
    );
  }

  if (merVal && merVal !== "all") {
    results = results.filter(c => (c.campaign?.name ?? "") === merVal);
  }

  if (query) {
    results = results.filter(c => {
      const fields = [
        c.campaign?.name ?? "",
        c.short_name ?? "",
        c.name ?? "",
        c.description ?? "",
        c.promocode ?? "",
        c.discount ?? "",
      ];
      return fields.some(f => f.toLowerCase().includes(query));
    });
  }

  // Update count
  elCount.textContent = `${results.length} deal${results.length !== 1 ? "s" : ""} found`;

  if (results.length === 0) {
    elGrid.innerHTML = `
      <div class="v2-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <h3>No deals found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>`;
    return;
  }

  elGrid.innerHTML = results.map(buildCard).join("");

  // Attach copy button listeners
  elGrid.querySelectorAll(".v2-copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const code = btn.dataset.code;
      navigator.clipboard?.writeText(code).catch(() => {
        const ta = document.createElement("textarea");
        ta.value = code; document.body.appendChild(ta);
        ta.select(); document.execCommand("copy");
        document.body.removeChild(ta);
      });
      const orig = btn.textContent;
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => { btn.textContent = orig; btn.classList.remove("copied"); }, 1800);
    });
  });
}

function scheduleRender() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(render, 200);
}

// ─── Populate filter dropdowns ────────────────────────────────
function populateFilters() {
  const cats = unique(allCoupons.flatMap(c => c.categories?.map(x => x.name) ?? []));
  const mers = unique(allCoupons.map(c => c.campaign?.name ?? ""));

  elCategory.innerHTML = `<option value="all">All categories</option>` +
    cats.map(c => `<option value="${c}">${c}</option>`).join("");

  elMerchant.innerHTML = `<option value="all">All merchants</option>` +
    mers.map(m => `<option value="${m}">${m}</option>`).join("");
}

// ─── Show skeletons while loading ─────────────────────────────
function showSkeletons(count = 8) {
  elGrid.innerHTML = Array.from({ length: count }, () =>
    `<div class="v2-skeleton"></div>`
  ).join("");
}

// ─── Bootstrap ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  elGrid        = document.getElementById("v2-grid");
  elCount       = document.getElementById("v2-count");
  elSearch      = document.getElementById("v2-search");
  elPromoToggle = document.getElementById("v2-promo-cb");
  elCategory    = document.getElementById("v2-category");
  elMerchant    = document.getElementById("v2-merchant");

  // Read URL search param
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("search") ?? "";
  elSearch.value = initialQuery;

  // Wire up events
  elSearch.addEventListener("input", scheduleRender);
  elSearch.addEventListener("keydown", e => { if (e.key === "Enter") { clearTimeout(debounceTimer); render(); } });
  document.getElementById("v2-search-btn").addEventListener("click", () => { clearTimeout(debounceTimer); render(); });

  elPromoToggle.addEventListener("change", render);

  elCategory.addEventListener("change", render);
  elMerchant.addEventListener("change", render);

  // Load data
  showSkeletons();

  fetch("data/coupon_string")
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(data => {
      allCoupons = Array.isArray(data) ? data : [];
      populateFilters();
      render();
    })
    .catch(err => {
      elGrid.innerHTML = `<div class="v2-empty">
        <h3>Failed to load coupons</h3>
        <p>${err.message}</p>
      </div>`;
      elCount.textContent = "0 deals found";
    });
});
