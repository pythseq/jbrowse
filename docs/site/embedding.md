---
id: embedding
title: Embedding JBrowse
---

## Embedding in an iframe

One way of embedding JBrowse just runs the full browser in an `iframe` element.  It's very simple and easy to get running.

```html
<html>
  <head>
    <title>JBrowse Embedded</title>
  </head>
  <body>
    <h1>Embedded Volvox JBrowse</h1>
    <div style="width: 400px; margin: 0 auto;">
      <iframe
        src="../../index.html?data=sample_data/json/volvox&tracklist=0&nav=0&overview=0&tracks=DNA%2CExampleFeatures%2CNameTest%2CMotifs%2CAlignments%2CGenes%2CReadingFrame%2CCDS%2CTranscript%2CClones%2CEST"
        style="border: 1px solid black"
        width="300"
        height="300"
        >
      </iframe>
    </div>
  </body>
</html>
```

Which ends up looking like this:

<!-- <div style="padding: 0 1em; margin: 1em 0; border: 1px solid black">
    <h1>Embedded Volvox JBrowse</h1>
    <div style="width: 400px; margin: 0 auto;">
        <iframe
            src="https://jbrowse.org/code/latest-release/index.html?data=sample_data/json/volvox&tracklist=0&nav=0&overview=0&tracks=DNA%2CExampleFeatures%2CNameTest%2CMotifs%2CAlignments%2CGenes%2CReadingFrame%2CCDS%2CTranscript%2CClones%2CEST"
            style="border: 1px solid black"
            width="300"
            height="300"
            >
        </iframe>
    </div>
</div> -->

Note that the iframe's `src` attribute just points to the same JBrowse URL as your browser would.
However, it sets a few additional options in the URL to hide some of the UI elements to give
the view a more "embedded" feel: `tracklist=0` hides the track list on the left side,
`nav=0` hides the navigation bar (the zoom buttons, search box, etc),
and `overview=0` hides the overview scale bar.

## Embedding directly in a `div`

A more flexible way to embed JBrowse is by embedding it directly in a `div` in the parent document.

```html
<html>

<head>
  <title>Lorem ipsum</title>
  <script type="text/javascript" src="dist/main.bundle.js" charset="utf-8"></script>
  <style>
    body {
      background: blue;
      color: white
    }

    .jbrowse {
      height: 600px;
      width: 900px;
      padding: 0;
      margin-left: 5em;
      border: 1px solid #ccc
    }
  </style>
</head>

<body>
</body>

</html>
```

which looks like this

<div style="padding: 0 1em; margin: 1em 0; border: 1px solid black">
  <h1>Lorem ipsum</h1>
  <div class="jbrowse"  id="GenomeBrowser" data-config='"baseUrl": "../", "dataRoot": "../sample_data/json/volvox"'>
    <div class="LoadingScreen" style="padding: 50px;">
      <h1>Loading...</h1>
    </div>
  </div>
</div>
<script type="text/javascript" src="dist/main.bundle.js" charset="utf-8"></script>

The biggest gotcha with this embedding method is that the relative path from the page to
the JBrowse `*.bundle.js` files must be `dist/`, so you might need to create a symbolic
link, path alias, or similar construct.