![logo](./logo.PNG)
# Radial Menu

Radial Menu is a wrapper for making easelly radial menu. This menu will be opened by a right mouse click or a long touch on screen.

To select an item, release the right button or the finger on the button to select it.
![Capture](./Capture.PNG)

[JSFiddle Sample](https://jsfiddle.net/1z4fwedo/)

```js
const config = {
    parent:document.body,
    width:"384px",
    fontSize:"16px",
    buttons: [
        {
            label:"😀<br>button 1",
            disabled:true
        }
        {,
            label:"😁<br>button 2"
        },
        {
            label:"😂<br>button 3"
        },
        {
            label:"🤣<br>button 4"
        },
        {
            label:"😃<br>button 5"
        },
        {
            label:"😄<br>button 6"
        },
        {
            label:"😅<br>button 7"
        },
        {
            label:"😆<br>button 8"
        }
    ],
    onSelect:function(index, value) { 
        alert(`You've selected ${value}(${index}) !`) 
    }
};

const radial = new RadialMenu(config);
```

# TODO

- [x] Create HTML, CSS for menu
- [x] Create Class for creating new radial menu with simple config
- [x] Make touch screen compatible
- [x] Limit the minimal buttons due to the CSS limitation (no maximal, you know what you do !)
- [x] Make possible to add/update/remove buttons on the way
- [x] Create submenu