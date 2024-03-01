const config = {
    parent:document.body,
    width:"384px",
    fontSize:"16px",
    buttons: [
        {
            label:"☎<br>Button 1",
            value:1,
            disabled:true
        },
        {
            label:"♬<br>Button 2",
            value:"music"
        },
        {
            label:"✉<br>Button 3",
            value:"letter"
        },
        {
            label:"✿<br>Button 4",
            value:"flower"
        },
        {
            label:"❤<br>Button 5",
            value:"<3"
        },
        {
            label:"★<br>Button 6",
            value:10
        },
        {
            label:"☢<br>Button 7"
        },
        {
            label:"☯<br>Button 8"
        }
    ],
    onSelect:function(index, value) { alert(`Bouton ${value}(${index}) sélectionné`) }
};
const radial = new RadialMenu(config);