from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from Accounts.serializers import UserSerializer
from rest_framework import status
from django.contrib.auth import authenticate,login
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from . import customPermissions
from Accounts.customPermissions import AnyOfPermissions
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
@permission_classes([AnyOfPermissions(customPermissions.CanAddUser,IsAdminUser)])
def AddNewUser(request):
    try:
        data = request.data
        print("data .:---")
        print(data)
        print(len(data))
        if len(data) == 0:
            return Response({"message": "You are Authorized"}, status=status.HTTP_200_OK)
        print(data)
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "New User created successfully!", "data": serializer.data},
                status=201
            )
        else:
            errors = serializer.errors.copy()
            print("errors :---")
            print(errors)
            return Response(
                {"message": "New User creation failed!", "errors": errors},
                status=400
            )
    except Exception as e:
        print("E :---")
        print(e)
        return Response({"message": "New User creation failed!", "error": str(e)}, status=400)


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
    print(request.data)
    try:
        user = request.user
        print("user permissions:---- ")
        print(user)
        # print(user.first_name)
        # print(user.last_name)
        # print(UserSerializer(user))
        return Response({"user": UserSerializer(user).data}, status=status.HTTP_200_OK)

    except:
        return Response({"User":"invalid user data"},status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([AnyOfPermissions(IsAuthenticated,customPermissions.CanEditUser)])
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
@permission_classes([AnyOfPermissions( customPermissions.CanViewUser,customPermissions.CanEditUser, IsAdminUser)])
def filterUser(request):
    queryset = User.objects.all().order_by("id")

    # Apply filters manually
    filterset = UserFilters(request.GET, queryset=queryset)
    if not filterset.is_valid():
        return Response(filterset.errors, status=status.HTTP_400_BAD_REQUEST)

    queryset = filterset.qs
    serializer = UserSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

from django.db.models import Q

@api_view(['GET'])
@permission_classes([AnyOfPermissions(customPermissions.CanViewUser, IsAdminUser,customPermissions.CanEditUser)])
def filterUserQ(request):
    """
    Search users by any field (username, email, first name, last name).
    Example: /api/filter-users/?q=sayan
    """
    try:
        q = request.GET.get("q", "").strip()
        queryset = User.objects.all().order_by("id")

        if q:
            queryset = queryset.filter(
                Q(username__icontains=q) |
                Q(email__icontains=q) |
                Q(first_name__icontains=q) |
                Q(last_name__icontains=q)
            )

        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"message": "Something went wrong", "error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def myRoles(request):
    user_data = request.user
    user = User.objects.get(email = user_data.email)
    if not user:
        return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)
    role = user.groups.values_list('name', flat=True)
    print(role)
    return Response({"roles": list(role)}, status=status.HTTP_200_OK)


