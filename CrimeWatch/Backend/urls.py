from django.urls import path
from . import views

urlpatterns = [
    path("reports/<str:lat>&<str:lng>", views.get_crime_reports_per_coordinate, name="get_crime_reports_per_coordinate"),
    path(
        "monthly-summary/<str:lat>&<str:lng>", views.get_monthly_crime_summary, name="get_monthly_crime_summary"
    ),
]
