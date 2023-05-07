from django.urls import path
from notime import views

urlpatterns = [
    path('', views.menu_action, name='menu'),
    path('login', views.login_action, name='login'),
    path('logout', views.logout_action, name='logout'),
    path('register', views.register_action, name='register'),
    path('laprima', views.laprima_action, name='laprima'),
    path('get-num', views.get_num_action, name='get-num'),
]