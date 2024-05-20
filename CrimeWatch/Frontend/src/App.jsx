import banner from './assets/policebanner.png'
import logo from './assets/crimewatchlogo.png'
import CrimeMap from './components/Crimemap';
import CrimeMapDetails from './components/CrimeMapDetails';
import './App.css'

function App() {

  return (
    <div className='App_container'>
      <div className='header_container'>
        <div className='bg'>
          <img src={banner} alt='policebanner' />
        </div>
        <div className='logo_container'>
          <img src={logo} alt='logo' />
          <div className='title'>
            Crime Watch
          </div>
        </div>
      </div>
      <div className='body_container'>
        <CrimeMap />
        <CrimeMapDetails />
      </div>
       <div className='footer'>
      </div>
    </div>
  )
}

export default App
