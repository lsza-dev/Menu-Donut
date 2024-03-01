class RadialMenu {
    config = {};

    /**
     * Create a new radial menu
     * @param {object} config An object represent the configuration
     * @prop {array<Object>} config.buttons An array with all buttons config
     */
    constructor(config) {
        try {
            //Set config and initialize radial menu
            this.config = config;
            this.config.buttons = config.buttons.map(el => new RadialMenuButton(el, this));
            //Define prop to detect when the menu is open or close
            this.isOpen = false;
            this.radialContainer = this.generateRadialMenu(this.buttons);
            this.radialMenu = this.radialContainer.firstChild;
            this.events();
        }
        catch(e) {
            console.error(e);
            throw new Error("Cannot create new RadialMenu:", e.toString());
        }
    }

    get buttons() {
        return this.config.buttons;
    }
    /**
     * @param {any} buttons
     */
    set buttons(buttons) {
        try {
            this.config.buttons = buttons.map(el => new RadialMenuButton(el, this));
            this.generateRadialMenu();
        } catch(e) {
            throw new Error("Unable to regenerate the radial menu:", e);
        }
    }

    /**
     * Generate the radial menu
     */
    generateRadialMenu() {
        try {
            let radialMenu, radialContainer;
            const radialButtons = this.config.buttons;
            if(!this.radialContainer) { //First initialization
                //Generate container
                radialContainer = document.createElement("div");
                radialContainer.classList.add("radial-menu-container");
                //Generate and save the element
                radialMenu = document.createElement("ul");
                radialMenu.style.width = this.config.width || "384px";
                radialMenu.style["font-size"] = this.config.fontSize || "16px";
                //Add class to the radial menu
                radialMenu.classList.add("radial-menu");
                radialContainer.appendChild(radialMenu);
            } else { //Use existing radial menu
                radialContainer = this.radialContainer;
                radialMenu = this.radialMenu;
                radialMenu.innerHTML = ""; //Empty the radial menu for regenerating
            }
            if(radialButtons.length < 3) {
                radialButtons.push({
                    label:"",
                    disabled:true
                })
            }
            //Generate buttons list
            for(let section of radialButtons) {
                const li = document.createElement("li");
                const button = document.createElement("div");
                button.classList.add("radial-menu-button");
                if(section.disabled || section.hidden)
                    button.setAttribute("radial-menu-disabled", true);
                if(section.hidden)
                    li.classList.add("radial-menu-hidden");
                button.innerHTML = `<div>${section.label}</div>`;
                li.append(button);
                radialMenu.append(li);
            }
            //Define for each buttons, the style and config
            //Get buttons
            const sections = radialMenu.querySelectorAll("li");
            //Get number of buttons to calculate the radial sections
            const sectionsCount = Array.from(sections).length;
            const sectionStep = 360 / sectionsCount;
            const buttonRotation = sectionStep / 2 + (90 - sectionStep);
            const skew = 90 - sectionStep;
            let rotation = 0;
            let labelRotation = buttonRotation;
            for(let section of sections) {
                //Set rotation and skew to section
                section.style.transform = `rotate(${rotation}deg) skew(${skew}deg)`;
                rotation += sectionStep;
                //Center, unskew and unrotate the button
                const button = section.firstElementChild;
                button.style.transform = `translate(-50%,-50%) skew(${skew * -1}deg) rotate(-${buttonRotation}deg)`;
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
            let parent, //The container
                touchTimeout, //Save the id of the timeout handling the touch screen
                touchHoverButton, //Use for save the button when user release the touch screen
                cursorPosX, //For the position X of cursor or touch
                cursorPosY; //For the position Y of cursor or touch
            //Check if parent has been defined in the configuration or use body
            if(this.config.parent) parent = this.config.parent;
            else parent = document.body;

            this.radialMenu.addEventListener("mouseup", (e) => {
                const button = e.target.closest(".radial-menu-button")
                if(!button) return;
                if(button.getAttribute("radial-menu-disabled")) return;
                this.selectedButton(button)//selectedButtonHandler(button);
            });

            //Define events for container
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
                touchHoverButton = target.closest(".radial-menu-button");
                if(touchHoverButton && !touchHoverButton.getAttribute("radial-menu-disabled")) touchHoverButton.classList.add("radial-menu-button-hover");
                else touchHoverButton = null;
            }, { passive: false }));
            parent.addEventListener("touchend", (e) => {
                if(touchTimeout) clearTimeout(touchTimeout);
                if(touchHoverButton) this.selectedButton(touchHoverButton);
                touchHoverButton = null;
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
        const buttonFromConfig = this.config.buttons[index];
        this.config.onSelect(index, buttonFromConfig.value || buttonFromConfig.label);
    }
}

class RadialMenuButton {
    #label = "";
    #disabled = false;
    #hidden = false;
    #value = null;
    /**
     * 
     * @param {*} config 
     * @param {RadialMenu} instance The radial menu instance
     */
    constructor(config, instance) {
        this.#label = config.label;
        this.#disabled = config.disabled || false;
        this.#hidden = config.hidden || false;
        this.#value = config.value || null;
        this.instance = instance;
    }

    get label() {
        return this.#label;
    }
    /**
     * @param {string} label 
     */
    set label(label) {
        this.#label = label;
        this.instance.generateRadialMenu();
    }

    get disabled() {
        return this.#disabled;
    }
    /**
     * @param {boolean} disabled
     */
    set disabled(disabled) {
        this.#disabled = disabled;
        this.instance.generateRadialMenu();
    }

    get hidden() {
        return this.#hidden;
    }
    /**
     * @param {boolean} hidden
     */
    set hidden(hidden) {
        this.#hidden = hidden;
        this.instance.generateRadialMenu();
    }

    get value() {
        return this.#value;
    }
    /**
     * @param {boolean} value
     */
    set value(value) {
        this.#value = value;
    }

}