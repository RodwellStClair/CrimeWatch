from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.db.models.functions import Transform
from django.contrib.gis.measure import D
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from . import utilities
from . import models

@api_view(["GET"])
def get_crime_reports_per_coordinate(request, lat, lng):
    try:
        lat = float(lat)
        lng = float(lng)
    except ValueError:
        return Response(
            [],
            status=status.HTTP_400_BAD_REQUEST,
        )

    current_user_location = Point(
        lng, lat, srid=4326
    )  # Ensure SRID is set for geographic coordinate systems

    try:
        nearby_coordinate = (
            models.Coordinates.objects.annotate(
                distance=Distance(
                    Transform("user_location", 3857),
                    Transform(current_user_location, 3857),
                )
            )
            .filter(
                # user_location__dwithin=(current_user_location, 1600)  # 1 mile in meters
                distance__lte=D(m=1609)
            )
            .order_by("distance")
            .first()
        )

        if nearby_coordinate:
            print('nearby coordinate found')
            reports = list(nearby_coordinate.reports.all().values())
            if reports:
                print('reports found')
                return Response(
                    reports,
                status=status.HTTP_200_OK
            )
            else:
                print("no reports found")
                return utilities.fetch_and_create_reports(lat, lng, current_user_location)
        else:
            print("No nearby coordinates found.")
            return utilities.fetch_and_create_reports(lat, lng, current_user_location)
    except models.Coordinates.DoesNotExist as e:
        print(e)
        return utilities.fetch_and_create_reports(lat, lng, current_user_location)


@api_view(["GET"])
def get_monthly_crime_summary(request, lat, lng):
    try:
        lat = float(lat)
        lng = float(lng)
    except ValueError:
        return Response(
            {"error": "Invalid latitude or longitude"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    current_user_location = Point(
        lng, lat, srid=4326
    )  # Correct SRID and coordinate order

    try:
        print('checking database for coordinates or nearby coordinates')
        nearby_coordinate = (
        models.Coordinates.objects.annotate(
            distance=Distance(
                Transform("user_location", 3857),
                Transform(current_user_location, 3857),
            )
        )
        .filter(
            #user_location__dwithin=(current_user_location, 1609)  # 1 mile in meters
            distance__lte=D(m=1609)
        )
        .order_by("distance")
        .first()
    )
        if nearby_coordinate:
            print('nearby coordinates found')
            monthlysummary = list(nearby_coordinate.monthly_summaries.all().values())
            if monthlysummary:
                print('monthly summary found')
                return Response(
                monthlysummary,
                status=status.HTTP_200_OK
            )
            else:
                print("No monthly summary found for coordinates, fetching and creating crime data summary")
                return utilities.fetch_and_create_crime_data(
                lat, lng, current_user_location
            )
        else:
            print("No nearby coordinates found.")
            return utilities.fetch_and_create_crime_data(
                lat, lng, current_user_location
            )

    except Exception as e:
        print(e)
        return utilities.fetch_and_create_crime_data(
                lat, lng, current_user_location
            )
