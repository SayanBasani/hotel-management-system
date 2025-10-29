from rest_framework import serializers
from .models import Booking
from Rooms.models import Room

class BookingSerializer(serializers.ModelSerializer):
    room_number = serializers.CharField(write_only=True)  # frontend sends room number
    room = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'room', 'room_number', 'user_name', 'user_email', 'user_phone',
            'number_of_guests', 'check_in_date', 'check_out_date',
            'id_proof_type', 'id_proof_number', 'special_requests',
            'additional_guests', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'room']

    def create(self, validated_data):
        room_number = validated_data.pop('room_number', None)
        try:
            room = Room.objects.get(room_number=room_number)
        except Room.DoesNotExist:
            raise serializers.ValidationError({"room_number": "Invalid room number"})

        booking = Booking.objects.create(room=room, **validated_data)
        return booking


