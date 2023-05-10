from rest_framework import serializers
from .models import Deck, Card

class DeckSerializer(serializers.ModelSerializer):

    class Meta:
        model = Deck
        fields = ('name', 'pk', 'description', 'coverJSON', 'coverSVG')

class CardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Card
        fields = ('title', 'pk', 'deck', 'frontJSON', 'frontSVG', 'backJSON', 'backSVG')
