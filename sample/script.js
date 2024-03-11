const config = {
    parent:document.body,
    width:"384px",
    fontSize:"16px",
    buttons: [
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
    onSelect:function(index, value) { 
        alert(`You've selected ${value}(${index}) !`) 
    }
};
const radial = new RadialMenu(config);