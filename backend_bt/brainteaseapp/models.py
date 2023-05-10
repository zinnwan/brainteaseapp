from django.db import models

class Deck(models.Model):
    name = models.CharField('Name', max_length=500)
    description = models.TextField('Description')
    coverJSON = models.JSONField(default=dict)
    coverSVG = models.TextField(default=str)

    def __str__(self):
        return self.name

class Card(models.Model):
    title = models.CharField('Name', max_length=500)
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    frontJSON = models.JSONField(default=dict)
    frontSVG = models.TextField(default=str)
    backJSON = models.JSONField(default=dict)
    backSVG = models.TextField(default=str)

    def __str__(self):
        return self.title