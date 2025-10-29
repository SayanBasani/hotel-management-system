from django.urls import path
from . import views

urlpatterns = [
    path('whoami/', views.whoAmI, name='whoami'),
    path('create/', views.create_booking, name='create-booking'),
    path('list/', views.list_bookings, name='list-bookings'),
    path('update/<int:pk>/', views.update_booking, name='update-booking'),
    path('delete/<int:pk>/', views.delete_booking, name='delete-booking'),
]