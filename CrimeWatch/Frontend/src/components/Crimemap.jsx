import './crimemap.css';
import { useRef, useEffect, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import { Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { toLonLat } from 'ol/proj';
import getColor from '../utilities/getColor';
import Overlay from 'ol/Overlay';
import { useDispatch, useSelector } from 'react-redux';
import { getSearch } from '../redux/updateSearch';
import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import CrimeMapLegend from './CrimeMapLegend';

const CrimeMap = () => {

  const dispatch = useDispatch();
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const overlayContainerElement = useRef(null);

  const [clickedCoords, setClickedCoords] = useState(null);
  const crimedata = useSelector((state) => state.crimedata.data)
  const [overlayVisible, setOverlayVisible] = useState(false);




  function handleClick() {
    const coords = mapRef.current.getView().getCenter();
    setClickedCoords(coords);
    const [long, lat] = toLonLat(coords);
    dispatch(getSearch([lat, long]))
  }

  useEffect(() => {
    if (!mapRef.current && mapElement.current) {
      mapRef.current = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          })
        ],
        view: new View({
          center: clickedCoords || fromLonLat([-0.1278, 51.5074]),
          zoom: 15
        })
      });

      // Create an overlay and attach it to the map
      const overlay = new Overlay({
        element: overlayContainerElement.current,
        id: 'featureOverlay',
        positioning: 'bottom-center'
      });
      mapRef.current.addOverlay(overlay);
    }

    const addPointsFromJson = async () => {
      const features = await crimedata.map(point => {
        const color = getColor(point.category);
        const feature = new Feature({
          geometry: new Point(fromLonLat([point.longitude, point.latitude])),
          name: point.category
        });

        if (color) {
          feature.setStyle(new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: color
              }),
              scale: 1
            })
          }));
        }
        return feature;
      });

      const vectorSource = new VectorSource({
        features: features,
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      mapRef.current.addLayer(vectorLayer);
    };

    if (crimedata) {
      addPointsFromJson();
    }

    mapRef.current.on('singleclick', (event) => {
      let featureFound = false;
      mapRef.current.forEachFeatureAtPixel(event.pixel, (feature) => {

        const coords = feature.getGeometry().getCoordinates();

        const crimeInfo = crimedata.find(crime => {
          const crimeCoords = fromLonLat([crime.longitude, crime.latitude]);
          return crimeCoords[0] === coords[0] && crimeCoords[1] === coords[1];
        });

        if (crimeInfo) {

          const overlayContainer = overlayContainerElement.current;
          overlayContainer.innerHTML = ''; // Clear existing content
          const overlayDiv = document.createElement('div');
          overlayDiv.classList.add('overlay_container');

          const categoryDiv = document.createElement('div');
          categoryDiv.classList.add('overlay_item');
          categoryDiv.innerHTML = `<p><strong>Category: </strong>${crimeInfo.category}</p>`;
          overlayDiv.appendChild(categoryDiv);

          const streetDiv = document.createElement('div');
          streetDiv.classList.add('overlay_item');
          streetDiv.innerHTML = `<p><strong>Street: </strong>${crimeInfo.street || 'Not available'}</p>`;
          overlayDiv.appendChild(streetDiv);

          const monthDiv = document.createElement('div');
          monthDiv.classList.add('overlay_item');
          monthDiv.innerHTML = `<p><strong>Month: </strong>${crimeInfo.month || 'Not available'}</p>`;
          overlayDiv.appendChild(monthDiv);

          const contextDiv = document.createElement('div');
          contextDiv.classList.add('overlay_item');
          contextDiv.innerHTML = `<p><strong>Context: </strong>${crimeInfo.context || 'Not available'}</p>`;
          overlayDiv.appendChild(contextDiv);

          const outcomeDiv = document.createElement('div');
          outcomeDiv.classList.add('overlay_item');
          outcomeDiv.innerHTML = `<p><strong>Outcome: </strong>${crimeInfo.outcome_status?.category || 'Not available'}</p>`;
          overlayDiv.appendChild(outcomeDiv);

          overlayContainer.appendChild(overlayDiv);

          setOverlayVisible(true);
          featureFound = true;
        } else {
         
          overlayContainerElement.current.innerHTML = `<h1>No data available</h1>`;
        }

        setClickedCoords(coords);
        mapRef.current.getOverlayById('featureOverlay').setPosition(coords);
        return true;
      });
      if (!featureFound) {
        setOverlayVisible(false);
      }
    });


    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(null);
        mapRef.current = null;
      }
    };

  }, [crimedata]);

  mapRef.current?.getViewport().addEventListener('click', () => {

    if (!overlayVisible) {
      setOverlayVisible(false);
    }
  });

  return (
    <>
      <div ref={mapElement} className='map_container' onClick={handleClick}>
        <CrimeMapLegend />
      </div>
      <div ref={overlayContainerElement} style={{ display: overlayVisible ? 'block' : 'none', position: 'absolute', zIndex: 1000 }}>
      </div>
    </>
  );
}

export default CrimeMap;
