from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .models import Booking
from .serializers import BookingSerializer
from . import permissions
from Accounts.customPermissions import AnyOfPermissions
from Rooms.models import Room

def whoAmI(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated, permissions.CanAddBooking])
def create_booking(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        booking = serializer.save(booked_by=request.user)
        return Response(
            {"message": "Room booked successfully!", "data": BookingSerializer(booking).data},
            status=status.HTTP_201_CREATED
        )
    print("Serializer Errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AnyOfPermissions(IsAdminUser, permissions.CanViewBooking)])
def list_bookings_(request):
    # print("request.data ----", request.data)
    # print(request.data)
    start_date = request.data['start_date']
    end_date = request.data['end_date']
    bookings = Booking.objects.all().order_by('-created_at')
    serializer = BookingSerializer(bookings, many=True)
    # print("List Bookings Data:", serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AnyOfPermissions(IsAuthenticated,permissions.CanViewBooking)])  # or your custom permission
def list_bookings(request):
    try:
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        # Start with all bookings
        bookings = Booking.objects.all().order_by('-created_at')

        # Apply filters based on date range
        if start_date and end_date:
            bookings = bookings.filter(
                check_in_date__lte=end_date,
                check_out_date__gte=start_date
            )
        elif start_date:
            bookings = bookings.filter(check_out_date__gte=start_date)
        elif end_date:
            bookings = bookings.filter(check_in_date__lte=end_date)

        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print("Error fetching bookings:", e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, permissions.CanEditBooking])
def update_booking(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = BookingSerializer(booking, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Booking updated successfully", "data": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, permissions.CanDeleteBooking])
def delete_booking(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
        booking.delete()
        return Response({"message": "Booking deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
