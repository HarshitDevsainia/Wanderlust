
  // TO MAKE THE MAP APPEAR YOU MUST
  // ADD YOUR ACCESS TOKEN FROM
  // https://account.mapbox.com
  const coordinates=list.geometry.coordinates;

  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
  });


const marker1 = new mapboxgl.Marker({ color: 'red'})
.setLngLat(coordinates)
.setPopup(
  new mapboxgl.Popup({offset:25})
  .setHTML(`<h5>${list.location+','+list.country}</h5> <p>Exact Location Provided After Booking</p>`)) // add popup
.addTo(map);



// To Show Image on the Map

// const el = document.createElement('div');
// const width =50;
// const height = 50;
// el.className = 'marker';
// el.style.backgroundImage = `url(https://i.pinimg.com/564x/1a/57/6c/1a576c897517d4d6854e7329b4e54251.jpg/${width}/${height}/)`;
// el.style.width = `${width}px`;
// el.style.height = `${height}px`;
// el.style.backgroundSize = '100%';


// new mapboxgl.Marker(el)
// .setLngLat(coordinates)
// .setPopup(
//   new mapboxgl.Popup({offset:25})
//   .setHTML(`<h5>${list.location+','+list.country}</h5> <p>Exact Location Provided After Booking</p>`))
// .addTo(map);
