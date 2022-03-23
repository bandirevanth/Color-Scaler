/* BABEL */

const { Illustration, Group, Anchor, Rect, TAU, Ellipse, Shape } = Zdog;

function translate(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * ((value - low1) / (high1 - low1));
}

const colorModes = {
  hsv: {
    func: 'hsv',
    x: [0, 360],
    y: [1, 1],
    z: [2, 1]
  },
  hsi: {
    func: 'hsi',
    x: [0, 360],
    y: [1, 1],
    z: [2, 1]
  },
  hsl: {
    func: 'hsl',
    x: [0, 360],
    y: [1, 1],
    z: [2, 1]
  },
  rgb: {
    func: 'rgb',
    x: [0, 255],
    y: [1, 255],
    z: [2, 255]
  },
  lrgb: {
    func: 'lrgb',
    x: [0, 255],
    y: [1, 255],
    z: [2, 255]
  },
  lab: {
    func: 'lab',
    z: [0, 100],
    y: [1, 127, -128],
    x: [2, 127, -128]
  },
  lch: {
    func: 'lch',
    z: [0, 100],
    y: [1, 100],
    x: [2, 0, 360]
  }
};

new Vue({
  el: '#app',
  components: {
    vuedraggable
  },
  data() {
    return {
      padding: 0,
      connectColors: false,
      currentSpace: 'lab',
      nbrOfColors: 12,
      currentColor: '#212324',
      spaces: ['lab', 'hsl', 'hsv', 'hsi', 'lch', 'rgb', 'lrgb'],
      list: [
        { value: "#08544f" },
        { value: "#ff4000" },
        { value: "#cbd6ec" }
      ],
    }
  },
  
  watch: {
    colorScale: function (newEntry, oldEntry) {

      this.z.space.remove();
      this.z.space = new Anchor({
        addTo: this.z.illu,
      });
      
      this.updateSpace();
      
      this.z.illu.updateRenderGraph();
    }
  },
  computed: {
    min: function() {
      return this.list.length;
    },
    colorScale: function () {
      const colors = this.list.map(l => l.value);
      
      if (this.connectColors) {
        colors.push(colors[0])  
      }
      let scale = chroma.scale(colors) .padding(parseFloat(this.padding))
                   .mode(this.currentSpace)
                   .colors(
                     parseInt(this.nbrOfColors) + 
                     (this.connectColors ? 1 : 0)
                   );
      
      if (this.connectColors) {
        scale.pop();
      }
      return scale;
    },
    bgc: function () {
      const l = this.colorScale.length;
      return `linear-gradient(180deg, ${this.colorScale.map((c,i) => 
        `${c} ${i/l*100}% ${(i+1)/l*100}%`
      ).join(',')})`
    },
    bglcc: function () {
      const l = this.colorScale.length;
      return `linear-gradient(180deg, ${this.colorScale.join(',')})`
    },
    bgcc: function () {
      const l = this.colorScale.length;
      return `conic-gradient( ${this.colorScale.map((c,i) => 
        `${c} ${i/l*100}% ${(i+1)/l*100}%`
      ).join(',')})`
    },
    
    bgccc: function () {
      const l = this.colorScale.length;
      return `conic-gradient( ${this.colorScale.join(',') + (
        this.connectColors ?
        ',' + this.colorScale[0] :
        ''
      )})`
    },
    rawColors: function () {
      return this.colorScale.join(',')
    },
  },
  methods: {
    removeMe: function (i) {
      this.list.splice(i,1);
    },
    changeColor: function (e, i) {
      this.list[i].value = e.target.value;
    },
    addColor: function () {
      if(chroma.valid(this.currentColor)) {
        
        this.list.push({
          value: this.currentColor,
        });
      }
    },
    addSpaceBound: function () {
      const lineColor = '#202124';
      const illo = this.z.illu;
      
      const w = this.z.illu.width;
      const h = this.z.illu.height;
      const s = Math.min(w, h) * .5;
      const stroke = 2;
      
      new Shape({
        addTo: illo,
        path: [
          { y: -s * .5, x: -s * .5, z: -s * .5},
          { y:  s * .5, x: -s * .5, z: -s * .5},
        ],
        stroke: stroke,
        color: lineColor,
      });

      new Shape({
        addTo: illo,
        path: [
          { y: -s * .5, x: s * .5, z: -s * .5},
          { y:  s * .5, x: s * .5, z: -s * .5},
        ],
        stroke: stroke,
        color: lineColor,
      });

      new Shape({
        addTo: illo,
        path: [
          { y: -s * .5, x: -s * .5, z: s * .5},
          { y:  s * .5, x: -s * .5, z: s * .5},
        ],
        stroke: stroke,
        color: lineColor,
      });

      new Shape({
        addTo: illo,
        path: [
          { z: -s * .5, y: -s * .5, x: -s * .5},
          { z: s * .5, y: -s * .5, x: -s * .5},
        ],
        stroke: stroke,
        color: lineColor,
      });

      new Shape({
        addTo: illo,
        path: [
          { z: -s * .5, y: s * .5, x: -s * .5},
          { z: s * .5, y: s * .5, x: -s * .5},
        ],
        stroke: stroke,
        color: lineColor,
      });

      new Shape({
        addTo: illo,
        path: [
          { z: -s * .5, y: s * .5, x: s * .5},
          { z: s * .5, y: s * .5, x: s * .5},
        ],
        stroke: stroke,
        color: lineColor,
      });


      new Shape({
        addTo: illo,
        path: [
          { x: -s * .5, y: s * .5, z: s * .5},
          { x: s * .5, y: s * .5, z: s * .5},
        ],
        stroke: stroke,
        color: lineColor,
      });


      new Shape({
        addTo: illo,
        path: [
          { x: -s * .5, y: -s * .5, z: -s * .5},
          { x: s * .5, y: -s * .5, z: -s * .5},
        ],
        stroke: stroke,
        color: lineColor,
      });

      new Shape({
        addTo: illo,
        path: [
          { x: -s * .5, y: s * .5, z: -s * .5},
          { x: s * .5, y: s * .5, z: -s * .5},
        ],
        stroke: stroke,
        color: lineColor,
      });
    },
    updateSpace: function () {
      const w = this.z.illu.width;
      const h = this.z.illu.height;
      const s = Math.min(w, h) * .5;
      const stroke = 2;

      this.colorScale.forEach(color => {
        const c = chroma(color);
        const mode = colorModes[this.currentSpace];
        const colorComp = c[mode.func === 'lrgb' ? 'rgb' : mode.func]();
        const position = c.gl();
        console.log(position)
        
        let pX = translate(colorComp[mode.x[0]], mode.x[2] || 0, mode.x[1], -s * .5, s * .5);
        let pZ = translate(colorComp[mode.z[0]], mode.z[2] || 0, mode.z[1], -s * .5, s * .5);
        let pY = translate(colorComp[mode.y[0]], mode.y[2] || 0, mode.y[1], -s * .5, s * .5);
        
        if (mode.func === 'hsl' || mode.func === 'hsv' || mode.func === 'hsi' || mode.func === 'hcg') {
          let theta = Math.PI * colorComp[mode.x[0]] / 180;
          let r = colorComp[mode.y[0]] * s;

          if (mode.func === 'hsi') {
            r *= colorComp[mode.z[0]] * 0.75;
          } else if (mode.func === 'hsv') {
            r *= colorComp[mode.z[0]] * 0.5;
          } else if (mode.func === 'hcg') {
            r *= .5;
          } else {
            r *= colorComp[mode.z[0]] < 0.5 ? colorComp[mode.z[0]] : 1 - colorComp[mode.z[0]];
          }

          pY = r * Math.cos(theta);
          pX = r * Math.sin(theta);
        }


        if (mode.func === 'lch') {
          let theta = Math.PI * colorComp[mode.x[0]] / 180;
          let r = translate(colorComp[mode.y[0]], 0, mode.y[1], 0, s * .5);

          pY = r * Math.cos(theta);
          pX = r * Math.sin(theta);
        }


        const shape = new Shape({
          addTo: this.z.space,
          stroke: 10,
          color: color,
          translate: {
            x: pX,
            y: pY,
            z: pZ,
          },
        });
      });

      this.z.illu.updateRenderGraph();

    }
  },
  mounted: function () {
    const can = this.$refs.can; 
    
    this.z = {};
    
    this.z.illu = new Illustration({
      element: can,
      dragRotate: true,
      //resize: true,
    });
    
    this.z.space = new Anchor({
     addTo: this.z.illu,
    });
    
    
      
    this.z.illu.rotate.x -= .5;
    this.z.illu.rotate.y = .785;
    
    this.addSpaceBound();
    this.updateSpace();
    
    const animate = () => {
      this.z.illu.updateRenderGraph();
      requestAnimationFrame( animate );
    }
    animate();
  }
});
