from django.urls import path
from . import views

urlpatterns = [
    path('whoami/', views.whoAmI , name="whoami"),
    path('add-room/', views.addNewRoom , name="addNewRoom"),
    path('rooms/', views.getRoomsDetails , name="getRoomsDetails"),
    path('list/', views.filterRoom, name="room-list"), # Search the name and value like /list/?room_number=101A for ac :- list/?ac=True
    path('delete/<int:room_id>/', views.deleteRoom, name='deleteRoom'),
    path('delete/', views.deleteRoom, name='deleteRoom'),
    path('edit/', views.EditRoom, name='editRoom'),
]