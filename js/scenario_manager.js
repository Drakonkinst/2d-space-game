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
            if(typeof scene === "string") {
                scene = scenarios[scene];
            }
            
            currentScenario = scene;

            // reset some stuff
            Graphics.setZoom(1);
            Config.updatesPerTick = defaultUpdatesPerTick;
            Config.timestep = defaultTimestep;
            pathAnchor = null;
            recalcluateCenter();

            scene.onStart();
            Input.createCameraFollowOptions();
            Input.createDrawPathOptions();
            
            // delays call until Input is set up, don't need this anymore
            /*
            if($(".camera-follow-options").length) {
                Input.createCameraFollowOptions();
            } else {
                setTimeout(Input.createCameraFollowOptions, 5);
            }*/
        },
        
        resetScenario() {
            ScenarioManager.setScenario(currentScenario);
        }
    };
})();