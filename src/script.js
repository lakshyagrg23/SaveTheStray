document.addEventListener("DOMContentLoaded", () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoidGFyYW5nMyIsImEiOiJjbTN2aHpta2cwdHhyMmxzY3B6OG9ydzh4In0.hp3xx3PRPxu5I3NC9viPVQ";

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [78.9629, 20.5937],
    zoom: 4,
  });

  map.addControl(new mapboxgl.NavigationControl());

  const lastReportedLocation = localStorage.getItem("lastReportedLocation");
  if (lastReportedLocation) {
    searchLocation(lastReportedLocation);
  }

  async function searchLocation(locationName) {
    const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      locationName
    )}.json?access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(geocodeURL);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].geometry.coordinates;

        map.flyTo({ center: [longitude, latitude], zoom: 12, essential: true });

        new mapboxgl.Marker({ color: "red" })
          .setLngLat([longitude, latitude])
          .addTo(map);

        // Add translucent circle around the marker
        const el = document.createElement("div");
        el.style.border = "3px solid yellow";
        el.style.borderRadius = "50%";
        el.style.width = "400px";
        el.style.height = "400px";
        el.style.backgroundColor = "rgba(255, 255, 0, 0.3)";
        el.style.position = "absolute";
        el.style.transform = "translate(-50%, -50%)";
        map.getCanvasContainer().appendChild(el);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }
});
