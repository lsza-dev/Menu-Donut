# Radial Menu

Radial Menu is a wrapper for making easelly radial menu.

![Capture](./Capture.PNG)

[JSFiddle Sample](https://jsfiddle.net/L80pg3rd/1/)

```js
const config = [
    {
        label:"😀 button 1",
        onClick:() => {}
    }
    {,
        label:"😁 button 2",
        onClick:() => {}
    },
    {
        label:"😂 button 3",
        onClick:() => {}
    },
    {
        label:"🤣 button 4",
        onClick:() => {}
    },
    {
        label:"😃 button 5",
        onClick:() => {}
    },
    {
        label:"😄 button 6",
        onClick:() => {}
    },
    {
        label:"😅 button 7",
        onClick:() => {}
    },
    {
        label:"😆 button 8",
        onClick:() => {}
    }
];

const radial = new RadialMenu(config);
```