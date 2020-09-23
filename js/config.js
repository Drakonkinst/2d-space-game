const Config = (function() {
    return {
        isStopped: false,
        editMode: false,
        timestep: .05,
        updatesPerTick: 10,
        
        maxPathLength: 1000,
        recordPathInterval: 3,
        
        drawVelocity: false,
        drawAcceleration: false,
        drawPaths: true,
    };
})();