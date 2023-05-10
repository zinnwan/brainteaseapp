"""
URL configuration for brainteaseproj project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from brainteaseapp import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/braintease/c_r_deck', views.decks, name='decks'),
    path('api/braintease/c_r_card/<int:deck_pk>', views.cards, name='cards'),
    path('api/braintease/u_d_deck/<int:deck_pk>', views.delete_deck, name='u_d_deck'),
    path('api/braintease/u_d_card/<int:card_pk>', views.delete_card, name='u_d_card')
]
