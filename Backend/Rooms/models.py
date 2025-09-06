from django.db import models
# Create your models here.

class Room(models.Model):
    room_number = models.CharField(max_length=100,unique=True)
    room_capacity = models.IntegerField()
    floor = models.IntegerField()
    status = models.IntegerField()
    price_per_night = models.IntegerField()
    features = models.JSONField()
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.room_number
    
# demo input

# True have to be true
# False have to be false
{
  "room_number": "101A",
  "room_capacity": 2,
  "floor": 1,
  "status": 1,
  "price_per_night": 120,
  "features": {
    "bed": "Queen",
    "ac": True,
    "tv": True,
    "wifi": True,
    "balcony": False,
    "bathroom": {
      "type": "Attached",
      "amenities": ["Shower", "Hairdryer", "Towels"]
    }
  },
  "location": "North Wing"
}
