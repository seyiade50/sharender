"use strict";let e=0;var t={num:function(){return e++}};class n extends Promise{constructor(e,t){super(e),this.value=t}toString(){return this.value.toString()}then(e,t){return new n((()=>{super.then(e,t)}),this.value?.then?.()||this.value)}catch(e){return new n((()=>{super.catch(e)}),this.value?.catch?.()||this.value)}finally(e){return new n((()=>{super.finally(e)}),this.value?.finally?.()||this.value)}}var r={ValuePromise:n};const{num:o}=t,{ValuePromise:s}=r,l=e=>`[[[[${e}}}}}`,c=e=>"";function u(e,t){const n=(n,r,o)=>h(e,t).then((e=>{o.value=o.value.replace(r,e)}));return n.holder=c,n}const a=e=>`<template rid="${e}"></template>`;function i(e,t,n){let r=(n,r,o)=>()=>{h(e,t).then((e=>{const t=document.querySelector(`[rid="${n}"]`);t&&(t.insertAdjacentHTML("afterend",e),t.parentNode.removeChild(t))}))};return r.holder=e=>(n||a)(e),r}function h(e,t){const n=[],r=[];let c={toString(){return this.value}};function u(e,t){if(!(e instanceof Function))return"";const s=o(),u=(t||e.holder||l)(s),a=e(s,u,c);return a instanceof Promise?n.push(a):a instanceof Function&&r.push(a),u}return new s(((o,s)=>{p(e,t,u,s).then((e=>{c.value=e,Promise.all(n).then((e=>{o&&o(c.value);for(let t of r)t(e)}))}),(e=>{console.log(e.toString()),s&&s(e)}))}),c)}const f=()=>"";h.fetch={value:e=>Promise.resolve(e),fetch:(e,t,n,r,o)=>{let s=h.fetch[e+"s"];return s||(s={},h.fetch[e+"s"]=s),s.hasOwnProperty(t)?Promise.resolve(s[t]):fetch(t,n).then((t=>t[e]()),r).then((e=>(o&&(e=o(e)),s[t]=e,e.url=t,e)),r)},text:(e,t,n)=>h.fetch.fetch("text",e,t,n),temp:(e,t,n,r)=>h.fetch.fetch("text",e,t,n,r||(e.endsWith(".js")?h.jsTemplate:h.template)),json:(e,t,n)=>h.fetch.fetch("json",e,t,n)},h.args="ctx, raw, hook, inc, lazy, loop, blank, $",h.template=e=>h.jsTemplate("("+h.args+") => `"+e+"`"),h.jsTemplate=e=>new Function("return "+e+";")(),h.functions={};const p=function(e,t,n,r){let o,s;return o="string"==typeof e?h.fetch.temp(e):e instanceof Promise?e:Promise.resolve(e),s="string"==typeof t?h.json(t):t instanceof Promise?t:Promise.resolve(t||{}),Promise.all([o,s]).then((e=>{let t=e[0],r=e[1];return t(m(r),r,n,u,i,g,f,h.functions)}),r)};function m(e){return e.__proxy__?e:new Proxy(e,v)}const v={get(e,t){if("__proxy__"===t)return!0;let n=e[t];return null==n?"":"object"==typeof n?m(n):"string"==typeof n?n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):n}};const g=(e,t,n)=>e.map(t).join(n||"");var d={render:h,include:u,lazy:i,blank:f,loop:g};module.exports=d;
