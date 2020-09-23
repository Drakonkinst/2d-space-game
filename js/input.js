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
            this.addOnKey("P", function() {
                Config.drawAcceleration = !Config.drawAcceleration;
                Config.drawVelocity = !Config.drawVelocity;
            });
            this.addOnKey(SPACE, function() {
                Config.isStopped = !Config.isStopped;
            });
            this.addOnKey("O", function() {
                Config.drawPaths = !Config.drawPaths;
            });
            this.addOnKey("R", function() {
                currentScenario.onStart();
            });
            debug("Registered " + numKeyBinds + " keybinds");
            
            $(".reset-button").click(function() {
                Input.onKey("R");
            });
            $(".vis-force-velocity-button").click(function () {
                Input.onKey("P");
            });
            $(".vis-path-button").click(function () {
                Input.onKey("O");
            });
            $(".pause-button").click(function () {
                Input.onKey(SPACE);
            });
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