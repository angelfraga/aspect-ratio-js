# @aspect-ratio/core

# Initial Motivation

This library tries to supply a responsive aspect ratio calculation for canvas elements which are located on top of a video elements.

Video elements add black borders in order to adjust the aspect ratio of the frame picture being displayed (displayed area). 
Since Video elements do not emit events about the disaplyed area's size this calculation must be done mostly via javascript or css.

# What library does

With JS we wouldn't be able to be full 100% responsive outbox , eg when oppening a sidebar no windows resize event get fired.

With CSS we could calculate aspect ratio, but mostly CSS solutions are just taking in count the width since they are based on padding.
That could end up in an element which overflow the size of its parent and making visible a scrollbar.

*I only found a solution taking in count the `height`* but only works if the element fits width the viewport size.

By using an iframe we can apply the last solution, forcing the iframe to fit with its parent. 
The nested window will fire the resize event once iframe's parent size changes.


# Install 

```
npm i @aspect-ratio/core
```

# Usage


```html

<div id="container">
	<div id="mask">
		<!-- content to force an aspect ratio -->
	</div>
</div>

```

## Typescript

```typescript
import { AspectRatio } from "./src/aspect-ratio";

const aspectRatio = new AspectRatio({
  container: document.querySelector("#container"),
  mask: document.querySelector("#mask"),
  minHeight: 90,
  minWidth: 160,
  ratio: "16/9",
  align: "center center"
});

```


# Collaboration
Please check README.md file in the repository


# License 

MIT License, please check the "LICENSE" file in the repository.