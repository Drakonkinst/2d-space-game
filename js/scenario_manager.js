const Scenario = (function() {
    return class Scenario {
        constructor(name, onStart, onUpdate) {
            this.name = name;
            this.onStart = onStart || function () { };
            this.onUpdate = onUpdate || function () { };
            this.description = null;
        }
    };
})();

const ScenarioManager = (function() {
    let scenarios = {};
    let scenarioNames = [];
    let currentScenario = null;
    
    return {
        getScenarioNames() {
            return scenarioNames;
        },
        
        getCurrentScenario() {
            return currentScenario;
        },
        
        get(name) {
            return scenarios[name];
        },
        
        addScenario(name, onStart, onUpdate, description) {
            let scenario = new Scenario(name, onStart, onUpdate);
            scenarios[name] = scenario;
            scenarioNames.push(name);
            if(description) {
                scenario.description = description;
            }
            return scenario;
        },
        
        setScenario(scene) {
            scene = scenarios[scene];
            currentScenario = scene;

            // reset some stuff
            Graphics.setZoom(1);
            Config.updatesPerTick = defaultUpdatesPerTick;
            Config.timestep = defaultTimestep;

            scene.onStart();
            Input.createCameraFollowOptions();
        },
        
        resetScenario() {
            ScenarioManager.setScenario(currentScenario);
        }
    };
})();