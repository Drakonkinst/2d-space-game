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
            })
            debug("Registered " + numKeyBinds + " keybinds");
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