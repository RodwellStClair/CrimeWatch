from django.contrib.gis.db import models
from django.utils import timezone
from django.db.models import JSONField

class Coordinates(models.Model):
    user_location = models.PointField()  # Stores latitude and longitude

    def __str__(self):
        return f"Coordinates: {self.user_location.y}, {self.user_location.x}"  # latitude, longitude

class Report(models.Model):
    primaryid = models.BigAutoField(primary_key=True)
    category = models.CharField(max_length=100)
    location_type = models.CharField(max_length=100)
    location = models.ForeignKey(
        Coordinates, on_delete=models.CASCADE, related_name="reports"
    )
    latitude = models.FloatField()
    longitude = models.FloatField()
    street = models.CharField(max_length=100, blank=True)
    context = models.TextField(blank=True)
    outcome_status = models.CharField(max_length=200, blank=True, null=True)
    persistent_id = models.CharField(max_length=100, blank=True)
    report_id = models.BigIntegerField(null=True, blank=True)
    location_subtype = models.CharField(max_length=100, blank=True)
    month = models.CharField(max_length=7)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.category} at {self.location.user_location} Created at {self.created_at} Updated at {self.updated_at}"

    def to_dict(self):
        return {
            "primaryid": self.primaryid,
            "category": self.category,
            "location_type": self.location_type,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "street": self.street,
            "context": self.context,
            "outcome_status": self.outcome_status,
            "persistent_id": self.persistent_id,
            "report_id": self.report_id,
            "location_subtype": self.location_subtype,
            "month": self.month,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

class MonthlyCrimeSummary(models.Model):
    month = models.CharField(max_length=7)
    crime_data = (
        JSONField()
    )
    location = models.ForeignKey(
        Coordinates, on_delete=models.CASCADE, related_name="monthly_summaries"
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("month", "location")

    def __str__(self):
        return f"{self.month} - Crime Summary at {self.location.name}"

    def to_dict(self):
        return {
            "month": self.month,
            "crime_data": self.crime_data,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
