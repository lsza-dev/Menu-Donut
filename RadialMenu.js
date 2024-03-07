class RadialMenu {
    config = {};
    #menus;
    #currentMenu;
    #radialMenu;
    #cursorPosX; //For the position X of cursor or touch
    #cursorPosY; //For the position Y of cursor or touch
    /**
     * Create a new radial menu
     * @param {object} config An object represent the configuration
     * @prop {array<Object>} config.buttons An array with all buttons config
     */
    constructor(config) {
        try {
            //Set config and initialize radial menu
            this.config = config;
            this.#menus = new Radial(this.config.buttons, this);
            this.#currentMenu = this.#menus;
            this.#radialMenu = this.#currentMenu.radial;
            //Define prop to detect when the menu is open or close
            this.isOpen = false;

            //Generate container
            this.radialContainer = document.createElement("div");
            this.radialContainer.classList.add("radial-menu-container");
            document.body.appendChild(this.radialContainer);
            this.events();

        }
        catch(e) {
            console.error(e);
            throw new Error("Cannot create new RadialMenu:", e.toString());
        }
    }

    events() {
        try {
            let parent, //The container
                touchTimeout, //Save the id of the timeout handling the touch screen
                buttonHovered; //Use for save the button when user release the touch screen
            //Check if parent has been defined in the configuration or use body
            if(this.config.parent) parent = this.config.parent;
            else parent = document.body;

            //Define events for container
            //Prevent contextmenu to open
            parent.addEventListener("contextmenu", (e) => e.preventDefault());
            //Handle move and hover
            ["mousemove","touchmove"].forEach(eventType => parent.addEventListener(eventType, (e) => {
                if(this.isOpen) e.preventDefault();
                switch(e.type) {
                    case "touchmove":
                        this.#cursorPosX = e.targetTouches[0].pageX;
                        this.#cursorPosY = e.targetTouches[0].pageY;
                    break;
                    case "mousemove":
                        this.#cursorPosX = e.pageX;
                        this.#cursorPosY = e.pageY;
                    break;
                }
                this.#radialMenu.querySelectorAll(".radial-menu-button").forEach(el => el.classList.remove("radial-menu-button-hover"));
                const target = document.elementFromPoint(this.#cursorPosX, this.#cursorPosY);
                buttonHovered = target.closest(".radial-menu-button");
                if(!buttonHovered) {
                    buttonHovered = null;
                    return;
                }
                if(!buttonHovered.getAttribute("radial-menu-disabled")) buttonHovered.classList.add("radial-menu-button-hover");

                //Check submenu
                setTimeout(() => {
                    if(!buttonHovered) return;
                    const section = buttonHovered.closest("li");
                    const index = Array.from(this.#radialMenu.children).indexOf(section);
                    const buttonConfig = this.#currentMenu.buttons[index];
                    if(buttonConfig.buttons && buttonConfig.buttons.length) {
                        this.onOpenSubMenu(buttonConfig, this.#cursorPosX, this.#cursorPosY);
                        buttonHovered = null;
                    }
                }, 300);
            }, { passive: false }));
            //Add mouse events
            ["mousedown","touchstart", "touchend"].forEach(eventType => parent.addEventListener(eventType, (e) => {
                switch(e.type) {
                    case 'mousedown':
                        if(e.button === 2) this.onOpen(e);
                    break;
                    case 'touchstart':
                        const posX = e.targetTouches[0].pageX - 50;
                        const posY = e.targetTouches[0].pageY - 50;
                        this.#cursorPosX = e.targetTouches[0].pageX;
                        this.#cursorPosY = e.targetTouches[0].pageY;
                        touchTimeout = setTimeout(() => {
                            if(
                                posX < this.#cursorPosX &&
                                posY < this.#cursorPosY
                            ) this.onOpen(e);
                        }, 300);
                    break;
                    case 'touchend':
                        if(touchTimeout) clearTimeout(touchTimeout);
                        if(buttonHovered) this.onSelectedButton(buttonHovered);
                        buttonHovered = null;
                        this.onClose();
                    break;
                }
            }));
            //Handle stop navigate
            ["mouseup", "click"].forEach(eventType => this.radialContainer.addEventListener(eventType, (e) => {
                const button = e.target.closest(".radial-menu-button");
                if(Array.from(e.target.classList).includes("radial-menu")) return;
                if(button && !button.getAttribute("radial-menu-disabled"))
                    this.onSelectedButton(button);
                this.onClose();
            }, false));
        } catch(e) {
            console.log(e);
            throw new Error("Unable to set events for radial menu:", e.toString())
        }
    }

    onOpen() {
        this.isOpen = true;
        this.radialContainer.style.display = "block";
        this.radialContainer.appendChild(this.#radialMenu);
        this.#radialMenu.style.left = this.#cursorPosX + "px";
        this.#radialMenu.style.top = this.#cursorPosY + "px";
        //Timeout to show the fade animation
        setTimeout(() => this.#radialMenu.style.opacity = "1", 20);
    }
    onClose() {
        this.isOpen = false;
        this.radialContainer.style.display = "";
        this.#radialMenu.remove();
        this.#currentMenu = this.#menus;
        this.#radialMenu = this.#currentMenu.radial;
    }
    onOpenSubMenu(buttonConfig) {
        this.onClose();
        this.#currentMenu = buttonConfig.menu;
        this.#radialMenu = this.#currentMenu.radial;
        this.onOpen();
    }
    /**
     * Event when user has realese mouse or touch to a button
     * @param {RadialButton} button The selected button
     */
    onSelectedButton(button) {
        const section = button.parentElement;
        const index = Array.from(section.parentElement.children).indexOf(section);
        const buttonFromConfig = this.#currentMenu.buttons[index];
        if(buttonFromConfig.menu) return;
        this.config.onSelect(index, buttonFromConfig.value || buttonFromConfig.label);
    }

    get menus() {
        try {
            return this.#menus;
        } catch(e) {
            throw new Error("Unable to regenerate the radial menu:", e);
        }
    }
}

class Radial {
    #buttons = [];
    #radialMenu;
    #instance;
    constructor(buttons, instance) {
        this.#buttons = buttons.map((el, index) => {
            let button = new RadialButton(el, index, this);
            //Check if button is submenu
            if(el.buttons && el.buttons.length > 0)
                button.menu = new Radial(el.buttons, this.#instance);
            return button;
        });
        this.#instance = instance;
    }

    /**
     * Generate the radial menu
     */
    generateRadialMenu() {
        try {
            let radialMenu;
            const radialButtons = this.#buttons;
            if(!this.#radialMenu) { //First initialization
                radialMenu = document.createElement("ul");
                //Add class to the radial menu
                radialMenu.classList.add("radial-menu");
            } else { //Use existing radial menu
                radialMenu = this.#radialMenu;
                radialMenu.innerHTML = ""; //Empty the radial menu for regenerating
            }
            if(radialButtons.length < 3) {
                radialButtons.push(
                    new RadialButton({
                        label:"",
                        disabled:true
                    }, this)
                )
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
            return radialMenu;
        } catch(e) {
            console.error(e);
            throw new Error("Unable to generate radial menu:", e.toString());
        }
    }
    get buttons() {
        return this.#buttons;
    }
    get radial() {
        this.#radialMenu = this.generateRadialMenu();
        return this.#radialMenu;
    }
}

class RadialButton {
    #label = "";
    #disabled = false;
    #hidden = false;
    #buttons = null;
    #value = null;
    #instance;
    /**
     * 
     * @param {*} config 
     * @param {Radial} instance The radial instance
     */
    constructor(config, index, instance) {
        this.#label = config.label;
        this.#disabled = config.disabled || false;
        this.#hidden = config.hidden || false;
        this.#value = config.value || null;
        this.index = index;
        if(config.buttons) this.#buttons = config.buttons.map((el, index) => new RadialButton(el, index, instance));
        this.#instance = instance;
    }

    get label() {
        return this.#label;
    }
    /**
     * @param {string} label 
     */
    set label(label) {
        this.#label = label;
        this.#instance.generateRadialMenu();
    }

    get disabled() {
        return this.#disabled;
    }
    /**
     * @param {boolean} disabled
     */
    set disabled(disabled) {
        this.#disabled = disabled;
        this.#instance.generateRadialMenu();
    }

    get hidden() {
        return this.#hidden;
    }
    /**
     * @param {boolean} hidden
     */
    set hidden(hidden) {
        this.#hidden = hidden;
        this.#instance.generateRadialMenu();
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

    get buttons() {
        return this.#buttons;
    }
    /**
     * @param {boolean} value
     */
    set buttons(buttons) {
        this.#buttons = buttons.map(el => new RadialButton(el, this.instance));
    }

}