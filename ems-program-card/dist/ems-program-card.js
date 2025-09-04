/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a;
const t$2 = globalThis, e$2 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$4 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$2 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$4.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$4.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$4 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), i$3 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$3(o2, t2, s$2);
}, S$1 = (s2, o2) => {
  if (e$2) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$2.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$2 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$4(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$2, defineProperty: e$1, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$3, getOwnPropertySymbols: o$3, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i2 = t2;
  switch (s2) {
    case Boolean:
      i2 = null !== t2;
      break;
    case Number:
      i2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i2 = JSON.parse(t2);
      } catch (t3) {
        i2 = null;
      }
  }
  return i2;
} }, f$1 = (t2, s2) => !i$2(t2, s2), b$1 = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$1 };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$1.litPropertyMetadata ?? (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let y$1 = class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b$1) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== h2 && e$1(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    const { get: e2, set: r2 } = h$1(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e2, set(s3) {
      const h2 = e2 == null ? void 0 : e2.call(this);
      r2 == null ? void 0 : r2.call(this, s3), this.requestUpdate(t2, h2, i2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b$1;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...r$3(t3), ...o$3(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$2(s3));
    } else void 0 !== s2 && i2.push(c$2(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a2;
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
  }
  addController(t2) {
    var _a2;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
  }
  removeController(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    var _a2;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
    });
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$ET(t2, s2) {
    var _a2;
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const h2 = (void 0 !== ((_a2 = i2.converter) == null ? void 0 : _a2.toAttribute) ? i2.converter : u$1).toAttribute(s2, i2.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    var _a2, _b;
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$1;
      this._$Em = e2, this[e2] = h2.fromAttribute(s2, t3.type) ?? ((_b = this._$Ej) == null ? void 0 : _b.get(e2)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2) {
    var _a2;
    if (void 0 !== t2) {
      const e2 = this.constructor, h2 = this[t2];
      if (i2 ?? (i2 = e2.getPropertyOptions(t2)), !((i2.hasChanged ?? f$1)(h2, s2) || i2.useDefault && i2.reflect && h2 === ((_a2 = this._$Ej) == null ? void 0 : _a2.get(t2)) && !this.hasAttribute(e2._$Eu(t2, i2)))) return;
      this.C(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
    i2 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a2;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) {
        const { wrapped: t4 } = i2, e2 = this[s3];
        true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
      }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
      }), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
      var _a3;
      return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 == null ? void 0 : p$1({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, i$1 = t$1.trustedTypes, s$1 = i$1 ? i$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, e = "$lit$", h = `lit$${Math.random().toFixed(9).slice(2)}$`, o$2 = "?" + h, n$1 = `<${o$2}>`, r$2 = document, l = () => r$2.createComment(""), c = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, a = Array.isArray, u = (t2) => a(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), d = "[ 	\n\f\r]", f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v = /-->/g, _ = />/g, m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), p = /'/g, g = /"/g, $ = /^(?:script|style|textarea|title)$/i, y2 = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), x = y2(1), b = y2(2), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), A = /* @__PURE__ */ new WeakMap(), C = r$2.createTreeWalker(r$2, 129);
function P(t2, i2) {
  if (!a(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s$1 ? s$1.createHTML(i2) : i2;
}
const V = (t2, i2) => {
  const s2 = t2.length - 1, o2 = [];
  let r2, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = f;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, y3 = 0;
    for (; y3 < s3.length && (c2.lastIndex = y3, u2 = c2.exec(s3), null !== u2); ) y3 = c2.lastIndex, c2 === f ? "!--" === u2[1] ? c2 = v : void 0 !== u2[1] ? c2 = _ : void 0 !== u2[2] ? ($.test(u2[2]) && (r2 = RegExp("</" + u2[2], "g")), c2 = m) : void 0 !== u2[3] && (c2 = m) : c2 === m ? ">" === u2[0] ? (c2 = r2 ?? f, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? m : '"' === u2[3] ? g : p) : c2 === g || c2 === p ? c2 = m : c2 === v || c2 === _ ? c2 = f : (c2 = m, r2 = void 0);
    const x2 = c2 === m && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === f ? s3 + n$1 : d2 >= 0 ? (o2.push(a2), s3.slice(0, d2) + e + s3.slice(d2) + h + x2) : s3 + h + (-2 === d2 ? i3 : x2);
  }
  return [P(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), o2];
};
class N {
  constructor({ strings: t2, _$litType$: s2 }, n3) {
    let r2;
    this.parts = [];
    let c2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = V(t2, s2);
    if (this.el = N.createElement(f2, n3), C.currentNode = this.el.content, 2 === s2 || 3 === s2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = C.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(e)) {
          const i2 = v2[a2++], s3 = r2.getAttribute(t3).split(h), e2 = /([.?@])?(.*)/.exec(i2);
          d2.push({ type: 1, index: c2, name: e2[2], strings: s3, ctor: "." === e2[1] ? H : "?" === e2[1] ? I : "@" === e2[1] ? L : k }), r2.removeAttribute(t3);
        } else t3.startsWith(h) && (d2.push({ type: 6, index: c2 }), r2.removeAttribute(t3));
        if ($.test(r2.tagName)) {
          const t3 = r2.textContent.split(h), s3 = t3.length - 1;
          if (s3 > 0) {
            r2.textContent = i$1 ? i$1.emptyScript : "";
            for (let i2 = 0; i2 < s3; i2++) r2.append(t3[i2], l()), C.nextNode(), d2.push({ type: 2, index: ++c2 });
            r2.append(t3[s3], l());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === o$2) d2.push({ type: 2, index: c2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(h, t3 + 1)); ) d2.push({ type: 7, index: c2 }), t3 += h.length - 1;
      }
      c2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = r$2.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function S(t2, i2, s2 = t2, e2) {
  var _a2, _b;
  if (i2 === T) return i2;
  let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
  const o2 = c(i2) ? void 0 : i2._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = S(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
class M {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? r$2).importNode(i2, true);
    C.currentNode = e2;
    let h2 = C.nextNode(), o2 = 0, n3 = 0, l2 = s2[0];
    for (; void 0 !== l2; ) {
      if (o2 === l2.index) {
        let i3;
        2 === l2.type ? i3 = new R(h2, h2.nextSibling, this, t2) : 1 === l2.type ? i3 = new l2.ctor(h2, l2.name, l2.strings, this, t2) : 6 === l2.type && (i3 = new z(h2, this, t2)), this._$AV.push(i3), l2 = s2[++n3];
      }
      o2 !== (l2 == null ? void 0 : l2.index) && (h2 = C.nextNode(), o2++);
    }
    return C.currentNode = r$2, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class R {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = S(this, t2, i2), c(t2) ? t2 === E || null == t2 || "" === t2 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t2 !== this._$AH && t2 !== T && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : u(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== E && c(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(r$2.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a2;
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = N.createElement(P(s2.h, s2.h[0]), this.options)), s2);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
    else {
      const t3 = new M(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = A.get(t2.strings);
    return void 0 === i2 && A.set(t2.strings, i2 = new N(t2)), i2;
  }
  k(t2) {
    a(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new R(this.O(l()), this.O(l()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, i2) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, i2); t2 && t2 !== this._$AB; ) {
      const i3 = t2.nextSibling;
      t2.remove(), t2 = i3;
    }
  }
  setConnected(t2) {
    var _a2;
    void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
  }
}
class k {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = E;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = S(this, t2, i2, 0), o2 = !c(t2) || t2 !== this._$AH && t2 !== T, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = S(this, e3[s2 + n3], i2, n3), r2 === T && (r2 = this._$AH[n3]), o2 || (o2 = !c(r2) || r2 !== this._$AH[n3]), r2 === E ? t2 = E : t2 !== E && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class H extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === E ? void 0 : t2;
  }
}
class I extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== E);
  }
}
class L extends k {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    if ((t2 = S(this, t2, i2, 0) ?? E) === T) return;
    const s2 = this._$AH, e2 = t2 === E && s2 !== E || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== E && (s2 === E || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a2;
    "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class z {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    S(this, t2);
  }
}
const j = t$1.litHtmlPolyfillSupport;
j == null ? void 0 : j(N, R), (t$1.litHtmlVersions ?? (t$1.litHtmlVersions = [])).push("3.3.0");
const B = (t2, i2, s2) => {
  const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
    e2._$litPart$ = h2 = new R(i2.insertBefore(l(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s = globalThis;
class i extends y$1 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a2;
    const t2 = super.createRenderRoot();
    return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
  }
  update(t2) {
    const r2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = B(r2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a2;
    super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
  }
  render() {
    return T;
  }
}
i._$litElement$ = true, i["finalized"] = true, (_a = s.litElementHydrateSupport) == null ? void 0 : _a.call(s, { LitElement: i });
const o$1 = s.litElementPolyfillSupport;
o$1 == null ? void 0 : o$1({ LitElement: i });
(s.litElementVersions ?? (s.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = (t2) => (e2, o2) => {
  void 0 !== o2 ? o2.addInitializer(() => {
    customElements.define(t2, e2);
  }) : customElements.define(t2, e2);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r$1 = (t2 = o, e2, r2) => {
  const { kind: n3, metadata: i2 } = r2;
  let s2 = globalThis.litPropertyMetadata.get(i2);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), "setter" === n3 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return { set(r3) {
      const n4 = e2.get.call(this);
      e2.set.call(this, r3), this.requestUpdate(o2, n4, t2);
    }, init(e3) {
      return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function(r3) {
      const n4 = this[o2];
      e2.call(this, r3), this.requestUpdate(o2, n4, t2);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n2(t2) {
  return (e2, o2) => "object" == typeof o2 ? r$1(t2, e2, o2) : ((t3, e3, o3) => {
    const r2 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r(r2) {
  return n2({ ...r2, state: true, attribute: false });
}
const ui$1 = { "card": { "ems_program_card": { "new": "New", "delete": "Delete", "change": "Change", "advice": "Select a red switch time for adaptation", "ems_read": "Read EMS", "ems_write": "Write EMS", "undo": "Undo", "reset": "Reset", "ems_success": "Accessing EMS bus successful", "error": { "no_program": "No program was read (Read EMS first)", "ems_no_response": "EMS bus did not respond (e.g., timeout issues)" }, "editor": { "title": "Title", "entity": "Entity", "help_text": "Pick an entity, which contains switch times of an EMS program" } } } };
const en = {
  ui: ui$1
};
const ui = { "card": { "ems_program_card": { "new": "Neu", "delete": "Löschen", "change": "Ändern", "advice": "Wähle rote Schaltpunkte zum Anpassen aus", "ems_read": "EMS lesen", "ems_write": "EMS schreiben", "undo": "Rückgängig", "reset": "Zurücksetzen", "ems_success": "Zugriff auf EMS-Bus erfolgreich", "error": { "no_program": "Kein Programm verfügbar (zuerst EMS lesen)", "ems_no_response": "EMS-Bus reagiert nicht (evtl. Timeout-Problem)" }, "editor": { "title": "Titel", "entity": "Entität", "help_text": "Wähle eine Entität, welche Schaltpunkte eines EMS-Programms enthält" } } } };
const de = {
  ui
};
const haWindow$1 = window;
async function loadCustomElements() {
  var _a2, _b;
  if (!haWindow$1.cardHelpers) {
    haWindow$1.cardHelpers = await haWindow$1.loadCardHelpers();
  }
  console.log("Card helpers:", haWindow$1.cardHelpers);
  for (const control of ["date", "time", "datetime"]) {
    await ((_b = (_a2 = haWindow$1.cardHelpers) == null ? void 0 : _a2.importMoreInfoControl) == null ? void 0 : _b.call(_a2, control));
  }
}
loadCustomElements().then(() => {
  console.log("Custom elements loaded");
});
const translations = { en, de };
let langDict = en;
function loadTranslations(lang = "en") {
  langDict = translations[lang] || translations["en"];
}
function localize(label) {
  let value = void 0;
  try {
    value = label.split(".").reduce((obj, key) => obj[key], langDict);
  } catch (error) {
  }
  if (value && typeof value === "string") {
    return value;
  } else {
    return label;
  }
}
async function accessEms(card, busInput, stopResponse) {
  loadTranslations(card._hass.locale.language);
  const maxMs = 2e4;
  const globalStartTime = Date.now();
  card.statusMessage = "";
  card.requestUpdate();
  const busResponses = [];
  let busResponse = "";
  for (const [idx, value] of Object.entries(busInput)) {
    await card._hass.callService("text", "set_value", {
      entity_id: card.config.entity_id,
      value
    });
    if (value.length > 2) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      await card._hass.callService("text", "set_value", {
        entity_id: card.config.entity_id,
        value: value.substring(0, 2)
      });
    }
    const startTime = Date.now();
    let now = startTime;
    while (now - startTime <= maxMs && !busResponse.startsWith(value)) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      busResponse = card._hass.states[card.config.entity_id].state;
      now = Date.now();
    }
    if (busResponse.startsWith(value)) {
      if (stopResponse && busResponse.endsWith(stopResponse)) {
        break;
      } else {
        busResponses.push(busResponse);
        card.statusMessage = ` ${Math.round(
          (Number(idx) + 1) / busInput.length * 100
        )} %`;
        card.requestUpdate();
      }
    } else {
      return {
        message: "ui.card.ems_program_card.error.ems_no_response"
      };
    }
  }
  return {
    status: "synchronized",
    id: card.config.entity_id,
    bus: busResponses,
    duration: Date.now() - globalStartTime,
    message: "ui.card.ems_program_card.ems_success"
  };
}
function printEmsProgram(program, daysOfWeekIds) {
  let printedProgram = [];
  let idx = 0;
  if (!program) {
    return printedProgram;
  }
  for (const wd of daysOfWeekIds) {
    if (!program[wd]) {
      continue;
    }
    for (let st of program[wd]) {
      let timeStr = st.hour + ":" + st.minute;
      let stateStr = st.state ? "on" : "off";
      printedProgram.push(
        `${idx.toString().padStart(2, "0")} ${wd} ${timeStr} ${stateStr}`
      );
      idx++;
    }
  }
  return printedProgram;
}
function parseProgram(program, daysOfWeekIds) {
  if (!program) {
    return void 0;
  }
  const programParsed = {};
  for (const wd of daysOfWeekIds) {
    programParsed[wd] = [];
  }
  for (const entry of program) {
    const parts = entry.split(" ");
    if (parts.length !== 4) continue;
    const [_2, weekday, timeStr, stateStr] = parts;
    const state = stateStr === "on" ? true : false;
    const [hour, minute] = timeStr.split(":").map((str) => parseInt(str));
    const secondsSinceMidnight = hour * 3600 + minute * 60;
    programParsed[weekday].push({
      hour: String(hour).padStart(2, "0"),
      minute: String(minute).padStart(2, "0"),
      secondsSinceMidnight,
      state,
      day: weekday,
      idx: -1
    });
  }
  return programParsed;
}
function cloneProgram(daysOfWeekIds, program) {
  let programCloned = {};
  if (!program) {
    return programCloned;
  }
  for (const wd of daysOfWeekIds) {
    if (!program[wd]) {
      continue;
    }
    programCloned[wd] = [];
    for (const st of program[wd]) {
      programCloned[wd].push({ ...st });
    }
  }
  return programCloned;
}
function setStateAttribute(card, data) {
  const entityId = card.config.entity_id;
  const stateObj = card._hass.states[entityId];
  let attrObj = stateObj.attributes;
  if (!data && attrObj["program"]) {
    delete attrObj["program"];
  } else {
    attrObj["program"] = data;
  }
  card._hass.callApi("post", "states/" + entityId, {
    state: stateObj.state,
    attributes: attrObj
  }).then((res) => {
    if (card.isDebugMode) {
      console.info(res);
    }
  }).catch((err) => {
    console.error(err);
  });
}
function storeProgram(card) {
  const data = {
    old: printEmsProgram(card.program, card.dayIds),
    new: printEmsProgram(card.programNew, card.dayIds)
  };
  setStateAttribute(card, data);
}
function loadProgram(card) {
  const entityId = card.config.entity_id;
  const stateObj = card._hass.states[entityId];
  if (!stateObj) {
    return;
  }
  const out = stateObj.attributes["program"];
  if (out) {
    if (card.isDebugMode) {
      console.log(out);
    }
    card.program = parseProgram(out.old, card.dayIds);
    card.programNew = parseProgram(out.new, card.dayIds);
  }
}
function undoProgram(card) {
  if (!card.program) {
    return;
  }
  card.programNew = cloneProgram(card.dayIds, card.program);
  storeProgram(card);
}
function resetProgram(card) {
  card.program = void 0;
  card.programNew = void 0;
  card.statusMessage = "";
  card.isRunning = false;
  setStateAttribute(card, void 0);
}
function readFromEms(card) {
  card.isRunning = true;
  const busInput = Array.from(
    { length: 42 },
    (_2, i2) => String(i2).padStart(2, "0")
  );
  const stopResponse = "not_set";
  accessEms(card, busInput, stopResponse).then((out) => {
    card.statusMessage = localize(out.message);
    if (card.isDebugMode) {
      console.info(out);
    }
    if (out.bus) {
      card.program = parseProgram(out.bus, card.dayIds);
      card.programNew = cloneProgram(card.dayIds, card.program);
      storeProgram(card);
    }
    card.isRunning = false;
  });
}
function writeToEms(card) {
  card.isRunning = true;
  const printedProgram = printEmsProgram(card.program, card.dayIds);
  const printedProgramNew = printEmsProgram(card.programNew, card.dayIds);
  if (card.isDebugMode) {
    console.info(printedProgram);
    console.info(printedProgramNew);
  }
  let delta = printedProgramNew.filter((x2) => !printedProgram.includes(x2));
  if (printedProgramNew.length < printedProgram.length) {
    delta = delta.concat(
      Array.from(
        { length: printedProgram.length - printedProgramNew.length },
        (_2, i2) => `${(printedProgramNew.length + i2).toString().padStart(2, "0")} not_set`
      )
    );
  }
  if (card.isDebugMode) {
    console.info(delta);
  }
  accessEms(card, delta).then((out) => {
    card.statusMessage = localize(out.message);
    if (card.isDebugMode) {
      console.info(out);
    }
    if (out.bus) {
      card.program = cloneProgram(card.dayIds, card.programNew);
      storeProgram(card);
    }
    card.isRunning = false;
  });
}
function addSwitchTime(card) {
  if (!card.programNew) {
    return;
  }
  const secondsSinceMidnight = parseInt(card.switchTime.hour) * 3600 + parseInt(card.switchTime.minute) * 60;
  const stNew = {
    day: card.switchTime.day,
    hour: card.switchTime.hour,
    minute: card.switchTime.minute,
    secondsSinceMidnight,
    state: card.switchTime.state,
    idx: -1
  };
  let stList = card.programNew[card.switchTime.day];
  if (stList.length > 0) {
    let stLast = stList[stList.length - 1];
    if (stLast.secondsSinceMidnight < secondsSinceMidnight) {
      stList.push(stNew);
    } else {
      for (let i2 = 0; i2 < stList.length; i2++) {
        const st = stList[i2];
        if (st.secondsSinceMidnight === secondsSinceMidnight) {
          stList[i2] = stNew;
          break;
        } else if (st.secondsSinceMidnight > secondsSinceMidnight) {
          stList.splice(i2, 0, stNew);
          break;
        }
      }
    }
  }
}
function removeSwitchTime(card) {
  if (!card.programNew) {
    return;
  }
  let stList = card.programNew[card.switchTime.day];
  stList.splice(card.switchTime.idx, 1);
}
const offY = 30;
const onY = 0;
const secondsToPx = 240 / 86400;
function getLastState(dayIds, program) {
  const lastState = dayIds.reverse().some((wdId) => {
    const stList = program[wdId];
    return stList.length > 0 ? stList[stList.length - 1].state : false;
  });
  return lastState ? onY : offY;
}
function renderSvg(card, dotClickHandler) {
  if (!card.program || !card.programNew) {
    return;
  }
  let lastState = { value: getLastState(card.dayIds, card.program) };
  let lastStateNew = { value: getLastState(card.dayIds, card.programNew) };
  return b`
  <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"
    width="100%" height="100%" version="1.1"
    viewBox="0 0 260 360">
    <defs>
        <g id="weekday_grid">
            <pattern id="grid" patternUnits="userSpaceOnUse"
                width="20" height="30" >
                <rect x="10" y="0" width="10" height="100%"
                    stroke="none" fill="gray" opacity="0.2" />
            </pattern>
            <rect width="240" height="30" fill="url(#grid)" />
            <rect width="240" height="30" fill="none"
                stroke="gray" opacity="0.2" />
            <g transform="translate(2, 15) rotate(-90)"
                font-size="7px" font-family="sans-serif" fill="grey"
                dominant-baseline="start" text-anchor="middle">
                ${Array.from({ length: 12 }, (_2, i2) => renderSvgTimes(i2, card._hass.locale.language))}
            </g>
        </g>
    </defs>

    <g transform="translate(130, 13)"
        font-size="10px" font-family="sans-serif" fill="gray"
        dominant-baseline="start" text-anchor="middle">
        ${Object.entries(card.dayNames).map(([idx, wdName]) => b`
          <text y="${+idx * 50}">${wdName}</text>
        `)}
    </g>

    <g transform="translate(10, 20)">
      ${Object.entries(card.dayIds).map(([idx, _2]) => b`
        <use xlink:href="#weekday_grid" y="${+idx * 50}" />
      `)}
    </g>

    ${Object.entries(card.dayIds).map(([idx, wdId]) => renderSvgLines(card.program, Number(idx), wdId, "rgb(71,108,149)", lastState))}
    ${Object.entries(card.dayIds).map(
    ([idx, wdId]) => renderSvgLines(
      card.programNew,
      Number(idx),
      wdId,
      "rgb(149,108,71)",
      lastStateNew
    )
  )}
    ${Object.entries(card.dayIds).map(
    ([idx, wdId]) => b`
      <g transform="translate(10, ${20 + +idx * 50})" fill="red">
        ${card.programNew ? Object.entries(card.programNew[wdId]).map(
      ([idxDot, st]) => renderSvgDots(wdId, Number(idxDot), st, dotClickHandler)
    ) : b``}
      </g>
    `
  )}
  </svg>`;
}
function renderSvgTimes(i2, locale) {
  const timeObj = new Date(0, 0, 0, 1 + i2 * 2, 0);
  const formattedTime = timeObj.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit"
  });
  return b`<text y="${10 + i2 * 20}">${formattedTime}</text>`;
}
function renderSvgLines(program, idx, wdId, color, lastState) {
  if (!program) {
    return b``;
  }
  let lastY = lastState.value;
  let points = `0,${lastY}`;
  for (const st of program[wdId]) {
    const stX = Math.floor(st.secondsSinceMidnight * secondsToPx);
    let stY = offY;
    if (st.state) {
      stY = onY;
    }
    if (lastY !== stY) {
      points += ` ${stX},${lastY}`;
    }
    points += ` ${stX},${stY}`;
    lastY = stY;
  }
  points += ` 240,${lastY}`;
  lastState.value = lastY;
  return b`
    <g transform="translate(10, ${20 + idx * 50})">
      <polyline points="${points}"
          fill="none" stroke="${color}" stroke-width="3"
          stroke-opacity="0.6" />
    </g>`;
}
function renderSvgDots(wdId, idxDot, st, dotClickHandler) {
  const stX = Math.floor(st.secondsSinceMidnight * secondsToPx);
  let stY = offY;
  if (st.state) {
    stY = onY;
  }
  return b`
      <circle id="${wdId}-${idxDot}" cx="${stX}" cy="${stY}" r="6.5"
        @click="${dotClickHandler}" />
    `;
}
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
const haWindow = window;
const cssStyles = i$3`
  .row {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .in-container {
    margin: 2px;
  }
  .message {
    font-style: italic;
  }
`;
function renderButton(text, clickHandler, disabled = false, variant = "brand") {
  return x`
    <ha-button
      class="in-container"
      appearance="plain" variant="${variant}" size="medium"
      @click="${clickHandler}"
      ?disabled=${disabled}
    >
      ${text}
    </ha-button>
  `;
}
let EmsProgramCard = class extends i {
  // Create card
  constructor() {
    super();
    this.switchTime = {
      day: "mo",
      hour: "07",
      minute: "00",
      state: true,
      idx: -1,
      secondsSinceMidnight: -1
    };
    this.isRunning = false;
    this.isSelected = false;
    this.statusMessage = "";
    this.dayIds = [];
    this.dayNames = [];
    this.isDebugMode = false;
    const urlParams = new URLSearchParams(window.location.search);
    this.isDebugMode = urlParams.has("debug") && urlParams.get("debug") === "1";
  }
  // Handle all config parameters
  setConfig(config) {
    this.config = { ...config };
  }
  // Hass method which is regularly called by HA
  set hass(hass) {
    this._hass = hass;
    if (!this.program) {
      const daysOfWeekFormatter = new Intl.DateTimeFormat(
        this._hass.locale.language,
        {
          weekday: "long"
        }
      );
      this.dayIds = ["mo", "tu", "we", "th", "fr", "sa", "su"];
      this.dayNames = Array.from(
        { length: 7 },
        (_2, index) => daysOfWeekFormatter.format(new Date(Date.UTC(2021, 5, index)))
      );
      loadProgram(this);
    }
    loadTranslations(this._hass.locale.language);
  }
  // Define size of card
  getCardSize() {
    return 5;
  }
  // Main render method
  render() {
    if (!this.config.entity_id) {
      return x`<ha-card header="${this.config.title}">
        <div class="card-content">
          ${localize("ui.card.ems_program_card.editor.help_text")}
          <pre><code>
            type: custom:ems-program-card
            title: Program Buderus
            entity_id: text.thermostat_hc1_switchTime1
          </code></pre>
        </div>
      </ha-card> `;
    }
    const timeStr = this.switchTime.hour + ":" + this.switchTime.minute;
    return x`<ha-card header="${this.config.title}">
      <div class="card-content">
        <div class="row">
          <ha-select style="width: 150px;"
            .naturalmenuwidth=${false}
            @change="${(e2) => {
      var _a2;
      return this.switchTime.day = (_a2 = e2 == null ? void 0 : e2.target) == null ? void 0 : _a2.value;
    }}"
            class="in-container">
              ${Object.entries(this.dayIds).map(([idx, id]) => x`<ha-list-item
                value="${String(id)}"
                role="option"
                ?selected="${this.switchTime.day == id}">
                ${this.dayNames[Number(idx)]}
              </ha-list-item>`)}
          </ha-select>
          <ha-time-input
            .locale=${this._hass.locale}
            .value=${timeStr}
            @change="${(e2) => {
      var _a2;
      const value = (_a2 = e2 == null ? void 0 : e2.target) == null ? void 0 : _a2.value;
      if (value) {
        const [hour, minute] = value.split(":");
        let hourNum = Number(hour);
        if (!(hourNum >= 0 && hourNum <= 23)) {
          hourNum = 0;
        }
        let minuteNum = Number(minute);
        if (!(minuteNum >= 0 && minuteNum <= 59)) {
          minuteNum = 0;
        }
        minuteNum = Math.floor(minuteNum / 10) * 10;
        this.switchTime.hour = String(hourNum).padStart(2, "0");
        this.switchTime.minute = String(minuteNum).padStart(2, "0");
        this.requestUpdate();
      }
    }}" class="in-container"></ha-time-input>
          <ha-switch
            .checked=${this.switchTime.state}
            @change="${(_2) => this.switchTime.state = !this.switchTime.state}"
            class="in-container"></ha-switch>
        </div>
        <div class="row">
          ${renderButton(localize("ui.card.ems_program_card.new"), () => {
      addSwitchTime(this);
      storeProgram(this);
      this.requestUpdate();
    }, this.isRunning || !this.programNew)}
          ${renderButton(localize("ui.card.ems_program_card.delete"), () => {
      this.isSelected = false;
      removeSwitchTime(this);
      storeProgram(this);
      this.requestUpdate();
    }, !this.isSelected)}
          ${renderButton(localize("ui.card.ems_program_card.change"), () => {
      this.isSelected = false;
      removeSwitchTime(this);
      addSwitchTime(this);
      storeProgram(this);
      this.requestUpdate();
    }, !this.isSelected)}
        </div>

        ${!this.program || !this.programNew ? x`<div class="row message">
              ${localize("ui.card.ems_program_card.error.no_program")}
            </div>` : x`<div class="row">
                ${localize("ui.card.ems_program_card.advice")}
              </div>
              ${renderSvg(this, (e2) => {
      var _a2;
      const id = (_a2 = e2 == null ? void 0 : e2.target) == null ? void 0 : _a2.id;
      if (id && this.programNew) {
        const [wdId, idx] = id.split("-");
        const selectedSt = this.programNew[wdId][Number(idx)];
        this.isSelected = true;
        this.switchTime = {
          day: wdId,
          hour: selectedSt.hour,
          minute: selectedSt.minute,
          state: selectedSt.state,
          idx: Number(idx),
          secondsSinceMidnight: -1
        };
      }
    })}`}

        <div class="row">
          ${renderButton(
      localize("ui.card.ems_program_card.ems_read"),
      () => {
        this.isSelected = false;
        readFromEms(this);
        this.requestUpdate();
      },
      this.isRunning
    )}
          ${renderButton(
      localize("ui.card.ems_program_card.ems_write"),
      () => {
        this.isSelected = false;
        writeToEms(this);
        this.requestUpdate();
      },
      this.isRunning,
      "danger"
    )}
          ${renderButton(
      localize("ui.card.ems_program_card.undo"),
      () => {
        this.isSelected = false;
        undoProgram(this);
        this.requestUpdate();
      },
      this.isRunning
    )}
          ${this.isDebugMode ? renderButton(
      localize("ui.card.ems_program_card.reset"),
      () => {
        this.isSelected = false;
        resetProgram(this);
        this.requestUpdate();
      },
      this.isRunning
    ) : x``}
        </div>

        <div class="row message">
          ${this.statusMessage}
        </div>
      </div>
    </ha-card>`;
  }
  // Set config editor card
  static getConfigElement() {
    return document.createElement("ems-program-card-editor");
  }
};
EmsProgramCard.styles = cssStyles;
__decorateClass([
  n2({ attribute: false })
], EmsProgramCard.prototype, "_hass", 2);
__decorateClass([
  n2({ attribute: false })
], EmsProgramCard.prototype, "config", 2);
__decorateClass([
  r()
], EmsProgramCard.prototype, "program", 2);
__decorateClass([
  r()
], EmsProgramCard.prototype, "programNew", 2);
__decorateClass([
  r()
], EmsProgramCard.prototype, "switchTime", 2);
__decorateClass([
  r()
], EmsProgramCard.prototype, "isRunning", 2);
__decorateClass([
  r()
], EmsProgramCard.prototype, "isSelected", 2);
__decorateClass([
  r()
], EmsProgramCard.prototype, "statusMessage", 2);
__decorateClass([
  r()
], EmsProgramCard.prototype, "dayIds", 2);
__decorateClass([
  r()
], EmsProgramCard.prototype, "dayNames", 2);
__decorateClass([
  r()
], EmsProgramCard.prototype, "isDebugMode", 2);
EmsProgramCard = __decorateClass([
  t("ems-program-card")
], EmsProgramCard);
haWindow.customCards = haWindow.customCards || [];
haWindow.customCards.push({
  type: "ems-program-card",
  name: "EMS Program Card"
});
let EmsProgramCardEditor = class extends i {
  constructor() {
    super(...arguments);
    this.isDebugMode = false;
  }
  // Sets the configuration
  setConfig(config) {
    this._config = config;
    const urlParams = new URLSearchParams(window.location.search);
    this.isDebugMode = urlParams.has("debug") && urlParams.get("debug") === "1";
  }
  // Hass method which is regularly called by HA
  set hass(hass) {
    this._hass = hass;
    if (!this.entityIdList) {
      this.entityIdList = Object.keys(hass.states).filter(
        (key) => key.startsWith("text.")
      );
      if (this.isDebugMode) {
        console.info(this.entityIdList);
      }
    }
  }
  // Deal with config changes
  configChanged(newConfig) {
    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
  // Render config card
  render() {
    return x`
      <div class="row">
        ${localize("ui.card.ems_program_card.editor.help_text")}
      </div>
      <div class="row">
        <ha-textfield
          label="${localize("ui.card.ems_program_card.editor.title")}"
          .value=${this._config.title}
          class="in-container"
          @click="${(e2) => {
      var _a2;
      const newConfig = Object.assign({}, this._config);
      const value = (_a2 = e2 == null ? void 0 : e2.target) == null ? void 0 : _a2.value;
      if (value) {
        newConfig.title = value;
        this.configChanged(newConfig);
      }
    }}"
        ></ha-textfield>
        <ha-entity-picker
          .hass=${this._hass}
          .value=${this._config.entity_id}
          .includeEntities=${Object.keys(this._hass.states).filter(
      (key) => key.startsWith("text.")
    )}
          .label="${localize("ui.card.ems_program_card.editor.entity")}"
          class="in-container"
          @change="${(e2) => {
      var _a2;
      const newConfig = Object.assign({}, this._config);
      const value = (_a2 = e2 == null ? void 0 : e2.target) == null ? void 0 : _a2.value;
      if (value) {
        newConfig.entity_id = value;
        this.configChanged(newConfig);
      }
    }}" allow-custom-entity></ha-entity-picker>
      </div>
    `;
  }
};
EmsProgramCardEditor.styles = cssStyles;
__decorateClass([
  n2({ attribute: false })
], EmsProgramCardEditor.prototype, "_hass", 2);
__decorateClass([
  r()
], EmsProgramCardEditor.prototype, "_config", 2);
__decorateClass([
  r()
], EmsProgramCardEditor.prototype, "entityIdList", 2);
__decorateClass([
  r()
], EmsProgramCardEditor.prototype, "isDebugMode", 2);
EmsProgramCardEditor = __decorateClass([
  t("ems-program-card-editor")
], EmsProgramCardEditor);
export {
  EmsProgramCard,
  EmsProgramCardEditor
};
