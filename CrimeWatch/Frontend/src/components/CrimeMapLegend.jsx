import './legend.css';
import getColor from "../utilities/getColor";

function CrimeMapLegend() {
  const categories = [
    'anti-social-behaviour', 'criminal-damage-arson', 'bicycle-theft', 'drugs',
    'burglary', 'other-theft', 'possession-of-weapons', 'public-order',
    'robbery', 'shoplifting', 'theft-from-the-person', 'violent-crime', 'vehicle-crime', 'other-crime'
  ];

  return (
    <div className="legend">
      {categories.map(category => (
        <div key={category} className="legend-item">
          <span className="legend-color" style={{ backgroundColor: getColor(category) }}></span>
          <span className="legend-text">{category.replace(/-/g, ' ')}</span>
        </div>
      ))}
    </div>
  );
}

export default CrimeMapLegend
