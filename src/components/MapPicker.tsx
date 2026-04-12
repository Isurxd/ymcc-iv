'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icon in React
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
  position: { lat: number; lng: number };
  onPositionChange: (pos: { lat: number; lng: number }) => void;
}

function LocationMarker({ position, onPositionChange }: MapPickerProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);

  useMapEvents({
    click(e) {
      onPositionChange(e.latlng);
    },
  });

  return (
    <Marker 
      position={position} 
      draggable={true} 
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          onPositionChange(marker.getLatLng());
        },
      }}
    />
  );
}

export default function MapPicker({ position, onPositionChange }: MapPickerProps) {
  return (
    <MapContainer center={position} zoom={15} style={{ height: '350px', width: '100%', zIndex: 10 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} onPositionChange={onPositionChange} />
    </MapContainer>
  );
}
