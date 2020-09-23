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
    
    return {
        setup() {
            let buttonList = $(".control-buttons");
            
            /*let editButton = $("<button>").addClass("edit-button").text("Edit Mode: ON (E)").click(function () {
                Config.editMode = !Config.editMode;
                $(this).toggleClass("active");
                if($(this).hasClass("active")) {
                    $(this).text("Edit Mode: OFF (E)");
                } else {
                    $(this).text("Edit Mode: ON (E)");
                }
            }).appendTo(buttonList);*/
            let resetButton = $("<button>").addClass("reset-button").text("Reset (R)").click(function () {
                setScenario(currentScenario)
            }).appendTo(buttonList);
            let toggleForceVelocity = $("<button>").addClass("toggle-force-velocity").text("Toggle Force/Velocity (O)").click(function () {
                Config.drawAcceleration = !Config.drawAcceleration;
                Config.drawVelocity = !Config.drawVelocity;
                $(this).toggleClass("active");
            }).appendTo(buttonList);
            let togglePaths = $("<button>").addClass("toggle-paths").text("Toggle Paths (P)").click(function() {
                Config.drawPaths = !Config.drawPaths;
                $(this).toggleClass("active");
            }).appendTo(buttonList);
            let pauseButton = $("<button>").addClass("pause-button").text("Pause (SPACE)").click(function() {
                Config.isStopped = !Config.isStopped;
                $(this).toggleClass("active");
                if($(this).hasClass("active")) {
                    $(this).text("Unpause (SPACE)");
                } else {
                    $(this).text("Pause (SPACE)");
                }
            }).appendTo(buttonList);
            
            
            
            this.addOnKey("O", function() {
                toggleForceVelocity.click();
            });
            this.addOnKey(SPACE, function() {
                pauseButton.click();
            });
            this.addOnKey("P", function() {
                togglePaths.click();
            });
            this.addOnKey("R", function() {
                resetButton.click();
            });
            this.addOnKey("E", function() {
                editButton.click();
            });
            debug("Registered " + numKeyBinds + " keybinds");
            
            $("button").click(function() {
                $(this).blur();
            });
            
            
            if(Config.drawAcceleration || Config.drawVelocity) {
                toggleForceVelocity.addClass("active");
            }
            if(Config.drawPaths) {
                togglePaths.addClass("active");
            }
            if(Config.isStopped) {
                pauseButton.addClass("active").text("Unpause (SPACE)");
            }
            if(!Config.editMode) {
                return;
                editButton.addClass("active").text("Edit Mode: OFF (E)");
            }
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
            this.createCameraFollowOption(center, "Origin").attr("disabled", true);
            
            for(let body of universe.allBodies) {
                let button = this.createCameraFollowOption(body, body.name);
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