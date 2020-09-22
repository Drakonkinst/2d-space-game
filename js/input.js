function mouseClicked() {
    Input.mouseClicked();
}

const Input = (function() {
    return {
        setup() {
            
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