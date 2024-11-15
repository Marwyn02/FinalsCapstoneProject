"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = ({ height }: { height: number }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    }
    mapRef.current = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [120.33498127617469, 16.610384855309448],
      zoom: 12,
    });

    new mapboxgl.Marker({ color: "black" })
      .setLngLat([120.33498127617469, 16.610384855309448])
      .addTo(mapRef.current);

    return () => mapRef.current!.remove();
  }, []);
  return (
    <div
      id="map"
      className={`col-span-2 w-full h-[400px] md:h-[${height}px] rounded-lg`}
      ref={mapContainerRef}
    ></div>
  );
};

export default Map;
