# About Sharender

Sharender is a simple and powerful javascript template rendering library. It uses simple js template literal syntax; so there is no template language to learn. There are no external dependencies; thus it is extremely compact and ready to use in the browser, a service worker or in erver environments like node. It contains all the features we know and love in template engines; namely includes, inheritance, streaming, async and auto-escape. You can easily use with other libraries, such as REACT, or you can build complex frameworks over it. In addition, you get IDE support for your templates free of charge.

This is how sharender templates look in practice:

```html
<!-- template.html -->
<article>
    <header>${hook(include('/header.html', raw))}</header>
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
// jscode.js
render('template.js', {post: {title: 'A Post', otherFields: '...'}, otherStuff: '...'});
```


The above code contains all you need to learn about sharender:

## The render(template, context) function

This is the primary function exported by the library. It renders the given template with the given context. The template passed in can be:

1. A function with the signature fn(ctx, raw, hook, include, lazy, loop, blank, $). You only need include the args you will need in your template (for example fn(ctx, raw))
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

These are all implemented in a simple and unified manner. The key element is the automatic `hook` function. You can use it anywhere in your templates passing it another function as the first argument.

The function passed in receives ... and should return either a promise or a function.  

If function passed to hook returns a promise, the promise returned by render will not resolve until this promise is resolved. This is used to implement synchronous inclusions with the automatic `inc` function.

If the function returns a function instead, the returned function is invoked just before the promise returned by render resolves. This is used to implement async includes, AKA streaming, using the automatic `lazy` function.

Many other promise-related and async operations can also be implemented using the hook automatic function.
