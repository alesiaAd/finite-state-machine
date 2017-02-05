class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(!config) {
            throw new Error("Config should be passed to constructor");
        } else {
            this.config = config;
            this.stateStack = [];
            this.currentStateIndex = -1;
            this.reset();
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.stateStack[this.currentStateIndex];
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        //  check state existence
        var nextState = null;
        for(var checkState in this.config["states"]) {
            if(checkState === state) {
                nextState = state;
                
                var oldLength = this.stateStack.length;
                for(var i = this.currentStateIndex + 1; i < oldLength; i++) {
                    this.stateStack.pop();
                }

                this.stateStack.push(nextState);
                this.currentStateIndex ++;
                break;
            }
        }
        if(!nextState) {
            throw new Error("Unknown state passed");
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var transitions = this.config["states"][this.getState()]["transitions"];
        var nextState = null;
        for(var possibleEvent in transitions) {
            if(possibleEvent === event) {
                nextState = transitions[event];
                this.changeState(nextState);
                break;
            }
        }
        if(!nextState) {
            throw new Error("Illegal event");
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.config ["initial"]);
        this.clearHistory();
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var allStates = this.config["states"];
        var newStates = [];
        if(event === undefined) {
            return Object.keys(this.config["states"]);
        }
        for(var state in allStates) {
            var transitions = allStates[state]["transitions"];
            if(transitions[event]) {
                newStates.push(state);
            }
        }
        return newStates;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        var res = false;
        if(this.currentStateIndex > 0) {
            this.currentStateIndex --;
            res = true;
        }
        return res;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        var res = false;
        if(this.currentStateIndex === this.stateStack.length - 1) {
            res = false;
        }
        else {
            this.currentStateIndex ++;
            res = true;
        }
        return res;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        var currentState = this.getState();
        this.stateStack = [];
        this.currentStateIndex = -1;
        this.changeState(currentState);
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
