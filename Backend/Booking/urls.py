from django.urls import path
from . import views

urlpatterns = [
    path('whoami/', views.whoAmI, name='whoami'),
]