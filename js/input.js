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
    
    function createViewControls() {
        $("<div>").addClass("controls")
            .append(
                $("<p>").text("Controls:"),
                $("<div>").addClass("control-buttons"))
            .appendTo(".info");
        
        let buttonList = $(".control-buttons").empty();
        
        let resetButton = $("<button>").addClass("reset-button")
            .text("Reset (R)").attr("title", "Resets the current scenario.").click(function () {
                ScenarioManager.resetScenario();
            }).appendTo(buttonList);
            
        let toggleForceVelocity = $("<button>").addClass("toggle-force-velocity")
            .text("Toggle Force/Velocity (O)").attr("title", "Shows/hides force (yellow) and velocity (green) vectors.").click(function () {
                Config.drawAcceleration = !Config.drawAcceleration;
                Config.drawVelocity = !Config.drawVelocity;
                $(this).toggleClass("active");
            }).appendTo(buttonList);
            
        let togglePaths = $("<button>").addClass("toggle-paths")
            .text("Toggle Paths (P)").attr("title", "Shows/hides the paths of each object.").click(function () {
                Config.drawPaths = !Config.drawPaths;
                $(this).toggleClass("active");
            }).appendTo(buttonList);
            
        let pauseButton = $("<button>").addClass("pause-button")
            .text("Pause (SPACE)").attr("title", "Pauses/resumes the simulation.").click(function () {
                Config.isStopped = !Config.isStopped;
                $(this).toggleClass("active");
                if($(this).hasClass("active")) {
                    $(this).text("Unpause (SPACE)");
                } else {
                    $(this).text("Pause (SPACE)");
                }
            }).appendTo(buttonList);

        if(Config.drawAcceleration || Config.drawVelocity) {
            toggleForceVelocity.addClass("active");
        }
        if(Config.drawPaths) {
            togglePaths.addClass("active");
        }
        
        if(Config.isStopped) {
            pauseButton.addClass("active").text("Unpause (SPACE)");
        }
    }
    
    function createEditControls() {
        $("<div>").addClass("controls")
            .append(
                $("<p>").text("Controls:"),
                $("<div>").addClass("control-buttons"))
            .appendTo(".info");

        let buttonList = $(".control-buttons").empty();

        let resetButton = $("<button>").addClass("reset-button")
            .text("Reset (R)").attr("title", "Resets the current scenario.").click(function () {
                ScenarioManager.resetScenario();
            }).appendTo(buttonList);
            
        let previewButton = $("<button>").addClass("toggle-previews")
            .text("Toggle Previews (I)").attr("title", "Shows/hides a preview of the future orbiting pattern.").click(function () {
                Config.drawPreviews = !Config.drawPreviews;
                $(this).toggleClass("active");
            }).appendTo(buttonList);

        if(Config.drawPreviews) {
            previewButton.addClass("active");
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
            let button = $("<button>").addClass("scenario-option").text(name).click(function() {
                $(".scenario-option").attr("disabled", false);
                $(this).attr("disabled", true);
                ScenarioManager.setScenario(name);
            }).appendTo(scenarioList);
            
            let description = ScenarioManager.get(name).description;
            if(description) {
                button.attr("title", description)
            }
            if(name == ScenarioManager.getCurrentScenario().name) {
                button.attr("disabled", true);
            }
        }
    }
    
    function createModeButtons() {
        const VIEW = "VIEW";
        const EDIT = "EDIT";
        const PLAY = "PLAY";
        
        $("<button>").addClass("mode-switch").text("MODE: VIEW (E)")
            .click(function() {
                
                if(lastModeExit) {
                    lastModeExit();
                }
                
                if(Config.mode == VIEW) {
                    Config.mode = EDIT;
                    $(this).text("MODE: " + EDIT + " (E)");
                    setEditMode();
                    wasPausedByEdit = !Config.isStopped;
                    Config.isStopped = true;
                    lastModeExit = unsetEditMode;
                } else if(Config.mode = EDIT) {
                    Config.mode = VIEW;
                    $(this).text("MODE: " + VIEW + " (E)");
                    setViewMode();
                    if(wasPausedByEdit) {
                        Config.isStopped = false;
                    }
                    lastModeExit = unsetViewMode;
                }
            })
            .appendTo(".header");
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
            $(".camera-follow-options").empty();
            Input.createCameraFollowOption(center, "Origin").attr("disabled", true);
            
            for(let body of universe.allBodies) {
                let button = Input.createCameraFollowOption(body, body.name);
                if(body == cameraTarget) {
                    button.click();
                }
            }
        },
        
        createCameraFollowOption(body, text) {
            return $("<button>").addClass("camera-follow-option").text(text).click(function() {
                $(".camera-follow-option").attr("disabled", false);
                $(this).attr("disabled", true);
                cameraFollow(body);
            }).appendTo(".camera-follow-options");
        },
        
        createDrawPathOptions() {
            $(".draw-paths-options").empty();
            Input.createDrawPathOption(null, "Origin").attr("disabled", true);

            for(let body of universe.allBodies) {
                let button = Input.createDrawPathOption(body, body.name);
                if(body == pathAnchor) {
                    button.click();
                }
            }
        },
        
        createDrawPathOption(body, text) {
            return $("<button>").addClass("follow-path-option").text(text).click(function () {
                $(".follow-path-option").attr("disabled", false);
                $(this).attr("disabled", true);
                pathAnchor = body;
                Graphics.clearPaths();
            }).appendTo(".draw-paths-options");
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