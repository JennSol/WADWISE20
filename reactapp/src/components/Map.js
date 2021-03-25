import React from 'react';
import { useHistory } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { marker } from 'leaflet';

function Map(props) {
    const contacts = props.contacts;


    //  https://stackoverflow.com/questions/65625746/how-to-add-multiple-markers-using-react-leaflet-upon-api-call
    //https://react-leaflet.js.org/docs/example-tooltips
    let markerItems = contacts.map((contact) =>
        <Marker key={contact.firstname} position={contact.geoCoord} >
            <Tooltip offset={[0, 20]} opacity={1} permanent>
                {contact.firstname + ' ' + contact.lastname}
            </Tooltip>
        </Marker>
    );

    return (
        <MapContainer center={[52.456009, 13.527571]} zoom={10} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markerItems}
        </MapContainer>

    );
}


export default Map;