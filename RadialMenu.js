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
                        <div ${section.disabled ? "radial-menu-disabled=true" : ""} class="radial-menu-button">
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
            // Define events for buttons
            this.radialMenu.querySelectorAll("li").forEach(section => {
                section.firstElementChild.addEventListener("mouseup", function(e) {
                    if(this.getAttribute("radial-menu-disabled")) return;
                    let button = this.closest(".radial-menu-button");
                    selectedButtonHandler(this);
                });
                const selectedButtonHandler = btn => this.selectedButton(btn);
            });

            //Define events for container
            let parent,touchTimeout,touchButton,cursorPosX,cursorPosY;
            //Check if parent has been defined in the configuration or use body
            if(this.config.parent) parent = this.config.parent;
            else parent = document.body;
            //Prevent contextmenu to open
            parent.addEventListener("contextmenu", (e) => e.preventDefault());
            //Add mouse events
            parent.addEventListener("mousedown", (e) => {
                if(e.button === 2) this.onOpen(e);
            });
            "mousemove touchmove".split(" ").forEach(event => parent.addEventListener(event, (e) => {
                if(this.isOpen) e.preventDefault();
                switch(e.type) {
                    case "touchmove":
                        cursorPosX = e.targetTouches[0].pageX;
                        cursorPosY = e.targetTouches[0].pageY;
                    break;
                    case "mousemove":
                        cursorPosX = e.pageX;
                        cursorPosY = e.pageY;
                        return;
                    break;
                }
                this.radialMenu.querySelectorAll(".radial-menu-button").forEach(el => el.classList.remove("radial-menu-button-hover"));
                const target = document.elementFromPoint(cursorPosX, cursorPosY);
                touchButton = target.closest(".radial-menu-button");
                if(touchButton && !touchButton.getAttribute("radial-menu-disabled")) touchButton.classList.add("radial-menu-button-hover");
                else touchButton = null;
            }, { passive: false }));
            parent.addEventListener("touchend", (e) => {
                if(touchTimeout) clearTimeout(touchTimeout);
                if(touchButton) this.selectedButton(touchButton);
                this.onClose();
            });
            parent.addEventListener("touchstart", (e) => {
                const posX = e.targetTouches[0].pageX - 50;
                const posY = e.targetTouches[0].pageY - 50;
                cursorPosX = e.targetTouches[0].pageX;
                cursorPosY = e.targetTouches[0].pageY;
                touchTimeout = setTimeout(() => {
                    if(
                        posX < cursorPosX &&
                        posY < cursorPosY
                    ) this.onOpen(e);
                }, 500);
            });
            "mouseup click touchend".split(" ").forEach(event => this.radialContainer.addEventListener(event, (e) => {
                this.onClose();
            }, false));
        } catch(e) {
            console.log(e);
            throw new Error("Unable to set events for radial menu:", e.toString())
        }
    }

    onOpen(e) {
        this.isOpen = true;
        this.radialContainer.style.display = "block";
        let posX, posY;
        switch(e.type) {
            case "mousedown":
                posX = e.pageX;
                posY = e.pageY;
            break;
            case "touchstart":
                posX = e.targetTouches[0].pageX;
                posY = e.targetTouches[0].pageY;
            break;
        }
        this.radialMenu.style.left = posX + "px";
        this.radialMenu.style.top = posY + "px";
        //Timout to show the fade animation
        setTimeout(() => this.radialMenu.style.opacity = "1", 20);
    }
    onClose() {
        this.isOpen = false;
        this.radialContainer.style.display = "";
        this.radialMenu.querySelectorAll(".radial-menu-button").forEach(el => el.classList.remove("radial-menu-button-hover"))
        this.radialMenu.style.opacity = "0";
    }

    selectedButton(button) {
        const section = button.parentElement;
        const index = Array.from(section.parentElement.children).indexOf(section);
        this.config.onSelect(index);
    }
}