# CrimeWatch
This file serves as the main documentation for the CrimeWatch project. It provides an overview of the project, its purpose, and instructions on how to use it.

**Author:** [Rodwell]
**Version:** 1.0
**Date:** [20/04/2024]

## Table of Contents
- [Overview](#overview)
- [Demo](#Demo)
- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [App Preview](#app-preview)
- [Contributing](#contributing)

## Overview
CrimeWatch is a web application that allows users to view crime data for specific locations. It uses the UK Police API to fetch crime reports and displays them on an interactive map.
## Demo
A demonstration of this application is available for quick access via the Heroku hosting platform. On this platform, the app runs on a eco dyno which has limitations of cold starts resulting in a slow startup of the application upon first use and its routers have roughly a 30 seconds request timeout resulting in the appication producing a 503 error when application is processing large data sets. To avoid timeout errors try searching areas outside of highly populated cities.
    works are ongoing to optimise the processing capability of application and heroku dynos to reduce  and avoid impacts of heroku router timeouts.
    view application at [UKPDCrimewatch](https://ukpdcrimewatch-706f25134503.herokuapp.com/)

## Installation and Usage
To install the dependencies for this project, follow these steps:
1. Clone the project repository from GitHub.
##### Using Docker Containers - Recommended
1. Ensure Docker is installed on your system. If not, download and install Docker from [Docker's official site](https://www.docker.com/products/docker-desktop)

2. using the terminal cd to the CrimeWatch directory,by running the command:
```cd CrimeWatch```
4. Makesure to login to Docker, by running the command:
```docker login```

5. build containers using docker compose, by running the command:
```docker-compose build```

6. Start the containers using Docker Compose,by running the command:
``` docker-compose up```

7. Access the Application, Once the containers are running, open a web browser and navigate to http://127.0.0.1:8000 to access the CrimeWatch application.You should now be able to interact with the application and view crime data as intended.

8. Shut Down the Application, When you are done, you can stop the Docker containers by running the command:
```docker-compose down```

These steps should get the CrimeWatch Demo application running on your local machine using Docker, ensuring that all dependencies are correctly handled by the containerized environment.

##### Using Django with pipenv
this project leverages the processing poswer of  geospatial libraries (GEOS, PROJ, GDAL and PostGIS) avaiable with geodjango, therefore to successfully run this application on your local machine outside of a container you need to install these libraries on your local system: please follow the instructions available here [Django's official site](https://docs.djangoproject.com/en/5.0/ref/contrib/gis/install/geolibs/): after doing this then continue with the instructions below:
1. if you do not have pipenv installed; run the following command:
```pip install pipenv```
2. In terminal Go to root directory and create a virtual environment run the command:
```pipenv install```
3. Activate the virtual environment created by pipenv, by running the command:
```pipenv shell```
4. Go to CrimeWatch\CrimeWatch\settings.py and uncomment lines 85 and 86 which are accessing the location of the  gdal308.dll and geos_c.dll files
5. Create .env file for local database: create the following:
  --POSTGRES_PASSWORD=yourpassword
  --SECRET_KEY=yoursecretkey

6. Create project models in PostgreSql database, please ensure your PostgreSQL database is set up and running, then make migrationsfollowed by applying migrations by running the commands:
```
   python manage.py makemigrations
   python manage.py migrate
   ```

7. Collect static files by running the following command:
``` python manage.py collectstatic --noinput  ```

8. Start the Django development server, by running the following command:
```python manage.py runserver ```
9. Accessing the Application: by opening the  web browser and navigating to http://127.0.0.1:8000 should provide  access the demo CrimeWatch application.

## Tech Stack
- CSS3
- React
- Redux-Toolkit
- Django
- Django REST Framework
- OpenLayers
- Chart.js
- Docker
- Heroku

## App Preview (screenshots)
### Landing Page
![](./CrimeWatch/Frontend/src/assets/landing_page.png)

### Crime Map
![](./CrimeWatch/Frontend/src/assets/crimedetails.png)


## Contributing
If you would like to contribute to the CrimeWatch project, please follow these guidelines:

1. Fork the repository on GitHub.
2. Create a new branch with a descriptive name.
3. Make your changes and commit them to your branch.
4. Push your branch to your forked repository.
5. Submit a pull request to the main repository.
