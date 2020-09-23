function mouseClicked() {
    Input.mouseClicked();
}

function keyPressed() {
    Input.onKey(keyCode);
}

const Input = (function() {
    const SPACE = 32;
    
    const keyMap = {};
    let numKeyBinds = 0;
    
    return {
        setup() {
            let buttonList = $(".control-buttons");
            let resetButton = $("<button>").addClass("reset-button").text("Reset (R)").click(function () {
                currentScenario.onStart();
            }).appendTo(buttonList);
            let toggleForceVelocity = $("<button>").addClass("toggle-force-velocity").text("Toggle Force/Velocity (P)").click(function () {
                Config.drawAcceleration = !Config.drawAcceleration;
                Config.drawVelocity = !Config.drawVelocity;
                $(this).toggleClass("active");
            }).appendTo(buttonList);
            let togglePaths = $("<button>").addClass("toggle-paths").text("Toggle Paths (O)").click(function () {
                Config.drawPaths = !Config.drawPaths;
                $(this).toggleClass("active");
            }).appendTo(buttonList);
            let pauseButton = $("<button>").addClass("pause-button").text("Pause (SPACE)").click(function () {
                Config.isStopped = !Config.isStopped;
                $(this).toggleClass("active");
                if($(this).hasClass("active")) {
                    $(this).text("Unpause (SPACE)");
                } else {
                    $(this).text("Pause (SPACE)");
                }
            }).appendTo(buttonList);
            
            
            this.addOnKey("P", function() {
                toggleForceVelocity.click();
            });
            this.addOnKey(SPACE, function() {
                pauseButton.click();
            });
            this.addOnKey("O", function() {
                togglePaths.click();
            });
            this.addOnKey("R", function() {
                resetButton.click();
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
                pauseButton.addClass("active");
            }
        },
        
        createCameraFollowOptions() {
            $(".camera-follow-options").empty();
            this.createCameraFollowOption(Vector.of(0, 0), "Origin");
            
            for(let body of universe.allBodies) {
                this.createCameraFollowOption(body, body.name);
            }
        },
        
        createCameraFollowOption(body, text) {
            $("<button>").addClass("camera-follow-option").text(text).click(function() {
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
            
        },
        
        getMousePos() {
            return new Vector(mouseX, mouseY);
        },
        
        isMousePressed() {
            return mouseIsPressed;
        }
    };
})();