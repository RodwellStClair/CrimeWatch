from dateutil.relativedelta import relativedelta
from rest_framework.response import Response
from rest_framework import status
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
import datetime
from . import models
import requests

def fetch_and_create_reports(lat, lng, current_user_location):
    url = f"https://data.police.uk/api/crimes-street/all-crime?lat={lat}&lng={lng}"
    res = requests.get(url)
    if res.status_code == 200:
        body = res.json()
        try:
            print('Creating coordinates', current_user_location)
            coordinate, created = models.Coordinates.objects.get_or_create(
                user_location=current_user_location
            )
            if coordinate.user_location :
                print(
                    "Coordinates created in database"
                )
                response_reports = []
                print('Creating reports')
                for item in body:
                    report = models.Report(
                        category=item["category"],
                        location_type=item["location_type"],
                        location=models.Coordinates.objects.get(
                            user_location=current_user_location
                        ),
                        latitude=item["location"]["latitude"],
                        longitude=item["location"]["longitude"],
                        street=item["location"]["street"]["name"],
                        context=item["context"],
                        outcome_status=item["outcome_status"],
                        persistent_id=item["persistent_id"],
                        report_id=item["id"],
                        location_subtype=item["location_subtype"],
                        month=item["month"],
                    )
                    response_reports.append(report.to_dict())
                    report.save()
                print('Reports created in database')
                return Response(response_reports, status=status.HTTP_200_OK)
        except Exception as e:
            print("Database error:", e)
            return Response(
                {"Database error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    else:
        api_response = res.json()
        return Response(
            {"error": "Failed to fetch data from external API",
             "api_response": api_response
             }, status=res.status_code
        )


def fetch_and_create_crime_data(lat, lng, current_user_location):
    crime_counts = get_crime_counts(lat, lng)
    
    if not crime_counts:
        return Response(
            {"error": "No crime data available"}, status=status.HTTP_404_NOT_FOUND
        )
    # Create coordinate if it does not exist
    coordinate, created = models.Coordinates.objects.get_or_create(
        user_location=current_user_location
    )
    if coordinate.user_location:
        print("Coordinates created or found in database.")
    # Create or update monthly summaries
        print('Creating monthly summaries')
        response_monthly_summary = []
        for month, crimes in crime_counts.items():
            crime_summary, created = models.MonthlyCrimeSummary.objects.update_or_create(
                location=coordinate,
                month=month,
                defaults={"crime_data": crimes},
            )
            response_monthly_summary.append(
            {"month": month, "crime_data": crimes, "created": created}
            )
        print('Monthly summaries created in database')
        return Response(response_monthly_summary, status=status.HTTP_200_OK)


def get_crime_counts(lat, lng):
    url = f"https://data.police.uk/api/crimes-street/all-crime?lat={lat}&lng={lng}"
    current_date = datetime.datetime.now()
    months_list = [current_date - relativedelta(months=i) for i in range(2, 15)]
    months_list = [date.strftime("%Y-%m") for date in months_list]

    crime_data = {}

    try:
        for month in months_list:
            url_with_date = f"{url}&date={month}"
            response = requests.get(url_with_date)
            if response.status_code == 200:
                crime_data[month] = {}
                crime_data[month]['categories'] = []
                monthly_data = response.json()
                category_count = {}
                for item in monthly_data:
                    if item["month"] == month:
                        category_count[item["category"]] = (
                            category_count.get(item["category"], 0) + 1
                        )
                for category, count in category_count.items():
                    crime_data[month]["categories"].append(
                        {"category": category, "count": count}
                    )
            else:
                print(f"Error fetching data for {month}: {response.status_code}")
    except Exception as e:
        print(f"Error during processing: {e}")

    return crime_data
