let map;
let minute;
let data;
let overlay;
let now = 1;
const time = document.getElementById('time');
const mapDiv = document.getElementById('map')

const punto = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 5,
    fill: new ol.style.Fill({color: '#ffe30d'}),
    stroke: new ol.style.Stroke({color: '#f0a80c', width: 1})
  })
});

function ciudad(){
  
  const lapaz = [-68.123, -16.504];
  
  const layer = new ol.layer.Tile({
    source: new ol.source.OSM(),
    opacity: 0.7
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
    if (data[now][0] == "06:00") {mapDiv.classList = "day"};
    if (data[now][0] == "19:00") {mapDiv.classList = "night"};
    mover(now);
    
  }, 100);
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
