function getColor(category) {
  
  switch (category) {
    case 'anti-social-behaviour':
      return '#FF0000'
    case 'criminal-damage-arson':
      return '#FF8C00'
    case 'bicycle-theft':
      return '#00FFFF'
    case 'drugs':
      return '#00FF00'
    case 'burglary':
      return '#808080'
    case 'other-theft':
      return '#FF00FF'
    case 'possession-of-weapons':
      return '#FFFF00'
    case 'public-order':
      return '#0000FF'
    case 'robbery':
      return '#008080'
    case 'shoplifting':
      return '#808000'
    case 'theft-from-the-person':
      return '#008000'
    case 'violent-crime':
      return '#000000'
    case 'vehiclecrime':
    case 'vehicle-crime':
      return '#000080';
    case 'other-crime':
      return '#FF1493'
    default:
      return undefined
  }
}

export default getColor;
