/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach((t=>t.hostConnected?.()));}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()));}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e,this[e]=h.fromAttribute(s,t.type)??this._$Ej?.get(e)??null,this._$Em=null;}}requestUpdate(t,s,i){if(void 0!==t){const e=this.constructor,h=this[t];if(i??=e.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(e._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.0");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t$1.trustedTypes,s$1=i$1?i$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,e="$lit$",h=`lit$${Math.random().toFixed(9).slice(2)}$`,o$2="?"+h,n$1=`<${o$2}>`,r$2=document,l=()=>r$2.createComment(""),c=t=>null===t||"object"!=typeof t&&"function"!=typeof t,a=Array.isArray,u=t=>a(t)||"function"==typeof t?.[Symbol.iterator],d="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,_=/>/g,m=RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),p=/'/g,g=/"/g,$=/^(?:script|style|textarea|title)$/i,y=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=y(1),b=y(2),T=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),A=new WeakMap,C=r$2.createTreeWalker(r$2,129);function P(t,i){if(!a(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s$1?s$1.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,o=[];let r,l=2===i?"<svg>":3===i?"<math>":"",c=f;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,y=0;for(;y<s.length&&(c.lastIndex=y,u=c.exec(s),null!==u);)y=c.lastIndex,c===f?"!--"===u[1]?c=v:void 0!==u[1]?c=_:void 0!==u[2]?($.test(u[2])&&(r=RegExp("</"+u[2],"g")),c=m):void 0!==u[3]&&(c=m):c===m?">"===u[0]?(c=r??f,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?m:'"'===u[3]?g:p):c===g||c===p?c=m:c===v||c===_?c=f:(c=m,r=void 0);const x=c===m&&t[i+1].startsWith("/>")?" ":"";l+=c===f?s+n$1:d>=0?(o.push(a),s.slice(0,d)+e+s.slice(d)+h+x):s+h+(-2===d?i:x);}return [P(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),o]};class N{constructor({strings:t,_$litType$:s},n){let r;this.parts=[];let c=0,a=0;const u=t.length-1,d=this.parts,[f,v]=V(t,s);if(this.el=N.createElement(f,n),C.currentNode=this.el.content,2===s||3===s){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=C.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(e)){const i=v[a++],s=r.getAttribute(t).split(h),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:c,name:e[2],strings:s,ctor:"."===e[1]?H:"?"===e[1]?I:"@"===e[1]?L:k}),r.removeAttribute(t);}else t.startsWith(h)&&(d.push({type:6,index:c}),r.removeAttribute(t));if($.test(r.tagName)){const t=r.textContent.split(h),s=t.length-1;if(s>0){r.textContent=i$1?i$1.emptyScript:"";for(let i=0;i<s;i++)r.append(t[i],l()),C.nextNode(),d.push({type:2,index:++c});r.append(t[s],l());}}}else if(8===r.nodeType)if(r.data===o$2)d.push({type:2,index:c});else {let t=-1;for(;-1!==(t=r.data.indexOf(h,t+1));)d.push({type:7,index:c}),t+=h.length-1;}c++;}}static createElement(t,i){const s=r$2.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){if(i===T)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=c(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=S(t,h._$AS(t,i.values),h,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??r$2).importNode(i,true);C.currentNode=e;let h=C.nextNode(),o=0,n=0,l=s[0];for(;void 0!==l;){if(o===l.index){let i;2===l.type?i=new R(h,h.nextSibling,this,t):1===l.type?i=new l.ctor(h,l.name,l.strings,this,t):6===l.type&&(i=new z(h,this,t)),this._$AV.push(i),l=s[++n];}o!==l?.index&&(h=C.nextNode(),o++);}return C.currentNode=r$2,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),c(t)?t===E||null==t||""===t?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):u(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==E&&c(this._$AH)?this._$AA.nextSibling.data=t:this.T(r$2.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=N.createElement(P(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new M(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=A.get(t.strings);return void 0===i&&A.set(t.strings,i=new N(t)),i}k(t){a(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new R(this.O(l()),this.O(l()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(false,true,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class k{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=S(this,t,i,0),o=!c(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=S(this,e[s+n],i,n),r===T&&(r=this._$AH[n]),o||=!c(r)||r!==this._$AH[n],r===E?t=E:t!==E&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===E?void 0:t;}}class I extends k{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E);}}class L extends k{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=S(this,t,i,0)??E)===T)return;const s=this._$AH,e=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==E&&(s===E||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const j=t$1.litHtmlPolyfillSupport;j?.(N,R),(t$1.litHtmlVersions??=[]).push("3.3.0");const B=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new R(i.insertBefore(l(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return T}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.0");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{ void 0!==o?o.addInitializer((()=>{customElements.define(t,e);})):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

const ui$1 = {"card":{"ems_program_card":{"new":"New","delete":"Delete","change":"Change","advice":"Select a red switch time for adaptation","ems_read":"Read EMS","ems_write":"Write EMS","undo":"Undo","reset":"Reset","ems_success":"Accessing EMS bus successful","error":{"no_program":"No program was read (Read EMS first)","ems_no_response":"EMS bus did not respond (e.g., timeout issues)"},"editor":{"title":"Title","entity":"Entity","help_text":"Pick an entity, which contains switch times of an EMS program"}}}};
const en = {
  ui: ui$1,
};

const ui = {"card":{"ems_program_card":{"new":"Neu","delete":"Löschen","change":"Ändern","advice":"Wähle rote Schaltpunkte zum Anpassen aus","ems_read":"EMS lesen","ems_write":"EMS schreiben","undo":"Rückgängig","reset":"Zurücksetzen","ems_success":"Zugriff auf EMS-Bus erfolgreich","error":{"no_program":"Kein Programm verfügbar (zuerst EMS lesen)","ems_no_response":"EMS-Bus reagiert nicht (evtl. Timeout-Problem)"},"editor":{"title":"Titel","entity":"Entität","help_text":"Wähle eine Entität, welche Schaltpunkte eines EMS-Programms enthält"}}}};
const de = {
  ui,
};

const haWindow$1 = window;
async function loadCustomElements() {
  if (!customElements.get("ha-panel-config")) {
    await customElements.whenDefined("partial-panel-resolver");
    const ppr = document.createElement("partial-panel-resolver");
    ppr.hass = {
      panels: [
        {
          url_path: "tmp",
          component_name: "config"
        }
      ]
    };
    ppr._updateRoutes();
    await ppr.routerOptions.routes.tmp.load();
    await customElements.whenDefined("ha-panel-config");
    const dtr = document.createElement("ha-panel-config");
    await dtr.routerOptions.routes.automation.load();
  }
  if (!haWindow$1.cardHelpers) {
    haWindow$1.cardHelpers = await haWindow$1.loadCardHelpers();
  }
  if (!customElements.get("ha-time-input") && haWindow$1.cardHelpers) {
    haWindow$1.cardHelpers.createRowElement({ type: "time-entity" });
  }
}
await loadCustomElements();
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
    const [_, weekday, timeStr, stateStr] = parts;
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
    (_, i) => String(i).padStart(2, "0")
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
  let delta = printedProgramNew.filter((x) => !printedProgram.includes(x));
  if (printedProgramNew.length < printedProgram.length) {
    delta = delta.concat(
      Array.from(
        { length: printedProgram.length - printedProgramNew.length },
        (_, i) => `${(printedProgramNew.length + i).toString().padStart(2, "0")} not_set`
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
      for (let i = 0; i < stList.length; i++) {
        const st = stList[i];
        if (st.secondsSinceMidnight === secondsSinceMidnight) {
          stList[i] = stNew;
          break;
        } else if (st.secondsSinceMidnight > secondsSinceMidnight) {
          stList.splice(i, 0, stNew);
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
                ${Array.from({ length: 12 }, (_, i) => renderSvgTimes(i, card._hass.locale.language))}
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
      ${Object.entries(card.dayIds).map(([idx, _]) => b`
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
function renderSvgTimes(i, locale) {
  const timeObj = new Date(0, 0, 0, 1 + i * 2, 0);
  const formattedTime = timeObj.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit"
  });
  return b`<text y="${10 + i * 20}">${formattedTime}</text>`;
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
      <circle id="${wdId}-${idxDot}" cx="${stX}" cy="${stY}" r="5"
        @click="${dotClickHandler}" />
    `;
}

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
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
function renderButton(text, clickHandler, disabled = false) {
  return x`
    <mwc-button
      class="in-container"
      outlined
      @click="${clickHandler}"
      ?disabled=${disabled}
    >
      ${text}
    </mwc-button>
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
    this.config.title ??= "EMS";
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
        (_, index) => daysOfWeekFormatter.format(new Date(Date.UTC(2021, 5, index)))
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
          <ha-select style="width: 200px;"
            .naturalmenuwidth=${false}
            @change="${(e) => {
      const value = e?.target?.value;
      if (value) {
        this.switchTime.day = value;
      }
    }}" class="in-container">
            ${Object.entries(this.dayIds).map(
      ([idx, id]) => x`<ha-list-item
                value="${String(id)}"
                role="option"
                ?selected="${this.switchTime.day == id}"
              >
                ${this.dayNames[Number(idx)]}
              </ha-list-item>`
    )}
          </ha-select>
          <ha-time-input
            .locale=${this._hass.locale}
            .value=${timeStr}
            @change="${(e) => {
      const value = e?.target?.value;
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
    }}"
            class="in-container"></ha-time-input>
          <ha-checkbox
            .checked=${this.switchTime.state}
            @change="${(_) => {
      this.switchTime.state = !this.switchTime.state;
    }}"
            class="in-container"></ha-checkbox>
        </div>
        <div class="row">
          ${renderButton(
      localize("ui.card.ems_program_card.new"),
      () => {
        addSwitchTime(this);
        storeProgram(this);
        this.requestUpdate();
      },
      this.isRunning || !this.programNew
    )}
          ${renderButton(
      localize("ui.card.ems_program_card.delete"),
      () => {
        this.isSelected = false;
        removeSwitchTime(this);
        storeProgram(this);
        this.requestUpdate();
      },
      !this.isSelected
    )}
          ${renderButton(
      localize("ui.card.ems_program_card.change"),
      () => {
        this.isSelected = false;
        removeSwitchTime(this);
        addSwitchTime(this);
        storeProgram(this);
        this.requestUpdate();
      },
      !this.isSelected
    )}
        </div>

        ${!this.program || !this.programNew ? x`<div class="row message">
              ${localize("ui.card.ems_program_card.error.no_program")}
            </div>` : x`<div class="row">
                ${localize("ui.card.ems_program_card.advice")}
              </div>
              ${renderSvg(this, (e) => {
      const id = e?.target?.id;
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
      this.isRunning
    )}
        </div>
        <div class="row">
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
  n({ attribute: false })
], EmsProgramCard.prototype, "_hass", 2);
__decorateClass([
  n({ attribute: false })
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
          @click="${(e) => {
      const newConfig = Object.assign({}, this._config);
      const value = e?.target?.value;
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
          @change="${(e) => {
      const newConfig = Object.assign({}, this._config);
      const value = e?.target?.value;
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
  n({ attribute: false })
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

export { EmsProgramCard, EmsProgramCardEditor };
