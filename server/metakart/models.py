from django.db import models
from django_enumfield import enum


class Platform(enum.Enum):
    Unknown = 0
    Windows = 1
    Mac = 2
    Linux = 3


class Source(enum.Enum):
    Unknown = 0
    Itchio = 1
    GloriousTrainwrecks = 2
    GameJolt = 3


class Game(models.Model):
    title = models.CharField(max_length=256)
    description = models.CharField(max_length=256)
    view_url = models.CharField(max_length=256)
    source = enum.EnumField(Source, default=Source.Unknown)
    pub_date = models.DateTimeField('date published')


class DownloadLink(models.Model):
    game = models.ForeignKey(Game)
    url = models.CharField(max_length=256)
    platform = enum.EnumField(Platform, default=Platform.Unknown)


class GameImage(models.Model):
    game = models.ForeignKey(Game)
    url = models.CharField(max_length=256)
