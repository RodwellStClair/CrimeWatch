import spinner from '../assets/loading1.gif';
import './crimemapdetails.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCrimedata } from '../redux/getCrimedata';
import { fetchCrimeMonthlySummary } from '../redux/getCrimeMonthlySummary';
import isWithinOneMileRadius from '../utilities/checkRadius';
import { useState, useEffect, useRef } from 'react';
import LineChart from './chart/LineChart';

function CrimeMapDetails() {

  const dispatch = useDispatch();
  const [showLoading, setShowLoading] = useState(false);
  const [startSearch, setStartSearch] = useState(false);
  const coordinates = useSelector((state) => state.search.coordinates);
  const crimeMonthlySummary = useSelector((state) => state.crimeMonthlySummary.data);
  


  const calledOnce = useRef(false);

  useEffect(() => {
    if (startSearch && !calledOnce.current) {
      calledOnce.current = true;
      const radiusCheck = isWithinOneMileRadius(coordinates);
      if (radiusCheck === 'within') {
        alert('coordinates are within 1 mile radius of the initial search point');
      } else if (radiusCheck === 'outside') {
        dispatch(fetchCrimedata(coordinates));
        dispatch(fetchCrimeMonthlySummary(coordinates));
        setShowLoading(true);
      }
      setStartSearch(false);
    } else if (!startSearch) {
      calledOnce.current = false; // Reset when not searching
    }
  }, [startSearch, coordinates, dispatch]);

  return (
    <div className='details_container'>
      <div className='searchbox'>
        <input className='medium_title' placeholder='Latitude' value={coordinates[0] || ''} readOnly />
        <input className='medium_title' placeholder='Longitude' value={coordinates[1] || ''} readOnly />
        <button className='btn' onClick={() => setStartSearch(true)}>
          Search
        </button>
      </div>
      <div className='search_results'>

        {crimeMonthlySummary ? (
          <LineChart crimeMonthlySummary={crimeMonthlySummary} />
        ) : showLoading ? (
          <div className='loading'>
            <img src={spinner} alt='Loading...' />
          </div>
        ) : (
          <div className='no_data'>
            <div className='no_data_text'><p>
              Please search map for a location that you would like to see the crime data for.
                  Each time you click on the map the geographical latitude and longitude for that point will be displayed in the search box above.
                  Click on icons to see more information about the specific crime in that area.
              If you are satisfied with the coordinates in the search box above,
                  then click on the search button to see the crime data for that location.<br /><br />
              The search result is based on a <strong>1 mile radius</strong> of the initial search point.<br /><br />The search results are the most recent month
                  of crime data available at the time of the search.<br /><br /> The search results line chart shows the total crimes per crime category per month;
                  dating back 12 months<br /><br />
                  The search results may show missing values, very low values or 0 values for certain crime categories or for certain areas,
                  this may be due to the crime data not being available for that month at the time of the search.<br /><br />
              <strong>P.S.</strong> that given the volume of data,
              the search may take a few minutes to complete and be displayed.
            </p><br />
            </div>

            <div className='disclaimer'>
              <h3>Disclaimer</h3>
              <h4>This Application is designed to be used as a tool for the public to get information about the crime in their area as recorded and
                reported by the police in the United Kingdom, it displays unaltered information published by the police, throught their API services
                available at <a href='https://data.police.uk/'>data.police.uk</a></h4>
              <h4>This application is not intended to be used for any other purpose than stated above</h4>
              <h4>If you have any questions or feedback about the application please contact the developer at kamilah.anthony93@gmail.com</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CrimeMapDetails
