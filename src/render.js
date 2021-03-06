import numModule from './num.js';
const {num} = numModule;

import valuepromiseModule from './valuepromise.js';
const {ValuePromise} = valuepromiseModule;

const defaultHolder = (id => `[[[[${id}}}}}`);
const includeHolder = (id => `[[[[${id}}}}}`);

/**
 * Now include code is fully isolated from render code!
 * Use in templates with: hook(include(template, context, error), holder). 
 * (the template function receives the hook and this module exports the include function)
 * @param {*} template 
 * @param {*} context 
 */
function include(template, context) {
    let fn = (id, returnValue, value) => {
        return new Promise((resolve, reject) => render(template, context).then(t => {
            value.value = value.value.replace(returnValue, t);
            resolve(t);
        }, reject));
    };
    fn.holder = includeHolder;
    return fn;
}

const lazyHolder = (id => `<template rid="${id}"></template>`);

/**
 * The lazy equivalent of include that doesn't block the render
 * @param {*} template 
 * @param {*} context 
 * @param {*} options An options object containing error (as described for include) and/or holder which should return the markup to be rendered initially.
 *                    The default holder function is: (id) => `<template rid="${id}"></template>`
 */
function lazy(template, context, holder) {
    let fn = (id, returnValue, value) => {
        return () => { // resolved values of hooked promises passed in but not important here 
            render(template, context).then(t => {
                const el = document.querySelector(`[rid="${id}"]`);
                if (el) {
                    el.insertAdjacentHTML('afterend', t);
                    el.parentNode.removeChild(el);
                }
            });
        };
    };
    fn.holder = (id) => (holder || lazyHolder)(id);
    return fn;
}

function render(template, context) {
    if (context === undefined || context === null) context = {};
    let promises = [], functions = [];
    let value = {toString() {return this.value;}};
    function hook(fn, holder) {
        if (!(fn instanceof Function)) return '';
        let id = num();
        let returnValue = (holder || fn.holder || defaultHolder)(id);
        let result = fn(id, returnValue, value);
        if (result instanceof Promise) promises.push(result);
        else if (result instanceof Function) functions.push(result);
        return returnValue;
    }
    
    let result = new ValuePromise((resolve, reject) => {
        renderAsync(template, context, hook, reject).then(t => {
            // console.log(t);
            value.value = t;
            Promise.allSettled(promises).then(incs => {
                // console.log(value.value);
                if (resolve) {
                    resolve(value.value);
                }
                for (let f of functions) f(incs);
            }, err => {
                console.log(err.toString());
                if (reject) reject(err);
            })
        }, err => {
            console.log(err.toString());
            if (reject) reject(err);
        });
    }, value);
    return result;
}
const blank = () => ''; 
render.fetch = {
    value: (v) => Promise.resolve(v),
    fetch: (op, url, init, reject, transform) => {
        let promise = render.fetch[op + 's'];
        if (!promise) {
            promise = {}
            render.fetch[op + 's'] = promise;
        }
        if (promise.hasOwnProperty(url)) return Promise.resolve(promise[url]);
        return fetch(url, init).then(r => r[op](), reject).then(t => {
            if (transform) t = transform(t);
            promise[url] = t;
            t.url = url;
            return t;
        }, reject)
    },
    text: (url, init, reject) => {
        return render.fetch.fetch('text', url, init, reject);
    },
    temp: (url, init, reject, transform) => {
        return render.fetch.fetch('text', url, init, reject, transform || (url.endsWith('.js')? render.jsTemplate: render.template));
    },
    json: (url, init, reject) => {
        return render.fetch.fetch('json', url, init, reject);
    },
};
render.rawTemplates = true;
render.args = 'ctx, raw, hook, inc, lazy, loop, blank, $';
render.template = t => {
    return render.jsTemplate('(' + render.args + ') => `' + t + '`');
}
render.jsTemplate = (t) => { // returns a function suitable for use as a template given the function string
    if (render.rawTemplates) t = unEscape(t);
    return (new Function('return ' + t + ';'))();
};
function unEscape(t) {
    return t.replace(/\&amp;/g, '&').replace(/\&lt\;/g, '<').replace(/\&gt\;/g, '>').replace(/\&quot\;/g, '"').replace(/\&\#039\;/g, "'");
}
render.functions = {};

const renderAsync = function(template, context, hook, reject) { // returns a promise that resolves to j-rendered output
    let templatePromise;
    if (typeof template === 'string') {
        templatePromise = render.fetch.temp(template);
    } else if (template instanceof Promise) {  // must be a promise that resolves to a template string
        templatePromise = template;
    } else {   // anything else must be a function. so a promise that simply resolves to it
        templatePromise = Promise.resolve(template);
    }
    let contextPromise
    if (typeof context === 'string') {
        contextPromise = render.json(context);
    } else if (context instanceof Promise) { 
        contextPromise = context;
    } else {
        contextPromise = Promise.resolve(context || {});
    }
    return Promise.all([templatePromise, contextPromise]).then(r => {
        let t = r[0], context = r[1];
        return t(renderProxy(context), context, hook, (t, c) => hook(include(t, c)), (t, c, h) => hook(lazy(t, c, h)), loop, blank, render.functions);
    }, reject)
}
function renderProxy(context) {
    if (context.__proxy__) return context;
    return new Proxy(context, renderProxyTrap);
}
const renderProxyTrap = {
    get(target, p) {
        if (p === '__proxy__') return true;
        // if (target instanceof Array) p = parseInt(p);
        let v = target[p];
        if (v === null || v === undefined) return '';
        if (typeof v === 'object') return renderProxy(v);
        if (typeof v === 'string') return renderEsc(v);
        return v;
    }
};
function renderEsc(t) {
	return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
const loop = (arr, transform, sep) => {
    return arr.map(transform).join(sep || '');
}

export default { render };