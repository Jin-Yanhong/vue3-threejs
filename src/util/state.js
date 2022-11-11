export class Stats {
    container;
    mode;
    fpsPanel;
    msPanel;
    memPanel;
    constructor() {
        this.mode = 0;
        this.container = document.createElement('div');
        this.container.setAttribute('id', 'panelGroup');
        this.container.style.cssText = 'position:fixed;top:0;left:300px;cursor:pointer;opacity:0.9;z-index:10000';
        this.container.addEventListener(
            'click',
            event => {
                event.preventDefault();
                this.showPanel(++this.mode % this.container.children.length);
            },
            false
        );

        let beginTime = (performance || Date).now();
        let prevTime = beginTime;
        let frames = 0;

        this.fpsPanel = this.addPanel(this.initPanel('FPS', '#0ff', '#002'));
        this.msPanel = this.addPanel(this.initPanel('MS', '#0f0', '#020'));

        if (self.performance && self.performance.memory) {
            this.memPanel = this.addPanel(this.initPanel('MB', '#f08', '#201'));
        }

        this.showPanel(0);
        const _this = this;
        return {
            REVISION: 16,
            dom: _this.container,
            addPanel: _this.addPanel,
            showPanel: _this.showPanel,
            begin: function () {
                beginTime = (performance || Date).now();
            },
            end: function () {
                frames++;
                const time = (performance || Date).now();
                _this.msPanel.update(time - beginTime, 200);
                if (time > prevTime + 1000) {
                    _this.fpsPanel.update((frames * 1000) / (time - prevTime), 100);
                    prevTime = time;
                    frames = 0;
                    if (_this.memPanel) {
                        const memory = performance.memory;
                        _this.memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
                    }
                }
                return time;
            },
            update: function () {
                beginTime = this.end();
            },
            // Backwards Compatibility
            domElement: this.container,
            setMode: this.showPanel
        };
    }

    addPanel(panel) {
        this.container.appendChild(panel.dom);
        return panel;
    }

    showPanel(id) {
        if (this.container) {
            for (let i = 0; i < this.container.children.length; i++) {
                this.container.children[i].style.display = i === id ? 'block' : 'none';
            }
            this.mode = id;
        }
    }

    initPanel = function (name, fg, bg) {
        let min = Infinity;
        let max = 0;
        const round = Math.round;
        const PR = round(window.devicePixelRatio || 1);
        const WIDTH = 80 * PR;
        const HEIGHT = 48 * PR;
        const TEXT_X = 3 * PR;
        const TEXT_Y = 2 * PR;
        const GRAPH_X = 3 * PR;
        const GRAPH_Y = 15 * PR;
        const GRAPH_WIDTH = 74 * PR;
        const GRAPH_HEIGHT = 30 * PR;
        const canvas = document.createElement('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        canvas.style.cssText = 'width:80px;height:48px';

        const context = canvas.getContext('2d');
        context.font = 'bold ' + 9 * PR + 'px Helvetica,Arial,sans-serif';
        context.textBaseline = 'top';
        context.fillStyle = bg;
        context.fillRect(0, 0, WIDTH, HEIGHT);
        context.fillStyle = fg;
        context.fillText(name, TEXT_X, TEXT_Y);
        context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
        context.fillStyle = bg;
        context.globalAlpha = 0.9;
        context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

        return {
            dom: canvas,
            update: function (value, maxValue) {
                min = Math.min(min, value);
                max = Math.max(max, value);
                context.fillStyle = bg;
                context.globalAlpha = 1;
                context.fillRect(0, 0, WIDTH, GRAPH_Y);
                context.fillStyle = fg;
                context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y);
                context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);
                context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);
                context.fillStyle = bg;
                context.globalAlpha = 0.9;
                context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - value / maxValue) * GRAPH_HEIGHT));
            }
        };
    };
}
