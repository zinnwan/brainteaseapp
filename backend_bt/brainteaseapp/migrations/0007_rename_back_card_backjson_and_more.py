# Generated by Django 4.2 on 2023-04-09 23:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('brainteaseapp', '0006_card'),
    ]

    operations = [
        migrations.RenameField(
            model_name='card',
            old_name='back',
            new_name='backJSON',
        ),
        migrations.RenameField(
            model_name='card',
            old_name='front',
            new_name='frontJSON',
        ),
        migrations.RenameField(
            model_name='deck',
            old_name='cover',
            new_name='coverJSON',
        ),
        migrations.AddField(
            model_name='card',
            name='backSVG',
            field=models.TextField(default=str),
        ),
        migrations.AddField(
            model_name='card',
            name='frontSVG',
            field=models.TextField(default=str),
        ),
        migrations.AddField(
            model_name='deck',
            name='converSVG',
            field=models.TextField(default=str),
        ),
    ]
