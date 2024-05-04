import React, { useEffect, useRef } from 'react';

// Declare google as a global variable to avoid linter errors
/* global google */

function GoogleMap() {
    const mapRef = useRef(null); // Reference for the map element
    const lat = parseFloat(localStorage.getItem('Latitude:'));
    const lng = parseFloat(localStorage.getItem('Longitude:'));

    const positions = [
        {
            lat,
            lng,
            title: 'My location',
        },
        {
            lat: 28.6217,
            lng: 77.2155,
            title: 'restaurent Location',
        },
        // Add more positions as needed
    ];

    useEffect(() => {
        // Function to initialize the map
        const initializeMap = () => {
            // Create a new Google Map instance
            const map = new google.maps.Map(mapRef.current, {
                center: { lat: positions[0].lat, lng: positions[0].lng },
                zoom: 14,
                // mapId: 'DEMO_MAP_ID', // Your map ID here
            });

            // Loop through the positions array and create markers
            positions.forEach(position => {
                new google.maps.Marker({
                    position: { lat: position.lat, lng: position.lng },
                    map,
                    title: position.title,
                });
            });
        };

        // Function to load the Google Maps API script
        const loadGoogleMapsAPI = () => {
            // Create a script element
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDZwy59FehGGCCkOI6Yc7wDXrHNklAG9po&callback=initMap&libraries=maps,marker&v=beta`;
            script.async = true;
            script.defer = true;

            // Set the callback function
            window.initMap = initializeMap;

            // Append the script element to the document head
            document.head.appendChild(script);

            // Add error handling for script loading
            script.onerror = () => {
                console.error('Failed to load Google Maps API script');
            };
        };

        // Load the Google Maps API script
        loadGoogleMapsAPI();

        // Clean up the map when the component is unmounted
        return () => {
            if (mapRef.current) {
                mapRef.current.innerHTML = '';
            }
        };
    }, [positions]);

    return (
        <div
            ref={mapRef}
            style={{ height: '600px', width: '600px' }} // Set the map element size
        />


    );
}

export default GoogleMap;







