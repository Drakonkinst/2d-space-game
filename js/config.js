const Config = (function() {
    return {
        mode: "VIEW",
        isStopped: false,
        timestep: .05,
        updatesPerTick: 10,
        
        maxPathLength: 1000,
        recordPathInterval: 3,
        
        // how many ticks ahead should be previewed
        previewDistance: 10000,
        
        drawVelocityAcceleration: false,
        drawPaths: true,
        drawPreviews: false,
    };
})();