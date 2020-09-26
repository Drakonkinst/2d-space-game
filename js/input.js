function mouseClicked() {
    return Input.mouseClicked();
}

function mouseDragged() {
    return Input.mouseDragged();
}

function mouseReleased() {
    return Input.mouseReleased();
}

function keyPressed() {
    return Input.onKey(keyCode);
}

function mouseWheel() {
    return Input.mouseWheel();
}

const Input = (function() {
    const SPACE = 32;
    const ESCAPE = 27;
    const CTRL = 17;
    const SHIFT = 16;
    const keyMap = {};
    
    const MIN_SPEED = 1;
    const MAX_SPEED = 20;
    const ZOOM_INCREMENT_MULTIPLIER = 0.1;
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 250;
    
    let numKeyBinds = 0;
    let dragTarget = null;
    let wasPausedByEdit = false;
    let lastModeExit = null;
    let selectedBody = null;
    let selectedBodyName = null;

    /* HELPERS */
    function createButton(htmlClasses, text, description, onClick, togglesActive, isClicked, clickedText) {
        let button = $("<button>").addClass(htmlClasses).text(text).click(function() {
            let self = $(this);
            onClick(self);

            if(togglesActive) {
                $(this).toggleClass("active");
            }

            if(togglesActive && clickedText) {
                if($(this).hasClass("active")) {
                    $(this).text(clickedText);
                } else {
                    $(this).text(text);
                }
            }
            
            // prevents button clicks from firing the mouseClicked() event
            return false;
        });

        if(description) {
            button.attr("title", description);
        }

        if(isClicked && togglesActive) {
            button.addClass("active");
            button.text(clickedText);
        }

        return button;
    }

    function createSlider(htmlClasses, text, min, max, initialValue, increment, onChange) {
        let container = $("<div>").addClass(htmlClasses);
        let description = $("<p>").addClass("slider-description").text(text + ": ").appendTo(container);
        let number = $("<span>").addClass("slider-value").text(parseFloat(initialValue.toFixed(2))).appendTo(description);
        let slider = $("<input type='range'>").addClass("slider")
            .attr("min", min)
            .attr("max", max)
            .attr("step", increment || 1)
            .attr("value", initialValue || 0)
            .on("input", function() {
                let val = parseFloat(parseFloat($(this).val()).toFixed(2));
               number.text(val);
               onChange(val); 
            })
            .appendTo(container);
        
        return container;
    }
    
    function createResetButton() {
        return createButton("reset-button", "Reset (R)", "Resets the current scenario", function () {
            ScenarioManager.resetScenario();
            resetMode();
        });
    }
    
    // clicks button only if it exists, avoids throwing errors
    function clickButton(selector) {
        if($(selector).length) {
            $(selector).click();
        }
    }
    
    /* VIEW */
    function setViewMode() {
        $(".info").empty();
        createViewControls();
        createScenarios();

        $("<div>").addClass("camera-follow")
            .append($("<p>").text("Camera Follow:"), $("<div>").addClass("camera-follow-options"))
            .appendTo(".info");
        $("<div>").addClass("draw-paths")
            .append($("<p>").text("Draw Paths Relative To:"), $("<div>").addClass("draw-paths-options"))
            .appendTo(".info");

        if(universe) {
            Input.createCameraFollowOptions();
            Input.createDrawPathOptions();
        }
    }

    function unsetViewMode() {

    }
    
    function createViewControls() {
        $("<div>").addClass("controls")
            .append(
                $("<p>").text("Controls:"),
                $("<div>").addClass("control-buttons"))
            .appendTo(".info");
        
        let buttonList = $(".control-buttons").empty();
        
        createResetButton().appendTo(buttonList);
        
        createButton("pause-button", "Pause (SPACE)", "Pauses/resumes the simulation", function () {
            Config.isStopped = !Config.isStopped;
        }, true, Config.isStopped, "Unpause (SPACE)").appendTo(buttonList);
        
        createButton("toggle-force-velocity", "Toggles Force/Velocity (O)", "Shows/hides force (yellow) and velocity (green) vectors.", function() {
            Config.drawVelocityAcceleration = !Config.drawVelocityAcceleration;
        }, true, Config.drawVelocityAcceleration).appendTo(buttonList);
        
        createButton("toggle-paths", "Toggle Paths (P)", "Shows/hides the paths of each object.", function() {
            Config.drawPaths = !Config.drawPaths;
        }, true, Config.drawPaths).appendTo(buttonList);
        
        let speedUp = createButton("speed-up", "Speed Up (K)", "Speeds up the number of updates per tick.", function(el) {
            Config.updatesPerTick++;
            if(Config.updatesPerTick >= MAX_SPEED) {
                Config.updatesPerTick = MAX_SPEED;
                el.attr("disabled", true);
            }
            
            if(Config.updatesPerTick > MIN_SPEED) {
                $(".slow-down").attr("disabled", false);
            }
        }).appendTo(buttonList);
        
        let slowDown = createButton("slow-down", "Slow Down (J)", "Slows down the number of updates per tick.", function(el) {
            Config.updatesPerTick--;
            if(Config.updatesPerTick <= MIN_SPEED) {
                Config.updatesPerTick = MIN_SPEED;
                el.attr("disabled", true);
            }
            
            if(Config.updatesPerTick < MAX_SPEED) {
                $(".speed-up").attr("disabled", false);
            }
        }).appendTo(buttonList);
        
        if(Config.updatesPerTick <= MIN_SPEED) {
            slowDown.attr("disabled", true);    
        } else if(Config.updatesPerTick >= MAX_SPEED) {
            speedUp.attr("disabled", true);
        }
    }
    
    function createScenarios() {
        $("<div>").addClass("scenario-select")
            .append(
                $("<p>").text("Choose Scenario:"),
                $("<div>").addClass("scenarios"))
            .appendTo(".info");

        let scenarioList = $(".scenarios").empty();
        let scenarios = ScenarioManager.getScenarioNames();

        for(let name of scenarios) {
            let description = ScenarioManager.get(name).description;
            let button = createButton("scenario-option", name, description, function (el) {
                $(".scenario-option").attr("disabled", false);
                el.attr("disabled", true);
                ScenarioManager.setScenario(name);
            }).appendTo(scenarioList);

            if(name == ScenarioManager.getCurrentScenario().name) {
                button.attr("disabled", true);
            }
        }
    }
    
    /* EDIT */
    function setEditMode() {
        $(".info").empty();
        
        createEditControls();
        createBodySelector();

        $("<div>").addClass("camera-follow")
            .append($("<p>").text("Camera Follow:"), $("<div>").addClass("camera-follow-options"))
            .appendTo(".info");
        $("<div>").addClass("draw-paths")
            .append($("<p>").text("Draw Paths Relative To:"), $("<div>").addClass("draw-paths-options"))
            .appendTo(".info");

        if(universe) {
            Input.createCameraFollowOptions();
            Input.createDrawPathOptions();
        }
    }

    function unsetEditMode() {
        if(Config.drawPreviews) {
            $(".toggle-previews").click();
        }
    }
    
    function createEditControls() {
        $("<div>").addClass("controls")
            .append(
                $("<p>").text("Controls:"),
                $("<div>").addClass("control-buttons"))
            .appendTo(".info");

        let buttonList = $(".control-buttons").empty();

        createResetButton().appendTo(buttonList);

        createButton("toggle-previews", "Toggle Previews (I)", "Shows/hides a preview of the future orbiting pattern.", function() {
            Config.drawPreviews = !Config.drawPreviews;
        }, true, Config.drawPreviews).appendTo(buttonList);
        
        createSlider("preview-steps", "Preview Distance", 1, Config.previewDistance, Config.previewDistance, 1, function(val) {
           Config.previewDistance = val; 
        }).appendTo(buttonList);
    }
    
    function createBodySelector() {
        let container = $("<div>").addClass("body-container").appendTo(".info");
        $("<p>").text("Select Celestial Body: ").addClass("body-selector-title").appendTo(container);
        let bodySelector = $("<div>").addClass("body-selector").appendTo(container);
        $("<div>").addClass("body-controls").appendTo(container);
        
        for(let body of universe.allBodies) {
            let button = createButton("body-selector-option", body.name, null, function(el) {
                selectBody(body);
            }).attr("body-name", body.name).appendTo(bodySelector);
            
            if(body == selectedBody) {
                button.click();
            }
        }
        
        for(let body of universe.allBodies) {
            if(body.name == selectedBodyName) {
                selectBody(body);
            }
        }
    }
    
    function selectBody(body) {
        debug("Selected " + (body ? body.name : "None"))
        selectedBody = body;
        selectedBodyName = body ? body.name : null;
        createControlsForSelectedBody();
        $(".body-selector-option").attr("disabled", false);
        
        if(!body) {
            return;
        }
        
        let button = $(".body-selector-option[body-name='" + body.name + "']");
        if(!button.length) {
            debug("Could not find associated button!");
        }
        button.attr("disabled", true);
        
    }
    
    function clearSelectedBodyControls() {
        return $(".body-controls").empty();
    }
    
    function createControlsForSelectedBody() {
        let bodyControls = clearSelectedBodyControls();
        if(!selectedBody) {
            return;
        }
        
        createSlider("mass", "Mass", 0, 50000, selectedBody.mass, 10, function(val) {
            selectedBody.mass = val;
        }).appendTo(bodyControls);
        
        let velocity = selectedBody.velocity;
        createSlider("velocity-x", "Velocity X", -30, 30, velocity.x, 0.1, function(val) {
            velocity.x = val;
        }).appendTo(bodyControls);

        createSlider("velocity-y", "Velocity Y", -30, 30, velocity.y, 0.1, function(val) {
            velocity.y = val;
        }).appendTo(bodyControls);
    }
    
    /* GENERAL */
    function createModeButtons() {
        const VIEW = "VIEW";
        const EDIT = "EDIT";
        const PLAY = "PLAY";
        
        createButton("mode-switch", "MODE: VIEW (E)", "Switch between View and Edit mode.", function(el) {
            if(lastModeExit) {
                lastModeExit();
            }

            if(Config.mode == VIEW) {
                Config.mode = EDIT;
                el.text("MODE: " + EDIT + " (E)");
                setEditMode();
                wasPausedByEdit = !Config.isStopped;
                Config.isStopped = true;
                lastModeExit = unsetEditMode;
            
            } else if(Config.mode = EDIT) {
                Config.mode = VIEW;
                el.text("MODE: " + VIEW + " (E)");
                setViewMode();
                if(wasPausedByEdit) {
                    Config.isStopped = false;
                }
                lastModeExit = unsetViewMode;
            }
        }).appendTo(".header");
    }
    
    function createCameraFollowOptions() {
        let parent = $(".camera-follow-options").empty();
        if(!parent.length) {
            return;
        }
        
        createCameraFollowOption(parent, center, "Origin").attr("disabled", true);
        for(let body of universe.allBodies) {
            let button = createCameraFollowOption(parent, body, body.name);
            if(body == cameraTarget) {
                button.click();
            }
        }
    }

    function createCameraFollowOption(parent, body, text) {
        return createButton("camera-follow-option", text, null, function (el) {
            $(".camera-follow-option").attr("disabled", false);
            el.attr("disabled", true);
            cameraFollow(body);
        }).appendTo(parent);
    }

    function createDrawPathOptions() {
        let parent = $(".draw-paths-options").empty();
        if(!parent.length) {
            return;
        }

        createDrawPathOption(parent, null, "Origin").attr("disabled", true);

        for(let body of universe.allBodies) {
            let button = createDrawPathOption(parent, body, body.name);
            if(body == pathAnchor) {
                button.click();
            }
        }
    }

    function createDrawPathOption(parent, body, text) {
        return createButton("follow-path-option", text, null, function (el) {
            $(".follow-path-option").attr("disabled", false);
            el.attr("disabled", true);
            pathAnchor = body;
            Graphics.clearPaths();
        }).appendTo(parent);
    }
    
    function resetMode() {
        if(Config.mode === "VIEW") {
            setViewMode();
        } else if(Config.mode === "EDIT") {
            setEditMode();
        }
    }
    
    return {
        createCameraFollowOptions,
        createDrawPathOptions,
        
        setup() {
            createModeButtons();
            resetMode();
            
            Input.addOnKey("O", function() {
                clickButton(".toggle-force-velocity");
            });
            Input.addOnKey(SPACE, function() {
                clickButton(".pause-button");
            });
            Input.addOnKey("P", function() {
                clickButton(".toggle-paths");
            });
            Input.addOnKey("R", function() {
                clickButton(".reset-button");
            });
            Input.addOnKey("E", function() {
                clickButton(".mode-switch");
            });
            Input.addOnKey("I", function() {
                clickButton(".toggle-previews");
            });
            Input.addOnKey("K", function() {
                clickButton(".speed-up");
            });
            Input.addOnKey("J", function() {
                clickButton(".slow-down");
            });
            Input.addOnKey("F", function() {
                // fullscreen
                $("body").toggleClass("fullscreen");
                Config.fullScreen = !Config.fullScreen;
                
                // toggling fullscreen like this causes a few weird issues,
                // I won't be having this functionality for now
                //fullscreen(Config.fullScreen);
                resetCanvas();
            });
            Input.addOnKey(ESCAPE, function() {
                if(Config.fullScreen) {
                    Input.onKey("F");
                }
            });
            
            if(Config.fullScreen) {
                $("body").addClass("fullscreen");
            }
            
            debug("Registered " + numKeyBinds + " keybinds");

            $("button").click(function () {
                $(this).blur();
            });
        },
        
        update() {
            cursor(ARROW);
            if(Config.mode == "EDIT") {
                let mousePos = Input.getMousePos();
                for(let body of universe.allBodies) {
                    if(body instanceof Planetoid && body.pointOnPlanetoid(mousePos)) {
                        cursor(HAND);
                    }
                }
            }
            
        },
        
        addOnKey(key, callback) {
            if(typeof key === "string") {
                key = key.charCodeAt(0);
            }
            
            if(!keyMap.hasOwnProperty(key)) {
                keyMap[key] = [];
            }
            let callbacks = keyMap[key];
            callbacks.push(callback);
            numKeyBinds++;
        },
        
        /* EVENTS */
        onKey(keyCode) {
            if(typeof keyCode === "string") {
                keyCode = keyCode.charCodeAt(0);
            }
            
            if(keyIsDown(SHIFT) || keyIsDown(CTRL)) {
                return;
            }
            
            if(keyMap.hasOwnProperty(keyCode)) {
                let callbacks = keyMap[keyCode];
                for(let callback of callbacks) {
                    callback();
                }
                return false;
            }
        },
        
        mouseClicked() {
            if(!this.isMouseOnScreen()) {
                return;
            }
            
            if(Config.mode == "EDIT") {
                let mousePos = Input.getMousePos();

                let toSelect = null;
                for(let body of universe.allBodies) {
                    if(body instanceof Planetoid && body.pointOnPlanetoid(mousePos)) {
                        //dragTarget = body;
                        toSelect = body;
                    }
                }
                selectBody(toSelect);
            }
        },
        
        mouseDragged() {
            if(Config.editMode) {
                if(!Config.isStopped) {
                    $(".pause-button").click();
                }
                if(dragTarget != null) {
                    // TODO move virtual target
                    //dragTarget.position = Input.getMousePos();
                }
            }
        },
        
        mouseReleased() {
            if(Config.isStopped) {
                //$(".pause-button").click();
            }
            if(dragTarget != null) {
                dragTarget.position = Input.getMousePos();
                dragTarget = null;
            }
            
        },
        
        mouseWheel() {
            if(!Input.isMouseOnScreen()) {
                return;
            }
            let zoomIn = event.delta < 0;
            let zoom = Graphics.getZoom();
            let increment = ZOOM_INCREMENT_MULTIPLIER * zoom; 

            if(zoomIn) {
                if(zoom + increment < MAX_ZOOM) {
                    zoom += increment;
                } else {
                    zoom = MAX_ZOOM;
                }
            } else {
                if(zoom - increment > MIN_ZOOM) {
                    zoom -= increment;
                } else {
                    zoom = MIN_ZOOM;
                }
            }

            Graphics.setZoom(zoom);
            
            // stop scrolling of window
            return false;
        },

        /* ACCESSORS */
        getMousePos() {
            let pos = new Vector(mouseX, mouseY);
            let translateOffset;
            if(cameraTarget.position) {
                translateOffset = Graphics.getCameraAnchor(cameraTarget.position);
            } else {
                translateOffset = Graphics.getCameraAnchor(cameraTarget);
            }
            pos.divide(Graphics.getZoom()).subtract(translateOffset);

            return pos;
        },
        
        isMousePressed() {
            return mouseIsPressed;
        },
        
        // uses raw mouse value
        isMouseOnScreen() {
            return mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height;
        },
        
        getSelectedBody() {
            return selectedBody;
        }
    };
})();