# About Sharender

Sharender is a simple and powerful javascript template rendering library. It uses simple js template literal syntax; so there is no template language to learn. There are no external dependencies; thus it is extremely compact and ready to use in the browser, a service worker or in erver environments like node. It contains all the features we know and love in template engines; namely includes, inheritance, streaming, async and auto-escape. You can easily use with other libraries, such as REACT, or you can build complex frameworks over it. In addition, you get IDE support for your templates free of charge.

## Installation

`npm install sharender`

## Usage

This is how sharender templates look in practice:

```html
<!-- template.html -->
<article>
    <header>${hook(inc('/header.html', raw))}</header>
    ${ctx.post.picture? `
    <figure><img src="${url(ctx.post.picture)}" width="100%" height="30vh"></figure>
        `: ``}
    <section>
        ${ctx.post.user__picture? `<img src="${url(ctx.post.user__picture)}" width="1.5rem" height="1.5rem">`: ``}
        <b>${ctx.post.title}</b>
    </section>
    ${raw.extras || ``}
    <ul>
        ${loop(ctx.post.tags, tag => `
        <li>${tag}</li>
        `)}
    </ul>
    <footer>
        ${hook(lazy('/footer.html', raw))}
    </footer>
</article>
```

```javascript
// es6 import
import sharender from 'sharender/dist/es.js';
const { render } = sharender;

// commonjs/node require
const sharender = require('sharender/dist/cjs.js');
const render = sharender.render;

// iife function (include the script tag <script src="sharender/dist/iife.js"></script>)
const { render } = sharender();

// jscode.js
render('template.js', {post: {title: 'A Post', otherFields: '...'}, otherStuff: '...'});
```

The above code contains all you need to learn about sharender:

## The render(template, context) function

This is the primary function exported by the library. It renders the given template with the given context. The template passed in can be:

1. A function with the signature fn(ctx, raw, hook, inc, lazy, loop, blank, $). You only need include the args you will need in your template (for example fn(ctx, raw))
2. A promise that resolves to the above function
3. A link to a js file containing only the above function or any other file type (such as html) containig a js template literal string that will have all the arguments for the aforementioned function in scope when evaluated (like the example shown).

The context can be:

1. A regular js object
2. A promise that resolves to a js object
3. A link to a json file or backend

## Context

All templates receive  versions of the same context passed in: raw (raw) context and escaped (ctx) context. Raw is the exact context passed in while ctx context is a proxy around it tht ensures that any strings retrieved from within it is escaped.

## Control structures

You can use the ternary operator (?:) for conditionals and the automatic `loop` function (or the familiar but slightly more verbose array.map function) for loops.

## Includes, extends, streaming and async

These are all implemented in a simple and unified manner. The key element is the automatic `hook` function. You can use it anywhere in your templates passing it another function (fn) as the first argument and an optional function (holder) as the second argument.

fn function passed in receives 3 arguments and should return either a promise or a function. 

The first argument to fn is a unique id generated for the specific invocation of hook. We guarantee the uniqueness by incrementing id every time hook is called.

The second argument is the result that is returned from the hook call. This is the initial (placeholder) value of the hook call that is present in the initial rendered output before any nested promises (those created inside the hook call) are resolved.

The third argument is the promise eturned by render. This is actually a subclass of promise that has a value property which holds the rendered output at every point from the initial immediate/synchronous rendering up until the whole promise is resolved. The promise resolves to this value finally. Note that it is possible to modify the value as much as we likke between the time of initial immediate rendering and the time when the promise returned by render is finally resolved. This is precisely what `inc` (include) does.

If fn returns a promise, the promise returned by render will not resolve until this promise is resolved. This is used to implement synchronous inclusions with the automatic `inc` function.

If the function returns a function instead, the returned function is invoked just before the promise returned by render resolves. This is used to implement async includes, AKA streaming, using the automatic `lazy` function.

The holder function (optional second argument) is a function that takes the unique id generated for the hook call and returns any string that will be used as the result of the hook call (that is the text placed in the initial rendered output). For synchronous includes (using hook(inc(template, context))), this will usually be swapped out for the result of rendering the include before the render promise resolves. For aync includes using lazy, this will still be in the rendered output when the render promise is resolved...

Many other promise-related and async operations can also be implemented using the hook automatic function.
