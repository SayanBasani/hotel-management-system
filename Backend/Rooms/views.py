from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User,Group
from .serializers import RoomSerializer
from .models import Room
from . import customePermissions 
from Accounts.customPermissions import AnyOfPermissions 
# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def whoAmI(request):
    user = request.user
    print(f"whoAmI called by user: {user}")
    if user.is_authenticated:
        return Response({"username": user.username, "email": user.email}, status=status.HTTP_200_OK)
    return Response({"message": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AnyOfPermissions(customePermissions.CanAddRoom, IsAdminUser)])  # Only Manager and Admin Can Add Rooms
def addNewRoom(request):
    try:
        user = request.user
        # if not (user.groups.filter(name__in=["Manager","Admin"]).exists() or user.is_superuser):
        #     print(f"I am Not Authorized For Add Rooms: {user}")
        #     return Response({"error": "You are not authorized to add a room."},status=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        print(data)
        print(len(data))
        if len(data) == 0 :
            return Response({"message":"You Autorize to Add Room"},status=status.HTTP_200_OK)
        print("room number :- "+data.get("room_number", ""))
        # if existing_room:
        room_number=request.data.get("room_number", "")
        if Room.objects.filter(room_number=room_number).exists():
            existing_room = Room.objects.filter(room_number=data.get("room_number", "")).first()
            print(f"Room with room number {room_number} already exists.")
            return Response({"error": "Room with this room number already exists.","room_number": data.get("room_number", "")}, status=status.HTTP_400_BAD_REQUEST)
        serializer = RoomSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Room added successfully","room_number": data.get("room_number", "")}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Error occurred: {e}")
        return Response({"error": "Failed to add room"}, status=status.HTTP_400_BAD_REQUEST)

# Example of Room Data
# { "room_number": "101A", "room_capacity": 2, "floor": 1, "status": 1, "price_per_night": 120, "features": {   "bed": "Queen",   "ac": true,   "tv": true,   "wifi": true,   "balcony": false,   "bathroom": {     "type": "Attached",     "amenities": ["Shower", "Hairdryer", "Towels"]   } }, "location": "North Wing"}

@api_view(['POST','DELETE',"GET"])
@permission_classes([IsAuthenticated, customePermissions.CanDeleteRoom]) # Only Mannager and Admin Can Delete Rooms
def deleteRoom(request, room_id = None):
    try:
        user = request.user
        if not (user.groups.filter(name__in=["Manager","Admin"]).exists() or user.is_superuser):
            print(f"I am Not Authorized For Delete Rooms: {user}")
            return Response({"error": "You are not authorized to delete a room."},status=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        print("Delete Room Data:")
        print(data)
        # room_id = room_id if room_id is not None else data.get("room_id")
        print(f"Initial Room ID: {room_id}")
        room_id = data.get("room_id", room_id) or room_id
        print(f"Room ID to delete: {room_id}")
        # if room_id is None:

        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

        room.delete()
        return Response({"message": "Room deleted successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error occurred: {e}")
        return Response({"error": "Failed to delete room"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([AnyOfPermissions(customePermissions.CanViewRoom ,IsAdminUser)])
def getRoomsDetails(request): # Get Room Details
    try:
        user = request.user
        if not (user.groups.filter(name__in=["Manager","Admin"]).exists() or user.is_superuser):
            print(f"I am Not Manager: {user}")
            return Response({"error": "You are not authorized to view room details."},status=status.HTTP_403_FORBIDDEN)

        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error occurred: {e}")
        return Response({"error": "Failed to retrieve room details"}, status=status.HTTP_400_BAD_REQUEST)

# this for finding the rooms with filters
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from .filters import RoomFilter

@api_view(['GET'])
@permission_classes([AnyOfPermissions(customePermissions.CanViewRoom, IsAdminUser)])
def filterRoom(request):
    queryset = Room.objects.all().order_by("id")

    # Apply filters manually
    filterset = RoomFilter(request.GET, queryset=queryset)
    if not filterset.is_valid():
        return Response(filterset.errors, status=status.HTTP_400_BAD_REQUEST)

    queryset = filterset.qs
    serializer = RoomSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AnyOfPermissions(customePermissions.CanEditRoom, IsAdminUser)])  # Only Manager and Admin Can Edit Rooms
def EditRoom(request):
    try:
        data = request.data
        room_id = data.get("room_id")
        print(room_id)
        # Check if room_id is provided
        if not room_id:
            return Response({"error": "Room ID is required to edit a room."}, status=status.HTTP_400_BAD_REQUEST)
        room = Room.objects.filter(room_number=room_id).first()
        
        if not room:
            return Response({"error": "Room not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = RoomSerializer(room, data=data, partial=True) # partial=True to allow partial updates
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Room updated successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error occurred: {e}")
        return Response({"error": "Failed to edit room"}, status=status.HTTP_400_BAD_REQUEST)


