from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Booking
# from .serializers import BookingSerializer

def whoAmI(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }, status=status.HTTP_200_OK)
