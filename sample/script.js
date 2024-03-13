const config = {
    parent:document.body,
    width:"384px",
    fontSize:"16px",
    label:"Parent Menu",
    buttons: [
        {
            label:"Simple Button"
        },
        {
            label:"Musics",
            buttons:[
                {
                    label:"Music 01",
                },
                {
                    label:"Music 02",
                },
                {
                    label:"Music 03",
                },
                {
                    label:"Music 04",
                },
                {
                    label:"Music 05",
                },
                {
                    label:"Music 06"
                }
            ]
        },
        {
            label:"Albums",
            buttons:[
                {
                    label:"All"
                },
                {
                    label:"Album 01",
                    buttons:[
                        {
                            label:"Music 01"
                        },
                        {
                            label:"Music 02"
                        },
                        {
                            label:"Music 03"
                        },
                        {
                            label:"Music 04"
                        },
                        {
                            label:"Music 05"
                        },
                        {
                            label:"Music 06"
                        },
                        {
                            label:"Music 07"
                        },
                        {
                            label:"Music 08"
                        }
                    ]
                },
                {
                    label:"Album 02",
                    value:"test",
                    buttons:[
                        {
                            label:"Peripheral 01"
                        },
                        {
                            label:"Peripheral 02"
                        },
                        {
                            label:"Peripheral 03"
                        }
                    ]
                },
                {
                    label:"Album 03",
                    buttons:[
                        {
                            label:"COLOR 01",
                            color:"#FF0000"
                        },
                        {
                            label:"COLOR 02",
                            color:"#00FF00"
                        },
                        {
                            label:"COLOR 03",
                            color:"#0000FF"
                        }
                    ]
                }
            ]
        },
        {
            label:"Half",
            buttons:[
                {
                    label:"One"
                },
                {
                    label:"Two",
                    disabled:false
                },
                {
                    label:"Three",
                    disabled:true
                },
                {
                    label:"Four"
                },
                {
                    label:"",
                    hidden:true
                },
                {
                    label:"",
                    hidden:true
                },
                {
                    label:"",
                    hidden:true
                },
                {
                    label:"",
                    hidden:true
                }
            ]
        }
    ],
    beforeOpen:function(menu) {
        console.log("before open!", menu);
    },
    onOpen:function(menu) {
        console.log("open!", menu);
    },
    beforeOpenSubMenu:function(subMenu) {
        console.log("before open submenu!", subMenu);
    },
    onOpenSubMenu:function(subMenu) {
        console.log("open submenu!", subMenu);
    },
    onSelect:function(index, value, menu) {
        alert(`You've selected "${value}"\nat index "${index}"\nfrom "${menu.value || menu.label}"`);
    }
};
const radial = new RadialMenu(config);