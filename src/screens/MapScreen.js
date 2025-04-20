import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const LeafletMap = ({ navigation }) => {
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
      .popup-btn {
        margin-top: 8px;
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .confirm-btn {
        background-color: #28a745;
        color: white;
      }
      .cancel-btn {
        background-color: #dc3545;
        color: white;
        margin-left: 5px;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
  
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        const map = L.map('map').setView([27.700769, 85.300140], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
  
        let marker = null;
  
        map.on('click', function(e) {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
  
          if (marker) {
            map.removeLayer(marker);
          }
  
          fetch(\`https://nominatim.openstreetmap.org/reverse?lat=\${lat}&lon=\${lng}&format=json\`)
            .then(response => response.json())
            .then(data => {
              const address = data.display_name || "Address not found";
  
              marker = L.marker([lat, lng]).addTo(map);
              marker.bindPopup(\`
                <div>
                  <strong>Address:</strong><br />\${address}<br /><br />
                  <button class="popup-btn confirm-btn" onclick="window.confirmLocation(\${lat}, \${lng}, '\${address.replace(/'/g, "\\'")}')">Confirm</button>
                  <button class="popup-btn cancel-btn" onclick="window.cancelMarker()">Cancel</button>
                </div>
              \`).openPopup();
            });
        });
  
        window.confirmLocation = function(lat, lng, address) {
          // Use the navigation prop to send the address back to the CreateLeagueScreen
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'setAddress', address: address,lat: lat,lng: lng}));
        };
  
        window.cancelMarker = function() {
          if (marker) {
            map.removeLayer(marker);
            marker = null;
          }
        };
      });
    </script>
  </body>
  </html>
  `;
  
  const onMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log("Data from WebView:", data); //  Check this first
  
    if (data.type === 'setAddress') {
      console.log("Sending to CreateLeagueScreen:", data); //  Check this too
  
      navigation.navigate('CreateLeagueScreen', {
        location: data.address, //  Should match `route.params?.location`
        latitude: data.lat,
        longitude: data.lng,
      });
    }
  };

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
        onMessage={onMessage} // Listen for messages from the WebView
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
