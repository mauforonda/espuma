let map;
let minute;
let data;
let overlay;
let now = 1;

const time = document.getElementById('time');
const mapDiv = document.getElementById('map')

document.body.classList.remove("preload");

const punto = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 3,
    fill: new ol.style.Fill({color: 'rgba(88, 115, 232, 0.2)'}),
    stroke: new ol.style.Stroke({color: '#5873e8', width: 1})
  })
});

function ciudad(){
  
  const lapaz = [ -68.09862408447266, -16.500910095214845 ];
  
  const layer = new ol.layer.Tile({
    source: new ol.source.XYZ({ 
      url:'http://{1-4}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
    }),
    opacity: 0.9
  });

  const view = new ol.View({
    center: lapaz,
    projection: 'EPSG:4326',
    zoom: 13
  });

  map = new ol.Map({
    layers: [layer],
    target: 'map',
    view: view
  });
};
  

function mover(now) {
  setTimeout(function(){
    
    minute.setGeometry(new ol.geom.MultiPoint(data[now][1]));
    time.textContent = data[now][0];
    now++;
    if (now == data.length) {now = 0};
    if (data[now][0] == "06:00") {mapDiv.classList = "day"; time.classList = "timeday"};
    if (data[now][0] == "19:00") {mapDiv.classList = "night"; time.classList = "timenight"};
    mover(now);
    
  }, 80);
};


function inicializar() {
  
  minute = new ol.Feature({
    geometry: new ol.geom.MultiPoint(data[0][1])
  });
  
  const movementSource = new ol.source.Vector({
    projection: 'EPSG:4326',
    features: [minute]
  });
  
  const movementLayer = new ol.layer.Vector({
    source: movementSource,
    style: punto
  });
  
  map.addLayer(movementLayer);

};

function movimiento() {
  
  fetch('./data.json')
    .then((response) => response.json())
    .then((d) => {
      
      data = d;
      inicializar();
      mover(now);
      
    });
};

ciudad();
movimiento();
