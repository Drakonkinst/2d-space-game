function mouseClicked() {
    Input.mouseClicked();
}

function mouseDragged() {
    Input.mouseDragged();
}

function mouseReleased() {
    Input.mouseReleased();
}

function keyPressed() {
    Input.onKey(keyCode);
}

const Input = (function() {
    const SPACE = 32;
    const keyMap = {};
    let numKeyBinds = 0;
    let dragTarget = null;
    let wasPausedByEdit = false;
    let lastModeExit = null;

    
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
    
    function createViewControls() {
        $("<div>").addClass("controls")
            .append(
                $("<p>").text("Controls:"),
                $("<div>").addClass("control-buttons"))
            .appendTo(".info");
        
        let buttonList = $(".control-buttons").empty();
        
        createButton("reset-button", "Reset (R)", "Resets the current scenario", function() {
            ScenarioManager.resetScenario();
        }).appendTo(buttonList);
            
        createButton("toggle-force-velocity", "Toggles Force/Velocity (O)", "Shows/hides force (yellow) and velocity (green) vectors.", function() {
            Config.drawAcceleration = !Config.drawAcceleration;
            Config.drawVelocity = !Config.drawVelocity;
        }, true, Config.drawAcceleration || Config.drawVelocity).appendTo(buttonList);
        
        createButton("toggle-paths", "Toggle Paths (P)", "Shows/hides the paths of each object.", function() {
            Config.drawPaths = !Config.drawPaths;
        }, true, Config.drawPaths).appendTo(buttonList);
        
        createButton("pause-button", "Pause (SPACE)", "Pauses/resumes the simulation", function() {
            Config.isStopped = !Config.isStopped;
        }, true, Config.isStopped, "Unpause (SPACE)").appendTo(buttonList);
    }
    
    function createEditControls() {
        $("<div>").addClass("controls")
            .append(
                $("<p>").text("Controls:"),
                $("<div>").addClass("control-buttons"))
            .appendTo(".info");

        let buttonList = $(".control-buttons").empty();

        createButton("reset-button", "Reset (R)", "Resets the current scenario", function() {
            ScenarioManager.resetScenario();
        }).appendTo(buttonList);

        createButton("toggle-previews", "Toggle Previews (I)", "Shows/hides a preview of the future orbiting pattern.", function() {
            Config.drawPreviews = !Config.drawPreviews;
        }, true, Config.drawPreviews).appendTo(buttonList);
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
            let button = createButton("scenario-option", name, description, function(el) {
                $(".scenario-option").attr("disabled", false);
                el.attr("disabled", true);
                ScenarioManager.setScenario(name);
            }).appendTo(scenarioList);
            
            if(name == ScenarioManager.getCurrentScenario().name) {
                button.attr("disabled", true);
            }
        }
    }
    
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
    
    function setViewMode() {
        $(".info").empty();
        createViewControls();
        createScenarios();
        
        $("<div>").addClass("camera-follow")
            .append($("<p>").text("Camera Follow:"), $("<div>").addClass("camera-follow-options"))
            .appendTo(".info");
        $("<div>").addClass("draw-paths")
            .append($("<p>").text("Draw Paths:"), $("<div>").addClass("draw-paths-options"))
            .appendTo(".info");
        
        if(universe) {
            Input.createCameraFollowOptions();
            Input.createDrawPathOptions();
        }
    }
    
    function unsetViewMode() {
        
    }
    
    function setEditMode() {
        $(".info").empty();
        createEditControls();
        
        $("<div>").addClass("camera-follow")
            .append($("<p>").text("Camera Follow:"), $("<div>").addClass("camera-follow-options"))
            .appendTo(".info");
        $("<div>").addClass("draw-paths")
            .append($("<p>").text("Draw Paths:"), $("<div>").addClass("draw-paths-options"))
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
    
    function clickButton(selector) {
        if($(selector).length) {
            $(selector).click();
        }
    }
    
    return {
        setup() {
            createModeButtons();
            if(Config.mode == "VIEW") {
                setViewMode();
            } else if(Config.mode == "EDIT") {
                setEditMode();
            }
            
            Input.addOnKey("O", function () {
                clickButton(".toggle-force-velocity");
            });
            Input.addOnKey(SPACE, function () {
                clickButton(".pause-button");
            });
            Input.addOnKey("P", function () {
                clickButton(".toggle-paths");
            });
            Input.addOnKey("R", function () {
                clickButton(".reset-button");
            });
            Input.addOnKey("E", function () {
                clickButton(".mode-switch");
            });
            Input.addOnKey("I", function () {
                clickButton(".toggle-previews");
            });
            debug("Registered " + numKeyBinds + " keybinds");

            $("button").click(function () {
                $(this).blur();
            });
        },
        
        update() {
            cursor(ARROW);
            if(Config.editMode) {
                let mousePos = Input.getMousePos();
                for(let body of universe.allBodies) {
                    if(body instanceof Planetoid && body.pointOnPlanetoid(mousePos)) {
                        cursor(HAND);
                    }
                }
            }
            
        },

        createScenarioInput() {
            
        },
        
        createCameraFollowOptions() {
            let parent = $(".camera-follow-options").empty();
            if(!parent.length) {
                return;
            }
            Input.createCameraFollowOption(parent, center, "Origin").attr("disabled", true);
            
            for(let body of universe.allBodies) {
                let button = Input.createCameraFollowOption(parent, body, body.name);
                if(body == cameraTarget) {
                    button.click();
                }
            }
        },
        
        createCameraFollowOption(parent, body, text) {
            return createButton("camera-follow-option", text, null, function(el) {
                $(".camera-follow-option").attr("disabled", false);
                el.attr("disabled", true);
                cameraFollow(body);
            }).appendTo(parent);
        },
        
        createDrawPathOptions() {
            let parent = $(".draw-paths-options").empty();
            if(!parent.length) {
                return;
            }

            Input.createDrawPathOption(parent, null, "Origin").attr("disabled", true);

            for(let body of universe.allBodies) {
                let button = Input.createDrawPathOption(parent, body, body.name);
                if(body == pathAnchor) {
                    button.click();
                }
            }
        },
        
        createDrawPathOption(parent, body, text) {
            return createButton("follow-path-option", text, null, function(el) {
                $(".follow-path-option").attr("disabled", false);
                el.attr("disabled", true);
                pathAnchor = body;
                Graphics.clearPaths();
            }).appendTo(parent);
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
        
        onKey(keyCode) {
            if(typeof keyCode === "string") {
                keyCode = keyCode.charCodeAt(0);
            }
            
            if(keyMap.hasOwnProperty(keyCode)) {
                let callbacks = keyMap[keyCode];
                for(let callback of callbacks) {
                    callback();
                }
            }
        },
        
        mouseClicked() {
            if(!Config.editMode) {
                return;
            }

            let mousePos = Input.getMousePos();

            for(let body of universe.allBodies) {
                if(body instanceof Planetoid && body.pointOnPlanetoid(mousePos)) {
                    dragTarget = body;
                }
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
        
        getMousePos() {
            let pos = new Vector(mouseX, mouseY);
            let translateOffset;
            if(cameraTarget.position) {
                translateOffset = Graphics.getCameraAnchor(cameraTarget.position);
            } else {
                translateOffset = Graphics.getCameraAnchor(cameraTarget);
            }
            pos.subtract(translateOffset);
            
            return pos;
        },
        
        isMousePressed() {
            return mouseIsPressed;
        }
    };
})();