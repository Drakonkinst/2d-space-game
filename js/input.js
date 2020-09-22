function mouseClicked() {
    Input.mouseClicked();
}

function keyTyped() {
    Input.onKey(key);
}

const Input = (function() {
    let keyMap = {};
    
    return {
        setup() {
            this.addOnKey("p", function() {
                Config.drawAcceleration = !Config.drawAcceleration;
                Config.drawVelocity = !Config.drawVelocity;
            });
        },
        
        addOnKey(key, callback) {
            key = key.toLowerCase();
            if(!keyMap.hasOwnProperty(key)) {
                keyMap[key] = [];
            }
            let callbacks = keyMap[key];
            callbacks.push(callback);
        },
        
        onKey(key) {
            if(keyMap.hasOwnProperty(key)) {
                let callbacks = keyMap[key];
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