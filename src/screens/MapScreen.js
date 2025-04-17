import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const LeafletMap = () => {
  const leafletHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
          html, body, #map {
            height: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>

        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          document.addEventListener("DOMContentLoaded", function () {
            var map = L.map('map').setView([27.700769, 85.300140], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // 🔥 Single marker logic
            var singleMarker = L.marker([27.700769, 85.300140])
              .addTo(map)
              .bindPopup('Initial marker')
              .openPopup();

            map.on('click', function(e) {
              if (singleMarker) {
                map.removeLayer(singleMarker);
              }

              singleMarker = L.marker([e.latlng.lat, e.latlng.lng])
                .addTo(map)
                .bindPopup("Marker at: " + e.latlng.lat.toFixed(4) + ", " + e.latlng.lng.toFixed(4))
                .openPopup();
            });
          });
          
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: leafletHTML }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={{ flex: 1 }}
        mixedContentMode="always"
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LeafletMap;
