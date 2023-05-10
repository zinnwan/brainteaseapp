from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Deck, Card
from .serializers import *

@api_view(['GET', 'POST'])
def decks(request):
    if request.method == 'GET':
        decks = Deck.objects.all()

        serializer = DeckSerializer(decks, context={'request': request}, 
                                    many=True)
        
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = DeckSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def cards(request, deck_pk):
    try:
        deck = Deck.objects.get(id=deck_pk)
    except Deck.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        cards = deck.card_set.all()

        serializer = CardSerializer(cards, context={'request': request}, 
                                    many= True)
        
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE', 'PUT'])
def delete_deck(request, deck_pk):
    try:
        deck = Deck.objects.get(id=deck_pk)
    except Deck.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        deck.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        serializer = DeckSerializer(deck, data=request.data,
                                     context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_202_ACCEPTED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE', 'PUT'])
def delete_card(request, card_pk):
    try:
        card = Card.objects.get(id=card_pk)
    except Card.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        card.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        serializer = CardSerializer(card, data=request.data,
                                     context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_202_ACCEPTED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)