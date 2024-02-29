class RadialMenu {
    /**
     * Create a new radial menu
     * @param {Array<Object>} config An array with all buttons config
     */
    constructor(config) {
        try {
            //Set config and initialize radial menu
            this.config = config;
            //Define prop to detect when the menu is open or close
            this.isOpen = false;
            this.radialContainer = this.generateRadialMenu(this.config.buttons);
            this.radialMenu = this.radialContainer.firstChild;
            this.events();
        }
        catch(e) {
            console.error(e);
            throw new Error("Cannot create new RadialMenu:", e.toString());
        }
    }

    /**
     * Generate the radial menu
     */
    generateRadialMenu(radialButtons) {
        try {
            //Generate container
            const radialContainer = document.createElement("div");
            radialContainer.classList.add("radial-menu-container");
            //Generate and save the element
            const radialMenu = document.createElement("ul");
            //Add class to the radial menu
            radialMenu.classList.add("radial-menu");
            radialContainer.appendChild(radialMenu);
            //Generate buttons list
            let li = "";
            for(let section of radialButtons) {
                li += `
                    <li>
                        <div ${section.disabled ? "radial-menu-disabled=true" : ""}>
                            <div>${section.label}</div>
                        </div>
                    </li>
                `;
            }
            //Append list to the radial menu
            radialMenu.innerHTML = li;
            //Define for each buttons, the style and config
            //Get buttons
            const sections = radialMenu.querySelectorAll("li");
            //Get number of buttons to calculate the radial sections
            const sectionsCount = Array.from(sections).length;
            const sectionStep = 360 / sectionsCount;
            const buttonRotation = sectionStep / 2 + (90 - sectionStep);
            let rotation = 0;
            let labelRotation = buttonRotation;
            for(let section of sections) {
                //Set rotation and skew to section
                section.style.transform = `rotate(${rotation}deg) skew(${90 - sectionStep}deg)`;
                rotation += sectionStep;
                //Center, unskew and unrotate the button
                const button = section.firstElementChild;
                button.style.transform = `translate(-50%,-50%) skew(-${90 - sectionStep}deg) rotate(-${buttonRotation}deg)`;
                //Unrotate label to be horizontal
                const label = button.firstElementChild;
                label.style.transform = `rotate(${labelRotation}deg)`;
                labelRotation -= sectionStep;
            }
            //Append container to the body page
            document.body.appendChild(radialContainer);
            return radialContainer;
        } catch(e) {
            console.error(e);
            throw new Error("Unable to generate radial menu:", e.toString());
        }
    }

    events() {
        try {
            let parent;
            if(this.config.parent) parent = this.config.parent;
            else parent = document.body;
            this.radialMenu.querySelectorAll("li").forEach(section => {
                section.firstElementChild.addEventListener("mouseup", function(e) {
                    if(this.getAttribute("radial-menu-disabled")) return;
                    const section = this.parentElement;
                    const index = Array.from(section.parentElement.children).indexOf(section);
                    selectedButton(index);
                });
                const selectedButton = (index) => this.config.onSelect(index);
            });

            parent.addEventListener("contextmenu", (e) => e.preventDefault());
            parent.addEventListener("mousedown", (e) => {
                if(e.button === 2) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.onOpen(e);
                }
            });
            parent.addEventListener("mouseup", (e) => {
                if(e.button === 2 && this.isOpen) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.onClose(e);
                }
            });
        } catch(e) {
            console.log(e);
            throw new Error("Unable to set events for radial menu:", e.toString())
        }
    }

    onOpen(e) {
        this.isOpen = true;
        this.radialContainer.style.display = "block";
        this.radialMenu.style.left = e.pageX + "px";
        this.radialMenu.style.top = e.pageY + "px";
        setTimeout(() => this.radialMenu.style.opacity = "1", 20);
    }
    onClose() {
        this.isOpen = false;
        this.radialContainer.style.display = "";
        this.radialMenu.style.opacity = "0";
    }
}