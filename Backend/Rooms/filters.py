from .models import Room
import django_filters

class RoomFilter(django_filters.FilterSet):
    id = django_filters.NumberFilter()
    room_number = django_filters.CharFilter(max_length=100)
    room_capacity = django_filters.NumberFilter()
    floor = django_filters.NumberFilter()
    status = django_filters.ChoiceFilter()
    price_per_night = django_filters.NumberFilter()
    features = django_filters.CharFilter()
    location = django_filters.CharFilter()

    # ✅ JSONField filters
    ac = django_filters.BooleanFilter(field_name="features__ac")
    tv = django_filters.BooleanFilter(field_name="features__tv")
    wifi = django_filters.BooleanFilter(field_name="features__wifi")
    bed_type = django_filters.CharFilter(field_name="features__bed_type", lookup_expr="icontains")
    view = django_filters.CharFilter(field_name="features__view", lookup_expr="icontains")

    class Meta:
        model = Room
        fields = ["id", "room_number", "room_capacity", "floor", "status", "price_per_night","location", "ac", "tv", "wifi", "bed_type", "view",]
