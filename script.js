const config = {
    parent:document.body,
    width:"384px",
    fontSize:"16px",
    buttons: [
        {
            label:"☎<br>Button 1",
            disabled:true
        },
        {
            label:"♬<br>Button 2"
        },
        {
            label:"✉<br>Button 3"
        },
        {
            label:"✿<br>Button 4"
        },
        {
            label:"❤<br>Button 5"
        },
        {
            label:"★<br>Button 6"
        },
        {
            label:"☢<br>Button 7"
        },
        {
            label:"☯<br>Button 8"
        }
    ],
    onSelect:function(index) { alert(`Bouton ${this.buttons[index].label} sélectionné`) }
};
const radial = new RadialMenu(config);