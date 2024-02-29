const config = {
    parent:document.body,
    buttons: [
        {
            label:"😀<br>button 1",
            disabled:true
        },
        {
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
    onSelect:function(index) { console.log(index) }
};
const radial = new RadialMenu(config);