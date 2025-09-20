from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from Accounts.serializers import UserSerializer
from rest_framework import status
from django.contrib.auth import authenticate,login
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    try:
        data = request.data
        print(data)
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User signed up successfully!", "data": serializer.data},
                status=201
            )
        else:
            errors = serializer.errors.copy()
            print("errors :---")
            print(errors)
            return Response(
                {"message": "User signup failed!", "errors": errors},
                status=400
            )
    except Exception as e:
        print("E :---")
        print(e)
        return Response({"message": "User signup failed!", "error": str(e)}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    try:
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"message": "Email and password are required"}, status=400)
        
        user = authenticate(request,username=email,password=password)
        if user is None:
            return Response({"message": "Invalid email or password"}, status=400)
        print(user)
        login(request,user)
        return Response({"message":"Sucessfully Logined!"},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": "User login failed!", "error": str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    print("user :---- ")
    print(user)
    return Response({"user": UserSerializer(user).data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def myAllPermissions(request):
    user = request.user
    permissions = user.get_all_permissions()
    return Response({"permissions": list(permissions)}, status=status.HTTP_200_OK)

@api_view(['POST','GET'])
@permission_classes([IsAuthenticated])
def deleteAccount(request):
    try:
        user = request.user
        user.delete()
        return Response({"message": "User account deleted successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": "User account deletion failed!", "error": str(e)}, status=400)

from . import customPermissions

@api_view(['POST'])
@permission_classes([IsAuthenticated,customPermissions.CanDeleteUser])
def deleteUserAccount(request):
    try:
        data = request.data
        email = data.get("email")
        if not email:
            return Response({"message": "Email is required"}, status=400)
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"message": "User not found"}, status=404)
        user.delete()
        return Response({"message": "User account deleted successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"message": "User account deletion failed!", "error": str(e)}, status=400)

from Accounts.filters import UserFilters as UserFilters
from django_filters.rest_framework import DjangoFilterBackend


@api_view(['GET'])
@permission_classes([IsAuthenticated, customPermissions.CanViewUser])
def filterUser(request):
    queryset = User.objects.all().order_by("id")

    # Apply filters manually
    filterset = UserFilters(request.GET, queryset=queryset)
    if not filterset.is_valid():
        return Response(filterset.errors, status=status.HTTP_400_BAD_REQUEST)

    queryset = filterset.qs
    serializer = UserSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

