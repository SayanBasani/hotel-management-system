from django.db import models
from Rooms.models import Room  # assuming you already have the Room model
from django.contrib.auth.models import User

class Booking(models.Model):
    # room_number = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="bookings")
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="bookings")
    booked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField()
    user_phone = models.CharField(max_length=20)
    number_of_guests = models.PositiveIntegerField()
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    id_proof_type = models.CharField(max_length=50, blank=True, null=True)
    id_proof_number = models.CharField(max_length=50, blank=True, null=True)
    special_requests = models.TextField(blank=True, null=True)
    additional_guests = models.JSONField(blank=True, null=True, default=list)
    status = models.CharField(
        max_length=20,
        choices=[("booked", "Booked"), ("checked_in", "Checked In"), ("checked_out", "Checked Out")],
        default="booked"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking for Room {self.room.room_number} by {self.user_name}"
