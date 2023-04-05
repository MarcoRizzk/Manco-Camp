
mapboxgl.accessToken = mapToken ;
const map = new mapboxgl.Map({
container: 'map', 
style: 'mapbox://styles/mapbox/streets-v12', 
center: campground.geometry.coordinates, 
zoom: 10, 
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');


new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 25 })
    .setHTML(
        `<h6>${campground.title}</h6>`
    )
)
.addTo(map)