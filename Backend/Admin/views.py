from django.shortcuts import render
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User,Group
from Accounts.serializers import UserSerializer
from Accounts.models import Roles
# Create your views here.


@api_view(['GET'])
@permission_classes([IsAdminUser])
def whoAmI(request):
    user = request.user
    print(f"whoAmI called by user: {user}")
    if user.is_authenticated:
        return Response({"username": user.username, "email": user.email}, status=status.HTTP_200_OK)
    return Response({"message": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def assign_role(request):
    print(f"hello Admin :- {request.user}")
    # assign role of the user whose email
    try:
        emailOftheEmployee = request.data.get("email")
        roleToAssign = request.data.get("role")

        print(f"Assigning role '{roleToAssign}' to user with email: {emailOftheEmployee}")

        user = User.objects.filter(email=emailOftheEmployee).first()
        
        if user:
            group, created  = Group.objects.get_or_create(name=roleToAssign)
            user.groups.add(group)
            return Response({"message": "Role assigned successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error occurred: {e}")
        return Response({"message": "An error occurred while assigning role."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def addNewRole(request):
    try:
        print(request.data)
        role_name  = request.data.get('role', "").strip()
        print(f"Add New role '{role_name}'")
        if not role_name:
            return Response({"error": "Role name is required."}, status=status.HTTP_400_BAD_REQUEST)       
        group, created = Group.objects.get_or_create(name=role_name)
        if created:
            return Response({"message": f"Role '{role_name}' created successfully."},status=status.HTTP_201_CREATED)
        else:
            return Response({"message": f"Role '{role_name}' already exists."},status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error occurred: {e}")
        return Response({"message": "An error occurred while adding role."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAllUserList(request):
    user_data = []
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    for u in serializer.data:
        user_data.append(u)
    return Response(user_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAllRoleList(request):
    role_data = []
    roles = Group.objects.all()
    for role in roles:
        role_data.append({"name": role.name})
    return Response(role_data, status=status.HTTP_200_OK)

from django.contrib.auth.models import Permission
@api_view(['POST'])
@permission_classes([IsAdminUser])
def assign_permissions(request): ## {"email":"sayanbasani1@gmail.com","permissions":["can_edit_room"]}
    print(f"hello Admin :- {request.user}")
    # assign role of the user whose email
    try:
        emailOftheEmployee = request.data.get("email")
        permissionsToAssign = request.data.get("permissions", [])

        print(f"Assigning permissions '{permissionsToAssign}' to user with email: {emailOftheEmployee}")

        user = User.objects.filter(email=emailOftheEmployee).first()

        if not user:
            return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)
        
        for perm in permissionsToAssign:
            permission = Permission.objects.get(codename=perm)
            if permission:
                user.user_permissions.add(permission)
        return Response({"message": "Permissions assigned successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error occurred: {e}")
        return Response({"message": "An error occurred while assigning permissions."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

