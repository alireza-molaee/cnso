export default class Cnso {
	constructor({
    container = "my-cnso",
    data
  }) {
    this.container = typeof container === 'string' ? document.getElementById(container): container;
    this.data = data;
		setTimeout(()=>{
      this.setup();
		}, 100)
		window.addEventListener('resize', this.onResize.bind(this));
  }
  
  setup() {
    this.calculateDistance();
    this.stage = new Konva.Stage({
      container: this.container,   
      width: this.width,
      height: this.height
    });
    this.optionLayers = [];
    this.lineLayer = new Konva.Layer();
    this.stage.add(this.lineLayer);
    this.itrateOnData(this.data);
  }

  itrateOnData(data) {
    let keys = Object.keys(data);
    if (keys.length !== 1) {
      throw new Error("data structure is not correct!");
    }
    this.renderOption(keys[0], this.stage.getWidth()/2, this.stage.getHeight()/2, this.minDistance/12);
    let options = Object.entries(data[keys[0]]);
    const radianPerOption = (Math.PI * 2)/options.length;
    const circleRadiusLayout = this.minDistance/3;
    const maxRForOption = ((circleRadiusLayout * Math.sin(radianPerOption/2) * 2) - 10) / 2;
    let radius = (this.minDistance/12) <= maxRForOption ? this.minDistance/12: maxRForOption;
    options.forEach((element, index) => {
      this.renderOption(
        element[0],
        (this.stage.getWidth()/2) + (Math.cos(index * radianPerOption) * circleRadiusLayout),
        (this.stage.getHeight()/2) + (Math.sin(index * radianPerOption) * circleRadiusLayout),
        radius
      );    
    });
  }

  renderOption(label, x, y, r) {
    let labelObj = new Konva.Text({
      x: x,
      y: y,
      text: label,
      fontSize: 15,
      fontFamily: 'Calibri',
      fill: 'black'
    });
    labelObj.offsetX(labelObj.width()/2);
    labelObj.offsetY(labelObj.height()/2);
    let circleObj = new Konva.Circle({
      x: x,
      y: y,
      radius: r,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4
    });
    let layer = new Konva.Layer();
    layer.add(circleObj, labelObj);
    this.stage.add(layer);
  }

	onResize(event) {
		this.calculateDistance();
	}

	calculateDistance() {
		this.height = this.container.offsetHeight;
    this.width = this.container.offsetWidth;
    this.minDistance = this.height <= this.width ? this.height: this.width;    
	}

}

window["Cnso"] = Cnso;